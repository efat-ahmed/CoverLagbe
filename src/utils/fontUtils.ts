/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Font Utilities for CoverLagbe?
 * Ensures font loading readiness and compiles base64-embedded @font-face CSS
 * so that SVG <foreignObject> rasterization in html-to-image receives exact
 * typographic glyphs without fallback font substitutions.
 */

const GOOGLE_FONTS_CSS_URL =
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=JetBrains+Mono:wght@500;600&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';

let cachedFontEmbedCSS: string | null = null;
let fontFetchPromise: Promise<string> | null = null;

/**
 * Ensures all document fonts are ready and loaded in the main browser document.
 */
export async function waitForDocumentFonts(): Promise<void> {
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await document.fonts.ready;
    } catch (e) {
      console.warn('document.fonts.ready check encountered an issue:', e);
    }
  }
}

/**
 * Fetches Google Fonts stylesheet and converts latin woff2 font files
 * to base64 data URLs for embedding directly into SVG <foreignObject>.
 * Caches the compiled CSS in memory for instantaneous subsequent exports.
 */
export async function getEmbeddedFontCSS(timeoutMs = 4000): Promise<string> {
  if (cachedFontEmbedCSS) {
    return cachedFontEmbedCSS;
  }

  if (fontFetchPromise) {
    return fontFetchPromise;
  }

  const fetchTask = async (): Promise<string> => {
    try {
      // 1. Fetch Google Fonts CSS
      const cssResponse = await fetch(GOOGLE_FONTS_CSS_URL);
      if (!cssResponse.ok) {
        throw new Error(`Failed to fetch font CSS: ${cssResponse.statusText}`);
      }
      const cssText = await cssResponse.text();

      // 2. Parse latin font-face blocks
      const latinBlocks = cssText
        .split('/* latin */')
        .slice(1)
        .map((block) => {
          const ruleContent = block.split('}')[0];
          return `@font-face { ${ruleContent.trim()} }`;
        });

      if (latinBlocks.length === 0) {
        cachedFontEmbedCSS = cssText;
        return cssText;
      }

      // 3. Extract unique font URLs and fetch each woff2 as base64
      const fontUrlMap = new Map<string, string>();
      const urlRegex = /url\((https:[^)]+\.woff2)\)/g;

      const urlsToFetch = new Set<string>();
      for (const rule of latinBlocks) {
        let match;
        while ((match = urlRegex.exec(rule)) !== null) {
          urlsToFetch.add(match[1]);
        }
      }

      // Fetch all unique latin woff2 fonts in parallel
      await Promise.all(
        Array.from(urlsToFetch).map(async (url) => {
          try {
            const fontRes = await fetch(url);
            if (!fontRes.ok) return;
            const blob = await fontRes.blob();
            const base64Data = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
            fontUrlMap.set(url, base64Data);
          } catch (err) {
            console.warn(`Could not base64 encode font: ${url}`, err);
          }
        })
      );

      // 4. Replace font URLs with base64 data URLs in each rule
      const embeddedRules = latinBlocks.map((rule) => {
        return rule.replace(/url\((https:[^)]+\.woff2)\)/g, (fullMatch, fontUrl) => {
          const dataUrl = fontUrlMap.get(fontUrl);
          return dataUrl ? `url("${dataUrl}")` : fullMatch;
        });
      });

      cachedFontEmbedCSS = embeddedRules.join('\n\n');
      return cachedFontEmbedCSS;
    } catch (error) {
      console.warn('Failed to compile embedded fonts CSS, falling back gracefully:', error);
      return '';
    }
  };

  // Run with safety timeout so slow networks do not freeze export
  const timeoutPromise = new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve(cachedFontEmbedCSS || '');
    }, timeoutMs);
  });

  fontFetchPromise = Promise.race([fetchTask(), timeoutPromise]);
  return fontFetchPromise;
}

/**
 * Start warming the font cache in the background on application load.
 */
export function preloadFontEmbedCSS(): void {
  if (typeof window !== 'undefined') {
    getEmbeddedFontCSS().catch(() => {});
  }
}

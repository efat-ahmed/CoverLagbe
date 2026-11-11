/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Font Utilities for CoverLagbe?
 * Ensures font loading readiness and compiles base64-embedded @font-face CSS
 * from self-hosted local woff2 files (/fonts/*.woff2) so that SVG <foreignObject>
 * rasterization in html-to-image receives exact typographic glyphs without
 * network timeout races or fallback font substitutions.
 */

export interface LocalFontSpec {
  family: string;
  style: 'normal' | 'italic';
  weight: string;
  file: string;
}

export const LOCAL_FONTS: LocalFontSpec[] = [
  { family: 'Cinzel', style: 'normal', weight: '600', file: 'cinzel-normal-600.woff2' },
  { family: 'Cinzel', style: 'normal', weight: '700', file: 'cinzel-normal-700.woff2' },
  { family: 'JetBrains Mono', style: 'normal', weight: '500', file: 'jetbrains-mono-normal-500.woff2' },
  { family: 'JetBrains Mono', style: 'normal', weight: '600', file: 'jetbrains-mono-normal-600.woff2' },
  { family: 'Merriweather', style: 'normal', weight: '400', file: 'merriweather-normal-400.woff2' },
  { family: 'Merriweather', style: 'normal', weight: '700', file: 'merriweather-normal-700.woff2' },
  { family: 'Merriweather', style: 'italic', weight: '400', file: 'merriweather-italic-400.woff2' },
  { family: 'Playfair Display', style: 'normal', weight: '600', file: 'playfair-display-normal-600.woff2' },
  { family: 'Playfair Display', style: 'normal', weight: '700', file: 'playfair-display-normal-700.woff2' },
  { family: 'Playfair Display', style: 'italic', weight: '600', file: 'playfair-display-italic-600.woff2' },
  { family: 'Plus Jakarta Sans', style: 'normal', weight: '400', file: 'plus-jakarta-sans-normal-400.woff2' },
  { family: 'Plus Jakarta Sans', style: 'normal', weight: '500', file: 'plus-jakarta-sans-normal-500.woff2' },
  { family: 'Plus Jakarta Sans', style: 'normal', weight: '600', file: 'plus-jakarta-sans-normal-600.woff2' },
  { family: 'Plus Jakarta Sans', style: 'normal', weight: '700', file: 'plus-jakarta-sans-normal-700.woff2' },
  { family: 'Plus Jakarta Sans', style: 'normal', weight: '800', file: 'plus-jakarta-sans-normal-800.woff2' },
];

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
 * Converts local woff2 font files to base64 data URLs for embedding directly into SVG <foreignObject>.
 * Caches the compiled CSS in memory for instantaneous subsequent exports.
 * If fetch fails or times out, resets promise so subsequent exports can retry.
 */
export async function getEmbeddedFontCSS(timeoutMs = 5000): Promise<string> {
  if (cachedFontEmbedCSS) {
    return cachedFontEmbedCSS;
  }

  if (fontFetchPromise) {
    return fontFetchPromise;
  }

  const buildTask = async (): Promise<string> => {
    try {
      const fontRules = await Promise.all(
        LOCAL_FONTS.map(async (f) => {
          const fontUrl = `/fonts/${f.file}`;
          const res = await fetch(fontUrl);
          if (!res.ok) {
            throw new Error(`Failed to load local font ${f.file}: ${res.statusText}`);
          }
          const blob = await res.blob();
          const base64Data = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });

          return `@font-face {\n  font-family: '${f.family}';\n  font-style: ${f.style};\n  font-weight: ${f.weight};\n  src: url("${base64Data}") format('woff2');\n}`;
        })
      );

      const compiledCSS = fontRules.join('\n\n');
      cachedFontEmbedCSS = compiledCSS;
      return compiledCSS;
    } catch (error) {
      console.warn('Failed to compile embedded fonts CSS, will retry on next export:', error);
      // Reset fontFetchPromise so subsequent export can retry instead of being stuck with empty string
      fontFetchPromise = null;
      return '';
    }
  };

  const timeoutPromise = new Promise<string>((resolve) => {
    setTimeout(() => {
      // Timeout reached: do not permanently cache empty string
      fontFetchPromise = null;
      resolve('');
    }, timeoutMs);
  });

  fontFetchPromise = Promise.race([buildTask(), timeoutPromise]).then((res) => {
    if (!res) {
      // Reset if resolved to empty string so next export can retry
      fontFetchPromise = null;
    }
    return res;
  });

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

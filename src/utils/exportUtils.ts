/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CoverPageData } from '../types/coverPage';
import { waitForDocumentFonts, getEmbeddedFontCSS } from './fontUtils';

export interface ExportProgress {
  status: 'idle' | 'preparing' | 'rendering' | 'saving' | 'success' | 'error';
  message: string;
  error?: string;
  warning?: string;
}

// Exact A4 Dimensions at 96 DPI baseline
export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;

export function generateFilename(data: CoverPageData, extension: 'pdf' | 'jpg'): string {
  const code = (data.courseCode || '').trim().replace(/[^a-zA-Z0-9_-]/g, '');
  const num = (data.assignmentNumber || '').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const sem = (data.semester || '').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const rawTitle = (data.assignmentTitle || 'Assignment').trim();
  const slugTitle = rawTitle
    .slice(0, 30)
    .replace(/[^a-zA-Z0-9\s_-]/g, '')
    .trim()
    .replace(/\s+/g, '_');

  const components = [code, num, sem, slugTitle].filter(Boolean);
  const base = components.join('_') || 'CoverLagbe_CoverPage';
  return `${base}.${extension}`;
}

export function isMobileOrConstrained(): boolean {
  if (typeof window === 'undefined') return false;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const navAny = navigator as unknown as { deviceMemory?: number };
  const isLowMemory = typeof navAny.deviceMemory === 'number' && navAny.deviceMemory < 4;
  return isIOS || isCoarse || isLowMemory;
}

export function isIOSDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export interface IsolatedExportContext {
  container: HTMLElement;
  exportNode: HTMLElement;
  cleanup: () => void;
}

/**
 * Creates an isolated, 1:1 unscaled container directly attached to document.body.
 * This completely isolates the export render target from:
 * 1. Parent CSS transforms (e.g. scale(zoomLevel) in PreviewPanel)
 * 2. Responsive mobile viewports or screen width restrictions
 * 3. Relative image URL resolution issues by converting all images to inline base64
 */
export async function createIsolatedExportElement(
  source: HTMLElement
): Promise<IsolatedExportContext> {
  // 1. Create an offscreen isolation container attached directly to document.body
  const container = document.createElement('div');
  container.id = 'cover-page-export-isolation-container';
  container.setAttribute('aria-hidden', 'true');
  Object.assign(container.style, {
    position: 'fixed',
    left: '-99999px',
    top: '0',
    width: `${A4_WIDTH_PX}px`,
    height: `${A4_HEIGHT_PX}px`,
    margin: '0',
    padding: '0',
    overflow: 'hidden',
    transform: 'none',
    zIndex: '-99999',
    opacity: '1',
    pointerEvents: 'none',
    background: '#FFFFFF',
    boxSizing: 'border-box',
  });

  // 2. Deep-clone the source node
  const clone = source.cloneNode(true) as HTMLElement;
  clone.id = 'cover-page-export-clone';
  Object.assign(clone.style, {
    transform: 'none',
    margin: '0',
    padding: '0',
    width: `${A4_WIDTH_PX}px`,
    height: `${A4_HEIGHT_PX}px`,
    minWidth: `${A4_WIDTH_PX}px`,
    minHeight: `${A4_HEIGHT_PX}px`,
    maxWidth: `${A4_WIDTH_PX}px`,
    maxHeight: `${A4_HEIGHT_PX}px`,
    boxSizing: 'border-box',
  });

  container.appendChild(clone);
  document.body.appendChild(container);

  // 3. In-line all images inside the clone so that foreignObject never makes external requests
  const images = Array.from(clone.querySelectorAll('img'));
  await Promise.all(
    images.map(async (img) => {
      if (!img.complete) {
        await new Promise((res) => {
          img.onload = res;
          img.onerror = res;
        });
      }

      if (img.src && !img.src.startsWith('data:')) {
        try {
          const res = await fetch(img.src);
          const blob = await res.blob();
          const reader = new FileReader();
          const dataUrl = await new Promise<string>((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          img.src = dataUrl;
        } catch (err) {
          console.warn('Could not in-line image to data URL:', img.src, err);
        }
      }
    })
  );

  // 4. Ensure web fonts are completely ready
  await waitForDocumentFonts();

  // 5. Allow microtask tick for DOM styles and layout to settle in unscaled context
  await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 60)));

  return {
    container,
    exportNode: clone,
    cleanup: () => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    },
  };
}

/**
 * Downloads live element as a high-resolution A4 JPG
 * Matches live preview pixel-perfectly without zoom/scaling or font distortion.
 */
export async function exportToJpg(
  element: HTMLElement,
  data: CoverPageData,
  onProgress?: (progress: ExportProgress) => void
): Promise<void> {
  onProgress?.({
    status: 'preparing',
    message: 'Preparing unscaled canvas and embedding university typography...',
  });

  let isolatedContext: IsolatedExportContext | null = null;

  try {
    // Dynamically import html-to-image to keep initial bundle size lean
    const [{ toJpeg }, context, fontEmbedCSS] = await Promise.all([
      import('html-to-image'),
      createIsolatedExportElement(element),
      getEmbeddedFontCSS(),
    ]);
    isolatedContext = context;

    onProgress?.({
      status: 'rendering',
      message: 'Rasterizing A4 cover page at high-resolution print quality...',
    });

    // Fallback retry sequence: on mobile/low-memory start at 2.0x to avoid memory crashes
    const fallbackRatios = isMobileOrConstrained()
      ? [2.0, 1.5, 1.25]
      : [3.125, 2.0, 1.5];

    let dataUrl: string | null = null;
    let chosenRatio = fallbackRatios[0];
    let lastError: unknown = null;

    for (const ratio of fallbackRatios) {
      try {
        const canvasWidth = Math.round(A4_WIDTH_PX * ratio);
        const canvasHeight = Math.round(A4_HEIGHT_PX * ratio);

        dataUrl = await toJpeg(context.exportNode, {
          quality: 0.98,
          pixelRatio: ratio,
          width: A4_WIDTH_PX,
          height: A4_HEIGHT_PX,
          canvasWidth,
          canvasHeight,
          backgroundColor: '#FFFFFF',
          cacheBust: true,
          fontEmbedCSS: fontEmbedCSS || undefined,
          style: {
            transform: 'none',
            margin: '0',
            padding: '0',
            width: `${A4_WIDTH_PX}px`,
            height: `${A4_HEIGHT_PX}px`,
          },
        });
        chosenRatio = ratio;
        break;
      } catch (err) {
        lastError = err;
        console.warn(`JPG render at pixelRatio ${ratio} encountered memory error, trying fallback...`, err);
      }
    }

    if (!dataUrl) {
      throw lastError || new Error('Failed to render JPG at all quality levels');
    }

    onProgress?.({
      status: 'saving',
      message: 'Saving high-resolution JPG file...',
    });

    const filename = generateFilename(data, 'jpg');

    // Convert data URL to Blob for reliable iOS Safari saving & Web Share API
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const file = new File([blob], filename, { type: 'image/jpeg' });

    let shared = false;
    if (
      typeof navigator !== 'undefined' &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({
          files: [file],
          title: filename,
        });
        shared = true;
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.warn('Web Share API failed, falling back to download link:', err);
        } else {
          // User intentionally cancelled share dialog
          onProgress?.({
            status: 'success',
            message: `Export ready for "${filename}".`,
          });
          return;
        }
      }
    }

    if (!shared) {
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (link.parentNode) link.parentNode.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 2000);
    }

    const qualityLabel =
      chosenRatio === 3.125
        ? '300 DPI Ultra-High'
        : chosenRatio === 2.0
        ? 'High (2.0x)'
        : chosenRatio === 1.5
        ? 'Standard (1.5x fallback)'
        : 'Compact (1.25x fallback)';

    onProgress?.({
      status: 'success',
      message: `Downloaded "${filename}" successfully! (${qualityLabel})`,
      warning: !fontEmbedCSS
        ? 'Fonts could not be embedded; system fallback fonts were used.'
        : undefined,
    });
  } catch (error) {
    console.error('Error exporting JPG:', error);
    const message = error instanceof Error ? error.message : 'Unknown rendering failure';
    onProgress?.({
      status: 'error',
      message: 'Failed to generate JPG image',
      error: message,
    });
    throw error;
  } finally {
    isolatedContext?.cleanup();
  }
}

/**
 * Downloads live element as a single-page print-ready A4 PDF (210 x 297 mm)
 * Matches live preview pixel-perfectly without zoom/scaling or font distortion.
 */
export async function exportToPdf(
  element: HTMLElement,
  data: CoverPageData,
  onProgress?: (progress: ExportProgress) => void
): Promise<void> {
  onProgress?.({
    status: 'preparing',
    message: 'Preparing unscaled A4 layout and institutional typography...',
  });

  let isolatedContext: IsolatedExportContext | null = null;

  try {
    // Dynamically import html-to-image and jspdf to keep initial load fast
    const [{ toPng }, { jsPDF }, context, fontEmbedCSS] = await Promise.all([
      import('html-to-image'),
      import('jspdf'),
      createIsolatedExportElement(element),
      getEmbeddedFontCSS(),
    ]);
    isolatedContext = context;

    onProgress?.({
      status: 'rendering',
      message: 'Generating vector-crisp A4 page for document export...',
    });

    // Fallback retry sequence for PDF rasterization
    const fallbackRatios = isMobileOrConstrained()
      ? [2.0, 1.5, 1.25]
      : [2.5, 2.0, 1.5];

    let dataUrl: string | null = null;
    let chosenRatio = fallbackRatios[0];
    let lastError: unknown = null;

    for (const ratio of fallbackRatios) {
      try {
        const canvasWidth = Math.round(A4_WIDTH_PX * ratio);
        const canvasHeight = Math.round(A4_HEIGHT_PX * ratio);

        dataUrl = await toPng(context.exportNode, {
          pixelRatio: ratio,
          width: A4_WIDTH_PX,
          height: A4_HEIGHT_PX,
          canvasWidth,
          canvasHeight,
          backgroundColor: '#FFFFFF',
          cacheBust: true,
          fontEmbedCSS: fontEmbedCSS || undefined,
          style: {
            transform: 'none',
            margin: '0',
            padding: '0',
            width: `${A4_WIDTH_PX}px`,
            height: `${A4_HEIGHT_PX}px`,
          },
        });
        chosenRatio = ratio;
        break;
      } catch (err) {
        lastError = err;
        console.warn(`PDF render at pixelRatio ${ratio} encountered memory error, trying fallback...`, err);
      }
    }

    if (!dataUrl) {
      throw lastError || new Error('Failed to render PDF at all quality levels');
    }

    onProgress?.({
      status: 'saving',
      message: 'Compiling single-page A4 PDF document...',
    });

    // Standard A4 portrait in millimeters: 210 x 297 mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // Exactly fit 210 x 297 mm single page (no second page, no margins)
    pdf.addImage(dataUrl, 'PNG', 0, 0, 210, 297, undefined, 'FAST');

    const filename = generateFilename(data, 'pdf');

    // On iOS Safari, use Web Share or direct blob window opening
    if (isIOSDevice()) {
      try {
        const pdfBlob = pdf.output('blob');
        const file = new File([pdfBlob], filename, { type: 'application/pdf' });

        if (
          typeof navigator !== 'undefined' &&
          navigator.canShare &&
          navigator.canShare({ files: [file] })
        ) {
          await navigator.share({
            files: [file],
            title: filename,
          });
        } else {
          const blobUrl = URL.createObjectURL(pdfBlob);
          window.open(blobUrl, '_blank');
          setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.warn('iOS share failed, trying pdf.save fallback:', err);
          pdf.save(filename);
        }
      }
    } else {
      pdf.save(filename);
    }

    const qualityLabel =
      chosenRatio === 2.5
        ? 'Vector-Crisp (2.5x)'
        : chosenRatio === 2.0
        ? 'High (2.0x)'
        : chosenRatio === 1.5
        ? 'Standard (1.5x fallback)'
        : 'Compact (1.25x fallback)';

    onProgress?.({
      status: 'success',
      message: `Downloaded "${filename}" successfully! (${qualityLabel})`,
      warning: !fontEmbedCSS
        ? 'Fonts could not be embedded; system fallback fonts were used.'
        : undefined,
    });
  } catch (error) {
    console.error('Error exporting PDF:', error);
    const message = error instanceof Error ? error.message : 'Unknown PDF generation error';
    onProgress?.({
      status: 'error',
      message: 'Failed to generate PDF document',
      error: message,
    });
    throw error;
  } finally {
    isolatedContext?.cleanup();
  }
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';
import { toJpeg, toPng } from 'html-to-image';
import { CoverPageData } from '../types/coverPage';
import { waitForDocumentFonts, getEmbeddedFontCSS } from './fontUtils';

export interface ExportProgress {
  status: 'idle' | 'preparing' | 'rendering' | 'saving' | 'success' | 'error';
  message: string;
  error?: string;
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
      // If not yet loaded, wait for completion
      if (!img.complete) {
        await new Promise((res) => {
          img.onload = res;
          img.onerror = res;
        });
      }

      // If relative or http(s) URL, convert to inline base64 data URL
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
 * Downloads live element as a high-resolution A4 JPG (approx 2481 x 3509 px, 300 DPI)
 * matches live preview pixel-perfectly without zoom/scaling or font distortion.
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
    // 1. Prepare unscaled isolated clone & embedded font CSS in parallel
    const [context, fontEmbedCSS] = await Promise.all([
      createIsolatedExportElement(element),
      getEmbeddedFontCSS(),
    ]);
    isolatedContext = context;

    onProgress?.({
      status: 'rendering',
      message: 'Rasterizing A4 cover page at ultra-high 300 DPI print quality...',
    });

    // 3.125 pixel ratio on 794x1123 yields ~2481 x 3509 pixels (standard 300 DPI A4)
    const pixelRatio = 3.125;
    const canvasWidth = Math.round(A4_WIDTH_PX * pixelRatio);
    const canvasHeight = Math.round(A4_HEIGHT_PX * pixelRatio);

    const dataUrl = await toJpeg(context.exportNode, {
      quality: 0.98,
      pixelRatio,
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

    onProgress?.({
      status: 'saving',
      message: 'Saving high-resolution JPG file...',
    });

    const filename = generateFilename(data, 'jpg');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onProgress?.({
      status: 'success',
      message: `Downloaded "${filename}" successfully!`,
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
 * matches live preview pixel-perfectly without zoom/scaling or font distortion.
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
    // 1. Prepare unscaled isolated clone & embedded font CSS in parallel
    const [context, fontEmbedCSS] = await Promise.all([
      createIsolatedExportElement(element),
      getEmbeddedFontCSS(),
    ]);
    isolatedContext = context;

    onProgress?.({
      status: 'rendering',
      message: 'Generating vector-crisp A4 page for document export...',
    });

    // 2.5 pixel ratio yields ~1985 x 2807 px, pristine razor-sharp text and graphics in PDF
    const pixelRatio = 2.5;
    const canvasWidth = Math.round(A4_WIDTH_PX * pixelRatio);
    const canvasHeight = Math.round(A4_HEIGHT_PX * pixelRatio);

    const dataUrl = await toPng(context.exportNode, {
      pixelRatio,
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
    pdf.save(filename);

    onProgress?.({
      status: 'success',
      message: `Downloaded "${filename}" successfully!`,
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

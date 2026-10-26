/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';
import { toJpeg, toPng } from 'html-to-image';
import { CoverPageData } from '../types/coverPage';

export interface ExportProgress {
  status: 'idle' | 'preparing' | 'rendering' | 'saving' | 'success' | 'error';
  message: string;
  error?: string;
}

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

/**
 * Downloads live element as a high-resolution A4 JPG (approx 2480 x 3508 px, 300 DPI)
 */
export async function exportToJpg(
  element: HTMLElement,
  data: CoverPageData,
  onProgress?: (progress: ExportProgress) => void
): Promise<void> {
  onProgress?.({ status: 'preparing', message: 'Configuring canvas for high-resolution 300 DPI export...' });

  try {
    // 3.125 pixel ratio on 794x1123 element produces ~2480x3508 pixels
    const pixelRatio = 3.125;

    onProgress?.({ status: 'rendering', message: 'Rendering vector graphics, fonts and university seal...' });

    const dataUrl = await toJpeg(element, {
      quality: 0.96,
      pixelRatio,
      backgroundColor: '#FFFFFF',
      cacheBust: true,
      style: {
        transform: 'none',
        margin: '0',
      },
    });

    onProgress?.({ status: 'saving', message: 'Preparing high-resolution JPG download...' });

    const filename = generateFilename(data, 'jpg');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onProgress?.({ status: 'success', message: `Downloaded "${filename}" successfully!` });
  } catch (error) {
    console.error('Error exporting JPG:', error);
    const message = error instanceof Error ? error.message : 'Unknown rendering failure';
    onProgress?.({ status: 'error', message: 'Failed to generate JPG image', error: message });
    throw error;
  }
}

/**
 * Downloads live element as a single-page print-ready A4 PDF (210 x 297 mm)
 */
export async function exportToPdf(
  element: HTMLElement,
  data: CoverPageData,
  onProgress?: (progress: ExportProgress) => void
): Promise<void> {
  onProgress?.({ status: 'preparing', message: 'Preparing A4 portrait print layout...' });

  try {
    onProgress?.({ status: 'rendering', message: 'Rasterizing cover page at print quality...' });

    // High quality raster for PDF inclusion
    const dataUrl = await toPng(element, {
      pixelRatio: 2.5,
      backgroundColor: '#FFFFFF',
      cacheBust: true,
      style: {
        transform: 'none',
        margin: '0',
      },
    });

    onProgress?.({ status: 'saving', message: 'Compiling single-page A4 document...' });

    // Standard A4 portrait in millimeters: 210 x 297 mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // Exactly fit 210 x 297 mm single page
    pdf.addImage(dataUrl, 'PNG', 0, 0, 210, 297, undefined, 'FAST');

    const filename = generateFilename(data, 'pdf');
    pdf.save(filename);

    onProgress?.({ status: 'success', message: `Downloaded "${filename}" successfully!` });
  } catch (error) {
    console.error('Error exporting PDF:', error);
    const message = error instanceof Error ? error.message : 'Unknown PDF generation error';
    onProgress?.({ status: 'error', message: 'Failed to generate PDF document', error: message });
    throw error;
  }
}

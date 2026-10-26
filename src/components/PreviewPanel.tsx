/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { CoverPageData } from '../types/coverPage';
import { CoverPageRenderer } from './templates/CoverPageRenderer';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Printer,
  Download,
  Image as ImageIcon,
  Minimize2,
  Check,
  RefreshCw,
} from 'lucide-react';

interface PreviewPanelProps {
  data: CoverPageData;
  logoUrl: string | null;
  isLogoConfigured: boolean;
  onExportPdf: () => void;
  onExportJpg: () => void;
  isExporting: boolean;
  printTargetRef: React.RefObject<HTMLDivElement | null>;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  data,
  logoUrl,
  isLogoConfigured,
  onExportPdf,
  onExportJpg,
  isExporting,
  printTargetRef,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(0.65);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Auto-calculate optimal fit zoom based on container width
  useEffect(() => {
    const updateSize = () => {
      if (previewContainerRef.current) {
        const w = previewContainerRef.current.clientWidth - 48; // padding
        setContainerWidth(w);
        // A4 base width is 794px
        if (w < 794) {
          const fitZoom = Math.min(Math.max(w / 794, 0.38), 0.9);
          setZoomLevel(fitZoom);
        } else {
          setZoomLevel(0.72);
        }
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(Math.max(Number((prev + delta).toFixed(2)), 0.35), 1.2));
  };

  const handleFit = () => {
    if (previewContainerRef.current) {
      const w = previewContainerRef.current.clientWidth - 48;
      const fitZoom = Math.min(Math.max(w / 794, 0.38), 1.0);
      setZoomLevel(Number(fitZoom.toFixed(2)));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className={`bg-slate-100/90 rounded-2xl border border-slate-200/90 shadow-inner flex flex-col h-full overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-slate-900/95 backdrop-blur-md p-6' : ''
      }`}
    >
      {/* Top Preview Control Bar */}
      <div
        className={`px-4 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap ${
          isFullscreen ? 'rounded-xl shadow-lg mb-4' : ''
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Live A4 Preview
          </span>
          <span className="hidden sm:inline-block text-[11px] text-slate-400 font-mono-code">
            [210 × 297 mm]
          </span>
        </div>

        {/* Zoom & Viewport Controls */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              type="button"
              onClick={() => handleZoom(-0.1)}
              className="p-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[11px] font-mono-code tabular-nums font-semibold text-slate-700 min-w-[42px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={() => handleZoom(0.1)}
              className="p-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleFit}
            className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
          >
            Fit
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Preview'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="hidden md:flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
            title="Print directly"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>

        {/* Quick Export in Preview Toolbar */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={isExporting}
            onClick={onExportJpg}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-lg border border-slate-200 transition-colors"
            title="Download high-resolution 300 DPI JPG"
          >
            <ImageIcon className="w-3 h-3 text-slate-600" />
            <span className="hidden sm:inline">JPG</span>
          </button>
          <button
            type="button"
            disabled={isExporting}
            onClick={onExportPdf}
            className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 rounded-lg transition-colors shadow-2xs"
            title="Download single-page A4 PDF"
          >
            <Download className="w-3 h-3" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Live Document Canvas Viewport */}
      <div
        ref={previewContainerRef}
        className="flex-1 overflow-auto p-6 flex items-start justify-center"
      >
        <div
          className="transition-transform duration-100 origin-top flex items-center justify-center my-auto"
          style={{
            transform: `scale(${zoomLevel})`,
            marginBottom: `${(1123 * zoomLevel) - 1123 + 32}px`,
            marginRight: `${(794 * zoomLevel) - 794}px`,
          }}
        >
          {/* A4 Cover Page Document */}
          <CoverPageRenderer
            ref={printTargetRef}
            data={data}
            logoUrl={logoUrl}
            isLogoConfigured={isLogoConfigured}
          />
        </div>
      </div>
    </div>
  );
};

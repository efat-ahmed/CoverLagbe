/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  X,
  RotateCcw,
} from 'lucide-react';
import { A4_WIDTH_PX, A4_HEIGHT_PX } from '../utils/exportUtils';

interface PreviewPanelProps {
  data: CoverPageData;
  logoUrl: string | null;
  isLogoConfigured: boolean;
  onExportPdf?: () => void;
  onExportJpg?: () => void;
  isExporting?: boolean;
  printTargetRef?: React.RefObject<HTMLDivElement | null>;
  compactToolbar?: boolean;
  className?: string;
  onCloseFullscreen?: () => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  data,
  logoUrl,
  isLogoConfigured,
  onExportPdf,
  onExportJpg,
  isExporting = false,
  printTargetRef,
  compactToolbar = false,
  className = '',
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(0.65);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const isManualZoomRef = useRef(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const pinchStartDistanceRef = useRef<number | null>(null);
  const pinchStartZoomRef = useRef<number>(0.65);
  const lastTapTimeRef = useRef<number>(0);

  // Mouse pan state
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  // Detect coarse pointer (touch screen)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
    }
  }, []);

  // Compute optimal fit zoom
  const calculateFitZoom = useCallback((width: number, height: number): number => {
    const isMobile = width < 768;
    if (isMobile) {
      // On phone: fit to available width with small margins
      const availableWidth = Math.max(width - 24, 200);
      return Number(Math.min(Math.max(availableWidth / A4_WIDTH_PX, 0.32), 1.0).toFixed(2));
    }
    // On tablet / desktop: fit to available height so complete A4 page is visible without scrolling
    const availableHeight = Math.max(height - 48, 300);
    const availableWidth = Math.max(width - 48, 300);
    const heightFit = availableHeight / A4_HEIGHT_PX;
    const widthFit = availableWidth / A4_WIDTH_PX;
    return Number(Math.min(Math.max(Math.min(heightFit, widthFit), 0.35), 1.15).toFixed(2));
  }, []);

  // ResizeObserver for container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0 && !isManualZoomRef.current) {
          const fit = calculateFitZoom(width, height);
          setZoomLevel(fit);
        }
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [calculateFitZoom]);

  // Handle manual zoom button click
  const handleZoom = (delta: number) => {
    isManualZoomRef.current = true;
    setZoomLevel((prev) => Number(Math.min(Math.max(prev + delta, 0.3), 1.4).toFixed(2)));
  };

  // Reset to auto fit
  const handleFit = () => {
    isManualZoomRef.current = false;
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      const fit = calculateFitZoom(clientWidth, clientHeight);
      setZoomLevel(fit);
    }
  };

  // Fullscreen open / close with body scroll lock and browser history back handling
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      document.body.style.overflow = 'hidden';
      // Push history state so Android/iOS back button closes fullscreen
      if (typeof window !== 'undefined') {
        window.history.pushState({ coverlagbeFullscreen: true }, '');
      }
    } else {
      setIsFullscreen(false);
      document.body.style.overflow = '';
      if (window.history.state?.coverlagbeFullscreen) {
        window.history.back();
      }
    }
  };

  // Handle PopState (browser back button closes fullscreen)
  useEffect(() => {
    const handlePopState = () => {
      if (isFullscreen) {
        setIsFullscreen(false);
        document.body.style.overflow = '';
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isFullscreen]);

  // Clean up body overflow when unmounting
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Keyboard navigation & shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Container key shortcuts when focused
  const handleContainerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      handleZoom(0.1);
    } else if (e.key === '-' || e.key === '_') {
      e.preventDefault();
      handleZoom(-0.1);
    } else if (e.key === '0') {
      e.preventDefault();
      handleFit();
    }
  };

  // Trackpad / Wheel zoom with Ctrl/Cmd key
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      isManualZoomRef.current = true;
      const delta = -e.deltaY * 0.005;
      setZoomLevel((prev) => Number(Math.min(Math.max(prev + delta, 0.3), 1.4).toFixed(2)));
    }
  };

  // Touch Pinch to Zoom & Double Tap
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchStartDistanceRef.current = dist;
      pinchStartZoomRef.current = zoomLevel;
    } else if (e.touches.length === 1) {
      const now = Date.now();
      if (now - lastTapTimeRef.current < 300) {
        // Double tap toggles between fit and 100%
        e.preventDefault();
        isManualZoomRef.current = true;
        setZoomLevel((prev) => (prev >= 0.95 ? 0.55 : 1.0));
      }
      lastTapTimeRef.current = now;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartDistanceRef.current !== null) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = currentDist / pinchStartDistanceRef.current;
      const newZoom = Number((pinchStartZoomRef.current * ratio).toFixed(2));
      isManualZoomRef.current = true;
      setZoomLevel(Math.min(Math.max(newZoom, 0.3), 1.4));
    }
  };

  const handleTouchEnd = () => {
    pinchStartDistanceRef.current = null;
  };

  // Mouse drag-to-pan when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || !containerRef.current) return;
    isDraggingRef.current = true;
    dragStartPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: containerRef.current.scrollLeft,
      scrollTop: containerRef.current.scrollTop,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const dx = e.clientX - dragStartPosRef.current.x;
    const dy = e.clientY - dragStartPosRef.current.y;
    containerRef.current.scrollLeft = dragStartPosRef.current.scrollLeft - dx;
    containerRef.current.scrollTop = dragStartPosRef.current.scrollTop - dy;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handlePrint = () => {
    window.print();
  };

  const scaledWidth = Math.round(A4_WIDTH_PX * zoomLevel);
  const scaledHeight = Math.round(A4_HEIGHT_PX * zoomLevel);

  return (
    <div
      className={`bg-slate-100/95 rounded-2xl border border-slate-200/90 shadow-inner flex flex-col h-full overflow-hidden ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none bg-slate-900/95 backdrop-blur-md p-3 sm:p-6'
          : ''
      } ${className}`}
    >
      {/* Top Preview Control Bar */}
      <div
        className={`no-print px-3 sm:px-4 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between gap-2 sm:gap-3 flex-wrap ${
          isFullscreen ? 'rounded-xl shadow-lg mb-3' : ''
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live A4 Preview
          </span>
          <span className="hidden md:inline-block text-[11px] text-slate-400 font-mono-code">
            [210 × 297 mm]
          </span>
        </div>

        {/* Zoom & Viewport Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 ml-auto">
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              type="button"
              onClick={() => handleZoom(-0.1)}
              className="p-1 sm:p-1.5 text-slate-600 hover:text-slate-900 active:bg-slate-200 rounded transition-colors"
              title="Zoom out (-)"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 sm:px-2 text-[11px] font-mono-code tabular-nums font-semibold text-slate-700 min-w-[38px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={() => handleZoom(0.1)}
              className="p-1 sm:p-1.5 text-slate-600 hover:text-slate-900 active:bg-slate-200 rounded transition-colors"
              title="Zoom in (+)"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleFit}
            className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-lg border border-slate-200 transition-colors"
            title="Reset to optimal screen fit (0)"
          >
            Fit
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 text-slate-600 hover:text-slate-900 active:bg-slate-200 bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen Preview'}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Preview'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {!isTouchDevice && (
            <button
              type="button"
              onClick={handlePrint}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-lg border border-slate-200 transition-colors"
              title="Print directly (Ctrl+P)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          )}
        </div>

        {/* Quick Export actions (only shown when callbacks provided & not compact) */}
        {!compactToolbar && onExportPdf && onExportJpg && (
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              disabled={isExporting}
              onClick={onExportJpg}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-50 rounded-lg border border-slate-200 transition-colors"
              title="Download 300 DPI JPG"
            >
              <ImageIcon className="w-3 h-3 text-slate-600" />
              <span>JPG</span>
            </button>
            <button
              type="button"
              disabled={isExporting}
              onClick={onExportPdf}
              className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 disabled:opacity-50 rounded-lg transition-colors shadow-2xs"
              title="Download single-page A4 PDF"
            >
              <Download className="w-3 h-3" />
              <span>PDF</span>
            </button>
          </div>
        )}

        {/* Fullscreen Close button for thumb-friendly tap on mobile */}
        {isFullscreen && (
          <button
            type="button"
            onClick={toggleFullscreen}
            className="sm:hidden p-1.5 text-slate-700 bg-slate-200 rounded-lg"
            aria-label="Close fullscreen preview"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Live Document Canvas Viewport */}
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleContainerKeyDown}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 flex items-start justify-center cursor-grab active:cursor-grabbing focus:outline-none overscroll-contain select-none"
        aria-label="A4 Preview Canvas. Use plus and minus keys to zoom, zero to fit."
      >
        {/* Scaled wrapper: outer box sized precisely to rendered layout dimensions */}
        <div
          className="relative transition-all duration-75 my-auto"
          style={{
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
            flexShrink: 0,
          }}
        >
          {/* Inner 794x1123 unscaled page placed at top-left with transform: scale */}
          <div
            style={{
              width: `${A4_WIDTH_PX}px`,
              height: `${A4_HEIGHT_PX}px`,
              transform: `scale(${zoomLevel})`,
              transformOrigin: '0 0',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            <CoverPageRenderer
              ref={printTargetRef}
              data={data}
              logoUrl={logoUrl}
              isLogoConfigured={isLogoConfigured}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

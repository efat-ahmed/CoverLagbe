/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { ExportProgress } from '../utils/exportUtils';

interface ExportProgressModalProps {
  progress: ExportProgress | null;
  onClose: () => void;
  onRetry?: () => void;
}

export const ExportProgressModal: React.FC<ExportProgressModalProps> = ({
  progress,
  onClose,
  onRetry,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (progress && progress.status !== 'idle') {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [progress, onClose]);

  if (!progress || progress.status === 'idle') return null;

  const isWorking =
    progress.status === 'preparing' ||
    progress.status === 'rendering' ||
    progress.status === 'saving';

  const isSuccess = progress.status === 'success';
  const isError = progress.status === 'error';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overscroll-contain"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm sm:max-w-md p-5 sm:p-6 text-center space-y-4">
        {isWorking && (
          <div className="flex flex-col items-center" aria-live="polite">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
            <h3 id="export-dialog-title" className="text-base font-bold text-slate-900">
              Exporting Document
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-[280px]">
              {progress.message}
            </p>
          </div>
        )}

        {isSuccess && (
          <div className="flex flex-col items-center" aria-live="polite">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 id="export-dialog-title" className="text-base font-bold text-slate-900">
              Export Complete
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-[300px]">
              {progress.message}
            </p>
            {progress.warning && (
              <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200/90 rounded-xl text-left flex items-start gap-2 text-amber-800 w-full">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-snug">{progress.warning}</p>
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="mt-4 px-6 py-2.5 min-h-[44px] text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-black rounded-xl transition-colors shadow-xs"
            >
              Done
            </button>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center" aria-live="assertive">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 id="export-dialog-title" className="text-base font-bold text-slate-900">
              Export Failed
            </h3>
            <p className="text-xs sm:text-sm text-rose-600 mt-1 max-w-[300px]">
              {progress.message}
            </p>
            {progress.error && (
              <p className="text-[11px] text-slate-400 mt-1 max-w-[280px] truncate">
                {progress.error}
              </p>
            )}
            <div className="flex items-center gap-2 mt-4 w-full justify-center">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-xl transition-colors shadow-xs flex-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Export</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 min-h-[44px] text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

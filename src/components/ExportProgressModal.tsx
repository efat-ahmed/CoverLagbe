/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Loader2, CheckCircle2, AlertCircle, FileDown } from 'lucide-react';
import { ExportProgress } from '../utils/exportUtils';

interface ExportProgressModalProps {
  progress: ExportProgress | null;
  onClose: () => void;
}

export const ExportProgressModal: React.FC<ExportProgressModalProps> = ({
  progress,
  onClose,
}) => {
  if (!progress || progress.status === 'idle') return null;

  const isWorking =
    progress.status === 'preparing' ||
    progress.status === 'rendering' ||
    progress.status === 'saving';

  const isSuccess = progress.status === 'success';
  const isError = progress.status === 'error';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 text-center space-y-4">
        {isWorking && (
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Exporting Document</h3>
            <p className="text-xs text-slate-600 mt-1">{progress.message}</p>
          </div>
        )}

        {isSuccess && (
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Export Complete</h3>
            <p className="text-xs text-slate-600 mt-1">{progress.message}</p>
            <button
              onClick={onClose}
              className="mt-4 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
            >
              Done
            </button>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Export Failed</h3>
            <p className="text-xs text-rose-600 mt-1">{progress.message}</p>
            {progress.error && (
              <p className="text-[11px] text-slate-400 mt-1 max-w-[260px] truncate">{progress.error}</p>
            )}
            <button
              onClick={onClose}
              className="mt-4 px-5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

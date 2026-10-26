/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  FileText,
  RotateCcw,
  Shield,
  Download,
  Image as ImageIcon,
  Save,
  Check,
} from 'lucide-react';
import { WorkflowStep } from './StepProgressBar';

interface HeaderProps {
  onResetClick: () => void;
  onAdminLogoClick: () => void;
  onSaveDraftClick: () => void;
  onExportPdfClick: () => void;
  onExportJpgClick: () => void;
  isExporting: boolean;
  lastSavedAt: string | null;
  currentStep: WorkflowStep;
  onNavigateStep: (step: WorkflowStep) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onResetClick,
  onAdminLogoClick,
  onSaveDraftClick,
  onExportPdfClick,
  onExportJpgClick,
  isExporting,
  lastSavedAt,
  currentStep,
  onNavigateStep,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className="w-9 h-9 rounded-xl text-white flex items-center justify-center shadow-xs"
            style={{ backgroundColor: '#2A5CAA' }}
          >
            <FileText className="w-5 h-5 text-blue-100" />
          </div>
          <div className="leading-none">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-slate-900 font-sans-modern flex items-center">
                <span>CoverLagbe</span>
                <span className="text-blue-700">?</span>
              </span>
              <span className="text-[10px] font-bold text-blue-900 bg-blue-50 border border-blue-200/80 px-1.5 py-0.5 rounded uppercase tracking-wider">
                BRACU
              </span>
            </div>
            <span className="hidden sm:inline-block text-[11px] font-medium text-slate-400 mt-0.5">
              Assignment Cover Page Studio
            </span>
          </div>
        </div>

        {/* Zone 3: Actions & Navigation Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Institutional Logo Setup (Admin / Preconfigured Logo Manager) */}
          <button
            type="button"
            onClick={onAdminLogoClick}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200"
            title="Institutional University Logo Configuration"
          >
            <Shield className="w-3.5 h-3.5 text-blue-700" />
            <span className="hidden md:inline">Institution Logo</span>
          </button>

          {/* Reset button */}
          <button
            type="button"
            onClick={onResetClick}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors border border-transparent"
            title="Reset form fields"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Save Draft Button */}
          <button
            type="button"
            onClick={onSaveDraftClick}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl transition-colors border border-slate-200 shadow-2xs"
            title={lastSavedAt ? `Saved at ${new Date(lastSavedAt).toLocaleTimeString()}` : 'Save Draft'}
          >
            {lastSavedAt ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Save className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span>{lastSavedAt ? 'Draft Saved' : 'Save Draft'}</span>
          </button>

          {/* If on Step 1 or 2: Provide a Quick Jump to Step 3 Template & Preview */}
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={() => onNavigateStep(3)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors"
            >
              <span>Preview & Templates</span>
            </button>
          ) : (
            <>
              {/* Download JPG button on Step 3 */}
              <button
                type="button"
                disabled={isExporting}
                onClick={onExportJpgClick}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-xl transition-colors border border-slate-200"
              >
                <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
                <span>JPG</span>
              </button>

              {/* Download PDF button (Primary Action) */}
              <button
                type="button"
                disabled={isExporting}
                onClick={onExportPdfClick}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 rounded-xl transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

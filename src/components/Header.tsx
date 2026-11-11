/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  RotateCcw,
  Shield,
  Download,
  Image as ImageIcon,
  Save,
  Check,
  MoreVertical,
  X,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Global Ctrl/Cmd+S for saving draft
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        onSaveDraftClick();
      }
    };
    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [onSaveDraftClick]);

  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 border-b border-slate-200/90 shadow-2xs backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-white flex items-center justify-center shadow-xs"
            style={{ backgroundColor: '#2A5CAA' }}
            aria-hidden="true"
          >
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-100" />
          </div>
          <div className="leading-none">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 font-sans-modern flex items-center">
                <span>CoverLagbe</span>
                <span className="text-blue-700">?</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-blue-900 bg-blue-50 border border-blue-200/80 px-1.5 py-0.5 rounded uppercase tracking-wider">
                BRACU
              </span>
            </div>
            <span className="hidden sm:inline-block text-[11px] font-medium text-slate-400 mt-0.5">
              Assignment Cover Page Studio
            </span>
          </div>
        </div>

        {/* Zone 2: Desktop Actions */}
        <div className="hidden md:flex items-center gap-2 lg:gap-2.5 shrink-0">
          {/* Institutional Logo Setup */}
          <button
            type="button"
            onClick={onAdminLogoClick}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition-colors border border-slate-200"
            title="Configure University Logo"
            aria-label="Institutional University Logo Configuration"
          >
            <Shield className="w-3.5 h-3.5 text-blue-700" />
            <span>Institution Logo</span>
          </button>

          {/* Reset button */}
          <button
            type="button"
            onClick={onResetClick}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-rose-700 hover:bg-rose-50 active:bg-rose-100 rounded-xl transition-colors border border-transparent"
            title="Reset form fields"
            aria-label="Reset form fields"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {/* Save Draft Button */}
          <button
            type="button"
            onClick={onSaveDraftClick}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 rounded-xl transition-colors border border-slate-200 shadow-2xs"
            title={lastSavedAt ? `Saved at ${new Date(lastSavedAt).toLocaleTimeString()} (Ctrl+S)` : 'Save Draft (Ctrl+S)'}
            aria-label="Save draft"
          >
            {lastSavedAt ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Save className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span>{lastSavedAt ? 'Draft Saved' : 'Save Draft'}</span>
          </button>

          {/* Step-specific navigation or export buttons */}
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={() => onNavigateStep(3)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 border border-blue-200 rounded-xl transition-colors"
              title="Jump to Template Gallery & Export (Ctrl+Enter)"
            >
              <span>Preview & Templates</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                disabled={isExporting}
                onClick={onExportJpgClick}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-50 rounded-xl transition-colors border border-slate-200"
                title="Download JPG"
              >
                <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
                <span>JPG</span>
              </button>

              <button
                type="button"
                disabled={isExporting}
                onClick={onExportPdfClick}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 disabled:opacity-50 rounded-xl transition-colors shadow-xs"
                title="Download PDF (Ctrl+Enter)"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </>
          )}
        </div>

        {/* Zone 3: Mobile Action Controls */}
        <div className="flex md:hidden items-center gap-1.5">
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={() => onNavigateStep(3)}
              className="px-3 py-1.5 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
            >
              Templates
            </button>
          ) : (
            <button
              type="button"
              disabled={isExporting}
              onClick={onExportPdfClick}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-extrabold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
          )}

          {/* Mobile Overflow Menu Button */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 active:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              aria-label="More actions"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <MoreVertical className="w-4 h-4" />}
            </button>

            {/* Mobile Dropdown Panel */}
            {isMobileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    onSaveDraftClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 text-left"
                >
                  <Save className="w-4 h-4 text-slate-500" />
                  <span>{lastSavedAt ? 'Draft Saved' : 'Save Draft'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onAdminLogoClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 text-left"
                >
                  <Shield className="w-4 h-4 text-blue-700" />
                  <span>Custom Logo</span>
                </button>

                <div className="my-1 border-t border-slate-100" />

                <button
                  type="button"
                  onClick={() => {
                    onResetClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 active:bg-rose-100 text-left"
                >
                  <RotateCcw className="w-4 h-4 text-rose-500" />
                  <span>Reset Form</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

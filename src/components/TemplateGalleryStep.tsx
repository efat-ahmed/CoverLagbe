/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CoverPageData,
  TemplateId,
  FontChoice,
  BorderStyle,
  LogoSize,
} from '../types/coverPage';
import {
  TEMPLATE_METADATA,
  ACCENT_COLORS,
} from '../config/constants';
import { PreviewPanel } from './PreviewPanel';
import {
  Check,
  ArrowLeft,
  Download,
  Image as ImageIcon,
  Edit3,
  Palette,
  Sliders,
  Type,
  Maximize2,
} from 'lucide-react';
import { WorkflowStep } from './StepProgressBar';

interface TemplateGalleryStepProps {
  data: CoverPageData;
  onChange: (data: CoverPageData) => void;
  logoUrl: string | null;
  isLogoConfigured: boolean;
  onExportPdf: () => void;
  onExportJpg: () => void;
  isExporting: boolean;
  printTargetRef: React.RefObject<HTMLDivElement | null>;
  onNavigateStep: (step: WorkflowStep) => void;
}

export const TemplateGalleryStep: React.FC<TemplateGalleryStepProps> = ({
  data,
  onChange,
  logoUrl,
  isLogoConfigured,
  onExportPdf,
  onExportJpg,
  isExporting,
  printTargetRef,
  onNavigateStep,
}) => {
  const [showStyleControls, setShowStyleControls] = useState(false);

  const updateField = <K extends keyof CoverPageData>(field: K, value: CoverPageData[K]) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-0 animate-in fade-in duration-200">
      {/* Review Summary Bar */}
      <div className="bg-white rounded-2xl border border-blue-200/80 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-blue-900 bg-blue-100/70 border border-blue-200/60 px-2.5 py-0.5 rounded-full">
              {data.courseCode || 'CSE220'}
            </span>
            <span className="text-xs font-bold text-slate-900">
              {data.assignmentNumber || 'Assignment'}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-blue-800">
              Semester: {data.semester || 'Fall 26'}
            </span>
            <span className="text-slate-300 hidden sm:inline">·</span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              {data.students.length} Student{data.students.length > 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-xs text-slate-600 line-clamp-1 font-medium">
            {data.assignmentTitle || 'Assignment Topic Title'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateStep(2)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-800 hover:text-blue-950 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Information</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Template Gallery & Customization, Right Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 6 Template Gallery & Styling Controls */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Choose Cover Page Template
                </h3>
                <p className="text-xs text-slate-500">
                  Select from 6 professional BRAC University layouts.
                </p>
              </div>
            </div>

            {/* Template Cards: Responsive 2-column on tablet/desktop, clean stacked on phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TEMPLATE_METADATA.map((tmpl) => {
                const isSelected = data.template === tmpl.id;

                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => updateField('template', tmpl.id)}
                    className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-700 bg-blue-50/50 shadow-xs ring-2 ring-blue-700/25'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    {/* Visual Miniature Layout Thumbnail */}
                    <div className="h-20 bg-slate-100 rounded-lg mb-2 p-2 relative overflow-hidden border border-slate-200 flex flex-col justify-between">
                      {tmpl.id === 'classic-academic' && (
                        <div className="flex flex-col items-center justify-between h-full">
                          <div className="w-14 h-1 bg-slate-500 rounded-full" />
                          <div className="w-5 h-5 rounded-full border border-blue-600 flex items-center justify-center text-[6px] font-bold text-blue-700">
                            Logo
                          </div>
                          <div className="w-20 h-1.5 bg-slate-800 rounded-xs" />
                          <div className="w-full flex justify-between px-2">
                            <div className="w-6 h-1 bg-slate-400 rounded-full" />
                            <div className="w-6 h-1 bg-slate-400 rounded-full" />
                          </div>
                        </div>
                      )}

                      {tmpl.id === 'modern-blue' && (
                        <div className="flex flex-col justify-between h-full">
                          <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-700" />
                          <div className="flex justify-between items-start pt-1">
                            <div className="w-16 h-1.5 bg-blue-700 rounded-xs" />
                            <div className="w-3.5 h-3.5 rounded-full bg-slate-700" />
                          </div>
                          <div className="border-l-2 border-blue-700 pl-1.5">
                            <div className="w-20 h-2 bg-slate-900 rounded-xs" />
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            <div className="h-3 bg-white rounded border border-slate-200" />
                            <div className="h-3 bg-white rounded border border-slate-200" />
                          </div>
                        </div>
                      )}

                      {tmpl.id === 'minimal-professional' && (
                        <div className="flex flex-col justify-between h-full border border-slate-300/80 p-1">
                          <div className="flex justify-between items-start">
                            <div className="w-14 h-1 bg-slate-600 rounded-full" />
                            <div className="w-3 h-3 rounded-full bg-blue-600" />
                          </div>
                          <div className="w-16 h-1.5 bg-slate-800 rounded-xs" />
                          <div className="w-full h-1 bg-slate-300 rounded-full" />
                          <div className="flex gap-2">
                            <div className="w-8 h-1 bg-slate-400 rounded-full" />
                            <div className="w-8 h-1 bg-slate-400 rounded-full" />
                          </div>
                        </div>
                      )}

                      {tmpl.id === 'editorial-style' && (
                        <div className="flex flex-col justify-between h-full">
                          <div className="border-b border-blue-700 pb-1 flex justify-between items-center">
                            <div className="w-12 h-1 bg-slate-700 rounded-full" />
                            <div className="w-3 h-3 rounded-full bg-blue-700" />
                          </div>
                          <div className="py-1">
                            <div className="w-8 h-1 bg-blue-700 rounded-full mb-1" />
                            <div className="w-24 h-2 bg-slate-900 rounded-xs" />
                          </div>
                          <div className="border-t border-slate-200 pt-1 flex justify-between">
                            <div className="w-10 h-1 bg-slate-400 rounded-full" />
                            <div className="w-8 h-1 bg-slate-400 rounded-full" />
                          </div>
                        </div>
                      )}

                      {tmpl.id === 'geometric-blue' && (
                        <div className="flex flex-col justify-between h-full relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-8 h-8 bg-blue-600/20 rounded-bl-xl" />
                          <div className="absolute bottom-0 left-0 w-6 h-6 bg-slate-800/10 rounded-tr-xl" />
                          <div className="w-12 h-1 bg-blue-700 rounded-full" />
                          <div className="border-l-2 border-blue-700 pl-1.5">
                            <div className="w-18 h-2 bg-slate-900 rounded-xs" />
                          </div>
                          <div className="grid grid-cols-2 gap-1.5 z-10">
                            <div className="h-3 bg-white rounded border border-slate-200" />
                            <div className="h-3 bg-white rounded border border-slate-200" />
                          </div>
                        </div>
                      )}

                      {tmpl.id === 'premium-formal' && (
                        <div className="flex flex-col justify-between h-full overflow-hidden">
                          <div className="bg-blue-800 -mx-2 -mt-2 px-2 py-1 flex items-center justify-between text-white">
                            <div className="w-14 h-1 bg-white/80 rounded-full" />
                            <div className="w-2.5 h-2.5 rounded-full bg-white" />
                          </div>
                          <div className="py-1">
                            <div className="w-20 h-2 bg-slate-900 rounded-xs" />
                          </div>
                          <div className="h-4 bg-white rounded border border-slate-200" />
                        </div>
                      )}

                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-blue-700 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <p className="font-bold text-slate-900 text-xs">{tmpl.name}</p>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-snug">
                        {tmpl.tag}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Customization Styling Accordion */}
            <div className="pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowStyleControls(!showStyleControls)}
                className="flex items-center justify-between w-full text-xs font-bold text-slate-700 hover:text-blue-900 py-1 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-blue-700" />
                  Colors & Typography Options
                </span>
                <span className="text-[11px] text-blue-700">
                  {showStyleControls ? 'Hide' : 'Customize'}
                </span>
              </button>

              {showStyleControls && (
                <div className="mt-3 space-y-4 pt-3 border-t border-slate-100 animate-in fade-in duration-150">
                  {/* Blue Color Palette Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-2">
                      Accent Color Palette
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {ACCENT_COLORS.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => updateField('accentColorId', c.id)}
                          className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all ${
                            data.accentColorId === c.id
                              ? 'border-blue-700 bg-blue-50/60 ring-2 ring-blue-700/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                            style={{ backgroundColor: c.primary }}
                          />
                          <span className="truncate">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Typography Pairing */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-2">
                      Typography
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => updateField('fontChoice', 'classic-serif')}
                        className={`p-2 rounded-xl border text-xs text-left ${
                          data.fontChoice === 'classic-serif'
                            ? 'border-blue-700 bg-blue-50/60 font-bold text-blue-950'
                            : 'border-slate-200 text-slate-700'
                        }`}
                      >
                        Playfair Serif
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField('fontChoice', 'modern-sans')}
                        className={`p-2 rounded-xl border text-xs text-left ${
                          data.fontChoice === 'modern-sans'
                            ? 'border-blue-700 bg-blue-50/60 font-bold text-blue-950'
                            : 'border-slate-200 text-slate-700'
                        }`}
                      >
                        Jakarta Sans
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField('fontChoice', 'editorial-serif')}
                        className={`p-2 rounded-xl border text-xs text-left ${
                          data.fontChoice === 'editorial-serif'
                            ? 'border-blue-700 bg-blue-50/60 font-bold text-blue-950'
                            : 'border-slate-200 text-slate-700'
                        }`}
                      >
                        Merriweather
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField('fontChoice', 'corporate-sans')}
                        className={`p-2 rounded-xl border text-xs text-left ${
                          data.fontChoice === 'corporate-sans'
                            ? 'border-blue-700 bg-blue-50/60 font-bold text-blue-950'
                            : 'border-slate-200 text-slate-700'
                        }`}
                      >
                        Corporate Sans
                      </button>
                    </div>
                  </div>

                  {/* Border Style */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-2">
                      Border Style
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'classic-double', label: 'Double Border' },
                        { id: 'single-hairline', label: 'Single Border' },
                        { id: 'corner-accents', label: 'Corner Accents' },
                        { id: 'none', label: 'Borderless' },
                      ].map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => updateField('borderStyle', b.id as BorderStyle)}
                          className={`p-2 rounded-xl border text-xs text-left ${
                            data.borderStyle === b.id
                              ? 'border-blue-700 bg-blue-50/60 font-bold text-blue-950'
                              : 'border-slate-200 text-slate-700'
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Back Button to Edit Form */}
            <div className="pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => onNavigateStep(2)}
                className="w-full flex items-center justify-center gap-2 h-11 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Edit Assignment Info</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live A4 Preview & Primary Downloads */}
        <div className="lg:col-span-7 space-y-4">
          <PreviewPanel
            data={data}
            logoUrl={logoUrl}
            isLogoConfigured={isLogoConfigured}
            onExportPdf={onExportPdf}
            onExportJpg={onExportJpg}
            isExporting={isExporting}
            printTargetRef={printTargetRef}
          />
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar (Fixed, respects safe area) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 pb-safe shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-2.5">
          <button
            type="button"
            disabled={isExporting}
            onClick={onExportJpg}
            className="flex items-center justify-center gap-1.5 h-12 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-xl transition-colors border border-slate-200 shadow-2xs"
          >
            <ImageIcon className="w-4 h-4 text-slate-600" />
            <span>Download JPG</span>
          </button>

          <button
            type="button"
            disabled={isExporting}
            onClick={onExportPdf}
            className="flex items-center justify-center gap-1.5 h-12 text-xs font-extrabold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 rounded-xl transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Check, BookOpen, Users, Palette } from 'lucide-react';

export type WorkflowStep = 1 | 2 | 3;

interface StepProgressBarProps {
  currentStep: WorkflowStep;
  onStepClick: (step: WorkflowStep) => void;
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  onStepClick,
}) => {
  const steps: {
    number: WorkflowStep;
    title: string;
    mobileTitle: string;
    subtitle: string;
    icon: React.ReactNode;
  }[] = [
    {
      number: 1,
      title: 'University & Course',
      mobileTitle: 'Course',
      subtitle: 'Basic details',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      number: 2,
      title: 'Assignment & Students',
      mobileTitle: 'Details',
      subtitle: 'Title, IDs & faculty',
      icon: <Users className="w-4 h-4" />,
    },
    {
      number: 3,
      title: 'Template & Download',
      mobileTitle: 'Export',
      subtitle: 'Choose style & export',
      icon: <Palette className="w-4 h-4" />,
    },
  ];

  return (
    <div className="no-print w-full bg-white border-b border-slate-200/90 py-2 sm:py-3 px-3 sm:px-6 shadow-2xs">
      <div className="max-w-5xl mx-auto">
        {/* Mobile Step Bar: Clean 3-segment progress indicator with shortened labels */}
        <div className="block sm:hidden">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1.5">
            <span className="text-blue-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-700" />
              Step {currentStep} of 3
            </span>
            <span className="text-slate-700 font-semibold text-[11px]">
              {steps[currentStep - 1].mobileTitle}: {steps[currentStep - 1].subtitle}
            </span>
          </div>

          {/* 3 Clickable segmented progress bars */}
          <div className="grid grid-cols-3 gap-1.5">
            {steps.map((s) => {
              const isPast = currentStep > s.number;
              const isCurrent = currentStep === s.number;

              return (
                <button
                  key={s.number}
                  type="button"
                  onClick={() => onStepClick(s.number)}
                  className="flex flex-col gap-1 py-1 text-left focus:outline-none"
                  aria-label={`Go to step ${s.number}: ${s.title}`}
                >
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isPast
                        ? 'bg-blue-700'
                        : isCurrent
                        ? 'bg-blue-600'
                        : 'bg-slate-200'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-bold truncate ${
                      isCurrent ? 'text-blue-900' : 'text-slate-400'
                    }`}
                  >
                    {s.number}. {s.mobileTitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop / Tablet Multi-Step Indicator */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-3">
          {steps.map((s) => {
            const isCompleted = currentStep > s.number;
            const isActive = currentStep === s.number;

            return (
              <button
                key={s.number}
                type="button"
                onClick={() => onStepClick(s.number)}
                className={`flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-blue-50/80 border border-blue-200 shadow-2xs ring-1 ring-blue-700/20'
                    : isCompleted
                    ? 'bg-slate-50 border border-slate-200/70 hover:bg-slate-100'
                    : 'border border-transparent hover:bg-slate-50'
                }`}
              >
                {/* Step badge */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                    isCompleted
                      ? 'bg-blue-700 text-white'
                      : isActive
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.number}
                </div>

                <div className="min-w-0">
                  <p
                    className={`text-xs font-bold truncate leading-tight ${
                      isActive ? 'text-blue-950 font-extrabold' : 'text-slate-800'
                    }`}
                  >
                    {s.title}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {s.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

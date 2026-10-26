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
  const steps: { number: WorkflowStep; title: string; subtitle: string; icon: React.ReactNode }[] = [
    {
      number: 1,
      title: 'University & Course',
      subtitle: 'Basic details',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      number: 2,
      title: 'Assignment & Students',
      subtitle: 'Title, IDs & faculty',
      icon: <Users className="w-4 h-4" />,
    },
    {
      number: 3,
      title: 'Template & Download',
      subtitle: 'Choose style & export',
      icon: <Palette className="w-4 h-4" />,
    },
  ];

  return (
    <div className="w-full bg-white border-b border-slate-200/90 py-3 px-4 sm:px-6 shadow-2xs">
      <div className="max-w-5xl mx-auto">
        {/* Mobile Compact Progress Bar */}
        <div className="block sm:hidden">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1.5">
            <span className="text-blue-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-700" />
              Step {currentStep} of 3
            </span>
            <span className="text-slate-600 font-semibold">
              {steps[currentStep - 1].title}
            </span>
          </div>
          {/* Progress bar line */}
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-700 h-full rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
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
                    ? 'bg-blue-50/70 border border-blue-200/90 shadow-2xs'
                    : isCompleted
                    ? 'bg-slate-50/80 border border-slate-200/60 hover:bg-slate-100'
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

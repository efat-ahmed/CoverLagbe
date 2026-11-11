/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  CoverPageData,
  StudentInfo,
  CustomField,
} from '../types/coverPage';
import { SEMESTER_EXAMPLES, getDefaultSemester } from '../config/constants';
import {
  BookOpen,
  Users,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Sliders,
  Eye,
  EyeOff,
} from 'lucide-react';
import { WorkflowStep } from './StepProgressBar';

interface EditorPanelProps {
  data: CoverPageData;
  onChange: (data: CoverPageData) => void;
  onLoadPreset: (presetKey: string) => void;
  currentStep: WorkflowStep;
  onNavigateStep: (step: WorkflowStep) => void;
}

function parseFormattedDateToISO(formatted: string): string {
  try {
    const d = new Date(formatted);
    if (!isNaN(d.getTime())) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
  } catch {}
  return '';
}

function parseISOToFormattedDate(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  data,
  onChange,
  onLoadPreset,
  currentStep,
  onNavigateStep,
}) => {
  const [showToggles, setShowToggles] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const newlyAddedIdRef = useRef<string | null>(null);
  const nativeDatePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
    }
  }, []);

  const updateField = <K extends keyof CoverPageData>(field: K, value: CoverPageData[K]) => {
    onChange({ ...data, [field]: value });
  };

  const updateVisibility = (key: keyof CoverPageData['visibility'], value: boolean) => {
    onChange({
      ...data,
      visibility: {
        ...data.visibility,
        [key]: value,
      },
    });
  };

  // Student management (capped at maximum 6 students)
  const addStudent = () => {
    if (data.students.length >= 6) return;
    const newId = `student-${Date.now()}`;
    newlyAddedIdRef.current = newId;
    const newStudent: StudentInfo = {
      id: newId,
      name: '',
      studentId: '',
      section: '',
    };
    updateField('students', [...data.students, newStudent]);
  };

  const removeStudent = (id: string) => {
    if (data.students.length <= 1) return;
    updateField('students', data.students.filter((s) => s.id !== id));
  };

  const updateStudent = (id: string, field: keyof StudentInfo, value: string) => {
    const updated = data.students.map((s) => (s.id === id ? { ...s, [field]: value } : s));
    updateField('students', updated);
  };

  // Custom fields
  const addCustomField = () => {
    const newId = `cf-${Date.now()}`;
    newlyAddedIdRef.current = newId;
    const newField: CustomField = {
      id: newId,
      label: 'Lab Group',
      value: '',
    };
    updateField('customFields', [...data.customFields, newField]);
  };

  const removeCustomField = (id: string) => {
    updateField('customFields', data.customFields.filter((cf) => cf.id !== id));
  };

  const updateCustomField = (id: string, field: 'label' | 'value', val: string) => {
    const updated = data.customFields.map((cf) => (cf.id === id ? { ...cf, [field]: val } : cf));
    updateField('customFields', updated);
  };

  // Auto-scroll & focus newly added cards
  useEffect(() => {
    if (newlyAddedIdRef.current) {
      const el = document.getElementById(newlyAddedIdRef.current);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        const input = el.querySelector('input') as HTMLInputElement | null;
        input?.focus();
      }
      newlyAddedIdRef.current = null;
    }
  }, [data.students.length, data.customFields.length]);

  // Validation
  const canProceedFromStep1 =
    (data.universityName?.trim().length ?? 0) > 0 &&
    (data.courseTitle?.trim().length ?? 0) > 0;

  const canProceedFromStep2 =
    (data.assignmentTitle?.trim().length ?? 0) > 0 &&
    data.students.length > 0 &&
    (data.students[0].name?.trim().length ?? 0) > 0;

  // Global Ctrl/Cmd+Enter for advancing step
  useEffect(() => {
    const handleStepKeys = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (currentStep === 1 && canProceedFromStep1) {
          onNavigateStep(2);
        } else if (currentStep === 2 && canProceedFromStep2) {
          onNavigateStep(3);
        }
      }
    };
    window.addEventListener('keydown', handleStepKeys);
    return () => window.removeEventListener('keydown', handleStepKeys);
  }, [currentStep, canProceedFromStep1, canProceedFromStep2, onNavigateStep]);

  // Enter key moves to next field, or next step on last field
  const handleFieldKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    isLast = false
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isLast) {
        if (currentStep === 1 && canProceedFromStep1) onNavigateStep(2);
        else if (currentStep === 2 && canProceedFromStep2) onNavigateStep(3);
      } else {
        const container = containerRef.current;
        if (container) {
          const focusables = Array.from(
            container.querySelectorAll('input:not([type="hidden"]):not([disabled]), textarea:not([disabled])')
          ) as HTMLElement[];
          const idx = focusables.indexOf(e.currentTarget);
          if (idx >= 0 && idx < focusables.length - 1) {
            focusables[idx + 1].focus();
          }
        }
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="no-print bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col h-full overflow-hidden"
    >
      {/* Step Header */}
      <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
            {currentStep === 1 ? 'Step 1: University & Course Information' : 'Step 2: Assignment & Student Details'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentStep === 1
              ? 'Enter academic institution, course code, and semester.'
              : 'Add your assignment topic, student IDs, and instructor.'}
          </p>
        </div>
        <span className="text-[11px] sm:text-xs font-bold text-blue-900 bg-blue-100/70 border border-blue-200/70 px-2.5 py-1 rounded-full shrink-0">
          Step {currentStep} of 3
        </span>
      </div>

      {/* Form Body with Smooth Scroll & iOS Auto-zoom prevention (≥16px on mobile) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-slate-700">
        {/* STEP 1 FORM: UNIVERSITY & COURSE */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Quick Presets Bar */}
            <div className="p-3 sm:p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <span className="text-blue-950 font-semibold flex items-center gap-1.5 text-xs">
                <Sparkles className="w-4 h-4 text-blue-700 shrink-0" />
                Quick Course Presets:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => onLoadPreset('bracSingle')}
                  className="px-2.5 py-1.5 min-h-[36px] bg-white hover:bg-blue-100 active:bg-blue-200 text-blue-900 rounded-lg font-medium text-xs border border-blue-200 transition-colors shadow-2xs"
                >
                  CSE220
                </button>
                <button
                  type="button"
                  onClick={() => onLoadPreset('groupProject')}
                  className="px-2.5 py-1.5 min-h-[36px] bg-white hover:bg-blue-100 active:bg-blue-200 text-blue-900 rounded-lg font-medium text-xs border border-blue-200 transition-colors shadow-2xs"
                >
                  EEE451 Project
                </button>
                <button
                  type="button"
                  onClick={() => onLoadPreset('researchThesis')}
                  className="px-2.5 py-1.5 min-h-[36px] bg-white hover:bg-blue-100 active:bg-blue-200 text-blue-900 rounded-lg font-medium text-xs border border-blue-200 transition-colors shadow-2xs"
                >
                  BBS Thesis
                </button>
              </div>
            </div>

            {/* University & Department */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                  University Name <span className="text-blue-700">*</span>
                </label>
                <input
                  type="text"
                  value={data.universityName}
                  onChange={(e) => updateField('universityName', e.target.value)}
                  onKeyDown={(e) => handleFieldKeyDown(e)}
                  placeholder="BRAC University"
                  autoCapitalize="words"
                  autoComplete="organization"
                  enterKeyHint="next"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 font-semibold text-slate-900 text-base md:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                  Department Name
                </label>
                <input
                  type="text"
                  value={data.departmentName}
                  onChange={(e) => updateField('departmentName', e.target.value)}
                  onKeyDown={(e) => handleFieldKeyDown(e)}
                  placeholder="e.g. Department of Computer Science and Engineering"
                  autoCapitalize="words"
                  enterKeyHint="next"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-slate-900 text-base md:text-sm"
                />
              </div>
            </div>

            {/* Course Code & Title */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                  Course Code
                </label>
                <input
                  type="text"
                  value={data.courseCode}
                  onChange={(e) => updateField('courseCode', e.target.value)}
                  onKeyDown={(e) => handleFieldKeyDown(e)}
                  placeholder="e.g. CSE220"
                  autoCapitalize="characters"
                  enterKeyHint="next"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 font-mono-code font-bold text-slate-900 uppercase text-base md:text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                  Course Title <span className="text-blue-700">*</span>
                </label>
                <input
                  type="text"
                  value={data.courseTitle}
                  onChange={(e) => updateField('courseTitle', e.target.value)}
                  onKeyDown={(e) => handleFieldKeyDown(e)}
                  placeholder="e.g. Data Structures and Algorithms"
                  autoCapitalize="words"
                  enterKeyHint="next"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-slate-900 font-medium text-base md:text-sm"
                />
              </div>
            </div>

            {/* Semester Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs sm:text-sm font-bold text-slate-900">
                  Semester <span className="text-blue-700">*</span>
                </label>
                <span className="text-xs text-slate-400">e.g. {getDefaultSemester()}</span>
              </div>
              <input
                type="text"
                value={data.semester}
                onChange={(e) => updateField('semester', e.target.value)}
                onKeyDown={(e) => handleFieldKeyDown(e, true)}
                placeholder={getDefaultSemester()}
                autoCapitalize="words"
                enterKeyHint="done"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 font-semibold text-slate-900 text-base md:text-sm"
              />
              {/* Quick Pick suggestions (Scroll/Wrap resilient) */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span className="text-xs text-slate-400 mr-0.5">Quick picks:</span>
                {SEMESTER_EXAMPLES.map((sem) => (
                  <button
                    key={sem}
                    type="button"
                    onClick={() => updateField('semester', sem)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors min-h-[36px] ${
                      data.semester === sem
                        ? 'bg-blue-700 text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700'
                    }`}
                  >
                    {sem}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 FORM: ASSIGNMENT, STUDENTS & INSTRUCTOR */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Assignment Title & Type */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                  Assignment or Report Title <span className="text-blue-700">*</span>
                </label>
                <textarea
                  rows={3}
                  value={data.assignmentTitle}
                  onChange={(e) => updateField('assignmentTitle', e.target.value)}
                  placeholder="e.g. Implementation & Empirical Performance Analysis of Distributed Graph Traversal Algorithms"
                  enterKeyHint="next"
                  className="w-full p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 font-medium text-slate-900 leading-relaxed text-base md:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                  Assignment Number / Type
                </label>
                <input
                  type="text"
                  value={data.assignmentNumber}
                  onChange={(e) => updateField('assignmentNumber', e.target.value)}
                  onKeyDown={(e) => handleFieldKeyDown(e)}
                  placeholder="e.g. Assignment 02 or Term Paper"
                  enterKeyHint="next"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-slate-900 text-base md:text-sm"
                />
              </div>
            </div>

            {/* Student Contributors */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Student Contributors</h3>
                  <p className="text-xs text-slate-500">Supports single and group assignment submissions (up to 6).</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {data.students.length >= 6 ? (
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                      Maximum 6 students reached
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={addStudent}
                      className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-900 rounded-xl font-bold text-xs border border-blue-200 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-blue-700" />
                      Add Member ({data.students.length}/6)
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3.5">
                {data.students.map((student, index) => (
                  <div
                    key={student.id}
                    id={student.id}
                    className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3 relative transition-all"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Student #{index + 1}</span>
                      {data.students.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStudent(student.id)}
                          className="text-slate-400 hover:text-rose-600 active:text-rose-700 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md transition-colors"
                          title="Remove student"
                          aria-label={`Remove student ${index + 1}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Student Full Name <span className="text-blue-700">*</span>
                        </label>
                        <input
                          type="text"
                          value={student.name}
                          onChange={(e) => updateStudent(student.id, 'name', e.target.value)}
                          onKeyDown={(e) => handleFieldKeyDown(e)}
                          placeholder="e.g. Abrar Rahman"
                          autoCapitalize="words"
                          autoComplete="name"
                          enterKeyHint="next"
                          className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-slate-900 text-base md:text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">
                            Student ID <span className="text-blue-700">*</span>
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={student.studentId}
                            onChange={(e) => updateStudent(student.id, 'studentId', e.target.value)}
                            onKeyDown={(e) => handleFieldKeyDown(e)}
                            placeholder="e.g. 22301045"
                            autoComplete="off"
                            enterKeyHint="next"
                            className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 font-mono-code tabular-nums text-slate-900 text-base md:text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">
                            Section (Optional)
                          </label>
                          <input
                            type="text"
                            value={student.section || ''}
                            onChange={(e) => updateStudent(student.id, 'section', e.target.value)}
                            onKeyDown={(e) => handleFieldKeyDown(e)}
                            placeholder="e.g. 04"
                            autoCapitalize="characters"
                            enterKeyHint="next"
                            className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-slate-900 text-base md:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Faculty & Submission Date */}
            <div className="space-y-4 pt-2 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Faculty & Submission Date</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                    Submitted To (Instructor Name)
                  </label>
                  <input
                    type="text"
                    value={data.teacherName}
                    onChange={(e) => updateField('teacherName', e.target.value)}
                    onKeyDown={(e) => handleFieldKeyDown(e)}
                    placeholder="e.g. Dr. Sadia Hamid Kazi"
                    autoCapitalize="words"
                    enterKeyHint="next"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-slate-900 font-medium text-base md:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                    Instructor Designation (Optional)
                  </label>
                  <input
                    type="text"
                    value={data.teacherDesignation}
                    onChange={(e) => updateField('teacherDesignation', e.target.value)}
                    onKeyDown={(e) => handleFieldKeyDown(e)}
                    placeholder="e.g. Associate Professor & Chairperson"
                    autoCapitalize="words"
                    enterKeyHint="next"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-slate-900 text-base md:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                  Submission Date
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={data.submissionDate}
                    onChange={(e) => updateField('submissionDate', e.target.value)}
                    onKeyDown={(e) => handleFieldKeyDown(e, true)}
                    placeholder="e.g. November 15, 2026"
                    className="flex-1 h-11 px-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-slate-900 text-base md:text-sm"
                  />

                  {/* Native Date Picker Helper button for touch devices */}
                  <input
                    ref={nativeDatePickerRef}
                    type="date"
                    value={parseFormattedDateToISO(data.submissionDate)}
                    onChange={(e) => {
                      if (e.target.value) {
                        updateField('submissionDate', parseISOToFormattedDate(e.target.value));
                      }
                    }}
                    className="sr-only"
                    tabIndex={-1}
                    aria-hidden="true"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      if (nativeDatePickerRef.current) {
                        try {
                          if ('showPicker' in HTMLInputElement.prototype) {
                            nativeDatePickerRef.current.showPicker();
                          } else {
                            nativeDatePickerRef.current.focus();
                          }
                        } catch {
                          nativeDatePickerRef.current.focus();
                        }
                      }
                    }}
                    className="h-11 px-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-xl font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5"
                    title="Select date with calendar"
                    aria-label="Pick date"
                  >
                    <Calendar className="w-4 h-4 text-blue-700" />
                    <span className="hidden sm:inline">Pick</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      const formatted = now.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      });
                      updateField('submissionDate', formatted);
                    }}
                    className="h-11 px-3.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs transition-colors shrink-0"
                  >
                    Today
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Project Fields */}
            <div className="pt-2 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Custom Project Fields</h4>
                  <p className="text-xs text-slate-500">Add parameters like Lab Group, Room No, etc.</p>
                </div>
                <button
                  type="button"
                  onClick={addCustomField}
                  className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 rounded-xl font-semibold text-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Field
                </button>
              </div>

              {data.customFields.length > 0 && (
                <div className="space-y-2">
                  {data.customFields.map((cf) => (
                    <div
                      key={cf.id}
                      id={cf.id}
                      className="flex items-center gap-2 p-2 bg-slate-50/60 rounded-xl border border-slate-200"
                    >
                      <input
                        type="text"
                        value={cf.label}
                        onChange={(e) => updateCustomField(cf.id, 'label', e.target.value)}
                        placeholder="Label (e.g. Lab Group)"
                        className="w-1/3 h-10 px-3 rounded-lg border border-slate-300 text-slate-900 text-base md:text-xs font-medium"
                      />
                      <input
                        type="text"
                        value={cf.value}
                        onChange={(e) => updateCustomField(cf.id, 'value', e.target.value)}
                        placeholder="Value (e.g. Group B)"
                        className="flex-1 h-10 px-3 rounded-lg border border-slate-300 text-slate-900 text-base md:text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => removeCustomField(cf.id)}
                        className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-rose-600 active:text-rose-700 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Remove field"
                        aria-label="Remove custom field"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Optional Field Toggles Drawer */}
            <div className="pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowToggles(!showToggles)}
                className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-900 py-1 transition-colors min-h-[44px]"
              >
                <Sliders className="w-3.5 h-3.5 text-blue-700" />
                <span>{showToggles ? 'Hide Field Visibility Options' : 'Show Optional Field Toggles'}</span>
              </button>

              {showToggles && (
                <div className="mt-3 divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                  {[
                    { key: 'showDepartment', label: 'Department Name' },
                    { key: 'showAssignmentNo', label: 'Assignment Number / Badge' },
                    { key: 'showCourseCode', label: 'Course Code' },
                    { key: 'showSemester', label: 'Semester' },
                    { key: 'showSection', label: 'Section' },
                    { key: 'showTeacherDesignation', label: 'Teacher Designation' },
                    { key: 'showDate', label: 'Submission Date' },
                  ].map(({ key, label }) => {
                    const k = key as keyof CoverPageData['visibility'];
                    const isShown = data.visibility[k];

                    return (
                      <div key={key} className="flex items-center justify-between p-2.5 hover:bg-slate-100/50">
                        <span className="text-xs font-semibold text-slate-700">{label}</span>
                        <button
                          type="button"
                          onClick={() => updateVisibility(k, !isShown)}
                          className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                            isShown
                              ? 'bg-blue-100 text-blue-900 border border-blue-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {isShown ? (
                            <>
                              <Eye className="w-3.5 h-3.5 text-blue-700" /> Shown
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-slate-400" /> Hidden
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Step Navigation Bottom Bar */}
      <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
        {currentStep === 1 ? (
          <div className="text-xs text-slate-400 hidden sm:block">
            Next: Enter student & assignment info
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onNavigateStep(1)}
            className="flex items-center justify-center gap-1.5 px-4 h-11 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-200 rounded-xl transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        )}

        {currentStep === 1 ? (
          <button
            type="button"
            disabled={!canProceedFromStep1}
            onClick={() => onNavigateStep(2)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 h-11 text-xs font-extrabold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 disabled:opacity-50 rounded-xl transition-colors shadow-xs ml-auto"
            title="Next Step (Ctrl+Enter)"
          >
            <span>Next: Assignment & Students</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={!canProceedFromStep2}
            onClick={() => onNavigateStep(3)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 h-11 text-xs font-extrabold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 disabled:opacity-50 rounded-xl transition-colors shadow-xs ml-auto"
            title="Next Step (Ctrl+Enter)"
          >
            <span>Next: Choose Template & Export</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

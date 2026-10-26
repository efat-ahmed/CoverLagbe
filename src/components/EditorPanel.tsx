/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CoverPageData,
  StudentInfo,
  CustomField,
} from '../types/coverPage';
import { SEMESTER_EXAMPLES, SAMPLE_PROJECTS } from '../config/constants';
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
  CheckCircle2,
} from 'lucide-react';
import { WorkflowStep } from './StepProgressBar';

interface EditorPanelProps {
  data: CoverPageData;
  onChange: (data: CoverPageData) => void;
  onLoadPreset: (presetKey: string) => void;
  currentStep: WorkflowStep;
  onNavigateStep: (step: WorkflowStep) => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  data,
  onChange,
  onLoadPreset,
  currentStep,
  onNavigateStep,
}) => {
  const [showToggles, setShowToggles] = useState(false);

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

  // Student management
  const addStudent = () => {
    const newStudent: StudentInfo = {
      id: `student-${Date.now()}`,
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
    const newField: CustomField = {
      id: `cf-${Date.now()}`,
      label: 'New Field',
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

  // Step 1 Validation
  const canProceedFromStep1 =
    (data.universityName?.trim().length ?? 0) > 0 &&
    (data.courseTitle?.trim().length ?? 0) > 0;

  // Step 2 Validation
  const canProceedFromStep2 =
    (data.assignmentTitle?.trim().length ?? 0) > 0 &&
    data.students.length > 0 &&
    (data.students[0].name?.trim().length ?? 0) > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col h-full overflow-hidden">
      {/* Step Header */}
      <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            {currentStep === 1 ? 'Step 1: University & Course Information' : 'Step 2: Assignment & Student Details'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentStep === 1
              ? 'Enter academic institution, course code, and semester.'
              : 'Add your assignment topic, student IDs, and instructor.'}
          </p>
        </div>
        <span className="text-xs font-bold text-blue-900 bg-blue-100/70 border border-blue-200/70 px-2.5 py-1 rounded-full shrink-0">
          Step {currentStep} of 3
        </span>
      </div>

      {/* Form Body with Smooth Scroll & Mobile Sizing */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-slate-700">
        {/* STEP 1 FORM: UNIVERSITY & COURSE */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Quick Presets Bar */}
            <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <span className="text-blue-950 font-semibold flex items-center gap-1.5 text-xs">
                <Sparkles className="w-4 h-4 text-blue-700 shrink-0" />
                Quick Course Presets:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => onLoadPreset('bracSingle')}
                  className="px-2.5 py-1.5 bg-white hover:bg-blue-100 text-blue-900 rounded-lg font-medium text-xs border border-blue-200 transition-colors shadow-2xs"
                >
                  CSE220
                </button>
                <button
                  type="button"
                  onClick={() => onLoadPreset('groupProject')}
                  className="px-2.5 py-1.5 bg-white hover:bg-blue-100 text-blue-900 rounded-lg font-medium text-xs border border-blue-200 transition-colors shadow-2xs"
                >
                  EEE451 Project
                </button>
                <button
                  type="button"
                  onClick={() => onLoadPreset('researchThesis')}
                  className="px-2.5 py-1.5 bg-white hover:bg-blue-100 text-blue-900 rounded-lg font-medium text-xs border border-blue-200 transition-colors shadow-2xs"
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
                  placeholder="BRAC University"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 font-semibold text-slate-900 text-base sm:text-sm"
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
                  placeholder="e.g. Department of Computer Science and Engineering"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-slate-900 text-base sm:text-sm"
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
                  placeholder="e.g. CSE220"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 font-mono-code font-bold text-slate-900 uppercase text-base sm:text-sm"
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
                  placeholder="e.g. Data Structures and Algorithms"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-slate-900 font-medium text-base sm:text-sm"
                />
              </div>
            </div>

            {/* Semester Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs sm:text-sm font-bold text-slate-900">
                  Semester <span className="text-blue-700">*</span>
                </label>
                <span className="text-xs text-slate-400">e.g. Fall 26</span>
              </div>
              <input
                type="text"
                value={data.semester}
                onChange={(e) => updateField('semester', e.target.value)}
                placeholder="Fall 26"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 font-semibold text-slate-900 text-base sm:text-sm"
              />
              {/* Quick Pick suggestions */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span className="text-xs text-slate-400 mr-0.5">Quick picks:</span>
                {SEMESTER_EXAMPLES.map((sem) => (
                  <button
                    key={sem}
                    type="button"
                    onClick={() => updateField('semester', sem)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      data.semester === sem
                        ? 'bg-blue-700 text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
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
                  className="w-full p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 font-medium text-slate-900 leading-relaxed text-base sm:text-sm"
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
                  placeholder="e.g. Assignment 02 or Term Paper"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-slate-900 text-base sm:text-sm"
                />
              </div>
            </div>

            {/* Student Contributors */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Student Contributors</h3>
                  <p className="text-xs text-slate-500">Supports single and group assignment submissions.</p>
                </div>
                <button
                  type="button"
                  onClick={addStudent}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-xl font-bold text-xs border border-blue-200 transition-colors"
                >
                  <Plus className="w-4 h-4 text-blue-700" />
                  Add Member
                </button>
              </div>

              <div className="space-y-3.5">
                {data.students.map((student, index) => (
                  <div
                    key={student.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Student #{index + 1}</span>
                      {data.students.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStudent(student.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                          title="Remove student"
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
                          placeholder="e.g. Abrar Rahman"
                          className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-slate-900 text-base sm:text-xs"
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
                            value={student.studentId}
                            onChange={(e) => updateStudent(student.id, 'studentId', e.target.value)}
                            placeholder="e.g. 22301045"
                            className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 font-mono-code tabular-nums text-slate-900 text-base sm:text-xs"
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
                            placeholder="e.g. 04"
                            className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-slate-900 text-base sm:text-xs"
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
                    placeholder="e.g. Dr. Sadia Hamid Kazi"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-slate-900 font-medium text-base sm:text-sm"
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
                    placeholder="e.g. Associate Professor & Chairperson"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-slate-900 text-base sm:text-sm"
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
                    placeholder="e.g. November 15, 2026"
                    className="flex-1 h-11 px-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-slate-900 text-base sm:text-sm"
                  />
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
                    className="h-11 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors shrink-0"
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
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold text-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Field
                </button>
              </div>

              {data.customFields.length > 0 && (
                <div className="space-y-2">
                  {data.customFields.map((cf) => (
                    <div key={cf.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={cf.label}
                        onChange={(e) => updateCustomField(cf.id, 'label', e.target.value)}
                        placeholder="Label (e.g. Lab Group)"
                        className="w-1/3 h-10 px-3 rounded-lg border border-slate-300 text-slate-900 text-xs font-medium"
                      />
                      <input
                        type="text"
                        value={cf.value}
                        onChange={(e) => updateCustomField(cf.id, 'value', e.target.value)}
                        placeholder="Value (e.g. Group B)"
                        className="flex-1 h-10 px-3 rounded-lg border border-slate-300 text-slate-900 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => removeCustomField(cf.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Remove field"
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
                className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-900 transition-colors"
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
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                            isShown
                              ? 'bg-blue-100 text-blue-900 border border-blue-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {isShown ? (
                            <>
                              <Eye className="w-3 h-3 text-blue-700" /> Shown
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-slate-400" /> Hidden
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
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
        {currentStep === 1 ? (
          <div className="text-xs text-slate-400 hidden sm:block">
            Next: Enter student & assignment info
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onNavigateStep(1)}
            className="flex items-center justify-center gap-1.5 px-4 h-11 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-2xs"
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
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 h-11 text-xs font-extrabold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 rounded-xl transition-colors shadow-xs ml-auto"
          >
            <span>Next: Assignment & Students</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={!canProceedFromStep2}
            onClick={() => onNavigateStep(3)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 h-11 text-xs font-extrabold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 rounded-xl transition-colors shadow-xs ml-auto"
          >
            <span>Next: Choose Template & Export</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

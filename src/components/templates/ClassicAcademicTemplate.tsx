/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CoverPageData, AccentColorConfig } from '../../types/coverPage';
import { UniversityLogo } from './UniversityLogo';

interface TemplateProps {
  data: CoverPageData;
  logoUrl: string | null;
  isLogoConfigured: boolean;
  accentColor: AccentColorConfig;
}

export const ClassicAcademicTemplate: React.FC<TemplateProps> = ({
  data,
  logoUrl,
  isLogoConfigured,
  accentColor,
}) => {
  const { visibility } = data;

  const fontClass =
    data.fontChoice === 'modern-sans'
      ? 'font-sans-modern'
      : data.fontChoice === 'editorial-serif'
      ? 'font-serif-classic'
      : 'font-serif-academic';

  return (
    <div className="relative w-full h-full bg-white text-slate-900 flex flex-col justify-between p-12 overflow-hidden select-none">
      {/* CLASSIC FORMAL ACADEMIC DOUBLE-RULE BORDER */}
      <div
        className="absolute inset-5 pointer-events-none border-2"
        style={{ borderColor: accentColor.primary }}
      >
        <div
          className="absolute inset-1.5 border border-slate-300 pointer-events-none"
        />
        {/* Subtle decorative corner squares */}
        <div
          className="absolute -top-1 -left-1 w-2.5 h-2.5"
          style={{ backgroundColor: accentColor.primary }}
        />
        <div
          className="absolute -top-1 -right-1 w-2.5 h-2.5"
          style={{ backgroundColor: accentColor.primary }}
        />
        <div
          className="absolute -bottom-1 -left-1 w-2.5 h-2.5"
          style={{ backgroundColor: accentColor.primary }}
        />
        <div
          className="absolute -bottom-1 -right-1 w-2.5 h-2.5"
          style={{ backgroundColor: accentColor.primary }}
        />
      </div>

      {/* TOP INSTITUTION SECTION */}
      <div className="relative z-10 flex flex-col items-center text-center pt-3">
        {/* University Official Monogram Logo */}
        {visibility.showLogo && (
          <div className="mb-4 flex items-center justify-center">
            <UniversityLogo
              logoUrl={logoUrl}
              isConfigured={isLogoConfigured}
              size={data.logoSize || 'medium'}
              universityName={data.universityName}
            />
          </div>
        )}

        {/* University Name */}
        <h1
          className={`${fontClass} text-2xl font-bold tracking-[0.22em] uppercase max-w-[620px] transition-colors`}
          style={{ color: accentColor.primary }}
        >
          {data.universityName || 'BRAC UNIVERSITY'}
        </h1>

        {/* Department Name */}
        {visibility.showDepartment && data.departmentName?.trim() && (
          <p className="text-xs uppercase tracking-[0.18em] text-slate-600 mt-1.5 max-w-[580px] font-sans-modern font-semibold">
            {data.departmentName}
          </p>
        )}

        {/* Elegant Academic Emblem Divider */}
        <div className="flex items-center justify-center gap-2.5 my-3.5 w-56 opacity-85">
          <div className="h-[1px] flex-1 bg-slate-300" />
          <div
            className="w-2 h-2 rotate-45"
            style={{ backgroundColor: accentColor.primary }}
          />
          <div className="h-[1px] flex-1 bg-slate-300" />
        </div>
      </div>

      {/* CENTER ASSIGNMENT & COURSE BODY SECTION */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto py-4 px-6 max-w-[660px] mx-auto w-full">
        {/* Course Code & Title Academic Header */}
        {(Boolean(visibility.showCourseCode && data.courseCode?.trim()) || Boolean(data.courseTitle?.trim())) && (
          <div className="mb-3.5 flex flex-col items-center gap-1 font-sans-modern">
            <div className="inline-flex items-center justify-center flex-wrap gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
              {visibility.showCourseCode && data.courseCode?.trim() && (
                <span
                  className="font-mono-code font-bold px-2.5 py-0.5 rounded text-[11px]"
                  style={{
                    backgroundColor: accentColor.tint,
                    color: accentColor.primary,
                    border: `1px solid ${accentColor.border}`,
                  }}
                >
                  {data.courseCode}
                </span>
              )}
              {data.courseTitle?.trim() && (
                <span className="text-slate-800 tracking-wide">{data.courseTitle}</span>
              )}
            </div>
          </div>
        )}

        {/* Assignment Number Kicker */}
        {visibility.showAssignmentNo && data.assignmentNumber?.trim() && (
          <span
            className="text-[11px] font-bold uppercase tracking-[0.22em] mb-2 px-3 py-0.5 rounded-sm"
            style={{ color: accentColor.primary, backgroundColor: accentColor.tint }}
          >
            {data.assignmentNumber}
          </span>
        )}

        {/* Main Assignment Title */}
        <div className="my-2 max-w-[600px]">
          <h2
            className={`${fontClass} text-[27px] leading-[1.32] font-bold text-slate-900 tracking-tight text-balance break-words`}
          >
            {data.assignmentTitle || 'Assignment Topic Title'}
          </h2>
        </div>

        {/* Semester Indicator */}
        {visibility.showSemester && data.semester?.trim() && (
          <div className="mt-3.5 inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-slate-200 bg-slate-50/70 font-sans-modern">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor.primary }} />
            <span className="text-xs uppercase font-medium text-slate-600 tracking-wider">
              Semester: <span className="font-bold text-slate-900">{data.semester}</span>
            </span>
          </div>
        )}
      </div>

      {/* BOTTOM FORMAL ACADEMIC SUBMISSION SECTION */}
      <div className="relative z-10 w-full pt-4">
        {/* Upper Light-Gray Horizontal Dividers: perfectly aligned on the same horizontal axis with balanced central gap */}
        <div className="grid grid-cols-2 gap-8 max-w-[650px] mx-auto mb-4">
          <div className="h-[1.5px] bg-slate-200 w-full" />
          <div className="h-[1.5px] bg-slate-200 w-full" />
        </div>

        {/* Two-Column Formal Balanced Grid */}
        <div className="grid grid-cols-2 gap-8 max-w-[650px] mx-auto">
          {/* SUBMITTED BY COLUMN */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2 mb-3 pb-1 border-b" style={{ borderColor: accentColor.border }}>
              <span className="w-2 h-2 rounded-xs" style={{ backgroundColor: accentColor.primary }} />
              <h3
                className="font-bold uppercase tracking-[0.18em] text-[13px] font-sans-modern leading-normal"
                style={{ color: accentColor.primary }}
              >
                Submitted By:
              </h3>
            </div>

            <div className="space-y-3.5">
              {data.students.map((student, idx) => (
                <div key={student.id || idx} className="space-y-1">
                  <p className="font-bold text-slate-900 text-[14.5px]">
                    {student.name?.trim() || 'Student Name'}
                  </p>
                  {student.studentId?.trim() && (
                    <p className="text-slate-700 font-mono-code tabular-nums text-[13px]">
                      <span className="text-slate-400 font-sans font-normal">Student ID: </span>
                      <span className="font-semibold text-slate-800">{student.studentId}</span>
                    </p>
                  )}
                  {visibility.showSection && student.section?.trim() && (
                    <p className="text-slate-600 text-[13px]">
                      <span className="text-slate-400 font-sans font-normal">Section: </span>
                      <span className="font-medium">{student.section}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SUBMITTED TO COLUMN */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2 mb-3 pb-1 border-b" style={{ borderColor: accentColor.border }}>
              <span className="w-2 h-2 rounded-xs" style={{ backgroundColor: accentColor.primary }} />
              <h3
                className="font-bold uppercase tracking-[0.18em] text-[13px] font-sans-modern leading-normal"
                style={{ color: accentColor.primary }}
              >
                Submitted To:
              </h3>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-slate-900 text-[14.5px]">
                {data.teacherName?.trim() || 'Faculty / Instructor Name'}
              </p>
              {visibility.showTeacherDesignation && data.teacherDesignation?.trim() && (
                <p className="text-slate-700 text-[13px] font-medium leading-snug">
                  {data.teacherDesignation}
                </p>
              )}
              {visibility.showDepartment && data.departmentName?.trim() && (
                <p className="text-slate-500 text-[12px] leading-tight mt-0.5 font-medium">
                  {data.departmentName}
                </p>
              )}
              <p className="text-slate-500 text-[12px] font-medium">{data.universityName || 'BRAC University'}</p>
            </div>
          </div>
        </div>

        {/* Custom Fields Footnote */}
        {visibility.showCustomFields && data.customFields && data.customFields.length > 0 && (
          <div className="mt-4 max-w-[650px] mx-auto pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-center gap-5 text-[11px] text-slate-600">
            {data.customFields
              .filter((cf) => cf.label?.trim() && cf.value?.trim())
              .map((cf) => (
                <span key={cf.id} className="inline-flex items-center gap-1.5">
                  <span className="font-semibold text-slate-700">{cf.label}:</span>
                  <span className="font-mono-code tabular-nums text-slate-900">{cf.value}</span>
                </span>
              ))}
          </div>
        )}

        {/* Bottom Submission Date */}
        {visibility.showDate && data.submissionDate?.trim() && (
          <div className="mt-5 pt-3 text-center text-[11px] tracking-wide text-slate-600 font-sans-modern border-t border-slate-200">
            <span>Date of Submission: </span>
            <span className="font-bold text-slate-900">{data.submissionDate}</span>
          </div>
        )}
      </div>
    </div>
  );
};

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

export const ModernBlueTemplate: React.FC<TemplateProps> = ({
  data,
  logoUrl,
  isLogoConfigured,
  accentColor,
}) => {
  const { visibility } = data;

  const fontClass =
    data.fontChoice === 'classic-serif'
      ? 'font-serif-academic'
      : data.fontChoice === 'editorial-serif'
      ? 'font-serif-classic'
      : 'font-sans-modern';

  return (
    <div className="relative w-full h-full bg-white text-slate-900 flex flex-col justify-between p-12 overflow-hidden select-none">
      {/* Top Professional University Blue Accent Stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-2"
        style={{ backgroundColor: accentColor.primary }}
      />
      {/* Subtle corner architectural accent */}
      <div
        className="absolute top-2 right-0 w-28 h-1 opacity-50"
        style={{ backgroundColor: accentColor.secondary }}
      />

      {/* TOP HEADER: Asymmetric Blue Identity Lockup */}
      <div className="flex items-start justify-between gap-6 pt-2 pb-5 border-b border-slate-100">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2.5 h-2.5 rounded-xs"
              style={{ backgroundColor: accentColor.primary }}
            />
            <p
              className="text-xs font-extrabold tracking-[0.22em] uppercase font-sans-modern"
              style={{ color: accentColor.primary }}
            >
              {data.universityName || 'BRAC UNIVERSITY'}
            </p>
          </div>
          {visibility.showDepartment && data.departmentName?.trim() && (
            <p className="text-xs text-slate-600 font-medium pl-4 leading-snug">
              {data.departmentName}
            </p>
          )}
        </div>

        {visibility.showLogo && (
          <div className="shrink-0">
            <UniversityLogo
              logoUrl={logoUrl}
              isConfigured={isLogoConfigured}
              size={data.logoSize}
              universityName={data.universityName}
            />
          </div>
        )}
      </div>

      {/* CENTER: Hero Assignment Title & Course Info */}
      <div className="my-auto py-4">
        {/* Course Code & Semester Kicker */}
        <div className="flex items-center flex-wrap gap-2 mb-3 text-xs font-semibold">
          {visibility.showAssignmentNo && data.assignmentNumber?.trim() && (
            <span
              className="px-2.5 py-0.5 rounded font-mono-code text-[11px] font-bold uppercase tracking-wider"
              style={{
                backgroundColor: accentColor.tint,
                color: accentColor.primary,
                border: `1px solid ${accentColor.border}`,
              }}
            >
              {data.assignmentNumber}
            </span>
          )}
          {visibility.showCourseCode && data.courseCode?.trim() && (
            <span className="font-mono-code text-xs font-bold text-slate-700">
              {data.courseCode}
            </span>
          )}
          {data.courseTitle?.trim() && (
            <>
              <span className="text-slate-300">·</span>
              <span className="text-slate-700 tracking-wide">{data.courseTitle}</span>
            </>
          )}
          {visibility.showSemester && data.semester?.trim() && (
            <>
              <span className="text-slate-300">/</span>
              <span
                className="font-bold uppercase tracking-wider text-[11px] px-2 py-0.5 rounded"
                style={{ backgroundColor: accentColor.tint, color: accentColor.primary }}
              >
                Semester: {data.semester}
              </span>
            </>
          )}
        </div>

        {/* Assignment Title with Left Blue Accent */}
        <div className="border-l-4 pl-5 py-1.5" style={{ borderColor: accentColor.primary }}>
          <h2
            className={`${fontClass} text-3xl font-extrabold text-slate-900 leading-[1.25] tracking-tight text-balance break-words`}
          >
            {data.assignmentTitle || 'Assignment Title'}
          </h2>
        </div>
      </div>

      {/* BOTTOM: Structured Surface Cards */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="grid grid-cols-2 gap-4">
          {/* Student(s) Card */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200">
            <div className="flex items-center gap-1.5 mb-2.5">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: accentColor.primary }}
              />
              <p
                className="text-[12px] font-bold uppercase tracking-wider font-sans-modern"
                style={{ color: accentColor.primary }}
              >
                Submitted By
              </p>
            </div>

            <div className="space-y-3">
              {data.students.map((student, idx) => (
                <div key={student.id || idx} className="space-y-0.5">
                  <p className="font-bold text-slate-900 text-[14.5px]">
                    {student.name?.trim() || 'Student Name'}
                  </p>
                  {student.studentId?.trim() && (
                    <p className="font-mono-code tabular-nums text-[13px] text-slate-600">
                      <span className="text-slate-400 font-sans">ID: </span>
                      {student.studentId}
                    </p>
                  )}
                  {visibility.showSection && student.section?.trim() && (
                    <p className="text-[13px] text-slate-500 pt-0.5">
                      <span>Section: {student.section}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Instructor Card */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: accentColor.primary }}
                />
                <p
                  className="text-[12px] font-bold uppercase tracking-wider font-sans-modern"
                  style={{ color: accentColor.primary }}
                >
                  Submitted To
                </p>
              </div>

              <p className="font-bold text-slate-900 text-[14.5px]">
                {data.teacherName?.trim() || 'Faculty Name'}
              </p>
              {visibility.showTeacherDesignation && data.teacherDesignation?.trim() && (
                <p className="text-slate-600 text-[13px] mt-0.5">{data.teacherDesignation}</p>
              )}
              {visibility.showDepartment && data.departmentName?.trim() && (
                <p className="text-slate-500 text-[12px] mt-1">{data.departmentName}</p>
              )}
            </div>

            {visibility.showDate && data.submissionDate?.trim() && (
              <div className="pt-3 border-t border-slate-200 mt-3 text-[11px] text-slate-600">
                <span className="text-slate-400">Date: </span>
                <span className="font-semibold text-slate-800">{data.submissionDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Custom Metadata row */}
        {visibility.showCustomFields && data.customFields && data.customFields.length > 0 && (
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-600 px-1">
            {data.customFields
              .filter((cf) => cf.label?.trim() && cf.value?.trim())
              .map((cf) => (
                <div key={cf.id} className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">{cf.label}:</span>
                  <span className="font-mono-code font-semibold text-slate-800">{cf.value}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

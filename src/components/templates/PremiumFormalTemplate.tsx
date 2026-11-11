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

export const PremiumFormalTemplate = React.memo<TemplateProps>(({
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

  const isCompact = data.students.length > 3;

  return (
    <div className="relative w-full h-full bg-white text-slate-900 flex flex-col justify-between overflow-hidden select-none">
      {/* TOP EXECUTIVE ACCENT HEADER BAND */}
      <div
        className={`shrink-0 w-full ${isCompact ? 'px-8 py-3.5' : 'px-10 py-5'} text-white flex items-center justify-between gap-6`}
        style={{ backgroundColor: accentColor.primary }}
      >
        <div className="min-w-0 flex-1 space-y-1">
          <h1 className="text-[12px] font-bold tracking-[0.18em] uppercase text-white/95 leading-snug break-words">
            {data.universityName || 'BRAC UNIVERSITY'}
          </h1>
          {visibility.showDepartment && data.departmentName?.trim() && (
            <p className="text-xs text-white/85 font-normal tracking-wide leading-normal break-words">
              {data.departmentName}
            </p>
          )}
        </div>

        {visibility.showLogo && (
          <div className="bg-white p-2 rounded-lg shadow-xs shrink-0">
            <UniversityLogo
              logoUrl={logoUrl}
              isConfigured={isLogoConfigured}
              size="small"
              universityName={data.universityName}
            />
          </div>
        )}
      </div>

      {/* MAIN BODY AREA */}
      <div className={`flex-1 w-full min-h-0 ${isCompact ? 'px-8 py-2' : 'px-10 py-5'} flex flex-col justify-between`}>
        {/* Document Classification & Title Block */}
        <div className={`${isCompact ? 'my-1 py-1' : 'my-auto py-2'}`}>
          {/* Classification Tags */}
          <div className="flex items-center flex-wrap gap-2 mb-2">
            {visibility.showAssignmentNo && data.assignmentNumber?.trim() && (
              <span
                className="px-2.5 py-0.5 rounded font-mono-code font-bold text-xs uppercase"
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
              <span className="font-mono-code text-xs font-semibold text-slate-600">
                [{data.courseCode}]
              </span>
            )}
            {visibility.showSemester && data.semester?.trim() && (
              <span className="text-xs font-bold text-slate-700">
                · Semester: {data.semester}
              </span>
            )}
          </div>

          {/* Assignment Title */}
          <h2
            className={`${fontClass} ${isCompact ? 'text-[22px] leading-snug' : 'text-[26px] leading-[1.3]'} font-extrabold text-slate-950 tracking-tight text-balance break-words`}
          >
            {data.assignmentTitle || 'Assignment Report Title'}
          </h2>

          {data.courseTitle?.trim() && (
            <p className={`text-sm font-semibold text-slate-600 ${isCompact ? 'mt-1' : 'mt-2'} tracking-wide font-sans-modern`}>
              Course: {data.courseTitle}
            </p>
          )}

          <div className={`w-16 ${isCompact ? 'h-0.5 mt-2' : 'h-1 mt-4'}`} style={{ backgroundColor: accentColor.primary }} />
        </div>

        {/* STRUCTURED TABULAR STUDENTS & FACULTY SECTION */}
        <div className={`shrink-0 ${isCompact ? 'space-y-2 pt-1' : 'space-y-4 pt-3'}`}>
          {/* Students Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div
              className={`${isCompact ? 'px-3 py-1.5 text-[11px]' : 'px-4 py-2 text-[12px]'} font-bold uppercase tracking-wider flex items-center justify-between`}
              style={{ backgroundColor: accentColor.tint, color: accentColor.primary }}
            >
              <span>Prepared By Student(s)</span>
              <span>{data.students.length} Contributor{data.students.length > 1 ? 's' : ''}</span>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b border-slate-200 bg-slate-50/60 ${isCompact ? 'text-[11px]' : 'text-[12px]'} text-slate-600 font-semibold uppercase`}>
                  <th className={`${isCompact ? 'py-1 px-3' : 'py-2 px-4'}`}>Student Name</th>
                  <th className={`${isCompact ? 'py-1 px-2.5' : 'py-2 px-3'}`}>Student ID</th>
                  {visibility.showSection && <th className={`${isCompact ? 'py-1 px-2.5' : 'py-2 px-3'}`}>Section</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.students.map((student, idx) => (
                  <tr key={student.id || idx} className="hover:bg-slate-50/40">
                    <td className={`${isCompact ? 'py-1 px-3 text-[12.5px]' : 'py-2.5 px-4 text-[14.5px]'} font-bold text-slate-900 leading-tight`}>
                      {student.name?.trim() || '—'}
                    </td>
                    <td className={`${isCompact ? 'py-1 px-2.5 text-[11.5px]' : 'py-2.5 px-3 text-[13px]'} font-mono-code tabular-nums text-slate-800 font-semibold leading-tight`}>
                      {student.studentId?.trim() || '—'}
                    </td>
                    {visibility.showSection && (
                      <td className={`${isCompact ? 'py-1 px-2.5 text-[11.5px]' : 'py-2.5 px-3 text-[13px]'} text-slate-700 leading-tight`}>
                        {student.section?.trim() || '—'}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Faculty / Submitted To & Custom Specs Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Faculty block */}
            <div className={`${isCompact ? 'p-2.5' : 'p-3.5'} rounded-lg border border-slate-200 bg-slate-50/50`}>
              <p
                className={`text-[12px] font-bold uppercase tracking-wider ${isCompact ? 'mb-0.5' : 'mb-1'} font-sans-modern`}
                style={{ color: accentColor.primary }}
              >
                Prepared For
              </p>
              <p className={`font-bold text-slate-900 ${isCompact ? 'text-[13px] leading-tight' : 'text-[14.5px]'}`}>
                {data.teacherName?.trim() || 'Faculty Name'}
              </p>
              {visibility.showTeacherDesignation && data.teacherDesignation?.trim() && (
                <p className={`text-slate-700 ${isCompact ? 'text-[11.5px] leading-tight' : 'text-[13px]'}`}>{data.teacherDesignation}</p>
              )}
              {visibility.showDepartment && data.departmentName?.trim() && (
                <p className={`text-slate-500 ${isCompact ? 'text-[11px] leading-tight' : 'text-[12px]'} mt-0.5`}>{data.departmentName}</p>
              )}
            </div>

            {/* Custom parameters block */}
            <div className={`${isCompact ? 'p-2.5' : 'p-3.5'} rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between`}>
              <p
                className={`text-[10px] font-bold uppercase tracking-wider ${isCompact ? 'mb-0.5' : 'mb-1'} font-sans-modern`}
                style={{ color: accentColor.primary }}
              >
                Submission Details
              </p>
              {visibility.showDate && data.submissionDate?.trim() && (
                <div className="text-xs text-slate-700">
                  <span className="text-slate-400 text-[11px]">Date: </span>
                  <span className="font-semibold">{data.submissionDate}</span>
                </div>
              )}
              {visibility.showCustomFields && data.customFields && data.customFields.length > 0 && (
                <div className="space-y-1 mt-1 text-[11px]">
                  {data.customFields
                    .filter((cf) => cf.label?.trim() && cf.value?.trim())
                    .slice(0, 2)
                    .map((cf) => (
                      <div key={cf.id} className="flex items-center justify-between">
                        <span className="text-slate-500">{cf.label}:</span>
                        <span className="font-mono-code font-semibold text-slate-800">{cf.value}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* EXECUTIVE FOOTER BAR */}
      <div className={`shrink-0 w-full ${isCompact ? 'px-8 py-2' : 'px-10 py-2.5'} bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-sans-modern`}>
        <span>Official Academic Coursework Document</span>
        <span>Faculty Evaluation Copy</span>
        {visibility.showDate && data.submissionDate?.trim() && (
          <span>{data.submissionDate}</span>
        )}
      </div>
    </div>
  );
});

PremiumFormalTemplate.displayName = 'PremiumFormalTemplate';

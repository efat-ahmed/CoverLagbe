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

export const EditorialStyleTemplate: React.FC<TemplateProps> = ({
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
      {/* Editorial Top Lockup */}
      <div className="shrink-0 w-full border-b-2 pb-5" style={{ borderColor: accentColor.primary }}>
        <div className="flex items-center justify-between gap-6">
          <div className="min-w-0 flex-1 pr-4">
            <span
              className="text-[10px] font-bold tracking-[0.2em] uppercase block mb-1 font-sans-modern"
              style={{ color: accentColor.primary }}
            >
              Academic Coursework & Research
            </span>
            <h1 className="text-xl font-bold tracking-tight uppercase text-slate-900 font-sans-modern leading-snug break-words">
              {data.universityName || 'BRAC UNIVERSITY'}
            </h1>
            {visibility.showDepartment && data.departmentName?.trim() && (
              <p className="text-xs text-slate-600 mt-1 font-medium leading-normal break-words">
                {data.departmentName}
              </p>
            )}
          </div>

          {visibility.showLogo && (
            <div className="shrink-0 p-1 bg-white">
              <UniversityLogo
                logoUrl={logoUrl}
                isConfigured={isLogoConfigured}
                size={data.logoSize}
                universityName={data.universityName}
              />
            </div>
          )}
        </div>
      </div>

      {/* CENTER: Strong Editorial Title Area */}
      <div className="flex-1 w-full min-h-0 flex flex-col justify-center py-6">
        {/* Course, Semester & Assignment Header */}
        <div className="flex items-center flex-wrap gap-3 text-xs font-semibold text-slate-600 mb-4 pb-2 border-b border-slate-100">
          {visibility.showCourseCode && data.courseCode?.trim() && (
            <span
              className="px-2 py-0.5 rounded font-mono-code font-bold text-xs"
              style={{ backgroundColor: accentColor.tint, color: accentColor.primary }}
            >
              {data.courseCode}
            </span>
          )}
          {data.courseTitle?.trim() && (
            <span className="text-slate-800 tracking-wide">{data.courseTitle}</span>
          )}
          {visibility.showSemester && data.semester?.trim() && (
            <>
              <span className="text-slate-300">·</span>
              <span className="font-bold uppercase text-[11px] text-slate-700">
                Semester: {data.semester}
              </span>
            </>
          )}
        </div>

        {/* Assignment Title */}
        <div className="space-y-3">
          {visibility.showAssignmentNo && data.assignmentNumber?.trim() && (
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase font-sans-modern"
              style={{ color: accentColor.primary }}
            >
              {data.assignmentNumber}
            </p>
          )}

          <h2
            className={`${fontClass} text-[30px] leading-[1.25] font-bold text-slate-900 tracking-tight text-balance break-words`}
          >
            {data.assignmentTitle || 'Assignment Title'}
          </h2>
        </div>
      </div>

      {/* BOTTOM: Editorial Metadata Grid */}
      <div className="shrink-0 w-full space-y-4 pt-6 border-t border-slate-200">
        <div className="grid grid-cols-2 gap-6 text-xs">
          {/* Author / Student column */}
          <div className="space-y-3">
            <p
              className="text-[12px] font-bold uppercase tracking-widest font-sans-modern"
              style={{ color: accentColor.primary }}
            >
              Author / Student Details
            </p>

            <div className="space-y-3">
              {data.students.map((student, idx) => (
                <div key={student.id || idx} className="space-y-0.5">
                  <p className="font-bold text-slate-900 text-[14.5px]">
                    {student.name?.trim() || 'Student Name'}
                  </p>
                  {student.studentId?.trim() && (
                    <p className="font-mono-code text-[13px] text-slate-600">
                      <span className="text-slate-400 font-sans">ID: </span>
                      {student.studentId}
                    </p>
                  )}
                  {visibility.showSection && student.section?.trim() && (
                    <p className="text-[13px] text-slate-500">
                      <span>Section: {student.section}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Faculty recipient column */}
          <div className="space-y-2 flex flex-col justify-between">
            <div>
              <p
                className="text-[12px] font-bold uppercase tracking-widest font-sans-modern"
                style={{ color: accentColor.primary }}
              >
                Submitted To
              </p>
              <p className="font-bold text-slate-900 text-[14.5px] mt-1">
                {data.teacherName?.trim() || 'Faculty Name'}
              </p>
              {visibility.showTeacherDesignation && data.teacherDesignation?.trim() && (
                <p className="text-slate-600 text-[13px] mt-0.5">{data.teacherDesignation}</p>
              )}
              {visibility.showDepartment && data.departmentName?.trim() && (
                <p className="text-slate-500 text-[12px] mt-0.5">{data.departmentName}</p>
              )}
            </div>

            {visibility.showDate && data.submissionDate?.trim() && (
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                <span className="text-slate-400">Date of Submission: </span>
                <span className="font-semibold text-slate-900">{data.submissionDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Custom fields */}
        {visibility.showCustomFields && data.customFields && data.customFields.length > 0 && (
          <div className="flex flex-wrap gap-4 pt-2 text-[11px] text-slate-600 border-t border-slate-100">
            {data.customFields
              .filter((cf) => cf.label?.trim() && cf.value?.trim())
              .map((cf) => (
                <div key={cf.id} className="flex items-center gap-1.5">
                  <span className="text-slate-400">{cf.label}:</span>
                  <span className="font-mono-code font-semibold text-slate-800">{cf.value}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

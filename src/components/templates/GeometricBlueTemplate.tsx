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

export const GeometricBlueTemplate: React.FC<TemplateProps> = ({
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
      {/* GEOMETRIC BLUE ACCENTS */}
      {/* Top right geometric polygon */}
      <div
        className="absolute -top-12 -right-12 w-44 h-44 rounded-3xl rotate-12 opacity-15 pointer-events-none"
        style={{ backgroundColor: accentColor.primary }}
      />
      <div
        className="absolute top-0 right-0 w-28 h-2 pointer-events-none"
        style={{ backgroundColor: accentColor.primary }}
      />
      {/* Bottom left geometric circle & bar */}
      <div
        className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full opacity-10 pointer-events-none"
        style={{ backgroundColor: accentColor.secondary }}
      />
      <div
        className="absolute bottom-0 left-0 w-28 h-2 pointer-events-none"
        style={{ backgroundColor: accentColor.primary }}
      />

      {/* TOP HEADER */}
      <div
        className="relative z-10 shrink-0 w-full flex items-center justify-between border-b-2 pb-5"
        style={{ borderColor: accentColor.border }}
      >
        <div className="min-w-0 flex-1 pr-6">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: accentColor.primary }}
            />
            <h1
              className="text-xs font-extrabold tracking-[0.16em] uppercase font-sans-modern leading-snug break-words"
              style={{ color: accentColor.primary }}
            >
              {data.universityName || 'BRAC UNIVERSITY'}
            </h1>
          </div>
          {visibility.showDepartment && data.departmentName?.trim() && (
            <p className="text-xs text-slate-600 font-medium pl-4 leading-normal break-words mt-1">
              {data.departmentName}
            </p>
          )}
        </div>

        {visibility.showLogo && (
          <div className="shrink-0 p-1 bg-white rounded-lg border border-slate-100 shadow-2xs">
            <UniversityLogo
              logoUrl={logoUrl}
              isConfigured={isLogoConfigured}
              size={data.logoSize}
              universityName={data.universityName}
            />
          </div>
        )}
      </div>

      {/* CENTER: Geometric Title Presentation */}
      <div className="relative z-10 flex-1 w-full min-h-0 flex flex-col justify-center py-6">
        <div className="border-l-4 pl-6 py-2" style={{ borderColor: accentColor.primary }}>
          <div className="flex items-center flex-wrap gap-2.5 mb-2.5">
            {visibility.showAssignmentNo && data.assignmentNumber?.trim() && (
              <span
                className="text-[11px] font-mono-code font-bold uppercase tracking-wider px-2 py-0.5 rounded"
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
              <span className="text-xs font-mono-code font-semibold text-slate-700">
                {data.courseCode}
              </span>
            )}
            {visibility.showSemester && data.semester?.trim() && (
              <>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-bold text-slate-900 uppercase">
                  Semester: {data.semester}
                </span>
              </>
            )}
          </div>

          <h2
            className={`${fontClass} text-[28px] leading-[1.28] font-extrabold text-slate-900 tracking-tight text-balance break-words`}
          >
            {data.assignmentTitle || 'Assignment Title'}
          </h2>

          {data.courseTitle?.trim() && (
            <p className="text-sm font-semibold text-slate-600 mt-3 font-sans-modern">
              Course: {data.courseTitle}
            </p>
          )}
        </div>
      </div>

      {/* BOTTOM SECTION: Symmetrical Stylized Cards */}
      <div className="relative z-10 shrink-0 w-full space-y-4 pt-4 border-t border-slate-100">
        <div className="grid grid-cols-2 gap-5">
          {/* Student details */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-1.5 h-3.5 rounded-full shrink-0"
                style={{ backgroundColor: accentColor.primary }}
              />
              <span
                className="text-[12px] font-bold uppercase tracking-wider font-sans-modern"
                style={{ color: accentColor.primary }}
              >
                Student Details
              </span>
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

          {/* Submission and Instructor Details */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-1.5 h-3.5 rounded-full shrink-0"
                  style={{ backgroundColor: accentColor.secondary }}
                />
                <span
                  className="text-[12px] font-bold uppercase tracking-wider font-sans-modern"
                  style={{ color: accentColor.primary }}
                >
                  Faculty Evaluation
                </span>
              </div>

              <p className="font-bold text-slate-900 text-[14.5px]">
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
              <div className="pt-3 border-t border-slate-100 mt-2 text-[11px] text-slate-600">
                <span className="text-slate-400">Submission Date: </span>
                <span className="font-bold text-slate-900">{data.submissionDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Custom fields bar */}
        {visibility.showCustomFields && data.customFields && data.customFields.length > 0 && (
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
            {data.customFields
              .filter((cf) => cf.label?.trim() && cf.value?.trim())
              .map((cf) => (
                <div key={cf.id} className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">{cf.label}:</span>
                  <span className="font-mono-code font-bold text-slate-800">{cf.value}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

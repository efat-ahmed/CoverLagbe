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

export const MinimalProfessionalTemplate: React.FC<TemplateProps> = ({
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
    <div className="relative w-full h-full bg-white text-slate-900 flex flex-col justify-between p-14 overflow-hidden select-none border border-slate-200">
      {/* Delicate corner markers */}
      <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-slate-300 pointer-events-none" />
      <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-slate-300 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-slate-300 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-slate-300 pointer-events-none" />

      {/* TOP: Understated Institutional Header */}
      <div className="shrink-0 w-full flex items-start justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="min-w-0 flex-1 pr-4">
          <h1
            className="text-xs font-bold tracking-[0.18em] uppercase font-sans-modern text-slate-900 leading-snug break-words"
          >
            {data.universityName || 'BRAC UNIVERSITY'}
          </h1>
          {visibility.showDepartment && data.departmentName?.trim() && (
            <p className="text-[11px] text-slate-500 font-medium mt-1 tracking-wider uppercase leading-snug break-words">
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

      {/* CENTER: Title and Course Identity */}
      <div className="flex-1 w-full min-h-0 flex flex-col justify-center py-6 max-w-[620px]">
        {/* Unboxed Metadata Kicker */}
        <div className="flex items-center flex-wrap gap-2 mb-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          {visibility.showCourseCode && data.courseCode?.trim() && (
            <span className="font-mono-code font-bold text-slate-900">{data.courseCode}</span>
          )}
          {visibility.showSemester && data.semester?.trim() && (
            <>
              <span>·</span>
              <span style={{ color: accentColor.primary }} className="font-bold">
                {data.semester}
              </span>
            </>
          )}
          {visibility.showAssignmentNo && data.assignmentNumber?.trim() && (
            <>
              <span>·</span>
              <span>{data.assignmentNumber}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h2
          className={`${fontClass} text-[28px] font-extrabold text-slate-950 leading-[1.3] tracking-tight text-balance break-words`}
        >
          {data.assignmentTitle || 'Assignment Title'}
        </h2>

        {data.courseTitle?.trim() && (
          <p className="text-xs font-medium text-slate-600 mt-3 font-sans-modern">
            Course: {data.courseTitle}
          </p>
        )}

        <div className="w-12 h-0.5 mt-5" style={{ backgroundColor: accentColor.primary }} />
      </div>

      {/* BOTTOM: Minimalist 2-Column Academic Data */}
      <div className="shrink-0 w-full pt-6 border-t border-slate-200 text-xs">
        <div className="grid grid-cols-2 gap-8">
          {/* Submitted By */}
          <div>
            <p className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mb-3 font-sans-modern">
              Submitted By
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

          {/* Submitted To */}
          <div>
            <p className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mb-3 font-sans-modern">
              Submitted To
            </p>
            <div className="space-y-0.5">
              <p className="font-bold text-slate-900 text-[14.5px]">
                {data.teacherName?.trim() || 'Faculty Name'}
              </p>
              {visibility.showTeacherDesignation && data.teacherDesignation?.trim() && (
                <p className="text-slate-600 text-[13px] font-medium">{data.teacherDesignation}</p>
              )}
              {visibility.showDepartment && data.departmentName?.trim() && (
                <p className="text-slate-500 text-[12px]">{data.departmentName}</p>
              )}
            </div>

            {visibility.showDate && data.submissionDate?.trim() && (
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                <span>Date: </span>
                <span className="font-semibold text-slate-800">{data.submissionDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Custom fields */}
        {visibility.showCustomFields && data.customFields && data.customFields.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-4 text-[11px] text-slate-600">
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

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CoverPageData, AccentColorConfig } from '../../types/coverPage';
import { TYPE_SCALE } from '../../config/constants';
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
        className={`shrink-0 w-full ${isCompact ? 'px-10 py-4' : 'px-12 py-6'} text-white flex items-center justify-between gap-6`}
        style={{ backgroundColor: accentColor.primary }}
      >
        <div className="min-w-0 flex-1 space-y-1">
          <h1 className={`${isCompact ? TYPE_SCALE.universityHeaderCompact : TYPE_SCALE.universityHeader} font-bold tracking-[0.14em] uppercase text-white/95 break-words`}>
            {data.universityName || 'BRAC UNIVERSITY'}
          </h1>
          {visibility.showDepartment && data.departmentName?.trim() && (
            <p className={`${isCompact ? TYPE_SCALE.departmentHeaderCompact : TYPE_SCALE.departmentHeader} text-white/90 font-normal tracking-wide break-words`}>
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
      <div className={`flex-1 w-full min-h-0 ${isCompact ? 'px-10 py-4' : 'px-12 py-6'} flex flex-col justify-between`}>
        {/* Document Classification & Title Block */}
        <div className={`${isCompact ? 'my-1 py-1' : 'my-auto py-2'} min-w-0`}>
          {/* Classification Tags */}
          <div className={`flex items-center flex-wrap gap-2.5 ${isCompact ? 'mb-2.5' : 'mb-3.5'} ${isCompact ? TYPE_SCALE.metaTagCompact : TYPE_SCALE.metaTag}`}>
            {visibility.showAssignmentNo && data.assignmentNumber?.trim() && (
              <span
                className={`px-3 py-0.5 rounded font-mono-code font-bold ${isCompact ? TYPE_SCALE.metaTagCompact : TYPE_SCALE.metaTag} uppercase`}
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
              <span className={`font-mono-code ${isCompact ? TYPE_SCALE.metaTagCompact : TYPE_SCALE.metaTag} font-semibold text-slate-700`}>
                [{data.courseCode}]
              </span>
            )}
            {visibility.showSemester && data.semester?.trim() && (
              <span className={`${isCompact ? TYPE_SCALE.metaTagCompact : TYPE_SCALE.metaTag} font-bold text-slate-800`}>
                · Semester: {data.semester}
              </span>
            )}
          </div>

          {/* Assignment Title */}
          <h2
            className={`${fontClass} ${isCompact ? TYPE_SCALE.assignmentTitleTightCompact : TYPE_SCALE.assignmentTitleTight} font-extrabold text-slate-950 tracking-tight text-balance break-words`}
          >
            {data.assignmentTitle || 'Assignment Report Title'}
          </h2>

          {data.courseTitle?.trim() && (
            <p className={`${isCompact ? TYPE_SCALE.courseTitleCompact : TYPE_SCALE.courseTitle} font-semibold text-slate-600 ${isCompact ? 'mt-2' : 'mt-3'} tracking-wide font-sans-modern break-words`}>
              Course: {data.courseTitle}
            </p>
          )}

          <div className={`w-16 ${isCompact ? 'h-0.5 mt-3' : 'h-1 mt-4'}`} style={{ backgroundColor: accentColor.primary }} />
        </div>

        {/* STRUCTURED TABULAR STUDENTS & FACULTY SECTION */}
        <div className={`shrink-0 ${isCompact ? 'space-y-3 pt-1' : 'space-y-4 pt-3'}`}>
          {/* Students Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div
              className={`${isCompact ? `px-3.5 py-1.5 ${TYPE_SCALE.sectionLabelCompact}` : `px-4 py-2 ${TYPE_SCALE.sectionLabel}`} font-bold uppercase tracking-wider flex items-center justify-between`}
              style={{ backgroundColor: accentColor.tint, color: accentColor.primary }}
            >
              <span>Prepared By Student(s)</span>
              <span>{data.students.length} Contributor{data.students.length > 1 ? 's' : ''}</span>
            </div>

            <table className="w-full table-fixed text-left border-collapse">
              <thead>
                <tr className={`border-b border-slate-200 bg-slate-50/60 ${TYPE_SCALE.eyebrow} text-slate-600 font-bold uppercase`}>
                  <th className={`${isCompact ? 'py-1.5 px-3.5' : 'py-2 px-4'} w-[52%]`}>Student Name</th>
                  <th className={`${isCompact ? 'py-1.5 px-2.5' : 'py-2 px-3'} w-[30%]`}>Student ID</th>
                  {visibility.showSection && <th className={`${isCompact ? 'py-1.5 px-2.5' : 'py-2 px-3'} w-[18%]`}>Section</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.students.map((student, idx) => (
                  <tr key={student.id || idx} className="hover:bg-slate-50/40">
                    <td className={`${isCompact ? `py-1.5 px-3.5 ${TYPE_SCALE.personNameCompact}` : `py-2.5 px-4 ${TYPE_SCALE.personName}`} font-bold text-slate-900 break-words`}>
                      {student.name?.trim() || '—'}
                    </td>
                    <td className={`${isCompact ? `py-1.5 px-2.5 ${TYPE_SCALE.personDetailCompact}` : `py-2.5 px-3 ${TYPE_SCALE.personDetail}`} font-mono-code tabular-nums text-slate-800 font-semibold break-words`}>
                      {student.studentId?.trim() || '—'}
                    </td>
                    {visibility.showSection && (
                      <td className={`${isCompact ? `py-1.5 px-2.5 ${TYPE_SCALE.personDetailCompact}` : `py-2.5 px-3 ${TYPE_SCALE.personDetail}`} text-slate-700 break-words`}>
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
            <div className={`${isCompact ? 'p-3' : 'p-4'} rounded-lg border border-slate-200 bg-slate-50/50 min-w-0`}>
              <p
                className={`${isCompact ? TYPE_SCALE.sectionLabelCompact : TYPE_SCALE.sectionLabel} font-bold uppercase tracking-wider ${isCompact ? 'mb-1' : 'mb-1.5'} font-sans-modern`}
                style={{ color: accentColor.primary }}
              >
                Prepared For
              </p>
              <p className={`font-bold text-slate-900 break-words ${isCompact ? TYPE_SCALE.personNameCompact : TYPE_SCALE.personName}`}>
                {data.teacherName?.trim() || 'Faculty Name'}
              </p>
              {visibility.showTeacherDesignation && data.teacherDesignation?.trim() && (
                <p className={`text-slate-700 break-words ${isCompact ? TYPE_SCALE.personDetailCompact : TYPE_SCALE.personDetail} mt-0.5`}>
                  {data.teacherDesignation}
                </p>
              )}
              {visibility.showDepartment && data.departmentName?.trim() && (
                <p className={`text-slate-500 break-words ${isCompact ? TYPE_SCALE.personSubDetailCompact : TYPE_SCALE.personSubDetail} mt-1`}>
                  {data.departmentName}
                </p>
              )}
            </div>

            {/* Custom parameters block */}
            <div className={`${isCompact ? 'p-3' : 'p-4'} rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between min-w-0`}>
              <p
                className={`${isCompact ? TYPE_SCALE.sectionLabelCompact : TYPE_SCALE.sectionLabel} font-bold uppercase tracking-wider ${isCompact ? 'mb-1' : 'mb-1.5'} font-sans-modern`}
                style={{ color: accentColor.primary }}
              >
                Submission Details
              </p>
              {visibility.showDate && data.submissionDate?.trim() && (
                <div className={`${isCompact ? TYPE_SCALE.footerMetaCompact : TYPE_SCALE.footerMeta} text-slate-700`}>
                  <span className="text-slate-500">Date: </span>
                  <span className="font-semibold text-slate-900">{data.submissionDate}</span>
                </div>
              )}
              {visibility.showCustomFields && data.customFields && data.customFields.length > 0 && (
                <div className={`space-y-1 mt-1.5 ${isCompact ? TYPE_SCALE.footerMetaCompact : TYPE_SCALE.footerMeta}`}>
                  {data.customFields
                    .filter((cf) => cf.label?.trim() && cf.value?.trim())
                    .slice(0, 2)
                    .map((cf) => (
                      <div key={cf.id} className="flex items-center justify-between gap-2 min-w-0">
                        <span className="text-slate-500 truncate">{cf.label}:</span>
                        <span className="font-mono-code font-semibold text-slate-800 break-words text-right">{cf.value}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* EXECUTIVE FOOTER BAR */}
      <div className={`shrink-0 w-full ${isCompact ? 'px-10 py-2.5' : 'px-12 py-3'} bg-slate-100 border-t border-slate-200 flex items-center justify-between ${isCompact ? TYPE_SCALE.footerMetaCompact : TYPE_SCALE.footerMeta} text-slate-600 font-sans-modern`}>
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

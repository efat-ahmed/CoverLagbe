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

export const ClassicAcademicTemplate = React.memo<TemplateProps>(({
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

  const isCompact = data.students.length > 3;

  return (
    <div className={`relative w-full h-full bg-white text-slate-900 flex flex-col justify-between ${isCompact ? 'p-10' : 'p-12'} overflow-hidden select-none`}>
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
      <div className="relative z-10 shrink-0 w-full flex flex-col items-center text-center pt-1">
        {/* University Official Monogram Logo */}
        {visibility.showLogo && (
          <div className={`${isCompact ? 'mb-2' : 'mb-3'} flex items-center justify-center`}>
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
          className={`${fontClass} ${isCompact ? TYPE_SCALE.universityHeroCompact : TYPE_SCALE.universityHero} font-bold tracking-[0.12em] uppercase w-full max-w-[640px] text-center break-words transition-colors`}
          style={{ color: accentColor.primary }}
        >
          {data.universityName || 'BRAC UNIVERSITY'}
        </h1>

        {/* Department Name */}
        {visibility.showDepartment && data.departmentName?.trim() && (
          <p className={`${isCompact ? TYPE_SCALE.departmentHeaderCompact : TYPE_SCALE.departmentHeader} uppercase tracking-[0.1em] text-slate-600 mt-1.5 max-w-[600px] w-full text-center font-sans-modern font-semibold break-words`}>
            {data.departmentName}
          </p>
        )}

        {/* Elegant Academic Emblem Divider */}
        <div className={`flex items-center justify-center gap-2.5 ${isCompact ? 'mt-2.5 mb-1' : 'mt-3.5 mb-1'} w-56 opacity-85`}>
          <div className="h-[1px] flex-1 bg-slate-300" />
          <div
            className="w-2 h-2 rotate-45 shrink-0"
            style={{ backgroundColor: accentColor.primary }}
          />
          <div className="h-[1px] flex-1 bg-slate-300" />
        </div>
      </div>

      {/* CENTER ASSIGNMENT & COURSE BODY SECTION */}
      <div className={`relative z-10 flex-1 w-full min-h-0 flex flex-col items-center justify-center text-center ${isCompact ? 'py-2 px-4' : 'py-4 px-6'} max-w-[680px] mx-auto`}>
        {/* Course Code & Title Academic Header */}
        {(Boolean(visibility.showCourseCode && data.courseCode?.trim()) || Boolean(data.courseTitle?.trim())) && (
          <div className={`${isCompact ? 'mb-2' : 'mb-3.5'} flex flex-col items-center gap-1 font-sans-modern min-w-0 w-full`}>
            <div className={`inline-flex items-center justify-center flex-wrap gap-2 ${isCompact ? TYPE_SCALE.courseTitleCompact : TYPE_SCALE.courseTitle} font-bold uppercase tracking-wider text-slate-700`}>
              {visibility.showCourseCode && data.courseCode?.trim() && (
                <span
                  className={`font-mono-code font-bold px-2.5 py-0.5 rounded ${isCompact ? TYPE_SCALE.metaTagCompact : TYPE_SCALE.metaTag}`}
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
                <span className="text-slate-800 tracking-wide break-words">{data.courseTitle}</span>
              )}
            </div>
          </div>
        )}

        {/* Assignment Number Kicker */}
        {visibility.showAssignmentNo && data.assignmentNumber?.trim() && (
          <span
            className={`${isCompact ? TYPE_SCALE.metaTagCompact : TYPE_SCALE.metaTag} font-bold uppercase tracking-[0.18em] ${isCompact ? 'mb-1.5' : 'mb-2.5'} px-3.5 py-0.5 rounded-sm break-words`}
            style={{ color: accentColor.primary, backgroundColor: accentColor.tint }}
          >
            {data.assignmentNumber}
          </span>
        )}

        {/* Main Assignment Title */}
        <div className={`${isCompact ? 'my-1' : 'my-2'} max-w-[640px] w-full min-w-0`}>
          <h2
            className={`${fontClass} ${isCompact ? TYPE_SCALE.assignmentTitleCompact : TYPE_SCALE.assignmentTitle} font-bold text-slate-900 tracking-tight text-balance break-words`}
          >
            {data.assignmentTitle || 'Assignment Topic Title'}
          </h2>
        </div>

        {/* Semester Indicator */}
        {visibility.showSemester && data.semester?.trim() && (
          <div className={`${isCompact ? 'mt-1.5 py-0.5' : 'mt-3 py-1'} inline-flex items-center gap-2 px-4 rounded-full border border-slate-200 bg-slate-50/70 font-sans-modern`}>
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor.primary }} />
            <span className={`${isCompact ? TYPE_SCALE.metaTagCompact : TYPE_SCALE.metaTag} uppercase font-medium text-slate-600 tracking-wider`}>
              Semester: <span className="font-bold text-slate-900">{data.semester}</span>
            </span>
          </div>
        )}
      </div>

      {/* BOTTOM FORMAL ACADEMIC SUBMISSION SECTION */}
      <div className="relative z-10 shrink-0 w-full pt-1">
        {/* Upper Light-Gray Horizontal Dividers */}
        <div className={`grid grid-cols-2 gap-8 max-w-[660px] mx-auto ${isCompact ? 'mb-2' : 'mb-3'}`}>
          <div className="h-[1.5px] bg-slate-200 w-full" />
          <div className="h-[1.5px] bg-slate-200 w-full" />
        </div>

        {/* Two-Column Formal Balanced Grid */}
        <div className="grid grid-cols-2 gap-8 max-w-[660px] mx-auto">
          {/* SUBMITTED BY COLUMN */}
          <div className="flex flex-col text-left min-w-0">
            <div className={`flex items-center gap-2 ${isCompact ? 'mb-2 pb-1' : 'mb-3 pb-1.5'} border-b`} style={{ borderColor: accentColor.border }}>
              <span className="w-2 h-2 rounded-xs shrink-0" style={{ backgroundColor: accentColor.primary }} />
              <h3
                className={`font-bold uppercase tracking-[0.16em] ${isCompact ? TYPE_SCALE.sectionLabelCompact : TYPE_SCALE.sectionLabel} font-sans-modern`}
                style={{ color: accentColor.primary }}
              >
                Submitted By:
              </h3>
            </div>

            <div className={isCompact ? 'space-y-1.5' : 'space-y-3.5'}>
              {data.students.map((student, idx) => (
                <div key={student.id || idx} className="space-y-0.5 min-w-0">
                  <p className={`font-bold text-slate-900 break-words ${isCompact ? TYPE_SCALE.personNameCompact : TYPE_SCALE.personName}`}>
                    {student.name?.trim() || 'Student Name'}
                  </p>
                  {student.studentId?.trim() && (
                    <p className={`text-slate-700 font-mono-code tabular-nums break-words ${isCompact ? TYPE_SCALE.personDetailCompact : TYPE_SCALE.personDetail}`}>
                      <span className="text-slate-500 font-sans font-normal">Student ID: </span>
                      <span className="font-semibold text-slate-800">{student.studentId}</span>
                      {isCompact && visibility.showSection && student.section?.trim() && (
                        <span className="ml-2 pl-2 border-l border-slate-200">
                          <span className="text-slate-500 font-sans font-normal">Sec: </span>
                          <span className="font-medium text-slate-700 font-sans">{student.section}</span>
                        </span>
                      )}
                    </p>
                  )}
                  {!isCompact && visibility.showSection && student.section?.trim() && (
                    <p className={`text-slate-600 break-words ${TYPE_SCALE.personDetail}`}>
                      <span className="text-slate-500 font-sans font-normal">Section: </span>
                      <span className="font-medium">{student.section}</span>
                    </p>
                  )}
                  {isCompact && !student.studentId?.trim() && visibility.showSection && student.section?.trim() && (
                    <p className={`text-slate-600 break-words ${TYPE_SCALE.personDetailCompact}`}>
                      <span className="text-slate-500 font-sans font-normal">Section: </span>
                      <span className="font-medium">{student.section}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SUBMITTED TO COLUMN */}
          <div className="flex flex-col text-left min-w-0">
            <div className={`flex items-center gap-2 ${isCompact ? 'mb-2 pb-1' : 'mb-3 pb-1.5'} border-b`} style={{ borderColor: accentColor.border }}>
              <span className="w-2 h-2 rounded-xs shrink-0" style={{ backgroundColor: accentColor.primary }} />
              <h3
                className={`font-bold uppercase tracking-[0.16em] ${isCompact ? TYPE_SCALE.sectionLabelCompact : TYPE_SCALE.sectionLabel} font-sans-modern`}
                style={{ color: accentColor.primary }}
              >
                Submitted To:
              </h3>
            </div>

            <div className="space-y-1 min-w-0">
              <p className={`font-bold text-slate-900 break-words ${isCompact ? TYPE_SCALE.personNameCompact : TYPE_SCALE.personName}`}>
                {data.teacherName?.trim() || 'Faculty / Instructor Name'}
              </p>
              {visibility.showTeacherDesignation && data.teacherDesignation?.trim() && (
                <p className={`text-slate-700 font-medium break-words ${isCompact ? TYPE_SCALE.personDetailCompact : TYPE_SCALE.personDetail}`}>
                  {data.teacherDesignation}
                </p>
              )}
              {visibility.showDepartment && data.departmentName?.trim() && (
                <p className={`text-slate-500 mt-0.5 font-medium break-words ${isCompact ? TYPE_SCALE.personSubDetailCompact : TYPE_SCALE.personSubDetail}`}>
                  {data.departmentName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Custom Fields Footnote */}
        {visibility.showCustomFields && data.customFields && data.customFields.length > 0 && (
          <div className={`${isCompact ? 'mt-2 pt-1.5' : 'mt-4 pt-2.5'} max-w-[660px] mx-auto border-t border-slate-100 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 ${isCompact ? TYPE_SCALE.footerMetaCompact : TYPE_SCALE.footerMeta} text-slate-600`}>
            {data.customFields
              .filter((cf) => cf.label?.trim() && cf.value?.trim())
              .map((cf) => (
                <span key={cf.id} className="inline-flex items-center gap-1.5 min-w-0 break-words">
                  <span className="font-semibold text-slate-700">{cf.label}:</span>
                  <span className="font-mono-code tabular-nums text-slate-900">{cf.value}</span>
                </span>
              ))}
          </div>
        )}

        {/* Bottom Submission Date */}
        {visibility.showDate && data.submissionDate?.trim() && (
          <div className={`${isCompact ? 'mt-2 pt-1.5' : 'mt-3.5 pt-2.5'} max-w-[660px] mx-auto text-center ${isCompact ? TYPE_SCALE.footerMetaCompact : TYPE_SCALE.footerMeta} tracking-wide text-slate-600 font-sans-modern border-t border-slate-200`}>
            <span>Date of Submission: </span>
            <span className="font-bold text-slate-900">{data.submissionDate}</span>
          </div>
        )}
      </div>
    </div>
  );
});

ClassicAcademicTemplate.displayName = 'ClassicAcademicTemplate';

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

export const GeometricBlueTemplate = React.memo<TemplateProps>(({
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
    <div className={`relative w-full h-full bg-white text-slate-900 flex flex-col justify-between ${isCompact ? 'p-10' : 'p-12'} overflow-hidden select-none`}>
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
        className={`relative z-10 shrink-0 w-full flex items-center justify-between border-b-2 ${isCompact ? 'pb-4' : 'pb-5'}`}
        style={{ borderColor: accentColor.border }}
      >
        <div className="min-w-0 flex-1 pr-6">
          <div className="flex items-center gap-2.5 mb-1 min-w-0">
            <span
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: accentColor.primary }}
            />
            <h1
              className={`${isCompact ? TYPE_SCALE.universityHeaderCompact : TYPE_SCALE.universityHeader} font-extrabold tracking-[0.12em] uppercase font-sans-modern break-words min-w-0`}
              style={{ color: accentColor.primary }}
            >
              {data.universityName || 'BRAC UNIVERSITY'}
            </h1>
          </div>
          {visibility.showDepartment && data.departmentName?.trim() && (
            <p className={`${isCompact ? TYPE_SCALE.departmentHeaderCompact : TYPE_SCALE.departmentHeader} text-slate-600 font-medium pl-5 break-words mt-1`}>
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
      <div className={`relative z-10 flex-1 w-full min-h-0 flex flex-col justify-center ${isCompact ? 'py-3' : 'py-6'}`}>
        <div className="border-l-4 pl-6 py-2 min-w-0" style={{ borderColor: accentColor.primary }}>
          <div className={`flex items-center flex-wrap gap-2.5 ${isCompact ? 'mb-2.5' : 'mb-3.5'} ${isCompact ? TYPE_SCALE.metaTagCompact : TYPE_SCALE.metaTag}`}>
            {visibility.showAssignmentNo && data.assignmentNumber?.trim() && (
              <span
                className={`${isCompact ? TYPE_SCALE.metaTagCompact : TYPE_SCALE.metaTag} font-mono-code font-bold uppercase tracking-wider px-2.5 py-0.5 rounded`}
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
              <span className={`${isCompact ? TYPE_SCALE.metaTagCompact : TYPE_SCALE.metaTag} font-mono-code font-semibold text-slate-700`}>
                {data.courseCode}
              </span>
            )}
            {visibility.showSemester && data.semester?.trim() && (
              <>
                <span className="text-slate-300">·</span>
                <span className={`${isCompact ? TYPE_SCALE.metaTagCompact : TYPE_SCALE.metaTag} font-bold text-slate-900 uppercase`}>
                  Semester: {data.semester}
                </span>
              </>
            )}
          </div>

          <h2
            className={`${fontClass} ${isCompact ? TYPE_SCALE.assignmentTitleCompact : TYPE_SCALE.assignmentTitle} font-extrabold text-slate-900 tracking-tight text-balance break-words`}
          >
            {data.assignmentTitle || 'Assignment Title'}
          </h2>

          {data.courseTitle?.trim() && (
            <p className={`${isCompact ? TYPE_SCALE.courseTitleCompact : TYPE_SCALE.courseTitle} font-semibold text-slate-600 ${isCompact ? 'mt-2' : 'mt-3.5'} font-sans-modern break-words`}>
              Course: {data.courseTitle}
            </p>
          )}
        </div>
      </div>

      {/* BOTTOM SECTION: Symmetrical Stylized Cards */}
      <div className={`relative z-10 shrink-0 w-full ${isCompact ? 'space-y-2.5 pt-3' : 'space-y-4 pt-4'} border-t border-slate-100`}>
        <div className={`grid grid-cols-2 ${isCompact ? 'gap-4' : 'gap-5'}`}>
          {/* Student details */}
          <div className={`${isCompact ? 'p-3.5' : 'p-4'} rounded-xl border border-slate-200 bg-white shadow-2xs min-w-0`}>
            <div className={`flex items-center gap-2 ${isCompact ? 'mb-2' : 'mb-3'}`}>
              <div
                className="w-1.5 h-4 rounded-full shrink-0"
                style={{ backgroundColor: accentColor.primary }}
              />
              <span
                className={`${isCompact ? TYPE_SCALE.sectionLabelCompact : TYPE_SCALE.sectionLabel} font-bold uppercase tracking-wider font-sans-modern`}
                style={{ color: accentColor.primary }}
              >
                Student Details
              </span>
            </div>

            <div className={isCompact ? 'space-y-1.5' : 'space-y-3'}>
              {data.students.map((student, idx) => (
                <div key={student.id || idx} className="space-y-0.5 min-w-0">
                  <p className={`font-bold text-slate-900 break-words ${isCompact ? TYPE_SCALE.personNameCompact : TYPE_SCALE.personName}`}>
                    {student.name?.trim() || 'Student Name'}
                  </p>
                  {student.studentId?.trim() && (
                    <p className={`font-mono-code tabular-nums break-words ${isCompact ? TYPE_SCALE.personDetailCompact : TYPE_SCALE.personDetail} text-slate-600`}>
                      <span className="text-slate-500 font-sans">ID: </span>
                      {student.studentId}
                      {isCompact && visibility.showSection && student.section?.trim() && (
                        <span className="ml-2 pl-2 border-l border-slate-200">
                          <span className="text-slate-500 font-sans">Sec: </span>
                          <span className="text-slate-700 font-sans">{student.section}</span>
                        </span>
                      )}
                    </p>
                  )}
                  {!isCompact && visibility.showSection && student.section?.trim() && (
                    <p className={`${TYPE_SCALE.personDetail} text-slate-600 pt-0.5 break-words`}>
                      <span>Section: {student.section}</span>
                    </p>
                  )}
                  {isCompact && !student.studentId?.trim() && visibility.showSection && student.section?.trim() && (
                    <p className={`${TYPE_SCALE.personDetailCompact} text-slate-600 break-words`}>
                      <span>Section: {student.section}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submission and Instructor Details */}
          <div className={`${isCompact ? 'p-3.5' : 'p-4'} rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between min-w-0`}>
            <div className="min-w-0">
              <div className={`flex items-center gap-2 ${isCompact ? 'mb-2' : 'mb-3'}`}>
                <div
                  className="w-1.5 h-4 rounded-full shrink-0"
                  style={{ backgroundColor: accentColor.secondary }}
                />
                <span
                  className={`${isCompact ? TYPE_SCALE.sectionLabelCompact : TYPE_SCALE.sectionLabel} font-bold uppercase tracking-wider font-sans-modern`}
                  style={{ color: accentColor.primary }}
                >
                  Faculty Evaluation
                </span>
              </div>

              <p className={`font-bold text-slate-900 break-words ${isCompact ? TYPE_SCALE.personNameCompact : TYPE_SCALE.personName}`}>
                {data.teacherName?.trim() || 'Faculty Name'}
              </p>
              {visibility.showTeacherDesignation && data.teacherDesignation?.trim() && (
                <p className={`text-slate-600 break-words ${isCompact ? TYPE_SCALE.personDetailCompact : TYPE_SCALE.personDetail} mt-0.5`}>
                  {data.teacherDesignation}
                </p>
              )}
              {visibility.showDepartment && data.departmentName?.trim() && (
                <p className={`text-slate-500 break-words ${isCompact ? TYPE_SCALE.personSubDetailCompact : TYPE_SCALE.personSubDetail} mt-1`}>
                  {data.departmentName}
                </p>
              )}
            </div>

            {visibility.showDate && data.submissionDate?.trim() && (
              <div className={`${isCompact ? 'pt-2 mt-2' : 'pt-3 mt-2'} border-t border-slate-100 ${isCompact ? TYPE_SCALE.footerMetaCompact : TYPE_SCALE.footerMeta} text-slate-600`}>
                <span className="text-slate-500">Submission Date: </span>
                <span className="font-bold text-slate-900">{data.submissionDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Custom fields bar */}
        {visibility.showCustomFields && data.customFields && data.customFields.length > 0 && (
          <div className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-1 ${isCompact ? `${TYPE_SCALE.footerMetaCompact} px-3 py-1.5` : `${TYPE_SCALE.footerMeta} px-3.5 py-2`} text-slate-600 bg-slate-50 rounded-lg border border-slate-200`}>
            {data.customFields
              .filter((cf) => cf.label?.trim() && cf.value?.trim())
              .map((cf) => (
                <div key={cf.id} className="flex items-center gap-1.5 min-w-0 break-words">
                  <span className="text-slate-500 font-medium">{cf.label}:</span>
                  <span className="font-mono-code font-bold text-slate-800">{cf.value}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
});

GeometricBlueTemplate.displayName = 'GeometricBlueTemplate';

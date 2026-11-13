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

export const EditorialStyleTemplate = React.memo<TemplateProps>(({
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
      {/* Editorial Top Lockup */}
      <div className={`shrink-0 w-full border-b-2 ${isCompact ? 'pb-4' : 'pb-5'}`} style={{ borderColor: accentColor.primary }}>
        <div className="flex items-center justify-between gap-6">
          <div className="min-w-0 flex-1 pr-4">
            <span
              className={`${TYPE_SCALE.eyebrow} font-bold tracking-[0.16em] uppercase block mb-1 font-sans-modern`}
              style={{ color: accentColor.primary }}
            >
              Academic Coursework & Research
            </span>
            <h1 className={`${isCompact ? TYPE_SCALE.universityHeaderCompact : TYPE_SCALE.universityHeader} font-bold tracking-tight uppercase text-slate-900 font-sans-modern break-words`}>
              {data.universityName || 'BRAC UNIVERSITY'}
            </h1>
            {visibility.showDepartment && data.departmentName?.trim() && (
              <p className={`${isCompact ? TYPE_SCALE.departmentHeaderCompact : TYPE_SCALE.departmentHeader} text-slate-600 mt-1 font-medium break-words`}>
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
      <div className={`flex-1 w-full min-h-0 flex flex-col justify-center ${isCompact ? 'py-3' : 'py-6'}`}>
        {/* Course, Semester & Assignment Header */}
        <div className={`flex items-center flex-wrap gap-3 ${isCompact ? TYPE_SCALE.courseTitleCompact : TYPE_SCALE.courseTitle} font-semibold text-slate-600 ${isCompact ? 'mb-3 pb-2' : 'mb-4 pb-2.5'} border-b border-slate-100 min-w-0`}>
          {visibility.showCourseCode && data.courseCode?.trim() && (
            <span
              className={`px-2.5 py-0.5 rounded font-mono-code font-bold ${isCompact ? TYPE_SCALE.metaTagCompact : TYPE_SCALE.metaTag}`}
              style={{ backgroundColor: accentColor.tint, color: accentColor.primary }}
            >
              {data.courseCode}
            </span>
          )}
          {data.courseTitle?.trim() && (
            <span className="text-slate-800 tracking-wide break-words">{data.courseTitle}</span>
          )}
          {visibility.showSemester && data.semester?.trim() && (
            <>
              <span className="text-slate-300">·</span>
              <span className={`font-bold uppercase ${isCompact ? TYPE_SCALE.metaTagCompact : TYPE_SCALE.metaTag} text-slate-700`}>
                Semester: {data.semester}
              </span>
            </>
          )}
        </div>

        {/* Assignment Title */}
        <div className="space-y-3 min-w-0">
          {visibility.showAssignmentNo && data.assignmentNumber?.trim() && (
            <p
              className={`${isCompact ? TYPE_SCALE.metaTagCompact : TYPE_SCALE.metaTag} font-bold tracking-[0.18em] uppercase font-sans-modern break-words`}
              style={{ color: accentColor.primary }}
            >
              {data.assignmentNumber}
            </p>
          )}

          <h2
            className={`${fontClass} ${isCompact ? TYPE_SCALE.assignmentTitleCompact : TYPE_SCALE.assignmentTitle} font-bold text-slate-900 tracking-tight text-balance break-words`}
          >
            {data.assignmentTitle || 'Assignment Title'}
          </h2>
        </div>
      </div>

      {/* BOTTOM: Editorial Metadata Grid */}
      <div className={`shrink-0 w-full ${isCompact ? 'space-y-2.5 pt-3' : 'space-y-4 pt-6'} border-t border-slate-200`}>
        <div className="grid grid-cols-2 gap-6">
          {/* Author / Student column */}
          <div className={`${isCompact ? 'space-y-1.5' : 'space-y-3'} min-w-0`}>
            <p
              className={`${isCompact ? TYPE_SCALE.sectionLabelCompact : TYPE_SCALE.sectionLabel} font-bold uppercase tracking-widest font-sans-modern ${isCompact ? 'mb-1' : ''}`}
              style={{ color: accentColor.primary }}
            >
              Author / Student Details
            </p>

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
                    <p className={`${TYPE_SCALE.personDetail} text-slate-600 break-words`}>
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

          {/* Faculty recipient column */}
          <div className="space-y-2 flex flex-col justify-between min-w-0">
            <div className="min-w-0">
              <p
                className={`${isCompact ? TYPE_SCALE.sectionLabelCompact : TYPE_SCALE.sectionLabel} font-bold uppercase tracking-widest font-sans-modern ${isCompact ? 'mb-1' : ''}`}
                style={{ color: accentColor.primary }}
              >
                Submitted To
              </p>
              <p className={`font-bold text-slate-900 break-words ${isCompact ? TYPE_SCALE.personNameCompact : TYPE_SCALE.personName} mt-1.5`}>
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
              <div className={`${isCompact ? 'pt-2 mt-1' : 'pt-3'} border-t border-slate-100 ${isCompact ? TYPE_SCALE.footerMetaCompact : TYPE_SCALE.footerMeta} text-slate-600`}>
                <span className="text-slate-500">Date of Submission: </span>
                <span className="font-semibold text-slate-900">{data.submissionDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Custom fields */}
        {visibility.showCustomFields && data.customFields && data.customFields.length > 0 && (
          <div className={`flex flex-wrap gap-x-5 gap-y-1 ${isCompact ? `pt-2 ${TYPE_SCALE.footerMetaCompact}` : `pt-2.5 ${TYPE_SCALE.footerMeta}`} text-slate-600 border-t border-slate-100`}>
            {data.customFields
              .filter((cf) => cf.label?.trim() && cf.value?.trim())
              .map((cf) => (
                <div key={cf.id} className="flex items-center gap-1.5 min-w-0 break-words">
                  <span className="text-slate-500">{cf.label}:</span>
                  <span className="font-mono-code font-semibold text-slate-800">{cf.value}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
});

EditorialStyleTemplate.displayName = 'EditorialStyleTemplate';

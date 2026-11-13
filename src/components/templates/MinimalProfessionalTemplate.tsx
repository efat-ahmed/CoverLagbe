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

export const MinimalProfessionalTemplate = React.memo<TemplateProps>(({
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
    <div className={`relative w-full h-full bg-white text-slate-900 flex flex-col justify-between ${isCompact ? 'p-10' : 'p-14'} overflow-hidden select-none border border-slate-200`}>
      {/* Delicate corner markers */}
      <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-slate-300 pointer-events-none" />
      <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-slate-300 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-slate-300 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-slate-300 pointer-events-none" />

      {/* TOP: Understated Institutional Header */}
      <div className={`shrink-0 w-full flex items-start justify-between gap-6 ${isCompact ? 'pb-4' : 'pb-6'} border-b border-slate-100`}>
        <div className="min-w-0 flex-1 pr-4">
          <h1
            className={`${isCompact ? TYPE_SCALE.universityHeaderCompact : TYPE_SCALE.universityHeader} font-bold tracking-[0.14em] uppercase font-sans-modern text-slate-900 break-words`}
          >
            {data.universityName || 'BRAC UNIVERSITY'}
          </h1>
          {visibility.showDepartment && data.departmentName?.trim() && (
            <p className={`${isCompact ? TYPE_SCALE.departmentHeaderCompact : TYPE_SCALE.departmentHeader} text-slate-500 font-medium mt-1.5 tracking-wider uppercase break-words`}>
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
      <div className={`flex-1 w-full min-h-0 flex flex-col justify-center ${isCompact ? 'py-3' : 'py-6'} max-w-[650px]`}>
        {/* Unboxed Metadata Kicker */}
        <div className={`flex items-center flex-wrap gap-2.5 ${isCompact ? 'mb-3' : 'mb-4'} ${isCompact ? TYPE_SCALE.metaTagCompact : TYPE_SCALE.metaTag} font-semibold text-slate-500 uppercase tracking-wider min-w-0`}>
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
          className={`${fontClass} ${isCompact ? TYPE_SCALE.assignmentTitleCompact : TYPE_SCALE.assignmentTitle} font-extrabold text-slate-950 tracking-tight text-balance break-words`}
        >
          {data.assignmentTitle || 'Assignment Title'}
        </h2>

        {data.courseTitle?.trim() && (
          <p className={`${isCompact ? TYPE_SCALE.courseTitleCompact : TYPE_SCALE.courseTitle} font-medium text-slate-600 ${isCompact ? 'mt-2' : 'mt-3.5'} font-sans-modern break-words`}>
            Course: {data.courseTitle}
          </p>
        )}

        <div className={`w-14 h-0.5 ${isCompact ? 'mt-3' : 'mt-5'}`} style={{ backgroundColor: accentColor.primary }} />
      </div>

      {/* BOTTOM: Minimalist 2-Column Academic Data */}
      <div className={`shrink-0 w-full ${isCompact ? 'pt-3' : 'pt-6'} border-t border-slate-200`}>
        <div className={`grid grid-cols-2 ${isCompact ? 'gap-6' : 'gap-8'}`}>
          {/* Submitted By */}
          <div className="min-w-0">
            <p className={`${isCompact ? TYPE_SCALE.sectionLabelCompact : TYPE_SCALE.sectionLabel} font-bold uppercase tracking-widest text-slate-500 ${isCompact ? 'mb-2' : 'mb-3'} font-sans-modern`}>
              Submitted By
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

          {/* Submitted To */}
          <div className="min-w-0">
            <p className={`${isCompact ? TYPE_SCALE.sectionLabelCompact : TYPE_SCALE.sectionLabel} font-bold uppercase tracking-widest text-slate-500 ${isCompact ? 'mb-2' : 'mb-3'} font-sans-modern`}>
              Submitted To
            </p>
            <div className="space-y-0.5 min-w-0">
              <p className={`font-bold text-slate-900 break-words ${isCompact ? TYPE_SCALE.personNameCompact : TYPE_SCALE.personName}`}>
                {data.teacherName?.trim() || 'Faculty Name'}
              </p>
              {visibility.showTeacherDesignation && data.teacherDesignation?.trim() && (
                <p className={`text-slate-600 font-medium break-words ${isCompact ? TYPE_SCALE.personDetailCompact : TYPE_SCALE.personDetail}`}>
                  {data.teacherDesignation}
                </p>
              )}
              {visibility.showDepartment && data.departmentName?.trim() && (
                <p className={`text-slate-500 mt-0.5 break-words ${isCompact ? TYPE_SCALE.personSubDetailCompact : TYPE_SCALE.personSubDetail}`}>
                  {data.departmentName}
                </p>
              )}
            </div>

            {visibility.showDate && data.submissionDate?.trim() && (
              <div className={`${isCompact ? 'mt-2.5 pt-2' : 'mt-4 pt-3'} border-t border-slate-100 ${isCompact ? TYPE_SCALE.footerMetaCompact : TYPE_SCALE.footerMeta} text-slate-600`}>
                <span className="text-slate-500">Date: </span>
                <span className="font-semibold text-slate-800">{data.submissionDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Custom fields */}
        {visibility.showCustomFields && data.customFields && data.customFields.length > 0 && (
          <div className={`${isCompact ? `mt-2.5 pt-2 ${TYPE_SCALE.footerMetaCompact}` : `mt-4 pt-3 ${TYPE_SCALE.footerMeta}`} border-t border-slate-100 flex flex-wrap gap-x-5 gap-y-1 text-slate-600`}>
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

MinimalProfessionalTemplate.displayName = 'MinimalProfessionalTemplate';

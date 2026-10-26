/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StudentInfo {
  id: string;
  name: string;
  studentId: string;
  section?: string;
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
}

export type TemplateId =
  | 'classic-academic'
  | 'modern-blue'
  | 'minimal-professional'
  | 'editorial-style'
  | 'geometric-blue'
  | 'premium-formal';

export type FontChoice =
  | 'classic-serif'
  | 'modern-sans'
  | 'editorial-serif'
  | 'corporate-sans';

export type BorderStyle =
  | 'classic-double'
  | 'single-hairline'
  | 'corner-accents'
  | 'none';

export type LogoSize = 'small' | 'medium' | 'large';

export interface VisibilitySettings {
  showLogo: boolean;
  showDepartment: boolean;
  showAssignmentNo: boolean;
  showCourseCode: boolean;
  showSemester: boolean;
  showSection: boolean;
  showTeacherDesignation: boolean;
  showDate: boolean;
  showCustomFields: boolean;
}

export interface AccentColorConfig {
  id: string;
  name: string;
  primary: string; // hex matching BRAC official blue/navy
  secondary: string;
  tint: string;
  border: string;
  textContrast: string;
}

export interface CoverPageData {
  universityName: string;
  departmentName: string;
  assignmentTitle: string;
  assignmentNumber: string;
  courseTitle: string;
  courseCode: string;
  semester: string; // e.g. "Fall 26"
  students: StudentInfo[];
  teacherName: string;
  teacherDesignation: string;
  submissionDate: string;
  customFields: CustomField[];
  template: TemplateId;
  accentColorId: string;
  fontChoice: FontChoice;
  borderStyle: BorderStyle;
  logoSize: LogoSize;
  visibility: VisibilitySettings;
}

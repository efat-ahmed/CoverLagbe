/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AccentColorConfig, CoverPageData, TemplateId } from '../types/coverPage';

/**
 * Preconfigured Institutional University Logo.
 * Fixed across all templates and assignments in /public.
 */
export const DEFAULT_UNIVERSITY_LOGO = '/university-logo.svg';

export const INSTITUTION_LOGO_STORAGE_KEY = 'covercraft_institutional_logo_v1';
export const INSTITUTION_LOGO_CONFIGURED_KEY = 'covercraft_logo_is_configured';

export const SEMESTER_EXAMPLES = [
  'Fall 26',
  'Spring 27',
  'Summer 27',
  'Fall 27',
];

export const TEMPLATE_METADATA: {
  id: TemplateId;
  name: string;
  description: string;
  tag: string;
}[] = [
  {
    id: 'classic-academic',
    name: 'Classic Academic',
    description: 'Minimal white layout, centered university logo, elegant typography, and precise academic information alignment.',
    tag: 'Formal & Traditional',
  },
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    description: 'Sophisticated blue-and-white header inspired by the official logo, clean accent lines, and strong title hierarchy.',
    tag: 'Official University Blue',
  },
  {
    id: 'minimal-professional',
    name: 'Minimal Professional',
    description: 'Generous whitespace, thin borders, subtle blue details, and understated academic typography.',
    tag: 'Clean Minimalist',
  },
  {
    id: 'editorial-style',
    name: 'Editorial Style',
    description: 'Distinctive title treatment, refined serif hierarchy, and carefully balanced content blocks.',
    tag: 'Scholarly Publication',
  },
  {
    id: 'geometric-blue',
    name: 'Geometric Blue',
    description: 'Tasteful geometric accents, subtle navy and sky-blue shapes, and structured evaluation cards.',
    tag: 'Modern Architectural',
  },
  {
    id: 'premium-formal',
    name: 'Premium Formal',
    description: 'Formal academic structure, deep blue executive identity band, refined borders, and a professional footer.',
    tag: 'Executive & Group Reports',
  },
];

export const ACCENT_COLORS: AccentColorConfig[] = [
  {
    id: 'brac-blue',
    name: 'BRAC Official Blue',
    primary: '#2A5CAA', // Exact blue extracted from the official BRAC University logo SVG
    secondary: '#1B365D',
    tint: '#F0F6FF',
    border: '#BFDBFE',
    textContrast: '#FFFFFF',
  },
  {
    id: 'academic-navy',
    name: 'Academic Deep Navy',
    primary: '#1B365D', // Deep scholarly navy
    secondary: '#2A5CAA',
    tint: '#EEF4FC',
    border: '#CBD5E1',
    textContrast: '#FFFFFF',
  },
  {
    id: 'royal-cobalt',
    name: 'Royal Cobalt',
    primary: '#1E40AF', // Blue 800
    secondary: '#2563EB',
    tint: '#EFF6FF',
    border: '#93C5FD',
    textContrast: '#FFFFFF',
  },
  {
    id: 'slate-blue',
    name: 'Slate Blue & Charcoal',
    primary: '#334155', // Slate 700
    secondary: '#2A5CAA',
    tint: '#F8FAFC',
    border: '#E2E8F0',
    textContrast: '#FFFFFF',
  },
  {
    id: 'ocean-cyan',
    name: 'Ocean Blue',
    primary: '#0369A1', // Sky 700
    secondary: '#0284C7',
    tint: '#F0F9FF',
    border: '#BAE6FD',
    textContrast: '#FFFFFF',
  },
  {
    id: 'charcoal-monochrome',
    name: 'Charcoal & Subtle Blue',
    primary: '#231F20', // Matching charcoal from logo
    secondary: '#2A5CAA',
    tint: '#F8FAFC',
    border: '#E2E8F0',
    textContrast: '#FFFFFF',
  },
];

export const INITIAL_COVER_PAGE_DATA: CoverPageData = {
  universityName: 'BRAC University',
  departmentName: 'Department of Computer Science and Engineering',
  assignmentTitle: 'Design & Empirical Performance Analysis of Distributed Graph Algorithms',
  assignmentNumber: 'Assignment 02',
  courseTitle: 'Data Structures and Algorithms',
  courseCode: 'CSE220',
  semester: 'Fall 26',
  students: [
    {
      id: 'student-1',
      name: 'Abrar Rahman',
      studentId: '22301045',
      section: '04',
    },
  ],
  teacherName: 'Dr. Sadia Hamid Kazi',
  teacherDesignation: 'Associate Professor & Chairperson',
  submissionDate: 'November 15, 2026',
  customFields: [
    {
      id: 'cf-1',
      label: 'Lab Group',
      value: 'Group B (Session 2)',
    },
  ],
  template: 'modern-blue',
  accentColorId: 'brac-blue',
  fontChoice: 'classic-serif',
  borderStyle: 'classic-double',
  logoSize: 'medium',
  visibility: {
    showLogo: true,
    showDepartment: true,
    showAssignmentNo: true,
    showCourseCode: true,
    showSemester: true,
    showSection: true,
    showTeacherDesignation: true,
    showDate: true,
    showCustomFields: true,
  },
};

export const SAMPLE_PROJECTS: Record<string, Partial<CoverPageData>> = {
  bracSingle: {
    universityName: 'BRAC University',
    departmentName: 'Department of Computer Science and Engineering',
    assignmentTitle: 'Design & Empirical Performance Analysis of Distributed Graph Algorithms',
    assignmentNumber: 'Assignment 02',
    courseTitle: 'Data Structures and Algorithms',
    courseCode: 'CSE220',
    semester: 'Fall 26',
    students: [
      {
        id: 's-1',
        name: 'Abrar Rahman',
        studentId: '22301045',
        section: '04',
      },
    ],
    teacherName: 'Dr. Sadia Hamid Kazi',
    teacherDesignation: 'Associate Professor & Chairperson',
    submissionDate: 'November 15, 2026',
    template: 'modern-blue',
    accentColorId: 'brac-blue',
  },
  groupProject: {
    universityName: 'BRAC University',
    departmentName: 'Department of Electrical and Electronic Engineering',
    assignmentTitle: 'IoT-Based Microgrid Telemetry and Fault Detection System Architecture',
    assignmentNumber: 'Term Project Report',
    courseTitle: 'Power Systems Analysis & Smart Grids',
    courseCode: 'EEE451',
    semester: 'Spring 27',
    students: [
      {
        id: 's-1',
        name: 'Tahmid Hasan',
        studentId: '21101290',
        section: '01',
      },
      {
        id: 's-2',
        name: 'Nusrat Jahan Chowdhury',
        studentId: '21101412',
        section: '01',
      },
      {
        id: 's-3',
        name: 'Tanvir Ahmed',
        studentId: '21101563',
        section: '01',
      },
    ],
    teacherName: 'Prof. Dr. A. K. M. Abdul Malek',
    teacherDesignation: 'Professor, EEE',
    submissionDate: 'April 18, 2027',
    template: 'premium-formal',
    accentColorId: 'academic-navy',
  },
  researchThesis: {
    universityName: 'BRAC University',
    departmentName: 'BRAC Business School',
    assignmentTitle: 'Macroeconomic Determinants of Foreign Direct Investment in South Asia',
    assignmentNumber: 'Final Thesis Submission',
    courseTitle: 'Applied Econometrics & Policy Modeling',
    courseCode: 'ECO402',
    semester: 'Summer 27',
    students: [
      {
        id: 's-1',
        name: 'Farhan Kabir',
        studentId: '22104118',
        section: '02',
      },
    ],
    teacherName: 'Dr. Mohammad Mujibul Haque',
    teacherDesignation: 'Associate Professor of Economics',
    submissionDate: 'August 24, 2027',
    template: 'editorial-style',
    accentColorId: 'slate-blue',
  },
};

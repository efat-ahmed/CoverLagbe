/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CoverPageData, TemplateId } from '../types/coverPage';
import { INITIAL_COVER_PAGE_DATA } from '../config/constants';

const DRAFT_STORAGE_KEY = 'covercraft_assignment_draft_v3';
const DRAFT_SAVED_AT_KEY = 'covercraft_draft_saved_at_v3';

const VALID_TEMPLATES: TemplateId[] = [
  'classic-academic',
  'modern-blue',
  'minimal-professional',
  'editorial-style',
  'geometric-blue',
  'premium-formal',
];

export function saveDraft(data: CoverPageData): { success: boolean; savedAt: string } {
  try {
    const timestamp = new Date().toISOString();
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(DRAFT_SAVED_AT_KEY, timestamp);
    return { success: true, savedAt: timestamp };
  } catch (err) {
    console.error('Failed to save draft to localStorage', err);
    return { success: false, savedAt: '' };
  }
}

export function loadSavedDraft(): { data: CoverPageData | null; savedAt: string | null } {
  try {
    const raw =
      localStorage.getItem(DRAFT_STORAGE_KEY) ||
      localStorage.getItem('covercraft_assignment_draft_v2') ||
      localStorage.getItem('covercraft_assignment_draft_v1');
    const savedAt =
      localStorage.getItem(DRAFT_SAVED_AT_KEY) ||
      localStorage.getItem('covercraft_draft_saved_at_v2') ||
      localStorage.getItem('covercraft_draft_saved_at_v1');

    if (!raw) return { data: null, savedAt: null };

    const parsed = JSON.parse(raw);

    // Sanitize template & migrate older names
    let validTemplate: TemplateId = 'modern-blue';
    if (parsed.template === 'modern-brac') {
      validTemplate = 'modern-blue';
    } else if (parsed.template === 'geometric-accent') {
      validTemplate = 'geometric-blue';
    } else if (parsed.template && VALID_TEMPLATES.includes(parsed.template)) {
      validTemplate = parsed.template;
    }

    // Sanitize accent color (convert old red accents to brac-blue)
    let validAccentId = parsed.accentColorId || 'brac-blue';
    if (validAccentId === 'brac-crimson' || validAccentId === 'burgundy' || validAccentId === 'crimson') {
      validAccentId = 'brac-blue';
    }

    // Clean students list: remove any batch or regNo properties
    const cleanStudents = (Array.isArray(parsed.students) ? parsed.students : INITIAL_COVER_PAGE_DATA.students).map(
      (s: any, idx: number) => ({
        id: s.id || `student-${idx + 1}`,
        name: s.name || '',
        studentId: s.studentId || '',
        section: s.section || '',
      })
    );

    return {
      data: {
        ...INITIAL_COVER_PAGE_DATA,
        ...parsed,
        template: validTemplate,
        accentColorId: validAccentId,
        semester: parsed.semester || 'Fall 26',
        students: cleanStudents,
        visibility: {
          ...INITIAL_COVER_PAGE_DATA.visibility,
          ...(parsed.visibility || {}),
          showSemester: parsed.visibility?.showSemester ?? true,
        },
      },
      savedAt,
    };
  } catch (err) {
    console.error('Failed to load draft from localStorage', err);
    return { data: null, savedAt: null };
  }
}

export function clearSavedDraft(): void {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    localStorage.removeItem(DRAFT_SAVED_AT_KEY);
  } catch (err) {
    console.error('Failed to clear draft', err);
  }
}

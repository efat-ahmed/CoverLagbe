/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DEFAULT_UNIVERSITY_LOGO,
  INSTITUTION_LOGO_STORAGE_KEY,
  INSTITUTION_LOGO_CONFIGURED_KEY,
} from '../config/constants';

export interface LogoConfigState {
  url: string | null;
  isConfigured: boolean;
  isCustom: boolean;
  isDefaultAsset: boolean;
  assetPath: string;
}

export const LOGO_CHANGE_EVENT = 'covercraft_logo_changed';

/**
 * Returns the currently active institutional university logo.
 * Fixed across sessions, page refreshes, template switches, and assignments.
 */
export function getInstitutionalLogo(): LogoConfigState {
  if (typeof window === 'undefined') {
    return {
      url: DEFAULT_UNIVERSITY_LOGO,
      isConfigured: true,
      isCustom: false,
      isDefaultAsset: true,
      assetPath: DEFAULT_UNIVERSITY_LOGO,
    };
  }

  try {
    const configuredFlag = localStorage.getItem(INSTITUTION_LOGO_CONFIGURED_KEY);
    // Explicitly unconfigured (for setup testing)
    if (configuredFlag === 'false') {
      return {
        url: null,
        isConfigured: false,
        isCustom: false,
        isDefaultAsset: false,
        assetPath: DEFAULT_UNIVERSITY_LOGO,
      };
    }

    const customLogo = localStorage.getItem(INSTITUTION_LOGO_STORAGE_KEY);
    if (customLogo) {
      return {
        url: customLogo,
        isConfigured: true,
        isCustom: true,
        isDefaultAsset: false,
        assetPath: 'Custom Institutional Asset',
      };
    }
  } catch (e) {
    console.warn('Failed to read logo configuration from storage', e);
  }

  // Default preconfigured static asset
  return {
    url: DEFAULT_UNIVERSITY_LOGO,
    isConfigured: true,
    isCustom: false,
    isDefaultAsset: true,
    assetPath: DEFAULT_UNIVERSITY_LOGO,
  };
}

export function saveInstitutionalLogo(logoDataUrl: string): void {
  try {
    localStorage.setItem(INSTITUTION_LOGO_STORAGE_KEY, logoDataUrl);
    localStorage.setItem(INSTITUTION_LOGO_CONFIGURED_KEY, 'true');
    window.dispatchEvent(new Event(LOGO_CHANGE_EVENT));
  } catch (e) {
    console.error('Failed to save institutional logo', e);
    throw e;
  }
}

export function resetToDefaultInstitutionalLogo(): void {
  try {
    localStorage.removeItem(INSTITUTION_LOGO_STORAGE_KEY);
    localStorage.setItem(INSTITUTION_LOGO_CONFIGURED_KEY, 'true');
    window.dispatchEvent(new Event(LOGO_CHANGE_EVENT));
  } catch (e) {
    console.error('Failed to reset logo', e);
  }
}

export function setLogoUnconfiguredTesting(): void {
  try {
    localStorage.removeItem(INSTITUTION_LOGO_STORAGE_KEY);
    localStorage.setItem(INSTITUTION_LOGO_CONFIGURED_KEY, 'false');
    window.dispatchEvent(new Event(LOGO_CHANGE_EVENT));
  } catch (e) {
    console.error('Failed to set unconfigured flag', e);
  }
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { forwardRef } from 'react';
import { CoverPageData } from '../../types/coverPage';
import { ACCENT_COLORS } from '../../config/constants';
import { ClassicAcademicTemplate } from './ClassicAcademicTemplate';
import { ModernBlueTemplate } from './ModernBlueTemplate';
import { MinimalProfessionalTemplate } from './MinimalProfessionalTemplate';
import { EditorialStyleTemplate } from './EditorialStyleTemplate';
import { GeometricBlueTemplate } from './GeometricBlueTemplate';
import { PremiumFormalTemplate } from './PremiumFormalTemplate';

interface CoverPageRendererProps {
  data: CoverPageData;
  logoUrl: string | null;
  isLogoConfigured: boolean;
  className?: string;
}

/**
 * CoverPageRenderer: Single-page A4 portrait document (210 x 297 mm, 794px x 1123px at 96 DPI baseline).
 * All 6 templates receive identical data and configuration.
 */
export const CoverPageRenderer = forwardRef<HTMLDivElement, CoverPageRendererProps>(
  ({ data, logoUrl, isLogoConfigured, className = '' }, ref) => {
    const accentColor =
      ACCENT_COLORS.find((c) => c.id === data.accentColorId) || ACCENT_COLORS[0];

    const renderActiveTemplate = () => {
      switch (data.template) {
        case 'classic-academic':
          return (
            <ClassicAcademicTemplate
              data={data}
              logoUrl={logoUrl}
              isLogoConfigured={isLogoConfigured}
              accentColor={accentColor}
            />
          );
        case 'modern-blue':
          return (
            <ModernBlueTemplate
              data={data}
              logoUrl={logoUrl}
              isLogoConfigured={isLogoConfigured}
              accentColor={accentColor}
            />
          );
        case 'minimal-professional':
          return (
            <MinimalProfessionalTemplate
              data={data}
              logoUrl={logoUrl}
              isLogoConfigured={isLogoConfigured}
              accentColor={accentColor}
            />
          );
        case 'editorial-style':
          return (
            <EditorialStyleTemplate
              data={data}
              logoUrl={logoUrl}
              isLogoConfigured={isLogoConfigured}
              accentColor={accentColor}
            />
          );
        case 'geometric-blue':
          return (
            <GeometricBlueTemplate
              data={data}
              logoUrl={logoUrl}
              isLogoConfigured={isLogoConfigured}
              accentColor={accentColor}
            />
          );
        case 'premium-formal':
          return (
            <PremiumFormalTemplate
              data={data}
              logoUrl={logoUrl}
              isLogoConfigured={isLogoConfigured}
              accentColor={accentColor}
            />
          );
        default:
          return (
            <ModernBlueTemplate
              data={data}
              logoUrl={logoUrl}
              isLogoConfigured={isLogoConfigured}
              accentColor={accentColor}
            />
          );
      }
    };

    return (
      <div
        ref={ref}
        id="cover-page-render-target"
        className={`print-only-page bg-white shadow-xl relative overflow-hidden transition-all duration-150 ${className}`}
        style={{
          width: '794px',
          height: '1123px',
          minWidth: '794px',
          minHeight: '1123px',
          maxWidth: '794px',
          maxHeight: '1123px',
          boxSizing: 'border-box',
        }}
      >
        {renderActiveTemplate()}
      </div>
    );
  }
);

CoverPageRenderer.displayName = 'CoverPageRenderer';

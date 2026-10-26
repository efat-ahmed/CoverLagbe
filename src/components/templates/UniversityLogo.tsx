/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LogoSize } from '../../types/coverPage';
import { AlertCircle } from 'lucide-react';

interface UniversityLogoProps {
  logoUrl: string | null;
  isConfigured: boolean;
  size: LogoSize;
  className?: string;
  universityName?: string;
}

export const UniversityLogo: React.FC<UniversityLogoProps> = ({
  logoUrl,
  isConfigured,
  size,
  className = '',
  universityName = 'University',
}) => {
  const [imageError, setImageError] = useState(false);

  // Height mappings for accurate A4 scale
  const sizeStyles: Record<LogoSize, { container: string; img: string }> = {
    small: {
      container: 'h-14 max-w-[140px]',
      img: 'max-h-14 max-w-[140px]',
    },
    medium: {
      container: 'h-20 max-w-[190px]',
      img: 'max-h-20 max-w-[190px]',
    },
    large: {
      container: 'h-24 max-w-[240px]',
      img: 'max-h-24 max-w-[240px]',
    },
  };

  const currentSize = sizeStyles[size] || sizeStyles.medium;

  // Unconfigured placeholder state
  if (!isConfigured || !logoUrl) {
    return (
      <div
        className={`flex items-center gap-2 p-2.5 rounded-lg border border-dashed border-amber-300 bg-amber-50 text-amber-900 ${currentSize.container} ${className}`}
        title="Institution logo has not been configured in Admin Settings"
      >
        <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
        <div className="text-left leading-tight">
          <p className="text-[11px] font-semibold text-amber-900">Logo Setup Needed</p>
          <p className="text-[9px] text-amber-700">Configure institutional logo in setup</p>
        </div>
      </div>
    );
  }

  // Fallback if image fails to load
  if (imageError) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 ${currentSize.container} ${className}`}
      >
        <span className="text-[10px] font-semibold uppercase tracking-wider text-center line-clamp-1">
          {universityName}
        </span>
        <span className="text-[8px] text-slate-500">Official Monogram</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${currentSize.container} ${className}`}>
      <img
        src={logoUrl}
        alt={`${universityName} Official Logo`}
        className={`${currentSize.img} w-auto object-contain transition-transform`}
        onError={() => setImageError(true)}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
      />
    </div>
  );
};

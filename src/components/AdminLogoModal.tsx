/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import {
  Shield,
  Upload,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  X,
  FileCode,
  Info,
} from 'lucide-react';
import {
  getInstitutionalLogo,
  saveInstitutionalLogo,
  resetToDefaultInstitutionalLogo,
  setLogoUnconfiguredTesting,
  LogoConfigState,
} from '../utils/logoConfig';
import { DEFAULT_UNIVERSITY_LOGO } from '../config/constants';

interface AdminLogoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogoUpdated: () => void;
}

export const AdminLogoModal: React.FC<AdminLogoModalProps> = ({
  isOpen,
  onClose,
  onLogoUpdated,
}) => {
  const [logoState, setLogoState] = useState<LogoConfigState>(getInstitutionalLogo());
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setUploadFeedback('Please select a valid image file (SVG, PNG, JPG, or WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        saveInstitutionalLogo(result);
        const updated = getInstitutionalLogo();
        setLogoState(updated);
        setUploadFeedback('Institutional logo successfully updated and applied to all templates!');
        onLogoUpdated();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetToDefault = () => {
    resetToDefaultInstitutionalLogo();
    const updated = getInstitutionalLogo();
    setLogoState(updated);
    setUploadFeedback('Reset to default preconfigured BRAC University monogram.');
    onLogoUpdated();
  };

  const handleSimulateUnconfigured = () => {
    setLogoUnconfiguredTesting();
    const updated = getInstitutionalLogo();
    setLogoState(updated);
    setUploadFeedback('Set to unconfigured mode. All templates now display the setup placeholder.');
    onLogoUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Institutional Logo Configuration
              </h3>
              <p className="text-xs text-slate-300">
                Admin Setup · Fixed across all student assignment templates
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Institutional Policy Notice */}
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200/80 flex items-start gap-3 text-xs text-blue-900">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <p className="font-semibold text-blue-950">Preconfigured University Asset</p>
              <p className="text-blue-800/90 mt-0.5">
                The institutional university monogram is maintained centrally here. Students do not need
                to upload a logo for each assignment, and logo replacement controls are hidden in their editor.
              </p>
            </div>
          </div>

          {/* Current Logo Status Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Logo Status
              </span>
              {logoState.isConfigured ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active in All 6 Templates
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Not Configured (Setup Mode)
                </span>
              )}
            </div>

            {/* Logo Preview Canvas */}
            <div className="h-32 bg-white rounded-lg border border-slate-200 flex items-center justify-center p-4 relative overflow-hidden">
              {logoState.isConfigured && logoState.url ? (
                <img
                  src={logoState.url}
                  alt="Active Institutional Monogram"
                  className="max-h-24 max-w-[200px] object-contain transition-transform"
                />
              ) : (
                <div className="text-center p-3 text-amber-800">
                  <AlertTriangle className="w-6 h-6 mx-auto mb-1 text-amber-600" />
                  <p className="text-xs font-bold">Institutional Logo Not Configured</p>
                  <p className="text-[11px] text-amber-700">Templates will show setup placeholder</p>
                </div>
              )}
            </div>

            {/* Asset Metadata */}
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-mono-code">
              <span className="flex items-center gap-1">
                <FileCode className="w-3.5 h-3.5 text-slate-400" />
                Asset: {logoState.isDefaultAsset ? DEFAULT_UNIVERSITY_LOGO : 'Custom Upload'}
              </span>
              <span>Object-Fit: contain</span>
            </div>
          </div>

          {/* Feedback banner */}
          {uploadFeedback && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
              {uploadFeedback}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-1">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg,.png,.jpg,.jpeg,.webp,image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
              >
                <Upload className="w-4 h-4" />
                Upload New Institutional Logo
              </button>

              <button
                type="button"
                onClick={handleResetToDefault}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
              >
                <RefreshCw className="w-4 h-4 text-slate-500" />
                Reset to BRAC Monogram
              </button>
            </div>

            {/* Testing state toggle */}
            <div className="pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={handleSimulateUnconfigured}
                className="w-full text-center text-xs text-slate-500 hover:text-amber-800 py-1 transition-colors underline decoration-slate-300"
              >
                Test Placeholder: Simulate unconfigured logo state
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

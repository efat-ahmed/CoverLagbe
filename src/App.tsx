/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { CoverPageData } from './types/coverPage';
import { INITIAL_COVER_PAGE_DATA, SAMPLE_PROJECTS } from './config/constants';
import { Header } from './components/Header';
import { StepProgressBar, WorkflowStep } from './components/StepProgressBar';
import { EditorPanel } from './components/EditorPanel';
import { TemplateGalleryStep } from './components/TemplateGalleryStep';
import { AdminLogoModal } from './components/AdminLogoModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { ExportProgressModal } from './components/ExportProgressModal';
import {
  getInstitutionalLogo,
  LOGO_CHANGE_EVENT,
  LogoConfigState,
} from './utils/logoConfig';
import { saveDraft, loadSavedDraft, clearSavedDraft } from './utils/storage';
import { exportToPdf, exportToJpg, ExportProgress } from './utils/exportUtils';
import { preloadFontEmbedCSS } from './utils/fontUtils';
import { CoverPageRenderer } from './components/templates/CoverPageRenderer';

export default function App() {
  // main form state
  const [coverData, setCoverData] = useState<CoverPageData>(() => {
    const saved = loadSavedDraft();
    return saved.data || INITIAL_COVER_PAGE_DATA;
  });

  // Current workflow step: 1 = University & Course, 2 = Assignment & Students, 3 = Template & Export
  const [currentStep, setCurrentStep] = useState<WorkflowStep>(1);

  // Institutional logo state
  const [logoConfig, setLogoConfig] = useState<LogoConfigState>(getInstitutionalLogo());

  // Draft metadata
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(() => {
    const saved = loadSavedDraft();
    return saved.savedAt;
  });

  // Modal states
  const [isAdminLogoModalOpen, setIsAdminLogoModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);

  // Ref to render target
  const printTargetRef = useRef<HTMLDivElement | null>(null);

  // Listen for institutional logo changes
  useEffect(() => {
    const handleLogoChange = () => {
      setLogoConfig(getInstitutionalLogo());
    };
    window.addEventListener(LOGO_CHANGE_EVENT, handleLogoChange);
    return () => window.removeEventListener(LOGO_CHANGE_EVENT, handleLogoChange);
  }, []);

  // Preload web font binaries in background for instant, high-fidelity export
  useEffect(() => {
    preloadFontEmbedCSS();
  }, []);

  // Autosave draft (debounced by 800ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      const res = saveDraft(coverData);
      if (res.success) {
        setLastSavedAt(res.savedAt);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [coverData]);

  // Handle manual draft save
  const handleManualSave = () => {
    const res = saveDraft(coverData);
    if (res.success) {
      setLastSavedAt(res.savedAt);
    }
  };

  // Reset form
  const handleResetForm = () => {
    clearSavedDraft();
    setCoverData(INITIAL_COVER_PAGE_DATA);
    setCurrentStep(1);
    setLastSavedAt(null);
  };

  // Preset loader
  const handleLoadPreset = (presetKey: string) => {
    const preset = SAMPLE_PROJECTS[presetKey];
    if (preset) {
      setCoverData((prev) => ({
        ...prev,
        ...preset,
      }));
    }
  };

  const isExporting =
    exportProgress !== null &&
    ['preparing', 'rendering', 'saving'].includes(exportProgress.status);

  // Export handlers
  const handleExportPdf = async () => {
    if (isExporting) return;

    const target = printTargetRef.current || document.getElementById('cover-page-render-target');
    if (!target) {
      setExportProgress({
        status: 'error',
        message: 'Could not find document canvas to export',
      });
      return;
    }

    try {
      await exportToPdf(target, coverData, (progress) => {
        setExportProgress(progress);
      });
    } catch (err) {
      console.error('PDF Export encountered error:', err);
    }
  };

  const handleExportJpg = async () => {
    if (isExporting) return;

    const target = printTargetRef.current || document.getElementById('cover-page-render-target');
    if (!target) {
      setExportProgress({
        status: 'error',
        message: 'Could not find document canvas to export',
      });
      return;
    }

    try {
      await exportToJpg(target, coverData, (progress) => {
        setExportProgress(progress);
      });
    } catch (err) {
      console.error('JPG Export encountered error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* App Header */}
      <Header
        onResetClick={() => setIsResetModalOpen(true)}
        onAdminLogoClick={() => setIsAdminLogoModalOpen(true)}
        onSaveDraftClick={handleManualSave}
        onExportPdfClick={handleExportPdf}
        onExportJpgClick={handleExportJpg}
        isExporting={isExporting}
        lastSavedAt={lastSavedAt}
        currentStep={currentStep}
        onNavigateStep={setCurrentStep}
      />

      {/* Workflow Step Progress Bar */}
      <StepProgressBar
        currentStep={currentStep}
        onStepClick={setCurrentStep}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* Step 1 & Step 2: Information Entry Form (Mobile-First Centered Container) */}
        {currentStep < 3 ? (
          <div className="max-w-2xl mx-auto w-full">
            <EditorPanel
              data={coverData}
              onChange={setCoverData}
              onLoadPreset={handleLoadPreset}
              currentStep={currentStep}
              onNavigateStep={setCurrentStep}
            />

            {/* Offscreen Target for Export Pre-caching when on step 1 or 2 */}
            <div
              style={{ position: 'fixed', left: '-99999px', top: '0', pointerEvents: 'none', opacity: 0 }}
              aria-hidden="true"
            >
              <CoverPageRenderer
                ref={printTargetRef}
                data={coverData}
                logoUrl={logoConfig.url}
                isLogoConfigured={logoConfig.isConfigured}
              />
            </div>
          </div>
        ) : (
          /* Step 3: Template Selection & Export (The Grand Finale) */
          <TemplateGalleryStep
            data={coverData}
            onChange={setCoverData}
            logoUrl={logoConfig.url}
            isLogoConfigured={logoConfig.isConfigured}
            onExportPdf={handleExportPdf}
            onExportJpg={handleExportJpg}
            isExporting={isExporting}
            printTargetRef={printTargetRef}
            onNavigateStep={setCurrentStep}
          />
        )}
      </main>

      {/* Institutional Logo Configuration Modal (Admin Setup) */}
      <AdminLogoModal
        isOpen={isAdminLogoModalOpen}
        onClose={() => setIsAdminLogoModalOpen(false)}
        onLogoUpdated={() => setLogoConfig(getInstitutionalLogo())}
      />

      {/* Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetForm}
      />

      {/* Export Progress Modal */}
      <ExportProgressModal
        progress={exportProgress}
        onClose={() => setExportProgress(null)}
      />

      {/* Vercel Web Analytics */}
      <Analytics />
    </div>
  );
}

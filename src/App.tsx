/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {
  useState,
  useEffect,
  useRef,
  useDeferredValue,
  Suspense,
  lazy,
} from 'react';
import { CoverPageData } from './types/coverPage';
import { INITIAL_COVER_PAGE_DATA, SAMPLE_PROJECTS } from './config/constants';
import { Header } from './components/Header';
import { StepProgressBar, WorkflowStep } from './components/StepProgressBar';
import { EditorPanel } from './components/EditorPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { CoverPageRenderer } from './components/templates/CoverPageRenderer';
import {
  getInstitutionalLogo,
  LOGO_CHANGE_EVENT,
  LogoConfigState,
} from './utils/logoConfig';
import { saveDraft, loadSavedDraft, clearSavedDraft } from './utils/storage';
import { exportToPdf, exportToJpg, ExportProgress } from './utils/exportUtils';
import { preloadFontEmbedCSS } from './utils/fontUtils';
import { Footer } from './components/Footer';
import { Eye, X } from 'lucide-react';

// Lazy-loaded secondary steps & modals for minimal initial bundle size
const TemplateGalleryStep = lazy(() =>
  import('./components/TemplateGalleryStep').then((m) => ({ default: m.TemplateGalleryStep }))
);
const AdminLogoModal = lazy(() =>
  import('./components/AdminLogoModal').then((m) => ({ default: m.AdminLogoModal }))
);
const ResetConfirmModal = lazy(() =>
  import('./components/ResetConfirmModal').then((m) => ({ default: m.ResetConfirmModal }))
);
const ExportProgressModal = lazy(() =>
  import('./components/ExportProgressModal').then((m) => ({ default: m.ExportProgressModal }))
);

export default function App() {
  // Main form state
  const [coverData, setCoverData] = useState<CoverPageData>(() => {
    const saved = loadSavedDraft();
    return saved.data || INITIAL_COVER_PAGE_DATA;
  });

  // Use deferred value for the preview so typing in form inputs never lags
  const deferredCoverData = useDeferredValue(coverData);

  // Workflow step: 1 = University & Course, 2 = Assignment & Students, 3 = Template & Export
  const [currentStep, setCurrentStep] = useState<WorkflowStep>(1);

  // Institutional logo state
  const [logoConfig, setLogoConfig] = useState<LogoConfigState>(getInstitutionalLogo());

  // Draft metadata
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(() => {
    const saved = loadSavedDraft();
    return saved.savedAt;
  });

  // Modals & Tablet Preview Sheet
  const [isAdminLogoModalOpen, setIsAdminLogoModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isTabletPreviewOpen, setIsTabletPreviewOpen] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);

  // Ref to render target
  const printTargetRef = useRef<HTMLDivElement | null>(null);
  const lastExportTypeRef = useRef<'pdf' | 'jpg'>('pdf');

  // Listen for institutional logo updates
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

  // Helper to resolve an export render target
  const getExportTarget = (): HTMLElement | null => {
    return printTargetRef.current || document.getElementById('cover-page-render-target');
  };

  // Export handlers
  const handleExportPdf = async () => {
    if (isExporting) return;
    lastExportTypeRef.current = 'pdf';

    const target = getExportTarget();
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
    lastExportTypeRef.current = 'jpg';

    const target = getExportTarget();
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

  const handleRetryExport = () => {
    if (lastExportTypeRef.current === 'pdf') {
      handleExportPdf();
    } else {
      handleExportJpg();
    }
  };

  return (
    <div className="min-h-dvh flex flex-col font-sans text-slate-900 bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
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

      {/* Main Workspace: Adaptively sized for Phone, Tablet, Laptop, and Desktop */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-3 sm:p-5 lg:p-6 flex flex-col">
        {/* Step 1 & 2 Layout:
            - Phone (<768px): Single-column clean form
            - Tablet (768-1279px): Centered wider form + "Quick Preview" floating action
            - Laptop/Desktop (≥1280px / xl): Responsive side-by-side split view with live sticky preview
        */}
        {currentStep < 3 ? (
          <div className="flex-1 w-full">
            {/* Desktop Split View Container */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start h-full">
              {/* Form Column */}
              <div className="w-full max-w-2xl mx-auto xl:max-w-none xl:col-span-6 2xl:col-span-5 h-full">
                <EditorPanel
                  data={coverData}
                  onChange={setCoverData}
                  onLoadPreset={handleLoadPreset}
                  currentStep={currentStep}
                  onNavigateStep={setCurrentStep}
                />
              </div>

              {/* Desktop Sticky Live A4 Preview (Always visible on ≥1280px while editing) */}
              <div className="hidden xl:block xl:col-span-6 2xl:col-span-7 sticky top-20 h-[calc(100dvh-6rem)] max-h-[920px]">
                <PreviewPanel
                  data={deferredCoverData}
                  logoUrl={logoConfig.url}
                  isLogoConfigured={logoConfig.isConfigured}
                  printTargetRef={printTargetRef}
                  compactToolbar
                />
              </div>
            </div>

            {/* Tablet Quick Preview Floating Trigger (768px to 1279px) */}
            <div className="hidden md:block xl:hidden fixed bottom-6 right-6 z-30">
              <button
                type="button"
                onClick={() => setIsTabletPreviewOpen(true)}
                className="flex items-center gap-2 px-4 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl shadow-xl font-bold text-xs transition-transform hover:scale-105 active:scale-95"
              >
                <Eye className="w-4 h-4" />
                <span>Live A4 Preview</span>
              </button>
            </div>

            {/* Tablet Preview Modal Sheet */}
            {isTabletPreviewOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden">
                  <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-blue-700" />
                      Live Document Preview
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsTabletPreviewOpen(false)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
                      aria-label="Close preview"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-hidden p-2">
                    <PreviewPanel
                      data={deferredCoverData}
                      logoUrl={logoConfig.url}
                      isLogoConfigured={logoConfig.isConfigured}
                      printTargetRef={printTargetRef}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Step 3: Template Selection & Export (The Grand Finale) */
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[400px] text-slate-400 text-sm">
                Loading Template Studio...
              </div>
            }
          >
            <TemplateGalleryStep
              data={deferredCoverData}
              onChange={setCoverData}
              logoUrl={logoConfig.url}
              isLogoConfigured={logoConfig.isConfigured}
              onExportPdf={handleExportPdf}
              onExportJpg={handleExportJpg}
              isExporting={isExporting}
              printTargetRef={printTargetRef}
              onNavigateStep={setCurrentStep}
            />
          </Suspense>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Lazy Modals with Suspense */}
      <Suspense fallback={null}>
        {isAdminLogoModalOpen && (
          <AdminLogoModal
            isOpen={isAdminLogoModalOpen}
            onClose={() => setIsAdminLogoModalOpen(false)}
            onLogoUpdated={() => setLogoConfig(getInstitutionalLogo())}
          />
        )}

        {isResetModalOpen && (
          <ResetConfirmModal
            isOpen={isResetModalOpen}
            onClose={() => setIsResetModalOpen(false)}
            onConfirm={handleResetForm}
          />
        )}

        {exportProgress && (
          <ExportProgressModal
            progress={exportProgress}
            onClose={() => setExportProgress(null)}
            onRetry={handleRetryExport}
          />
        )}
      </Suspense>
    </div>
  );
}

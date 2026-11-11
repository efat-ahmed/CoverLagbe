# CoverLagbe? — BRAC University Assignment Cover Page Generator

CoverLagbe? is a modern, responsive web application designed for BRAC University students and faculty to effortlessly create, customize, and export professional academic cover pages in standard A4 format (794×1123 px).

---

## Features

- **6 Distinct Academic Templates**:
  - **Classic Academic**: Traditional, centered layout with elegant scholarly typography and clean rules.
  - **Modern Blue**: Contemporary split-header layout using official BRAC University blue accents.
  - **Minimal Professional**: Generous whitespace, refined hairline borders, and understated typography.
  - **Editorial Style**: Distinctive asymmetric typography, publication-grade serif headings, and editorial layout.
  - **Geometric Blue**: Architectural accents, clean geometric framing, and structured evaluation cards.
  - **Premium Formal**: Deep blue executive band, formal evaluation boxes, and high-contrast group layout.
- **Adaptive Layout Engine**: Automatically scales spacing, typography, and student cards when handling 4 to 6 group members (up to 6 students capped), long assignment titles (150+ chars), and custom metadata fields without clipping or overlapping.
- **Self-Hosted Academic Fonts**: 100% self-hosted Google Fonts (`woff2`) served locally from `/public/fonts/` (Cinzel, JetBrains Mono, Merriweather, Playfair Display, Plus Jakarta Sans) for zero-latency rendering and offline-resilient exports.
- **High-Fidelity PDF & JPG Export**:
  - High-resolution rendering (300 DPI for JPG, single-page vector-wrapped A4 PDF via `html-to-image` and `jsPDF`).
  - Isolated offscreen unscaled clone rendering to ensure exports match the preview pixel-for-pixel regardless of UI zoom/scale.
  - Inline base64 font embedding with automatic retry and error reporting in the progress modal.
  - Memory-safe progressive fallback (retries rendering at lower pixel ratios if browser runs low on canvas memory).
- **Custom Institutional Logo Support**:
  - Preconfigured with the official BRAC University vector logo (`/public/university-logo.svg`).
  - Customizable institutional logo via the **Custom Logo** modal with a 500 KB size limit and `localStorage` quota handling.
- **Print Friendly**: Fully configured `@media print` rules with `.no-print` tags on all toolbars, panels, and navigators for pristine native browser printing (`Ctrl+P` / `Cmd+P`).
- **Client-Side Draft Persistence**: Automatic auto-saving to browser `localStorage` preserving user drafts across sessions without requiring logins or external servers.

---

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Build**: Vite 6
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Export Engine**: `html-to-image` + `jspdf`
- **Package Manager**: Bun (`bun.lock`) / npm

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js (v18+)

### Installation & Development

Using Bun:
```bash
# Install dependencies
bun install

# Start local development server (port 3000)
bun run dev
```

Using npm:
```bash
# Install dependencies
npm install

# Start local development server (port 3000)
npm run dev
```

### Build & Lint

```bash
# Type check and lint
bun run lint
# or: npm run lint

# Production build
bun run build
# or: npm run build
```

---

## Project Structure

```text
coverlagbe/
├── public/
│   ├── fonts/                 # 15 self-hosted woff2 academic font files
│   ├── og.png                 # 1200x630 OpenGraph social share image
│   ├── university-logo.svg    # Default official BRAC University vector logo
│   └── favicon.svg            # Branded application favicon
├── src/
│   ├── components/
│   │   ├── templates/         # 6 A4 Cover Page Templates (794x1123 px)
│   │   │   ├── ClassicAcademicTemplate.tsx
│   │   │   ├── ModernBlueTemplate.tsx
│   │   │   ├── MinimalProfessionalTemplate.tsx
│   │   │   ├── EditorialStyleTemplate.tsx
│   │   │   ├── GeometricBlueTemplate.tsx
│   │   │   └── PremiumFormalTemplate.tsx
│   │   ├── AdminLogoModal.tsx       # Custom logo configuration & upload modal
│   │   ├── EditorPanel.tsx          # Assignment metadata & student roster form
│   │   ├── ExportProgressModal.tsx  # Export spinner, stage tracker, and warnings
│   │   ├── Footer.tsx               # Responsive copyright & social links
│   │   ├── Header.tsx               # App bar, preset loader, logo modal trigger
│   │   ├── PreviewPanel.tsx         # Live interactive scaled A4 preview & controls
│   │   ├── StepProgressBar.tsx      # Workflow navigation (Details -> Design -> Export)
│   │   └── TemplateGalleryStep.tsx  # Visual template selector with live thumbnails
│   ├── config/
│   │   └── constants.ts       # Color palettes, dynamic semester/date generators, templates
│   ├── types/
│   │   └── coverPage.ts       # TypeScript interfaces (CoverPageData, StudentInfo, etc.)
│   ├── utils/
│   │   ├── exportUtils.ts     # Offscreen cloning, image rasterization, jsPDF generation
│   │   ├── fontUtils.ts       # Local woff2 base64 caching & embed CSS builder
│   │   ├── logoStorage.ts     # Institutional logo persistence in localStorage
│   │   └── storage.ts         # User draft persistence with backward compatibility
│   ├── App.tsx                # Main application state & step router
│   ├── index.css              # Global styles, @font-face rules, Tailwind v4
│   └── main.tsx               # Application bootstrap
├── index.html                 # Entry point with OpenGraph & Twitter meta tags
├── package.json               # Dependencies and scripts
└── vite.config.ts             # Vite configuration with Tailwind CSS plugin
```

---

## How It Works

### 1. Institutional Logo Configuration
- The app defaults to `/university-logo.svg`.
- Users and administrators can open **Custom Logo** via the header or template empty state to upload a custom SVG, PNG, or JPEG.
- Uploads are validated against a 500 KB limit and saved to `localStorage` under `covercraft_institutional_logo_v1`.
- Graceful quota error handling alerts the user if browser storage is exceeded.
- In development mode (`import.meta.env.DEV`), a "Simulate unconfigured" toggle allows testing fallback UI states.

### 2. Isolated Export Engine (`exportUtils.ts`)
- **Offscreen Clone**: Unlike naive screenshot tools that capture the scaled preview element (which causes blurriness and misalignments from CSS `transform: scale()`), CoverLagbe creates an isolated clone attached to an invisible offscreen target at exact 794×1123 px dimensions.
- **Font & Asset Inlining**: Pre-fetches local `public/fonts/*.woff2`, converts them to base64 `data:` URIs, and injects them via `fontEmbedCSS` into `html-to-image`.
- **Memory Fallback**:
  - High-res JPG starts at `pixelRatio: 3.125` (~300 DPI). If canvas allocation fails due to memory pressure, it automatically retries at `2.0`, then `1.5`.
  - PDF starts at `pixelRatio: 2.5` and falls back to `2.0` and `1.5` if needed before inserting into a single standard A4 jsPDF canvas.
  - The final export quality is displayed in the success alert.

---

## License

Licensed under the [Apache License, Version 2.0](LICENSE).

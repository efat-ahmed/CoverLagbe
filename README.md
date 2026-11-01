# CoverLagbe

CoverLagbe is a React-based assignment cover page generator for BRAC University students. Create a polished A4 cover page, customize its content and styling, then download it as a print-ready PDF or high-resolution JPG.

## Features

- Guided three-step workflow:
  1. Enter university and course information
  2. Add assignment, instructor, and student details
  3. Choose a template, preview the result, and export it
- Six cover page templates:
  - Classic Academic
  - Modern Blue
  - Minimal Professional
  - Editorial Style
  - Geometric Blue
  - Premium Formal
- Support for individual and group assignments
- Custom accent colors, fonts, borders, logo size, and field visibility
- Preset sample projects for quickly testing common assignment types
- Automatic draft saving in the browser, with manual save and reset controls
- Centralized institutional logo configuration with support for SVG, PNG, JPG, and WEBP uploads
- A4 PDF export and 300 DPI JPG export
- Responsive editor and preview for desktop and mobile screens

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- `html-to-image` for rasterizing the cover page
- `jsPDF` for PDF generation
- Lucide React for icons
- Motion for UI animation

## Requirements

- Node.js 18 or newer
- npm, Bun, or another Node-compatible package manager

## Getting started

```bash
git clone https://github.com/efat-ahmed/CoverLagbe.git
cd CoverLagbe
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server on port 3000 |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run the TypeScript compiler without emitting files |
| `npm run clean` | Remove generated build artifacts |

## Usage

1. Fill in the university, department, course, semester, assignment, instructor, and submission details.
2. Add one or more students and optionally include custom fields such as a lab group.
3. Continue to **Template & Download**.
4. Select a template and adjust its accent color, font, border, logo size, and visible fields.
5. Use **Download PDF** for a single-page A4 PDF or **Download JPG** for a high-resolution image.

The editor automatically saves drafts to `localStorage` in the current browser. Use **Reset** to clear the saved draft and restore the default example data.

## Institutional logo

The default BRAC University monogram is included at `public/university-logo.svg` and is shared across all templates. The **Institutional Logo Configuration** dialog can:

- Upload a replacement SVG, PNG, JPG, or WEBP logo
- Restore the default BRAC University monogram
- Simulate an unconfigured logo state for testing

Logo configuration is stored locally in the browser and is not uploaded to a server by the application.

## Project structure

```text
src/
├── components/          Editor, workflow, modal, and preview components
├── components/templates/ Cover page template implementations
├── config/              Default data, template metadata, and color presets
├── types/               TypeScript data models
└── utils/               Draft storage, logo configuration, fonts, and exports
public/                  Static assets, including the default university logo
```

## Configuration

The repository includes `.env.example` for compatibility with the AI Studio project scaffold. The core CoverLagbe editor, local draft storage, logo handling, and exports do not require an API key or backend service.

## License

Source files include Apache-2.0 license headers. See the repository for the applicable licensing terms.

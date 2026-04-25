import type { PDFExportOptions } from '../types';

// html2pdf.js type declaration (loaded via CDN)
interface Html2PdfInstance {
  set: (options: unknown) => Html2PdfInstance;
  from: (element: HTMLElement | string) => Html2PdfInstance;
  save: () => Promise<void>;
  outputPdf: (type: 'blob' | 'datauristring') => Promise<Blob | string>;
}

declare global {
  interface Window {
    html2pdf?: () => Html2PdfInstance;
  }
}

/**
 * Default PDF export options
 */
const DEFAULT_PDF_OPTIONS: PDFExportOptions = {
  pageSize: 'a4',
  orientation: 'portrait',
  margin: 10,
  filename: 'document.pdf',
};

/**
 * Check if html2pdf.js is available
 */
export function isPDFExportAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.html2pdf === 'function';
}

/**
 * Get PDF export library status message
 */
export function getPDFLibraryStatus(): string {
  if (isPDFExportAvailable()) {
    return 'html2pdf.js is loaded and ready';
  }
  return 'html2pdf.js is not loaded. Add: <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.2/html2pdf.bundle.min.js"></script>';
}

/**
 * Export HTML content to PDF blob
 */
export async function exportToPDF(
  html: string,
  options: PDFExportOptions = {}
): Promise<Blob> {
  if (!isPDFExportAvailable()) {
    throw new Error(getPDFLibraryStatus());
  }

  const opts = { ...DEFAULT_PDF_OPTIONS, ...options };

  // Wrap HTML with styling (pass as string to avoid iframe/adoptedStyleSheets issues)
  const styledHtml = `
    <div style="
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #1a1a1a;
      background-color: #ffffff;
      padding: 20px;
      box-sizing: border-box;
      word-spacing: 0.1em;
      letter-spacing: normal;
    ">
      <style>
        * {
          word-spacing: 0.1em;
          letter-spacing: normal;
        }
        h1, h2, h3, h4, h5, h6 {
          word-spacing: 0.15em;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }
        p {
          margin: 0.8em 0;
        }
        ul, ol {
          margin: 0.8em 0;
          padding-left: 2em;
        }
        li {
          margin: 0.3em 0;
          padding-left: 0.5em;
        }
        pre {
          background-color: #f4f4f4 !important;
          padding: 12px !important;
          border-radius: 4px !important;
          overflow-x: auto !important;
          font-family: 'Courier New', monospace !important;
          font-size: 10pt !important;
          margin: 1em 0;
        }
        code {
          background-color: #f4f4f4;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
        }
        pre code {
          background-color: transparent;
          padding: 0;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f4f4f4;
        }
        blockquote {
          border-left: 4px solid #ddd;
          margin: 1em 0;
          padding-left: 1em;
          color: #666;
        }
        hr {
          border: none;
          border-top: 1px solid #ddd;
          margin: 1.5em 0;
        }
      </style>
      ${html}
    </div>
  `;

  const pdfOptions = {
    margin: opts.margin,
    filename: opts.filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    },
    jsPDF: {
      unit: 'mm',
      format: opts.pageSize,
      orientation: opts.orientation,
    },
  };

  // Pass HTML string directly - html2pdf will create its own clean container
  const blob = await window.html2pdf!()
    .set(pdfOptions)
    .from(styledHtml)
    .outputPdf('blob');

  return blob as Blob;
}

/**
 * Export and trigger download
 */
export async function downloadPDF(
  html: string,
  options: PDFExportOptions = {}
): Promise<void> {
  const blob = await exportToPDF(html, options);
  triggerDownload(blob, options.filename ?? 'document.pdf');
}

/**
 * Trigger file download
 */
function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

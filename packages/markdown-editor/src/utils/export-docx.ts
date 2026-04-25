import type { DOCXExportOptions } from '../types';

// docx library type declarations (loaded via CDN or import)
declare global {
  interface Window {
    docx?: {
      Document: new (options: unknown) => DocxDocument;
      Packer: {
        toBlob: (doc: DocxDocument) => Promise<Blob>;
      };
      Paragraph: new (options: unknown) => DocxParagraph;
      TextRun: new (options: unknown) => DocxTextRun;
      HeadingLevel: Record<string, string>;
      AlignmentType: Record<string, string>;
    };
  }
}

interface DocxDocument {
  sections: unknown[];
}

interface DocxParagraph {
  children: unknown[];
}

interface DocxTextRun {
  text: string;
}

/**
 * Default DOCX export options
 */
const DEFAULT_DOCX_OPTIONS: DOCXExportOptions = {
  title: 'Document',
  filename: 'document.docx',
};

/**
 * Check if docx library is available
 */
export function isDOCXExportAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.docx !== 'undefined';
}

/**
 * Get DOCX library status message
 */
export function getDOCXLibraryStatus(): string {
  if (isDOCXExportAvailable()) {
    return 'docx library is loaded and ready';
  }
  return 'docx library is not loaded. Add: <script src="https://unpkg.com/docx@9.0.2/build/index.umd.js"></script>';
}

/**
 * Convert HTML to DOCX paragraphs (simplified)
 */
function htmlToDocxParagraphs(html: string): unknown[] {
  const docx = window.docx!;
  const paragraphs: unknown[] = [];

  // Create a temporary DOM element to parse HTML
  const container = document.createElement('div');
  container.innerHTML = html;

  // Walk through child elements
  const children = container.children;
  for (let i = 0; i < children.length; i++) {
    const el = children[i] as HTMLElement;
    const tagName = el.tagName.toLowerCase();
    const text = el.textContent ?? '';

    if (tagName.match(/^h[1-6]$/)) {
      const level = parseInt(tagName[1], 10);
      paragraphs.push(
        new docx.Paragraph({
          text,
          heading: `Heading${level}`,
        })
      );
    } else if (tagName === 'p') {
      paragraphs.push(
        new docx.Paragraph({
          children: parseInlineElements(el),
        })
      );
    } else if (tagName === 'ul' || tagName === 'ol') {
      const items = el.querySelectorAll('li');
      items.forEach((li, index) => {
        paragraphs.push(
          new docx.Paragraph({
            text: `${tagName === 'ol' ? `${index + 1}. ` : '- '}${li.textContent}`,
          })
        );
      });
    } else if (tagName === 'pre') {
      const code = el.querySelector('code');
      const codeText = code?.textContent ?? el.textContent ?? '';
      codeText.split('\n').forEach((line) => {
        paragraphs.push(
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: line,
                font: 'Courier New',
                size: 20,
              }),
            ],
          })
        );
      });
    } else if (tagName === 'blockquote') {
      paragraphs.push(
        new docx.Paragraph({
          text: `> ${text}`,
          indent: { left: 720 },
        })
      );
    } else {
      // Default: treat as paragraph
      if (text.trim()) {
        paragraphs.push(
          new docx.Paragraph({
            text,
          })
        );
      }
    }
  }

  return paragraphs;
}

/**
 * Parse inline elements (bold, italic, etc.)
 */
function parseInlineElements(element: HTMLElement): unknown[] {
  const docx = window.docx!;
  const runs: unknown[] = [];

  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);

  let node: Node | null = walker.nextNode();
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const parent = node.parentElement;
      const text = node.textContent ?? '';

      if (text.trim()) {
        const options: Record<string, unknown> = { text };

        if (parent?.closest('strong, b')) {
          options.bold = true;
        }
        if (parent?.closest('em, i')) {
          options.italics = true;
        }
        if (parent?.closest('code')) {
          options.font = 'Courier New';
        }

        runs.push(new docx.TextRun(options));
      }
    }
    node = walker.nextNode();
  }

  if (runs.length === 0) {
    runs.push(new docx.TextRun({ text: element.textContent ?? '' }));
  }

  return runs;
}

/**
 * Export HTML content to DOCX blob
 */
export async function exportToDOCX(
  html: string,
  options: DOCXExportOptions = {}
): Promise<Blob> {
  if (!isDOCXExportAvailable()) {
    throw new Error(getDOCXLibraryStatus());
  }

  const opts = { ...DEFAULT_DOCX_OPTIONS, ...options };
  const docx = window.docx!;

  const paragraphs = htmlToDocxParagraphs(html);

  const doc = new docx.Document({
    title: opts.title,
    sections: [
      {
        children: paragraphs,
      },
    ],
  });

  return docx.Packer.toBlob(doc);
}

/**
 * Export and trigger download
 */
export async function downloadDOCX(
  html: string,
  options: DOCXExportOptions = {}
): Promise<void> {
  const blob = await exportToDOCX(html, options);
  triggerDownload(blob, options.filename ?? 'document.docx');
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

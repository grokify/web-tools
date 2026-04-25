/**
 * @grokify/markdown-editor
 *
 * Client-side Markdown editor with live preview and PDF/DOCX export.
 * Built with Lit Web Components.
 *
 * @example
 * ```html
 * <script src="https://unpkg.com/@grokify/markdown-editor/dist/markdown-editor.min.js"></script>
 * <markdown-editor></markdown-editor>
 * ```
 *
 * @example
 * ```typescript
 * import { MarkdownEditor } from '@grokify/markdown-editor';
 *
 * const editor = document.querySelector('markdown-editor');
 * editor.setValue('# Hello World');
 * ```
 */

// Main editor component
export { MarkdownEditor } from './components/markdown-editor';

// Sub-components (for advanced usage)
export { MdeToolbar } from './components/mde-toolbar';
export { MdeTextarea } from './components/mde-textarea';
export { MdePreview } from './components/mde-preview';

// Utilities
export { parseMarkdown, createMarkdownParser, extractFrontmatter, generateTOC } from './utils/markdown';
export { exportToPDF, downloadPDF, isPDFExportAvailable } from './utils/export-pdf';
export { exportToDOCX, downloadDOCX, isDOCXExportAvailable } from './utils/export-docx';

// Types
export type {
  MarkdownEditorConfig,
  ExportFormat,
  PDFExportOptions,
  DOCXExportOptions,
  MarkdownItOptions,
  AutosaveConfig,
  ToolbarItem,
  EditorChangeEventDetail,
  ExportEventDetail,
} from './types';

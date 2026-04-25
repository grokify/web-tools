/**
 * Configuration options for MarkdownEditor
 */
export interface MarkdownEditorConfig {
  /** Initial markdown content */
  initialValue?: string;
  /** Placeholder text when editor is empty */
  placeholder?: string;
  /** Enable/disable toolbar */
  toolbar?: boolean;
  /** Enable/disable live preview */
  preview?: boolean;
  /** Layout mode */
  layout?: 'split' | 'tabs' | 'editor-only' | 'preview-only';
  /** Theme */
  theme?: 'light' | 'dark' | 'auto';
  /** Export formats to enable */
  exportFormats?: ExportFormat[];
  /** Autosave to localStorage */
  autosave?: boolean | AutosaveConfig;
  /** Markdown-it options */
  markdownOptions?: MarkdownItOptions;
}

/**
 * Toolbar item definition
 */
export interface ToolbarItem {
  id: string;
  icon: string;
  title: string;
  action: 'bold' | 'italic' | 'heading' | 'link' | 'image' | 'code' | 'quote' | 'list' | 'ordered-list' | 'custom';
  prefix?: string;
  suffix?: string;
  block?: boolean;
}

/**
 * Autosave configuration
 */
export interface AutosaveConfig {
  /** Storage key */
  key?: string;
  /** Debounce delay in ms */
  delay?: number;
}

/**
 * Export format types
 */
export type ExportFormat = 'pdf' | 'docx' | 'html' | 'md';

/**
 * Markdown-it configuration options
 */
export interface MarkdownItOptions {
  html?: boolean;
  xhtmlOut?: boolean;
  breaks?: boolean;
  linkify?: boolean;
  typographer?: boolean;
}

/**
 * PDF export options
 */
export interface PDFExportOptions {
  /** Page size */
  pageSize?: 'a4' | 'letter' | 'legal';
  /** Page orientation */
  orientation?: 'portrait' | 'landscape';
  /** Margins in mm */
  margin?: number;
  /** Filename for download */
  filename?: string;
}

/**
 * DOCX export options
 */
export interface DOCXExportOptions {
  /** Document title */
  title?: string;
  /** Filename for download */
  filename?: string;
}

/**
 * Editor change event detail
 */
export interface EditorChangeEventDetail {
  content: string;
  html: string;
}

/**
 * Export event detail
 */
export interface ExportEventDetail {
  format: ExportFormat;
  blob?: Blob;
  error?: Error;
}

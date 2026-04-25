import { LitElement, html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { sharedStyles } from '../styles/shared.styles';
import { downloadPDF, isPDFExportAvailable } from '../utils/export-pdf';
import { downloadDOCX, isDOCXExportAvailable } from '../utils/export-docx';
import type { MarkdownEditorConfig, ExportFormat } from '../types';
import type { ToolbarActionEvent } from './mde-toolbar';
import type { MdeTextarea } from './mde-textarea';
import type { MdePreview } from './mde-preview';

// Import sub-components
import './mde-toolbar';
import './mde-textarea';
import './mde-preview';

/**
 * Main Markdown Editor Component
 *
 * @fires content-change - When markdown content changes
 * @fires export-start - When export begins
 * @fires export-complete - When export completes successfully
 * @fires export-error - When export fails
 */
@customElement('markdown-editor')
export class MarkdownEditor extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        height: 100%;
        min-height: 400px;
      }

      .editor-root {
        display: flex;
        flex-direction: column;
        height: 100%;
        border: 1px solid var(--mde-border);
        border-radius: var(--mde-radius-lg);
        overflow: hidden;
        background: var(--mde-bg-primary);
      }

      .editor-body {
        display: flex;
        flex: 1;
        overflow: hidden;
      }

      .editor-pane,
      .preview-pane {
        flex: 1;
        min-width: 0;
        overflow: hidden;
      }

      .editor-pane {
        border-right: 1px solid var(--mde-border);
      }

      /* Layout modes */
      :host([layout='editor-only']) .preview-pane {
        display: none;
      }

      :host([layout='editor-only']) .editor-pane {
        border-right: none;
      }

      :host([layout='preview-only']) .editor-pane {
        display: none;
      }

      :host([layout='preview-only']) .preview-pane {
        border-left: none;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .editor-body {
          flex-direction: column;
        }

        .editor-pane {
          border-right: none;
          border-bottom: 1px solid var(--mde-border);
        }
      }

      /* Toast notification */
      .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: var(--mde-spacing-sm) var(--mde-spacing-md);
        background: var(--mde-bg-secondary);
        border: 1px solid var(--mde-border);
        border-radius: var(--mde-radius-md);
        box-shadow: var(--mde-shadow-md);
        z-index: 1000;
        animation: slideIn 0.3s ease;
      }

      .toast.success {
        border-color: var(--mde-success);
      }

      .toast.error {
        border-color: var(--mde-error);
      }

      @keyframes slideIn {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `,
  ];

  @property({ type: String })
  value = '';

  @property({ type: String })
  placeholder = 'Start writing markdown...';

  @property({ type: Boolean })
  toolbar = true;

  @property({ type: Boolean })
  preview = true;

  @property({ type: String, reflect: true })
  layout: 'split' | 'editor-only' | 'preview-only' = 'split';

  @property({ type: String, reflect: true })
  theme: 'light' | 'dark' | 'auto' = 'dark';

  @property({ type: Array })
  exportFormats: ExportFormat[] = ['pdf', 'docx'];

  @property({ type: Boolean })
  autosave = false;

  @property({ type: String })
  autosaveKey = 'markdown-editor-content';

  @state()
  private _toastMessage = '';

  @state()
  private _toastType: 'success' | 'error' = 'success';

  @state()
  private _showToast = false;

  @query('mde-textarea')
  private _textarea!: MdeTextarea;

  @query('mde-preview')
  private _preview!: MdePreview;

  private _autosaveTimeout?: number;

  override connectedCallback(): void {
    super.connectedCallback();

    // Apply theme
    if (this.theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setAttribute('theme', prefersDark ? 'dark' : 'light');
    }

    // Load autosaved content
    if (this.autosave && !this.value) {
      const saved = localStorage.getItem(this.autosaveKey);
      if (saved) {
        this.value = saved;
      }
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._autosaveTimeout) {
      clearTimeout(this._autosaveTimeout);
    }
  }

  private _handleContentChange(e: CustomEvent<{ content: string }>): void {
    this.value = e.detail.content;

    // Autosave
    if (this.autosave) {
      if (this._autosaveTimeout) {
        clearTimeout(this._autosaveTimeout);
      }
      this._autosaveTimeout = window.setTimeout(() => {
        localStorage.setItem(this.autosaveKey, this.value);
      }, 1000);
    }

    // Dispatch event
    this.dispatchEvent(
      new CustomEvent('content-change', {
        detail: {
          content: this.value,
          html: this._preview?.getHTML() ?? '',
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleToolbarAction(e: CustomEvent<ToolbarActionEvent>): void {
    const { action, prefix, suffix } = e.detail;

    if (action === 'export') {
      this._handleExport(prefix as ExportFormat);
    } else if (prefix) {
      this._textarea?.wrapSelection(prefix, suffix ?? '');
    }
  }

  private _handleLayoutChange(e: CustomEvent<{ layout: string }>): void {
    this.layout = e.detail.layout as 'split' | 'editor-only' | 'preview-only';
  }

  private async _handleExport(format: ExportFormat): Promise<void> {
    this.dispatchEvent(
      new CustomEvent('export-start', {
        detail: { format },
        bubbles: true,
        composed: true,
      })
    );

    try {
      const htmlContent = this._preview?.getHTML() ?? '';

      if (format === 'pdf') {
        if (!isPDFExportAvailable()) {
          throw new Error(
            'html2pdf.js is required for PDF export. Add: <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.2/html2pdf.bundle.min.js"></script>'
          );
        }
        await downloadPDF(htmlContent, { filename: 'document.pdf' });
      } else if (format === 'docx') {
        if (!isDOCXExportAvailable()) {
          throw new Error(
            'docx library is required for DOCX export. Add: <script src="https://unpkg.com/docx@9.0.2/build/index.umd.js"></script>'
          );
        }
        await downloadDOCX(htmlContent, { filename: 'document.docx' });
      } else if (format === 'html') {
        this._downloadText(htmlContent, 'document.html', 'text/html');
      } else if (format === 'md') {
        this._downloadText(this.value, 'document.md', 'text/markdown');
      }

      this._showToastMessage(`Exported to ${format.toUpperCase()}`, 'success');

      this.dispatchEvent(
        new CustomEvent('export-complete', {
          detail: { format },
          bubbles: true,
          composed: true,
        })
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Export failed';
      this._showToastMessage(message, 'error');

      this.dispatchEvent(
        new CustomEvent('export-error', {
          detail: { format, error },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private _downloadText(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private _showToastMessage(message: string, type: 'success' | 'error'): void {
    this._toastMessage = message;
    this._toastType = type;
    this._showToast = true;

    setTimeout(() => {
      this._showToast = false;
    }, 3000);
  }

  /**
   * Get current markdown content
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Set markdown content
   */
  setValue(content: string): void {
    this.value = content;
    this._textarea?.setValue(content);
  }

  /**
   * Get rendered HTML
   */
  getHTML(): string {
    return this._preview?.getHTML() ?? '';
  }

  /**
   * Focus the editor
   */
  override focus(): void {
    this._textarea?.focus();
  }

  /**
   * Export to specified format
   */
  async export(format: ExportFormat): Promise<void> {
    await this._handleExport(format);
  }

  override render() {
    return html`
      <div class="editor-root">
        ${this.toolbar
          ? html`
              <mde-toolbar
                theme=${this.theme}
                .exportFormats=${this.exportFormats}
                .layout=${this.layout}
                @toolbar-action=${this._handleToolbarAction}
                @layout-change=${this._handleLayoutChange}
              ></mde-toolbar>
            `
          : ''}

        <div class="editor-body">
          <div class="editor-pane">
            <mde-textarea
              theme=${this.theme}
              .value=${this.value}
              .placeholder=${this.placeholder}
              @content-change=${this._handleContentChange}
            ></mde-textarea>
          </div>

          ${this.preview
            ? html`
                <div class="preview-pane">
                  <mde-preview theme=${this.theme} .markdown=${this.value}></mde-preview>
                </div>
              `
            : ''}
        </div>
      </div>

      ${this._showToast
        ? html`<div class="toast ${this._toastType}">${this._toastMessage}</div>`
        : ''}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'markdown-editor': MarkdownEditor;
  }
}

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../styles/shared.styles';
import { icons } from './icons';
import type { ExportFormat } from '../types';

/**
 * Toolbar event detail
 */
export interface ToolbarActionEvent {
  action: string;
  prefix?: string;
  suffix?: string;
}

/**
 * Markdown Editor Toolbar Component
 */
@customElement('mde-toolbar')
export class MdeToolbar extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }

      .toolbar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--mde-spacing-xs);
        padding: var(--mde-spacing-sm);
        background: var(--mde-bg-secondary);
        border-bottom: 1px solid var(--mde-border);
      }

      .toolbar-group {
        display: flex;
        align-items: center;
        gap: 2px;
      }

      .toolbar-group:not(:last-child)::after {
        content: '';
        display: block;
        width: 1px;
        height: 24px;
        background: var(--mde-border);
        margin: 0 var(--mde-spacing-sm);
      }

      button {
        min-width: 32px;
        height: 32px;
        padding: var(--mde-spacing-xs);
      }

      button svg {
        display: block;
      }

      button.active {
        background: var(--mde-bg-tertiary);
        border-color: var(--mde-accent);
        color: var(--mde-accent);
      }

      .export-group {
        margin-left: auto;
      }

      .export-group button {
        padding: var(--mde-spacing-xs) var(--mde-spacing-sm);
        gap: var(--mde-spacing-xs);
      }

      .export-group button span {
        font-size: var(--mde-font-size-sm);
      }
    `,
  ];

  @property({ type: Array })
  exportFormats: ExportFormat[] = ['pdf', 'docx'];

  @property({ type: String })
  layout: 'split' | 'editor-only' | 'preview-only' = 'split';

  @property({ type: String, reflect: true })
  theme: 'light' | 'dark' | 'auto' = 'dark';

  private _dispatchAction(action: string, prefix?: string, suffix?: string): void {
    this.dispatchEvent(
      new CustomEvent<ToolbarActionEvent>('toolbar-action', {
        detail: { action, prefix, suffix },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleFormat(action: string, prefix: string, suffix?: string): void {
    this._dispatchAction(action, prefix, suffix);
  }

  private _handleExport(format: ExportFormat): void {
    this._dispatchAction('export', format);
  }

  private _handleLayoutChange(layout: 'split' | 'editor-only' | 'preview-only'): void {
    this.dispatchEvent(
      new CustomEvent('layout-change', {
        detail: { layout },
        bubbles: true,
        composed: true,
      })
    );
  }

  override render() {
    return html`
      <div class="toolbar" role="toolbar" aria-label="Markdown formatting">
        <!-- Formatting group -->
        <div class="toolbar-group">
          <button
            type="button"
            title="Bold (Ctrl+B)"
            @click=${() => this._handleFormat('bold', '**', '**')}
          >
            ${icons.bold}
          </button>
          <button
            type="button"
            title="Italic (Ctrl+I)"
            @click=${() => this._handleFormat('italic', '_', '_')}
          >
            ${icons.italic}
          </button>
          <button
            type="button"
            title="Code"
            @click=${() => this._handleFormat('code', '`', '`')}
          >
            ${icons.code}
          </button>
        </div>

        <!-- Structure group -->
        <div class="toolbar-group">
          <button
            type="button"
            title="Heading"
            @click=${() => this._handleFormat('heading', '## ', '')}
          >
            ${icons.heading}
          </button>
          <button
            type="button"
            title="Quote"
            @click=${() => this._handleFormat('quote', '> ', '')}
          >
            ${icons.quote}
          </button>
        </div>

        <!-- List group -->
        <div class="toolbar-group">
          <button
            type="button"
            title="Bullet list"
            @click=${() => this._handleFormat('list', '- ', '')}
          >
            ${icons.list}
          </button>
          <button
            type="button"
            title="Numbered list"
            @click=${() => this._handleFormat('ordered-list', '1. ', '')}
          >
            ${icons.orderedList}
          </button>
        </div>

        <!-- Insert group -->
        <div class="toolbar-group">
          <button
            type="button"
            title="Link"
            @click=${() => this._handleFormat('link', '[', '](url)')}
          >
            ${icons.link}
          </button>
          <button
            type="button"
            title="Image"
            @click=${() => this._handleFormat('image', '![alt](', ')')}
          >
            ${icons.image}
          </button>
        </div>

        <!-- Layout group -->
        <div class="toolbar-group">
          <button
            type="button"
            title="Split view"
            class=${this.layout === 'split' ? 'active' : ''}
            @click=${() => this._handleLayoutChange('split')}
          >
            ${icons.split}
          </button>
          <button
            type="button"
            title="Editor only"
            class=${this.layout === 'editor-only' ? 'active' : ''}
            @click=${() => this._handleLayoutChange('editor-only')}
          >
            ${icons.edit}
          </button>
          <button
            type="button"
            title="Preview only"
            class=${this.layout === 'preview-only' ? 'active' : ''}
            @click=${() => this._handleLayoutChange('preview-only')}
          >
            ${icons.preview}
          </button>
        </div>

        <!-- Export group -->
        <div class="toolbar-group export-group">
          ${this.exportFormats.includes('pdf')
            ? html`
                <button
                  type="button"
                  class="primary"
                  title="Export to PDF"
                  @click=${() => this._handleExport('pdf')}
                >
                  ${icons.pdf}
                  <span>PDF</span>
                </button>
              `
            : ''}
          ${this.exportFormats.includes('docx')
            ? html`
                <button
                  type="button"
                  title="Export to DOCX"
                  @click=${() => this._handleExport('docx')}
                >
                  ${icons.docx}
                  <span>DOCX</span>
                </button>
              `
            : ''}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mde-toolbar': MdeToolbar;
  }
}

import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { sharedStyles } from '../styles/shared.styles';
import { parseMarkdown } from '../utils/markdown';
import type { MarkdownItOptions } from '../types';

/**
 * Prose/Typography styles for rendered markdown
 */
const proseStyles = css`
  .prose {
    line-height: 1.75;
    color: var(--mde-text-primary);
  }

  .prose h1,
  .prose h2,
  .prose h3,
  .prose h4,
  .prose h5,
  .prose h6 {
    margin-top: 2em;
    margin-bottom: 0.75em;
    font-weight: 600;
    line-height: 1.3;
    color: var(--mde-text-primary);
  }

  .prose h1:first-child,
  .prose h2:first-child,
  .prose h3:first-child {
    margin-top: 0;
  }

  .prose h1 {
    font-size: 2em;
    border-bottom: 1px solid var(--mde-border);
    padding-bottom: 0.3em;
  }

  .prose h2 {
    font-size: 1.5em;
    border-bottom: 1px solid var(--mde-border);
    padding-bottom: 0.3em;
  }

  .prose h3 {
    font-size: 1.25em;
  }

  .prose p {
    margin: 1em 0;
  }

  .prose a {
    color: var(--mde-accent);
    text-decoration: none;
  }

  .prose a:hover {
    text-decoration: underline;
  }

  .prose strong {
    font-weight: 600;
  }

  .prose code {
    background: var(--mde-bg-tertiary);
    padding: 0.2em 0.4em;
    border-radius: var(--mde-radius-sm);
    font-family: var(--mde-font-mono);
    font-size: 0.875em;
  }

  .prose pre {
    background: var(--mde-bg-secondary);
    border: 1px solid var(--mde-border);
    border-radius: var(--mde-radius-md);
    padding: var(--mde-spacing-md);
    overflow-x: auto;
    margin: 1.5em 0;
  }

  .prose pre code {
    background: none;
    padding: 0;
    border-radius: 0;
    font-size: 0.875em;
    line-height: 1.7;
  }

  .prose blockquote {
    border-left: 4px solid var(--mde-accent);
    margin: 1.5em 0;
    padding: 0.5em 0 0.5em 1em;
    color: var(--mde-text-secondary);
    background: var(--mde-bg-secondary);
    border-radius: 0 var(--mde-radius-sm) var(--mde-radius-sm) 0;
  }

  .prose blockquote p {
    margin: 0;
  }

  .prose ul,
  .prose ol {
    margin: 1em 0;
    padding-left: 2em;
  }

  .prose li {
    margin: 0.5em 0;
  }

  .prose ul ul,
  .prose ul ol,
  .prose ol ul,
  .prose ol ol {
    margin: 0.5em 0;
  }

  .prose hr {
    border: none;
    border-top: 1px solid var(--mde-border);
    margin: 2em 0;
  }

  .prose table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5em 0;
  }

  .prose th,
  .prose td {
    border: 1px solid var(--mde-border);
    padding: 0.5em 1em;
    text-align: left;
  }

  .prose th {
    background: var(--mde-bg-secondary);
    font-weight: 600;
  }

  .prose img {
    max-width: 100%;
    height: auto;
    border-radius: var(--mde-radius-md);
  }

  .prose .task-list-item {
    list-style: none;
    margin-left: -1.5em;
  }

  .prose .task-list-item input {
    margin-right: 0.5em;
  }
`;

/**
 * Markdown Preview Component
 */
@customElement('mde-preview')
export class MdePreview extends LitElement {
  static override styles = [
    sharedStyles,
    proseStyles,
    css`
      :host {
        display: block;
        height: 100%;
        overflow: hidden;
      }

      .preview-container {
        height: 100%;
        overflow-y: auto;
        padding: var(--mde-spacing-md) var(--mde-spacing-lg);
        background: var(--mde-bg-primary);
      }

      .empty-state {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: var(--mde-text-muted);
        font-style: italic;
      }
    `,
  ];

  @property({ type: String })
  markdown = '';

  @property({ type: Object })
  markdownOptions: MarkdownItOptions = {};

  @property({ type: String, reflect: true })
  theme: 'light' | 'dark' | 'auto' = 'dark';

  private _getRenderedHTML(): string {
    if (!this.markdown.trim()) {
      return '';
    }
    return parseMarkdown(this.markdown, this.markdownOptions);
  }

  /**
   * Get the rendered HTML (for export)
   */
  getHTML(): string {
    return this._getRenderedHTML();
  }

  /**
   * Get the preview container element (for PDF export)
   */
  getPreviewElement(): HTMLElement | null {
    return this.shadowRoot?.querySelector('.prose') ?? null;
  }

  override render() {
    const renderedHTML = this._getRenderedHTML();

    if (!renderedHTML) {
      return html`
        <div class="preview-container">
          <div class="empty-state">Preview will appear here...</div>
        </div>
      `;
    }

    return html`
      <div class="preview-container">
        <div class="prose">${unsafeHTML(renderedHTML)}</div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mde-preview': MdePreview;
  }
}

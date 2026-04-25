import { LitElement, html, css } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { sharedStyles } from '../styles/shared.styles';
import { wrapText } from '../utils/markdown';

/**
 * Markdown Editor Textarea Component
 */
@customElement('mde-textarea')
export class MdeTextarea extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        height: 100%;
      }

      .editor-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--mde-bg-primary);
      }

      textarea {
        flex: 1;
        width: 100%;
        padding: var(--mde-spacing-md);
        border: none;
        background: var(--mde-bg-primary);
        color: var(--mde-text-primary);
        font-family: var(--mde-font-mono);
        font-size: var(--mde-font-size-md);
        line-height: 1.6;
        resize: none;
        outline: none;
      }

      textarea::placeholder {
        color: var(--mde-text-muted);
      }

      .status-bar {
        display: flex;
        justify-content: space-between;
        padding: var(--mde-spacing-xs) var(--mde-spacing-sm);
        background: var(--mde-bg-secondary);
        border-top: 1px solid var(--mde-border);
        font-size: var(--mde-font-size-sm);
        color: var(--mde-text-muted);
      }
    `,
  ];

  @property({ type: String })
  value = '';

  @property({ type: String })
  placeholder = 'Start writing markdown...';

  @property({ type: String, reflect: true })
  theme: 'light' | 'dark' | 'auto' = 'dark';

  @state()
  private _lineCount = 1;

  @state()
  private _wordCount = 0;

  @state()
  private _cursorPosition = { line: 1, column: 1 };

  @query('textarea')
  private _textarea!: HTMLTextAreaElement;

  override firstUpdated(): void {
    this._updateStats();
  }

  private _handleInput(e: Event): void {
    const target = e.target as HTMLTextAreaElement;
    this.value = target.value;
    this._updateStats();
    this._updateCursorPosition();

    this.dispatchEvent(
      new CustomEvent('content-change', {
        detail: { content: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleKeydown(e: KeyboardEvent): void {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          this.wrapSelection('**', '**');
          break;
        case 'i':
          e.preventDefault();
          this.wrapSelection('_', '_');
          break;
        case 'k':
          e.preventDefault();
          this.wrapSelection('[', '](url)');
          break;
      }
    }

    // Handle Tab for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      this.insertAtCursor('  ');
    }
  }

  private _handleClick(): void {
    this._updateCursorPosition();
  }

  private _handleKeyup(): void {
    this._updateCursorPosition();
  }

  private _updateStats(): void {
    const text = this.value;
    this._lineCount = text.split('\n').length;
    this._wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  }

  private _updateCursorPosition(): void {
    if (!this._textarea) return;

    const text = this.value.slice(0, this._textarea.selectionStart);
    const lines = text.split('\n');
    this._cursorPosition = {
      line: lines.length,
      column: lines[lines.length - 1].length + 1,
    };
  }

  /**
   * Insert text at cursor position
   */
  insertAtCursor(text: string): void {
    const start = this._textarea.selectionStart;
    const end = this._textarea.selectionEnd;

    this.value = this.value.slice(0, start) + text + this.value.slice(end);

    // Update textarea and set cursor position
    this.updateComplete.then(() => {
      this._textarea.value = this.value;
      this._textarea.selectionStart = this._textarea.selectionEnd = start + text.length;
      this._textarea.focus();
      this._updateStats();
      this._dispatchChange();
    });
  }

  /**
   * Wrap selected text with prefix and suffix
   */
  wrapSelection(prefix: string, suffix?: string): void {
    const start = this._textarea.selectionStart;
    const end = this._textarea.selectionEnd;

    const result = wrapText(this.value, start, end, prefix, suffix);
    this.value = result.text;

    this.updateComplete.then(() => {
      this._textarea.value = this.value;
      this._textarea.selectionStart = result.newSelectionStart;
      this._textarea.selectionEnd = result.newSelectionEnd;
      this._textarea.focus();
      this._updateStats();
      this._dispatchChange();
    });
  }

  /**
   * Get current value
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Set value
   */
  setValue(content: string): void {
    this.value = content;
    this._updateStats();
    this._dispatchChange();
  }

  /**
   * Focus the textarea
   */
  override focus(): void {
    this._textarea?.focus();
  }

  private _dispatchChange(): void {
    this.dispatchEvent(
      new CustomEvent('content-change', {
        detail: { content: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  override render() {
    return html`
      <div class="editor-container">
        <textarea
          .value=${this.value}
          placeholder=${this.placeholder}
          @input=${this._handleInput}
          @keydown=${this._handleKeydown}
          @keyup=${this._handleKeyup}
          @click=${this._handleClick}
          spellcheck="true"
        ></textarea>
        <div class="status-bar">
          <span>Ln ${this._cursorPosition.line}, Col ${this._cursorPosition.column}</span>
          <span>${this._wordCount} words, ${this._lineCount} lines</span>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mde-textarea': MdeTextarea;
  }
}

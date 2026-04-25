import { LitElement, html, css, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

interface JwtHeader {
  alg?: string
  typ?: string
  kid?: string
  [key: string]: unknown
}

interface JwtPayload {
  iss?: string
  sub?: string
  aud?: string | string[]
  exp?: number
  nbf?: number
  iat?: number
  jti?: string
  [key: string]: unknown
}

interface DecodedJwt {
  header: JwtHeader
  payload: JwtPayload
  signature: string
  raw: {
    header: string
    payload: string
    signature: string
  }
}

interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

@customElement('jwt-editor')
export class JwtEditor extends LitElement {
  static override styles = css`
    :host {
      display: block;
      font-family: var(--jwt-theme-font-sans, 'Inter', system-ui, -apple-system, sans-serif);
      background: var(--jwt-theme-bg-primary, #0a0e1a);
      color: var(--jwt-theme-text-primary, #f1f5f9);
      min-height: 100%;
    }

    :host([theme='light']) {
      --jwt-theme-bg-primary: #ffffff;
      --jwt-theme-bg-secondary: #f8fafc;
      --jwt-theme-bg-tertiary: #f1f5f9;
      --jwt-theme-border: #e2e8f0;
      --jwt-theme-text-primary: #1e293b;
      --jwt-theme-text-secondary: #64748b;
      --jwt-theme-text-muted: #94a3b8;
      --jwt-theme-accent: #3b82f6;
      --jwt-theme-accent-hover: #2563eb;
      --jwt-theme-error: #ef4444;
      --jwt-theme-warning: #f59e0b;
      --jwt-theme-success: #10b981;
    }

    * {
      box-sizing: border-box;
    }

    .container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      padding: 16px;
      min-height: calc(100vh - 120px);
    }

    @media (max-width: 900px) {
      .container {
        grid-template-columns: 1fr;
      }
    }

    .panel {
      background: var(--jwt-theme-bg-secondary, #1e293b);
      border: 1px solid var(--jwt-theme-border, #334155);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: var(--jwt-theme-bg-tertiary, #334155);
      border-bottom: 1px solid var(--jwt-theme-border, #334155);
    }

    .panel-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--jwt-theme-text-primary, #f1f5f9);
    }

    .panel-actions {
      display: flex;
      gap: 8px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 500;
      font-family: inherit;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s;
      background: var(--jwt-theme-bg-primary, #0a0e1a);
      color: var(--jwt-theme-text-secondary, #94a3b8);
    }

    .btn:hover {
      background: var(--jwt-theme-accent, #06b6d4);
      color: white;
    }

    .btn-icon {
      padding: 6px 8px;
    }

    .input-area {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    textarea {
      flex: 1;
      width: 100%;
      padding: 16px;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 13px;
      line-height: 1.6;
      background: transparent;
      color: var(--jwt-theme-text-primary, #f1f5f9);
      border: none;
      resize: none;
      outline: none;
    }

    textarea::placeholder {
      color: var(--jwt-theme-text-muted, #64748b);
    }

    .output-area {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }

    .section {
      margin-bottom: 20px;
    }

    .section:last-child {
      margin-bottom: 0;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .section-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--jwt-theme-text-muted, #64748b);
    }

    .section-badge {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 500;
    }

    .badge-header {
      background: rgba(139, 92, 246, 0.2);
      color: #a78bfa;
    }

    .badge-payload {
      background: rgba(6, 182, 212, 0.2);
      color: #22d3ee;
    }

    .badge-signature {
      background: rgba(236, 72, 153, 0.2);
      color: #f472b6;
    }

    :host([theme='light']) .badge-header {
      background: rgba(139, 92, 246, 0.15);
      color: #7c3aed;
    }

    :host([theme='light']) .badge-payload {
      background: rgba(6, 182, 212, 0.15);
      color: #0891b2;
    }

    :host([theme='light']) .badge-signature {
      background: rgba(236, 72, 153, 0.15);
      color: #db2777;
    }

    .json-view {
      background: var(--jwt-theme-bg-primary, #0a0e1a);
      border: 1px solid var(--jwt-theme-border, #334155);
      border-radius: 6px;
      padding: 12px;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 12px;
      line-height: 1.6;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }

    .json-key {
      color: #a78bfa;
    }

    .json-string {
      color: #22d3ee;
    }

    .json-number {
      color: #fbbf24;
    }

    .json-boolean {
      color: #f472b6;
    }

    .json-null {
      color: #64748b;
    }

    :host([theme='light']) .json-key {
      color: #7c3aed;
    }

    :host([theme='light']) .json-string {
      color: #0891b2;
    }

    :host([theme='light']) .json-number {
      color: #d97706;
    }

    :host([theme='light']) .json-boolean {
      color: #db2777;
    }

    .signature-view {
      background: var(--jwt-theme-bg-primary, #0a0e1a);
      border: 1px solid var(--jwt-theme-border, #334155);
      border-radius: 6px;
      padding: 12px;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 12px;
      line-height: 1.6;
      word-break: break-all;
      color: var(--jwt-theme-text-secondary, #94a3b8);
    }

    .validation-box {
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 16px;
    }

    .validation-valid {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .validation-invalid {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .validation-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .validation-valid .validation-title {
      color: #10b981;
    }

    .validation-invalid .validation-title {
      color: #ef4444;
    }

    .validation-list {
      margin: 0;
      padding-left: 20px;
      font-size: 12px;
    }

    .validation-error {
      color: #ef4444;
      margin-bottom: 4px;
    }

    .validation-warning {
      color: #f59e0b;
      margin-bottom: 4px;
    }

    .claims-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 8px;
      margin-top: 12px;
    }

    .claim-item {
      background: var(--jwt-theme-bg-primary, #0a0e1a);
      border: 1px solid var(--jwt-theme-border, #334155);
      border-radius: 6px;
      padding: 10px 12px;
    }

    .claim-label {
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--jwt-theme-text-muted, #64748b);
      margin-bottom: 4px;
    }

    .claim-value {
      font-size: 13px;
      color: var(--jwt-theme-text-primary, #f1f5f9);
      word-break: break-all;
    }

    .claim-value.expired {
      color: #ef4444;
    }

    .claim-value.valid {
      color: #10b981;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--jwt-theme-text-muted, #64748b);
      text-align: center;
      padding: 40px;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-text {
      font-size: 14px;
      line-height: 1.6;
    }

    .copy-feedback {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--jwt-theme-accent, #06b6d4);
      color: white;
      padding: 10px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.2s;
      pointer-events: none;
    }

    .copy-feedback.show {
      opacity: 1;
      transform: translateY(0);
    }
  `

  @property({ type: String, reflect: true })
  theme: 'dark' | 'light' = 'dark'

  @property({ type: Boolean })
  autosave = false

  @property({ type: String })
  value = ''

  @state()
  private decoded: DecodedJwt | null = null

  @state()
  private validation: ValidationResult = { valid: false, errors: [], warnings: [] }

  @state()
  private parseError: string | null = null

  @state()
  private showCopyFeedback = false

  private storageKey = 'jwt-editor-token'

  override connectedCallback() {
    super.connectedCallback()
    if (this.autosave) {
      const saved = localStorage.getItem(this.storageKey)
      if (saved) {
        this.value = saved
        this.parseJwt(saved)
      }
    }
  }

  override updated(changedProperties: PropertyValues) {
    if (changedProperties.has('value') && this.value) {
      this.parseJwt(this.value)
    }
  }

  private handleInput(e: Event) {
    const textarea = e.target as HTMLTextAreaElement
    this.value = textarea.value.trim()
    if (this.autosave) {
      localStorage.setItem(this.storageKey, this.value)
    }
    this.parseJwt(this.value)
  }

  private parseJwt(token: string) {
    if (!token) {
      this.decoded = null
      this.parseError = null
      this.validation = { valid: false, errors: [], warnings: [] }
      return
    }

    const parts = token.split('.')
    if (parts.length !== 3) {
      this.decoded = null
      this.parseError = 'Invalid JWT format: expected 3 parts separated by dots'
      this.validation = { valid: false, errors: [this.parseError], warnings: [] }
      return
    }

    try {
      const header = JSON.parse(this.base64UrlDecode(parts[0]))
      const payload = JSON.parse(this.base64UrlDecode(parts[1]))

      this.decoded = {
        header,
        payload,
        signature: parts[2],
        raw: {
          header: parts[0],
          payload: parts[1],
          signature: parts[2],
        },
      }
      this.parseError = null
      this.validation = this.validateJwt(header, payload)
    } catch (err) {
      this.decoded = null
      this.parseError = `Failed to decode JWT: ${err instanceof Error ? err.message : 'Unknown error'}`
      this.validation = { valid: false, errors: [this.parseError], warnings: [] }
    }
  }

  private base64UrlDecode(str: string): string {
    // Replace URL-safe characters
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
    // Pad with '=' to make it valid base64
    const pad = base64.length % 4
    if (pad) {
      base64 += '='.repeat(4 - pad)
    }
    return decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
  }

  private validateJwt(header: JwtHeader, payload: JwtPayload): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Check algorithm
    if (!header.alg) {
      errors.push('Missing algorithm (alg) in header')
    } else if (header.alg === 'none') {
      warnings.push('Algorithm is "none" - token is not signed')
    }

    // Check expiration
    if (payload.exp) {
      const expDate = new Date(payload.exp * 1000)
      if (expDate < new Date()) {
        errors.push(`Token expired on ${expDate.toLocaleString()}`)
      }
    } else {
      warnings.push('No expiration (exp) claim')
    }

    // Check not-before
    if (payload.nbf) {
      const nbfDate = new Date(payload.nbf * 1000)
      if (nbfDate > new Date()) {
        errors.push(`Token not valid until ${nbfDate.toLocaleString()}`)
      }
    }

    // Check issued-at
    if (payload.iat) {
      const iatDate = new Date(payload.iat * 1000)
      if (iatDate > new Date()) {
        warnings.push('Issued-at (iat) is in the future')
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    }
  }

  private formatJson(obj: unknown): string {
    return JSON.stringify(obj, null, 2)
  }

  private syntaxHighlight(json: string): string {
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = 'json-number'
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'json-key'
            match = match.slice(0, -1) // Remove the colon, we'll add it back
            return `<span class="${cls}">${match}</span>:`
          } else {
            cls = 'json-string'
          }
        } else if (/true|false/.test(match)) {
          cls = 'json-boolean'
        } else if (/null/.test(match)) {
          cls = 'json-null'
        }
        return `<span class="${cls}">${match}</span>`
      }
    )
  }

  private formatTimestamp(ts: number): string {
    const date = new Date(ts * 1000)
    return date.toLocaleString()
  }

  private isExpired(exp: number): boolean {
    return new Date(exp * 1000) < new Date()
  }

  private async copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      this.showCopyFeedback = true
      setTimeout(() => {
        this.showCopyFeedback = false
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  private clearInput() {
    this.value = ''
    this.decoded = null
    this.parseError = null
    this.validation = { valid: false, errors: [], warnings: [] }
    if (this.autosave) {
      localStorage.removeItem(this.storageKey)
    }
  }

  private async pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText()
      this.value = text.trim()
      if (this.autosave) {
        localStorage.setItem(this.storageKey, this.value)
      }
      this.parseJwt(this.value)
    } catch (err) {
      console.error('Failed to paste:', err)
    }
  }

  override render() {
    return html`
      <div class="container">
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">JWT Token</span>
            <div class="panel-actions">
              <button class="btn btn-icon" @click=${this.pasteFromClipboard} title="Paste">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                </svg>
              </button>
              <button class="btn btn-icon" @click=${this.clearInput} title="Clear">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="input-area">
            <textarea
              .value=${this.value}
              @input=${this.handleInput}
              placeholder="Paste your JWT token here...

Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
            ></textarea>
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">Decoded</span>
            ${this.decoded ? html`
              <div class="panel-actions">
                <button class="btn" @click=${() => this.copyToClipboard(this.formatJson({ header: this.decoded!.header, payload: this.decoded!.payload }))}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  Copy JSON
                </button>
              </div>
            ` : ''}
          </div>
          <div class="output-area">
            ${this.renderOutput()}
          </div>
        </div>
      </div>

      <div class="copy-feedback ${this.showCopyFeedback ? 'show' : ''}">
        Copied to clipboard
      </div>
    `
  }

  private renderOutput() {
    if (!this.value) {
      return html`
        <div class="empty-state">
          <div class="empty-icon">🔐</div>
          <div class="empty-text">
            Paste a JWT token to decode and inspect it.<br>
            The token never leaves your browser.
          </div>
        </div>
      `
    }

    if (this.parseError) {
      return html`
        <div class="validation-box validation-invalid">
          <div class="validation-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            Invalid Token
          </div>
          <div>${this.parseError}</div>
        </div>
      `
    }

    if (!this.decoded) return ''

    return html`
      ${this.renderValidation()}
      ${this.renderClaims()}
      ${this.renderSection('Header', 'header', this.decoded.header)}
      ${this.renderSection('Payload', 'payload', this.decoded.payload)}
      ${this.renderSignature()}
    `
  }

  private renderValidation() {
    const { valid, errors, warnings } = this.validation

    return html`
      <div class="validation-box ${valid ? 'validation-valid' : 'validation-invalid'}">
        <div class="validation-title">
          ${valid ? html`
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Token Structure Valid
          ` : html`
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            Token Has Issues
          `}
        </div>
        ${errors.length > 0 ? html`
          <ul class="validation-list">
            ${errors.map(e => html`<li class="validation-error">${e}</li>`)}
          </ul>
        ` : ''}
        ${warnings.length > 0 ? html`
          <ul class="validation-list">
            ${warnings.map(w => html`<li class="validation-warning">${w}</li>`)}
          </ul>
        ` : ''}
      </div>
    `
  }

  private renderClaims() {
    if (!this.decoded) return ''
    const { header, payload } = this.decoded

    const claims: Array<{ label: string; value: string; className?: string }> = []

    if (header.alg) {
      claims.push({ label: 'Algorithm', value: header.alg })
    }
    if (header.typ) {
      claims.push({ label: 'Type', value: header.typ })
    }
    if (payload.iss) {
      claims.push({ label: 'Issuer', value: payload.iss })
    }
    if (payload.sub) {
      claims.push({ label: 'Subject', value: payload.sub })
    }
    if (payload.aud) {
      claims.push({ label: 'Audience', value: Array.isArray(payload.aud) ? payload.aud.join(', ') : payload.aud })
    }
    if (payload.iat) {
      claims.push({ label: 'Issued At', value: this.formatTimestamp(payload.iat) })
    }
    if (payload.exp) {
      const expired = this.isExpired(payload.exp)
      claims.push({
        label: 'Expires',
        value: this.formatTimestamp(payload.exp) + (expired ? ' (EXPIRED)' : ''),
        className: expired ? 'expired' : 'valid',
      })
    }
    if (payload.nbf) {
      claims.push({ label: 'Not Before', value: this.formatTimestamp(payload.nbf) })
    }
    if (payload.jti) {
      claims.push({ label: 'JWT ID', value: payload.jti })
    }

    if (claims.length === 0) return ''

    return html`
      <div class="section">
        <div class="section-header">
          <span class="section-title">Claims</span>
        </div>
        <div class="claims-grid">
          ${claims.map(c => html`
            <div class="claim-item">
              <div class="claim-label">${c.label}</div>
              <div class="claim-value ${c.className || ''}">${c.value}</div>
            </div>
          `)}
        </div>
      </div>
    `
  }

  private renderSection(title: string, type: 'header' | 'payload', data: unknown) {
    const json = this.formatJson(data)
    const highlighted = this.syntaxHighlight(json)

    return html`
      <div class="section">
        <div class="section-header">
          <span class="section-title">${title}</span>
          <span class="section-badge badge-${type}">${type}</span>
        </div>
        <div class="json-view" .innerHTML=${highlighted}></div>
      </div>
    `
  }

  private renderSignature() {
    if (!this.decoded) return ''

    return html`
      <div class="section">
        <div class="section-header">
          <span class="section-title">Signature</span>
          <span class="section-badge badge-signature">signature</span>
        </div>
        <div class="signature-view">${this.decoded.signature}</div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'jwt-editor': JwtEditor
  }
}

import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import {
  createInitialState,
  createPin,
  deletePin,
  findNearbyPin,
  addPinToShape,
  removePinFromShape,
  getShapePins,
  getShapesForPin,
  generateFullSVG,
  generatePolygonPoints,
  zoomIn,
  zoomOut,
  resetZoom,
  clearAllPins,
  setNumShapes,
  type CoordinatePickerState,
  type Pin,
  DEFAULT_CONFIG,
} from '../utils/state';

@customElement('coordinate-picker')
export class CoordinatePicker extends LitElement {
  static override styles = css`
    :host {
      display: block;
      font-family: var(--cp-theme-font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
      background: var(--cp-theme-bg-primary, #1a1a2e);
      color: var(--cp-theme-text-primary, #eee);
      min-height: 100%;
    }

    :host([theme='light']) {
      --cp-theme-bg-primary: #ffffff;
      --cp-theme-bg-secondary: #f8fafc;
      --cp-theme-bg-tertiary: #f1f5f9;
      --cp-theme-border: #e2e8f0;
      --cp-theme-text-primary: #1e293b;
      --cp-theme-text-secondary: #64748b;
      --cp-theme-text-muted: #94a3b8;
      --cp-theme-accent: #4a4a8a;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    .header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--cp-theme-border, #334155);
    }

    h1 {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
    }

    .file-input-area {
      background: var(--cp-theme-bg-secondary, #2a2a4a);
      border: 2px dashed var(--cp-theme-border, #4a4a8a);
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin: 16px 20px;
      cursor: pointer;
      transition: border-color 0.2s;
    }

    .file-input-area:hover {
      border-color: var(--cp-theme-accent, #6a6aba);
    }

    .file-input-area input {
      display: none;
    }

    .container {
      display: flex;
      gap: 20px;
      padding: 0 20px 20px;
      flex-wrap: wrap;
    }

    .canvas-section {
      flex: 1;
      min-width: 400px;
    }

    .image-scroll-container {
      overflow: auto;
      max-width: 800px;
      max-height: 600px;
      border: 2px solid var(--cp-theme-border, #444);
      background: #000;
      border-radius: 8px;
    }

    .image-container {
      position: relative;
      cursor: crosshair;
      background: #000;
      display: inline-block;
    }

    .image-container.empty {
      cursor: default;
      min-width: 500px;
      min-height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .empty-text {
      color: var(--cp-theme-text-muted, #666);
      font-size: 16px;
    }

    .image-container img {
      display: block;
    }

    .marker {
      position: absolute;
      width: 24px;
      height: 24px;
      transform: translate(-50%, -100%);
      pointer-events: auto;
      z-index: 10;
      cursor: pointer;
      transition: transform 0.1s;
    }

    .marker:hover {
      transform: translate(-50%, -100%) scale(1.2);
    }

    .marker svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
    }

    .marker-label {
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.9);
      color: #fff;
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 3px;
      white-space: nowrap;
      font-weight: bold;
    }

    .marker-shapes {
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 2px;
    }

    .marker-shape-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      border: 1px solid #fff;
    }

    .zoom-controls {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-top: 12px;
      padding: 12px;
      background: var(--cp-theme-bg-secondary, #2a2a4a);
      border-radius: 8px;
    }

    .zoom-controls label {
      font-size: 13px;
      color: var(--cp-theme-text-secondary, #aaa);
    }

    .zoom-level {
      min-width: 50px;
      text-align: center;
      font-family: monospace;
      font-size: 14px;
    }

    .coords-display {
      background: var(--cp-theme-bg-secondary, #2a2a4a);
      padding: 12px;
      border-radius: 8px;
      margin-top: 12px;
      font-family: monospace;
      font-size: 14px;
    }

    .size-info {
      font-size: 12px;
      color: var(--cp-theme-text-muted, #888);
      margin-top: 6px;
    }

    .sidebar {
      flex: 1;
      min-width: 350px;
      max-width: 450px;
    }

    .instructions {
      background: rgba(46, 125, 50, 0.15);
      border: 1px solid rgba(46, 125, 50, 0.3);
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 13px;
      line-height: 1.6;
    }

    .setup-section {
      background: var(--cp-theme-bg-secondary, #2a2a4a);
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .setup-section h3 {
      font-size: 14px;
      margin-bottom: 12px;
    }

    .setup-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }

    .setup-row:last-child {
      margin-bottom: 0;
    }

    .setup-row label {
      font-size: 13px;
      color: var(--cp-theme-text-secondary, #aaa);
    }

    input[type="number"] {
      width: 60px;
      padding: 6px 8px;
      border: 1px solid var(--cp-theme-border, #4a4a8a);
      border-radius: 4px;
      background: var(--cp-theme-bg-primary, #1a1a2e);
      color: var(--cp-theme-text-primary, #fff);
      font-size: 14px;
    }

    .active-shape {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 14px;
      color: #fff;
    }

    .buttons {
      margin-bottom: 16px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    button {
      background: var(--cp-theme-accent, #4a4a8a);
      border: none;
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-family: inherit;
      transition: background 0.15s;
    }

    button:hover {
      filter: brightness(1.1);
    }

    button.danger {
      background: #c0392b;
    }

    button.danger:hover {
      background: #e74c3c;
    }

    button.small {
      padding: 6px 12px;
      font-size: 13px;
    }

    .shapes-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 16px;
    }

    .shape-card {
      background: var(--cp-theme-bg-secondary, #2a2a4a);
      border: 2px solid var(--cp-theme-border, #3a3a5a);
      border-radius: 8px;
      padding: 12px;
      cursor: pointer;
      transition: border-color 0.2s;
    }

    .shape-card.active {
      border-color: #4a9a4a;
    }

    .shape-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .shape-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: bold;
      font-size: 14px;
    }

    .shape-color-dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
    }

    .shape-card-points {
      font-family: monospace;
      font-size: 12px;
      color: var(--cp-theme-text-muted, #aaa);
      min-height: 20px;
    }

    .shape-card-output {
      background: var(--cp-theme-bg-primary, #1a1a3a);
      padding: 8px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 11px;
      margin-top: 8px;
      cursor: pointer;
      word-break: break-all;
      transition: background 0.15s;
    }

    .shape-card-output:hover {
      background: var(--cp-theme-bg-tertiary, #2a2a4a);
    }

    .preview-section,
    .output-section {
      background: var(--cp-theme-bg-secondary, #2a2a4a);
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .preview-section h3,
    .output-section h3 {
      font-size: 14px;
      margin-bottom: 12px;
    }

    .svg-preview {
      background: #000;
      border-radius: 4px;
      padding: 10px;
      display: flex;
      justify-content: center;
    }

    .svg-preview svg {
      max-width: 200px;
      max-height: 200px;
    }

    .full-svg-output {
      background: var(--cp-theme-bg-primary, #1a1a3a);
      padding: 12px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
      white-space: pre-wrap;
      word-break: break-all;
      max-height: 200px;
      overflow-y: auto;
      cursor: pointer;
    }

    .full-svg-output:hover {
      background: var(--cp-theme-bg-tertiary, #2a2a3a);
    }

    .copy-hint {
      font-size: 11px;
      color: var(--cp-theme-text-muted, #666);
      margin-top: 6px;
    }

    .copy-feedback {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #27ae60;
      color: white;
      padding: 10px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.2s;
      pointer-events: none;
      z-index: 1000;
    }

    .copy-feedback.show {
      opacity: 1;
      transform: translateY(0);
    }

    .pin-menu {
      position: fixed;
      background: var(--cp-theme-bg-secondary, #2a2a4a);
      border: 1px solid var(--cp-theme-border, #4a4a8a);
      border-radius: 8px;
      padding: 8px 0;
      min-width: 180px;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    }

    .pin-menu-header {
      padding: 6px 12px;
      font-size: 12px;
      color: var(--cp-theme-text-muted, #888);
      border-bottom: 1px solid var(--cp-theme-border, #3a3a5a);
      margin-bottom: 4px;
    }

    .pin-menu-item {
      padding: 8px 12px;
      cursor: pointer;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .pin-menu-item:hover {
      background: var(--cp-theme-bg-tertiary, #3a3a5a);
    }

    .pin-menu-item.danger {
      color: #e74c3c;
    }

    .pin-menu-item .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .pin-menu-divider {
      height: 1px;
      background: var(--cp-theme-border, #3a3a5a);
      margin: 4px 0;
    }
  `;

  @property({ type: String, reflect: true })
  theme: 'dark' | 'light' = 'dark';

  @property({ type: Number })
  numShapes = 4;

  @state()
  private _state: CoordinatePickerState = createInitialState(4);

  @state()
  private _imageLoaded = false;

  @state()
  private _imageSrc = '';

  @state()
  private _lastCoord = '';

  @state()
  private _showCopyFeedback = false;

  @state()
  private _activeMenu: { pinId: number; x: number; y: number } | null = null;

  @query('#sourceImage')
  private _imageEl!: HTMLImageElement;

  @query('#fileInput')
  private _fileInput!: HTMLInputElement;

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._handleDocumentClick);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._handleDocumentClick);
  }

  private _handleDocumentClick = (e: Event) => {
    const target = e.target as HTMLElement;
    if (this._activeMenu && !target.closest('.pin-menu') && !target.closest('.marker')) {
      this._activeMenu = null;
    }
  };

  private _handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this._loadImage(file);
  }

  private _handleDrop(e: DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    if (file) this._loadImage(file);
  }

  private _loadImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this._imageSrc = e.target?.result as string;
      this._imageLoaded = false;
    };
    reader.readAsDataURL(file);
  }

  private _handleImageLoad() {
    this._state.imageWidth = this._imageEl.naturalWidth;
    this._state.imageHeight = this._imageEl.naturalHeight;
    this._imageLoaded = true;
    this._state.zoomLevel = 1;
    clearAllPins(this._state);
    this.requestUpdate();
  }

  private _handleCanvasClick(e: MouseEvent) {
    if (!this._imageLoaded) return;
    const target = e.target as HTMLElement;
    if (target.closest('.marker')) return;

    const rect = this._imageEl.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const x = Math.round(clickX / this._state.zoomLevel);
    const y = Math.round(clickY / this._state.zoomLevel);

    this._addPoint(x, y, clickX / this._state.zoomLevel, clickY / this._state.zoomLevel);
  }

  private _addPoint(x: number, y: number, displayX: number, displayY: number) {
    const shape = this._state.shapes[this._state.activeShapeIndex];
    const existingPin = findNearbyPin(this._state.pins, x, y);

    if (existingPin) {
      if (!shape.pinIds.includes(existingPin.id)) {
        shape.pinIds.push(existingPin.id);
      }
    } else {
      const pin = createPin(this._state, x, y, displayX, displayY);
      shape.pinIds.push(pin.id);
    }

    this._lastCoord = `(${x}, ${y}) → Shape ${this._state.activeShapeIndex + 1}`;
    this.requestUpdate();
    this._dispatchChange();
  }

  private _handleMarkerClick(pinId: number, e: MouseEvent) {
    e.stopPropagation();
    this._activeMenu = { pinId, x: e.clientX, y: e.clientY };
  }

  private _addPinToShape(pinId: number, shapeIndex: number) {
    addPinToShape(this._state, pinId, shapeIndex);
    this._activeMenu = null;
    this.requestUpdate();
    this._dispatchChange();
  }

  private _removePinFromShape(pinId: number, shapeIndex: number) {
    removePinFromShape(this._state, pinId, shapeIndex);
    this._activeMenu = null;
    this.requestUpdate();
    this._dispatchChange();
  }

  private _deletePin(pinId: number) {
    deletePin(this._state, pinId);
    this._activeMenu = null;
    this.requestUpdate();
    this._dispatchChange();
  }

  private _selectShape(index: number) {
    this._state.activeShapeIndex = index;
    this.requestUpdate();
  }

  private _updateNumShapes() {
    setNumShapes(this._state, this.numShapes);
    this.requestUpdate();
  }

  private _undoLast() {
    const shape = this._state.shapes[this._state.activeShapeIndex];
    if (shape.pinIds.length > 0) {
      const pinId = shape.pinIds.pop()!;
      const stillUsed = this._state.shapes.some(s => s.pinIds.includes(pinId));
      if (!stillUsed) {
        const idx = this._state.pins.findIndex(p => p.id === pinId);
        if (idx !== -1) this._state.pins.splice(idx, 1);
      }
      this.requestUpdate();
      this._dispatchChange();
    }
  }

  private _clearCurrentShape() {
    const shape = this._state.shapes[this._state.activeShapeIndex];
    const pinIds = [...shape.pinIds];
    shape.pinIds = [];

    pinIds.forEach(pinId => {
      const stillUsed = this._state.shapes.some(s => s.pinIds.includes(pinId));
      if (!stillUsed) {
        const idx = this._state.pins.findIndex(p => p.id === pinId);
        if (idx !== -1) this._state.pins.splice(idx, 1);
      }
    });

    this.requestUpdate();
    this._dispatchChange();
  }

  private _clearAll() {
    clearAllPins(this._state);
    this.requestUpdate();
    this._dispatchChange();
  }

  private _zoomIn() {
    zoomIn(this._state);
    this.requestUpdate();
  }

  private _zoomOut() {
    zoomOut(this._state);
    this.requestUpdate();
  }

  private _resetZoom() {
    resetZoom(this._state);
    this.requestUpdate();
  }

  private async _copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      this._showCopyFeedback = true;
      setTimeout(() => {
        this._showCopyFeedback = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  private _copyShapePolygon(index: number, e: Event) {
    e.stopPropagation();
    const pins = getShapePins(this._state, index);
    if (pins.length < 3) return;
    const polygon = `<polygon points="${generatePolygonPoints(pins)}" fill="#00FF00"/>`;
    this._copyText(polygon);
  }

  private _copyFullSvg() {
    this._copyText(generateFullSVG(this._state));
  }

  private _dispatchChange() {
    this.dispatchEvent(new CustomEvent('svg-generated', {
      detail: { svg: generateFullSVG(this._state) },
      bubbles: true,
      composed: true,
    }));
  }

  private _renderMarker(pin: Pin) {
    const shapesWithPin = getShapesForPin(this._state, pin.id);
    const color = shapesWithPin.length > 0 ? shapesWithPin[0].color : '#888';

    return html`
      <div
        class="marker"
        style="left: ${pin.displayX * this._state.zoomLevel}px; top: ${pin.displayY * this._state.zoomLevel}px;"
        @click=${(e: MouseEvent) => this._handleMarkerClick(pin.id, e)}
      >
        <svg viewBox="0 0 24 24" fill="${color}">
          <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
        </svg>
        <div class="marker-label" style="background: ${color};">(${pin.x},${pin.y})</div>
        ${shapesWithPin.length > 1 ? html`
          <div class="marker-shapes">
            ${shapesWithPin.map(s => html`<span class="marker-shape-dot" style="background: ${s.color};"></span>`)}
          </div>
        ` : ''}
      </div>
    `;
  }

  private _renderPinMenu() {
    if (!this._activeMenu) return '';

    const pin = this._state.pins.find(p => p.id === this._activeMenu!.pinId);
    if (!pin) return '';

    const shapesWithPin = this._state.shapes.filter(s => s.pinIds.includes(pin.id));
    const shapesWithoutPin = this._state.shapes.filter(s => !s.pinIds.includes(pin.id));

    return html`
      <div class="pin-menu" style="left: ${this._activeMenu.x}px; top: ${this._activeMenu.y}px;">
        <div class="pin-menu-header">Pin at (${pin.x}, ${pin.y})</div>
        ${shapesWithoutPin.map((shape, i) => {
          const actualIndex = this._state.shapes.indexOf(shape);
          return html`
            <div class="pin-menu-item" @click=${() => this._addPinToShape(pin.id, actualIndex)}>
              <span class="dot" style="background: ${shape.color};"></span>
              Add to Shape ${actualIndex + 1}
            </div>
          `;
        })}
        ${shapesWithPin.length > 0 ? html`<div class="pin-menu-divider"></div>` : ''}
        ${shapesWithPin.map(shape => {
          const actualIndex = this._state.shapes.indexOf(shape);
          return html`
            <div class="pin-menu-item" @click=${() => this._removePinFromShape(pin.id, actualIndex)}>
              <span class="dot" style="background: ${shape.color};"></span>
              Remove from Shape ${actualIndex + 1}
            </div>
          `;
        })}
        <div class="pin-menu-divider"></div>
        <div class="pin-menu-item danger" @click=${() => this._deletePin(pin.id)}>
          Delete Pin
        </div>
      </div>
    `;
  }

  private _renderShapeCard(index: number) {
    const shape = this._state.shapes[index];
    const pins = getShapePins(this._state, index);
    const isActive = index === this._state.activeShapeIndex;

    return html`
      <div class="shape-card ${isActive ? 'active' : ''}" @click=${() => this._selectShape(index)}>
        <div class="shape-card-header">
          <div class="shape-card-title">
            <span class="shape-color-dot" style="background: ${shape.color};"></span>
            Shape ${index + 1}
          </div>
          <span style="font-size: 12px; color: var(--cp-theme-text-muted, #888);">${pins.length} points</span>
        </div>
        <div class="shape-card-points">
          ${pins.length > 0
            ? pins.map(p => `(${p.x},${p.y})`).join(' → ')
            : html`<em>Click image to add vertices...</em>`}
        </div>
        <div class="shape-card-output" @click=${(e: Event) => this._copyShapePolygon(index, e)} title="Click to copy">
          ${pins.length >= 3
            ? `<polygon points="${generatePolygonPoints(pins)}" fill="#00FF00"/>`
            : `<polygon points="..." fill="${shape.color}"/> (need ${3 - pins.length} more)`}
        </div>
      </div>
    `;
  }

  private _renderPreview() {
    const polygons = this._state.shapes.map((shape, i) => {
      const pins = getShapePins(this._state, i);
      if (pins.length < 3) return '';
      return `<polygon points="${generatePolygonPoints(pins)}" fill="#00FF00"/>`;
    }).filter(p => p).join('');

    return html`
      <svg viewBox="0 0 ${this._state.imageWidth} ${this._state.imageHeight}">
        <rect width="${this._state.imageWidth}" height="${this._state.imageHeight}" fill="#000"/>
        ${polygons ? html`<g .innerHTML=${polygons}></g>` : ''}
      </svg>
    `;
  }

  override render() {
    return html`
      <div class="header">
        <h1>SVG Coordinate Picker</h1>
      </div>

      <div
        class="file-input-area"
        @click=${() => this._fileInput.click()}
        @dragover=${(e: DragEvent) => e.preventDefault()}
        @drop=${this._handleDrop}
      >
        <input type="file" id="fileInput" accept="image/*,.svg" @change=${this._handleFileSelect}>
        <p>Click or drag an image file here (JPG, PNG, SVG)</p>
      </div>

      <div class="container">
        <div class="canvas-section">
          <div class="image-scroll-container">
            <div
              class="image-container ${this._imageLoaded ? '' : 'empty'}"
              @click=${this._handleCanvasClick}
            >
              ${this._imageSrc ? html`
                <img
                  id="sourceImage"
                  src=${this._imageSrc}
                  @load=${this._handleImageLoad}
                  style="width: ${this._state.imageWidth * this._state.zoomLevel}px; height: ${this._state.imageHeight * this._state.zoomLevel}px;"
                >
                ${this._imageLoaded ? this._state.pins.map(pin => this._renderMarker(pin)) : ''}
              ` : html`<span class="empty-text">Load an image to begin</span>`}
            </div>
          </div>

          <div class="zoom-controls">
            <label>Zoom:</label>
            <button class="small" @click=${this._zoomOut}>−</button>
            <span class="zoom-level">${Math.round(this._state.zoomLevel * 100)}%</span>
            <button class="small" @click=${this._zoomIn}>+</button>
            <button class="small" @click=${this._resetZoom}>Reset</button>
          </div>

          <div class="coords-display">
            Last click: ${this._lastCoord || '-'}
            <div class="size-info">Image size: ${this._imageLoaded ? `${this._state.imageWidth} × ${this._state.imageHeight}` : '-'}</div>
          </div>
        </div>

        <div class="sidebar">
          <div class="instructions">
            <strong>How to use:</strong><br>
            1. Load an image<br>
            2. Set number of shapes below<br>
            3. Click a shape card to select it, then click image to add vertices<br>
            4. Switch shapes and continue adding vertices<br>
            5. Copy individual polygons or the full SVG
          </div>

          <div class="setup-section">
            <h3>Setup</h3>
            <div class="setup-row">
              <label>Number of shapes:</label>
              <input
                type="number"
                .value=${String(this.numShapes)}
                min="1"
                max="20"
                @change=${(e: Event) => { this.numShapes = parseInt((e.target as HTMLInputElement).value) || 4; this._updateNumShapes(); }}
              >
            </div>
            <div class="setup-row">
              <label>Currently adding to:</label>
              <span class="active-shape" style="background: ${this._state.shapes[this._state.activeShapeIndex]?.color || '#888'};">
                Shape ${this._state.activeShapeIndex + 1}
              </span>
            </div>
          </div>

          <div class="buttons">
            <button @click=${this._undoLast}>Undo Last</button>
            <button class="danger" @click=${this._clearCurrentShape}>Clear Shape</button>
            <button class="danger" @click=${this._clearAll}>Clear All</button>
          </div>

          <div class="shapes-container">
            ${this._state.shapes.map((_, i) => this._renderShapeCard(i))}
          </div>

          <div class="preview-section">
            <h3>Live Preview</h3>
            <div class="svg-preview">
              ${this._renderPreview()}
            </div>
          </div>

          <div class="output-section">
            <h3>Full SVG Code</h3>
            <div class="full-svg-output" @click=${this._copyFullSvg} title="Click to copy">
              ${generateFullSVG(this._state)}
            </div>
            <div class="copy-hint">Click to copy full SVG</div>
          </div>
        </div>
      </div>

      ${this._renderPinMenu()}

      <div class="copy-feedback ${this._showCopyFeedback ? 'show' : ''}">
        Copied to clipboard
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'coordinate-picker': CoordinatePicker;
  }
}

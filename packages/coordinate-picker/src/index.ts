/**
 * @grokify/coordinate-picker
 *
 * Web component for picking coordinates from images to create SVG polygons.
 * Built with Lit Web Components.
 *
 * @example
 * ```html
 * <script src="https://unpkg.com/@grokify/coordinate-picker/dist/coordinate-picker.min.js"></script>
 * <coordinate-picker></coordinate-picker>
 * ```
 *
 * @example
 * ```typescript
 * import '@grokify/coordinate-picker';
 *
 * const picker = document.querySelector('coordinate-picker');
 * picker.addEventListener('svg-generated', (e) => {
 *   console.log(e.detail.svg);
 * });
 * ```
 */

// Main component
export { CoordinatePicker } from './components/coordinate-picker';

// State utilities (for advanced usage)
export {
  createInitialState,
  createPin,
  deletePin,
  addPinToShape,
  removePinFromShape,
  getShapePins,
  generateFullSVG,
  generatePolygonPoints,
  type CoordinatePickerState,
  type Pin,
  type Shape,
  type CoordinatePickerConfig,
} from './utils/state';

/**
 * @grokify/jwt-editor
 *
 * A web component for decoding and inspecting JWT tokens.
 * Built with Lit Web Components.
 *
 * @example
 * ```html
 * <script src="https://unpkg.com/@grokify/jwt-editor/dist/jwt-editor.min.js"></script>
 * <jwt-editor></jwt-editor>
 * ```
 *
 * @example
 * ```typescript
 * import '@grokify/jwt-editor';
 *
 * const editor = document.querySelector('jwt-editor');
 * editor.value = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
 * ```
 */

export { JwtEditor } from './jwt-editor';

import { TinyColor } from '@ctrl/tinycolor';

/**
 * Resolves any CSS color (hex, named, rgb(), hsl(), CSS variables and modern
 * formats like oklch()/color()/color-mix()) to a hex value, so that it can be
 * used by ApexCharts, which does not understand anything else than plain colors.
 *
 * The `host` element is important: Home Assistant applies themes with
 * `applyThemesOnElement()`, so the CSS variables are not always defined on
 * `document.documentElement`. When the color is resolved from the wrong element,
 * the chart (legend, lines, annotations...) does not use the same color as the
 * header, which is rendered with the raw CSS variable by the browser itself.
 * Always pass the card element as the host to make sure both are in sync.
 */

const CSS_VAR_REGEX = /^var\(\s*(--[^\s(),]+)\s*(?:,([\s\S]*))?\)$/;
const HEX_REGEX = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

const MAX_RESOLUTION_STEPS = 10;
// Used to detect colors rejected by the browser when using the canvas 2d context.
const CANVAS_REJECTED_MARKER = '#010203';

const probeCache = new WeakMap<Node, HTMLElement>();

let canvasContext: CanvasRenderingContext2D | null | undefined;

function getDocumentRoot(): HTMLElement | undefined {
  return typeof document !== 'undefined' && document.documentElement ? document.documentElement : undefined;
}

function getComputedStyleOf(element: HTMLElement, property: string): string {
  if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') return '';
  try {
    return window.getComputedStyle(element).getPropertyValue(property).trim();
  } catch (err) {
    return '';
  }
}

function toHex(value: string): string {
  const color = new TinyColor(value);
  return color.isValid ? color.toHexString() : '';
}

/**
 * Reads a CSS variable from the host element first (Home Assistant themes are
 * applied on an element of the dashboard, not necessarily on documentElement),
 * then falls back to documentElement.
 */
function readCssVariable(name: string, host: HTMLElement | undefined): string {
  if (host) {
    const value = getComputedStyleOf(host, name);
    if (value) return value;
  }
  const root = getDocumentRoot();
  if (root && root !== host) {
    const value = getComputedStyleOf(root, name);
    if (value) return value;
  }
  return '';
}

function getProbe(host: HTMLElement | undefined): HTMLElement | undefined {
  const target = host || getDocumentRoot();
  if (!target || typeof document === 'undefined' || typeof document.createElement !== 'function') return undefined;
  // The probe lives in the render root of the host, so it inherits exactly the
  // same CSS variables as the elements painted by the browser (the header).
  const root: Node = target.shadowRoot || target;
  const cached = probeCache.get(root);
  if (cached && cached.isConnected) return cached;
  const probe = document.createElement('div');
  probe.style.display = 'none';
  probe.setAttribute('aria-hidden', 'true');
  root.appendChild(probe);
  probeCache.set(root, probe);
  return probe;
}

/**
 * Lets the browser parse the color for us and returns the computed value,
 * which handles formats TinyColor does not know about.
 */
function probeColor(value: string, host: HTMLElement | undefined): string {
  const probe = getProbe(host);
  if (!probe) return '';
  try {
    probe.style.color = '';
    probe.style.color = value;
    // The CSSOM dropped the declaration: the browser does not understand it either.
    if (!probe.style.color) return '';
    return toHex(getComputedStyleOf(probe, 'color'));
  } catch (err) {
    return '';
  }
}

function getCanvasContext(): CanvasRenderingContext2D | null | undefined {
  if (canvasContext !== undefined) return canvasContext;
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
    canvasContext = null;
    return canvasContext;
  }
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    canvasContext = canvas.getContext('2d');
  } catch (err) {
    canvasContext = null;
  }
  return canvasContext;
}

/**
 * Last resort: painting the color on a 1x1 canvas and reading the pixel back.
 * This is the only way to convert wide-gamut colors (oklch(), color(...), ...)
 * to something ApexCharts can use, and it matches what is really painted.
 */
function paintColor(value: string): string {
  const context = getCanvasContext();
  if (!context) return '';
  try {
    context.fillStyle = CANVAS_REJECTED_MARKER;
    context.fillStyle = value;
    if (context.fillStyle === CANVAS_REJECTED_MARKER) return '';
    context.clearRect(0, 0, 1, 1);
    context.fillRect(0, 0, 1, 1);
    const pixel = context.getImageData(0, 0, 1, 1).data;
    if (pixel[3] === 0) return '';
    return toHex(`rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`);
  } catch (err) {
    return '';
  }
}

export function computeColor(color: string | undefined, host?: HTMLElement): string {
  if (!color) return '';
  let value = String(color).trim();
  for (let step = 0; step < MAX_RESOLUTION_STEPS; ) {
    if (HEX_REGEX.test(value)) {
      return toHex(value) || value;
    }
    const direct = toHex(value);
    if (direct) return direct;
    const variable = value.match(CSS_VAR_REGEX);
    if (variable) {
      const resolved = readCssVariable(variable[1], host) || (variable[2] ? variable[2].trim() : '');
      if (!resolved || resolved === value) break;
      value = resolved;
      step += 1;
      continue;
    }
    const resolved = probeColor(value, host) || paintColor(value);
    if (resolved) return resolved;
    break;
  }
  // Never return black for an unknown color: ApexCharts and the browser will
  // handle the raw value themselves, and black used to hide the real problem.
  return value;
}

export function computeColors(colors: string[] | undefined, host?: HTMLElement): string[] {
  if (!colors) return [];
  return colors.map((color) => computeColor(color, host));
}

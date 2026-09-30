import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

// Set up mock DOM environment
const elements = new Map();
function createMockElement(id = '', tag = 'div') {
  const listeners = {};
  return {
    id,
    tagName: tag.toUpperCase(),
    innerHTML: '',
    textContent: '',
    value: '',
    dataset: {},
    style: {
      setProperty: () => {},
      display: ''
    },
    classList: {
      add: () => {},
      remove: () => {},
      toggle: () => {},
      contains: () => false
    },
    addEventListener: (ev, fn) => {
      listeners[ev] = listeners[ev] || [];
      listeners[ev].push(fn);
    },
    removeEventListener: () => {},
    querySelector: (sel) => createMockElement(),
    querySelectorAll: (sel) => [],
    appendChild: () => {},
    removeChild: () => {},
    setAttribute: () => {},
    getAttribute: () => null,
    focus: () => {},
    scrollIntoView: () => {}
  };
}

const mockNavigator = {
  userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/124.0.0.0 Mobile Safari/537.36',
  standalone: false,
  onLine: true,
  serviceWorker: {
    register: () => Promise.resolve({ scope: '/' })
  }
};

global.window = {
  addEventListener: () => {},
  removeEventListener: () => {},
  matchMedia: (query) => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
  navigator: mockNavigator,
  localStorage: {
    store: {},
    getItem(k) { return this.store[k] || null; },
    setItem(k, v) { this.store[k] = String(v); },
    removeItem(k) { delete this.store[k]; }
  }
};

global.document = {
  readyState: 'complete',
  body: createMockElement('body'),
  documentElement: createMockElement('html'),
  getElementById(id) {
    if (!elements.has(id)) {
      elements.set(id, createMockElement(id));
    }
    return elements.get(id);
  },
  querySelector(sel) {
    if (sel.startsWith('#')) return this.getElementById(sel.slice(1));
    return createMockElement();
  },
  querySelectorAll(sel) {
    return [createMockElement()];
  },
  createElement(tag) {
    return createMockElement('', tag);
  },
  createDocumentFragment() {
    return createMockElement('fragment', 'fragment');
  },
  addEventListener: () => {},
  removeEventListener: () => {}
};

try {
  Object.defineProperty(global, 'navigator', { value: mockNavigator, writable: true, configurable: true });
} catch(e) {}
global.localStorage = global.window.localStorage;
global.location = { origin: 'http://localhost:3000', hostname: 'localhost' };

// Extract and eval the script
const scriptMatch = html.match(/<script type="module">([\s\S]*?)<\/script>/);
if (!scriptMatch) {
  throw new Error('No module script found in index.html');
}

console.log('Evaluating index.html script...');
try {
  eval(scriptMatch[1]);
  console.log('✓ Script evaluated successfully without errors!');
} catch (e) {
  console.error('Runtime evaluation error:', e);
  process.exit(1);
}

/**
 * TypeForge Studio - Interactive Application Controller
 */
(function () {
  'use strict';

  const Generator = window.TypeGenerator;
  const Samples = window.TypeSamples;

  let activeLang = 'typescript'; // 'typescript' | 'go' | 'rust' | 'python' | 'csharp' | 'schema' | 'mock'
  let parsedJson = null;

  // DOM Elements
  const el = {
    jsonInput: document.getElementById('json-input'),
    codeOutput: document.getElementById('code-output'),
    errorBanner: document.getElementById('error-banner'),
    rootNameInput: document.getElementById('root-name-input'),

    // Stats
    statKeys: document.getElementById('stat-keys'),
    statDepth: document.getElementById('stat-depth'),
    statSize: document.getElementById('stat-size'),

    // Tree View
    treeContainer: document.getElementById('schema-tree-container'),

    // Buttons & Tabs
    langTabs: document.querySelectorAll('.lang-tab-btn'),
    sampleBtns: document.querySelectorAll('[data-sample]'),
    beautifyBtn: document.getElementById('beautify-btn'),
    minifyBtn: document.getElementById('minify-btn'),
    clearBtn: document.getElementById('clear-btn'),
    copyBtn: document.getElementById('copy-code-btn'),
    downloadBtn: document.getElementById('download-code-btn'),
    toast: document.getElementById('toast')
  };

  function showToast(message) {
    if (!el.toast) return;
    el.toast.textContent = message;
    el.toast.classList.remove('hidden');
    el.toast.classList.add('visible');
    setTimeout(() => {
      el.toast.classList.remove('visible');
      setTimeout(() => el.toast.classList.add('hidden'), 300);
    }, 2200);
  }

  function hideError() {
    if (el.errorBanner) {
      el.errorBanner.classList.add('hidden');
      el.errorBanner.textContent = '';
    }
  }

  function showError(msg) {
    if (el.errorBanner) {
      el.errorBanner.classList.remove('hidden');
      el.errorBanner.textContent = `Syntax Error: ${msg}`;
    }
  }

  /**
   * Parses JSON from input and updates all panels
   */
  function handleJsonChange() {
    const raw = el.jsonInput.value.trim();
    if (!raw) {
      parsedJson = null;
      hideError();
      el.codeOutput.textContent = '// Enter or paste JSON on the left to generate types';
      updateStats({ totalKeys: 0, maxDepth: 0, formattedSize: '0 B' });
      renderTree(null);
      return;
    }

    try {
      parsedJson = JSON.parse(raw);
      hideError();
      updateStats(Generator.analyzeStats(parsedJson));
      renderTree(parsedJson);
      generateActiveCode();
    } catch (err) {
      showError(err.message);
    }
  }

  function updateStats(stats) {
    if (el.statKeys) el.statKeys.textContent = stats.totalKeys || 0;
    if (el.statDepth) el.statDepth.textContent = stats.maxDepth || 0;
    if (el.statSize) el.statSize.textContent = stats.formattedSize || '0 B';
  }

  /**
   * Generates code based on active language tab
   */
  function generateActiveCode() {
    if (!parsedJson) return;

    const rootName = (el.rootNameInput.value.trim() || 'RootObject');
    const options = { rootName };
    let code = '';

    switch (activeLang) {
      case 'typescript':
        code = Generator.toTypeScript(parsedJson, options);
        break;
      case 'go':
        code = Generator.toGo(parsedJson, options);
        break;
      case 'rust':
        code = Generator.toRust(parsedJson, options);
        break;
      case 'python':
        code = Generator.toPython(parsedJson, options);
        break;
      case 'csharp':
        code = Generator.toCSharp(parsedJson, options);
        break;
      case 'schema':
        code = Generator.toJsonSchema(parsedJson, rootName);
        break;
      case 'mock':
        code = JSON.stringify(Generator.generateMockData(parsedJson, 3), null, 2);
        break;
      default:
        code = Generator.toTypeScript(parsedJson, options);
    }

    el.codeOutput.textContent = code;
  }

  /**
   * Collapsible Schema Tree View Builder
   */
  function renderTree(data) {
    if (!el.treeContainer) return;
    el.treeContainer.innerHTML = '';
    if (!data) {
      el.treeContainer.innerHTML = '<div class="text-xs text-slate-500 p-2">No active data structure</div>';
      return;
    }

    const rootNode = buildTreeNode('root', data, true);
    el.treeContainer.appendChild(rootNode);
  }

  function buildTreeNode(key, value, isExpanded = false) {
    const item = document.createElement('div');
    item.className = 'tree-node';

    const type = Array.isArray(value) ? 'array' : (value === null ? 'null' : typeof value);
    const isObject = type === 'object' || type === 'array';

    const row = document.createElement('div');
    row.className = 'tree-row';

    const toggle = document.createElement('span');
    toggle.className = `tree-toggle ${isObject ? 'clickable' : 'hidden-toggle'}`;
    toggle.textContent = isObject ? (isExpanded ? '▼' : '▶') : ' ';
    row.appendChild(toggle);

    const keySpan = document.createElement('span');
    keySpan.className = 'tree-key';
    keySpan.textContent = key;
    row.appendChild(keySpan);

    const typeBadge = document.createElement('span');
    typeBadge.className = `tree-badge badge-${type}`;
    typeBadge.textContent = type;
    row.appendChild(typeBadge);

    if (!isObject) {
      const valSpan = document.createElement('span');
      valSpan.className = 'tree-val';
      valSpan.textContent = JSON.stringify(value);
      row.appendChild(valSpan);
    }

    item.appendChild(row);

    if (isObject && value !== null) {
      const childrenWrapper = document.createElement('div');
      childrenWrapper.className = `tree-children ${isExpanded ? '' : 'hidden'}`;

      const keys = Array.isArray(value) ? Object.keys(value).slice(0, 5) : Object.keys(value);
      keys.forEach(k => {
        childrenWrapper.appendChild(buildTreeNode(k, value[k], false));
      });

      if (Array.isArray(value) && value.length > 5) {
        const more = document.createElement('div');
        more.className = 'text-xs text-slate-500 pl-6 py-1';
        more.textContent = `... and ${value.length - 5} more items`;
        childrenWrapper.appendChild(more);
      }

      item.appendChild(childrenWrapper);

      row.addEventListener('click', () => {
        const isHidden = childrenWrapper.classList.toggle('hidden');
        toggle.textContent = isHidden ? '▶' : '▼';
      });
    }

    return item;
  }

  /**
   * Setup Event Listeners
   */
  function initEventListeners() {
    el.jsonInput.addEventListener('input', handleJsonChange);
    el.rootNameInput.addEventListener('input', generateActiveCode);

    // Language Tabs
    el.langTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        el.langTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeLang = tab.dataset.lang;
        generateActiveCode();
      });
    });

    // Sample Buttons
    el.sampleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.sample;
        if (Samples.SAMPLES[key]) {
          el.jsonInput.value = JSON.stringify(Samples.SAMPLES[key].data, null, 2);
          el.sampleBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          handleJsonChange();
          showToast(`Loaded sample: ${Samples.SAMPLES[key].name}`);
        }
      });
    });

    // Beautify
    if (el.beautifyBtn) {
      el.beautifyBtn.addEventListener('click', () => {
        if (!parsedJson) return;
        el.jsonInput.value = JSON.stringify(parsedJson, null, 2);
        showToast('JSON Formatted ✨');
      });
    }

    // Minify
    if (el.minifyBtn) {
      el.minifyBtn.addEventListener('click', () => {
        if (!parsedJson) return;
        el.jsonInput.value = JSON.stringify(parsedJson);
        showToast('JSON Minified');
      });
    }

    // Clear
    if (el.clearBtn) {
      el.clearBtn.addEventListener('click', () => {
        el.jsonInput.value = '';
        handleJsonChange();
      });
    }

    // Copy Code
    if (el.copyBtn) {
      el.copyBtn.addEventListener('click', () => {
        const code = el.codeOutput.textContent;
        navigator.clipboard.writeText(code).then(() => {
          showToast('Types copied to clipboard! 📋');
        });
      });
    }

    // Download File
    if (el.downloadBtn) {
      el.downloadBtn.addEventListener('click', () => {
        const code = el.codeOutput.textContent;
        const root = el.rootNameInput.value.trim() || 'models';
        const exts = {
          typescript: `${root}.ts`,
          go: `${root.toLowerCase()}.go`,
          rust: `${root.toLowerCase()}.rs`,
          python: `${root.toLowerCase()}.py`,
          csharp: `${root}.cs`,
          schema: `${root.toLowerCase()}.schema.json`,
          mock: `mock_${root.toLowerCase()}.json`
        };

        const filename = exts[activeLang] || `${root}.txt`;
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        showToast(`Downloaded ${filename}!`);
      });
    }
  }

  function init() {
    // Load default sample
    el.jsonInput.value = JSON.stringify(Samples.getDefaultSample(), null, 2);
    initEventListeners();
    handleJsonChange();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// Simple calculator logic – works entirely in the browser
// Handles numbers, basic operators (+ - * /), decimal point, clear, backspace, and evaluation.

(() => {
  const display = document.getElementById('display');
  const buttons = document.querySelectorAll('.buttons button');

  const append = (char) => {
    // Prevent leading zeros like "00" – allow "0" only if display empty or after an operator
    if (display.value === '' && char === '0') {
      display.value = '0';
      return;
    }
    display.value += char;
  };

  const clear = () => (display.value = '');
  const back = () => (display.value = display.value.slice(0, -1));

  const evaluate = () => {
    try {
      // Replace any accidental leading operators such as "*/" – let eval handle standard syntax
      const expr = display.value.replace(/[^0-9+\-*/.]/g, '');
      // Use Function constructor for safe evaluation (no access to outer scope)
      // eslint-disable-next-line no-new-func
      const result = Function(`'use strict'; return (${expr})`)();
      display.value = Number.isFinite(result) ? result : 'Error';
    } catch (e) {
      display.value = 'Error';
    }
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const value = btn.dataset.value;
      if (action === 'clear') return clear();
      if (action === 'back') return back();
      if (action === 'equal') return evaluate();
      if (value !== undefined) return append(value);
    });
  });
  // Theme & accent handling
  const themeSwitch = document.getElementById('theme-switch');
  const colorPicker = document.getElementById('color-picker');

  const setAccent = (color) => {
    document.documentElement.style.setProperty('--accent', color);
    // Simple darken: reduce each RGB component by 20%
    const rgb = hexToRgb(color);
    const dark = `rgb(${Math.floor(rgb.r * 0.8)}, ${Math.floor(rgb.g * 0.8)}, ${Math.floor(rgb.b * 0.8)})`;
    document.documentElement.style.setProperty('--accent-dark', dark);
  };

  const hexToRgb = (hex) => {
    const clean = hex.replace('#', '');
    const bigint = parseInt(clean, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };

  // Init accent from picker value
  setAccent(colorPicker.value);

  colorPicker.addEventListener('input', (e) => setAccent(e.target.value));

  // Theme toggle
  const applyTheme = (dark) => {
    if (dark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  themeSwitch.addEventListener('change', (e) => applyTheme(e.target.checked));

  // Initialize based on stored preference (optional)
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    themeSwitch.checked = true;
    applyTheme(true);
  }

})();

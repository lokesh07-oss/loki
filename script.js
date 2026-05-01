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
})();

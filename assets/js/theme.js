(function () {
  'use strict';

  var STORAGE_KEY = 'arcanelabs-theme';
  var root = document.documentElement;

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      var label = btn.querySelector('[data-theme-label]');
      if (label) label.textContent = theme === 'dark' ? 'Light' : 'Dark';
    }
  }

  // Read current theme (set by the FOUC-prevention inline script)
  var current = root.getAttribute('data-theme') || 'light';
  setTheme(current);

  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-theme-toggle]') : null;
    if (!btn) return;
    var nowTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(nowTheme);
    try { localStorage.setItem(STORAGE_KEY, nowTheme); } catch (err) {}
  });
})();

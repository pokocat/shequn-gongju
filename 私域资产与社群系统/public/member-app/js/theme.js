(function () {
  var STORAGE_KEY = 'principal-miniapp-theme';
  var DEFAULT_THEME = 'warm';
  var THEMES = ['warm', 'ocean', 'forest', 'berry'];

  function isTheme(value) {
    return THEMES.indexOf(value) !== -1;
  }

  function readTheme() {
    try {
      var value = window.localStorage.getItem(STORAGE_KEY);
      return isTheme(value) ? value : DEFAULT_THEME;
    } catch (e) {
      return DEFAULT_THEME;
    }
  }

  function applyTheme(theme) {
    var next = isTheme(theme) ? theme : DEFAULT_THEME;
    document.documentElement.setAttribute('data-theme', next);
    if (document.body) document.body.setAttribute('data-theme', next);
    document.querySelectorAll('.mp-page').forEach(function (page) {
      page.setAttribute('data-theme', next);
    });
    document.querySelectorAll('[data-theme-choice]').forEach(function (choice) {
      var selected = choice.getAttribute('data-theme-choice') === next;
      choice.classList.toggle('is-selected', selected);
      choice.setAttribute('aria-checked', selected ? 'true' : 'false');
    });
    try {
      window.dispatchEvent(new CustomEvent('principal-theme-change', { detail: { theme: next } }));
    } catch (e) {}
    return next;
  }

  function setTheme(theme) {
    var next = applyTheme(theme);
    try { window.localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    return next;
  }

  window.PrincipalTheme = { get: readTheme, set: setTheme, apply: applyTheme, themes: THEMES.slice() };
  applyTheme(readTheme());
  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(readTheme());
    document.addEventListener('click', function (event) {
      var choice = event.target.closest ? event.target.closest('[data-theme-choice]') : null;
      if (choice) setTheme(choice.getAttribute('data-theme-choice'));
    });
  });
})();

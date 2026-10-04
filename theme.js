/* Light/dark theme. Loaded in <head> so the saved choice applies before the page paints (no flash).
   Without a saved choice the site follows the device setting. */
(function () {
  var KEY = 'shuhari-theme', root = document.documentElement;
  try { var saved = localStorage.getItem(KEY); if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved); } catch (e) {}

  function current() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

  function paint(btn) {
    var next = current() === 'dark' ? 'light' : 'dark';
    btn.innerHTML = next === 'light' ? SUN : MOON;
    btn.setAttribute('aria-label', 'Switch to ' + next + ' mode');
    btn.title = 'Switch to ' + next + ' mode';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var list = document.querySelector('.wrap > nav ul');
    if (!list) return;
    var li = document.createElement('li'), btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'theme-toggle';
    li.appendChild(btn); list.appendChild(li); paint(btn);
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
      paint(btn);
    });
  });
})();

(function () {
  var S = window.SHUHARI, MODULES = S.MODULES, pad = S.pad;
  var app = document.getElementById('app');
  var slug = new URLSearchParams(location.search).get('m');
  var m = MODULES.filter(function (x) { return x.slug === slug; })[0];

  if (!m) {
    app.innerHTML = '<main class="notes"><header class="notes-head"><p class="mono">Notes</p><h1>Module not found.</h1>' +
      '<p class="lead">That link does not match a module on the path.</p><p><a class="link" href="paths.html">Back to the path</a></p></header></main>';
    return;
  }

  document.title = m.title + ' · Shuhari Academy';
  var desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', 'Notes for Module ' + m.num + ' of the Shuhari DevOps path: ' + m.title + '. ' + m.tags.join(', ') + '.');
  var ph = S.PHASES[m.phase];
  var LABEL = { published: 'Notes published', progress: 'In progress', coming: 'Coming' };

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function neighbour(step) {
    var x = MODULES[m.num - 1 + step];
    if (!x) return '<span></span>';
    var inner = '<span class="mono">' + (step < 0 ? 'Previous' : 'Next') + ' · Module ' + pad(x.num) + '</span><b>' + x.title + '</b>';
    return x.status === 'published' ? '<a href="notes.html?m=' + x.slug + '">' + inner + '</a>' : '<div class="soon">' + inner + '<span class="mono">' + LABEL[x.status] + '</span></div>';
  }

  var head = '<header class="notes-head"><p class="mono crumbs"><a href="paths.html">The path</a> / <a href="paths.html#phase-' + m.phase + '">Phase ' + m.phase + ' · ' + ph.name + '</a></p>' +
    '<p class="mono">Module ' + pad(m.num) + '</p><h1>' + m.title + '</h1>' +
    '<p class="mono meta"><span class="status ' + m.status + '">' + LABEL[m.status] + '</span>' + (m.updated ? '<span>Updated ' + S.niceDate(m.updated) + '</span>' : '') + '</p>' +
    '<ul class="tags">' + m.tags.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul></header>';

  var task = m.kind ? '<aside class="your-turn"><span class="mono ' + m.kind.toLowerCase() + '">' + m.kind + '</span><p>' + m.task + '</p></aside>' : '';
  var foot = task + '<nav class="pn" aria-label="Modules">' + neighbour(-1) + neighbour(1) + '</nav>';

  function render(body) { app.innerHTML = '<main class="notes">' + head + body + foot + '</main>'; }

  if (m.status !== 'published') {
    render('<div class="md"><p class="pending">' + (m.status === 'progress' ? 'The notes for this module are being written.' : 'Notes for this module are not written yet.') +
      ' Meanwhile, <a class="link" href="index.html#notify">subscribe to the newsletter</a>.</p></div>');
    return;
  }

  if (!window.marked || !window.DOMPurify || !window.hljs) {
    render('<div class="md"><p class="pending">The notes viewer did not load. Refresh the page, and if it keeps happening, check that the <code>vendor</code> folder was published with the site.</p></div>');
    return;
  }

  render('<div class="md"><p class="pending">Loading the notes…</p></div>');
  fetch('notes/' + m.slug + '.md')
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(function (md) {
      render('<article class="md">' + DOMPurify.sanitize(marked.parse(md)) + '</article>');
      var article = document.querySelector('article.md');
      S.addHeadingIds(article);
      var sections = article.querySelectorAll('h2');
      if (sections.length >= 3) {
        var toc = document.createElement('nav');
        toc.className = 'toc'; toc.setAttribute('aria-label', 'On this page');
        toc.innerHTML = '<p class="mono">On this page</p><ul>' + Array.prototype.map.call(sections, function (h) {
          return '<li><a href="#' + h.id + '">' + esc(h.textContent) + '</a></li>';
        }).join('') + '</ul>';
        article.parentNode.insertBefore(toc, article);
      }
      Array.prototype.forEach.call(document.querySelectorAll('.md pre code'), function (c) {
        hljs.highlightElement(c);
        var b = document.createElement('button'); b.type = 'button'; b.className = 'copy'; b.textContent = 'Copy';
        c.parentNode.appendChild(b);
      });
      /* the notes arrive after page load, so jump to #section links (e.g. from search) ourselves */
      if (location.hash) { var target = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (target) target.scrollIntoView({ behavior: 'instant' }); }
    })
    .catch(function () {
      var local = location.protocol === 'file:';
      render('<div class="md"><p class="pending">' + (local
        ? 'The notes cannot load from a file opened directly. Start a local server in this folder with <code>python3 -m http.server</code> and open <code>http://localhost:8000</code>.'
        : 'The notes for this module could not be loaded. Check that <code>notes/' + esc(m.slug) + '.md</code> exists.') + '</p></div>');
    });

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.copy'); if (!b) return;
    var text = b.parentNode.querySelector('code').textContent;
    var done = function (msg) { b.textContent = msg; setTimeout(function () { b.textContent = 'Copy'; }, 1400); };
    try { navigator.clipboard.writeText(text).then(function () { done('Copied'); }, function () { done('Press Ctrl+C'); }); } catch (err) { done('Press Ctrl+C'); }
  });
})();

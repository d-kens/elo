(function () {
  var S = window.SHUHARI, MODULES = S.MODULES, pad = S.pad;
  var app = document.getElementById('app');
  var params = new URLSearchParams(location.search);

  app.innerHTML = '<main class="search"><header class="page-head"><p class="mono">Search</p><h1>Find it in the notes.</h1>' +
    '<form class="search-box" role="search" action="search.html"><label for="q" class="mono">Search the notes and the path</label>' +
    '<input id="q" name="q" type="search" autocomplete="off" spellcheck="false" placeholder="Try “canary”, “systemd” or “SLO”"></form>' +
    '<p class="mono search-status" id="status" aria-live="polite">Loading the notes…</p></header><ol class="results" id="results"></ol></main>';

  var input = document.getElementById('q'), status = document.getElementById('status'), list = document.getElementById('results');
  input.value = params.get('q') || '';
  input.focus();

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  /* ---------- build the index: one entry per module, plus one per section of its published notes ---------- */
  var INDEX = MODULES.map(function (m) {
    var live = m.status === 'published';
    return { m: m, heading: null, text: m.tags.join(' · ') + (m.task ? ' · ' + m.kind + ': ' + m.task : ''),
             url: live ? 'notes.html?m=' + m.slug : 'paths.html#phase-' + m.phase };
  });
  var failed = 0;

  function indexNotes(m, md) {
    var div = document.createElement('div');
    div.innerHTML = DOMPurify.sanitize(marked.parse(md));
    S.addHeadingIds(div);
    var cur = null;
    Array.prototype.forEach.call(div.children, function (el) {
      if (el.tagName === 'H2' || el.tagName === 'H3') {
        cur = { m: m, heading: el.textContent, text: '', url: 'notes.html?m=' + m.slug + '#' + el.id };
        INDEX.push(cur);
      } else if (cur) {
        cur.text += ' ' + el.textContent;
      }
    });
  }

  var published = MODULES.filter(function (m) { return m.status === 'published'; });
  var ready = window.marked && window.DOMPurify
    ? Promise.all(published.map(function (m) {
        return fetch('notes/' + m.slug + '.md')
          .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
          .then(function (md) { indexNotes(m, md); })
          .catch(function () { failed++; });
      }))
    : Promise.resolve(failed = published.length);

  /* ---------- search ---------- */
  function words(q) { return q.toLowerCase().split(/\s+/).filter(Boolean); }

  function snippet(text, ws) {
    var clean = text.replace(/\s+/g, ' ').trim(), lower = clean.toLowerCase(), at = -1;
    ws.forEach(function (w) { var i = lower.indexOf(w); if (i >= 0 && (at < 0 || i < at)) at = i; });
    var start = Math.max(0, at - 70), end = Math.min(clean.length, (at < 0 ? 0 : at) + 150);
    var out = esc(clean.slice(start, end));
    ws.forEach(function (w) { out = out.replace(new RegExp('(' + esc(w).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>'); });
    return (start > 0 ? '…' : '') + out + (end < clean.length ? '…' : '');
  }

  function run() {
    var q = input.value.trim(), ws = words(q);
    history.replaceState(null, '', q ? 'search.html?q=' + encodeURIComponent(q) : 'search.html');
    if (!ws.length) { list.innerHTML = ''; status.textContent = 'Search ' + (INDEX.length - MODULES.length) + ' note sections and ' + MODULES.length + ' modules.'; return; }

    var hits = [];
    INDEX.forEach(function (e) {
      var title = (e.m.title + ' ' + (e.heading || '')).toLowerCase(), body = e.text.toLowerCase(), score = 0;
      for (var i = 0; i < ws.length; i++) {
        var inTitle = title.indexOf(ws[i]) >= 0, inBody = body.indexOf(ws[i]) >= 0;
        if (!inTitle && !inBody) return;
        score += (inTitle ? 5 : 0) + (inBody ? 1 + Math.min(body.split(ws[i]).length - 2, 4) : 0);
      }
      if (e.heading) score += 2;            /* prefer a section of real notes over a module summary */
      hits.push({ e: e, score: score });
    });
    hits.sort(function (a, b) { return b.score - a.score || a.e.m.num - b.e.m.num; });

    status.textContent = hits.length ? hits.length + (hits.length === 1 ? ' result' : ' results') : 'No results. Try a shorter or different word.';
    list.innerHTML = hits.slice(0, 40).map(function (h) {
      var e = h.e, m = e.m, live = m.status === 'published';
      return '<li><a href="' + e.url + '"><span class="mono">Module ' + pad(m.num) + ' · ' + esc(m.title) + (e.heading ? '' : ' · ' + (live ? 'Overview' : 'Notes coming')) + '</span>' +
        '<b>' + esc(e.heading || m.title) + '</b><p>' + snippet(e.text, ws) + '</p></a></li>';
    }).join('');
  }

  var timer;
  input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(run, 120); });
  input.form.addEventListener('submit', function (e) { e.preventDefault(); run(); });

  ready.then(function () {
    run();
    if (failed) status.textContent += location.protocol === 'file:'
      ? ' (Notes cannot load from a file opened directly; run python3 -m http.server.)'
      : ' (' + failed + ' notes file' + (failed === 1 ? '' : 's') + ' could not be loaded.)';
  });
})();

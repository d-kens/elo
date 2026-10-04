(function () {
  var S = window.SHUHARI, PHASES = S.PHASES, MODULES = S.MODULES, pad = S.pad;
  var LABEL = { published: 'Notes published', progress: 'In progress', coming: 'Coming' };

  function card(m) {
    var live = m.status === 'published', href = 'notes.html?m=' + m.slug;
    var title = live ? '<a href="' + href + '">' + m.title + '</a>' : m.title;
    return '<article class="pm' + (live ? ' live' : '') + '"><p class="mono pm-top"><span>Module ' + pad(m.num) + '</span>' +
        '<span class="status ' + m.status + '">' + LABEL[m.status] + '</span>' + (m.updated ? '<span>Updated ' + S.niceDate(m.updated) + '</span>' : '') + '</p>' +
      '<h3>' + title + '</h3><ul class="tags">' + m.tags.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' +
      (m.kind ? '<p class="task"><span class="mono ' + m.kind.toLowerCase() + '">' + m.kind + '</span>' + m.task + '</p>' : '') +
      (m.note ? '<p class="note">' + m.note + '</p>' : '') +
      (live ? '<a class="link read" href="' + href + '">Read the notes</a>' : '') + '</article>';
  }

  function paths() {
    var published = MODULES.filter(function (m) { return m.status === 'published'; }).length;
    var index = PHASES.map(function (ph, pi) {
      return '<a href="#phase-' + pi + '"><span class="mono">Phase ' + pi + '</span><b>' + ph.name + '</b></a>';
    }).join('');
    var phases = PHASES.map(function (ph, pi) {
      var count = ph.modules.length + (ph.modules.length === 1 ? ' module' : ' modules');
      return '<section class="phase" id="phase-' + pi + '"><div class="phase-head"><span class="mono">Phase ' + pi + '</span><h2>' + ph.name + '</h2><p>' + ph.blurb + '</p>' +
        (ph.security ? '<p class="sec"><span class="mono">Security thread</span>' + ph.security + '</p>' : '') + '<p class="mono count">' + count + '</p></div>' +
        '<div class="pms">' + ph.modules.map(card).join('') + '</div></section>';
    }).join('');
    return '<main><header class="page-head"><p class="mono">The path</p><h1>From mindset to production.</h1>' +
      '<p class="lead">' + MODULES.length + ' modules in ' + PHASES.length + ' phases. Detailed notes are published module by module, so you can follow along at your own pace. Most modules end with a lab or a checkpoint, and it all finishes with a capstone project.</p>' +
      '<p class="mono progress"><span class="status published">' + published + ' of ' + MODULES.length + ' published</span></p>' +
      '<nav class="phase-index" aria-label="Phases">' + index + '</nav></header>' + phases + '</main>';
  }

  document.getElementById('app').innerHTML = paths();

  /* the phases are rendered after load, so jump to #phase-N ourselves */
  if (location.hash) { var target = document.getElementById(location.hash.slice(1)); if (target) target.scrollIntoView({ behavior: 'instant' }); }
})();

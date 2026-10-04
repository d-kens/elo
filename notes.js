/* Notes pages are built ahead of time by build.js; this only adds a Copy button to each code block. */
(function () {
  Array.prototype.forEach.call(document.querySelectorAll('.md pre'), function (pre) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'copy'; b.textContent = 'Copy';
    pre.appendChild(b);
  });

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.copy'); if (!b) return;
    var text = b.parentNode.querySelector('code').textContent;
    var done = function (msg) { b.textContent = msg; setTimeout(function () { b.textContent = 'Copy'; }, 1400); };
    try { navigator.clipboard.writeText(text).then(function () { done('Copied'); }, function () { done('Press Ctrl+C'); }); } catch (err) { done('Press Ctrl+C'); }
  });
})();

/* Team Smandych — intro: a concrete wall cracks, breaks apart and reveals the fighting elephant.
 * - Plays once per browser session (sessionStorage), ~1.5 s, tap/click/any key skips it.
 * - prefers-reduced-motion: no wall, just a short fade.
 * - The real page loads underneath the whole time; nothing waits on this.
 * Loaded in <head> (not deferred) so the decision to skip is made before first paint.
 */
(function () {
  "use strict";
  var KEY = "ts_intro_seen", root = document.documentElement, seen = false;
  try { seen = sessionStorage.getItem(KEY) === "1"; } catch (e) { /* storage blocked: just play */ }
  if (seen || /[?&]nointro\b/.test(location.search)) { root.classList.add("no-intro"); return; }
  root.classList.add("intro-on");
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function rnd(a, b) { return a + Math.random() * (b - a); }

  function buildWall(wall) {
    // Radial shards around the impact point (centre), in % of the viewport.
    var cx = 50, cy = 44, N = 9, rings = [0, 9, 26, 60, 160], ang = [], i, j, pts = [];
    for (i = 0; i < N; i++) ang.push((i / N) * Math.PI * 2 + rnd(-0.22, 0.22));
    for (i = 0; i < rings.length; i++) {
      pts[i] = [];
      for (j = 0; j < N; j++) {
        var r = i === 0 ? 0 : rings[i] * rnd(0.82, 1.18);
        pts[i][j] = [cx + Math.cos(ang[j]) * r * 0.75, cy + Math.sin(ang[j]) * r]; // a bit taller than wide
      }
    }
    var frag = document.createDocumentFragment(), cracks = "";
    for (i = 0; i < rings.length - 1; i++) {
      for (j = 0; j < N; j++) {
        var k = (j + 1) % N, a = pts[i][j], b = pts[i][k], c = pts[i + 1][k], d = pts[i + 1][j];
        var poly = i === 0 ? [a, c, d] : [a, b, c, d];
        var s = document.createElement("div");
        s.className = "intro__shard";
        s.style.clipPath = "polygon(" + poly.map(function (p) { return p[0].toFixed(2) + "% " + p[1].toFixed(2) + "%"; }).join(",") + ")";
        var mx = 0, my = 0; poly.forEach(function (p) { mx += p[0]; my += p[1]; }); mx /= poly.length; my /= poly.length;
        var dx = mx - cx, dy = my - cy, len = Math.sqrt(dx * dx + dy * dy) || 1, push = rnd(18, 34) + (rings.length - i) * 4;
        s.style.setProperty("--tx", (dx / len * push).toFixed(1) + "vw");
        s.style.setProperty("--ty", (dy / len * push + rnd(25, 45)).toFixed(1) + "vh");   // gravity
        s.style.setProperty("--rot", rnd(-50, 50).toFixed(0) + "deg");
        s.style.setProperty("--delay", (i * 45 + rnd(0, 40)).toFixed(0) + "ms");
        frag.appendChild(s);
        if (i < rings.length - 2) cracks += "M" + d[0].toFixed(2) + " " + d[1].toFixed(2) + "L" + a[0].toFixed(2) + " " + a[1].toFixed(2);
        if (i > 0 && i < rings.length - 2 && Math.random() > 0.35) cracks += "M" + a[0].toFixed(2) + " " + a[1].toFixed(2) + "L" + b[0].toFixed(2) + " " + b[1].toFixed(2);
      }
    }
    wall.appendChild(frag);
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 100 100"); svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("class", "intro__cracks"); svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = '<path pathLength="1" d="' + cracks + '"/>';
    wall.appendChild(svg);
  }

  function start() {
    var el = document.getElementById("intro");
    if (!el) return;
    var wall = el.querySelector(".intro__wall"), timers = [], done = false;
    function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
    function finish() {
      if (done) return; done = true;
      timers.forEach(clearTimeout);
      try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
      el.classList.add("is-out");
      setTimeout(function () { el.parentNode && el.parentNode.removeChild(el); root.classList.remove("intro-on"); }, 380);
    }
    el.addEventListener("click", finish);
    el.addEventListener("touchstart", finish, { passive: true });
    document.addEventListener("keydown", finish, { once: true });

    if (reduced) { el.classList.add("is-reduced", "is-reveal"); at(700, finish); return; }
    buildWall(wall);
    at(120, function () { el.classList.add("is-crack"); });     // cracks draw
    at(380, function () { el.classList.add("is-impact"); });    // flash + shake
    at(520, function () { el.classList.add("is-break", "is-reveal"); }); // shards fly, elephant in
    at(1750, finish);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();

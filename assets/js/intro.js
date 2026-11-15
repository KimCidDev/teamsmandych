/* Team Smandych — intro: a small brick wall, the size of the logo, collapses and the elephant appears.
 * - Plays once per browser session (sessionStorage), ~1.6 s; tap/click/any key skips it.
 * - prefers-reduced-motion: no wall, the logo fades in and out.
 * - The real page loads underneath the whole time; nothing waits on this.
 * - Add ?nointro to the URL to skip it while testing.
 * Loaded in <head> (not deferred) so the skip decision is made before first paint.
 */
(function () {
  "use strict";
  var KEY = "ts_intro_seen", root = document.documentElement, seen = false;
  try { seen = sessionStorage.getItem(KEY) === "1"; } catch (e) { /* storage blocked: just play */ }
  if (seen || /[?&]nointro\b/.test(location.search)) { root.classList.add("no-intro"); return; }
  root.classList.add("intro-on");
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function rnd(a, b) { return a + Math.random() * (b - a); }

  // Mostly grey bricks, a few soft red and green ones (brand colours).
  function colour(r, c) {
    var x = (r * 5 + c * 7) % 13;
    if (x === 4) return "brick--r";
    if (x === 10) return "brick--gr";
    return ["brick--g1", "brick--g2", "brick--g3"][(r + c) % 3];
  }

  function buildWall(wall) {
    var W = 216, rows = 6, h = 24, gap = 2, bw = 52, frag = document.createDocumentFragment();
    for (var r = 0; r < rows; r++) {
      var offset = r % 2 ? -bw / 2 : 0, c = 0;
      for (var x = offset; x < W; x += bw + gap, c++) {
        var left = Math.max(0, x), right = Math.min(W, x + bw);
        if (right - left < 10) continue;
        var b = document.createElement("span");
        b.className = "brick " + colour(r, c);
        b.style.left = left + "px"; b.style.width = (right - left) + "px";
        b.style.top = (r * (h + gap)) + "px";
        // collapse: bottom rows give way first, upper rows follow and fall a bit further
        var fromCentre = (left + (right - left) / 2 - W / 2) / (W / 2);
        b.style.setProperty("--dx", (fromCentre * rnd(14, 40)).toFixed(0) + "px");
        b.style.setProperty("--dy", (rnd(90, 150) + (rows - r) * 8).toFixed(0) + "px");
        b.style.setProperty("--rot", (fromCentre * rnd(10, 35) + rnd(-8, 8)).toFixed(0) + "deg");
        b.style.setProperty("--d", ((rows - 1 - r) * 55 + rnd(0, 60)).toFixed(0) + "ms");
        frag.appendChild(b);
      }
    }
    wall.appendChild(frag);
  }

  function start() {
    var el = document.getElementById("intro");
    if (!el) return;
    var timers = [], done = false;
    function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
    function finish() {
      if (done) return; done = true;
      timers.forEach(clearTimeout);
      try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
      el.classList.add("is-out");
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); root.classList.remove("intro-on"); }, 420);
    }
    el.addEventListener("click", finish);
    el.addEventListener("touchstart", finish, { passive: true });
    document.addEventListener("keydown", finish, { once: true });

    if (reduced) { el.classList.add("is-reduced"); at(30, function () { el.classList.add("is-reveal"); }); at(900, finish); return; }
    buildWall(el.querySelector(".intro__wall"));
    at(250, function () { el.classList.add("is-nudge"); });            // the wall shudders
    at(470, function () { el.classList.add("is-fall"); });             // and collapses
    at(640, function () { el.classList.add("is-reveal"); });           // elephant appears behind it
    at(1650, finish);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();

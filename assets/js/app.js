/* Team Smandych — homepage behaviour. No inline handlers: everything is wired here. */
(function () {
  "use strict";
  var D = window.TS, G = D.gym, C = D.classes;
  var DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- time in Calgary, whatever the visitor's device zone ---------- */
  function calgaryParts(date) {
    var f = new Intl.DateTimeFormat("en-CA", { timeZone: G.timeZone, weekday: "short", year: "numeric",
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
    var p = {}; f.formatToParts(date).forEach(function (x) { p[x.type] = x.value; });
    var dow = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(p.weekday.replace(".", ""));
    return { dow: dow, mins: (+p.hour % 24) * 60 + (+p.minute), label: p.month.replace(".", "") + " " + p.day };
  }
  var NOW = new Date();
  var today = calgaryParts(NOW);
  function dayInfo(offset) {
    var p = calgaryParts(new Date(NOW.getTime() + offset * 864e5));
    return { offset: offset, dow: p.dow, label: p.label };
  }
  var toMin = function (t) { var a = t.split(":"); return +a[0] * 60 + +a[1]; };
  function fmt(t) {
    var m = toMin(t), h = Math.floor(m / 60), mm = m % 60, ap = h >= 12 ? "pm" : "am";
    h = h % 12 || 12; return h + ":" + (mm < 10 ? "0" : "") + mm + " " + ap;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var TBC = '<span class="tbc">[a confirmar]</span>';

  /* ---------- static links ---------- */
  $$("[data-tel]").forEach(function (a) { a.href = G.phoneHref; });
  $$("[data-ig]").forEach(function (a) { a.href = G.instagram; });
  $("#stripAddress").href = G.directions;
  $("#dirBtn").href = G.directions;

  /* ---------- schedule ---------- */
  var selected = 0;
  var tabs = $("#dayTabs"), slotsEl = $("#slots");

  function renderTabs() {
    var html = "";
    for (var i = 0; i < 7; i++) {
      var d = dayInfo(i);
      html += '<button class="tab" role="tab" type="button" data-day="' + i + '" aria-selected="' + (i === selected) + '">' +
        (i === 0 ? "Today" : i === 1 ? "Tmrw" : DAYS[d.dow].slice(0, 3)) + "<small>" + d.label + "</small></button>";
    }
    tabs.innerHTML = html;
  }

  function slotState(offset, s) {
    if (offset !== 0) return "";
    if (today.mins >= toMin(s[1])) return "past";
    if (today.mins >= toMin(s[0])) return "now";
    return "";
  }

  function renderSlots() {
    var d = dayInfo(selected), day = D.week[d.dow], html = "";
    day.slots.forEach(function (s, i) {
      var c = C[s[2]], st = slotState(selected, s);
      if (c.closed) {
        html += '<li class="slot slot--closed"><div class="slot__time">' + fmt(s[0]) + "<small>to " + fmt(s[1]) +
          '</small></div><div class="slot__name">Gym closed</div><div></div></li>';
        return;
      }
      var free = c.trial && st !== "past" && st !== "now";
      var tags = "";
      if (st === "now") tags += '<span class="tag tag--now">On now</span>';
      if (c.level) tags += '<span class="tag">' + esc(c.level) + "</span>";
      if (c.trial) tags += '<span class="tag tag--free">Free trial</span>';
      if (s[3]) tags += '<span class="tag">' + esc(s[3]) + "</span>";
      html += '<li class="slot' + (c.openGym ? " slot--open" : "") + (st ? " is-" + st : "") + '">' +
        '<div class="slot__time">' + fmt(s[0]) + "<small>to " + fmt(s[1]) + "</small></div>" +
        '<div><div class="slot__name">' + esc(c.name) + '</div><div class="slot__meta">' + tags + "</div></div>" +
        (free ? '<button class="btn btn--red" type="button" data-book data-off="' + selected + '" data-i="' + i + '">Try free</button>' : "<div></div>") +
        "</li>";
    });
    html += '<li class="slot slot--tbc"><div>' + esc(day.tbcNote || "Classes after " + fmt(day.tbcAfter)) + ": " + TBC + "</div></li>";
    slotsEl.innerHTML = html;
  }

  function renderStatus() {
    var el = $("#gymStatus"), day = D.week[today.dow].slots, msg, open = false;
    var real = day.filter(function (s) { return !C[s[2]].closed; });
    var now = real.filter(function (s) { return slotState(0, s) === "now"; });
    var closedNow = day.filter(function (s) { return C[s[2]].closed && slotState(0, s) === "now"; })[0];
    var next = real.filter(function (s) { return toMin(s[0]) > today.mins; })[0];
    if (now.length) {
      open = true;
      msg = "Open now · " + now.map(function (s) { return C[s[2]].name; }).join(" & ") + " until " + fmt(now[0][1]);
    } else if (closedNow) {
      msg = "Closed until " + fmt(closedNow[1]) + (next ? " · next: " + C[next[2]].name : "");
    } else if (next) {
      msg = "Next today: " + C[next[2]].name + " at " + fmt(next[0]);
    } else if (today.mins < toMin(D.week[today.dow].tbcAfter) + 180) {
      msg = "Evening schedule " ; el.innerHTML = '<i></i>' + esc(msg) + TBC; el.classList.add("is-closed"); return;
    } else {
      var t = dayInfo(1), first = D.week[t.dow].slots.filter(function (s) { return !C[s[2]].closed; })[0];
      msg = "Done for today · tomorrow from " + fmt(first[0]);
    }
    el.innerHTML = "<i></i>" + esc(msg);
    el.classList.toggle("is-closed", !open);
  }

  tabs.addEventListener("click", function (e) {
    var b = e.target.closest(".tab"); if (!b) return;
    selected = +b.getAttribute("data-day"); renderTabs(); renderSlots();
  });

  /* ---------- printable week ---------- */
  function renderPrint() {
    var html = "<h1>" + esc(G.name) + " — Weekly schedule</h1><p>" + esc(G.address1 + ", " + G.address2) +
      " · " + esc(G.phoneDisplay) + " · Free trial class: book online or call</p><table><thead><tr>";
    DAYS.forEach(function (d) { html += "<th>" + d + "</th>"; });
    html += "</tr></thead><tbody><tr>";
    D.week.forEach(function (day) {
      html += "<td>";
      day.slots.forEach(function (s) {
        html += "<div><b>" + esc(C[s[2]].name) + "</b>" + fmt(s[0]) + " – " + fmt(s[1]) + (s[3] ? " (" + esc(s[3]) + ")" : "") + "</div>";
      });
      html += "<div><i>" + esc(day.tbcNote || "After " + fmt(day.tbcAfter)) + ": [a confirmar]</i></div></td>";
    });
    html += "</tr></tbody></table>";
    $("#printWeek").innerHTML = html;
  }
  $("#printBtn").addEventListener("click", function () { window.print(); });

  /* ---------- classes + coaches ---------- */
  var start = ["beginners", "thai-pad", "cardio", "children", "teen", "morning"];
  $("#startCards").innerHTML = start.map(function (k) {
    var c = C[k];
    return '<article class="card"><span class="tag' + (c.trial ? " tag--free" : "") + '">' + esc(c.level || "") + "</span><h3>" +
      esc(c.name) + "</h3><p>" + (c.blurb ? esc(c.blurb) : "") + "</p>" +
      (c.trial ? '<button class="btn btn--ghost btn--sm" type="button" data-book data-class="' + k + '">Try it free</button>'
               : '<p class="muted small">Not a first class — start with Beginner\'s Muay Thai.</p>') + "</article>";
  }).join("");
  $("#allClasses").innerHTML = D.classList.map(function (k) {
    var c = C[k]; return "<li>" + esc(c.name) + (c.level ? ' <span class="tag">' + esc(c.level) + "</span>" : "") + "</li>";
  }).join("");
  $("#coachList").innerHTML = D.coaches.map(function (c) {
    return '<div class="coach"><h3>' + esc(c.name) + '</h3><p class="role">' + esc(c.role) + "</p>" +
      (c.facts ? "<ul>" + c.facts.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>"
               : '<p class="muted small">Credentials ' + TBC + "</p>") + "</div>";
  }).join("");

  /* ---------- booking sheet ---------- */
  var sheet = $("#sheet"), form = $("#bookForm"), choice = null, lastFocus = null;

  function upcomingTrials(filterKey) {
    var out = [];
    for (var o = 0; o < 7; o++) {
      var d = dayInfo(o);
      D.week[d.dow].slots.forEach(function (s, i) {
        var c = C[s[2]];
        if (!c.trial || (filterKey && s[2] !== filterKey)) return;
        if (o === 0 && toMin(s[0]) <= today.mins + 30) return; // too late to book today
        out.push({ off: o, i: i, day: d, s: s, c: c });
      });
    }
    return out;
  }
  function choiceLabel(x) {
    var when = x.off === 0 ? "Today" : x.off === 1 ? "Tomorrow" : DAYS[x.day.dow];
    return x.c.name + " · " + when + " " + x.day.label + ", " + fmt(x.s[0]);
  }
  function renderPick(filterKey) {
    var list = upcomingTrials(filterKey), html = "", cur = -1;
    if (!list.length && filterKey) return renderPick(null);
    list.forEach(function (x, n) {
      if (x.off !== cur) {
        if (cur !== -1) html += "</div>";
        cur = x.off;
        html += "<div><h4>" + (x.off === 0 ? "Today" : x.off === 1 ? "Tomorrow" : DAYS[x.day.dow]) + " · " + x.day.label + "</h4>";
      }
      html += '<button type="button" data-pick="' + n + '"><span><b>' + esc(x.c.name) + "</b></span><span>" + fmt(x.s[0]) + "</span></button>";
    });
    $("#pickList").innerHTML = html + (cur !== -1 ? "</div>" : "");
    $("#pickList")._list = list;
  }
  function go(step) {
    $$(".step", sheet).forEach(function (el) { el.hidden = +el.getAttribute("data-step") !== step; });
    $$(".progress li", sheet).forEach(function (li, i) { li.classList.toggle("on", i < step); });
    var h = $('.step[data-step="' + step + '"] h2', sheet); h.setAttribute("tabindex", "-1"); h.focus();
  }
  function openSheet(opts) {
    lastFocus = document.activeElement;
    sheet.hidden = false; document.body.classList.add("sheet-open");
    $("#formError").textContent = "";
    if (opts && opts.off != null) {
      var d = dayInfo(opts.off), s = D.week[d.dow].slots[opts.i];
      choice = { off: opts.off, i: opts.i, day: d, s: s, c: C[s[2]] };
      $("#chosen1").textContent = choiceLabel(choice); go(2);
    } else {
      renderPick(opts && opts.cls); go(1);
    }
  }
  function closeSheet() {
    sheet.hidden = true; document.body.classList.remove("sheet-open");
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-book]");
    if (b) {
      e.preventDefault();
      if (b.hasAttribute("data-off")) openSheet({ off: +b.getAttribute("data-off"), i: +b.getAttribute("data-i") });
      else openSheet({ cls: b.getAttribute("data-class") });
      return;
    }
    if (e.target.closest("[data-close]")) { closeSheet(); return; }
    var p = e.target.closest("[data-pick]");
    if (p) {
      choice = $("#pickList")._list[+p.getAttribute("data-pick")];
      $("#chosen1").textContent = choiceLabel(choice); go(2); return;
    }
    var back = e.target.closest("[data-back]");
    if (back) { var st = +back.closest(".step").getAttribute("data-step"); if (st === 2) renderPick(); go(st - 1); }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !sheet.hidden) closeSheet(); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = form.elements, err = "";
    if (!f.name.value.trim()) err = "Please add your name.";
    else if (!/^\S+@\S+\.\S+$/.test(f.email.value.trim())) err = "Please add a valid email.";
    else if (f.phone.value.replace(/\D/g, "").length < 10) err = "Please add a phone number we can call.";
    $("#formError").textContent = err;
    if (err) return;
    var body = [
      "Hi Team Smandych,", "", "I'd like to book a free trial class:", "",
      "Class: " + choiceLabel(choice), "Name: " + f.name.value.trim(), "Email: " + f.email.value.trim(),
      "Phone: " + f.phone.value.trim(), "Training: " + f.who.value, "Experience: " + f.exp.value, "",
      "Thanks!"
    ].join("\n");
    $("#sendReq").href = "mailto:" + G.emailTo + "?cc=" + encodeURIComponent(G.emailCc) +
      "&subject=" + encodeURIComponent("Free trial class request — " + f.name.value.trim()) +
      "&body=" + encodeURIComponent(body);
    $("#chosen2").textContent = choiceLabel(choice) + " · " + f.name.value.trim();
    if (G.mindbody) $("#mbNote").innerHTML = '<a href="' + G.mindbody + '" target="_blank" rel="noopener">Or confirm in Mindbody</a>';
    go(3);
  });

  /* ---------- go ---------- */
  renderTabs(); renderSlots(); renderStatus(); renderPrint();
  setInterval(function () { NOW = new Date(); today = calgaryParts(NOW); renderStatus(); if (selected === 0) renderSlots(); }, 60000);
})();

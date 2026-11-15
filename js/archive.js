/* K-7 HALCYON — shared terminal services.
   The dial does not validate answers. A correct answer IS a location.
   No answer data exists anywhere in this file. */
(function () {
  "use strict";
  var KEY = "k7_journal_v1";
  var TOTAL = 8;

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(j) { try { localStorage.setItem(KEY, JSON.stringify(j)); } catch (e) {} }

  var j = load();
  if (!j.t0) j.t0 = Date.now();
  if (!j.visited) j.visited = {};
  if (typeof j.attempts !== "number") j.attempts = 0;
  if (typeof j.sound !== "boolean") j.sound = true;
  if (typeof j.hits !== "number") j.hits = 1337;
  j.hits += 1;

  var chamber = document.body.getAttribute("data-chamber");
  if (chamber) j.visited[chamber] = Date.now();
  save(j);

  /* ---- sound ---- */
  var ctx = null;
  function audio() {
    if (!ctx) { var AC = window.AudioContext || window.webkitAudioContext; if (AC) ctx = new AC(); }
    if (ctx && ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function beep(freq, ms) {
    if (!j.sound) return;
    var c = audio(); if (!c) return;
    var o = c.createOscillator(), g = c.createGain();
    o.type = "square"; o.frequency.value = freq || 880;
    g.gain.setValueAtTime(0.06, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + (ms || 70) / 1000);
    o.connect(g); g.connect(c.destination);
    o.start(); o.stop(c.currentTime + (ms || 70) / 1000 + 0.02);
  }
  window.K7 = { beep: beep, soundOn: function () { return j.sound; }, journal: function () { return load(); } };

  function paintToggle() {
    var t = document.getElementById("sndToggle");
    if (t) t.textContent = j.sound ? "[SOUND: ON]" : "[SOUND: OFF]";
  }
  paintToggle();
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (t && t.id === "sndToggle") {
      e.preventDefault();
      j.sound = !j.sound; save(j); paintToggle();
      if (j.sound) beep(660, 60);
      var a = document.getElementById("tapeAudio");
      if (a) a.muted = !j.sound;
      document.dispatchEvent(new CustomEvent("k7sound", { detail: { on: j.sound } }));
    }
  });

  /* ---- the dial ---- */
  function norm(s) {
    return String(s || "").toLowerCase().replace(/\.html\s*$/, "").replace(/[^a-z0-9]/g, "");
  }
  Array.prototype.forEach.call(document.querySelectorAll("form.dial"), function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = f.querySelector("input[type=text]");
      var status = f.querySelector(".dialStatus");
      var word = norm(input.value);
      if (!word) { if (status) status.textContent = "NO SIGNAL."; beep(180, 120); return; }
      j.attempts += 1; save(j);
      beep(880, 60);
      if (status) status.textContent = "TUNING " + word.toUpperCase() + " ...";
      setTimeout(function () { location.href = word + ".html"; }, 380);
    });
  });

  /* ---- progress + counter ---- */
  var recovered = 0;
  for (var i = 1; i <= TOTAL; i++) if (j.visited[String(i)]) recovered++;
  Array.prototype.forEach.call(document.querySelectorAll("#progress"), function (el) {
    el.textContent = recovered + " / " + TOTAL;
  });
  var counter = document.getElementById("counter");
  if (counter) counter.textContent = String(j.hits).padStart(7, "0");

  /* ---- boot banner ---- */
  console.log("%c K-7 HALCYON ARCHIVE ", "background:#050805;color:#39ff6a;font-family:monospace;font-size:14px");
  console.log("[K7] carrier lock: stable. chamber " + (chamber || "?") + " mounted.");
  console.log("[K7] the archive accepts no guesses, only proof.");
})();

/* K-7 victory services: record, certificate, log, final transmission, reset. */
(function () {
  "use strict";
  var LKEY = "k7_operator_log_v1";
  function j() { return window.K7 ? window.K7.journal() : {}; }
  function elapsed() {
    var ms = Date.now() - (j().t0 || Date.now());
    var s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
    return h + "h " + m + "m " + (s % 60) + "s";
  }
  function loadLog() { try { return JSON.parse(localStorage.getItem(LKEY)) || []; } catch (e) { return []; } }
  function saveLog(l) { try { localStorage.setItem(LKEY, JSON.stringify(l)); } catch (e) {} }

  function paintLog() {
    var t = document.getElementById("logTable");
    if (!t) return;
    while (t.rows.length > 1) t.deleteRow(1);
    loadLog().forEach(function (e, idx) {
      var r = t.insertRow(-1);
      r.insertCell(0).textContent = e.d;
      r.insertCell(1).textContent = e.n;
      r.insertCell(2).textContent = e.m;
      var c = r.insertCell(3);
      var a = document.createElement("a");
      a.href = "#"; a.textContent = "[del]";
      a.addEventListener("click", function (ev) {
        ev.preventDefault();
        if (confirm("Strike this entry from the log?")) {
          var l = loadLog(); l.splice(idx, 1); saveLog(l); paintLog();
        }
      });
      c.appendChild(a);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var J = j();
    var el = document.getElementById("elapsed"); if (el) el.textContent = elapsed();
    var at = document.getElementById("attempts"); if (at) at.textContent = String(J.attempts || 0);

    var form = document.getElementById("logForm");
    if (form) form.addEventListener("submit", function (e) {
      e.preventDefault();
      var n = document.getElementById("logName").value.trim() || "OPERATOR 7";
      var m = document.getElementById("logMsg").value.trim();
      if (!m) return;
      var l = loadLog();
      l.push({ d: new Date().toISOString().slice(0, 10), n: n.slice(0, 24), m: m.slice(0, 140) });
      saveLog(l); paintLog();
      document.getElementById("logMsg").value = "";
      if (window.K7) window.K7.beep(660, 60);
    });
    paintLog();

    var cert = document.getElementById("dlCert");
    if (cert) cert.addEventListener("click", function (e) {
      e.preventDefault();
      var name = (document.getElementById("logName").value.trim() || "OPERATOR 7");
      var txt = [
        "==================================================",
        "  SHORTWAVE PRESERVATION SOCIETY — NODE 3",
        "  CERTIFICATE OF SILENCE",
        "==================================================",
        "  This certifies that " + name,
        "  recovered all eight chambers of the K-7 HALCYON",
        "  archive and spoke the final word.",
        "",
        "  SHUTDOWN KEY : HALCYON-1997",
        "  ELAPSED      : " + elapsed(),
        "  ATTEMPTS     : " + (j().attempts || 0),
        "  DATE         : " + new Date().toUTCString(),
        "",
        "  The carrier is down. The counting has stopped.",
        "=================================================="
      ].join("\r\n");
      var url = URL.createObjectURL(new Blob([txt], { type: "text/plain" }));
      var a = document.createElement("a");
      a.href = url; a.download = "k7_operator_certificate.txt";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    });

    var play = document.getElementById("playFinal");
    var status = document.getElementById("finalStatus");
    var playing = false;
    if (play) play.addEventListener("click", function () {
      if (playing) return;
      if (!window.K7 || !window.K7.soundOn()) {
        if (status) status.textContent = "sound is OFF — enable it at the top of the page.";
        return;
      }
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) { if (status) status.textContent = "no audio device on this terminal."; return; }
      playing = true;
      var c = new AC(), t = c.currentTime;
      var o = c.createOscillator(), g = c.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(1200, t);
      o.frequency.exponentialRampToValueAtTime(80, t + 6);
      g.gain.setValueAtTime(0.12, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 7);
      o.connect(g); g.connect(c.destination);
      o.start(t); o.stop(t + 7.1);
      var nb = c.createBuffer(1, c.sampleRate * 7, c.sampleRate), d = nb.getChannelData(0);
      for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      var ns = c.createBufferSource(), ng = c.createGain();
      ns.buffer = nb; ng.gain.setValueAtTime(0.05, t);
      ng.gain.exponentialRampToValueAtTime(0.0001, t + 7);
      ns.connect(ng); ng.connect(c.destination); ns.start(t);
      if (status) status.textContent = "carrier fading...";
      setTimeout(function () { if (status) status.textContent = "the master crystal is out."; }, 3500);
      setTimeout(function () {
        if (status) status.textContent = "SILENT. no carrier.";
        playing = false; c.close();
      }, 7200);
    });

    var reset = document.getElementById("resetArchive");
    if (reset) reset.addEventListener("click", function (e) {
      e.preventDefault();
      if (confirm("Burn the journal? All progress and the operator log will be destroyed.")) {
        localStorage.removeItem("k7_journal_v1");
        localStorage.removeItem("k7_operator_log_v1");
        location.href = "index.html";
      }
    });
  });
})();

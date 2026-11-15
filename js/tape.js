/* K-7 tape deck B — chamber 4. Synthesizes the cassette as a real WAV.
   The header rate is written by the faulty deck, not by the truth. */
/* KF-4:C */
(function () {
  "use strict";
  var TRUE_RATE = 8000, LABEL_RATE = 16000, UNIT_MS = 90, TONE = 720, BUZZ = 100;
  var WORDS = [
    ["-.-", "--..."],
    ["-----", "....."],
    [".----", "....-"],
    ["-----", "----."],
    ["-----", "--..."],
    [".----", "...--"],
    ["-----", ".----"]
  ];

  function runs() {
    var r = [[0, 10]], i, w, c, s;
    for (w = 0; w < WORDS.length; w++) {
      for (c = 0; c < WORDS[w].length; c++) {
        var sym = WORDS[w][c];
        for (s = 0; s < sym.length; s++) {
          r.push([1, sym[s] === "-" ? 3 : 1]);
          r.push([0, 1]);
        }
        r[r.length - 1][1] = 3;
      }
      r[r.length - 1][1] = 7;
    }
    r.push([0, 20]);
    return r;
  }

  function samples() {
    var r = runs(), unit = Math.round(TRUE_RATE * UNIT_MS / 1000);
    var total = 0; r.forEach(function (x) { total += x[1] * unit; });
    var out = new Float32Array(total), pos = 0, seed = 1997, k, n, t, v, env, fade = 40;
    for (k = 0; k < r.length; k++) {
      n = r[k][1] * unit;
      for (var i = 0; i < n; i++, pos++) {
        t = pos / TRUE_RATE;
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        v = Math.sin(2 * Math.PI * BUZZ * t) * 0.05 + ((seed / 0x7fffffff) - 0.5) * 0.024;
        if (r[k][0]) {
          env = Math.min(1, i / fade, (n - 1 - i) / fade);
          v += Math.sin(2 * Math.PI * TONE * t) * 0.45 * env;
        }
        out[pos] = v;
      }
    }
    return out;
  }

  function wav(pcm) {
    var dataLen = pcm.length * 2;
    var info = [];
    function chunk(id, text) {
      var b = []; for (var i = 0; i < text.length; i++) b.push(text.charCodeAt(i)); b.push(0);
      if (b.length % 2) b.push(0);
      var head = [id.charCodeAt(0), id.charCodeAt(1), id.charCodeAt(2), id.charCodeAt(3),
        b.length & 255, (b.length >> 8) & 255, (b.length >> 16) & 255, (b.length >> 24) & 255];
      return head.concat(b);
    }
    info = chunk("IART", "K7 HALCYON").concat(chunk("ICMT", "DECK B - PITCH CAL 1996-11-03 - SEE MAINT LOG"));
    var listPayload = [73, 78, 70, 79].concat(info); /* INFO */
    var listSize = listPayload.length;
    var riffSize = 36 + dataLen + 8 + listSize;
    var buf = new ArrayBuffer(44 + dataLen + 8 + listSize);
    var dv = new DataView(buf);
    function wstr(off, s) { for (var i = 0; i < s.length; i++) dv.setUint8(off + i, s.charCodeAt(i)); }
    wstr(0, "RIFF"); dv.setUint32(4, riffSize, true); wstr(8, "WAVE");
    wstr(12, "fmt "); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true);
    dv.setUint32(24, LABEL_RATE, true); dv.setUint32(28, LABEL_RATE * 2, true);
    dv.setUint16(32, 2, true); dv.setUint16(34, 16, true);
    wstr(36, "data"); dv.setUint32(40, dataLen, true);
    for (var i = 0; i < pcm.length; i++) {
      var s = Math.max(-1, Math.min(1, pcm[i]));
      dv.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    var off = 44 + dataLen;
    wstr(off, "LIST"); dv.setUint32(off + 4, listSize, true);
    for (var b = 0; b < listPayload.length; b++) dv.setUint8(off + 8 + b, listPayload[b]);
    return buf;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var buf = wav(samples());
    var url = URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
    var a = document.getElementById("tapeAudio");
    var dl = document.getElementById("dlWav");
    var info = document.getElementById("tapeInfo");
    if (a) { a.src = url; a.muted = !window.K7 || !window.K7.soundOn(); }
    if (dl) dl.href = url;
    if (info) info.textContent = buf.byteLength + " bytes. label rate " + LABEL_RATE + " Hz.";
    document.addEventListener("k7sound", function (e) { if (a) a.muted = !e.detail.on; });
  });
})();

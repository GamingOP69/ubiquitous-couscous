/* K-7 sampler artifact — chamber 2.
   These bytes ARE the file. Nothing here embeds or decodes a payload;
   the payload exists only in the artifact itself. */
(function () {
  "use strict";
  var HEADER =
    "42 4D FD 01 00 00 00 00 00 00 36 00 00 00 28 00 00 00 10 00 00 00 " +
    "08 00 00 00 01 00 18 00 00 00 00 00 80 01 00 00 13 0B 00 00 13 0B " +
    "00 00 00 00 00 00 00 00 00 00";
  /* raster rows, stored bottom-first per BMP spec */
  var ROWS = [
    "101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010",
    "e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0",
    "c0c1c0c0c1c1c0c1c0c1c0c0c0c1c0c1c0c0c1c0c0c0c0c0c0c1c0c0c1c1c0c1c0c1c0c0c0c1c0c1c0c0c1c0c1c1c1c0",
    "a0a1a0a0a1a1a0a1a0a1a0a0a0a1a0a1a0a0a1a0a1a1a1a0a0a0a1a0a0a0a0a0a0a1a0a0a1a1a1a0a0a1a0a0a0a0a0a1",
    "808180808181808180818081818080818080818080808080808180818080808080818081808081808081808081808081",
    "606160606061616060616060616060616061606061616160606160606061606160616061606061616060616060606060",
    "404140404140404140414040404041414041404041404040404041404040404040414040404140404041404040414041",
    "202120202021212120212021202021202021202020212021202120202021202120212020212121202021202120212121"
  ];
  var TRAILER = "K7 SAMPLER v1.3 CALIBRATION OK. NO TEXT PAYLOAD IN HEADER. LOOK DEEPER.";

  function hexBytes(s) {
    s = s.replace(/\s+/g, "");
    var out = [];
    for (var i = 0; i < s.length; i += 2) out.push(parseInt(s.substr(i, 2), 16));
    return out;
  }
  function build() {
    var bytes = hexBytes(HEADER);
    ROWS.forEach(function (r) { bytes = bytes.concat(hexBytes(r)); });
    for (var i = 0; i < TRAILER.length; i++) bytes.push(TRAILER.charCodeAt(i) & 0xFF);
    return new Uint8Array(bytes);
  }
  document.addEventListener("DOMContentLoaded", function () {
    var data = build();
    var url = URL.createObjectURL(new Blob([data], { type: "image/bmp" }));
    var img = document.getElementById("bmpPreview");
    var dl = document.getElementById("dlBmp");
    var raw = document.getElementById("rawBmp");
    var size = document.getElementById("bmpSize");
    if (img) img.src = url;
    if (dl) dl.href = url;
    if (raw) raw.href = url;
    if (size) size.textContent = data.length + " bytes materialized.";
  });
})();

/* K-7 recovery console — chamber 1 only. */
(function () {
  "use strict";
  var NOISE = [
    "sector unreadable: head crash at 0x03F1. nothing survives here.",
    "sector unreadable: oxide shed. the magnetic layer is gone.",
    "sector unreadable: overwritten by the 1996 calibration routine."
  ];
  window.kestrel = {
    help: function () {
      return [
        "K7 RECOVERY CONSOLE v0.9 (1998)",
        "  kestrel.sector(n)  - dump recovered boot sector n (1-4)",
        "  kestrel.status()   - recovery summary",
        "  kestrel.about()    - station record"
      ].join("\n");
    },
    sector: function (n) {
      n = parseInt(n, 10);
      if (n === 4) return "00110100 00111010 01001111 01010010";
      if (n >= 1 && n <= 3) return NOISE[n - 1];
      return "no such sector. the boot ROM holds four.";
    },
    status: function () {
      return "4 sectors lost. fragments scattered to the usual places: the source, the dump, the log, the console.";
    },
    about: function () {
      return "K-7 HALCYON. 6.840 MHz. 1963-1997. the counting stopped; the archive did not.";
    }
  };
  console.log("[K7] RECOVERY LOG: 4 boot sectors lost. fragments were scattered to the usual places.");
  console.log("[K7] log[3] mirror (rot13): 3:CU");
  console.log("[K7] type kestrel.help() for the recovery console.");
})();

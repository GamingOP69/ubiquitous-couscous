/* K-7 finale console — chamber 8. Remembers chambers, never answers. */
(function () {
  "use strict";
  var TITLES = {
    "1": "THE LOBBY", "2": "THE SAMPLER", "3": "THE SCHEDULE", "4": "THE TAPE",
    "5": "THE MACHINE", "6": "THE CARDINAL SIN", "7": "NOTE G", "8": "THE SHUTDOWN WORD"
  };
  document.addEventListener("DOMContentLoaded", function () {
    var j = window.K7 ? window.K7.journal() : { visited: {} };
    var n = 0, i;
    for (i = 1; i <= 7; i++) if (j.visited && j.visited[String(i)]) n++;
    var el = document.getElementById("shardCount");
    if (el) el.textContent = n + " / 7";
    window.halcyon = {
      status: function () { return "shard chambers visited: " + n + "/7. the word is seven letters. you have walked past every shard."; },
      manifest: function () {
        var out = ["K7 CHAMBER MANIFEST (this browser's memory):"], k;
        for (k = 1; k <= 8; k++) {
          out.push("  " + k + ". " + TITLES[String(k)] + (j.visited && j.visited[String(k)] ? "  [ENTERED]" : "  [unknown]"));
        }
        return out.join("\n");
      }
    };
    console.log("[K7] finale mounted. try halcyon.manifest()");
  });
})();

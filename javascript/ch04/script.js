"use strict";
// ================================================================
// script.js — Pixel Arcade external script (Guide 4 demo)
// ================================================================
// Guide 4 talking point: this file itself demonstrates two concepts
// simultaneously:
//
//   1. EXTERNAL SCRIPT + defer — linked in index.html as:
//         <script src="script.js" defer></script>
//      so it runs only AFTER the full page is parsed.
//
//   2. "use strict" AT THE SCRIPT LEVEL — placed at the very top of
//      this file, it applies to every line below it. Any undeclared
//      variable assignment in this file will throw a ReferenceError
//      immediately rather than silently creating a global.
//      Compare this to the FUNCTION-LEVEL "use strict" shown in
//      Section 2 of index.html, which only covers one function.
// ================================================================

// --- Footer setup ------------------------------------------------
// Safe to read index.html's global variables (declared without
// "use strict" in the inline script blocks) — global scope is shared.
let footer = document.getElementById("arcadeFooter");
footer.textContent =
    "🕹️ Pixel Arcade Debug Console — Guide 4: Debugging & Error Handling";

// --- Startup console log (driver-program style) ------------------
// This mimics the "driver program" concept from Section 3:
// we test calcFinalScore with known inputs right here in the
// external file, completely separate from the page's UI logic.
console.log("=== script.js loaded (strict mode active) ===");
console.log("Startup self-test — calcFinalScore(1000, 0.5, 2):",
    calcFinalScore(1000, 0.5, 2));   // expect 3000
console.log("Startup self-test — calcFinalScore(500, 1, 3):",
    calcFinalScore(500, 1, 3));      // expect 3000
console.log("Startup self-test — calcFinalScore(0, 0.5, 2):",
    calcFinalScore(0, 0.5, 2));      // expect 0

/* ================================================================
   TRY THIS IN CLASS — script-level "use strict" demo:

   Add the following line anywhere in this file, below the
   "use strict" directive, and reload:

       undeclaredArcadeSetting = true;

   Because "use strict" is at the script level, the browser will
   throw a ReferenceError and halt this entire file — the footer
   will not be updated and the console self-tests won't run.

   Then move the same line into index.html's first inline <script>
   block (which has NO "use strict") and reload again. Now the
   assignment silently creates a global variable and everything
   else loads normally. That contrast shows exactly why strict
   mode matters at the script level, not just in individual functions.
   ================================================================ */

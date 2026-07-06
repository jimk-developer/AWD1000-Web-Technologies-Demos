// ================================================================
// script.js — Pixel Arcade external script (Guide 3 demo)
// ================================================================
// Linked from index.html with:
//     <script src="script.js" defer></script>
//
// "defer" means this file runs only AFTER the full page has been
// parsed, so getElementById("arcadeFooter") is guaranteed to exist.
//
// All the arrays (gameRoster, leaderboard, arcadeCabinets, etc.)
// were declared in index.html's inline <script> blocks. This external
// file can still read them — they are all global variables shared
// across every script block on the same page.
// ================================================================

// Read the leaderboard array (declared in index.html) to build a
// quick stat line for the footer — no redeclaration needed.
let topPlayer = leaderboard.reduce(function(best, current) {
    return current.score > best.score ? current : best;
}, leaderboard[0]);

let footer = document.getElementById("arcadeFooter");
footer.textContent =
    "Pixel Arcade — " + gameRoster.length + " games available" +
    " | Top player: " + topPlayer.name + " (" + topPlayer.score.toLocaleString() + " pts)" +
    " | Cabinets: " + arcadeCabinets.length + " rows x " + arcadeCabinets[0].length + " cols";

/* ================================================================
   CONSOLE EXPERIMENT — try this after the page loads:

   In the browser console (F12), type any of these and press Enter:

     gameRoster            // inspect the full array
     arcadeCabinets[1]     // inspect just Row B
     leaderboard.length    // how many entries?
     leaderboard[0].name   // first player's name

   This demonstrates that global arrays are also accessible directly
   from the browser console, which is useful for quick debugging
   without adding temporary console.log() calls to the source file.
   ================================================================ */

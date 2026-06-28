// ================================================================
// script.js — Pixel Arcade external script
// ================================================================
// Linked from index.html with:
//     <script src="script.js" defer></script>
//
// "defer" means: keep downloading this file while the rest of the
// HTML is still being parsed, but don't RUN any of this code until
// the entire page (including the footer) has been built. That is
// why it is safe to reach into #arcadeFooter below.
//
// PLAYER_NAME and totalGamesPlayed are NOT redeclared here — they
// already exist as global variables from index.html's first inline
// <script> block, and this external file can see them too.
// ================================================================

// ----------------------------------------------------------------
// Applying a function to the page load event (Guide 2, Section 2)
// A common pattern: attach setup work to window's "load" event so
// it runs automatically once, right when the page is ready.
// ----------------------------------------------------------------
window.addEventListener("load", initializeArcade);

function initializeArcade() {
    document.getElementById("arcadeFooter").textContent =
        "Arcade online — welcome back, " + PLAYER_NAME + "!";

    setupMysteryBonusButton();
    setupCaptureBubbleDemo();
}

// ----------------------------------------------------------------
// Events as an anonymous function passed to addEventListener
// (Guide 2, Section 2: "Events and Anonymous Functions")
// This button has NO onclick attribute in the HTML at all. The
// function below has no name — it is defined right where it is
// used, which is the typical pattern for a one-time, single-purpose
// piece of event logic.
// ----------------------------------------------------------------
function setupMysteryBonusButton() {
    document.getElementById("mysteryBonusBtn").addEventListener("click", function () {
        let mysteryItems = ["Rare Coin Stash", "Free Continue", "Secret Level Key"];
        let pick = mysteryItems[Math.floor(Math.random() * mysteryItems.length)];
        document.getElementById("bonusOutput").textContent =
            "Mystery bonus unlocked: " + pick;
    });

    // Compare this to "events as object properties": only ONE function
    // can ever be assigned this way, and a second assignment would
    // silently overwrite the first. addEventListener above allows many
    // independent listeners on the same element and event.
}

// ----------------------------------------------------------------
// Section 7: Capture and Bubbling demo
// Three elements (outer cabinet, middle screen, and the button) each
// get TWO listeners for the same "click" event:
//   - one with useCapture = true  -> fires during the CAPTURE phase
//     (top of the page down to the clicked element)
//   - one with useCapture = false -> fires during the BUBBLING phase
//     (the clicked element back up to the top), which is the default
// Clicking the button writes every step, in firing order, to the log.
// ----------------------------------------------------------------
function setupCaptureBubbleDemo() {
    let outer = document.getElementById("arcadeOuter");
    let middle = document.getElementById("arcadeMiddle");
    let button = document.getElementById("arcadeButton");

    addLoggedListener(outer, "OUTER CABINET", true);
    addLoggedListener(middle, "MIDDLE SCREEN", true);
    addLoggedListener(button, "BUTTON", true);

    addLoggedListener(outer, "OUTER CABINET", false);
    addLoggedListener(middle, "MIDDLE SCREEN", false);
    addLoggedListener(button, "BUTTON", false);
}

// Helper that wires up one element with one phase, so we are not
// repeating the same six-line listener six times above.
function addLoggedListener(element, label, useCapture) {
    let phaseName = useCapture ? "CAPTURE" : "BUBBLE";

    element.addEventListener("click", function () {
        let log = document.getElementById("eventLog");
        log.textContent += phaseName + ": " + label + "\n";
    }, useCapture);
}

/* ================================================================
   BROWSER CONSOLE / DEBUGGING DEMO (Guide 2, Section 9)

   To show students a live error on purpose:
     1. Open the console (F12, or Ctrl+Shift+I / Cmd+Option+I).
     2. Temporarily misspell an id below, for example change
        "arcadeFooter" to "arcadeFotoer" in initializeArcade().
     3. Reload the page. The console reports something like:
            Uncaught TypeError: Cannot set properties of null
            (setting 'textContent')
              at initializeArcade (script.js:LINE)
     4. Point out the three things the error gives you: the error
        TYPE (TypeError), the FILE (script.js), and the LINE NUMBER —
        exactly what the guide says to read first, before guessing.
   ================================================================ */

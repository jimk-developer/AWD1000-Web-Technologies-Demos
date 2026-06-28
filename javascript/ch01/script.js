// ================================================================
// script.js — Pixel Arcade external script (Guide 1 demo)
// ================================================================
// Guide 1 talking point: code in a separate .js file works exactly
// the same as code in an inline <script> block. It is linked with:
//
//     <script src="script.js" defer></script>
//
// The browser keeps this file in a separate, reusable location.
// Any page could link to this same file and reuse this code —
// that is the whole point of externalizing scripts.
//
// Because the <script> tag in index.html uses "defer", this code
// does not run until the ENTIRE page has finished loading, which
// is why it is safe to reach into the footer below without getting
// a "null" error.
// ================================================================

// Notice ARCADE_NAME is NOT declared again here. It was already
// declared with const in index.html's first inline <script> block,
// and external files loaded into the same page can see it too —
// they are all part of the same connected program.

let arcadeHours = "Mon-Thu: 2pm - 10pm | Fri-Sun: 11am - midnight";

// document.getElementById() again, this time from the external file
let footer = document.getElementById("arcadeFooter");
footer.textContent = ARCADE_NAME + " — " + arcadeHours;

/* Try this in class:
   1. Comment out the "defer" attribute on the <script src="script.js">
      tag in index.html and move that tag up into <head>.
   2. Reload the page and open the browser console.
   3. You should see an error similar to:
        "Cannot set properties of null (setting 'textContent')"
      because the footer element does not exist in the DOM yet when
      this script runs without defer.
*/

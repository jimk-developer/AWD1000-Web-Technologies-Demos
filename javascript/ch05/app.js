"use strict";
/*
 * ============================================================
 * app.js  - Mission Control Guide 5 Demo
 * ============================================================
 * Linked from index.html with:
 *     <script src="app.js" defer></script>
 *
 * "defer" ensures the DOM is fully parsed before this file runs,
 * so every getElementById() call below is guaranteed to find its
 * element. Without defer (or DOMContentLoaded), calls at the top
 * level would return null because the elements don't exist yet.
 *
 * "use strict" is at the script level (first line) so it applies
 * to every function in this file  - not just one function.
 *
 * SECTION MAP (matches Guide 5 headings):
 *   initializeMission()   master setup called on DOMContentLoaded
 *   setupNodeExplorer()   S1: nodes, traversal, querySelectorAll
 *   setupNodeCreation()   S2: createElement, appendChild, classList,
 *                              inline styles, textContent/innerHTML,
 *                              build from data array
 *   setupRestructuring()  S3: appendChild to move, insertBefore,
 *                              cloneNode(true/false)
 *   setupTimedCommands()  S4: setInterval, clearInterval,
 *                              setTimeout, clearTimeout
 *   setupPopups()         S5: alert, confirm, prompt, window.open
 *   setupMissionGallery() S6: overlay, removeChild, "this" object
 *   setupBOMInspector()   S7: location, navigator, screen, history
 *   updateFooter()        sets footer text from BOM data
 * ============================================================
 */

//  Data used in Section 2: build manifest from array 
// The data lives in JavaScript, separate from HTML. In a real app
// this array would come from a server fetch. Here it's inline so
// students can see the source and the rendered output side by side.
const missionData = [
    { name: "Alpha Survey", status: "Active", orbit: "GEO" },
    { name: "Beta Repair", status: "Standby", orbit: "LEO" },
    { name: "Gamma Deploy", status: "Launching", orbit: "MEO" },
    { name: "Delta Return", status: "En route", orbit: "Trans" },
    { name: "Epsilon Probe", status: "Active", orbit: "HEO" },
    { name: "Zeta Relay", status: "Nominal", orbit: "LEO" }
];

//   Timer state variables (Section 4) 
// These must live at module scope so clearInterval/clearTimeout
// can reference the IDs returned by setInterval/setTimeout.
let clockTimerId = null; // setInterval ID for the mission clock
let clockSeconds = 0;    // elapsed seconds counter
let signalTimeoutId = null; // setTimeout ID for the delayed signal

// Section 3: original queue order for the Reset button 
// Saved as an array of id strings so we can restore DOM order.
const originalQueueOrder = ["qc1", "qc2", "qc3", "qc4"];

// ============================================================
// MASTER INITIALIZATION
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
    // All setup runs AFTER the DOM is ready.
    // Guide 5 tip: addEventListener("DOMContentLoaded") is an
    // alternative to the "defer" attribute for ensuring the DOM
    // is ready before scripts access it.
    setupNodeExplorer();
    setupNodeCreation();
    setupRestructuring();
    setupTimedCommands();
    setupPopups();
    setupMissionGallery();
    setupBOMInspector();
    updateFooter();
});

// ============================================================
// SECTION 1  NODES & THE NODE TREE
// Concepts: parent/child/sibling navigation properties,
//           querySelectorAll (static node list),
//           getElementsByClassName (live HTML collection)
// ============================================================
function setupNodeExplorer() {
    // Get references to the buttons and output box
    let fleet = document.getElementById("satelliteFleet");
    let output = document.getElementById("nodeOutput");

    // Helper: clear all highlighted styles from satellite cards
    function clearHighlights() {
        document.querySelectorAll(".sat-card").forEach(function (card) {
            card.classList.remove("highlighted");
        });
    }

    // parentNode 
    document.getElementById("btnParent").addEventListener("click", function () {
        clearHighlights();
        // parentNode traverses UP the tree  - from the fleet container
        // up to its parent (the <section> element)
        let parent = fleet.parentNode;
        output.textContent =
            "fleet.parentNode\n" +
            "  nodeName: \"" + parent.nodeName + "\"\n" +
            "  id:        \"" + (parent.id || "(no id)") + "\"\n\n" +
            "The <div id='satelliteFleet'> is nested inside the <section id='s1'>.\n" +
            "parentNode walks ONE step UP the tree.";
    });

    // children vs. childNodes 
    document.getElementById("btnChildren").addEventListener("click", function () {
        clearHighlights();

        // .children    - only ELEMENT-type child nodes (HTMLCollection, live)
        // .childNodes   - ALL child nodes: elements + text nodes + comment nodes
        let elementChildren = fleet.children;
        let allChildNodes = fleet.childNodes;

        // Highlight every child element
        for (let i = 0; i < elementChildren.length; i++) {
            elementChildren[i].classList.add("highlighted");
        }

        output.textContent =
            "fleet.children.length:   " + elementChildren.length +
            "  (element nodes only)\n" +
            "fleet.childNodes.length: " + allChildNodes.length +
            "  (elements + text/whitespace nodes)\n\n" +
            "children[0].id: \"" + elementChildren[0].id + "\"\n" +
            "children[1].id: \"" + elementChildren[1].id + "\"\n" +
            "children[2].id: \"" + elementChildren[2].id + "\"\n\n" +
            "Note: childNodes counts MORE than children because whitespace\n" +
            "(newlines between tags) is stored as text nodes in the DOM.";
    });

    // firstElementChild
    document.getElementById("btnFirstChild").addEventListener("click", function () {
        clearHighlights();
        let first = fleet.firstElementChild;
        first.classList.add("highlighted");

        output.textContent =
            "fleet.firstElementChild\n" +
            "  id:        \"" + first.id + "\"\n" +
            "  nodeName:  \"" + first.nodeName + "\"\n" +
            "  textContent (trimmed): \"" + first.textContent.trim().replace(/\s+/g, " ") + "\"\n\n" +
            "firstElementChild skips any leading text/comment nodes and\n" +
            "returns only the first child that is a proper element.";
    });

    // nextElementSibling
    document.getElementById("btnNextSibling").addEventListener("click", function () {
        clearHighlights();
        // Start from the first child and walk to its next sibling
        let first = fleet.firstElementChild;
        let second = first.nextElementSibling;
        second.classList.add("highlighted");

        output.textContent =
            "fleet.firstElementChild.nextElementSibling\n" +
            "  id:       \"" + second.id + "\"\n" +
            "  nodeName: \"" + second.nodeName + "\"\n\n" +
            "nextElementSibling walks SIDEWAYS in the tree  - same parent,\n" +
            "next element. (previousElementSibling walks the other way.)\n\n" +
            "fleet.children[2].nextElementSibling = " +
            fleet.children[2].nextElementSibling + " (null  - no sibling after last child)";
    });

    // querySelectorAll - static node list
    document.getElementById("btnQueryAll").addEventListener("click", function () {
        clearHighlights();

        // querySelectorAll uses CSS selector syntax and returns a
        // STATIC NodeList  - a snapshot frozen at this moment.
        let nodeList = document.querySelectorAll(".sat-card");

        nodeList.forEach(function (card) {
            card.classList.add("highlighted");
        });

        output.textContent =
            "document.querySelectorAll(\".sat-card\")\n" +
            "  NodeList.length: " + nodeList.length + "\n\n" +
            "Nodes in the list:\n" +
            Array.from(nodeList).map(function (n, i) {
                return "  [" + i + "] id=\"" + n.id + "\"";
            }).join("\n") + "\n\n" +
            "This is a STATIC snapshot. If a new .sat-card were added to\n" +
            "the DOM after this call, nodeList.length would still be " + nodeList.length + ".";
    });

    //  Live HTMLCollection vs. Static NodeList 
    document.getElementById("btnLiveVsStatic").addEventListener("click", function () {
        clearHighlights();

        // Take a static snapshot BEFORE adding a new node
        let staticList = document.querySelectorAll(".sat-card");

        // Get a LIVE collection BEFORE adding the node
        let liveCollection = document.getElementsByClassName("sat-card");

        let beforeStatic = staticList.length;
        let beforeLive = liveCollection.length;

        // Now add a temporary new card to the fleet
        let tempCard = document.createElement("article");
        tempCard.className = "sat-card";
        tempCard.id = "sat-temp";
        tempCard.innerHTML = "<h3>⚡ Temp Node</h3><p>Added by JS</p>";
        fleet.appendChild(tempCard);

        // Check lengths AFTER the node was added
        let afterStatic = staticList.length;      // unchanged  - static snapshot
        let afterLive = liveCollection.length;  // updated   - live view

        output.textContent =
            "BEFORE adding a new .sat-card:\n" +
            "  querySelectorAll (static): " + beforeStatic + "\n" +
            "  getElementsByClassName (live): " + beforeLive + "\n\n" +
            "AFTER appendChild(tempCard):\n" +
            "  querySelectorAll (static): " + afterStatic +
            "  <-- UNCHANGED (snapshot frozen at call time)\n" +
            "  getElementsByClassName (live): " + afterLive +
            "  <-- AUTO-UPDATED (always reflects current DOM)\n\n" +
            "(The temporary card will vanish on next button click.)";

        // Remove the temp card after 3 seconds so the demo stays clean
        setTimeout(function () {
            if (document.getElementById("sat-temp")) {
                fleet.removeChild(tempCard);
            }
        }, 3000);
    });
}

// ============================================================
// SECTION 2  - CREATING & CONNECTING NODES
// Concepts: createElement(), appendChild(), id, className,
//           classList.add/remove/toggle, node.style (inline styles),
//           textContent vs innerHTML, building from a data array
// ============================================================
function setupNodeCreation() {
    let roster = document.getElementById("crewRoster");
    let nameInput = document.getElementById("crewName");
    let roleInput = document.getElementById("crewRole");
    let txInput = document.getElementById("transmissionInput");
    let txDisplay = document.getElementById("transmissionDisplay");
    let manifestList = document.getElementById("missionManifest");

    //    Add crew member node   
    document.getElementById("btnAddCrew").addEventListener("click", function () {
        let name = nameInput.value.trim();
        let role = roleInput.value.trim();

        if (!name) {
            nameInput.focus();
            return;
        }

        // Remove the placeholder text if it exists
        let placeholder = roster.querySelector(".placeholder-text");
        if (placeholder) {
            roster.removeChild(placeholder);
        }

        //    createElement(): create a new element node   
        // The new node is NOT in the DOM yet  - it exists only in memory
        // (this is the "document fragment" concept from the guide).
        let card = document.createElement("article");

        //    Setting the id property: maps to the HTML id attribute   
        card.id = "crew-" + name.toLowerCase().replace(/\s+/g, "-");

        //    className: sets the entire class attribute as a string   
        card.className = "crew-card";

        //    classList.add(): adds ONE token without touching others   
        // Compare to className which REPLACES the whole attribute string.
        // classList.remove("priority") would remove only that token.
        // classList.toggle("priority") adds if absent, removes if present.
        if (role.toLowerCase().includes("commander")) {
            card.classList.add("priority"); // extra CSS class for commanders
        }

        //    textContent: safe plain-text insertion   
        // Using textContent means HTML tags in the name/role string are
        // treated as literal characters, not rendered as markup.
        let nameSpan = document.createElement("span");
        nameSpan.className = "crew-name";
        nameSpan.textContent = name;  // safe  - no HTML injection risk

        let roleSpan = document.createElement("span");
        roleSpan.className = "crew-role";
        roleSpan.textContent = role || "Unassigned";

        //    node.style: setting inline styles through the style property   
        // CSS property names with hyphens become camelCase in JavaScript.
        // "background-color" → backgroundColor
        // "font-size" → fontSize
        if (card.classList.contains("priority")) {
            card.style.borderLeft = "3px solid #F97316"; // camelCase!
        }

        // Build the subtree: append spans to the card
        card.appendChild(nameSpan);
        card.appendChild(roleSpan);

        //    appendChild(): attach the completed node to the DOM   
        // Only NOW does the card become visible on the page.
        roster.appendChild(card);

        // Clear inputs for the next entry
        nameInput.value = "";
        roleInput.value = "";
        nameInput.focus();
    });

    //    Clear roster   
    document.getElementById("btnClearRoster").addEventListener("click", function () {
        roster.innerHTML = ""; // wipe all children at once
        let placeholder = document.createElement("p");
        placeholder.className = "placeholder-text";
        placeholder.textContent = "Crew roster is empty  - add a crew member above.";
        roster.appendChild(placeholder);
    });

    //    textContent vs innerHTML   
    document.getElementById("btnTextContent").addEventListener("click", function () {
        let text = txInput.value || "<em>Pulse detected</em> in sector <strong>7G</strong>";

        // textContent DOES NOT render HTML  - tags appear as literal text.
        // Safe for user-supplied content where rendering HTML could be dangerous.
        txDisplay.textContent = text;

        // Add a note explaining what happened
        txDisplay.textContent +=
            "\n\n[textContent: HTML tags shown as plain text  - safe for user input]";
    });

    document.getElementById("btnInnerHTML").addEventListener("click", function () {
        let text = txInput.value || "<em>Pulse detected</em> in sector <strong>7G</strong>";

        // innerHTML RENDERS the HTML  - <em> becomes italic, <strong> becomes bold.
        // Guide 5 warning: never use innerHTML with unsanitized user input because
        // it can introduce XSS vulnerabilities if the input contains script tags.
        txDisplay.innerHTML = text +
            "<br><br><small style='color:#64748B;'>[innerHTML: HTML tags rendered as markup]</small>";
    });

    //    Build manifest from data array   
    document.getElementById("btnBuildManifest").addEventListener("click", function () {
        manifestList.innerHTML = ""; // clear any previous build

        // The missionData array (declared at the top of this file) drives
        // the node creation. One <li> node is built per array element.
        // This is the "document fragment built with a for loop" pattern
        // from the guide  - the data lives in JS, the structure in the DOM.
        for (let i = 0; i < missionData.length; i++) {
            let mission = missionData[i];

            // Create the <li> element
            let item = document.createElement("li");
            item.className = "manifest-item";

            // Create and populate child elements
            let nameSpan = document.createElement("span");
            nameSpan.className = "mission-name";
            nameSpan.textContent = mission.name;   // textContent  - plain text only

            let statusSpan = document.createElement("span");
            statusSpan.className = "mission-status";
            statusSpan.textContent = mission.status + " | Orbit: " + mission.orbit;

            item.appendChild(nameSpan);
            item.appendChild(statusSpan);

            // appendChild adds each <li> to the <ul> in order
            manifestList.appendChild(item);
        }
    });
}

// ============================================================
// SECTION 3  - RESTRUCTURING THE NODE TREE
// Concepts: appendChild() to MOVE an existing node,
//           insertBefore(), cloneNode(false), cloneNode(true)
// ============================================================
function setupRestructuring() {
    let queue = document.getElementById("missionQueue");
    let cloneTarget = document.getElementById("cloneTarget");
    let output = document.getElementById("restructureOutput");

    //    Move first card to end (appendChild on an existing node)   
    document.getElementById("btnMoveToEnd").addEventListener("click", function () {
        let first = queue.firstElementChild;
        if (!first) { return; }

        // KEY INSIGHT: calling appendChild() on a node that ALREADY EXISTS
        // in the DOM does NOT create a duplicate. The browser automatically
        // REMOVES it from its current position first, then appends it to
        // the end. This is the slideshow-advance pattern from the guide.
        queue.appendChild(first);

        output.textContent =
            "appendChild(firstElementChild)\n" +
            "  \"" + first.querySelector(".queue-label").textContent + "\" moved from first to last.\n\n" +
            "appendChild() on an existing node MOVES it  - no duplicate created.\n" +
            "The DOM automatically removes it from its old position.";
    });

    //    Move last card to front (insertBefore)   
    document.getElementById("btnMoveToFront").addEventListener("click", function () {
        let last = queue.lastElementChild;
        let first = queue.firstElementChild;
        if (!last || last === first) { return; }

        // insertBefore(nodeToMove, referenceNode):
        //   - nodeToMove is placed BEFORE referenceNode in the parent's child list
        //   - Like appendChild, it moves rather than clones when the node already
        //     exists in the DOM
        queue.insertBefore(last, first);

        output.textContent =
            "insertBefore(lastElementChild, firstElementChild)\n" +
            "  \"" + last.querySelector(".queue-label").textContent + "\" moved from last to first.\n\n" +
            "insertBefore(newNode, referenceNode) places newNode BEFORE referenceNode.\n" +
            "appendChild() can only add to the END; insertBefore() works anywhere.";
    });

    //    cloneNode(false)  - shallow copy   
    document.getElementById("btnCloneShallow").addEventListener("click", function () {
        let first = queue.firstElementChild;

        // cloneNode(false) = shallow copy: copies the element tag and its
        // attributes, but NOT any of its child nodes. The children (.queue-label,
        // .queue-tag) are left behind. The result is an empty container.
        let shallow = first.cloneNode(false);
        shallow.classList.add("cloned");
        shallow.textContent = "(empty  - shallow clone has no children)";

        cloneTarget.appendChild(shallow);

        output.textContent =
            "first.cloneNode(false)  - SHALLOW copy\n" +
            "  Cloned tag: <" + shallow.nodeName.toLowerCase() + " class=\"" + shallow.className + "\">\n" +
            "  Children copied: 0  (child nodes were NOT cloned)\n\n" +
            "The original still has " + first.children.length + " child element(s).\n" +
            "The clone is an empty shell with the same tag and class.";
    });

    //    cloneNode(true)  - deep copy   
    document.getElementById("btnCloneDeep").addEventListener("click", function () {
        let first = queue.firstElementChild;

        // cloneNode(true) = deep copy: recursively copies the element AND
        // all of its descendants (child elements, text nodes, etc.).
        // Note: event listeners attached via addEventListener are NOT copied.
        let deep = first.cloneNode(true);
        deep.classList.add("cloned");

        cloneTarget.appendChild(deep);

        output.textContent =
            "first.cloneNode(true)  - DEEP copy\n" +
            "  Cloned tag: <" + first.nodeName.toLowerCase() + ">\n" +
            "  Children copied: " + deep.children.length + "  ✓ (all descendants included)\n\n" +
            "Content: \"" + deep.querySelector(".queue-label").textContent + "\"\n\n" +
            "IMPORTANT: Any event listeners attached via addEventListener\n" +
            "on the original node are NOT copied by cloneNode(). Only the\n" +
            "DOM structure and HTML attributes are duplicated.";
    });

    //    Reset queue to original order   
    document.getElementById("btnResetQueue").addEventListener("click", function () {
        // Restore the original child order by re-appending in sequence.
        // appendChild moves each element to the end in the specified order.
        originalQueueOrder.forEach(function (id) {
            let card = document.getElementById(id);
            if (card) { queue.appendChild(card); }
        });

        // Clear the clone output area
        cloneTarget.innerHTML = "";

        output.textContent = "Queue restored to original order.";
    });
}

// ============================================================
// SECTION 4  - TIMED COMMANDS
// Concepts: setInterval(), clearInterval(), setTimeout(),
//           clearTimeout()
// ============================================================
function setupTimedCommands() {
    let clockDisplay = document.getElementById("missionClock");
    let signalOutput = document.getElementById("signalOutput");

    //    setInterval: mission clock   
    document.getElementById("btnStartClock").addEventListener("click", function () {
        if (clockTimerId !== null) { return; } // already running

        // setInterval() calls the function repeatedly every 1000ms (1 second).
        // It RETURNS a numeric timer ID that we MUST save  - it's the only
        // way to stop the timer later via clearInterval().
        clockTimerId = setInterval(function () {
            clockSeconds++;

            // Format seconds into HH:MM:SS for display
            let h = Math.floor(clockSeconds / 3600);
            let m = Math.floor((clockSeconds % 3600) / 60);
            let s = clockSeconds % 60;

            // String padding: ensure two digits for each unit
            clockDisplay.textContent =
                String(h).padStart(2, "0") + ":" +
                String(m).padStart(2, "0") + ":" +
                String(s).padStart(2, "0");

        }, 1000); // fires every 1000 milliseconds
    });

    //    clearInterval: pause clock   
    document.getElementById("btnPauseClock").addEventListener("click", function () {
        if (clockTimerId === null) { return; } // already stopped

        // clearInterval() stops the repeating timer identified by the saved ID.
        // Without saving the ID from setInterval(), there is NO WAY to stop it.
        clearInterval(clockTimerId);
        clockTimerId = null; // reset so the start button works again
    });

    //    Reset clock   
    document.getElementById("btnResetClock").addEventListener("click", function () {
        clearInterval(clockTimerId);
        clockTimerId = null;
        clockSeconds = 0;
        clockDisplay.textContent = "00:00:00";
    });

    //    setTimeout: one-shot delayed signal   
    document.getElementById("btnScheduleSignal").addEventListener("click", function () {
        if (signalTimeoutId !== null) {
            signalOutput.textContent = "Signal already scheduled. Abort it first.";
            return;
        }

        signalOutput.textContent = "📡 Signal scheduled  - will arrive in 3 seconds...\n" +
            "(Click ABORT before 3s to cancel it)";

        // setTimeout() runs the callback ONCE after the delay, then stops.
        // Unlike setInterval(), it does not repeat automatically.
        // Saving the returned ID lets us cancel with clearTimeout() if needed.
        signalTimeoutId = setTimeout(function () {
            signalOutput.textContent =
                "✅ SIGNAL RECEIVED  - Telemetry update from Beta Probe.\n\n" +
                "(setTimeout ran exactly once after a 3-second delay.\n" +
                " There is no built-in way to cancel it now  - it already fired.)";
            signalTimeoutId = null; // timer has fired  - reset the ID
        }, 3000); // delay in milliseconds
    });

    //    clearTimeout: cancel the pending signal   
    document.getElementById("btnAbortSignal").addEventListener("click", function () {
        if (signalTimeoutId === null) {
            signalOutput.textContent = "No signal pending. Nothing to abort.";
            return;
        }

        // clearTimeout() cancels a pending setTimeout BEFORE it fires.
        // Once the timeout has already fired, clearTimeout() has no effect.
        clearTimeout(signalTimeoutId);
        signalTimeoutId = null;

        signalOutput.textContent =
            "🚫 Signal aborted  - clearTimeout() cancelled the pending callback.\n\n" +
            "The callback function was NEVER called. clearTimeout() works\n" +
            "only BEFORE the delay expires; after that it is too late.";
    });
}

// ============================================================
// SECTION 5  - POPUP WINDOWS
// Concepts: window.alert(), window.confirm(), window.prompt(),
//           window.open(), writing to a popup via popupRef.document,
//           using the screen object to center a popup
// ============================================================
function setupPopups() {
    let dialogOutput = document.getElementById("dialogOutput");

    //    window.alert()   
    document.getElementById("btnAlert").addEventListener("click", function () {
        // alert() pauses the program until the user dismisses the dialog.
        // It returns undefined  - there is no return value to capture.
        window.alert("⚠️ Mission Control Alert: Solar flare detected. Stand by for instructions.");

        dialogOutput.textContent =
            "window.alert() dismissed.\n" +
            "Return value: undefined  (alert has no return value)";
    });

    //    window.confirm()   
    document.getElementById("btnConfirm").addEventListener("click", function () {
        // confirm() returns true if the user clicked OK, false if Cancel.
        let confirmed = window.confirm("Abort Mission Alpha? This cannot be undone.");

        // The returned boolean drives the decision
        if (confirmed) {
            dialogOutput.textContent =
                "window.confirm() returned: true  (OK was clicked)\n" +
                "Action: Mission Alpha abort sequence initiated.";
        } else {
            dialogOutput.textContent =
                "window.confirm() returned: false  (Cancel was clicked)\n" +
                "Action: Mission Alpha continues  - no change.";
        }
    });

    //    window.prompt()   
    document.getElementById("btnPrompt").addEventListener("click", function () {
        // prompt() returns the string the user typed, or null if Cancel.
        // The second argument is the default pre-filled value.
        let pilotName = window.prompt("Enter pilot name for Mission Log:", "Commander ");

        if (pilotName !== null && pilotName.trim() !== "") {
            dialogOutput.textContent =
                "window.prompt() returned: \"" + pilotName + "\"\n" +
                "Log entry: Pilot " + pilotName + " assigned to Mission Alpha.";
        } else if (pilotName === null) {
            dialogOutput.textContent =
                "window.prompt() returned: null  (Cancel was clicked)\n" +
                "No pilot assigned.";
        } else {
            dialogOutput.textContent =
                "window.prompt() returned: \"\" (empty string  - OK with no input)\n" +
                "Please enter a pilot name.";
        }
    });

    //    window.open()   
    document.getElementById("btnOpenPopup").addEventListener("click", function () {
        // window.open() returns a reference to the new window object.
        // Saving it lets us write content to it via popupRef.document.
        let popupRef = window.open(
            "",                            // URL: blank  - we'll write content with JS
            "missionLogPopup",             // window name (target attribute)
            "width=500,height=400,resizable=yes,scrollbars=yes"  // feature string
        );

        if (popupRef) {
            // Write HTML into the popup's document, just like document.write()
            popupRef.document.write(
                "<!DOCTYPE html><html><head>" +
                "<title>Mission Log</title>" +
                "<style>body{font-family:system-ui;background:#0D1424;color:#CBD5E1;" +
                "padding:24px;}h1{color:#06B6D4;}</style></head><body>" +
                "<h1>📋 Mission Log</h1>" +
                "<p>Accessed via <code>popupRef.document.write()</code></p>" +
                "<p>The opener window's <code>window.name</code> is: " +
                "<strong>" + window.name + "</strong></p>" +
                "<p>opener property points back to the window that opened this one.</p>" +
                "<button onclick='window.close()'>Close</button>" +
                "</body></html>"
            );

            dialogOutput.textContent =
                "window.open() opened a popup and returned a reference to it.\n" +
                "We then called popupRef.document.write() to inject content.\n\n" +
                "Note: modern browsers may open this as a new TAB rather than\n" +
                "a floating popup window  - exact behavior varies by browser.";
        } else {
            dialogOutput.textContent =
                "Popup was blocked by the browser.\n" +
                "Popup blockers prevent windows opened without direct user\n" +
                "interaction (e.g. from a timer). This button IS a direct\n" +
                "click, so check your browser's popup settings.";
        }
    });

    //    Centered popup using screen object   
    document.getElementById("btnCenteredPopup").addEventListener("click", function () {
        let popupWidth = 480;
        let popupHeight = 360;

        // screen.width and screen.height are BOM properties that report
        // the user's total display resolution  - useful for centering a popup.
        let leftPos = Math.round((screen.width - popupWidth) / 2);
        let topPos = Math.round((screen.height - popupHeight) / 2);

        // Build the feature string using the calculated positions
        let features = "width=" + popupWidth + ",height=" + popupHeight +
            ",left=" + leftPos + ",top=" + topPos +
            ",resizable=yes";

        let centeredRef = window.open("", "centeredPopup", features);

        if (centeredRef) {
            centeredRef.document.write(
                "<!DOCTYPE html><html><head><title>Centered Popup</title>" +
                "<style>body{font-family:system-ui;background:#050B18;color:#CBD5E1;" +
                "padding:24px;text-align:center;}h1{color:#06B6D4;}" +
                "p{color:#64748B;font-size:0.9rem;}</style></head><body>" +
                "<h1>🎯 Centered!</h1>" +
                "<p>screen.width: " + screen.width + "px</p>" +
                "<p>screen.height: " + screen.height + "px</p>" +
                "<p>leftPos: " + leftPos + "px &nbsp;|&nbsp; topPos: " + topPos + "px</p>" +
                "<p>Formula: (screen.width - popupWidth) / 2</p>" +
                "<button onclick='window.close()'>Close</button>" +
                "</body></html>"
            );

            dialogOutput.textContent =
                "Centered popup calculation:\n" +
                "  screen.width:   " + screen.width + "px\n" +
                "  screen.height:  " + screen.height + "px\n" +
                "  popupWidth:     " + popupWidth + "px\n" +
                "  left = (" + screen.width + " - " + popupWidth + ") / 2 = " + leftPos + "px\n" +
                "  top  = (" + screen.height + " - " + popupHeight + ") / 2 = " + topPos + "px";
        }
    });
}

// ============================================================
// SECTION 6  - OVERLAYS & THE "this" OBJECT
// Concepts: createElement overlay, appendChild to body,
//           removeChild, the "this" object in event handlers
// ============================================================
function setupMissionGallery() {
    // querySelectorAll returns ALL .mission-thumb elements.
    // We attach ONE shared function to ALL of them using forEach.
    let thumbnails = document.querySelectorAll(".mission-thumb");

    thumbnails.forEach(function (thumb) {
        thumb.addEventListener("click", function () {
            // "this" inside an event listener refers to the SPECIFIC element
            // that was clicked. Since all four thumbnails share this same
            // handler, "this" is what tells us WHICH card was clicked.
            // Without "this", we'd need a separate function per card.
            showOverlay(this);
        });
    });
}

function showOverlay(clickedCard) {
    // Read the clicked card's data attributes.
    // "this" in the caller became "clickedCard" here - same reference.
    let missionTitle = clickedCard.dataset.title;
    let missionDetail = clickedCard.dataset.detail;

    //    Build the overlay entirely with createElement
    // Nothing about the overlay exists in index.html  - it is 100% JS-created.

    let overlay = document.createElement("div");
    overlay.className = "page-overlay"; // the CSS class does the positioning

    let card = document.createElement("div");
    card.className = "overlay-card";

    let title = document.createElement("h2");
    title.textContent = "🛰️ " + missionTitle; // textContent = safe

    let detail = document.createElement("p");
    detail.textContent = missionDetail;

    // Note about "this" for the students
    let thisNote = document.createElement("p");
    thisNote.className = "this-note";
    thisNote.textContent =
        "\"this\" inside the click handler referred to the \"" +
        missionTitle + "\" card  - the same handler is shared by all 4 thumbnails.";

    let closeBtn = document.createElement("button");
    closeBtn.className = "overlay-close";
    closeBtn.textContent = "Close Mission Briefing";

    // Close button removes the overlay from the DOM via removeChild()
    closeBtn.addEventListener("click", function () {
        closeOverlay(overlay);
    });

    // Also close if the user clicks on the dark backdrop (outside the card)
    overlay.addEventListener("click", function (event) {
        // event.target is the element that was DIRECTLY clicked.
        // If it's the overlay background (not the card), close.
        if (event.target === overlay) {
            closeOverlay(overlay);
        }
    });

    // Assemble the subtree in memory, then attach it once
    card.appendChild(title);
    card.appendChild(detail);
    card.appendChild(thisNote);
    card.appendChild(closeBtn);
    overlay.appendChild(card);

    // Append to document.body  - the overlay now covers the whole page
    document.body.appendChild(overlay);
}

function closeOverlay(overlay) {
    // removeChild() removes a node from its parent.
    // Syntax: parentNode.removeChild(childNode)
    // The overlay's parent is document.body.
    if (overlay && overlay.parentNode) {
        document.body.removeChild(overlay);
    }
}

// ============================================================
// SECTION 7  - BROWSER OBJECT MODEL (BOM)
// Concepts: window (global object), location, navigator,
//           screen, history
// ============================================================
function setupBOMInspector() {
    let output = document.getElementById("bomOutput");

    document.getElementById("btnInspectBOM").addEventListener("click", function () {
        // All BOM properties are properties of the global window object.
        // Writing "location.href" is shorthand for "window.location.href".

        let report = "=== BOM Inspector ===\n\n";

        // location object: information about the current page URL
        report += "location (current page URL)\n";
        report += "  location.href:     \"" + location.href + "\"\n";
        report += "  location.hostname: \"" + (location.hostname || "(file system  - no hostname)") + "\"\n";
        report += "  location.protocol: \"" + location.protocol + "\"\n\n";

        // navigator object: browser and OS info
        report += "navigator (browser / OS info)\n";
        report += "  navigator.language:  \"" + navigator.language + "\"\n";
        // userAgent can be long  - trim it for display
        let ua = navigator.userAgent;
        report += "  navigator.userAgent: \"" + (ua.length > 60 ? ua.substring(0, 60) + "…" : ua) + "\"\n\n";

        // screen object: the user's display resolution
        report += "screen (display resolution)\n";
        report += "  screen.width:      " + screen.width + "px\n";
        report += "  screen.height:     " + screen.height + "px\n";
        report += "  screen.colorDepth: " + screen.colorDepth + " bits\n\n";

        // history object: pages visited this session
        report += "history (session navigation)\n";
        report += "  history.length: " + history.length + " page(s) in session history\n\n";

        // window itself  - the global object
        report += "window (the global object)\n";
        report += "  typeof window: \"" + typeof window + "\"\n";
        report += "  window === globalThis: " + (window === globalThis) + "\n";
        report += "  (Every BOM property above is a child of window)";

        output.textContent = report;
    });

    // history.back() navigates the browser one page backward  -
    // equivalent to clicking the browser's own Back button.
    document.getElementById("btnHistoryBack").addEventListener("click", function () {
        if (history.length > 1) {
            history.back();
        } else {
            document.getElementById("bomOutput").textContent =
                "history.back() was called, but history.length = " + history.length + ".\n" +
                "There is no previous page to go back to in this session.\n\n" +
                "In a multi-page app, history.back() is equivalent to the\n" +
                "browser's Back button. history.forward() works the same way.";
        }
    });
}

// ============================================================
// FOOTER UPDATE
// Uses BOM objects to populate the page footer.
// Runs once at startup via initializeMission().
// ============================================================
function updateFooter() {
    let footer = document.getElementById("missionFooter");

    // location.hostname is empty when the page is opened as a
    // local file (file:// protocol), so we handle both cases.
    let host = location.hostname
        ? location.hostname
        : "local file system";

    footer.textContent =
        "Mission Control Demo  - Guide 5: DOM &amp; BOM  |  " +
        "Host: " + host + "  |  " +
        "Display: " + screen.width + "×" + screen.height + "  |  " +
        "Language: " + navigator.language;
}

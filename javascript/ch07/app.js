"use strict";
/*
 * ============================================================
 * app.js - The Archive Guide 7 Demo
 * ============================================================
 * Linked from index.html with:
 *     <script src="app.js" defer></script>
 *
 * SECTION MAP:
 *   setupFileReading()      - S1: File API, files collection, FileReader
 *   setupStringMethods()    - S2: length, search, clean, extract, split, combine
 *   setupRegexBasics()      - S3: anchors, flags, char classes, quantifiers, escapes
 *   setupRegexProgramming() - S4: RegExp(), replace(), regex split(), $1 groups
 *   setupArrayMethods()     - S5: sort + compare fn, slice/splice, stack/queue
 *   setupMathObject()       - S6: round/floor/ceil/abs/pow/sqrt, spread, random
 *   setupDateObject()       - S7: new Date(), get*()/set*(), subtraction, locale
 *   setupTemplateLiterals() - S8: placeholders, tagged template literal
 * ============================================================
 */

// ── Shared data used across sections ────────────────────────────────
// Evidence log: array of [itemName, weightGrams] pairs (Section 5 & 6)
let evidenceLog = [
    ["Muddy Footprint Cast", 340],
    ["Leather-Bound Ledger", 890],
    ["Brass Pocket Watch", 62],
    ["Torn Grey Coat Fragment", 45],
    ["Rusted House Key", 18]
];
const ORIGINAL_EVIDENCE_LOG = evidenceLog.map(function (item) { return item.slice(); });

// Stack and queue arrays for Section 5's intake simulator
let caseStack = [];
let caseQueue = [];
let caseCounter = 100;

document.addEventListener("DOMContentLoaded", function () {
    setupFileReading();
    setupStringMethods();
    setupRegexBasics();
    setupRegexProgramming();
    setupArrayMethods();
    setupMathObject();
    setupDateObject();
    setupTemplateLiterals();
    updateFooter();
});

// ============================================================
// SECTION 1 - READING FILES
// Concepts: <input type="file">, the files collection, MIME type
//           checking, the FileReader API, readAsText(), the load event
// ============================================================
function setupFileReading() {
    let fileInput = document.getElementById("caseFileInput");
    let infoOutput = document.getElementById("fileInfoOutput");
    let contentOutput = document.getElementById("fileContentOutput");

    // ── Real file input: reacts when the user picks a file ──
    fileInput.addEventListener("change", function () {
        // Every file chosen through the input becomes a File object
        // inside the input element's .files collection (array-like).
        let selectedFile = fileInput.files[0];

        if (!selectedFile) { return; }

        readCaseFile(selectedFile);
    });

    // ── "Load Sample Case File" button: builds a File in memory ──
    // This lets the FileReader demo work without requiring students
    // to have a real .txt file handy on disk.
    document.getElementById("btnLoadSample").addEventListener("click", function () {
        let sampleText =
            "CASE FILE: Case-2026-0714\n" +
            "Status: Open\n" +
            "Filed: 2026-06-01\n\n" +
            "Witness statement: The suspect was seen leaving the\n" +
            "Riverside Bakery around 9:45 PM, wearing a long grey coat.\n\n" +
            "Evidence logged: footprint cast, ledger, pocket watch.";

        // Blob (Binary Large Object) stores raw data with a size/type,
        // same concept the guide introduces in the tip box. Wrapping it
        // in a File object gives it a filename, just like a real upload.
        let sampleBlob = new Blob([sampleText], { type: "text/plain" });
        let sampleFile = new File([sampleBlob], "sample-case.txt", { type: "text/plain" });

        readCaseFile(sampleFile);
    });

    // Shared reading logic for both the real input and the sample button
    function readCaseFile(fileObject) {
        // ── MIME type check before attempting to read ──
        // A MIME type identifies the file's general category/format.
        try {
            if (fileObject.type !== "text/plain" && fileObject.type !== "") {
                throw "Please choose a plain text (.txt) file.";
            }
        } catch (error) {
            infoOutput.textContent = "❌ " + error;
            contentOutput.textContent = "(nothing loaded)";
            return;
        }

        infoOutput.textContent =
            "File object properties:\n" +
            "  name: \"" + fileObject.name + "\"\n" +
            "  size: " + fileObject.size + " bytes\n" +
            "  type: \"" + (fileObject.type || "(unknown)") + "\"\n\n" +
            "Reading file contents...";

        // ── FileReader: reads the file asynchronously ──
        let reader = new FileReader();

        // These fire in sequence as the file is read. For a small text
        // file most of these happen almost instantly, but the pattern
        // matters for larger files where reading takes real time.
        reader.onloadstart = function () {
            console.log("FileReader event: loadstart - reading begins");
        };

        reader.onprogress = function () {
            console.log("FileReader event: progress - data is being read");
        };

        reader.onload = function () {
            // reader.result now contains the file's full text content
            console.log("FileReader event: load - reading finished successfully");
            contentOutput.textContent = reader.result;
            infoOutput.textContent += "\n\n✓ File read successfully. See console for the full event sequence.";
        };

        reader.onerror = function () {
            console.log("FileReader event: error - reading failed");
            contentOutput.textContent = "Error reading file.";
        };

        reader.onloadend = function () {
            console.log("FileReader event: loadend - reading complete (success or failure)");
        };

        // readAsText() kicks off the asynchronous read
        reader.readAsText(fileObject);
    }
}

// ============================================================
// SECTION 2 - STRING METHODS
// Concepts: length, indexOf/includes, trim/case conversion,
//           slice/substring, split, concat/repeat, localeCompare
// ============================================================
function setupStringMethods() {
    let textarea = document.getElementById("statementText");
    let output = document.getElementById("stringOutput");

    document.getElementById("btnStringLength").addEventListener("click", function () {
        let text = textarea.value;
        output.textContent =
            "statement.length: " + text.length + " characters\n" +
            "(includes the leading/trailing spaces currently in the textarea)";
    });

    document.getElementById("btnStringSearch").addEventListener("click", function () {
        let text = textarea.value;

        // indexOf returns the position of the first match, or -1
        let index = text.indexOf("bakery");
        // includes returns a simple true/false
        let hasCoat = text.includes("coat");
        let hasReceipt = text.includes("receipt");

        output.textContent =
            "text.indexOf(\"bakery\"): " + index +
            (index === -1 ? " (not found)" : " (found at that position)") + "\n" +
            "text.includes(\"coat\"): " + hasCoat + "\n" +
            "text.includes(\"receipt\"): " + hasReceipt + "\n\n" +
            "Note: indexOf/includes are case-sensitive - \"Bakery\" would\n" +
            "not match \"bakery\" unless the text is lowercased first.";
    });

    document.getElementById("btnStringClean").addEventListener("click", function () {
        let original = textarea.value;

        // Strings are IMMUTABLE - trim() and toLowerCase() each return
        // a brand-new string. The original textarea value is untouched
        // unless we explicitly write the result back into it.
        let cleaned = original.trim().toLowerCase();

        output.textContent =
            "Original (length " + original.length + "): \"" + original + "\"\n\n" +
            "original.trim().toLowerCase()\n" +
            "Cleaned (length " + cleaned.length + "): \"" + cleaned + "\"\n\n" +
            "The original variable is unchanged - trim()/toLowerCase()\n" +
            "returned NEW strings; nothing was modified in place.";
    });

    document.getElementById("btnStringSlice").addEventListener("click", function () {
        let text = textarea.value.trim();

        // slice(start, end) - end index NOT included; negative counts from the end
        let firstWord = text.slice(0, 3);
        let lastFive = text.slice(-5);

        // substring(start, end) - similar, but swaps reversed args instead
        // of treating negatives as "from the end"
        let subExample = text.substring(4, 13);

        output.textContent =
            "text.slice(0, 3):   \"" + firstWord + "\"  (first 3 characters)\n" +
            "text.slice(-5):     \"" + lastFive + "\"  (last 5 characters, negative index)\n" +
            "text.substring(4, 13): \"" + subExample + "\"\n\n" +
            "slice() and substring() behave the same for normal positive\n" +
            "indexes - they diverge only with negative or reversed arguments.";
    });

    document.getElementById("btnStringSplit").addEventListener("click", function () {
        // Build a comma-separated version of the statement for a clean split demo
        let sample = "Coat,Watch,Ledger,Footprint";
        let parts = sample.split(",");

        output.textContent =
            "\"" + sample + "\".split(\",\")\n\n" +
            "Result (array of " + parts.length + " items):\n" +
            parts.map(function (p, i) { return "  [" + i + "] \"" + p + "\""; }).join("\n");
    });

    document.getElementById("btnStringConcatRepeat").addEventListener("click", function () {
        // concat() joins strings - equivalent to + but as an explicit method
        let combined = "Case ".concat("File #", "0714");

        // repeat() returns the string repeated n times
        let divider = "-".repeat(30);

        output.textContent =
            "\"Case \".concat(\"File #\", \"0714\"):\n  \"" + combined + "\"\n\n" +
            "\"-\".repeat(30):\n  \"" + divider + "\"\n\n" +
            "(concat() is rarely used over + in modern code, but works identically.)";
    });

    document.getElementById("btnLocaleCompare").addEventListener("click", function () {
        let nameA = "Marlowe";
        let nameB = "Archer";

        // localeCompare returns negative/zero/positive based on sort order
        let result = nameA.localeCompare(nameB);

        // Plain === comparison for contrast - lexicographical, Unicode-based
        let strictEqual = (nameA === nameB);

        output.textContent =
            "\"" + nameA + "\".localeCompare(\"" + nameB + "\"): " + result + "\n" +
            "  (" + (result < 0 ? nameA + " sorts BEFORE " + nameB
                : result > 0 ? nameA + " sorts AFTER " + nameB
                    : "equal") + ")\n\n" +
            "\"" + nameA + "\" === \"" + nameB + "\": " + strictEqual + "\n" +
            "(=== only tells you equal or not - localeCompare tells you ORDER.)";
    });
}

// ============================================================
// SECTION 3 - REGEX BASICS
// Concepts: anchors (^  $), flags (g, i), character classes/types
//           (\d \w \s \b [abc]), quantifiers (* + ? {n} {n,} {n,m}),
//           escape sequences, alternation (|) and grouping
// ============================================================
function setupRegexBasics() {
    let input = document.getElementById("patternTestInput");
    let output = document.getElementById("regexBasicsOutput");

    document.getElementById("btnTestAnchors").addEventListener("click", function () {
        let text = input.value;
        // ^Case anchors the match to the very START of the string
        let pattern = /^Case/;
        let matches = pattern.test(text);

        output.textContent =
            "Pattern: /^Case/\n" +
            "Test string: \"" + text + "\"\n\n" +
            "^Case anchors the match to the START of the string.\n" +
            "pattern.test(text): " + matches;
    });

    document.getElementById("btnTestFlags").addEventListener("click", function () {
        let text = input.value;
        // g = global (find every match), i = case-insensitive
        let pattern = /suspect/gi;
        let matches = text.match(pattern);

        output.textContent =
            "Pattern: /suspect/gi\n" +
            "Test string: \"" + text + "\"\n\n" +
            "g flag: finds every occurrence, not just the first\n" +
            "i flag: matches regardless of upper/lower case\n\n" +
            "text.match(pattern): " + (matches ? JSON.stringify(matches) : "null (no match)");
    });

    document.getElementById("btnTestCharClass").addEventListener("click", function () {
        let text = input.value;
        // [A-Z] matches any single uppercase letter (a character class range)
        let pattern = /[A-Z]/g;
        let matches = text.match(pattern);

        output.textContent =
            "Pattern: /[A-Z]/g\n" +
            "Test string: \"" + text + "\"\n\n" +
            "[A-Z] is a character class - matches any ONE uppercase letter.\n\n" +
            "text.match(pattern): " + (matches ? JSON.stringify(matches) : "null") +
            "\nTotal uppercase letters found: " + (matches ? matches.length : 0);
    });

    document.getElementById("btnTestQuantifier").addEventListener("click", function () {
        let text = input.value;
        // \d{4} matches exactly 4 digits in a row
        let pattern = /\d{4}/;
        let match = text.match(pattern);

        output.textContent =
            "Pattern: /\\d{4}/\n" +
            "Test string: \"" + text + "\"\n\n" +
            "\\d{4} means exactly 4 digit characters in a row.\n\n" +
            "text.match(pattern): " + (match ? "\"" + match[0] + "\" at index " + match.index : "null (no match)");
    });

    document.getElementById("btnTestEscape").addEventListener("click", function () {
        let text = input.value;
        // The hyphen (-) has no special regex meaning outside [], so it
        // doesn't strictly need escaping, but \- is shown here to
        // illustrate the ESCAPE SEQUENCE concept explicitly for class.
        let pattern = /Case\-\d+/;
        let match = text.match(pattern);

        output.textContent =
            "Pattern: /Case\\-\\d+/\n" +
            "Test string: \"" + text + "\"\n\n" +
            "\\- treats the hyphen as a LITERAL character to match\n" +
            "(escape sequences matter most for symbols like . $ ^ that\n" +
            " otherwise have special regex meaning).\n\n" +
            "text.match(pattern): " + (match ? "\"" + match[0] + "\"" : "null (no match)");
    });

    document.getElementById("btnTestAlternation").addEventListener("click", function () {
        let text = input.value;
        // | means "or" - matches ANY of the alternatives listed
        let pattern = /open|closed|cold/i;
        let match = text.match(pattern);

        output.textContent =
            "Pattern: /open|closed|cold/i\n" +
            "Test string: \"" + text + "\"\n\n" +
            "| specifies alternate patterns - matches if ANY one is present.\n\n" +
            "text.match(pattern): " + (match ? "\"" + match[0] + "\" matched" : "null (none of the three found)") +
            "\n\nTry typing \"cold case\" into the test string above and clicking again.";
    });
}

// ============================================================
// SECTION 4 - REGEX PROGRAMMING
// Concepts: the RegExp() constructor (for dynamically built patterns),
//           replace() for redaction, split() with a regex separator,
//           referencing group matches via RegExp.$1 / $2 / $3
// ============================================================
function setupRegexProgramming() {
    // ── Redaction: RegExp constructor built from user-entered terms ──
    document.getElementById("btnRedact").addEventListener("click", function () {
        let statement = document.getElementById("statementText").value;
        let termsRaw = document.getElementById("redactTermsInput").value;
        let output = document.getElementById("redactOutput");

        // Split the comma-separated input into individual terms, trimmed
        let terms = termsRaw.split(",").map(function (t) { return t.trim(); }).filter(Boolean);

        if (terms.length === 0) {
            output.textContent = "Enter at least one term to redact.";
            return;
        }

        let redacted = statement;
        let log = "";

        // Loop through each term, building a NEW RegExp per term since
        // the pattern text itself comes from a variable, not a fixed
        // literal - this is exactly the guide's use case for RegExp().
        terms.forEach(function (term) {
            // \b = word boundary, so "bakery" doesn't accidentally match
            // inside a longer word like "bakeryware". g = replace ALL
            // occurrences, not just the first. i = case-insensitive.
            let wordPattern = new RegExp("\\b" + term + "\\b", "gi");
            let beforeCount = (redacted.match(wordPattern) || []).length;

            redacted = redacted.replace(wordPattern, "[REDACTED]");
            log += "  Replaced " + beforeCount + " occurrence(s) of \"" + term + "\"\n";
        });

        output.textContent =
            "Original:\n  " + statement + "\n\n" +
            "Redaction log:\n" + log + "\n" +
            "Result:\n  " + redacted;
    });

    // ── split() using a regex separator ──
    document.getElementById("btnRegexSplit").addEventListener("click", function () {
        let sample = document.getElementById("splitSampleInput").value;
        let output = document.getElementById("regexSplitOutput");

        // /,\s*/ splits on a comma followed by ANY amount of whitespace
        // (zero or more) - far more flexible than splitting on a fixed
        // string like ", " which would fail on irregular spacing.
        let items = sample.split(/,\s*/);

        output.textContent =
            "\"" + sample + "\".split(/,\\s*/)\n\n" +
            "Result:\n" +
            items.map(function (item, i) { return "  [" + i + "] \"" + item + "\""; }).join("\n");
    });

    // ── Referencing group matches with RegExp.$1, $2, $3 ──
    document.getElementById("btnExtractGroups").addEventListener("click", function () {
        let text = document.getElementById("caseNumberInput").value;
        let output = document.getElementById("groupsOutput");

        // Parentheses create GROUPS. Each group's matched text becomes
        // available afterward through RegExp.$1, RegExp.$2, etc.,
        // numbered left to right by the order the groups open.
        let caseNumberPattern = /Case-(\d{4})-(\d{4})/;
        let didMatch = caseNumberPattern.test(text);

        if (didMatch) {
            output.textContent =
                "Pattern: /Case-(\\d{4})-(\\d{4})/\n" +
                "Test string: \"" + text + "\"\n\n" +
                "caseNumberPattern.test(text): true\n\n" +
                "RegExp.$1 (year group):  \"" + RegExp.$1 + "\"\n" +
                "RegExp.$2 (number group): \"" + RegExp.$2 + "\"";
        } else {
            output.textContent =
                "Pattern: /Case-(\\d{4})-(\\d{4})/\n" +
                "Test string: \"" + text + "\"\n\n" +
                "No match - expected a format like \"Case-2026-0714\".";
        }
    });
}

// ============================================================
// SECTION 5 - ARRAY METHODS
// Concepts: sort() default (lexicographical) vs. compare function,
//           reverse(), slice() (non-destructive) vs. splice()
//           (destructive), stack (push/pop) vs. queue (unshift/shift)
// ============================================================
function setupArrayMethods() {
    let output = document.getElementById("evidenceOutput");

    function renderEvidence(list) {
        return list.map(function (item, i) {
            return "  [" + i + "] " + item[0] + " - " + item[1] + "g";
        }).join("\n");
    }

    document.getElementById("btnShowEvidence").addEventListener("click", function () {
        output.textContent = "Current evidence log:\n" + renderEvidence(evidenceLog);
    });

    document.getElementById("btnSortAlpha").addEventListener("click", function () {
        // sort() with NO compare function sorts by converting elements
        // to strings and comparing lexicographically. On an array of
        // ARRAYS, this compares the whole stringified pair, but for our
        // purposes it still demonstrates default alphabetical-ish ordering
        // when we sort just the item names.
        let names = evidenceLog.map(function (item) { return item[0]; });
        names.sort(); // default: lexicographical order

        output.textContent =
            "names.sort() - no compare function, lexicographical order:\n" +
            names.map(function (n, i) { return "  [" + i + "] " + n; }).join("\n");
    });

    document.getElementById("btnSortWeight").addEventListener("click", function () {
        // Sorting NUMBERS (or arrays by a numeric field) REQUIRES a
        // compare function - otherwise sort() would compare the weight
        // values as TEXT, putting "890" before "62" the wrong way.
        evidenceLog.sort(function (a, b) {
            return a[1] - b[1]; // ascending by weight (index 1 of each pair)
        });

        output.textContent =
            "evidenceLog.sort(function(a, b) { return a[1] - b[1]; })\n" +
            "Sorted ascending by weight:\n" + renderEvidence(evidenceLog) + "\n\n" +
            "Without the compare function, sort() would have compared\n" +
            "weights as TEXT - \"890\" would incorrectly sort before \"62\".";
    });

    document.getElementById("btnReverseEvidence").addEventListener("click", function () {
        // reverse() flips the array in place, front to back
        evidenceLog.reverse();
        output.textContent = "evidenceLog.reverse():\n" + renderEvidence(evidenceLog);
    });

    // ── slice() vs. splice() ──
    let sliceSpliceOutput = document.getElementById("sliceSpliceOutput");

    document.getElementById("btnSliceEvidence").addEventListener("click", function () {
        // slice(start, end) returns a NEW array - the original is untouched
        let firstTwo = evidenceLog.slice(0, 2);

        sliceSpliceOutput.textContent =
            "evidenceLog.slice(0, 2) - NON-destructive:\n" +
            renderEvidence(firstTwo) + "\n\n" +
            "Original evidenceLog is UNCHANGED (still " + evidenceLog.length + " items).";
    });

    document.getElementById("btnSpliceEvidence").addEventListener("click", function () {
        // splice(start, deleteCount, ...itemsToInsert) MODIFIES the
        // original array directly and returns the removed elements
        let removed = evidenceLog.splice(1, 1, ["Fingerprint Kit", 210]);

        sliceSpliceOutput.textContent =
            "evidenceLog.splice(1, 1, [\"Fingerprint Kit\", 210]) - DESTRUCTIVE:\n" +
            "Removed: " + JSON.stringify(removed) + "\n\n" +
            "evidenceLog is now modified in place:\n" + renderEvidence(evidenceLog);
    });

    document.getElementById("btnResetEvidence").addEventListener("click", function () {
        // Restore the original array contents for a clean re-demo
        evidenceLog = ORIGINAL_EVIDENCE_LOG.map(function (item) { return item.slice(); });
        sliceSpliceOutput.textContent = "Evidence log reset to original order and contents.";
        output.textContent = "Evidence log reset.";
    });

    // ── Stack (LIFO) vs. Queue (FIFO) ──
    let stackDisplay = document.getElementById("stackDisplay");
    let queueDisplay = document.getElementById("queueDisplay");

    function renderStackQueue() {
        stackDisplay.innerHTML = caseStack.map(function (c) {
            return "<div class='sq-item'>" + c + "</div>";
        }).join("");
        queueDisplay.innerHTML = caseQueue.map(function (c) {
            return "<div class='sq-item'>" + c + "</div>";
        }).join("");
    }

    document.getElementById("btnStackPush").addEventListener("click", function () {
        caseCounter++;
        // push() adds to the END of the array - the "top" of a stack
        caseStack.push("Case #" + caseCounter);
        renderStackQueue();
    });

    document.getElementById("btnStackPop").addEventListener("click", function () {
        if (caseStack.length === 0) { return; }
        // pop() removes and returns the LAST element - LIFO: the most
        // recently filed case is the first one handled
        let handled = caseStack.pop();
        alert("Handling (LIFO): " + handled);
        renderStackQueue();
    });

    document.getElementById("btnQueueUnshift").addEventListener("click", function () {
        caseCounter++;
        // unshift() adds to the FRONT of the array
        caseQueue.unshift("Case #" + caseCounter);
        renderStackQueue();
    });

    document.getElementById("btnQueueShift").addEventListener("click", function () {
        if (caseQueue.length === 0) { return; }
        // shift() removes and returns the FIRST element - FIFO: the
        // earliest filed case is the first one handled
        let handled = caseQueue.shift();
        alert("Handling (FIFO): " + handled);
        renderStackQueue();
    });
}

// ============================================================
// SECTION 6 - MATH OBJECT
// Concepts: round/floor/ceil/abs/pow/sqrt/max/min, the spread
//           operator with Math.max/min, Math.random() for IDs
//           and for shuffling an array
// ============================================================
function setupMathObject() {
    // Display the current evidence weights near the spread-operator demo
    document.getElementById("weightsList").textContent =
        "[" + evidenceLog.map(function (item) { return item[1]; }).join(", ") + "]";

    document.getElementById("btnMathBasics").addEventListener("click", function () {
        let value = Number(document.getElementById("mathTestInput").value);
        let output = document.getElementById("mathBasicsOutput");

        if (isNaN(value)) {
            output.textContent = "Enter a valid number first.";
            return;
        }

        // The Math object is used directly - never instantiated with "new"
        output.textContent =
            "Math.round(" + value + "): " + Math.round(value) + "\n" +
            "Math.floor(" + value + "): " + Math.floor(value) + "\n" +
            "Math.ceil(" + value + "):  " + Math.ceil(value) + "\n" +
            "Math.abs(-" + value + "): " + Math.abs(-value) + "\n" +
            "Math.pow(" + value + ", 2): " + Math.pow(value, 2) + "\n" +
            "Math.sqrt(" + value + "): " + Math.sqrt(Math.abs(value)).toFixed(4) + "\n" +
            "Math.PI: " + Math.PI;
    });

    document.getElementById("btnMathSpread").addEventListener("click", function () {
        let weights = evidenceLog.map(function (item) { return item[1]; });
        let output = document.getElementById("mathSpreadOutput");

        // Math.max/min normally take individual arguments, not an array.
        // The spread operator (...) expands the array into a
        // comma-separated argument list on the fly.
        let heaviest = Math.max(...weights);
        let lightest = Math.min(...weights);

        // Find which item that weight belongs to
        let heaviestItem = evidenceLog.find(function (item) { return item[1] === heaviest; });
        let lightestItem = evidenceLog.find(function (item) { return item[1] === lightest; });

        output.textContent =
            "Math.max(...weights): " + heaviest + "g  (" + heaviestItem[0] + ")\n" +
            "Math.min(...weights): " + lightest + "g  (" + lightestItem[0] + ")\n\n" +
            "The spread operator expanded [" + weights.join(", ") + "]\n" +
            "into individual arguments - Math.max/min can't accept an array directly.";
    });

    document.getElementById("btnRandomId").addEventListener("click", function () {
        let output = document.getElementById("randomIdOutput");

        // Math.random() returns a decimal between 0 (inclusive) and 1 (exclusive)
        // Combined with Math.floor(), it produces a random whole number
        // in a chosen range - here, a 4-digit case ID from 1000-9999.
        let randomId = Math.floor(Math.random() * 9000) + 1000;

        output.textContent =
            "Math.floor(Math.random() * 9000) + 1000\n" +
            "Generated Case ID: CASE-" + randomId + "\n\n" +
            "(Math.random() alone gave a decimal like 0." +
            Math.floor(Math.random() * 999999) + " - floor() and the\n" +
            "multiply/add combination shape it into a usable ID range.)";
    });

    document.getElementById("btnShuffle").addEventListener("click", function () {
        let output = document.getElementById("shuffleOutput");

        // A compare function returning a random positive/negative value
        // shuffles the array - sort() doesn't know or care that the
        // "comparison" is random rather than consistent.
        evidenceLog.sort(function () {
            return Math.random() - 0.5;
        });

        output.textContent =
            "evidenceLog.sort(function() { return Math.random() - 0.5; })\n\n" +
            "New order:\n" +
            evidenceLog.map(function (item, i) {
                return "  [" + i + "] " + item[0] + " - " + item[1] + "g";
            }).join("\n");
    });
}

// ============================================================
// SECTION 7 - DATE OBJECT
// Concepts: new Date(), get*() methods, date subtraction for
//           elapsed time, set*() methods, toLocaleDateString()
// ============================================================
function setupDateObject() {
    // caseOpenedDate is stored at module scope so later buttons
    // (date parts, follow-up scheduling) can reuse the same stamp
    let caseOpenedDate = null;

    document.getElementById("btnCaseOpened").addEventListener("click", function () {
        // new Date() with no arguments captures the current date and time
        caseOpenedDate = new Date();
        let output = document.getElementById("dateStampOutput");

        output.textContent =
            "caseOpenedDate = new Date()\n\n" +
            "toString():          " + caseOpenedDate.toString() + "\n" +
            "toLocaleDateString(): " + caseOpenedDate.toLocaleDateString("en-US") + "\n" +
            "getTime() (ms since 1970): " + caseOpenedDate.getTime();
    });

    document.getElementById("btnDateParts").addEventListener("click", function () {
        let output = document.getElementById("datePartsOutput");

        if (!caseOpenedDate) {
            output.textContent = "Click \"Stamp Case Opened\" first.";
            return;
        }

        let weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        output.textContent =
            "getFullYear(): " + caseOpenedDate.getFullYear() + "\n" +
            "getMonth():    " + caseOpenedDate.getMonth() +
            "  (zero-based - " + (caseOpenedDate.getMonth() + 1) + " is the real month number)\n" +
            "getDate():     " + caseOpenedDate.getDate() + "  (day of month)\n" +
            "getDay():      " + caseOpenedDate.getDay() +
            "  (" + weekdayNames[caseOpenedDate.getDay()] + ")\n" +
            "getHours():    " + caseOpenedDate.getHours() + "\n" +
            "getMinutes():  " + caseOpenedDate.getMinutes();
    });

    document.getElementById("btnElapsed").addEventListener("click", function () {
        let filedDateStr = document.getElementById("filedDateInput").value;
        let output = document.getElementById("elapsedOutput");

        // Parse "YYYY-MM-DD" into a Date. Splitting manually avoids
        // timezone parsing quirks with new Date("2026-06-01") directly.
        let parts = filedDateStr.split("-");
        if (parts.length !== 3) {
            output.textContent = "Enter a date as YYYY-MM-DD.";
            return;
        }

        // Month is zero-based in the Date constructor, so subtract 1
        let filedDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        let today = new Date();

        // Because Date objects are stored as milliseconds since 1970,
        // subtracting two dates gives a plain number: the millisecond
        // difference between them.
        let millisecondsElapsed = today - filedDate;
        let daysElapsed = Math.floor(millisecondsElapsed / (1000 * 60 * 60 * 24));

        output.textContent =
            "filedDate: " + filedDate.toLocaleDateString("en-US") + "\n" +
            "today:     " + today.toLocaleDateString("en-US") + "\n\n" +
            "today - filedDate = " + millisecondsElapsed + " milliseconds\n" +
            "Math.floor(ms / (1000*60*60*24)) = " + daysElapsed + " days elapsed";
    });

    document.getElementById("btnScheduleFollowUp").addEventListener("click", function () {
        let output = document.getElementById("followUpOutput");

        if (!caseOpenedDate) {
            output.textContent = "Click \"Stamp Case Opened\" first (Date Object section above).";
            return;
        }

        // Clone the case-opened date so we don't mutate the original
        let followUpDate = new Date(caseOpenedDate.getTime());

        // setDate() changes just the day-of-month component. Passing a
        // value beyond the current month's length (like +30) correctly
        // ROLLS OVER into the next month - Date objects handle that math.
        followUpDate.setDate(followUpDate.getDate() + 30);

        output.textContent =
            "followUpDate = new Date(caseOpenedDate.getTime())  // clone\n" +
            "followUpDate.setDate(followUpDate.getDate() + 30)\n\n" +
            "Case opened:  " + caseOpenedDate.toLocaleDateString("en-US") + "\n" +
            "Follow-up due: " + followUpDate.toLocaleDateString("en-US") + "\n\n" +
            "(setDate() automatically rolled into the next month if needed -\n" +
            " no manual month/year math required.)";
    });
}

// ============================================================
// SECTION 8 - TEMPLATE LITERALS
// Concepts: backtick strings, ${placeholder} substitutions,
//           multiline strings, a tagged template literal function
// ============================================================
function setupTemplateLiterals() {
    document.getElementById("btnGenerateReport").addEventListener("click", function () {
        let caseNumber = document.getElementById("reportCaseNumber").value;
        let detective = document.getElementById("reportDetective").value;
        let status = document.getElementById("reportStatus").value;
        let today = new Date().toLocaleDateString("en-US");

        // A template literal (backticks) supports multiline text AND
        // ${expression} placeholders evaluated automatically - no +
        // concatenation needed, and quotes inside don't need escaping.
        let report = `CASE REPORT
================================
Case Number:   ${caseNumber}
Lead Detective: ${detective}
Status:        ${status}
Report Date:   ${today}
================================
"All evidence has been logged and catalogued per department procedure."`;

        document.getElementById("reportOutput").textContent = report;
    });

    document.getElementById("btnTaggedReport").addEventListener("click", function () {
        let caseNumber = document.getElementById("reportCaseNumber").value;
        let detective = document.getElementById("reportDetective").value;
        let status = document.getElementById("reportStatus").value;

        // Calling the tag function generates the SAME report, but every
        // placeholder value gets wrapped in [ ] by the tag function below
        // before the final string is assembled.
        let taggedReport = redact`Case Number:   ${caseNumber}
Lead Detective: ${detective}
Status:        ${status}`;

        document.getElementById("taggedReportOutput").textContent = taggedReport;
    });

    // ── Tag function ──
    // When a template literal is "tagged" with a function name placed
    // right before it (no parentheses, no dot), JavaScript automatically
    // splits the literal into two pieces and passes BOTH to the function:
    //   textPieces    - the fixed text segments, as an array
    //   ...substitutions - every ${ } value, gathered via rest parameters
    function redact(textPieces, ...substitutions) {
        let result = "";

        // Weave the fixed text and the bracketed substitutions back
        // together manually, instead of letting the template literal
        // do it automatically - this is the whole point of tagging.
        for (let i = 0; i < substitutions.length; i++) {
            result += textPieces[i] + "[" + substitutions[i] + "]";
        }
        // One more fixed text piece always follows the last substitution
        result += textPieces[textPieces.length - 1];

        return result;
    }
}

// ============================================================
// FOOTER
// ============================================================
function updateFooter() {
    document.getElementById("archiveFooter").textContent =
        "The Archive - Guide 7: Manipulating Data in Strings, Arrays, and Other Objects";
}

"use strict";
/*
 * ============================================================
 * app.js — Summit Trailhead Guide 6 Demo
 * ============================================================
 * Linked from index.html with:
 *     <script src="app.js" defer></script>
 *
 * "use strict" applies to the whole file. "defer" guarantees the
 * DOM (including the <form>) is fully parsed before this runs.
 *
 * SECTION MAP:
 *   setupFormReferences()   — S1: document.forms, elements[], focus/blur/select
 *   setupSelectionLists()   — S2: single-select trail, multi-select gear
 *   setupOptionButtons()    — S3: radio group, querySelector(':checked'), for-loop
 *   setupFormatting()       — S4: toFixed(), toLocaleString()
 *   setupFormEvents()       — S5: change vs input, loop-attached listeners
 *   setupHiddenAndSubmit()  — S6: hidden field, submit()/reset()
 *   setupValidation()       — S7: checkValidity(), validity, setCustomValidity()
 *   setupRegexValidation()  — S8: phone & ZIP regex test()
 *   setupLuhnCheck()        — S9: checksum algorithm
 *   setupFullSubmitHandler()— S9/guide-level: submit event + preventDefault()
 * ============================================================
 */

// ── Data used across sections ───────────────────────────────────────
// Trail surcharges (Section 2) — kept in one place so both the
// "Read Selected Trail" button and the live total calculation
// (Section 5) use the same source of truth.
const TRAIL_SURCHARGES = {
    meadow: 0,
    ridge: 15,
    summit: 40
};

const BASE_PRICE_PER_CLIMBER = 35; // used in the live total calculation

document.addEventListener("DOMContentLoaded", function () {
    setupFormReferences();
    setupSelectionLists();
    setupOptionButtons();
    setupFormatting();
    setupFormEvents();
    setupHiddenAndSubmit();
    setupValidation();
    setupRegexValidation();
    setupLuhnCheck();
    setupFullSubmitHandler();
    updateFooter();
});

// ============================================================
// SECTION 1 — FORM ELEMENTS
// Concepts: document.forms, form.elements[], getElementById shortcut,
//           focus(), blur(), select()
// ============================================================
function setupFormReferences() {
    // ── Referencing the form two ways ──
    // By position in the forms collection (every <form> is auto-added)
    let formByIndex = document.forms[0];
    // By id — the preferred, more reliable approach
    let formById = document.getElementById("expeditionForm");

    // ── Referencing a field THROUGH the form's elements collection ──
    // form.elements["fieldName"] uses the field's name/id attribute
    let nameFieldViaElements = formById.elements["climberName"];
    // Shortcut: getElementById directly on the field's own id
    let nameFieldDirect = document.getElementById("climberName");

    let output = document.getElementById("elementsOutput");

    // ── focus() ──
    document.getElementById("btnFocusName").addEventListener("click", function () {
        // focus() moves the browser's input cursor to this control
        nameFieldViaElements.focus();
        output.textContent =
            "nameField.focus() called.\n" +
            "Referenced via: expeditionForm.elements[\"climberName\"]\n" +
            "document.forms[0] === document.getElementById(\"expeditionForm\"): " +
            (formByIndex === formById) + "\n" +
            "Cursor is now active in the Climber Name field.";
    });

    // ── blur() ──
    document.getElementById("btnBlurName").addEventListener("click", function () {
        // blur() removes focus — no control is active afterward
        nameFieldDirect.blur();
        output.textContent =
            "nameField.blur() called.\n" +
            "Referenced via: document.getElementById(\"climberName\") (shortcut)\n" +
            "Focus has been removed from the field.";
    });

    // ── select() ──
    document.getElementById("btnSelectName").addEventListener("click", function () {
        // select() highlights (selects) all text currently in the field —
        // useful for letting a user immediately retype a value
        nameFieldDirect.focus(); // select() works best paired with focus()
        nameFieldDirect.select();
        output.textContent =
            "nameField.select() called (after focus()).\n" +
            "All text in the Climber Name field is now highlighted,\n" +
            "ready to be replaced by typing.";
    });
}

// ============================================================
// SECTION 2 — SELECTION LISTS
// Concepts: selectedIndex, options[index].value, multi-select loop
//           reading the .selected property of each option
// ============================================================
function setupSelectionLists() {
    let trailSelect = document.getElementById("trailSelect");
    let gearList    = document.getElementById("gearList");

    // ── Single selection: trailSelect ──
    document.getElementById("btnCheckTrail").addEventListener("click", function () {
        // selectedIndex is the numeric position of the chosen <option>
        let chosenIndex = trailSelect.selectedIndex;
        // options[chosenIndex].value retrieves that option's value attribute
        let chosenValue = trailSelect.options[chosenIndex].value;
        let chosenText  = trailSelect.options[chosenIndex].text;

        let output = document.getElementById("trailOutput");

        if (chosenValue === "") {
            output.textContent =
                "trailSelect.selectedIndex: " + chosenIndex + "\n" +
                "trailSelect.value: \"\" (still on the placeholder option)\n\n" +
                "Nothing selected yet — choose a real trail from the list.";
            return;
        }

        let surcharge = TRAIL_SURCHARGES[chosenValue];

        output.textContent =
            "trailSelect.selectedIndex: " + chosenIndex + "\n" +
            "trailSelect.options[" + chosenIndex + "].value: \"" + chosenValue + "\"\n" +
            "trailSelect.options[" + chosenIndex + "].text:  \"" + chosenText + "\"\n\n" +
            "Surcharge for this trail: $" + surcharge.toFixed(2);
    });

    // ── Multiple selection: gearList ──
    document.getElementById("btnCheckGear").addEventListener("click", function () {
        let output = document.getElementById("gearOutput");

        // selectedIndex only reports ONE index — not enough for a
        // multi-select list. We must loop through every <option> and
        // check its individual .selected Boolean property.
        let chosenGear = [];
        let gearTotal  = 0;

        for (let i = 0; i < gearList.options.length; i++) {
            if (gearList.options[i].selected) {
                let optionEl = gearList.options[i];
                chosenGear.push(optionEl.text);
                // data-price is a custom data attribute read via .dataset
                gearTotal += Number(optionEl.dataset.price);
            }
        }

        if (chosenGear.length === 0) {
            output.textContent = "No gear selected. Hold Ctrl/Cmd and click to select multiple items.";
            return;
        }

        output.textContent =
            "Looped through gearList.options — " + gearList.options.length + " total options.\n\n" +
            "Selected items (" + chosenGear.length + "):\n" +
            chosenGear.map(function (name) { return "  - " + name; }).join("\n") +
            "\n\nGear subtotal: $" + gearTotal.toFixed(2) + "\n\n" +
            "(selectedIndex alone could not have reported this —\n" +
            " it only returns a single index.)";
    });
}

// ============================================================
// SECTION 3 — OPTION BUTTONS (RADIO)
// Concepts: querySelector(':checked') attribute selector,
//           equivalent for-loop with getElementsByName,
//           reading the associated <label> via .labels
// ============================================================
function setupOptionButtons() {
    let output = document.getElementById("radioOutput");

    // ── Approach 1: querySelector with a CSS attribute selector ──
    document.getElementById("btnCheckedQuery").addEventListener("click", function () {
        // :checked is a CSS pseudo-class; this grabs the ONE radio
        // button in the "experienceLevel" group that is currently checked
        let checkedButton = document.querySelector('input[name="experienceLevel"]:checked');

        // labels is a NodeList of every <label> associated with this input
        // (matched via the label's "for" attribute pointing to this id)
        let labelText = checkedButton.labels[0].textContent;

        output.textContent =
            "document.querySelector('input[name=\"experienceLevel\"]:checked')\n" +
            "  .value: \"" + checkedButton.value + "\"\n" +
            "  .id:    \"" + checkedButton.id + "\"\n" +
            "  .labels[0].textContent: \"" + labelText + "\"\n\n" +
            "One line, directly retrieves the checked button.";
    });

    // ── Approach 2: for-loop over getElementsByName ──
    document.getElementById("btnCheckedLoop").addEventListener("click", function () {
        // getElementsByName returns ALL radio buttons sharing that name —
        // we must loop and test each one's .checked property ourselves
        let buttons = document.getElementsByName("experienceLevel");
        let checkedValue = "";
        let checkedIndex = -1;

        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].checked) {
                checkedValue = buttons[i].value;
                checkedIndex = i;
            }
        }

        output.textContent =
            "document.getElementsByName(\"experienceLevel\") returned " +
            buttons.length + " buttons.\n" +
            "Looped through all " + buttons.length + " — found checked at index " +
            checkedIndex + "\n" +
            "  .value: \"" + checkedValue + "\"\n\n" +
            "More code than querySelector(':checked'), but shows exactly\n" +
            "how the browser determines which button is active.";
    });
}

// ============================================================
// SECTION 4 — FORMATTING DATA VALUES
// Concepts: toFixed(), toLocaleString() with currency style
// ============================================================
function setupFormatting() {
    document.getElementById("btnFormatValue").addEventListener("click", function () {
        let rawInput = document.getElementById("rawAmountInput").value;
        let output   = document.getElementById("formatOutput");

        let rawNumber = Number(rawInput);

        if (isNaN(rawNumber)) {
            output.textContent = "Enter a valid number first.";
            return;
        }

        // toFixed(2) rounds to 2 decimal places and returns a STRING
        let fixedResult = rawNumber.toFixed(2);

        // toLocaleString() formats per regional/currency conventions
        let currencyResult = rawNumber.toLocaleString("en-US", {
            style: "currency",
            currency: "USD"
        });

        // A locale WITHOUT currency — just grouped digits
        let plainLocale = rawNumber.toLocaleString("en-US");

        output.textContent =
            "Original value: " + rawNumber + "\n\n" +
            "rawNumber.toFixed(2):\n" +
            "  \"" + fixedResult + "\"  (string, rounded — not truncated)\n\n" +
            "rawNumber.toLocaleString(\"en-US\"):\n" +
            "  \"" + plainLocale + "\"  (grouped digits, no currency symbol)\n\n" +
            "rawNumber.toLocaleString(\"en-US\", {style:\"currency\", currency:\"USD\"}):\n" +
            "  \"" + currencyResult + "\"  (full currency formatting)";
    });
}

// ============================================================
// SECTION 5 — FORM EVENTS
// Concepts: change vs input timing, attaching one listener to
//           many elements with a loop over querySelectorAll
// ============================================================
function setupFormEvents() {
    // ── change vs input comparison ──
    let changeCount = 0;
    let inputCount  = 0;

    document.getElementById("changeDemoInput").addEventListener("change", function () {
        // "change" fires only after the value is modified AND the
        // field loses focus (click/tab away)
        changeCount++;
        document.getElementById("changeCount").textContent = "Fired: " + changeCount + " times";
    });

    document.getElementById("inputDemoInput").addEventListener("input", function () {
        // "input" fires immediately on every single keystroke
        inputCount++;
        document.getElementById("inputCount").textContent = "Fired: " + inputCount + " times";
    });

    // ── Loop-attached listeners for the live total ──
    // querySelectorAll grabs every relevant control inside the form at once.
    // Guide 5 pattern: one for loop attaches the SAME listener (updateLiveTotal)
    // to every matching element, rather than writing repetitive code per field.
    let formInputs = document.querySelectorAll(
        "#trailSelect, #gearList, #climberCount"
    );

    for (let i = 0; i < formInputs.length; i++) {
        formInputs[i].addEventListener("change", updateLiveTotal);
    }

    // Run once on load so the total isn't blank before any interaction
    updateLiveTotal();
}

// Calculates and displays the live order total.
// Also used by Section 6 to populate the hidden field before submit.
function updateLiveTotal() {
    let trailSelect  = document.getElementById("trailSelect");
    let gearList     = document.getElementById("gearList");
    let climberCount = Number(document.getElementById("climberCount").value) || 0;

    // Trail surcharge — 0 if nothing selected yet
    let trailValue = trailSelect.value;
    let trailSurcharge = TRAIL_SURCHARGES[trailValue] || 0;

    // Gear subtotal — loop through selected <option> elements
    let gearTotal = 0;
    for (let i = 0; i < gearList.options.length; i++) {
        if (gearList.options[i].selected) {
            gearTotal += Number(gearList.options[i].dataset.price);
        }
    }

    let orderTotal = (climberCount * BASE_PRICE_PER_CLIMBER) + trailSurcharge + gearTotal;

    // toLocaleString formats the running total as currency for display
    document.getElementById("liveTotalDisplay").textContent =
        orderTotal.toLocaleString("en-US", { style: "currency", currency: "USD" });

    return orderTotal; // returned so Section 6 can reuse this calculation
}

// ============================================================
// SECTION 6 — HIDDEN FIELDS & FORM SUBMISSION
// Concepts: reading/writing a hidden input's value,
//           form.submit(), form.reset()
// ============================================================
function setupHiddenAndSubmit() {
    let hiddenField = document.getElementById("calculatedTotal");
    let form = document.getElementById("expeditionForm");
    let output = document.getElementById("hiddenOutput");

    document.getElementById("btnShowHidden").addEventListener("click", function () {
        // Recalculate and store the value in the hidden field —
        // this is exactly what would happen right before a real submit
        let total = updateLiveTotal();
        hiddenField.value = total.toFixed(2);

        output.textContent =
            "Hidden field #calculatedTotal updated.\n" +
            "hiddenField.value = \"" + hiddenField.value + "\"\n\n" +
            "This field is type=\"hidden\" — never visible to the user,\n" +
            "but it WOULD be submitted along with the rest of the form data.\n" +
            "Check DevTools > Elements to see it in the actual DOM.";
    });

    document.getElementById("btnProgrammaticSubmit").addEventListener("click", function () {
        // form.submit() submits the form WITHOUT firing the "submit"
        // event and WITHOUT running native or custom validation.
        // We don't actually call it here (there's no real server to
        // receive it), but we show exactly what would happen.
        output.textContent =
            "form.submit() would run here.\n\n" +
            "IMPORTANT: submit() called this way BYPASSES both native\n" +
            "validation and any \"submit\" event listener (Section 9).\n" +
            "It sends the data immediately, no questions asked.\n\n" +
            "(Not actually calling it in this demo — there's no server\n" +
            " to receive the request. Compare this to the real Submit\n" +
            " button below, which DOES trigger validation.)";
    });

    document.getElementById("btnProgrammaticReset").addEventListener("click", function () {
        // form.reset() restores every control to its default value —
        // identical to a user clicking an <input type="reset"> button
        form.reset();
        updateLiveTotal(); // refresh the live total after the reset
        output.textContent =
            "form.reset() called.\n" +
            "Every field has been restored to its original default value,\n" +
            "the same as if the user clicked a Reset button.";
    });
}

// ============================================================
// SECTION 7 — VALIDATION (native + Constraint Validation API)
// Concepts: checkValidity(), the validity (ValidityState) object,
//           setCustomValidity(), validating a select left on default
// ============================================================
function setupValidation() {
    let emailField = document.getElementById("emailField");

    document.getElementById("btnCheckValidity").addEventListener("click", function () {
        let output = document.getElementById("validityOutput");

        // checkValidity() tests the field against its HTML constraint
        // attributes (required, type="email", etc.) and returns true/false
        let isValid = emailField.checkValidity();

        // The validity property exposes a ValidityState object with
        // several Boolean flags explaining WHY a field is invalid
        let state = emailField.validity;

        let report =
            "emailField.checkValidity(): " + isValid + "\n\n" +
            "ValidityState properties:\n" +
            "  valueMissing:    " + state.valueMissing + "\n" +
            "  typeMismatch:    " + state.typeMismatch + "\n" +
            "  tooShort:        " + state.tooShort + "\n" +
            "  tooLong:         " + state.tooLong + "\n" +
            "  valid:           " + state.valid + "\n\n";

        // Using the ValidityState flags to set a specific custom message
        if (state.valueMissing) {
            emailField.setCustomValidity("Please enter your email address.");
            report += "Custom message set: \"Please enter your email address.\"";
        } else if (state.typeMismatch) {
            emailField.setCustomValidity("That doesn't look like a valid email address.");
            report += "Custom message set: \"That doesn't look like a valid email address.\"";
        } else {
            // IMPORTANT: clearing with an empty string when the field IS valid.
            // Forgetting this line would leave the field permanently invalid
            // even after the user fixes it.
            emailField.setCustomValidity("");
            report += "Field is valid — setCustomValidity(\"\") clears any previous message.";
        }

        output.textContent = report;
    });

    // ── Validating a select list left on its placeholder ──
    document.getElementById("btnValidateTrail").addEventListener("click", function () {
        let trailSelect = document.getElementById("trailSelect");
        let output = document.getElementById("trailValidationOutput");

        // Native "required" on a <select> DOES catch an empty value in
        // most browsers, but checking .value === "" directly is more
        // explicit and works identically everywhere, including cases
        // where the placeholder option itself has a non-empty value.
        if (trailSelect.value === "") {
            trailSelect.setCustomValidity("Please choose a trail.");
            output.textContent =
                "trailSelect.value === \"\" — still on the placeholder option.\n" +
                "setCustomValidity(\"Please choose a trail.\") applied.\n" +
                "trailSelect.checkValidity(): " + trailSelect.checkValidity();
        } else {
            trailSelect.setCustomValidity("");
            output.textContent =
                "trailSelect.value: \"" + trailSelect.value + "\" — a real trail is selected.\n" +
                "setCustomValidity(\"\") clears any previous custom message.\n" +
                "trailSelect.checkValidity(): " + trailSelect.checkValidity();
        }
    });
}

// ============================================================
// SECTION 8 — REGULAR EXPRESSIONS
// Concepts: regex literal syntax, the .test() method,
//           combining multiple patterns with ||
// ============================================================
function setupRegexValidation() {
    // ── Phone number pattern ──
    document.getElementById("btnCheckPhone").addEventListener("click", function () {
        let phoneField = document.getElementById("phoneField");
        let output = document.getElementById("phoneOutput");

        // /^\d{3}-\d{3}-\d{4}$/ reads as:
        //   ^        start of string
        //   \d{3}    exactly 3 digits
        //   -        a literal hyphen
        //   \d{3}    exactly 3 more digits
        //   -        another literal hyphen
        //   \d{4}    exactly 4 digits
        //   $        end of string
        let phonePattern = /^\d{3}-\d{3}-\d{4}$/;

        if (phonePattern.test(phoneField.value)) {
            phoneField.setCustomValidity("");
            output.textContent =
                "phonePattern.test(\"" + phoneField.value + "\") -> true\n" +
                "Format matches 555-123-4567. Valid.";
        } else {
            phoneField.setCustomValidity("Enter a phone number as 555-123-4567.");
            output.textContent =
                "phonePattern.test(\"" + phoneField.value + "\") -> false\n" +
                "Custom message set: \"Enter a phone number as 555-123-4567.\"";
        }
    });

    // ── ZIP code — combining two patterns with || ──
    document.getElementById("btnCheckZip").addEventListener("click", function () {
        let zipField = document.getElementById("zipField");
        let output = document.getElementById("zipOutput");

        let fiveDigit = /^\d{5}$/;             // e.g. 63301
        let nineDigit = /^\d{5}-\d{4}$/;       // e.g. 63301-1234

        let matchesFive = fiveDigit.test(zipField.value);
        let matchesNine = nineDigit.test(zipField.value);

        if (matchesFive || matchesNine) {
            zipField.setCustomValidity("");
            output.textContent =
                "fiveDigit.test(): " + matchesFive + "\n" +
                "nineDigit.test(): " + matchesNine + "\n\n" +
                "At least one pattern matched — ZIP code accepted.";
        } else {
            zipField.setCustomValidity("Enter a 5-digit or 9-digit ZIP code.");
            output.textContent =
                "fiveDigit.test(): " + matchesFive + "\n" +
                "nineDigit.test(): " + matchesNine + "\n\n" +
                "Neither pattern matched.\n" +
                "Custom message set: \"Enter a 5-digit or 9-digit ZIP code.\"";
        }
    });
}

// ============================================================
// SECTION 9 — CUSTOM VALIDITY CHECK: THE LUHN ALGORITHM
// Concepts: checksum algorithms, a calculation-based validity
//           check that no HTML attribute alone could express
// ============================================================

// The Luhn (mod 10) algorithm: starting from the rightmost digit,
// every OTHER digit is doubled. If doubling produces a two-digit
// result, 9 is subtracted from it (equivalent to summing its digits).
// All digits are then summed; the number is valid only if that sum
// is evenly divisible by 10.
function passesLuhnCheck(cardNumber) {
    let sum = 0;
    let shouldDouble = false;

    // Walk the string from the LAST character to the FIRST
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = Number(cardNumber[i]);

        if (shouldDouble) {
            digit = digit * 2;
            if (digit > 9) {
                digit = digit - 9; // same result as adding the two digits together
            }
        }

        sum += digit;
        shouldDouble = !shouldDouble; // alternate every other digit
    }

    return (sum % 10 === 0);
}

function setupLuhnCheck() {
    document.getElementById("btnCheckLuhn").addEventListener("click", function () {
        let cardField = document.getElementById("cardField");
        let output = document.getElementById("luhnOutput");
        let cardValue = cardField.value.trim();

        // First confirm it's the right SHAPE (16 digits) before running
        // the checksum — a format check and a checksum check are two
        // different kinds of validation working together.
        if (!/^\d{16}$/.test(cardValue)) {
            cardField.setCustomValidity("Card number must be exactly 16 digits.");
            output.textContent =
                "Format check failed: \"" + cardValue + "\" is not 16 digits.\n" +
                "The Luhn checksum was not even run — format must pass first.";
            return;
        }

        // Format is correct — now run the mathematical checksum
        let isValid = passesLuhnCheck(cardValue);

        if (isValid) {
            cardField.setCustomValidity("");
            output.textContent =
                "Format check: PASSED (16 digits)\n" +
                "passesLuhnCheck(\"" + cardValue + "\"): true\n\n" +
                "✓ This number satisfies the Luhn checksum. Accepted.";
        } else {
            cardField.setCustomValidity("This card number doesn't look right. Please double-check it.");
            output.textContent =
                "Format check: PASSED (16 digits)\n" +
                "passesLuhnCheck(\"" + cardValue + "\"): false\n\n" +
                "✗ This number LOOKS like a card number but fails the\n" +
                "checksum math — likely a typo. A format check (regex)\n" +
                "alone could never have caught this; only the calculation can.";
        }
    });

    // ── The "invalid" event + preventDefault() ──
    // Fires automatically when the browser's own validation rejects
    // a field (for example, on form submit if "required" fails).
    // preventDefault() here stops the BROWSER's default invalid-field
    // bubble/tooltip so we can show our own styled message instead.
    let cardField = document.getElementById("cardField");
    cardField.addEventListener("invalid", function (event) {
        event.preventDefault(); // suppress the browser's default popup
        let output = document.getElementById("luhnOutput");
        output.textContent =
            "\"invalid\" event fired on cardField.\n" +
            "event.preventDefault() suppressed the browser's default\n" +
            "validation bubble — we control the message instead.";
    });
}

// ============================================================
// FULL SUBMIT HANDLER
// Concepts: the submit event, event.preventDefault(), running a
//           full validation suite before allowing real submission
// ============================================================
function setupFullSubmitHandler() {
    let form = document.getElementById("expeditionForm");
    let submitOutput = document.getElementById("submitOutput");

    // "submit" fires when the Submit button is clicked (or Enter is
    // pressed in a text field). Passing the function to addEventListener
    // means it automatically receives the event object as a parameter.
    form.addEventListener("submit", function (event) {
        let problems = [];

        // 1) Native constraint check on the whole form at once
        if (!form.checkValidity()) {
            problems.push("One or more required fields are missing or invalid (see red outlines).");
        }

        // 2) Custom check: trail select left on placeholder
        let trailSelect = document.getElementById("trailSelect");
        if (trailSelect.value === "") {
            problems.push("Please choose a trail.");
        }

        // 3) Custom check: phone format (only if something was entered)
        let phoneField = document.getElementById("phoneField");
        let phonePattern = /^\d{3}-\d{3}-\d{4}$/;
        if (phoneField.value !== "" && !phonePattern.test(phoneField.value)) {
            problems.push("Phone number must be formatted as 555-123-4567.");
        }

        // 4) Custom check: Luhn algorithm on the card number
        let cardField = document.getElementById("cardField");
        if (cardField.value !== "") {
            if (!/^\d{16}$/.test(cardField.value) || !passesLuhnCheck(cardField.value)) {
                problems.push("Card number failed validation (format or checksum).");
            }
        }

        if (problems.length > 0) {
            // event.preventDefault() blocks the browser's normal response
            // to this event — here, that means stopping the form from
            // actually submitting to a server.
            event.preventDefault();

            submitOutput.className = "output error-out";
            submitOutput.textContent =
                "🚫 Submission blocked — event.preventDefault() called.\n\n" +
                "Problems found:\n" +
                problems.map(function (p) { return "  • " + p; }).join("\n");
        } else {
            // All checks passed. Populate the hidden field one last time
            // right before the (simulated) submission.
            event.preventDefault(); // still prevented — no real server in this demo
            let total = updateLiveTotal();
            document.getElementById("calculatedTotal").value = total.toFixed(2);

            submitOutput.className = "output success-out";
            submitOutput.textContent =
                "✅ All validation passed! In a real app, the form would now\n" +
                "submit to a server with calculatedTotal = " +
                document.getElementById("calculatedTotal").value + "\n\n" +
                "(event.preventDefault() was still called here so this demo\n" +
                " doesn't try to submit to a real, nonexistent server.)";
        }
    });
}

// ============================================================
// FOOTER
// ============================================================
function updateFooter() {
    document.getElementById("trailheadFooter").textContent =
        "Summit Trailhead Demo — Guide 6: Enhancing and Validating Forms";
}

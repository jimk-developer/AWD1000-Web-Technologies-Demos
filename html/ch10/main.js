/*
  ============================================================
  GUIDE 10 DEMO: main.js
  ============================================================
  PURPOSE
    This file is the external JavaScript for the Prairie Bakery
    interactivity demo.  It demonstrates:
      - Variables (const and let)
      - Functions (defining and calling)
      - Arguments (passing data into functions)
      - if / else statements (making decisions)
      - Events (onclick, onmouseover, onmouseout, onchange, onload)
      - The Document Object Model: getElementById() and querySelector()
      - Changing element content: textContent and innerHTML
      - Changing element style: element.style.property
      - classList methods: toggle(), add(), remove()
      - The hamburger menu pattern

  HOW THIS FILE IS LINKED TO THE PAGE
    The last line of index.html's <body> is:
      <script src="main.js"></script>
    Placing the link at the BOTTOM ensures every HTML element
    exists in the DOM before any function runs.

  TEACHING NOTES
    Open this file alongside index.html and styles.css.
    Each function below corresponds to an interactive element
    on the page.  Walk through the functions in order as you
    demonstrate each section of the page.
  ============================================================
*/


/* ============================================================
   SECTION 1: CONSTANTS AND VARIABLES

   CONCEPT: Variables are named containers for values.
     const  - the value cannot be reassigned after creation
     let    - the value can be changed later

   CONCEPT: camelCase naming convention.
     JavaScript uses camelCase: first word lowercase, each
     additional word starts with a capital letter.
     Good: bakeryName, openingHour, menuIsOpen
     Bad:  BakeryName, opening_hour, menuisopen
   ============================================================ */

// const: this value never changes during the program's life
const BAKERY_NAME = "Prairie Bakery";

// Opening and closing hours stored as numbers (24-hour format)
// 7 = 7:00 AM, 14 = 2:00 PM
const OPENING_HOUR = 7;
const CLOSING_HOUR = 14;

// let: this CAN be changed later (see toggleMenu below)
let menuIsOpen = false;   // tracks whether the mobile nav is showing


/* ============================================================
   SECTION 2: THE onload FUNCTION (greetVisitor)

   CONCEPT: The onload event fires when the page finishes loading.
   In index.html the <body> tag has: onload="greetVisitor()"
   As soon as the page is ready, the browser calls this function.

   CONCEPT: alert() is a built-in JavaScript method.
   It pops up a simple dialog box with a message.
   It is useful for teaching because the output is impossible
   to miss, but real-world sites rarely use alert() for UX
   reasons.  console.log() is the professional alternative.
   ============================================================ */

function greetVisitor() {
    /*
        Get the current hour from the computer's clock.
        new Date() creates a Date object (more on objects below).
        .getHours() is a method that returns the current hour
        as a number from 0 (midnight) to 23 (11 PM).
    */
    let currentHour = new Date().getHours();

    // Choose the greeting based on the time of day
    let greeting;

    if (currentHour < 12) {
        greeting = "Good morning";
    } else if (currentHour < 17) {
        greeting = "Good afternoon";
    } else {
        greeting = "Good evening";
    }

    /*
        Template literals use backticks (`) instead of quotes.
        ${expression} inserts any JavaScript value into the string.
        This is cleaner than "Hello " + name + "!" concatenation.
    */
    alert(`${greeting}! Welcome to the ${BAKERY_NAME} demo.`);
}


/* ============================================================
   SECTION 3: VARIABLES AND FUNCTIONS DEMO (showSpecial)

   Called by the "See Today's Special" button in index.html:
     <button onclick="showSpecial()">See Today's Special</button>

   CONCEPT: const holds a value that never changes.
   CONCEPT: alert() displays the value to the visitor.
   ============================================================ */

function showSpecial() {
    // const: the special cannot be changed after this declaration
    const todaysSpecial = "Sourdough Country Loaf, baked fresh at 7 AM";


    // Display the value using alert()
    alert(`Today's special at ${BAKERY_NAME}: ${todaysSpecial}`);

    /*
        TEACHING POINT: Open the browser Console (F12) and try:
          console.log(todaysSpecial);
        console.log is the professional way to inspect values.
        It doesn't interrupt the user like alert() does.
    */
}


/* ============================================================
   SECTION 4: ARGUMENTS DEMO (orderItem)

   Called by two buttons in index.html, each passing a different
   argument:
     <button onclick="orderItem('Sourdough Loaf')">...</button>
     <button onclick="orderItem('Croissant')">...</button>

   CONCEPT: An argument is a value passed INTO a function.
   CONCEPT: A parameter is the variable that RECEIVES it inside
   the function definition.  Here, "itemName" is the parameter.

   Same function, different behavior depending on the argument.
   This is why functions with parameters are so powerful: one
   piece of code handles many situations.
   ============================================================ */

function orderItem(itemName) {
    /*
        itemName is a parameter, a local variable that only
        exists inside this function.  Its value comes from the
        argument passed in the onclick attribute.
    */

    // let: this could change (e.g., if we added a quantity input)
    let orderMessage = `You ordered: ${itemName}. Your order has been placed!`;

    alert(orderMessage);
}


/* ============================================================
   SECTION 5: if/else DEMO (checkHours)

   Called by the "Are You Open?" button in index.html.

   CONCEPT: if/else lets the program make decisions.
   Structure:
     if (condition) {
         // runs when condition is true
     } else if (otherCondition) {
         // runs when otherCondition is true
     } else {
         // runs when no condition above is true
     }

   CONCEPT: Comparison operators:
     >=   greater than or equal to
     <=   less than or equal to
     >    greater than
     <    less than
     ===  strictly equal (same value AND same type)
     !==  strictly NOT equal
   ============================================================ */

function checkHours() {
    // Get the current hour (0-23) from the system clock
    let currentHour = new Date().getHours();

    // Declare message variable first (we will assign it in the if/else)
    let message;

    if (currentHour >= OPENING_HOUR && currentHour < CLOSING_HOUR) {
        /*
            && is the AND operator.
            Both conditions must be true for this block to run:
              currentHour >= 7    (it is 7 AM or later)
              currentHour < 14    (it is before 2 PM)
        */
        message = `Yes, we are open! Come visit us.
We are open Tue-Sat, ${OPENING_HOUR} AM to ${CLOSING_HOUR - 12} PM.`;

    } else if (currentHour < OPENING_HOUR) {
        // It is before opening time
        message = `We are not open yet. We open at ${OPENING_HOUR} AM. Come back soon!`;

    } else {
        // It is after closing time
        message = `Sorry, we are closed for today. We open tomorrow at ${OPENING_HOUR} AM.`;
    }

    alert(message);
}


/* ============================================================
   SECTION 6: DOM DEMO (domDemo)

   Called by four buttons in index.html that each pass a
   different string argument: 'byId', 'byQuery', 'byStyle', 'reset'

   CONCEPT: The DOM (Document Object Model) is the browser's
   in-memory representation of the HTML page as a tree of objects.
   JavaScript uses DOM methods to find and modify those objects.

   The three most common ways to find an element:
     document.getElementById("id")       - returns ONE element
     document.querySelector("selector")  - returns the FIRST match
     document.querySelectorAll("sel")    - returns ALL matches (list)
   ============================================================ */

function domDemo(method) {

    // All three selectors below target the SAME paragraph element.
    // We just use different DOM methods to reach it.

    if (method === 'byId') {
        /*
            getElementById() finds the SINGLE element whose id
            attribute matches the string argument exactly.
            ids must be unique on a page, so this always returns
            exactly one element (or null if not found).
        */
        let target = document.getElementById("dom-output");

        // textContent replaces everything inside the element with plain text.
        target.textContent = "Found with getElementById('dom-output') ✓";

        // We can also change the appearance via the style object.
        target.style.color = "#107C10";  // green text
        target.style.fontWeight = "bold";

    } else if (method === 'byQuery') {
        /*
            querySelector() accepts any valid CSS selector string.
            It returns the FIRST element that matches.
            This is more flexible than getElementById because it
            accepts class selectors, attribute selectors, etc.

            "#dom-output" is the CSS selector for id="dom-output"
            (the # prefix means "id" in CSS).
        */
        let target = document.querySelector("#dom-output");

        target.textContent = "Found with querySelector('#dom-output') ✓";
        target.style.color = "#1A6B8A";   // teal text
        target.style.fontWeight = "bold";

    } else if (method === 'byStyle') {
        /*
            We can change any CSS property through element.style.
            Property names are camelCase in JavaScript:
              CSS: background-color  ->  JS: backgroundColor
              CSS: font-size         ->  JS: fontSize
              CSS: border-radius     ->  JS: borderRadius
        */
        let target = document.getElementById("dom-output");

        target.textContent = "Style changed via element.style ✓";

        target.style.color = "white";
        target.style.backgroundColor = "#8B1A1A";
        target.style.fontWeight = "bold";
        target.style.padding = "12px";
        target.style.borderRadius = "6px";

    } else if (method === 'reset') {
        /*
            Resetting: clear all inline styles and restore the
            original text.  Setting style properties to empty
            strings ("") removes the inline style, letting the
            stylesheet rules take over again.
        */
        let target = document.getElementById("dom-output");

        target.textContent = "Click a button above to change this text using JavaScript.";

        target.style.color = "";
        target.style.backgroundColor = "";
        target.style.fontWeight = "";
        target.style.padding = "";
        target.style.borderRadius = "";
    }
}


/* ============================================================
   SECTION 7: EVENT LOG (logEvent)

   Called by three different event handler types in index.html:
     - onclick on the button
     - onmouseover / onmouseout on the hover box
     - onchange on the dropdown

   CONCEPT: Events are things that happen on the page.
   An event handler is the code that runs in response.

   This function writes a timestamped entry into the event log
   <div id="event-log"> that sits on the page.  This shows
   that JavaScript can update the page live without reloading.

   CONCEPT: innerHTML lets us insert HTML (not just text).
   Here we wrap each entry in a <p> tag for styling.
   ============================================================ */

function logEvent(eventDescription) {
    /*
        Find the event log container.
        We will prepend new entries to the top so the most
        recent event always appears first.
    */
    let logEl = document.getElementById("event-log");

    // Get the current time as a formatted string (e.g., "09:41:05")
    let now = new Date();
    let timeString = now.toLocaleTimeString();   // "H:MM:SS AM/PM"

    /*
        Build the HTML for the new log entry.
        We use a template literal to embed the variables.
        The <p class="log-entry"> matches a style in styles.css.
    */
    let newEntry = `<p class="log-entry">[${timeString}] ${eventDescription}</p>`;

    /*
        innerHTML gets or sets the HTML content of an element.
        We PREPEND the new entry before the existing content.
        logEl.innerHTML contains all the existing entries.
        We put newEntry FIRST so it appears at the top.
    */
    logEl.innerHTML = newEntry + logEl.innerHTML;

    /*
        Remove the placeholder text on the first event.
        querySelector returns null if the element is not found,
        so we check before trying to remove it.
    */
    let placeholder = logEl.querySelector(".log-placeholder");
    if (placeholder !== null) {
        placeholder.remove();
    }
}


/* ============================================================
   SECTION 8: HAMBURGER MENU (toggleMenu)

   Called by the hamburger <button> in index.html:
     <button onclick="toggleMenu()" ...>

   CONCEPT: classList is a built-in property on every DOM element.
   It represents the element's class attribute as a list of
   class names.  It has three useful methods:
     .add("name")    - adds a class if it isn't there
     .remove("name") - removes a class if it is there
     .toggle("name") - adds if missing, removes if present

   The hamburger pattern needs THREE parts:
     1. HTML: button with onclick, nav with an id
     2. CSS:  nav hidden by default; nav.open shown
     3. JS:   this function that toggles the .open class
   ============================================================ */

function toggleMenu() {
    /*
        Find the two elements we need to update:
          - the <nav> element (to show/hide the links)
          - the hamburger button (to animate the bars into an X)
    */
    let nav = document.getElementById("main-nav");
    let btn = document.getElementById("hamburger-btn");

    /*
        classList.toggle("open") is the key line.
        First click:  "open" is NOT on nav -> adds it -> nav shows
        Second click: "open" IS on nav     -> removes it -> nav hides
        Third click:  adds it again, and so on...

        CSS in styles.css has:
          nav { display: none; }          <- hidden by default on mobile
          nav.open { display: flex; }     <- shown when .open is present
    */
    nav.classList.toggle("open");

    /*
        Toggle .open on the button too.
        CSS uses .hamburger-btn.open .bar:nth-child rules
        to rotate the bars into an X shape.
    */
    btn.classList.toggle("open");

    /*
        Update the menuIsOpen variable to track the current state.
        This is good practice for when other functions need to
        know whether the menu is currently showing or not.
    */
    menuIsOpen = !menuIsOpen;   // flips true -> false or false -> true

    /*
        Update the aria-expanded attribute for accessibility.
        Screen readers use this to announce whether the menu is
        expanded or collapsed.  It should always match the visual state.
    */
    btn.setAttribute("aria-expanded", menuIsOpen.toString());
}

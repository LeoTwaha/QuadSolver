// WebSocket initialization
const socket = new WebSocket('ws://localhost:3000');

// Detect current page
const currentPage = window.location.pathname;
window.nextPage = (page) => {
    window.location.href = `/${page}`;
};

// DOM element selection
const quadForm = document.getElementById("quadForm");
const a = document.getElementById("a");
const b = document.getElementById("b");
const c = document.getElementById("c");
const y = document.getElementById("y");
const factorI = document.getElementById("factorI");
const posResult = document.getElementById("posResult");
const negResult = document.getElementById("negResult");

// Attach event listener unconditionally
quadForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log("QuadForm submitted!");

    // Parse input values if applicable
    let aVal, bVal, cVal;
    if (a != null && b != null && c != null) {
        aVal = parseFloat(a.value);
        bVal = parseFloat(b.value);
        cVal = parseFloat(c.value);

        // Validate input values
        if (isNaN(aVal) || isNaN(bVal) || isNaN(cVal)) {
            posResult.innerText = "Please enter valid numbers.";
            negResult.innerText = "";
            return;
        }
    }

    // Page-specific logic
    if (currentPage === "/" || currentPage.includes("index.html")) {
        console.log("Index Logic Executed");

        // Solve using the quadratic formula
        const x1 = nerdamer(`(-${bVal} + sqrt((${bVal})^2 - 4 * ${aVal} * ${cVal})) / (2 * ${aVal})`).toString();
        const x2 = nerdamer(`(-${bVal} - sqrt((${bVal})^2 - 4 * ${aVal} * ${cVal})) / (2 * ${aVal})`).toString();

        // Display results
        posResult.innerText = `x = ${x1.replace("sqrt", "√")}`;
        negResult.innerText = `or x = ${x2.replace("sqrt", "√")}`;


    } else if (currentPage.includes("/func")) {
        console.log("Func Page Logic Executed");

        // Parse y-value and validate
        const yVal = parseFloat(y.value);
        if (isNaN(yVal)) {
            posResult.innerText = "Please enter a valid value for y.";
            negResult.innerText = "";
            return;
        }

        // Solve the equation for x
        const equation = `solve(${yVal} = ${aVal}x^2 + ${bVal}x + ${cVal}, x)`;
        const result = nerdamer(equation).toString();
        const parsedResult = result.replace(/[\[\]]/g, '').split(',');
        const x1 = parsedResult[0].replace("sqrt", "√");
        const x2 = parsedResult[1].replace("sqrt", "√");
        // Display results
        posResult.innerText = `x₁ = ` + x1;
        negResult.innerText = `x₂ = ` + x2;

    } else if (currentPage.includes("/factor")) {
        console.log("Factoring Logic Executed");
    
        // Retrieve and clean the input equation
        const equationToFactor = factorI.value.replace("= 0", "").trim();
        console.log("Factoring Input (Cleaned):", equationToFactor);
    
        // Factor the equation
        let factored = nerdamer.factor(equationToFactor).toString();
        console.log("Factored Result (Raw):", factored);
    
        // Reformat the output if needed
        factored = nerdamer(`simplify(${factored})`).toString();
    
        // Check and format parentheses properly
        if (!factored.startsWith("(")) {
            factored = `(${factored})`;
        }
    
        console.log("Formatted Factored Result:", factored);
    
        // Display the factored result
        posResult.innerText = factored;
        negResult.innerText = ""; // Clear any secondary results
    }
    else {
        // Fallback for unexpected pages
        console.log(`Unhandled page: ${currentPage}`);
        posResult.innerText = "Unsupported page.";
        negResult.innerText = "";
    }
    if(posResult.innerText.length > 12 || negResult.innerText.length > 12 ){
        posResult.style.fontSize = "3vw";
        negResult.style.fontSize = "3vw";

    }
});

// WebSocket handlers
socket.onopen = () => console.log("WebSocket connection opened");
socket.onmessage = (event) => console.log("Message from server:", event.data);
socket.onerror = (error) => console.error("WebSocket error:", error);
socket.onclose = () => console.log("WebSocket connection closed");


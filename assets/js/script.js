// "use strict";

// // SET VARIABLES
// const actions = document.querySelector(".actions");
// const ans = document.querySelector(".ans");

// let expression = "";
// let a = 0;

// const calcFunctions = {
// 	"radic": (expression) => Math.sqrt(expression),
// 	"log": (expression) => Math.log(expression),
// 	"cos": (expression) => Math.cos(expression),
// 	"sin": (expression) => Math.sin(expression),
// 	"tan": (expression) => Math.tan(expression),
// 	"exp": (expression) => Math.exp(expression),
// 	"ce": function calcClear() {
// 		expression = "";
// 		ans.value = 0;
// 	},
// 	"x^2": function square() {
// 		return expression * expression;
// 	},
// };

// actions.addEventListener("click", (event) => {
// 	const value = event.target.dataset["value"];
// 	if (value !== undefined) {
// 		if (value in calcFunctions) {
// 			expression = calcFunctions[value]?.(expression);
// 		} else if (value == "=") {
// 			const answer = eval(expression);
// 			expression = answer;
// 		} else {
// 			expression += value;
// 		}
// 		if (value == "ce" || expression == undefined) {
// 			calcFunctions.ce();
// 		} else {
// 			ans.value = expression;
// 		}
// 	}
// });

// // TODO -> Inv, IN, E, ABC, FUNC
"use strict";

// SELECT ELEMENTS
const actions = document.querySelector(".actions");
const ans = document.querySelector(".ans");

// CALCULATOR STATE
const calculator = {
	expr: "", // For evaluation (JS code)
	displayExpr: "", // For display (human readable)
	invMode: false, // For Inv button

	// Update display
	update() {
		ans.value = this.displayExpr || 0;
		// Show INV mode as superscript, subtle
		const mode = document.getElementById("mode-indicator");
		if (mode) {
			mode.textContent = this.invMode ? "INV" : "";
			mode.style.fontSize = "0.8em";
			mode.style.color = "#888";
			mode.style.verticalAlign = "super";
		}
	},

	// Clear expressions
	clear() {
		this.expr = "";
		this.displayExpr = "";
		this.update();
	},

	// Append to both expressions
	append(val) {
		this.expr += val;
		this.displayExpr += val;
		this.update();
	},

	// Evaluate JS expression, show result
	evaluate() {
		try {
			const result = Function(`"use strict"; return (${this.expr})`)();
			this.expr = String(result);
			this.displayExpr = String(result);
		} catch {
			this.expr = this.displayExpr = "Error";
		}
		this.update();
	},

	// Map: button -> { eval, display }
	funcMap: {
		"x^2": { eval: (x) => `(${x})*(${x})`, display: (x) => `(${x})²` },
		"radic": { eval: (x) => `Math.sqrt(${x})`, display: (x) => `√(${x})` },
		"log": { eval: (x) => `Math.log(${x})`, display: (x) => `log(${x})` },
		"ln": { eval: (x) => `Math.log(${x})`, display: (x) => `ln(${x})` },
		"sin": {
			eval: (x) => (this.invMode ? `Math.asin(${x})` : `Math.sin(${x})`),
			display: (x) => (this.invMode ? `sin⁻¹(${x})` : `sin(${x})`),
		},
		"cos": {
			eval: (x) => (this.invMode ? `Math.acos(${x})` : `Math.cos(${x})`),
			display: (x) => (this.invMode ? `cos⁻¹(${x})` : `cos(${x})`),
		},
		"tan": {
			eval: (x) => (this.invMode ? `Math.atan(${x})` : `Math.tan(${x})`),
			display: (x) => (this.invMode ? `tan⁻¹(${x})` : `tan(${x})`),
		},
		"exp": { eval: (x) => `Math.exp(${x})`, display: (x) => `exp(${x})` },
		"**": { eval: (x) => `Math.pow(${x},`, display: (x) => `${x}^(` }, // expects user to type power next
		"%": { eval: (x) => `(${x})/100`, display: (x) => `(${x})%` },
	},

	// Apply function to both expressions, with domain error checks for inverse trig
	applyFunc(name) {
		if (this.expr === "Error") return;
		if (!this.expr) return;
		const fn = this.funcMap[name];
		if (fn) {
			// Evaluate the current value for domain checks
			let val;
			try {
				val = Function(`"use strict"; return (${this.expr})`)();
			} catch {
				this.expr = this.displayExpr = "Error";
				this.update();
				return;
			}
			// Domain checks for inverse trig
			if (name === "sin" && this.invMode && (val < -1 || val > 1)) {
				this.expr = this.displayExpr = "Error";
				this.update();
				return;
			}
			if (name === "cos" && this.invMode && (val < -1 || val > 1)) {
				this.expr = this.displayExpr = "Error";
				this.update();
				return;
			}
			// No domain check for tan⁻¹ (all real numbers allowed)
			// Domain check for sqrt
			if (name === "radic" && val < 0) {
				this.expr = this.displayExpr = "Error";
				this.update();
				return;
			}
			// Domain check for log/ln (must be > 0)
			if ((name === "log" || name === "ln") && val <= 0) {
				this.expr = this.displayExpr = "Error";
				this.update();
				return;
			}
			this.expr = fn.eval.call(this, this.expr);
			this.displayExpr = fn.display.call(this, this.displayExpr);
			this.update();
		}
	},

	// Insert constants
	insertConstant(val) {
		if (val === "3.14") {
			this.expr += Math.PI;
			this.displayExpr += "π";
		} else if (val === "e") {
			this.expr += Math.E;
			this.displayExpr += "e";
		}
		this.update();
	},

	// Toggle inverse mode (true toggle, always updates display)
	toggleInv() {
		this.invMode = !this.invMode;
		this.update(); // Always update display to show mode
	},
};

// EVENT HANDLING
// Button click handler
actions.addEventListener("click", (event) => {
	const val = event.target.dataset.value;
	if (!val) return;
	if (val === "ce") calculator.clear();
	else if (val === "=") calculator.evaluate();
	else if (val === "inv") calculator.toggleInv();
	else if (val === "3.14" || val === "e") calculator.insertConstant(val);
	else if (val in calculator.funcMap) calculator.applyFunc(val);
	else calculator.append(val);
});

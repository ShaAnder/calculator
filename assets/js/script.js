"use strict";

// SET VARIABLES
const actions = document.querySelector(".actions");
const ans = document.querySelector(".ans");

let expression = "";
let a = 0;

const calcFunctions = {
  radic: (expression) => Math.sqrt(expression),
  log: (expression) => Math.log(expression),
  cos: (expression) => Math.cos(expression),
  sin: (expression) => Math.sin(expression),
  tan: (expression) => Math.tan(expression),
  exp: (expression) => Math.exp(expression),
  ce: function calcClear() {
    expression = "";
    ans.value = 0;
  },
  "x^2": function square() {
    return expression * expression;
  },
};

actions.addEventListener("click", (event) => {
  const value = event.target.dataset["value"];
  if (value !== undefined) {
    if (value in calcFunctions) {
      expression = calcFunctions[value]?.(expression);
    } else if (value == "=") {
      const answer = eval(expression);
      expression = answer;
    } else {
      expression += value;
    }
    if (value == "ce" || expression == undefined) {
      calcFunctions.ce();
    } else {
      ans.value = expression;
    }
  }
});

// TODO -> Inv, IN, E, ABC, FUNC

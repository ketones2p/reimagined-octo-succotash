const currentOperand = document.querySelector("#current-operand");
const previousOperand = document.querySelector("#previous-operand");

let current = "0";
let previous = "";
let operation = null;
let shouldResetDisplay = false;

function render() {
  currentOperand.textContent = current;
  previousOperand.textContent = previous && operation
    ? `${previous} ${operation}`
    : "";
}

function inputNumber(number) {
  if (current === "Error" || shouldResetDisplay) {
    current = number;
    shouldResetDisplay = false;
  } else {
    current = current === "0" ? number : current + number;
  }
}

function inputDecimal() {
  if (current === "Error" || shouldResetDisplay) {
    current = "0.";
    shouldResetDisplay = false;
  } else if (!current.includes(".")) {
    current += ".";
  }
}

function chooseOperation(nextOperation) {
  if (current === "Error") clear();
  if (operation && !shouldResetDisplay) calculate();
  previous = current;
  operation = nextOperation;
  shouldResetDisplay = true;
}

function calculate() {
  if (!operation || previous === "") return;

  const left = Number(previous);
  const right = Number(current);
  let result;

  switch (operation) {
    case "+": result = left + right; break;
    case "−": result = left - right; break;
    case "×": result = left * right; break;
    case "÷": result = right === 0 ? NaN : left / right; break;
    default: return;
  }

  current = Number.isFinite(result)
    ? String(Number(result.toPrecision(12)))
    : "Error";
  previous = "";
  operation = null;
  shouldResetDisplay = true;
}

function clear() {
  current = "0";
  previous = "";
  operation = null;
  shouldResetDisplay = false;
}

function deleteDigit() {
  if (current === "Error" || shouldResetDisplay) {
    current = "0";
    shouldResetDisplay = false;
  } else {
    current = current.length > 1 ? current.slice(0, -1) : "0";
    if (current === "-") current = "0";
  }
}

document.querySelector(".keys").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.number !== undefined) inputNumber(button.dataset.number);
  if (button.dataset.operation) chooseOperation(button.dataset.operation);
  if (button.dataset.action === "decimal") inputDecimal();
  if (button.dataset.action === "clear") clear();
  if (button.dataset.action === "delete") deleteDigit();
  if (button.dataset.action === "equals") calculate();
  render();
});

document.addEventListener("keydown", (event) => {
  if (/^[0-9]$/.test(event.key)) inputNumber(event.key);
  else if (event.key === ".") inputDecimal();
  else if (["+", "-", "*", "/"].includes(event.key)) {
    chooseOperation({ "+": "+", "-": "−", "*": "×", "/": "÷" }[event.key]);
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    calculate();
  } else if (event.key === "Backspace") deleteDigit();
  else if (event.key === "Escape") clear();
  else return;

  render();
});

render();

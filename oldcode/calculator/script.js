document.addEventListener("DOMContentLoaded", () => {
    // --- Elements ---
    const expressionEl = document.getElementById("expression");
    const resultEl = document.getElementById("result");
    const buttons = document.querySelectorAll(".btn");
    const clearBtn = document.getElementById("clear-btn");
    const delBtn = document.getElementById("del-btn");
    const evalBtn = document.getElementById("eval-btn");
    const modeBtn = document.getElementById("mode-btn");
    const copyBtn = document.getElementById("copy-btn");
    const historyList = document.getElementById("history-list");
    const clearHistoryBtn = document.getElementById("clear-history");

    // --- State ---
    let currentInput = "";
    let isDegreeMode = false;
    let history = [];
    let evaluated = false;

    // --- Initialization ---
    loadHistory();
    updateDisplay();

    // --- Event Listeners ---
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const val = btn.dataset.val;
            if (!val) return;

            if (evaluated && !isOperator(val)) {
                // If evaluated and user types a number/function, start fresh
                currentInput = val;
                evaluated = false;
            } else if (evaluated && isOperator(val)) {
                // If evaluated and user types operator, chain it
                evaluated = false;
                currentInput += val;
            } else {
                if (currentInput === "0" && !isNaN(val) && val !== ".") {
                    currentInput = val;
                } else {
                    currentInput += val;
                }
            }
            updateDisplay();
        });
    });

    clearBtn.addEventListener("click", () => {
        currentInput = "";
        expressionEl.textContent = "";
        evaluated = false;
        updateDisplay();
    });

    delBtn.addEventListener("click", () => {
        if (evaluated) {
            expressionEl.textContent = "";
            evaluated = false;
        } else {
            currentInput = currentInput.slice(0, -1);
            if (currentInput === "") currentInput = "";
        }
        updateDisplay();
    });

    evalBtn.addEventListener("click", calculateResult);

    modeBtn.addEventListener("click", () => {
        isDegreeMode = !isDegreeMode;
        modeBtn.textContent = isDegreeMode ? "Deg" : "Rad";
        // Recalculate if there's a result
        if (evaluated) {
            // Need the raw expression from history or expressionEl to recalculate properly
            // But to keep it simple, we just toggle mode. User must re-evaluate.
        }
    });

    copyBtn.addEventListener("click", () => {
        if (resultEl.textContent) {
            navigator.clipboard.writeText(resultEl.textContent).then(() => {
                const icon = copyBtn.innerHTML;
                copyBtn.innerHTML = '<span style="color:var(--eval-bg); font-size: 14px;">Copied!</span>';
                setTimeout(() => copyBtn.innerHTML = icon, 1500);
            });
        }
    });

    clearHistoryBtn.addEventListener("click", () => {
        history = [];
        saveHistory();
        renderHistory();
    });

    // --- Keyboard Support ---
    document.addEventListener("keydown", (e) => {
        const key = e.key;
        if (key === "Enter" || key === "=") {
            e.preventDefault();
            calculateResult();
        } else if (key === "Backspace") {
            delBtn.click();
        } else if (key === "Escape") {
            clearBtn.click();
        } else {
            // Map keyboard keys to buttons
            let val = key;
            if (key === "x" || key === "*") val = "*";
            if (key === "/") val = "/";
            if (key === "-") val = "-";
            
            const btn = Array.from(buttons).find(b => b.dataset.val === val);
            if (btn) {
                e.preventDefault();
                btn.click();
                // Add a quick active effect
                btn.classList.add("active-simulate");
                setTimeout(() => btn.classList.remove("active-simulate"), 100);
            }
        }
    });

    // --- Core Functions ---
    function updateDisplay() {
        if (currentInput === "") {
            resultEl.textContent = "0";
        } else {
            resultEl.textContent = formatForDisplay(currentInput);
        }
        
        // Scroll to right
        resultEl.scrollLeft = resultEl.scrollWidth;
    }

    function formatForDisplay(input) {
        return input
            .replace(/\*/g, '×')
            .replace(/\//g, '÷')
            .replace(/-/g, '−');
    }

    function isOperator(val) {
        return ["+", "-", "*", "/", "^", "^2", "%"].includes(val);
    }

    function calculateResult() {
        if (!currentInput) return;

        try {
            const result = evaluateExpression(currentInput, isDegreeMode);
            
            // Format result
            let displayResult = result;
            if (displayResult === "Error" || displayResult === "Division by zero") {
                // Keep as is
            } else {
                // Prevent ultra long decimals
                displayResult = Math.round(result * 1e10) / 1e10;
            }

            // Update DOM
            expressionEl.textContent = formatForDisplay(currentInput) + " =";
            resultEl.textContent = displayResult;
            
            // Save to history
            if (displayResult !== "Error" && displayResult !== "Division by zero" && !isNaN(displayResult)) {
                addToHistory(formatForDisplay(currentInput), displayResult);
            }

            currentInput = displayResult.toString();
            evaluated = true;

        } catch (error) {
            expressionEl.textContent = formatForDisplay(currentInput) + " =";
            resultEl.textContent = "Error";
            currentInput = "";
            evaluated = true;
        }
    }

    function formatForEvaluation(expr) {
        let parsed = expr
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-')
            .replace(/π/g, 'Math.PI')
            .replace(/e/g, 'Math.E')
            .replace(/\^2/g, '**2')
            .replace(/\^/g, '**')
            .replace(/%/g, '/100');
        return parsed;
    }

    function evaluateExpression(expr, degreeMode) {
        const parsedExpr = formatForEvaluation(expr);
        
        const context = {
            Math: Math,
            log: Math.log10,
            ln: Math.log,
            sqrt: Math.sqrt,
            abs: Math.abs,
            sin: (x) => degreeMode ? Math.sin(x * Math.PI / 180) : Math.sin(x),
            cos: (x) => degreeMode ? Math.cos(x * Math.PI / 180) : Math.cos(x),
            tan: (x) => {
                if (degreeMode && x % 180 === 90) return Infinity; // tan(90) is undefined/Infinity
                return degreeMode ? Math.tan(x * Math.PI / 180) : Math.tan(x);
            }
        };

        const args = Object.keys(context);
        const values = Object.values(context);
        
        const evalFunc = new Function(...args, `return ${parsedExpr};`);
        let result = evalFunc(...values);
        
        if (result === Infinity || result === -Infinity) {
            return "Division by zero";
        }
        
        if (isNaN(result)) {
            throw new Error("Invalid format");
        }
        
        return result;
    }

    // --- History Functions ---
    function addToHistory(expr, res) {
        history.unshift({ expr, res });
        if (history.length > 5) {
            history.pop();
        }
        saveHistory();
        renderHistory();
    }

    function saveHistory() {
        localStorage.setItem("calcHistory", JSON.stringify(history));
    }

    function loadHistory() {
        const saved = localStorage.getItem("calcHistory");
        if (saved) {
            try {
                history = JSON.parse(saved);
                renderHistory();
            } catch (e) {
                history = [];
            }
        }
    }

    function renderHistory() {
        historyList.innerHTML = "";
        history.forEach(item => {
            const li = document.createElement("li");
            li.className = "history-item";
            li.innerHTML = `
                <div class="history-expr">${item.expr}</div>
                <div class="history-res">${item.res}</div>
            `;
            // Click history item to reuse result
            li.addEventListener("click", () => {
                currentInput = item.res.toString();
                evaluated = false;
                expressionEl.textContent = "";
                updateDisplay();
            });
            historyList.appendChild(li);
        });
    }
});

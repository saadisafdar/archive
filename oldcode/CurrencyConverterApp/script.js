/**
 * Currency Converter Logic
 * Features:
 * - Fetches real-time exchange rates using open.er-api.com
 * - Converts amounts between selected currencies
 * - Handles errors (no internet, invalid input, API failure)
 * - Auto-converts on input change
 * - Saves last selected currencies to localStorage
 */

// DOM Elements
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('from-currency');
const toCurrencySelect = document.getElementById('to-currency');
const convertBtn = document.getElementById('convert-btn');
const swapBtn = document.getElementById('swap-btn');
const resultDisplay = document.getElementById('result-display');
const rateDisplay = document.getElementById('rate-display');
const lastUpdatedDisplay = document.getElementById('last-updated');
const amountError = document.getElementById('amount-error');
const globalError = document.getElementById('global-error');
const resultContainer = document.querySelector('.result-container');

// Supported currencies as per requirements
const SUPPORTED_CURRENCIES = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'PKR', name: 'Pakistani Rupee' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'AED', name: 'UAE Dirham' },
    { code: 'SAR', name: 'Saudi Riyal' },
    { code: 'JPY', name: 'Japanese Yen' }
];

// Open API for exchange rates based on USD/other bases (free, no key required)
const API_URL = 'https://open.er-api.com/v6/latest/';

// State object to hold latest exchange rates
let exchangeRates = {};

/**
 * Initialize the application
 */
function init() {
    populateCurrencySelectors();
    loadSavedPreferences();
    
    // Set initial UI state
    resultDisplay.textContent = 'Enter amount to convert';
    
    // Fetch rates and perform initial conversion if amount is valid
    fetchRates(fromCurrencySelect.value).then(() => {
        if (isValidAmount(amountInput.value)) {
            convertCurrency();
        }
    });
    
    setupEventListeners();
}

/**
 * Populates from and to select elements with supported currencies
 */
function populateCurrencySelectors() {
    const optionsHTML = SUPPORTED_CURRENCIES.map(curr => 
        `<option value="${curr.code}">${curr.code} - ${curr.name}</option>`
    ).join('');

    fromCurrencySelect.innerHTML = optionsHTML;
    toCurrencySelect.innerHTML = optionsHTML;

    // Set default selections
    fromCurrencySelect.value = 'USD';
    toCurrencySelect.value = 'PKR';
}

/**
 * Load user's previously selected currencies from localStorage
 */
function loadSavedPreferences() {
    const savedFrom = localStorage.getItem('currency_from');
    const savedTo = localStorage.getItem('currency_to');

    if (savedFrom && isCurrencySupported(savedFrom)) {
        fromCurrencySelect.value = savedFrom;
    }
    
    if (savedTo && isCurrencySupported(savedTo)) {
        toCurrencySelect.value = savedTo;
    }
}

/**
 * Check if a currency code is present in the supported list
 * @param {string} code Currency code
 */
function isCurrencySupported(code) {
    return SUPPORTED_CURRENCIES.some(curr => curr.code === code);
}

/**
 * Save current dropdown selections to localStorage
 */
function savePreferences() {
    localStorage.setItem('currency_from', fromCurrencySelect.value);
    localStorage.setItem('currency_to', toCurrencySelect.value);
}

/**
 * Set up event listeners for user interactions
 */
function setupEventListeners() {
    // Manual convert button click
    convertBtn.addEventListener('click', convertCurrency);

    // Swap currencies button click
    swapBtn.addEventListener('click', () => {
        // Swap values
        const temp = fromCurrencySelect.value;
        fromCurrencySelect.value = toCurrencySelect.value;
        toCurrencySelect.value = temp;
        
        savePreferences();
        
        // Re-fetch rates for the new base currency and convert
        fetchRates(fromCurrencySelect.value).then(() => {
            if (isValidAmount(amountInput.value)) {
                convertCurrency();
            }
        });
    });

    // Auto-convert when the user types (with a 500ms debounce)
    let typingTimeout;
    amountInput.addEventListener('input', () => {
        clearTimeout(typingTimeout);
        validateInput(); // Show validation errors immediately if any
        
        typingTimeout = setTimeout(() => {
            if (isValidAmount(amountInput.value)) {
                convertCurrency();
            }
        }, 500);
    });

    // Re-fetch and convert when "From" currency changes
    fromCurrencySelect.addEventListener('change', () => {
        savePreferences();
        fetchRates(fromCurrencySelect.value).then(() => {
            if (isValidAmount(amountInput.value)) {
                convertCurrency();
            }
        });
    });

    // Re-calculate when "To" currency changes (rates are already fetched)
    toCurrencySelect.addEventListener('change', () => {
        savePreferences();
        if (isValidAmount(amountInput.value)) {
            convertCurrency();
        }
    });
}

/**
 * Validates the amount input and displays UI errors if needed
 * @returns {boolean} True if input is valid
 */
function validateInput() {
    const val = amountInput.value.trim();
    
    if (val === '') {
        amountError.textContent = 'Amount cannot be empty';
        return false;
    }
    
    const num = parseFloat(val);
    if (isNaN(num)) {
        amountError.textContent = 'Please enter a valid number';
        return false;
    }
    
    if (num < 0) {
        amountError.textContent = 'Amount cannot be negative';
        return false;
    }
    
    amountError.textContent = '';
    return true;
}

/**
 * Check if the input value is a valid numeric amount
 * @param {string} val Input string
 */
function isValidAmount(val) {
    const num = parseFloat(val);
    return val.trim() !== '' && !isNaN(num) && num >= 0;
}

/**
 * Displays a global error message to the user
 * @param {string} message The error message to show
 */
function showError(message) {
    globalError.textContent = message;
    globalError.classList.remove('hidden');
    resultDisplay.textContent = '--';
    rateDisplay.textContent = '';
    lastUpdatedDisplay.textContent = '';
}

/**
 * Hides the global error message
 */
function hideError() {
    globalError.classList.add('hidden');
}

/**
 * Fetches real-time exchange rates from the API
 * @param {string} baseCurrency The currency code to fetch rates for
 * @returns {Promise<boolean>} True if successful
 */
async function fetchRates(baseCurrency) {
    try {
        hideError();
        resultContainer.classList.add('loading');
        
        // Fetch rates based on the selected "From" currency
        const response = await fetch(`${API_URL}${baseCurrency}`);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.result === 'success') {
            exchangeRates = data.rates;
            
            // Format and display the last updated time provided by the API
            const updateDate = new Date(data.time_last_update_unix * 1000);
            lastUpdatedDisplay.textContent = `Last updated: ${updateDate.toLocaleString()}`;
            
            resultContainer.classList.remove('loading');
            return true;
        } else {
            throw new Error('Failed to retrieve valid data from API');
        }
    } catch (error) {
        console.error('Fetch error:', error);
        
        // Error handling based on network availability
        if (!navigator.onLine) {
            showError('No internet connection. Please check your network.');
        } else {
            showError('Failed to fetch exchange rates. API might be unavailable.');
        }
        
        resultContainer.classList.remove('loading');
        return false;
    }
}

/**
 * Formats a number with maximum 4 fractional digits and commas
 * @param {number} num Number to format
 */
function formatNumber(num) {
    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 4
    }).format(num);
}

/**
 * Performs the currency conversion calculation and updates the UI
 */
function convertCurrency() {
    if (!validateInput()) return;
    
    const amount = parseFloat(amountInput.value);
    const fromCode = fromCurrencySelect.value;
    const toCode = toCurrencySelect.value;
    
    // Check if rates have been loaded
    if (Object.keys(exchangeRates).length === 0) {
        showError('Exchange rates not available. Please check your connection.');
        return;
    }
    
    // Get the specific conversion rate
    const rate = exchangeRates[toCode];
    
    if (rate === undefined) {
        showError(`Exchange rate for ${toCode} not available.`);
        return;
    }
    
    // Calculate the converted result
    const result = amount * rate;
    
    hideError();
    
    // Display primary result (e.g., 100 USD = 27,800 PKR)
    resultDisplay.textContent = `${formatNumber(amount)} ${fromCode} = ${formatNumber(result)} ${toCode}`;
    
    // Display the single unit rate (e.g., 1 USD = 278 PKR)
    rateDisplay.textContent = `1 ${fromCode} = ${formatNumber(rate)} ${toCode}`;
}

// Bootstrap the application on page load
document.addEventListener('DOMContentLoaded', init);

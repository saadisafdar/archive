// State & DOM
const inputEl = document.getElementById('qr-input');
const typeBadge = document.getElementById('input-type-badge');
const sizeEl = document.getElementById('qr-size');
const sizeVal = document.getElementById('size-val');
const marginEl = document.getElementById('qr-margin');
const marginVal = document.getElementById('margin-val');
const fgEl = document.getElementById('qr-fg');
const bgEl = document.getElementById('qr-bg');
const eccEl = document.getElementById('qr-ecc');
const generateBtn = document.getElementById('generate-btn');
const canvas = document.getElementById('qr-canvas');
const placeholder = document.querySelector('.placeholder');
const actionsPanel = document.getElementById('qr-actions');
const downloadBtn = document.getElementById('download-btn');
const copyBtn = document.getElementById('copy-btn');
const filenameInput = document.getElementById('filename');
const historyList = document.getElementById('history-list');
const themeBtn = document.getElementById('theme-btn');

let qrInstance = null;
let debounceTimer;

// Init QRious
function initQR() {
  qrInstance = new QRious({
    element: canvas,
    size: parseInt(sizeEl.value),
    padding: parseInt(marginEl.value),
    foreground: fgEl.value,
    background: bgEl.value,
    level: eccEl.checked ? 'H' : 'L',
    value: ' '
  });
}

// Generate function
function generateQR(isAuto = false) {
  const text = inputEl.value.trim();
  
  if (!text) {
    if (!isAuto) alert('Please enter some text or URL.');
    canvas.style.display = 'none';
    placeholder.style.display = 'block';
    actionsPanel.style.display = 'none';
    return;
  }

  // Detect URL
  const isUrl = /^https?:\/\//i.test(text) || /^www\./i.test(text);
  typeBadge.textContent = isUrl ? 'URL' : 'Text';
  typeBadge.style.backgroundColor = isUrl ? '#10b981' : '#3b82f6';

  // Update QRious instance
  if (!qrInstance) initQR();
  
  qrInstance.set({
    size: parseInt(sizeEl.value),
    padding: parseInt(marginEl.value),
    foreground: fgEl.value,
    background: bgEl.value,
    level: eccEl.checked ? 'H' : 'L',
    value: text
  });

  canvas.style.display = 'block';
  placeholder.style.display = 'none';
  actionsPanel.style.display = 'flex';

  if (!isAuto) saveHistory(text);
}

// Debounced auto-generate
function autoGenerate() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => generateQR(true), 500);
}

// Save history
function saveHistory(text) {
  let history = JSON.parse(localStorage.getItem('qr_history')) || [];
  // Remove if exists
  history = history.filter(item => item.text !== text);
  // Add to top
  history.unshift({
    text: text,
    date: new Date().toLocaleString()
  });
  // Keep last 5
  if (history.length > 5) history.pop();
  
  localStorage.setItem('qr_history', JSON.stringify(history));
  renderHistory();
}

// Render history
function renderHistory() {
  const history = JSON.parse(localStorage.getItem('qr_history')) || [];
  historyList.innerHTML = '';
  
  history.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="hist-text">${item.text}</span>
      <span class="hist-date">${item.date}</span>
    `;
    li.addEventListener('click', () => {
      inputEl.value = item.text;
      generateQR();
    });
    historyList.appendChild(li);
  });
}

// Download
downloadBtn.addEventListener('click', () => {
  if (!qrInstance) return;
  const dataUrl = canvas.toDataURL('image/png');
  const customName = filenameInput.value.trim();
  const filename = customName ? `${customName}.png` : 'qrcode.png';
  
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
});

// Copy to Clipboard
copyBtn.addEventListener('click', async () => {
  if (!qrInstance) return;
  try {
    canvas.toBlob(async (blob) => {
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
      
      const originalText = copyBtn.innerText;
      copyBtn.innerText = '✅ Copied!';
      setTimeout(() => copyBtn.innerText = originalText, 2000);
    });
  } catch (err) {
    alert('Clipboard copying failed or not supported by your browser.');
  }
});

// Dark mode toggle
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('qr_theme', isDark ? 'dark' : 'light');
  themeBtn.textContent = isDark ? '☀️' : '🌙';
});

// Event Listeners
inputEl.addEventListener('input', autoGenerate);

inputEl.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    generateQR();
  }
});

generateBtn.addEventListener('click', () => generateQR());

// Update labels on range changes
sizeEl.addEventListener('input', (e) => {
  sizeVal.textContent = e.target.value;
  if(inputEl.value.trim()) autoGenerate();
});
marginEl.addEventListener('input', (e) => {
  marginVal.textContent = e.target.value;
  if(inputEl.value.trim()) autoGenerate();
});

// Color & Toggle changes trigger update
fgEl.addEventListener('input', () => { if(inputEl.value.trim()) autoGenerate(); });
bgEl.addEventListener('input', () => { if(inputEl.value.trim()) autoGenerate(); });
eccEl.addEventListener('change', () => { if(inputEl.value.trim()) autoGenerate(); });

// Init
window.onload = () => {
  // Restore theme
  if (localStorage.getItem('qr_theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeBtn.textContent = '☀️';
  }
  renderHistory();
};

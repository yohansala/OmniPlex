// Inicializar íconos de Lucide
if (window.lucide) {
  lucide.createIcons();
}

// ==========================================
// TASAS OFICIALES BCV (02/11/2026) + TASA PERSONALIZADA
// ==========================================
let baseRates = { 
  USD: 891.10, 
  EUR: 997.92, 
  CNY: 134.05, 
  TRY: 17.83, 
  RUB: 11.01 
};

let rates = { ...baseRates };
let currentCurrency = 'USD';
let history = [];
let isCustomRateActive = false;

const currencyConfig = {
  USD: { name: "Dólar BCV", symbol: "$" },
  EUR: { name: "Euro BCV", symbol: "€" },
  CNY: { name: "Yuan BCV", symbol: "¥" },
  TRY: { name: "Lira BCV", symbol: "₺" },
  RUB: { name: "Rublo BCV", symbol: "₽" }
};

// Referencias al DOM
const foreignInput = document.getElementById('foreign-input');
const bsInput = document.getElementById('bs-input');
const foreignSymbol = document.getElementById('foreign-symbol');
const bcvButtonText = document.getElementById('bcv-button-text');
const updateTime = document.getElementById('update-time');
const historyList = document.getElementById('history-list');
const toast = document.getElementById('toast');
const customAlert = document.getElementById('custom-rate-alert');

// Formatear números con puntos y comas (Ej: 15.000,50)
function formatNumber(num) {
  if (isNaN(num)) return "0.00";
  return Number(num).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Cambiar moneda y guardar en LocalStorage
function setCurrency(code) {
  currentCurrency = code;
  localStorage.setItem('calc_bcv_currency', code);

  if (bcvButtonText) bcvButtonText.innerText = currencyConfig[code].name;
  if (foreignSymbol) foreignSymbol.innerText = currencyConfig[code].symbol;
  
  recalculateBs();
  showToast("Seleccionado: " + currencyConfig[code].name);
}

// Rotar entre monedas
function cycleCurrency() {
  const keys = Object.keys(rates);
  setCurrency(keys[(keys.indexOf(currentCurrency) + 1) % keys.length]);
}

// Sumar montos rápidos
function addAmount(amount) {
  if (foreignInput) {
    foreignInput.value = ((parseFloat(foreignInput.value) || 0) + amount).toFixed(2);
    recalculateBs();
  }
}

// Sumar porcentajes de ganancia (Ej: +10%, +20%, etc.)
function addPercentage(percent) {
  if (foreignInput) {
    let currentVal = parseFloat(foreignInput.value) || 0;
    if (currentVal > 0) {
      let added = currentVal * (1 + percent / 100);
      foreignInput.value = added.toFixed(2);
      recalculateBs();
      showToast(`Aplicado +${percent}% de margen`);
    } else {
      showToast("Introduce un monto primero");
    }
  }
}

// Limpiar
function clearInput() { 
  if (foreignInput) foreignInput.value = ''; 
  if (bsInput) bsInput.value = ''; 
  if (foreignInput) foreignInput.focus(); 
}

function clearHistory() { 
  history = []; 
  localStorage.removeItem('calc_bcv_history');
  renderHistoryUI();
  showToast("Historial borrado"); 
}

// Lógica de cálculo con formato
function recalculateBs() {
  if (!foreignInput || !bsInput) return;
  const val = parseFloat(foreignInput.value);
  if (!isNaN(val)) {
    const totalBs = (val * rates[currentCurrency]).toFixed(2);
    bsInput.value = totalBs;
    addHistory(formatNumber(val), formatNumber(totalBs), currencyConfig[currentCurrency].symbol);
  } else { 
    bsInput.value = ''; 
  }
}

function recalculateForeign() {
  if (!foreignInput || !bsInput) return;
  const val = parseFloat(bsInput.value);
  if (!isNaN(val)) {
    const foreignTotal = (val / rates[currentCurrency]).toFixed(2);
    foreignInput.value = foreignTotal;
    addHistory(formatNumber(foreignTotal), formatNumber(val), currencyConfig[currentCurrency].symbol);
  } else { 
    foreignInput.value = ''; 
  }
}

if (foreignInput) foreignInput.addEventListener('input', recalculateBs);
if (bsInput) bsInput.addEventListener('input', recalculateForeign);

// Manejo del Historial persistente
function addHistory(foreign, bs, symbol) {
  const itemText = `${foreign} ${symbol}`;
  const bsText = `${bs} Bs`;
  if (history.length > 0 && history[0].foreign === itemText && history[0].bs === bsText) return;
  
  history.unshift({ foreign: itemText, bs: bsText });
  if (history.length > 4) history.pop();
  
  localStorage.setItem('calc_bcv_history', JSON.stringify(history));
  renderHistoryUI();
}

function renderHistoryUI() {
  if (!historyList) return;
  if (history.length === 0) {
    historyList.innerHTML = '<div class="history-item" style="justify-content:center; color:#9ca3af;">Sin historial</div>';
    return;
  }
  historyList.innerHTML = history.map(i => `<div class="history-item"><span>${i.foreign}</span><span class="history-val">${i.bs}</span></div>`).join('');
}

// Generar reporte y copiar al portapapeles
function shareReport() {
  const fVal = (foreignInput && foreignInput.value) ? formatNumber(foreignInput.value) : '0,00';
  const bVal = (bsInput && bsInput.value) ? formatNumber(bsInput.value) : '0,00';
  const sym = currencyConfig[currentCurrency].symbol;
  const tasaTipo = isCustomRateActive ? "*(Tasa Personalizada)*" : "*(Tasa Oficial BCV - 02/11/2026)*";
  
  const reportText = `📝 *CalcBCV - Cotización*\n\n💵 *${fVal} ${sym}* = *${bVal} Bs*\n🏦 ${tasaTipo}: ${formatNumber(rates[currentCurrency])} Bs por ${sym}`;
  
  navigator.clipboard.writeText(reportText).then(() => {
    showToast("¡Reporte copiado! Pégalo en WhatsApp");
  }).catch(err => {
    const textArea = document.createElement("textarea");
    textArea.value = reportText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    showToast("¡Reporte copiado con éxito!");
  });
}

// Activar Tasa Personalizada
function activarTasaPersonalizada(code) {
  const nuevaTasa = prompt(`Introduce la tasa personalizada para ${currencyConfig[code].name}:`, rates[code]);
  if (nuevaTasa !== null && !isNaN(nuevaTasa) && nuevaTasa.trim() !== "") {
    rates[code] = parseFloat(nuevaTasa);
    isCustomRateActive = true;
    setCurrency(code);
    showToast(`Tasa de ${code} modificada temporalmente`);
    renderRatesUI();
    toggleCustomAlert(true);
  }
}

// Mostrar alerta visual de tasa personalizada activa
function toggleCustomAlert(show) {
  if (customAlert) {
    if (show || isCustomRateActive) {
      customAlert.style.display = 'block';
    } else {
      customAlert.style.display = 'none';
    }
  }
}

// Render UI
function renderRatesUI() {
  const usdEl = document.getElementById('display-usd-rate');
  const eurEl = document.getElementById('display-eur-rate');
  const cnyEl = document.getElementById('display-cny-rate');
  const tryEl = document.getElementById('display-try-rate');
  const rubEl = document.getElementById('display-rub-rate');

  if (usdEl) usdEl.innerText = "Bs. " + formatNumber(rates.USD) + (rates.USD !== baseRates.USD ? " *" : "");
  if (eurEl) eurEl.innerText = "Bs. " + formatNumber(rates.EUR) + (rates.EUR !== baseRates.EUR ? " *" : "");
  if (cnyEl) cnyEl.innerText = "Bs. " + formatNumber(rates.CNY) + (rates.CNY !== baseRates.CNY ? " *" : "");
  if (tryEl) tryEl.innerText = "Bs. " + formatNumber(rates.TRY) + (rates.TRY !== baseRates.TRY ? " *" : "");
  if (rubEl) rubEl.innerText = "Bs. " + formatNumber(rates.RUB) + (rates.RUB !== baseRates.RUB ? " *" : "");
}

function fetchAllRates(isManual = false) {
  const icon = document.getElementById('refresh-icon');
  if (isManual && icon) { 
    icon.classList.add('refresh-spin'); 
    rates = { ...baseRates }; 
    isCustomRateActive = false;
    toggleCustomAlert(false);
    showToast("Tasas oficiales restauradas"); 
  }
  
  renderRatesUI();
  recalculateBs();
  
  if (updateTime) {
    updateTime.innerText = "02/11/2026";
  }
  
  if (isManual && icon) {
    setTimeout(() => icon.classList.remove('refresh-spin'), 500);
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.setAttribute('data-lucide', document.body.classList.contains('dark-mode') ? 'sun' : 'moon');
    if (window.lucide) lucide.createIcons();
  }
}

function copyValue(id) {
  const input = document.getElementById(id);
  if (input && input.value) { 
    navigator.clipboard.writeText(input.value); 
    showToast("Copiado: " + input.value); 
  }
}

function showToast(msg) {
  if (!toast) return;
  toast.innerText = msg; 
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// Inicialización
function initApp() {
  const savedCurrency = localStorage.getItem('calc_bcv_currency');
  if (savedCurrency && rates[savedCurrency]) {
    currentCurrency = savedCurrency;
    if (bcvButtonText) bcvButtonText.innerText = currencyConfig[savedCurrency].name;
    if (foreignSymbol) foreignSymbol.innerText = currencyConfig[savedCurrency].symbol;
  }

  const savedHistory = localStorage.getItem('calc_bcv_history');
  if (savedHistory) {
    try {
      history = JSON.parse(savedHistory);
      renderHistoryUI();
    } catch(e) {
      history = [];
    }
  }

  fetchAllRates(false);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

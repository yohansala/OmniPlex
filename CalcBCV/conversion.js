// Inicializar íconos de Lucide
if (window.lucide) {
  lucide.createIcons();
}

// ==========================================
// ACTUALIZA AQUÍ LAS TASAS MANUALMENTE
// (Copiadas directo del reporte de WhatsApp)
// ==========================================
let rates = { 
  USD: 886.2271, 
  EUR: 993.08836371, 
  CNY: 132.78202957, 
  TRY: 17.85783286, 
  RUB: 10.85596986 
};

let currentCurrency = 'USD';
let history = [];

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

// Cambiar la moneda seleccionada
function setCurrency(code) {
  currentCurrency = code;
  if (bcvButtonText) bcvButtonText.innerText = currencyConfig[code].name;
  if (foreignSymbol) foreignSymbol.innerText = currencyConfig[code].symbol;
  recalculateBs();
  showToast("Seleccionado: " + currencyConfig[code].name);
}

// Rotar entre las monedas con el botón principal
function cycleCurrency() {
  const keys = Object.keys(rates);
  setCurrency(keys[(keys.indexOf(currentCurrency) + 1) % keys.length]);
}

// Sumar montos rápidos (+1, +5, +10, etc.)
function addAmount(amount) {
  if (foreignInput) {
    foreignInput.value = ((parseFloat(foreignInput.value) || 0) + amount).toFixed(2);
    recalculateBs();
  }
}

// Limpiar inputs e historial
function clearInput() { 
  if (foreignInput) foreignInput.value = ''; 
  if (bsInput) bsInput.value = ''; 
  if (foreignInput) foreignInput.focus(); 
}

function clearHistory() { 
  history = []; 
  if (historyList) {
    historyList.innerHTML = '<div class="history-item" style="justify-content:center; color:#9ca3af;">Sin historial</div>'; 
  }
  showToast("Historial borrado"); 
}

// Lógica de cálculo
function recalculateBs() {
  if (!foreignInput || !bsInput) return;
  const val = parseFloat(foreignInput.value);
  if (!isNaN(val)) {
    const totalBs = (val * rates[currentCurrency]).toFixed(2);
    bsInput.value = totalBs;
    addHistory(val, totalBs, currencyConfig[currentCurrency].symbol);
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
    addHistory(foreignTotal, val.toFixed(2), currencyConfig[currentCurrency].symbol);
  } else { 
    foreignInput.value = ''; 
  }
}

// Escuchadores de eventos en tiempo real
if (foreignInput) foreignInput.addEventListener('input', recalculateBs);
if (bsInput) bsInput.addEventListener('input', recalculateForeign);

// Manejo del historial
function addHistory(foreign, bs, symbol) {
  if (!historyList) return;
  const itemText = `${foreign} ${symbol}`;
  const bsText = `${bs} Bs`;
  if (history.length > 0 && history[0].foreign === itemText && history[0].bs === bsText) return;
  
  history.unshift({ foreign: itemText, bs: bsText });
  if (history.length > 3) history.pop();
  historyList.innerHTML = history.map(i => `<div class="history-item"><span>${i.foreign}</span><span class="history-val">${i.bs}</span></div>`).join('');
}

// Generar reporte para compartir en WhatsApp
function shareReport() {
  const fVal = (foreignInput && foreignInput.value) ? foreignInput.value : '0.00';
  const bVal = (bsInput && bsInput.value) ? bsInput.value : '0.00';
  const sym = currencyConfig[currentCurrency].symbol;
  
  navigator.clipboard.writeText(`📝 *CalcBCV - Cotización*\n\n💵 *${fVal} ${sym}* = *${bVal} Bs*\n🏦 *Tasa Oficial:* ${rates[currentCurrency].toFixed(2)} Bs por ${sym}`);
  showToast("Reporte copiado para WhatsApp");
}

// Renderiza los valores en las cajitas inferiores de la interfaz
function renderRatesUI() {
  const usdEl = document.getElementById('display-usd-rate');
  const eurEl = document.getElementById('display-eur-rate');
  const cnyEl = document.getElementById('display-cny-rate');
  const tryEl = document.getElementById('display-try-rate');
  const rubEl = document.getElementById('display-rub-rate');

  if (usdEl) usdEl.innerText = "Bs. " + rates.USD.toFixed(2);
  if (eurEl) eurEl.innerText = "Bs. " + rates.EUR.toFixed(2);
  if (cnyEl) cnyEl.innerText = "Bs. " + rates.CNY.toFixed(2);
  if (tryEl) tryEl.innerText = "Bs. " + rates.TRY.toFixed(2);
  if (rubEl) rubEl.innerText = "Bs. " + rates.RUB.toFixed(2);
}

// Refrescar tasas y actualizar la hora de actualización
function fetchAllRates(isManual = false) {
  const icon = document.getElementById('refresh-icon');
  if (isManual && icon) { 
    icon.classList.add('refresh-spin'); 
    showToast("Tasas actualizadas"); 
  }
  
  // Dibuja las tasas en pantalla
  renderRatesUI();
  recalculateBs();
  
  if (updateTime) {
    updateTime.innerText = "Act: " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  if (isManual && icon) {
    setTimeout(() => icon.classList.remove('refresh-spin'), 500);
  }
}

// Cambio de tema Claro / Oscuro
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.setAttribute('data-lucide', document.body.classList.contains('dark-mode') ? 'sun' : 'moon');
    if (window.lucide) lucide.createIcons();
  }
}

// Copiar valores individuales
function copyValue(id) {
  const input = document.getElementById(id);
  if (input && input.value) { 
    navigator.clipboard.writeText(input.value); 
    showToast("Copiado: " + input.value); 
  }
}

// Mostrar notificaciones Toast en pantalla
function showToast(msg) {
  if (!toast) return;
  toast.innerText = msg; 
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// Cargar inmediatamente al iniciar la app
function initApp() {
  fetchAllRates(false);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

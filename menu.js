/* ==========================================
   SISTEMA DE MENÚ FLOTANTE Y NAVEGACIÓN - OMNIPLEX
   ========================================== */

// Función para abrir el menú flotante
function openMenu() {
  let overlay = document.getElementById('omni-menu-overlay');
  if (!overlay) {
    createMenuDOM();
    overlay = document.getElementById('omni-menu-overlay');
  }
  
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    const searchInput = overlay.querySelector('.menu-search-input');
    if (searchInput) searchInput.focus();
  }, 200);
}

// Función para cerrar el menú flotante
function closeMenu() {
  const overlay = document.getElementById('omni-menu-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Navegación suave a secciones del Hub principal
function navigateToSection(id) {
  closeMenu();
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, 150);
}

// Función para abrir el Modal con el QR de la propia web
function openWebQRModal() {
  closeMenu();
  
  const currentURL = window.location.href;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(currentURL)}`;

  let modal = document.getElementById('omni-qr-web-modal');
  if (!modal) {
    const modalHTML = `
      <div class="menu-overlay active" id="omni-qr-web-modal" onclick="closeWebQRModal()">
        <div class="menu-container qr-share-container" onclick="event.stopPropagation()">
          <div class="menu-header">
            <h3>📱 Escanea OmniPlex</h3>
            <button class="menu-close-btn" onclick="closeWebQRModal()">
              <i data-lucide="x" size="18"></i>
            </button>
          </div>
          <p>Apunta la cámara para abrir esta app en otro dispositivo:</p>
          <div class="qr-share-box">
            <img id="omniWebQrImg" src="${qrApiUrl}" alt="QR OmniPlex">
          </div>
          <button class="menu-close-btn" style="width: 100%; border-radius: 10px; background: #0066ff; color: white; font-weight: 700; height: 42px;" onclick="closeWebQRModal()">
            Listo 👍
          </button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  } else {
    document.getElementById('omniWebQrImg').src = qrApiUrl;
    modal.classList.add('active');
  }

  if (window.lucide) lucide.createIcons();
}

function closeWebQRModal() {
  const modal = document.getElementById('omni-qr-web-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// Estructura HTML del Menú (Sin minijuegos)
function createMenuDOM() {
  const menuHTML = `
    <div class="menu-overlay" id="omni-menu-overlay" onclick="closeMenu()">
      <div class="menu-container" onclick="event.stopPropagation()">
        
        <div class="menu-header">
          <h3>Navegación & Menú</h3>
          <button class="menu-close-btn" onclick="closeMenu()" aria-label="Cerrar menú">
            <i data-lucide="x" size="18"></i>
          </button>
        </div>

        <div class="menu-search-box">
          <i data-lucide="search" size="18"></i>
          <input type="text" class="menu-search-input" placeholder="Buscar herramienta o juego..." onkeyup="filterFromMenu(this.value)">
        </div>

        <div class="menu-links">
          <a href="#" class="menu-item" onclick="closeMenu(); window.scrollTo({top: 0, behavior: 'smooth'}); return false;">
            <i data-lucide="home" size="18"></i> Inicio / Hub
          </a>
          
          <a href="#" class="menu-item" onclick="navigateToSection('section-finanzas'); return false;">
            <i data-lucide="landmark" size="18"></i> Finanzas & Utilidades
          </a>

          <a href="#" class="menu-item" onclick="navigateToSection('section-juegos'); return false;">
            <i data-lucide="gamepad-2" size="18"></i> Juegos & Entretenimiento
          </a>

          <!-- OPCIÓN PARA COMPARTIR QR -->
          <a href="#" class="menu-item" onclick="openWebQRModal(); return false;">
            <i data-lucide="qr-code" size="18"></i> Compartir App (Código QR)
          </a>

          <a href="#" class="menu-item" onclick="navigateToSection('section-comentarios'); return false;">
            <i data-lucide="message-square" size="18"></i> Dejar un Comentario
          </a>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', menuHTML);
  
  if (window.lucide) {
    lucide.createIcons();
  }
}

// Filtro integrado con el buscador principal del Hub
function filterFromMenu(query) {
  const mainInput = document.getElementById('searchInput');
  if (mainInput) {
    mainInput.value = query;
    if (typeof filterProjects === 'function') {
      filterProjects();
    }
  }
}

// Cerrar menús con la tecla Escape
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeMenu();
    closeWebQRModal();
  }
});
   

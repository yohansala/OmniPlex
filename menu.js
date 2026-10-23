// Función para abrir el menú flotante
function openMenu() {
  let overlay = document.getElementById('omni-menu-overlay');
  if (!overlay) {
    createMenuDOM();
    overlay = document.getElementById('omni-menu-overlay');
  }
  overlay.classList.add('active');
}

// Función para cerrar el menú flotante
function closeMenu() {
  const overlay = document.getElementById('omni-menu-overlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
}

// Navegación suave a secciones y cierre automático del menú
function navigateToSection(id) {
  closeMenu();
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, 150);
}

// Estructura HTML del Menú vinculada con menu.css
function createMenuDOM() {
  const menuHTML = `
    <div class="menu-overlay" id="omni-menu-overlay" onclick="closeMenu()">
      <div class="menu-container" onclick="event.stopPropagation()">
        
        <div class="menu-header">
          <h3>Navegación & Menú</h3>
          <button class="menu-close-btn" onclick="closeMenu()">
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

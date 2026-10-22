/* ==========================================
   LÓGICA DEL MENÚ Y BÚSQUEDA EN TIEMPO REAL
   ========================================== */

function initMenu() {
  // Verificar si ya existe para no duplicarlo
  if (document.getElementById("menuOverlay")) return;

  const menuHTML = `
    <div class="menu-overlay" id="menuOverlay">
      <div class="menu-container">
        <div class="menu-header">
          <h3>Navegación & Menú</h3>
          <button class="menu-close-btn" id="closeMenuBtn">
            <i data-lucide="x" size="18"></i>
          </button>
        </div>

        <!-- Búsqueda rápida de proyectos -->
        <div class="menu-search-box">
          <i data-lucide="search" size="18"></i>
          <input type="text" id="menuSearchInput" class="menu-search-input" placeholder="Buscar herramienta o juego...">
        </div>

        <!-- Enlaces directos -->
        <div class="menu-links">
          <a href="#" class="menu-item" onclick="closeMenu()">
            <i data-lucide="home" size="18"></i> Inicio / Hub
          </a>
          <a href="#section-finanzas" class="menu-item" onclick="closeMenu()">
            <i data-lucide="landmark" size="18"></i> Finanzas & Utilidades
          </a>
          <a href="#section-juegos" class="menu-item" onclick="closeMenu()">
            <i data-lucide="gamepad-2" size="18"></i> Juegos & Entretenimiento
          </a>
          <a href="#section-comentarios" class="menu-item" onclick="closeMenu()">
            <i data-lucide="message-square" size="18"></i> Dejar un Comentario
          </a>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", menuHTML);

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  const menuOverlay = document.getElementById("menuOverlay");
  const closeMenuBtn = document.getElementById("closeMenuBtn");
  const searchInput = document.getElementById("menuSearchInput");

  if (closeMenuBtn) closeMenuBtn.addEventListener("click", closeMenu);

  if (menuOverlay) {
    menuOverlay.addEventListener("click", (e) => {
      if (e.target === menuOverlay) closeMenu();
    });
  }

  // BÚSQUEDA EN TIEMPO REAL
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      const cards = document.querySelectorAll(".project-card");

      cards.forEach((card) => {
        const title = card.querySelector("h3") ? card.querySelector("h3").textContent.toLowerCase() : "";
        const desc = card.querySelector("p") ? card.querySelector("p").textContent.toLowerCase() : "";

        if (title.includes(query) || desc.includes(query)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMenu);
} else {
  initMenu();
}

// Funciones globales para abrir y cerrar
function openMenu() {
  const overlay = document.getElementById("menuOverlay");
  if (overlay) overlay.classList.add("active");
}

function closeMenu() {
  const overlay = document.getElementById("menuOverlay");
  if (overlay) overlay.classList.remove("active");
}

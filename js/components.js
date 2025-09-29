// Función para cargar componentes
async function loadComponents() {
    try {
        // Cargar Header
        const headerResponse = await fetch('components/header.html');
        const headerHTML = await headerResponse.text();
        document.body.insertAdjacentHTML('afterbegin', headerHTML);

        // Cargar Footer
        const footerResponse = await fetch('components/footer.html');
        const footerHTML = await footerResponse.text();
        document.body.insertAdjacentHTML('beforeend', footerHTML);

        // Inicializar funcionalidad del menú después de cargar los componentes
        initMenu();
    } catch (error) {
        console.error('Error al cargar los componentes:', error);
    }
}

// Inicializar el menú
function initMenu() {
    // Elementos del DOM
    const menuToggle = document.querySelector('.menu-toggle');
    const offcanvasMenu = document.querySelector('.offcanvas-menu');
    const offcanvasOverlay = document.querySelector('.offcanvas-overlay');
    const closeMenuBtn = document.querySelector('.close-menu');
    const body = document.body;
    const submenuTriggers = document.querySelectorAll('.submenu-trigger');
    
    // Abrir menú off-canvas
    function openMenu() {
        offcanvasMenu.classList.add('active');
        offcanvasOverlay.classList.add('active');
        body.classList.add('menu-open');
        document.documentElement.style.overflow = 'hidden';
        closeAllSubmenus();
    }
    
    // Cerrar menú off-canvas
    function closeMenu() {
        offcanvasMenu.classList.remove('active');
        offcanvasOverlay.classList.remove('active');
        body.classList.remove('menu-open');
        document.documentElement.style.overflow = '';
    }
    
    // Cerrar todos los submenús
    function closeAllSubmenus() {
        document.querySelectorAll('.has-submenu').forEach(item => {
            item.classList.remove('active');
        });
    }
    
    // Toggle submenú
    function toggleSubmenu(e) {
        e.preventDefault();
        const parent = this.closest('.has-submenu');
        const isOpen = parent.classList.contains('active');
        
        if (!isOpen) {
            document.querySelectorAll('.has-submenu').forEach(item => {
                if (item !== parent) {
                    item.classList.remove('active');
                }
            });
        }
        
        parent.classList.toggle('active');
    }
    
    // Event Listeners
    if (menuToggle) menuToggle.addEventListener('click', openMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
    if (offcanvasOverlay) offcanvasOverlay.addEventListener('click', closeMenu);
    
    // Manejar submenús
    if (submenuTriggers.length > 0) {
        submenuTriggers.forEach(trigger => {
            trigger.addEventListener('click', toggleSubmenu);
        });
    }
    
    // Cerrar menú con la tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && offcanvasMenu && offcanvasMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

// Cargar componentes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    loadComponents();
    
    // Asegurar que el contenido principal tenga padding-top para el header fijo
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.style.paddingTop = '90px';
    }
    
    // Cargar el script del Hero
    const heroScript = document.createElement('script');
    heroScript.src = 'js/hero.js';
    document.body.appendChild(heroScript);
});

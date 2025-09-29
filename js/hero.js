/**
 * Hero Component
 * Maneja el comportamiento y la apariencia de las secciones Hero en todas las páginas
 */

document.addEventListener('DOMContentLoaded', function() {
    // Asegurar que el Hero ocupe todo el ancho de la pantalla
    const heroSections = document.querySelectorAll('.hero');
    
    heroSections.forEach(hero => {
        // Asegurar que el contenedor del Hero tenga la clase correcta
        const heroContent = hero.querySelector('.hero-content');
        if (heroContent && !heroContent.classList.contains('hero-content')) {
            heroContent.classList.add('hero-content');
        }
        
        // Asegurar que el título tenga la clase correcta
        const heroTitle = hero.querySelector('h1');
        if (heroTitle && !heroTitle.classList.contains('hero-title')) {
            heroTitle.classList.add('hero-title');
        }
        
        // Asegurar que el subtítulo tenga la clase correcta
        const heroSubtitle = hero.querySelector('p');
        if (heroSubtitle && !heroSubtitle.classList.contains('hero-subtitle')) {
            heroSubtitle.classList.add('hero-subtitle');
        }
        
        // Asegurar que el botón CTA esté envuelto en un contenedor
        const ctaButton = hero.querySelector('a.btn-gold, button.btn-gold');
        if (ctaButton && !ctaButton.closest('.cta-container')) {
            const ctaContainer = document.createElement('div');
            ctaContainer.className = 'cta-container';
            ctaButton.parentNode.insertBefore(ctaContainer, ctaButton);
            ctaContainer.appendChild(ctaButton);
        }
    });
});

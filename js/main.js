// Código JavaScript específico de la página principal
// La lógica del menú se ha movido a components.js

document.addEventListener('DOMContentLoaded', function() {
    // Aquí puedes agregar cualquier funcionalidad específica de la página principal
    
    // Ejemplo: Animación de scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 90, // Ajuste para el header fijo
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Ejemplo: Lazy loading para imágenes
    if ('loading' in HTMLImageElement.prototype) {
        // El navegador soporta lazy loading nativo
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Cargar un polyfill para lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/vanilla-lazyload/17.4.1/lazyload.min.js';
        document.body.appendChild(script);
        
        script.onload = function() {
            const lazyLoadInstance = new LazyLoad({
                elements_selector: '.lazy'
            });
        };
    }
    
    // Manejo del reproductor de video
    const videoThumbnail = document.querySelector('.video-thumbnail');
    const videoIframe = document.querySelector('.video-iframe');
    
    if (videoThumbnail && videoIframe) {
        videoThumbnail.addEventListener('click', function() {
            // Reemplaza 'TU_ID_DE_VIDEO' con el ID real de tu video de YouTube/Vimeo
            const videoId = 'TU_ID_DE_VIDEO';
            const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&autohide=1`;
            
            // Crear el iframe del video
            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', embedUrl);
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            iframe.setAttribute('allowfullscreen', '');
            
            // Limpiar contenido previo y agregar el nuevo iframe
            videoIframe.innerHTML = '';
            videoIframe.appendChild(iframe);
            
            // Mostrar el iframe y ocultar la miniatura
            videoIframe.style.display = 'block';
            videoThumbnail.style.display = 'none';
            
            // Agregar clase para estilos adicionales si es necesario
            videoIframe.classList.add('video-loaded');
        });
        
        // Opcional: Manejar la tecla Enter para accesibilidad
        videoThumbnail.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                this.click();
            }
        });
    }
    
    // Inicializar el carrusel de testimonios
    if ($('.testimonials-carousel').length) {
        $('.testimonials-carousel').slick({
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 5000,
            pauseOnHover: true,
            arrows: true,
            prevArrow: '<button type="button" class="slick-prev"><i class="fas fa-chevron-left"></i></button>',
            nextArrow: '<button type="button" class="slick-next"><i class="fas fa-chevron-right"></i></button>',
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        arrows: false
                    }
                }
            ]
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Carousel functionality
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    
    let currentSlide = 0;
    const slideWidth = slides[0].getBoundingClientRect().width;
    
    // Set the position of slides
    const setSlidePosition = (slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    };
    
    slides.forEach(setSlidePosition);
    
    // Move to slide
    const moveToSlide = (track, currentSlide, targetSlide) => {
        track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
        currentSlide = targetSlide.dataset.index;
        return currentSlide;
    };
    
    // Next slide
    nextButton.addEventListener('click', function() {
        const current = document.querySelector('.current-slide');
        const next = current.nextElementSibling || track.firstElementChild;
        
        // Move to next slide
        const amountToMove = next.style.left;
        track.style.transform = 'translateX(-' + amountToMove + ')';
        
        // Update current slide
        current.classList.remove('current-slide');
        next.classList.add('current-slide');
    });
    
    // Previous slide
    prevButton.addEventListener('click', function() {
        const current = document.querySelector('.current-slide');
        const prev = current.previousElementSibling || track.lastElementChild;
        
        // Move to previous slide
        const amountToMove = prev.style.left;
        track.style.transform = 'translateX(-' + amountToMove + ')';
        
        // Update current slide
        current.classList.remove('current-slide');
        prev.classList.add('current-slide');
    });
    
    // Initialize first slide
    slides[0].classList.add('current-slide');
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

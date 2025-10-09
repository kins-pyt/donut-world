// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Get the button element
    const welcomeBtn = document.getElementById('welcome-btn');
    
    // Add click event listener to the button
    welcomeBtn.addEventListener('click', function() {
        alert('Terima kasih! Donut lezat sedang dipersiapkan untuk Anda!');
        
        // Change button text temporarily
        const originalText = welcomeBtn.textContent;
        welcomeBtn.textContent = 'Donut Sedang Diproses...';
        
        // Revert back after 2 seconds
        setTimeout(function() {
            welcomeBtn.textContent = originalText;
        }, 2000);
    });
    
    // Mode Toggle Functionality
    const modeToggle = document.getElementById('mode-toggle');
    const modeIcon = modeToggle.querySelector('i');
    
    modeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            modeIcon.classList.remove('fa-moon');
            modeIcon.classList.add('fa-sun');
        } else {
            modeIcon.classList.remove('fa-sun');
            modeIcon.classList.add('fa-moon');
        }
        
        // Save preference to localStorage
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
    });
    
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
        modeIcon.classList.remove('fa-moon');
        modeIcon.classList.add('fa-sun');
    }
    
    // Navigation Functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            contentSections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');
        });
    });
    
    // Carousel Functionality
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    let currentSlide = 0;
    
    function showSlide(index) {
        // Hide all slides
        carouselSlides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Show current slide
        carouselSlides[index].classList.add('active');
        indicators[index].classList.add('active');
        currentSlide = index;
    }
    
    function nextSlide() {
        let nextIndex = (currentSlide + 1) % carouselSlides.length;
        showSlide(nextIndex);
    }
    
    function prevSlide() {
        let prevIndex = (currentSlide - 1 + carouselSlides.length) % carouselSlides.length;
        showSlide(prevIndex);
    }
    
    // Add event listeners for carousel buttons
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Add event listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Auto advance carousel
    setInterval(nextSlide, 5000);
    
    // Form submission
    const contactForm = document.querySelector('.contact-form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Terima kasih! Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.');
        this.reset();
    });
    
    // Simple console message
    console.log('Donut World website loaded successfully!');
});
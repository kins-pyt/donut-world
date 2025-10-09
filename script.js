// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
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
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Simple console message
    console.log('Donut World website loaded successfully!');
});
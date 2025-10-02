// Simple JavaScript for Donut World website

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
    
    // Simple console message
    console.log('Donut World website loaded successfully!');
});
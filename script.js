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
    
    // Login Functionality
    // Get modal elements
    const loginModal = document.getElementById('loginModal');
    const loginBtn = document.getElementById('loginBtn');
    const closeBtn = document.querySelector('.close');
    const loginForm = document.getElementById('loginForm');
    const showRegister = document.getElementById('showRegister');
    
    // Open modal when login button is clicked
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            if (loginBtn.classList.contains('logged-in')) {
                // User is already logged in, perform logout
                loginBtn.textContent = 'Login';
                loginBtn.classList.remove('logged-in');
                alert('You have been logged out!');
            } else {
                // User is not logged in, show login modal
                loginModal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });
    }
    
    // Close modal when X is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
            resetForm();
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
            resetForm();
        }
    });
    
    // Form validation and submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            // Reset error messages
            resetErrors();
            
            // Validate form
            let isValid = true;
            
            if (!username) {
                showError('usernameError', 'Username or email is required');
                isValid = false;
            }
            
            if (!password) {
                showError('passwordError', 'Password is required');
                isValid = false;
            } else if (password.length < 6) {
                showError('passwordError', 'Password must be at least 6 characters');
                isValid = false;
            }
            
            // If form is valid, simulate login
            if (isValid) {
                simulateLogin(username, password);
            }
        });
    }
    
    // Show register form (placeholder)
    if (showRegister) {
        showRegister.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Registration feature coming soon!');
        });
    }
    
    // Helper functions
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
    
    function resetErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
    }
    
    function resetForm() {
        if (loginForm) {
            loginForm.reset();
        }
        resetErrors();
    }
    
    function simulateLogin(username, password) {
        // In a real application, you would send this to a server
        // For demo purposes, we'll simulate a successful login
        
        // Show loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            // For demo, any username/password combination is valid
            // In a real app, you would validate against a database
            
            // Show success animation
            showSuccessAnimation();
            
            // Update UI to show user is logged in
            setTimeout(() => {
                loginBtn.textContent = 'Logout';
                loginBtn.classList.add('logged-in');
                
                loginModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                resetForm();
                
                // Show welcome message
                alert(`Welcome back, ${username}!`);
            }, 1500);
            
        }, 1500);
    }
    
    function showSuccessAnimation() {
        // Create success animation elements
        const successDiv = document.createElement('div');
        successDiv.className = 'success-checkmark';
        successDiv.innerHTML = `
            <div class="check-icon">
                <span class="icon-line line-tip"></span>
                <span class="icon-line line-long"></span>
            </div>
        `;
        
        // Insert before the form
        loginForm.parentNode.insertBefore(successDiv, loginForm);
        
        // Hide form and show animation
        loginForm.style.display = 'none';
        successDiv.style.display = 'block';
        
        // Remove animation after completion
        setTimeout(() => {
            successDiv.remove();
            loginForm.style.display = 'block';
            
            // Reset button state
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Login';
            submitBtn.disabled = false;
        }, 2500);
    }
    
    // Simple console message
    console.log('Donut World website loaded successfully!');
});
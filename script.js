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

/* ===== MENU PAGE EXTRAS ===== */
document.addEventListener('DOMContentLoaded', function () {
  const grid = document.getElementById('menuGrid');
  const chipsWrap = document.getElementById('menuChips');
  const searchInput = document.getElementById('menuSearch');
  const sortSelect = document.getElementById('menuSort');

  if (!grid) return; // Hanya jalan di menu.html

  const cards = Array.from(grid.querySelectorAll('.menu-card'));

  function filterAndRender() {
    const activeCatBtn = chipsWrap?.querySelector('.chip.active');
    const cat = activeCatBtn ? activeCatBtn.dataset.category : 'all';
    const q = (searchInput?.value || '').trim().toLowerCase();
    const sort = (sortSelect?.value || 'default');

    let visible = cards.filter(card => {
      const c = card.dataset.category || '';
      const name = (card.dataset.name || '').toLowerCase();
      const tags = (card.dataset.tags || '').toLowerCase();

      const byCat = cat === 'all' ? true : c === cat;
      const bySearch = q === '' ? true : (name.includes(q) || tags.includes(q));
      return byCat && bySearch;
    });

    // Sorting
    if (sort === 'price-asc') {
      visible.sort((a, b) => (+a.dataset.price) - (+b.dataset.price));
    } else if (sort === 'price-desc') {
      visible.sort((a, b) => (+b.dataset.price) - (+a.dataset.price));
    } else if (sort === 'name-asc') {
      visible.sort((a, b) => (a.dataset.name || '').localeCompare(b.dataset.name || ''));
    } else if (sort === 'name-desc') {
      visible.sort((a, b) => (b.dataset.name || '').localeCompare(a.dataset.name || ''));
    }

    // Render (urut ulang DOM sesuai hasil sort/filter)
    const frag = document.createDocumentFragment();
    visible.forEach(el => frag.appendChild(el));
    grid.innerHTML = '';
    grid.appendChild(frag);
  }

  // Event: kategori chips
  chipsWrap?.addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b) return;
    chipsWrap.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    b.classList.add('active');
    filterAndRender();
  });

  // Event: search
  searchInput?.addEventListener('input', () => filterAndRender());

  // Event: sort
  sortSelect?.addEventListener('change', () => filterAndRender());

  // Inisialisasi tombol WA (satu per item)
  function encodeWA(text) {
    return encodeURIComponent(text);
  }
  grid.addEventListener('click', (e) => {
    const a = e.target.closest('.wa-order');
    if (!a) return;
    const phone = a.dataset.wa || '6281234567890';
    const text = a.dataset.waText || 'Halo, saya ingin memesan.';
    a.href = `https://wa.me/${phone}?text=${encodeWA(text)}`;
  });

  // First render
  filterAndRender();
});

/* ===== STORES PAGE EXTRAS ===== */
document.addEventListener('DOMContentLoaded', function () {
  const grid = document.getElementById('storesGrid');
  const searchInput = document.getElementById('storeSearch');
  const sortSelect = document.getElementById('storeSort');
  const chipsWrap = document.getElementById('storeChips');
  const useMyLocationBtn = document.getElementById('useMyLocation');

  const mapTitle = document.getElementById('mapTitle');
  const mapSubtitle = document.getElementById('mapSubtitle');
  const mapIframe = document.getElementById('mapIframe');

  if (!grid) return; // jalan hanya di stores.html

  const cards = Array.from(grid.querySelectorAll('.store-card'));
  let userPos = null;

  // Helpers
  function toMinutes(t) {
    // "08:30" -> 510
    const [h, m] = t.split(':').map(Number);
    return h * 60 + (m || 0);
  }
  function isOpenToday(hoursMap) {
    // hoursMap: {"Mon":"08:00-21:00", ...}
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const now = new Date();
    const day = days[now.getDay()];
    const range = hoursMap?.[day];
    if (!range) return { open: false, text: 'Jam tidak tersedia' };
    const [openT, closeT] = range.split('-');
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const openMin = toMinutes(openT);
    const closeMin = toMinutes(closeT);
    const open = nowMin >= openMin && nowMin <= closeMin;
    return { open, text: range.replace(':', '.').replace('-', '–') };
  }
  function setStatusBadge(card) {
    try {
      const hoursMap = JSON.parse(card.dataset.hours || '{}');
      const st = isOpenToday(hoursMap);
      const badge = card.querySelector('[data-openbadge]');
      const ht = card.querySelector('[data-hourstext]');
      if (badge) {
        badge.textContent = st.open ? 'Buka' : 'Tutup';
        badge.classList.toggle('open', st.open);
        badge.classList.toggle('closed', !st.open);
        badge.classList.add('store-status');
      }
      if (ht && st.text) ht.textContent = `Hari ini ${st.text}`;
    } catch (_) {}
  }
  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const toRad = (d) => d * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
  function updateLinks(card) {
    const name = card.dataset.name || 'Donut World';
    const wa = card.dataset.wa || '6281234567890';
    const phone = card.dataset.phone || '';
    const address = card.querySelector('[data-address]')?.textContent.trim() || '';
    const lat = parseFloat(card.dataset.lat);
    const lng = parseFloat(card.dataset.lng);

    const dir = card.querySelector('[data-directions]');
    const call = card.querySelector('[data-call]');
    const waBtn = card.querySelector('[data-wa]');
    const copy = card.querySelector('[data-copy]');

    if (dir) {
      const q = lat && lng ? `${lat},${lng}` : encodeURIComponent(address);
      dir.href = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
      dir.addEventListener('click', () => {
        // tampilkan di map highlight
        mapTitle.textContent = name;
        mapSubtitle.textContent = address;
        mapIframe.src = `https://www.google.com/maps?q=${q}&output=embed`;
      });
    }
    if (call && phone) call.href = `tel:${phone}`;
    if (waBtn) waBtn.href = `https://wa.me/${wa}?text=${encodeURIComponent('Halo Donut World! Saya mau menanyakan ketersediaan produk.')}`;
    if (copy) {
      copy.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(address);
          copy.innerHTML = '<i class="fas fa-check"></i> Disalin!';
          setTimeout(() => copy.innerHTML = '<i class="fas fa-copy"></i> Salin Alamat', 1200);
        } catch (_) {}
      });
    }
  }

  // Init badges + links
  cards.forEach(c => { setStatusBadge(c); updateLinks(c); });

  // Filter + search + sort
  function currentCity() {
    const active = chipsWrap?.querySelector('.chip.active');
    return active ? active.dataset.city : 'all';
  }
  function filterCards() {
    const q = (searchInput?.value || '').trim().toLowerCase();
    const city = currentCity();
    let list = cards.filter(card => {
      const name = (card.dataset.name || '').toLowerCase();
      const theCity = (card.dataset.city || '').toLowerCase();
      const addr = (card.querySelector('[data-address]')?.textContent || '').toLowerCase();
      const byCity = city === 'all' ? true : theCity === city.toLowerCase();
      const bySearch = q === '' ? true : (name.includes(q) || addr.includes(q) || theCity.includes(q));
      card.style.display = (byCity && bySearch) ? '' : 'none';
      return byCity && bySearch;
    });

    // Sorting
    const mode = (sortSelect?.value || 'default');
    if (mode === 'name-asc') {
      list.sort((a,b)=> (a.dataset.name||'').localeCompare(b.dataset.name||''));
    } else if (mode === 'name-desc') {
      list.sort((a,b)=> (b.dataset.name||'').localeCompare(a.dataset.name||''));
    } else if (mode === 'nearest' && userPos) {
      list.sort((a,b) => {
        const da = haversine(userPos.lat, userPos.lng, parseFloat(a.dataset.lat), parseFloat(a.dataset.lng));
        const db = haversine(userPos.lat, userPos.lng, parseFloat(b.dataset.lat), parseFloat(b.dataset.lng));
        return da - db;
      });
    }

    // Re-append for visual reorder
    const fragment = document.createDocumentFragment();
    list.forEach(el => fragment.appendChild(el));
    grid.appendChild(fragment);
  }

  chipsWrap?.addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b) return;
    chipsWrap.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    b.classList.add('active');
    filterCards();
  });
  searchInput?.addEventListener('input', filterCards);
  sortSelect?.addEventListener('change', filterCards);

  // Geolocation
  useMyLocationBtn?.addEventListener('click', () => {
    if (!navigator.geolocation) {
      alert('Geolocation tidak didukung di browser Anda.');
      return;
    }
    useMyLocationBtn.disabled = true;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        useMyLocationBtn.innerHTML = '<i class="fas fa-location-dot"></i> Lokasi Terdeteksi';
        sortSelect.value = 'nearest';
        filterCards();
      },
      () => {
        alert('Gagal mendapatkan lokasi. Pastikan izin lokasi diizinkan.');
        useMyLocationBtn.disabled = false;
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });

  // Default render
  filterCards();
});

/* ===== CONTACT PAGE FUNCTIONALITY ===== */
document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.getElementById('contactForm');
  const faqItems = document.querySelectorAll('.faq-item');
  
  // Only run on contact page
  if (!contactForm) return;
  
  // Contact Form Submission
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    
    // Simple validation
    if (!name || !email || !subject) {
      alert('Harap lengkapi semua field yang wajib diisi.');
      return;
    }
    
    // In a real application, you would send the data to a server here
    // For now, we'll just show a success message
    alert(`Terima kasih ${name}! Pesan Anda telah berhasil dikirim. Kami akan membalas ke ${email} dalam 1-2 hari kerja.`);
    
    // Reset form
    contactForm.reset();
  });
  
  // FAQ Accordion Functionality
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });
});

/* ===== LOGIN FUNCTIONALITY ===== */
document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const loginModal = document.getElementById('loginModal');
    const loginBtn = document.getElementById('loginBtn');
    const closeBtn = document.querySelector('.close');
    const loginForm = document.getElementById('loginForm');
    const showRegister = document.getElementById('showRegister');
    
    // Check if elements exist (only on pages with login)
    if (!loginBtn) return;
    
    // Open modal when login button is clicked
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
    
    // Close modal when X is clicked
    closeBtn.addEventListener('click', function() {
        loginModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
        resetForm();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
            resetForm();
        }
    });
    
    // Form validation and submission
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
    
    // Show register form (placeholder)
    showRegister.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Registration feature coming soon!');
    });
    
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
        loginForm.reset();
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
});

/* ===== ADMIN LOGIN & DASHBOARD ===== */
document.addEventListener('DOMContentLoaded', function() {
    // Admin credentials
    const ADMIN_CREDENTIALS = {
        username: 'admin',
        password: 'admin123',
        email: 'admin@donutworld.com'
    };

    // Check if user is already logged in
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('adminLoggedIn');
        const loginBtn = document.getElementById('loginBtn');
        
        if (isLoggedIn === 'true' && loginBtn) {
            loginBtn.textContent = 'Dashboard';
            loginBtn.classList.add('logged-in');
        }
    }

    // Enhanced login functionality
    function initLoginSystem() {
        const loginModal = document.getElementById('loginModal');
        const loginBtn = document.getElementById('loginBtn');
        const closeBtn = document.querySelector('.close');
        const loginForm = document.getElementById('loginForm');
        const showRegister = document.getElementById('showRegister');

        if (!loginBtn) return;

        // Open modal or go to dashboard
        loginBtn.addEventListener('click', function() {
            if (loginBtn.classList.contains('logged-in')) {
                // User is logged in, go to dashboard
                window.location.href = 'dashboard.html';
            } else {
                // Show login modal
                loginModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });

        // Close modal
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                loginModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                resetForm();
            });
        }

        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === loginModal) {
                loginModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                resetForm();
            }
        });

        // Form submission
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleLogin();
            });
        }

        // Register link
        if (showRegister) {
            showRegister.addEventListener('click', function(e) {
                e.preventDefault();
                alert('Registration feature coming soon!');
            });
        }
    }

    function handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        resetErrors();
        
        let isValid = true;
        
        if (!username) {
            showError('usernameError', 'Username or email is required');
            isValid = false;
        }
        
        if (!password) {
            showError('passwordError', 'Password is required');
            isValid = false;
        }
        
        if (isValid) {
            authenticateUser(username, password);
        }
    }

    function authenticateUser(username, password) {
        const submitBtn = document.querySelector('#loginForm button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            if ((username === ADMIN_CREDENTIALS.username || username === ADMIN_CREDENTIALS.email) && 
                password === ADMIN_CREDENTIALS.password) {
                
                // Successful login
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminUsername', username);
                
                showSuccessAnimation(() => {
                    window.location.href = 'dashboard.html';
                });
                
            } else {
                // Failed login
                showError('passwordError', 'Invalid username or password');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }, 1500);
    }

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
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.reset();
        }
        resetErrors();
    }

    function showSuccessAnimation(callback) {
        const loginForm = document.getElementById('loginForm');
        const successDiv = document.createElement('div');
        successDiv.className = 'success-checkmark';
        successDiv.innerHTML = `
            <div class="check-icon">
                <span class="icon-line line-tip"></span>
                <span class="icon-line line-long"></span>
            </div>
            <p style="margin-top: 20px; color: var(--primary-color); font-weight: 600;">Login Successful!</p>
        `;
        
        if (loginForm) {
            loginForm.parentNode.insertBefore(successDiv, loginForm);
            loginForm.style.display = 'none';
            successDiv.style.display = 'block';
            
            setTimeout(() => {
                if (callback) callback();
            }, 2000);
        }
    }

    // Initialize
    checkLoginStatus();
    initLoginSystem();
});

/* ===== DASHBOARD FUNCTIONALITY ===== */
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on dashboard page
    if (!window.location.pathname.includes('dashboard.html')) return;

    // Check authentication
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    // Initialize dashboard
    initDashboard();
});

function initDashboard() {
    const adminUsername = localStorage.getItem('adminUsername') || 'Admin';
    
    // Update welcome message
    const welcomeElement = document.getElementById('adminWelcome');
    if (welcomeElement) {
        welcomeElement.textContent = `Welcome, ${adminUsername}!`;
    }

    // Initialize menu management
    initMenuManagement();
    
    // Initialize store management
    initStoreManagement();
    
    // Initialize order management
    initOrderManagement();

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('adminUsername');
            window.location.href = 'index.html';
        });
    }
}

function initMenuManagement() {
    let menuItems = JSON.parse(localStorage.getItem('donutMenu')) || [
        {
            id: 1,
            name: 'Donut Cokelat Belgian',
            description: 'Lapisan cokelat Belgian pekat, manis seimbang.',
            price: 18000,
            category: 'chocolate',
            image: 'https://131409694.cdn6.editmysite.com/uploads/1/3/1/4/131409694/I6NBQXDTPXK4NBEQQRPEZDNO.jpeg?width=2560&optimize=medium',
            featured: true
        },
        {
            id: 2,
            name: 'Donut Rainbow',
            description: 'Donut warna-warni dengan glaze yang manis',
            price: 18000,
            category: 'colorful',
            image: 'https://hips.hearstapps.com/hmg-prod/images/types-of-doughnuts-1666119864.jpg?crop=0.502xw:1.00xh;0.250xw,0&resize=400:*',
            featured: true
        },
        {
            id: 3,
            name: 'Donut Glaze',
            description: 'Donut dengan glaze cokelat yang menggiurkan',
            price: 16000,
            category: 'chocolate',
            image: 'https://thefirstyearblog.com/wp-content/uploads/2020/09/Baked-Chocolate-Donuts-35B.jpg',
            featured: true
        }
    ];

    // Save initial menu if not exists
    if (!localStorage.getItem('donutMenu')) {
        localStorage.setItem('donutMenu', JSON.stringify(menuItems));
    }

    // Render menu items
    renderMenuItems();

    // Add menu form handler
    const addMenuForm = document.getElementById('addMenuForm');
    if (addMenuForm) {
        addMenuForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addMenuItem();
        });
    }

    function renderMenuItems() {
        const menuGrid = document.getElementById('menuGrid');
        if (!menuGrid) return;

        menuGrid.innerHTML = '';

        menuItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item-card';
            menuItem.innerHTML = `
                <div class="menu-item-image">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="menu-item-actions">
                        <button class="btn-edit" onclick="editMenuItem(${item.id})">Edit</button>
                        <button class="btn-delete" onclick="deleteMenuItem(${item.id})">Delete</button>
                    </div>
                </div>
                <div class="menu-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                    <div class="menu-item-meta">
                        <span class="price">Rp ${item.price.toLocaleString()}</span>
                        <span class="category">${item.category}</span>
                        ${item.featured ? '<span class="featured">Featured</span>' : ''}
                    </div>
                </div>
            `;
            menuGrid.appendChild(menuItem);
        });

        // Update stats
        updateStats();
    }

    function addMenuItem() {
        const name = document.getElementById('menuName').value;
        const description = document.getElementById('menuDescription').value;
        const price = parseInt(document.getElementById('menuPrice').value);
        const category = document.getElementById('menuCategory').value;
        const image = document.getElementById('menuImage').value;
        const featured = document.getElementById('menuFeatured').checked;

        const newItem = {
            id: Date.now(),
            name,
            description,
            price,
            category,
            image: image || 'https://via.placeholder.com/300x200?text=Donut+Image',
            featured
        };

        menuItems.push(newItem);
        localStorage.setItem('donutMenu', JSON.stringify(menuItems));
        renderMenuItems();
        
        // Reset form
        document.getElementById('addMenuForm').reset();
        
        // Show success message
        showNotification('Menu item added successfully!', 'success');
    }

    // Make functions global for onclick handlers
    window.editMenuItem = function(id) {
        const item = menuItems.find(item => item.id === id);
        if (item) {
            document.getElementById('menuName').value = item.name;
            document.getElementById('menuDescription').value = item.description;
            document.getElementById('menuPrice').value = item.price;
            document.getElementById('menuCategory').value = item.category;
            document.getElementById('menuImage').value = item.image;
            document.getElementById('menuFeatured').checked = item.featured;
            
            // Change form to edit mode
            const form = document.getElementById('addMenuForm');
            form.dataset.editId = id;
            form.querySelector('button[type="submit"]').textContent = 'Update Menu Item';
            
            showNotification('Edit mode activated. Update the fields and click "Update Menu Item"', 'info');
        }
    };

    window.deleteMenuItem = function(id) {
        if (confirm('Are you sure you want to delete this menu item?')) {
            menuItems = menuItems.filter(item => item.id !== id);
            localStorage.setItem('donutMenu', JSON.stringify(menuItems));
            renderMenuItems();
            showNotification('Menu item deleted successfully!', 'success');
        }
    };

    function updateStats() {
        const totalMenuItems = document.getElementById('totalMenuItems');
        const featuredItems = document.getElementById('featuredItems');
        const totalValue = document.getElementById('totalValue');

        if (totalMenuItems) totalMenuItems.textContent = menuItems.length;
        if (featuredItems) featuredItems.textContent = menuItems.filter(item => item.featured).length;
        if (totalValue) {
            const total = menuItems.reduce((sum, item) => sum + item.price, 0);
            totalValue.textContent = `Rp ${total.toLocaleString()}`;
        }
    }
}

function initStoreManagement() {
    // Store management functionality can be added here
    console.log('Store management initialized');
}

function initOrderManagement() {
    // Order management functionality can be added here
    console.log('Order management initialized');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles if not exists
    if (!document.querySelector('#notificationStyles')) {
        const styles = document.createElement('style');
        styles.id = 'notificationStyles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                animation: slideInRight 0.3s ease;
            }
            .notification.success { background: #10b981; }
            .notification.error { background: #ef4444; }
            .notification.info { background: #3b82f6; }
            .notification.warning { background: #f59e0b; }
            .notification button {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                margin-left: 10px;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}
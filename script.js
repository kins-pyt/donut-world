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

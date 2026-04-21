// ===========================
// Ale's Place Cipoho - Main JavaScript
// Handles menu filtering, search, and reservation form
// ===========================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== MENU PAGE FUNCTIONALITY ==========
    if (document.getElementById('menuGrid')) {
        initializeMenuPage();
    }
    
    // ========== RESERVATION FORM FUNCTIONALITY ==========
    if (document.getElementById('reservationForm')) {
        initializeReservationForm();
    }
    
    // ========== NAVBAR ACTIVE LINK ==========
    highlightActiveNavLink();
    
    // ========== SMOOTH SCROLL ==========
    initializeSmoothScroll();
});

// ========== MENU PAGE FUNCTIONS ==========
function initializeMenuPage() {
    const menuGrid = document.getElementById('menuGrid');
    const menuCards = menuGrid.querySelectorAll('.menu-card');
    const searchInput = document.getElementById('menuSearch');
    const filterItems = document.querySelectorAll('.menu-filter__item');
    const tabButtons = document.querySelectorAll('.menu-tab');
    
    let currentCategory = 'all';
    let currentTab = 'all';
    let searchQuery = '';
    
    // Category Filter Click Handler
    filterItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            filterItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Update current category
            currentCategory = this.getAttribute('data-category');
            
            // Filter menu cards
            filterMenuCards();
        });
    });
    
    // Tab Click Handler
    tabButtons.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabButtons.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Update current tab
            currentTab = this.getAttribute('data-tab');
            
            // Filter menu cards
            filterMenuCards();
        });
    });
    
    // Search Input Handler
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchQuery = e.target.value.toLowerCase().trim();
            filterMenuCards();
        });
    }
    
    // Filter Menu Cards Function
    function filterMenuCards() {
        menuCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardTags = card.getAttribute('data-tag') || '';
            const cardTitle = card.querySelector('.menu-card__title').textContent.toLowerCase();
            const cardDescription = card.querySelector('.menu-card__description').textContent.toLowerCase();
            
            // Check category match
            const categoryMatch = currentCategory === 'all' || cardCategory === currentCategory;
            
            // Check tab match
            const tabMatch = currentTab === 'all' || cardTags.includes(currentTab);
            
            // Check search match
            const searchMatch = searchQuery === '' || 
                                cardTitle.includes(searchQuery) || 
                                cardDescription.includes(searchQuery);
            
            // Show or hide card
            if (categoryMatch && tabMatch && searchMatch) {
                card.style.display = 'flex';
                // Add fade-in animation
                card.style.animation = 'fadeIn 0.3s ease-in';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// ========== RESERVATION FORM FUNCTIONS ==========
function initializeReservationForm() {
    const form = document.getElementById('reservationForm');
    const successMessage = document.getElementById('formSuccess');
    
    // Set minimum date to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    
    // Form Submit Handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value || 'Tidak ada',
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            people: document.getElementById('people').value,
            notes: document.getElementById('notes').value || 'Tidak ada catatan'
        };
        
        // Validate form (basic validation)
        if (!formData.name || !formData.phone || !formData.date || !formData.time || !formData.people) {
            alert('Mohon lengkapi semua field yang wajib diisi (*)');
            return;
        }
        
        // Validate phone number
        const phoneRegex = /^[0-9]{10,13}$/;
        if (!phoneRegex.test(formData.phone.replace(/[-\s]/g, ''))) {
            alert('Nomor telepon tidak valid. Masukkan 10-13 digit angka.');
            return;
        }
        
        // Log reservation data (simulate sending to server)
        console.log('=== RESERVASI BARU ===');
        console.log('Nama:', formData.name);
        console.log('Telepon:', formData.phone);
        console.log('Email:', formData.email);
        console.log('Tanggal:', formData.date);
        console.log('Waktu:', formData.time);
        console.log('Jumlah Orang:', formData.people);
        console.log('Catatan:', formData.notes);
        console.log('====================');
        
        // Format date for display
        const dateObj = new Date(formData.date);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('id-ID', options);
        
        // Show success message
        successMessage.innerHTML = `
            <strong>✅ Reservasi Berhasil Terkirim!</strong><br><br>
            Terima kasih <strong>${formData.name}</strong>, reservasi Anda untuk <strong>${formData.people} orang</strong> 
            pada <strong>${formattedDate}</strong> pukul <strong>${formData.time} WIB</strong> telah kami terima.<br><br>
            Kami akan menghubungi Anda di nomor <strong>${formData.phone}</strong> untuk konfirmasi dalam waktu 1 jam.
        `;
        successMessage.classList.add('show');
        
        // Reset form
        form.reset();
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Hide success message after 10 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 10000);
    });
}

// ========== NAVBAR ACTIVE LINK HIGHLIGHT ==========
function highlightActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar__link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === '/' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ========== SMOOTH SCROLL ==========
function initializeSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========== UTILITY FUNCTIONS ==========

// Format currency to IDR
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Format date to Indonesian
function formatDateIndonesian(dateString) {
    const date = new Date(dateString);
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('id-ID', options);
}

// Add fade-in animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .social-link:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }
`;
document.head.appendChild(style);

// ========== LOG INITIALIZATION ==========
console.log('🍜 Ale\'s Place Cipoho - Website Loaded Successfully');
console.log('📍 Location: Jl. Cipoho No. 123, Bandung');
console.log('📞 Phone: (022) 1234-5678');
console.log('💻 Developed with ❤️ for Ale\'s Place Cipoho');

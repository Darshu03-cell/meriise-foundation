/* ============================================
   PROFESSIONAL MICRO-ENGINEERING WEBSITE JS
   ============================================ */

// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// ============================================
// NAVBAR ENHANCEMENT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Navbar shadow on scroll (standard site navbar uses the .snav-bar wrapper)
    const navbar = document.querySelector('.snav-bar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            } else {
                navbar.style.boxShadow = '0 2px 14px rgba(0, 0, 0, 0.10)';
            }
        });
    }
});

// ============================================
// ANIMATED COUNTER
// ============================================

function animateCounter() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-counter');
            const count = +counter.innerText;

            const increment = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 10);
            } else {
                counter.innerText = target;
            }
        };

        // Start animation when section comes into view
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCount();
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(counter);
    });
}

// Call counter function after page load
window.addEventListener('load', animateCounter);

// ============================================
// SWIPER CAROUSEL INITIALIZATION
// ============================================

const testimonialSwiper = new Swiper('.testimonial-swiper', {
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        320: {
            slidesPerView: 1,
            spaceBetween: 20,
        },
        768: {
            slidesPerView: 2,
            spaceBetween: 30,
        },
        1024: {
            slidesPerView: 1,
            spaceBetween: 30,
        },
    },
    effect: 'slide',
    speed: 500,
});

// ============================================
// CONTACT FORM HANDLING
// ============================================

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const program = document.getElementById('program').value;
        const message = document.getElementById('message').value.trim();

        // Validation
        if (!name || !email || !program) {
            showAlert('Please fill in all required fields!', 'warning');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert('Please enter a valid email address!', 'warning');
            return;
        }

        // Prepare form data
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('program', program);
        formData.append('message', message);

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
        submitBtn.disabled = true;

        // Submit form via AJAX
        fetch('send_email.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showAlert('✓ Message sent successfully! We will contact you soon.', 'success');
                contactForm.reset();
            } else {
                showAlert('Error: ' + (data.message || 'Failed to send message. Please try again.'), 'danger');
            }
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert('Network error. Please check your connection and try again.', 'danger');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    });
}

// ============================================
// ALERT NOTIFICATION FUNCTION
// ============================================

function showAlert(message, type = 'info') {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;

    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    document.body.appendChild(alertDiv);

    // Auto-remove alert after 5 seconds
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertDiv);
        bsAlert.close();
    }, 5000);
}

// ============================================
// SMOOTH SCROLL BEHAVIOR
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// PROGRAM CARD INTERACTIONS
// ============================================

const programCards = document.querySelectorAll('.program-card');
programCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ============================================
// GALLERY LIGHTBOX (SIMPLE MODAL)
// ============================================

const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('click', function() {
        const img = this.querySelector('.gallery-image');
        const imageSrc = img.src;
        const imageAlt = img.alt;

        // Create and show modal
        showImageModal(imageSrc, imageAlt);
    });
});

function showImageModal(imageSrc, imageAlt) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;

    modal.innerHTML = `
        <div style="position: relative; max-width: 90%; max-height: 90%;">
            <img src="${imageSrc}" alt="${imageAlt}" style="max-width: 100%; max-height: 80vh; border-radius: 10px;">
            <button style="
                position: absolute;
                top: -40px;
                right: 0;
                background: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            " onmouseover="this.style.background='#FF6B35'; this.style.color='white';"
               onmouseout="this.style.background='white'; this.style.color='black';">
                &times;
            </button>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal on click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        }
    });

    // Close modal on button click
    const closeBtn = modal.querySelector('button');
    closeBtn.addEventListener('click', function() {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    });

    // Close on ESC key
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                modal.remove();
                document.removeEventListener('keydown', escHandler);
            }, 300);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// ============================================
// ACTION BUTTONS
// ============================================

const actionButtons = document.querySelectorAll('.action-button');
actionButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        const buttonText = this.querySelector('p').textContent;

        if (buttonText === 'Apply Now') {
            showAlert('Redirecting to application form...', 'info');
            setTimeout(() => {
                document.querySelector('#contactForm').scrollIntoView({ behavior: 'smooth' });
            }, 500);
        } else if (buttonText === 'Download Brochure') {
            showAlert('Brochure download will start soon!', 'info');
        } else if (buttonText === 'Contact Coordinator') {
            showAlert('Opening email client...', 'info');
        }
    });
});

// ============================================
// MSME CARD INTERACTIONS
// ============================================

const msmeCards = document.querySelectorAll('.msme-card');
msmeCards.forEach(card => {
    const button = card.querySelector('.btn');
    if (button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const programName = card.querySelector('h5').textContent;
            showAlert(`Viewing details for ${programName}...`, 'info');
        });
    }
});

// ============================================
// PROGRAM CARD BUTTONS
// ============================================

const programButtons = document.querySelectorAll('.program-card .btn');
programButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const programName = this.closest('.program-card').querySelector('h5').textContent;
        showAlert(`Learn more about ${programName}. Redirecting...`, 'info');
    });
});

// ============================================
// SCROLL TO TOP BUTTON
// ============================================

function createScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.className = 'scroll-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #0066CC 0%, #FF6B35 100%);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 102, 204, 0.4);
        font-size: 1.2rem;
    `;

    document.body.appendChild(button);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            button.style.display = 'flex';
        } else {
            button.style.display = 'none';
        }
    });

    // Scroll to top on click
    button.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Hover effects
    button.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 6px 20px rgba(0, 102, 204, 0.6)';
    });

    button.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 4px 12px rgba(0, 102, 204, 0.4)';
    });
}

createScrollToTopButton();

// ============================================
// PAGE LOAD ANIMATIONS
// ============================================

window.addEventListener('load', function() {
    // Animate hero section elements
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDescription = document.querySelector('.hero-description');

    if (heroTitle) heroTitle.style.animation = 'slideInDown 1s ease';
    if (heroSubtitle) heroSubtitle.style.animation = 'slideInUp 1s ease 0.2s backwards';
    if (heroDescription) heroDescription.style.animation = 'slideInUp 1s ease 0.4s backwards';
});

// ============================================
// LAZY LOADING IMAGES
// ============================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ============================================
// FOCUS MANAGEMENT FOR ACCESSIBILITY
// ============================================

// Ensure proper focus management for keyboard navigation
const links = document.querySelectorAll('a, button');
links.forEach(link => {
    link.addEventListener('focus', function() {
        this.style.outline = '2px solid #0066CC';
        this.style.outlineOffset = '2px';
    });

    link.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

// ============================================
// FORM VALIDATION ENHANCEMENTS
// ============================================

const formControls = document.querySelectorAll('.form-control, .form-select');
formControls.forEach(control => {
    control.addEventListener('change', function() {
        if (this.value) {
            this.style.borderColor = '#00C896';
        } else {
            this.style.borderColor = 'transparent';
        }
    });

    control.addEventListener('input', function() {
        if (this.value) {
            this.style.background = '#F0F8FF';
        }
    });
});

// ============================================
// PERFORMANCE MONITORING
// ============================================

// Log page load performance
window.addEventListener('load', function() {
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Page load time:', pageLoadTime + 'ms');
    }
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus search (example)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const contactForm = document.querySelector('#contactForm');
        if (contactForm) {
            contactForm.scrollIntoView({ behavior: 'smooth' });
            document.getElementById('name').focus();
        }
    }

    // Esc to close modals
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.gallery-modal');
        modals.forEach(modal => {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        });
    }
});

// ============================================
// DYNAMIC YEAR IN FOOTER
// ============================================

const footerYear = document.querySelector('footer');
if (footerYear) {
    const currentYear = new Date().getFullYear();
    const footerText = footerYear.querySelector('p');
    if (footerText) {
        footerText.textContent = footerText.textContent.replace('2026', currentYear.toString());
    }
}

// ============================================
// INITIALIZATION LOG
// ============================================

console.log('✓ Micro-Engineering Certification Program website initialized successfully!');
console.log('✓ All interactive features are active');
console.log('✓ Page is ready for user interaction');

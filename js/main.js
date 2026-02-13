/* ============================================
   DIPLOMATIC PROTOCOL - MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // ---------- Navbar Scroll Effect ----------
    const navbar = document.querySelector('.navbar');
    
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleNavbarScroll);
    
    // ---------- Mobile Menu Toggle ----------
    const menuToggle = document.querySelector('.menu-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    if (menuToggle && navbarMenu) {
        menuToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        navbarMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navbarMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }
    
    // ---------- Scroll Animations ----------
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .stagger-children');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => observer.observe(el));

    const secondaryAnimatedElements = document.querySelectorAll('.animate-on-scroll2');

    const secondaryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                secondaryObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    secondaryAnimatedElements.forEach(el => secondaryObserver.observe(el));
    
    // ---------- Smooth Scroll for Anchor Links ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // ---------- Count Up Animation ----------
    function animateCountUp(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function update() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        }
        
        update();
    }
    
    // Trigger count up on scroll
    const countElements = document.querySelectorAll('[data-count]');
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                animateCountUp(entry.target, target);
                countObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    countElements.forEach(el => countObserver.observe(el));
    
    // ---------- Active Navigation Link ----------

    // ---------- Active Highlight for Academy Subsections (Dropdown içi) ----------
if (window.location.pathname.toLowerCase().includes('academy.html')) {
    const sectionElements = document.querySelectorAll('section[id]');
    const subLinks = document.querySelectorAll('.dropdown-menu a');

    function highlightAcademySubLink() {
        let current = null;

        sectionElements.forEach(sec => {
            const top = sec.offsetTop - 200;
            if (window.scrollY >= top) {
                current = sec.id;
            }
        });

        // Hiçbir section'a girmemişsek dokunma
        if (!current) return;

        subLinks.forEach(link => {
            const href = link.getAttribute('href');
            const isActive = href && href.includes(`#${current}`);
            link.classList.toggle('active', isActive);
        });
    }

    window.addEventListener('scroll', highlightAcademySubLink);
}

    // ---------- Language Selector ----------
    // Dil seçimi
    const langSelector = document.querySelector('.lang-selector');
    const fallbackFlags = {
        en: 'https://flagcdn.com/w40/gb.png',
        tr: 'https://flagcdn.com/w40/tr.png',
        me: 'https://flagcdn.com/w40/me.png'
    };
    const fallbackNames = {
        en: 'English',
        tr: 'Türkçe',
        me: 'Montenegrin'
    };
    const applyLanguage = (lang) => {
        const supported = ['en', 'tr', 'me'];
        const resolved = supported.includes(lang) ? lang : 'en';

        if (typeof setLanguage === 'function') {
            setLanguage(resolved);
            return resolved;
        }

        document.documentElement.lang = resolved;
        if (langSelector) {
            const currentBtn = langSelector.querySelector('.lang-current');
            const img = currentBtn ? currentBtn.querySelector('img') : null;
            if (currentBtn) currentBtn.dataset.lang = resolved;
            if (img && fallbackFlags[resolved]) {
                img.src = fallbackFlags[resolved];
                img.alt = fallbackNames[resolved] || '';
            }
        }

        return resolved;
    };

    if (langSelector) {
        const savedLang = localStorage.getItem('dp_lang') || 'en';
        applyLanguage(savedLang);

        const dropdown = langSelector.querySelector('.lang-dropdown');
        const currentBtn = langSelector.querySelector('.lang-current');
        const allowHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

        window.__langSelectorInitialized = true;

        const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
        const toggleOpen = (e) => {
            e.preventDefault();
            e.stopPropagation();
            langSelector.classList.toggle('open');
        };

        if (currentBtn) {
            if (isCoarsePointer) {
                currentBtn.addEventListener('pointerdown', toggleOpen);
            } else {
                currentBtn.addEventListener('click', toggleOpen);
            }
        }

        const closeOnOutside = (e) => {
            if (!langSelector.contains(e.target)) {
                langSelector.classList.remove('open');
            }
        };

        if (isCoarsePointer) {
            document.addEventListener('pointerdown', closeOnOutside);
        } else {
            document.addEventListener('click', closeOnOutside);
        }

        if (allowHover) {
            // HOVER İLE AÇ / KAPAT (DESKTOP)
            let langCloseTimeout = null;

            langSelector.addEventListener('mouseenter', () => {
                if (langCloseTimeout) clearTimeout(langCloseTimeout);
                langSelector.classList.add('open');
            });

            langSelector.addEventListener('mouseleave', () => {
                langCloseTimeout = setTimeout(() => {
                    langSelector.classList.remove('open');
                }, 200); // 200ms tolerans, istersen artır
            });
        }

        if (dropdown) {
            dropdown.addEventListener('click', (e) => e.stopPropagation());
            dropdown.querySelectorAll('[data-lang]').forEach(btn => {
                const handleSelect = function (e) {
                    e.preventDefault();
                    const lang = this.dataset.lang;
                    const resolved = applyLanguage(lang);
                    localStorage.setItem('dp_lang', resolved);
                    langSelector.classList.remove('open');
                };

                if (isCoarsePointer) {
                    btn.addEventListener('pointerdown', handleSelect);
                } else {
                    btn.addEventListener('click', handleSelect);
                }
            });
        }
    } else {
        const savedLang = localStorage.getItem('dp_lang') || 'en';
        if (typeof setLanguage === 'function') {
            setLanguage(savedLang);
        }
    }


    // ---------- Form Validation ----------
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            // Email validation
            const emailField = contactForm.querySelector('input[type="email"]');
            if (emailField && !isValidEmail(emailField.value)) {
                isValid = false;
                emailField.classList.add('error');
            }
            
            if (isValid) {
                // Show success message
                alert('Thank you for your message. We will contact you soon!');
                contactForm.reset();
            }
        });
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // ---------- Call Widget Animation ----------
// ---------- Call Widget - Always Visible ----------
const callWidget = document.querySelector('.call-widget');
if (callWidget) {
    callWidget.style.opacity = '1';
    callWidget.style.pointerEvents = 'auto';
}

    // ---------- Image Lazy Loading ----------
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
    
    // ---------- Video Play on Hover ----------
    const videoCards = document.querySelectorAll('.video-card');
    
    videoCards.forEach(card => {
        const video = card.querySelector('video');
        if (video) {
            card.addEventListener('mouseenter', () => video.play());
            card.addEventListener('mouseleave', () => video.pause());
        }
    });
    
});

// ---------- Utility Functions ----------
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
document.querySelectorAll('.hover-dropdown').forEach(drop => {
    let closeTimeout;

    drop.addEventListener('mouseenter', () => {
        clearTimeout(closeTimeout);
        drop.classList.add('open');
    });

    drop.addEventListener('mouseleave', () => {
        closeTimeout = setTimeout(() => {
            drop.classList.remove('open');
            const menu = drop.querySelector('.dropdown-menu');
            menu.style.opacity = "0";
            menu.style.visibility = "hidden";
            menu.style.transform = "translateY(10px)";
        }, 1000); // 1 saniye sonra kapanır
    });
});
// ---------- Active Menu Highlight (Page-based) ----------
// ---------- Active Menu Highlight (Page-based) ----------
(function() {
    // Geçerli sayfa adını al
    let currentPath = window.location.pathname.split("/").pop().toLowerCase();

    // Kök dizin / boş path durumunda index.html say
    if (currentPath === "" || currentPath === "/") {
        currentPath = "index.html";
    }

    const navLinks = document.querySelectorAll(".navbar-menu > a, .navbar-menu .dropdown-toggle");

    // Önce tüm active'leri temizle
    navLinks.forEach(link => link.classList.remove("active"));

    // Sonra sadece ilgili sayfanın linkine active ekle
    navLinks.forEach(link => {
        const linkPath = (link.getAttribute("href") || "").toLowerCase();
        if (linkPath === currentPath) {
            link.classList.add("active");
        }
    });
})();
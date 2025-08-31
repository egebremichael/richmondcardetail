// Richmond Car Detail - Interactive JavaScript

class GalleryManager {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.slideInterval = null;
        this.isAutoPlaying = true;
        this.autoPlayDuration = 4000;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        this.slides = document.querySelectorAll('.gallery-slide');
        this.setupEventListeners();
        this.startAutoPlay();
    }
    
    setupEventListeners() {
        // Navigation buttons
        const prevBtn = document.getElementById('prevSlideBtn');
        const nextBtn = document.getElementById('nextSlideBtn');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.changeSlide(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => this.changeSlide(1));
        
        // Touch events for mobile
        const slideshow = document.getElementById('gallerySlideshow');
        if (slideshow) {
            slideshow.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
            slideshow.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
            slideshow.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        }
        
        // Gallery view toggle
        const slideshowToggle = document.getElementById('slideshowToggle');
        const gridToggle = document.getElementById('gridToggle');
        
        if (slideshowToggle) slideshowToggle.addEventListener('click', () => this.showSlideshow());
        if (gridToggle) gridToggle.addEventListener('click', () => this.showGrid());
        
        // Pause autoplay on hover (desktop)
        if (slideshow) {
            slideshow.addEventListener('mouseenter', () => this.pauseAutoPlay());
            slideshow.addEventListener('mouseleave', () => this.resumeAutoPlay());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }
    
    changeSlide(direction) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        const previousSlide = this.currentSlide;
        this.currentSlide = (this.currentSlide + direction + this.slides.length) % this.slides.length;
        
        // Update slides with smooth transition
        this.slides[previousSlide].classList.remove('active');
        if (direction > 0) {
            this.slides[previousSlide].classList.add('prev');
        }
        
        setTimeout(() => {
            this.slides[this.currentSlide].classList.add('active');
            
            // Clean up transition classes
            setTimeout(() => {
                this.slides[previousSlide].classList.remove('prev');
                this.isTransitioning = false;
            }, 600);
        }, 50);
        
        this.restartAutoPlay();
    }
    
    startAutoPlay() {
        if (this.slideInterval) clearInterval(this.slideInterval);
        
        this.slideInterval = setInterval(() => {
            if (this.isAutoPlaying) {
                this.changeSlide(1);
            }
        }, this.autoPlayDuration);
    }
    
    restartAutoPlay() {
        if (this.isAutoPlaying) {
            this.startAutoPlay();
        }
    }
    
    pauseAutoPlay() {
        this.isAutoPlaying = false;
    }
    
    resumeAutoPlay() {
        this.isAutoPlaying = true;
        this.startAutoPlay();
    }
    
    // Touch handling for mobile
    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
    }
    
    handleTouchMove(e) {
        if (Math.abs(e.touches[0].clientX - this.touchStartX) > 10) {
            e.preventDefault(); // Prevent scrolling
        }
    }
    
    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].clientX;
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.changeSlide(1); // Swipe left - next slide
            } else {
                this.changeSlide(-1); // Swipe right - previous slide
            }
        }
    }
    
    // Keyboard navigation
    handleKeyPress(e) {
        if (document.getElementById('slideshowView').classList.contains('active')) {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.changeSlide(-1);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.changeSlide(1);
                    break;
            }
        }
    }
    
    // View switching
    showSlideshow() {
        const slideshowView = document.getElementById('slideshowView');
        const gridView = document.getElementById('gridView');
        const slideshowToggle = document.getElementById('slideshowToggle');
        const gridToggle = document.getElementById('gridToggle');
        
        if (slideshowView && gridView) {
            slideshowView.classList.add('active');
            gridView.classList.remove('active');
            slideshowToggle?.classList.add('active');
            gridToggle?.classList.remove('active');
            
            this.startAutoPlay();
        }
    }
    
    showGrid() {
        const slideshowView = document.getElementById('slideshowView');
        const gridView = document.getElementById('gridView');
        const slideshowToggle = document.getElementById('slideshowToggle');
        const gridToggle = document.getElementById('gridToggle');
        
        if (slideshowView && gridView) {
            slideshowView.classList.remove('active');
            gridView.classList.add('active');
            slideshowToggle?.classList.remove('active');
            gridToggle?.classList.add('active');
            
            // Stop autoplay when in grid view
            clearInterval(this.slideInterval);
        }
    }
}

// Enhanced Mobile Experience
function initializeMobileEnhancements() {
    // Optimize animations for mobile
    if (window.innerWidth <= 768) {
        // Reduce animation duration for mobile
        document.documentElement.style.setProperty('--transition-slow', '0.4s');
        document.documentElement.style.setProperty('--transition-medium', '0.25s');
        document.documentElement.style.setProperty('--transition-fast', '0.15s');
    }
    
    // Optimize scroll behavior on mobile
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                // Handle mobile scroll optimizations here if needed
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
}

// Smooth scrolling enhancement
function initializeSmoothScrolling() {
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
}

// Package Carousel
let currentPackageIndex = 0;
let packageItems = [];

// Gallery Manager
let galleryManager;

function initializePackageCarousel() {
    packageItems = document.querySelectorAll('.package-item');
    const indicatorsContainer = document.getElementById('packageIndicators');
    const prevBtn = document.getElementById('packagePrevBtn');
    const nextBtn = document.getElementById('packageNextBtn');
    
    if (!packageItems.length) return;
    
    // Only create indicators and desktop navigation for larger screens
    if (window.innerWidth > 768) {
        if (indicatorsContainer) {
            // Create indicators (hidden on desktop via CSS)
            packageItems.forEach((_, index) => {
                const indicator = document.createElement('div');
                indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
                indicator.onclick = () => goToPackage(index);
                indicatorsContainer.appendChild(indicator);
            });
        }
        
        // Event listeners for desktop navigation
        if (prevBtn) prevBtn.addEventListener('click', () => changePackage(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => changePackage(1));
        
        // Update initial state for desktop
        updatePackageCarousel();
    } else {
        // Mobile: Setup horizontal scroll
        const carousel = document.getElementById('packageCarousel');
        if (carousel) {
            carousel.style.overflowX = 'auto';
            carousel.style.scrollBehavior = 'smooth';
        }
    }
}

function changePackage(direction) {
    const previousIndex = currentPackageIndex;
    currentPackageIndex = (currentPackageIndex + direction + packageItems.length) % packageItems.length;
    
    updatePackageCarousel();
}

function goToPackage(index) {
    currentPackageIndex = index;
    updatePackageCarousel();
}

function updatePackageCarousel() {
    // Only update carousel for desktop view
    if (window.innerWidth <= 768) return;
    
    const track = document.getElementById('packageTrack');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    if (!track || !packageItems.length) return;
    
    // Calculate the offset to center the current item
    const itemWidth = 430; // 400px + 30px margin
    const containerWidth = track.parentElement.offsetWidth;
    const offset = (containerWidth / 2) - (itemWidth / 2) - (currentPackageIndex * itemWidth);
    
    track.style.transform = `translateX(${offset}px)`;
    
    // Update item states
    packageItems.forEach((item, index) => {
        item.classList.remove('active', 'center');
        if (index === currentPackageIndex) {
            item.classList.add('active', 'center');
        } else if (Math.abs(index - currentPackageIndex) <= 1) {
            item.classList.add('active');
        }
    });
    
    // Update indicators (hidden on desktop via CSS)
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentPackageIndex);
    });
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Auto-scroll to hero section on page load
    setTimeout(() => {
        document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
    }, 100);
    
    initializeGSAPAnimations();
    initializeScrollEffects();
    initializeNavigation();
    initializePriceCalculator();
    initializeLightbox();
    initializeFormEnhancements();
    initializeParticleEffects();
    initializeMobileEnhancements();
    initializeSmoothScrolling();
    initializePackageCarousel();
    initializeTestimonials();
    // Initialize gallery manager
    galleryManager = new GalleryManager();
    
    // Handle resize events for package carousel
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            // Mobile: Reset carousel transform and enable scrolling
            const track = document.getElementById('packageTrack');
            if (track) {
                track.style.transform = 'none';
            }
        } else {
            // Desktop: Re-initialize carousel
            updatePackageCarousel();
        }
    });
});

// GSAP Animations
function initializeGSAPAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero section animations
    const heroTl = gsap.timeline();
    heroTl.from('.hero-title', {
        duration: 1.2,
        y: 100,
        opacity: 0,
        ease: 'power3.out'
    })
    .from('.hero-subtitle', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power2.out'
    }, '-=0.8')
    .from('.btn-cta', {
        duration: 0.8,
        scale: 0,
        opacity: 0,
        ease: 'back.out(1.7)'
    }, '-=0.5')
    .from('.floating-badge', {
        duration: 1,
        x: 100,
        opacity: 0,
        ease: 'power2.out'
    }, '-=0.6');
    
    // Service cards animation
    gsap.fromTo('.service-card', {
        y: 100,
        opacity: 0,
        scale: 0.8
    }, {
        duration: 0.8,
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.services-section',
            start: 'top 80%',
            end: 'bottom 20%'
        }
    });
    
    // Subscription cards slide in
    gsap.fromTo('.subscription-card', {
        x: (i) => i === 0 ? -200 : 200,
        opacity: 0
    }, {
        duration: 1,
        x: 0,
        opacity: 1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.subscription-section',
            start: 'top 80%'
        }
    });
    
    // Gallery items animation
    gsap.fromTo('.gallery-grid-item', {
        y: 50,
        opacity: 0,
        scale: 0.9
    }, {
        duration: 0.6,
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.gallery-section',
            start: 'top 85%'
        }
    });
    
    // Packages table animation
    gsap.fromTo('.packages-table tbody tr', {
        x: -50,
        opacity: 0
    }, {
        duration: 0.5,
        x: 0,
        opacity: 1,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.packages-section',
            start: 'top 80%'
        }
    });
    
    // Contact form animation
    gsap.fromTo('.contact-form-container', {
        y: 50,
        opacity: 0
    }, {
        duration: 0.8,
        y: 0,
        opacity: 1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.contact-section',
            start: 'top 80%'
        }
    });
    
    // Contact info items animation
    gsap.fromTo('.contact-item', {
        x: 50,
        opacity: 0
    }, {
        duration: 0.6,
        x: 0,
        opacity: 1,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.contact-info',
            start: 'top 85%'
        }
    });
}

// Scroll Effects
function initializeScrollEffects() {
    let lastScrollTop = 0;
    const navbar = document.getElementById('mainNav');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Navbar background on scroll
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Parallax effect for hero background
        const heroBackground = document.querySelector('.hero-bg-image');
        if (heroBackground && scrollTop < window.innerHeight) {
            heroBackground.style.transform = `translateY(${scrollTop * 0.5}px)`;
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Price Calculator
function initializePriceCalculator() {
    const serviceSelect = document.getElementById('bookingService');
    const vehicleSelect = document.getElementById('bookingVehicle');
    const priceDisplay = document.getElementById('calculatedPrice');
    
    if (!serviceSelect || !vehicleSelect || !priceDisplay) return;
    
    const prices = {
        'exterior_wash': { 'car': 49.99, 'suv': 59.99, 'van': 69.99 },
        'bronze_package': { 'car': 149.99, 'suv': 169.99, 'van': 199.99 },
        'silver_package': { 'car': 449.99, 'suv': 499.99, 'van': 599.99 },
        'gold_package': { 'car': 599.99, 'suv': 699.99, 'van': 799.99 },
        'richmond_special': { 'car': 1499.99, 'suv': 1599.99, 'van': 1699.99 },
        'ceramic_coating': { 'car': 999.99, 'suv': 999.99, 'van': 999.99 },
        'gold_wax': { 'car': 349.99, 'suv': 399.99, 'van': 499.99 }
    };
    
    function updatePrice() {
        const service = serviceSelect.value;
        const vehicle = vehicleSelect.value;
        
        if (service && vehicle && prices[service] && prices[service][vehicle]) {
            const price = prices[service][vehicle];
            priceDisplay.textContent = `$${price.toFixed(2)}`;
            
            // Add animation effect
            priceDisplay.style.transform = 'scale(1.1)';
            priceDisplay.style.color = '#f59e0b';
            setTimeout(() => {
                priceDisplay.style.transform = 'scale(1)';
            }, 200);
        } else {
            priceDisplay.textContent = 'Select service and vehicle';
            priceDisplay.style.color = '#94a3b8';
        }
    }
    
    serviceSelect.addEventListener('change', updatePrice);
    vehicleSelect.addEventListener('change', updatePrice);
}

// Lightbox Gallery
function initializeLightbox() {
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    
    if (!lightboxModal || !lightboxImage || !lightboxTitle) return;
    
    // No gallery items to process since gallery is removed
}

// Form Enhancements
function initializeFormEnhancements() {
    // Floating label effects
    const formInputs = document.querySelectorAll('.form-control, .form-select');
    
    formInputs.forEach(input => {
        // Focus effects
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentNode.classList.remove('focused');
            }
        });
        
        // Initial state check
        if (input.value) {
            input.parentNode.classList.add('focused');
        }
    });
    
    // Form validation enhancement
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            const spinner = submitBtn.querySelector('.loading-spinner');
            
            if (submitBtn && spinner) {
                submitBtn.disabled = true;
                spinner.classList.remove('d-none');
                
                // Re-enable after 3 seconds (in case of failure)
                setTimeout(() => {
                    submitBtn.disabled = false;
                    spinner.classList.add('d-none');
                }, 3000);
            }
        });
    });
}

// Particle Effects for CTAs
function initializeParticleEffects() {
    const ctaButtons = document.querySelectorAll('.btn-cta');
    
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            createParticles(this);
        });
    });
    
    function createParticles(element) {
        const rect = element.getBoundingClientRect();
        const particleCount = 8;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * rect.width + 'px';
            particle.style.top = rect.height + 'px';
            particle.style.width = Math.random() * 4 + 2 + 'px';
            particle.style.height = particle.style.width;
            
            element.style.position = 'relative';
            element.appendChild(particle);
            
            // Animate particle
            gsap.to(particle, {
                y: -50,
                x: (Math.random() - 0.5) * 100,
                opacity: 0,
                scale: 0,
                duration: 1,
                ease: 'power2.out',
                onComplete: () => particle.remove()
            });
        }
    }
}

// // Service Booking
// function initializeServiceBooking() {
//     const serviceButtons = document.querySelectorAll('.btn-service, .btn-package');
//     const bookingModal = document.getElementById('bookingModal');
//     const bookingServiceSelect = document.getElementById('bookingService');
    
//     if (!bookingModal || !bookingServiceSelect) return;
    
//     serviceButtons.forEach(button => {
//         button.addEventListener('click', function() {
//             const serviceType = this.getAttribute('data-service');
//             if (serviceType && bookingServiceSelect) {
//                 bookingServiceSelect.value = serviceType;
                
//                 // Trigger price calculation
//                 const event = new Event('change', { bubbles: true });
//                 bookingServiceSelect.dispatchEvent(event);
//             }
//         });
//     });
// }

// // Email Booking System
// function initializeEmailBooking() {
//     const bookingForm = document.getElementById('bookingForm');
    
//     if (bookingForm) {
//         bookingForm.addEventListener('submit', function(e) {
//             e.preventDefault();
            
//             // Get form data
//             const formData = new FormData(this);
//             const name = formData.get('name') || 'Not provided';
//             const email = formData.get('email') || 'Not provided';
//             const phone = formData.get('phone') || 'Not provided';
//             const service = formData.get('service_type') || 'Not specified';
//             const vehicle = formData.get('vehicle_type') || 'Not specified';
//             const date = formData.get('preferred_date') || 'To be discussed';
//             const message = formData.get('message') || 'None';
//             const priceElement = document.getElementById('calculatedPrice');
//             const calculatedPrice = priceElement ? priceElement.textContent : 'Not calculated';
            
//             // Create email content
//             const subject = encodeURIComponent(`Car Detailing Booking Request - ${service}`);
//             const body = encodeURIComponent(`
// Car Detailing Booking Request

// Customer Information:
// - Name: ${name}
// - Email: ${email}
// - Phone: ${phone}

// Service Details:
// - Service Type: ${service}
// - Vehicle Type: ${vehicle}
// - Preferred Date: ${date}
// - Estimated Price: ${calculatedPrice}

// Message:
// ${message}

// Please contact the customer to confirm the booking and arrange the service.

// Best regards,
// Richmond Car Detail Website
//             `);
            
//             // Open email client
//             window.location.href = `mailto:info@richmondcardetail.com?subject=${subject}&body=${body}`;
            
//             // Show success message
//             showBookingConfirmation();
//         });
//     }
// }

// // Contact Form Handler
// function initializeContactForm() {
//     const contactForm = document.getElementById('contactForm');
    
//     if (contactForm) {
//         contactForm.addEventListener('submit', function(e) {
//             e.preventDefault();
            
//             // Get form data
//             const formData = new FormData(this);
//             const name = formData.get('name') || 'Not provided';
//             const email = formData.get('email') || 'Not provided';
//             const phone = formData.get('phone') || 'Not provided';
//             const service = formData.get('service') || 'Not specified';
//             const message = formData.get('message') || 'None';
            
//             // Create email content
//             const subject = encodeURIComponent(`Contact Form Submission - ${service}`);
//             const body = encodeURIComponent(`
// Contact Form Submission

// Customer Information:
// - Name: ${name}
// - Email: ${email}
// - Phone: ${phone}
// - Service Interest: ${service}

// Message:
// ${message}

// Please respond to this customer inquiry promptly.

// Best regards,
// Richmond Car Detail Website
//             `);
            
//             // Open email client
//             window.location.href = `mailto:info@richmondcardetail.com?subject=${subject}&body=${body}`;
            
//             // Show success message
//             showContactConfirmation();
//         });
//     }
// }

// // Show booking confirmation
// function showBookingConfirmation() {
//     const modal = document.getElementById('bookingModal');
//     if (modal) {
//         const bsModal = bootstrap.Modal.getInstance(modal);
//         if (bsModal) bsModal.hide();
//     }
    
//     showNotification('Booking request sent! We will contact you shortly to confirm your appointment.', 'success');
// }

// // Show contact confirmation
// function showContactConfirmation() {
//     showNotification('Message sent successfully! We will get back to you as soon as possible.', 'success');
// }

function handleFormSubmission(formId, notificationId, formspreeUrl, successMessage) {
        const form = document.getElementById(formId);
        const notification = document.getElementById(notificationId);

        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = form.querySelector('.submit-btn');
            const spinner = submitBtn.querySelector('.loading-spinner');

            spinner.classList.remove('d-none');
            submitBtn.disabled = true;

            const formData = new FormData(form);

            fetch(formspreeUrl, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => response.json())
            .then(data => {
                spinner.classList.add('d-none');
                submitBtn.disabled = false;

                // Formspree v3 returns { ok: true } on success
                if (data.ok) {
                    showNotification(notification, successMessage, 'success');
                    form.reset();
                } else if (data.errors && data.errors.length > 0) {
                    showNotification(notification, data.errors.map(err => err.message).join(', '), 'danger');
                } else {
                    showNotification(notification, 'Oops! Something went wrong. Please try again later.', 'danger');
                }
            })
            .catch(() => {
                spinner.classList.add('d-none');
                submitBtn.disabled = false;
                showNotification(notification, 'Network error. Please try again later.', 'danger');
            });
        });
    }

    function showNotification(container, message, type) {
        container.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        container.scrollIntoView({ behavior: 'smooth' });
    }

    // Initialize contact form
    handleFormSubmission(
        'contactForm',
        'contactNotification',
        'https://formspree.io/f/xrbakrjo',
        'Message sent successfully! We will get back to you as soon as possible.'
    );

    // Initialize booking form
    handleFormSubmission(
        'bookingForm',
        'bookingNotification',
        'https://formspree.io/f/xrbakrjo',
        'Booking request sent! We will contact you shortly to confirm your appointment.'
    );

// Testimonials rotation (if needed)
function initializeTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial-item');
    
    testimonials.forEach((testimonial, index) => {
        testimonial.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        testimonial.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}


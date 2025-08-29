document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Logic
    const header = document.querySelector('.header');
    const menuButton = document.querySelector('.mobile-menu-button');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (menuButton && mobileMenuOverlay) {
        // Toggle menu
        menuButton.addEventListener('click', function() {
            const icon = this.querySelector('i');
            mobileMenuOverlay.classList.toggle('visible');
            header.classList.toggle('header--menu-open');

            if (mobileMenuOverlay.classList.contains('visible')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });

        // Handle link clicks in mobile menu
        mobileLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const self = this;
                const targetHref = self.getAttribute('href');
                const targetElement = document.querySelector(targetHref);
                const icon = menuButton.querySelector('i');

                // Add flash effect
                self.classList.add('flash-active');

                // Close the menu
                mobileMenuOverlay.classList.remove('visible');
                header.classList.remove('header--menu-open');
                icon.className = 'fas fa-bars';

                // After a short delay to see the flash and let menu close, scroll to section
                setTimeout(() => {
                    self.classList.remove('flash-active');
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                }, 300); 
            });
        });
    }

    // Smooth scrolling for non-mobile anchor links
    document.querySelectorAll('a[href^="#"]:not(.mobile-nav-links a)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // HERO SLIDER SCRIPT
    const heroSlidesWrapper = document.querySelector('.hero-slides-wrapper');
    const heroDots = document.querySelectorAll('.hero-dot');
    const totalHeroSlides = heroDots.length;
    let currentHeroSlideIndex = 0;
    let heroInterval;

    function showHeroSlide(index) {
        if (!heroSlidesWrapper) return;
        const offset = -index * (100 / totalHeroSlides);
        heroSlidesWrapper.style.transform = `translateX(${offset}%)`;
        
        heroDots.forEach((dot, i) => {
            dot.classList.remove('active-hero-dot');
            if (i === index) {
                dot.classList.add('active-hero-dot');
            }
        });
        currentHeroSlideIndex = index;
    }

    function nextHeroSlide() {
        const newIndex = (currentHeroSlideIndex + 1) % totalHeroSlides;
        showHeroSlide(newIndex);
    }

    window.currentHeroSlide = function(index) {
        stopHeroSlider();
        showHeroSlide(index);
        startHeroSlider();
    }

    function startHeroSlider() {
        stopHeroSlider();
        heroInterval = setInterval(nextHeroSlide, 5000);
    }

    function stopHeroSlider() {
        clearInterval(heroInterval);
    }
    
    if (heroSlidesWrapper && totalHeroSlides > 0) {
        showHeroSlide(0);
        startHeroSlider();
    }

    // Initialize services slideshow
    showSlides(slideIndex);

    // Navigation active state on scroll with Intersection Observer
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const headerEl = document.querySelector('.header');
    const headerHeight = headerEl ? headerEl.offsetHeight : 70; // Fallback height

    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: `-${headerHeight}px 0px 0px 0px`, // offset from the top to account for sticky header
        threshold: 0.3 // trigger when 30% of the section is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});

// Services Slideshow Script
let slideIndex = 1;
let slideTimer;

function autoAdvance() {
    slideIndex++;
    showSlides(slideIndex);
}

function startSlideShow() {
    clearTimeout(slideTimer);
    slideTimer = setTimeout(autoAdvance, 5000);
}

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("service-slide");
  let dots = document.getElementsByClassName("dot");

  if (slides.length === 0 || dots.length === 0) {
      return;
  }
  
  if (n > slides.length) { slideIndex = 1; }
  if (n < 1) { slideIndex = slides.length; }
  
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active-dot", "");
  }
  
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active-dot";
  
  startSlideShow();
}
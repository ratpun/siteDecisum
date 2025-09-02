document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Logic
    const header = document.querySelector('.header');
    const menuButton = document.querySelector('.mobile-menu-button');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (menuButton && mobileMenuOverlay) {
        // Toggle menu
        menuButton.addEventListener('click', function() {
            this.classList.toggle('open');
            mobileMenuOverlay.classList.toggle('visible');
            header.classList.toggle('header--menu-open');
        });

        // Handle link clicks in mobile menu
        mobileLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const self = this;
                const targetHref = self.getAttribute('href');
                const targetElement = document.querySelector(targetHref);

                // Add flash effect
                self.classList.add('flash-active');

                // Close the menu
                mobileMenuOverlay.classList.remove('visible');
                header.classList.remove('header--menu-open');
                menuButton.classList.remove('open'); // Revert button to hamburger

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
    const heroSlider = document.querySelector('.hero-slider');
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

    function prevHeroSlide() {
        const newIndex = (currentHeroSlideIndex - 1 + totalHeroSlides) % totalHeroSlides;
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
    
    if (heroSlider && totalHeroSlides > 0) {
        showHeroSlide(0);
        startHeroSlider();

        // Touch Swipe Logic
        let touchStartX = 0;
        let touchEndX = 0;

        heroSlider.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
            stopHeroSlider(); // Pause slider on touch
        }, { passive: true });

        heroSlider.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startHeroSlider(); // Resume slider after touch
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50; // Minimum distance for a swipe in pixels
            if (touchStartX - touchEndX > swipeThreshold) {
                // Swiped left
                nextHeroSlide();
            } else if (touchEndX - touchStartX > swipeThreshold) {
                // Swiped right
                prevHeroSlide();
            }
        }
    }

    // Initialize services slideshow
    showSlides(slideIndex);

    // Navigation active state on scroll with Intersection Observer
    const sections = document.querySelectorAll('section[id]');
    const allNavLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
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
                
                allNavLinks.forEach(link => {
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

    // Animation on scroll for the about image
    const aboutImage = document.querySelector('.about-image');
    if (aboutImage) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 }); // Trigger when 20% of the element is visible
        revealObserver.observe(aboutImage);
    }

    // Phone Mask Logic
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            const input = e.target;
            let value = input.value.replace(/\D/g, '');
            value = value.substring(0, 11);

            if (value.length > 10) {
                input.value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7, 11)}`;
            } else if (value.length > 6) {
                input.value = `(${value.substring(0, 2)}) ${value.substring(2, 6)}-${value.substring(6, 10)}`;
            } else if (value.length > 2) {
                input.value = `(${value.substring(0, 2)}) ${value.substring(2, 6)}`;
            } else if (value.length > 0) {
                input.value = `(${value.substring(0, 2)}`;
            } else {
                input.value = '';
            }
        });
    }

    // Contact Form AJAX Submission
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitButton = document.getElementById('form-submit-button');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Prevent multiple submissions
            if (submitButton.disabled) return;

            submitButton.disabled = true;
            submitButton.classList.remove('validate'); // Reset from previous success
            submitButton.classList.add('onclic');
            formStatus.innerHTML = ''; // Clear previous status
            formStatus.className = 'form-status';

            const formData = new FormData(this);

            fetch('send_email.php', {
                method: 'POST',
                body: formData
            })
            .then(async response => {
                const responseText = await response.text();
                submitButton.classList.remove('onclic');
                
                if (response.ok) {
                    formStatus.innerHTML = responseText;
                    formStatus.classList.add('success');
                    contactForm.reset();
                    submitButton.classList.add('validate');

                    // Re-enable button after success animation is visible for a bit
                    setTimeout(() => {
                        submitButton.classList.remove('validate');
                        submitButton.disabled = false;
                    }, 4000);

                } else {
                    throw new Error(responseText || 'Erro no servidor.');
                }
            })
            .catch(error => {
                submitButton.classList.remove('onclic');
                formStatus.innerHTML = error.message || 'Oops! Algo deu errado. Tente novamente mais tarde.';
                formStatus.classList.add('error');
                submitButton.disabled = false; // Re-enable immediately on error
            })
            .finally(() => {
                // This just clears the status message after a while
                setTimeout(() => {
                    formStatus.innerHTML = '';
                    formStatus.className = 'form-status';
                }, 6000); // Clear message after 6 seconds
            });
        });
    }

    // FAQ Dropdown Logic
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('active');
            const answer = button.nextElementSibling;
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
            } else {
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
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
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu
  const menuButton = document.querySelector('.mobile-menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  if (menuButton && mobileMenu) {
    const toggleMenu = () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', !expanded);
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open'); // Prevent scrolling when menu is open


      if (!expanded) {
        // Trap focus
        const firstFocusableElement = menuLinks.length > 0 ? menuLinks[0] : menuButton;
        const lastFocusableElement = menuLinks.length > 0 ? menuLinks[menuLinks.length - 1] : menuButton;

        firstFocusableElement.focus();

        mobileMenu.addEventListener('keydown', (e) => {
          const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

          if (!isTabPressed) {
            return;
          }

          if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
              lastFocusableElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastFocusableElement) {
              firstFocusableElement.focus();
              e.preventDefault();
            }
          }
        });
      }
    };

    menuButton.addEventListener('click', toggleMenu);

    // Close with ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.keyCode === 27) {
        if (mobileMenu.classList.contains('active')) {
          toggleMenu();
          menuButton.focus(); // Return focus to the button
        }
      }
    });
  }


  // Smooth Scroll & Back to Top
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });

        // Update URL (optional)
        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          location.hash = targetId;
        }
      }
    });
  });

  const backToTopButton = document.querySelector('.back-to-top');

  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopButton.style.display = 'block';
      } else {
        backToTopButton.style.display = 'none';
      }
    });

    backToTopButton.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    });
  }


  // Testimonial Slider
  const slider = document.querySelector('.testimonial-slider');
  if (slider) {
    const slides = slider.querySelectorAll('.testimonial-slide');
    const prevButton = slider.querySelector('.slider-prev');
    const nextButton = slider.querySelector('.slider-next');
    let currentIndex = 0;
    const slideInterval = 5000; // Auto-advance every 5 seconds
    let intervalId;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    };

    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(currentIndex);
    };


    const startSlider = () => {
      intervalId = setInterval(nextSlide, slideInterval);
    };

    const stopSlider = () => {
      clearInterval(intervalId);
    };

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        stopSlider();
        prevSlide();
        startSlider();
      });
    }
    if (nextButton) {
      nextButton.addEventListener('click', () => {
        stopSlider();
        nextSlide();
        startSlider();
      });
    }

    showSlide(currentIndex);
    startSlider();

    slider.addEventListener('mouseenter', stopSlider);
    slider.addEventListener('mouseleave', startSlider);

  }


  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');

    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.faq-content').style.display = 'none';
        }
      });


      header.setAttribute('aria-expanded', !isExpanded);
      content.style.display = isExpanded ? 'none' : 'block';
    });
  });


  // Email Capture Validation
  const emailForm = document.querySelector('#email-capture-form');
  if (emailForm) {
    emailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = emailForm.querySelector('input[type="email"]');
      const email = emailInput.value.trim();

      if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      console.log('Email submitted:', email);
      emailInput.value = ''; // Clear the input
    });
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


  // UTM CTA Click Logging
  const ctaButtons = document.querySelectorAll('.cta-button'); // Example selector

  ctaButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const utmParams = getUtmParams(); // Function to extract UTM parameters
      console.log('CTA Clicked', {
        buttonText: button.textContent,
        utm: utmParams
      });
    });
  });

  function getUtmParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    return {
      source: utmSource,
      medium: utmMedium,
      campaign: utmCampaign
    };
  }
});
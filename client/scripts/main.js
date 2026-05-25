/**
 * Brajwasi's Coders - Main Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. FADE OUT PRELOADER
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('fade-out');
      }, 500);
    });
    // Fallback if load event already fired or delayed
    setTimeout(() => {
      preloader.classList.add('fade-out');
    }, 1500);
  }

  // 2. DYNAMIC PARTICLES CANVAS SYSTEM
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const colors = ['#2563EB', '#D4AF37', '#1E4ED8', '#FDE047'];

    // Resize canvas
    function setCanvasSize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Particle Object
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce borders
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Initialize particles array
    function initParticles() {
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000);
      particlesArray = [];
      for (let i = 0; i < Math.min(numberOfParticles, 80); i++) {
        particlesArray.push(new Particle());
      }
    }
    initParticles();
    window.addEventListener('resize', initParticles);

    // Animation Loop
    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // 3. SCROLL REVEAL (INTERSECTION OBSERVER)
  const revealElements = document.querySelectorAll('.reveal');
  const revealOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // 3b. ANIMATED STAT COUNTERS
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.innerText.replace(/[0-9]/g, '');
        let count = 0;
        const step = Math.ceil(target / 50);
        const timer = setInterval(() => {
          count = Math.min(count + step, target);
          el.innerText = count + suffix;
          if (count >= target) clearInterval(timer);
        }, 30);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  // 4. CONTACT FORM ACTION
  const contactForm = document.getElementById('agency-contact-form');
  const formFeedback = document.getElementById('contact-form-feedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const origBtnContent = submitBtn.innerHTML;
      
      // Get Values
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      // Show Loading State
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
      formFeedback.className = 'form-message';
      formFeedback.style.display = 'none';

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, subject, message })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          formFeedback.innerText = data.message || 'Inquiry submitted successfully!';
          formFeedback.className = 'form-message success';
          contactForm.reset();
        } else {
          formFeedback.innerText = data.error || 'Something went wrong. Please check fields and retry.';
          formFeedback.className = 'form-message error';
        }
      } catch (err) {
        console.error('Contact Form Fetch Error:', err);
        formFeedback.innerText = 'Network error. Please make sure server is running and retry.';
        formFeedback.className = 'form-message error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtnContent;
      }
    });
  }

  // 5. PORTFOLIO SLIDER ACTION
  const track = document.getElementById('portfolio-track');
  const prevBtn = document.getElementById('portfolio-prev');
  const nextBtn = document.getElementById('portfolio-next');
  
  if (track && prevBtn && nextBtn) {
    const slides = Array.from(track.children);
    let currentIndex = 0;

    function updateSlider() {
      if (slides.length === 0) return;
      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = 30; // Gap matches CSS (30px)
      // Slide calculation: translate by index * (slideWidth + gap)
      const amountToMove = currentIndex * (slideWidth + gap);
      track.style.transform = `translateX(-${amountToMove}px)`;

      // Toggle button active/inactive styles
      prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
      prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
      nextBtn.style.opacity = currentIndex === slides.length - 1 ? '0.5' : '1';
      nextBtn.style.pointerEvents = currentIndex === slides.length - 1 ? 'none' : 'auto';
    }

    nextBtn.addEventListener('click', () => {
      if (currentIndex < slides.length - 1) {
        currentIndex++;
        updateSlider();
      }
    });

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    });

    // Handle window resize dynamically to recalculate width
    window.addEventListener('resize', updateSlider);

    // Initial run
    updateSlider();
  }

  // 6. TESTIMONIAL CAROUSEL
  const testimonialContainer = document.getElementById('testimonial-active');
  const testimonialDots = document.querySelectorAll('.testimonial-carousel .carousel-dots .dot');
  
  if (testimonialContainer && testimonialDots.length > 0) {
    const testimonials = [
      {
        text: `"Brajwasi's Coders completely transformed our brand. They didn't just build a website; they designed an entire digital ecosystem. Their premium dark UI and smooth animations gave us a look our customers absolutely love."`,
        author: "Aniket Sharma",
        company: "Founder, Vrinda Enterprises"
      },
      {
        text: `"The team at Brajwasi's Coders are absolute experts in database optimization and secure JWT authentication. They built our DeFi analytics portal in record time with beautiful glassmorphic widgets."`,
        author: "Radhika Das",
        company: "CTO, AuraFin DeFi"
      },
      {
        text: `"Devotion and precision in every line of code! Our patients love the clean, fast interface, and our administrative team works seamlessly with the protected leads dashboard they designed."`,
        author: "Madhav Prasad",
        company: "Director, Mathura Care Dham"
      }
    ];

    let testimonialIndex = 0;
    let autoSlideInterval;

    function showTestimonial(index) {
      testimonialIndex = index;
      
      // Update dots
      testimonialDots.forEach((dot, idx) => {
        if (idx === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });

      // Fade out
      testimonialContainer.style.opacity = '0';
      testimonialContainer.style.transform = 'translateY(10px)';

      setTimeout(() => {
        // Change text
        const textEl = testimonialContainer.querySelector('.testimonial-text');
        const authorEl = testimonialContainer.querySelector('.client-info h4');
        const companyEl = testimonialContainer.querySelector('.client-info p');

        if (textEl) textEl.innerText = testimonials[index].text;
        if (authorEl) authorEl.innerText = testimonials[index].author;
        if (companyEl) companyEl.innerText = testimonials[index].company;

        // Fade in
        testimonialContainer.style.opacity = '1';
        testimonialContainer.style.transform = 'translateY(0)';
      }, 300);
    }

    function startAutoSlide() {
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(() => {
        let nextIndex = (testimonialIndex + 1) % testimonials.length;
        showTestimonial(nextIndex);
      }, 6000);
    }

    testimonialDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showTestimonial(idx);
        startAutoSlide(); // Reset timer on manual click
      });
    });

    // Start auto slide
    startAutoSlide();
  }
});

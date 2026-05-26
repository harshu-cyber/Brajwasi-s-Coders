/**
 * Brajwasi's Coders - Reusable Dynamic Footer Component
 */
document.addEventListener('DOMContentLoaded', () => {
  const placeholder = document.getElementById('footer-placeholder');
  if (!placeholder) return;

  placeholder.innerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="/" class="logo">
              <span class="logo-symbol">ब्रज</span>
              Brajwasi's <span>Coders</span>
            </a>
            <p>
              Combining local trust and spiritual principles with modern technical expertise to engineer top-tier software and digital designs. Let's create something divine.
            </p>
            <div class="social-links" style="margin-top: 25px;">
              <a href="#" class="social-icon" aria-label="Github"><i class="fab fa-github"></i></a>
              <a href="#" class="social-icon" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
              <a href="#" class="social-icon" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
              <a href="#" class="social-icon" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
              <a href="https://wa.me/919119974589" target="_blank" class="social-icon" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
            </div>
          </div>

          <div class="footer-links">
            <h4>Services</h4>
            <ul>
              <li><a href="/#services">Website Development</a></li>
              <li><a href="/#services">Web Applications</a></li>
              <li><a href="/#services">UI/UX Design</a></li>
              <li><a href="/#services">Dashboard Systems</a></li>
              <li><a href="/#services">Maintenance & Support</a></li>
            </ul>
          </div>

          <div class="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/#home">Home</a></li>
              <li><a href="/#about">About Us</a></li>
              <li><a href="/#portfolio">Our Work</a></li>
              <li><a href="/#process">Development Process</a></li>
              <li><a href="/#contact">Get In Touch</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} <span>Brajwasi's Coders</span>. Crafted with ❤️ & Devotion. All rights reserved.</p>
          <p>Made with love in <strong>Mathura-Vrindavan Dham</strong> 🦚</p>
        </div>
      </div>
    </footer>
  `;
});

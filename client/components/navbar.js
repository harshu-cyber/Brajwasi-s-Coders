/**
 * Brajwasi's Coders — Professional Reusable Navbar Component
 */
document.addEventListener('DOMContentLoaded', () => {
  const placeholder = document.getElementById('navbar-placeholder');
  if (!placeholder) return;

  // Auth state
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  let actionButtons = '';
  if (token && user) {
    actionButtons = `
      <a href="/dashboard" class="gradient-btn btn-primary nav-btn-mini">
        <i class="fas fa-th-large"></i> Dashboard
      </a>
      <button id="nav-logout-btn" class="gradient-btn btn-secondary nav-btn-mini">
        <i class="fas fa-sign-out-alt"></i> Logout
      </button>
    `;
  } else {
    actionButtons = `
      <a href="/login" class="gradient-btn btn-secondary nav-btn-mini">
        <i class="fas fa-user-shield"></i> Login
      </a>
    `;
  }

  placeholder.innerHTML = `
    <nav class="navbar scrolled" id="main-navbar">
      <div class="nav-main">
        <div class="container nav-container">

          <!-- Brand Logo -->
          <a href="/" class="logo">
            <img src="/assets/brand/logo.png" alt="Brajwasi's Coders Logo">
            <span class="logo-text">Brajwasi's <span>Coders</span></span>
          </a>

          <!-- Navigation Links -->
          <ul class="nav-menu" id="nav-menu">
            <li><a href="/#home"      class="nav-link active">Home</a></li>
            <li><a href="/#services"  class="nav-link">Services</a></li>
            <li><a href="/#about"     class="nav-link">About</a></li>
            <li><a href="/#portfolio" class="nav-link">Portfolio</a></li>
            <li><a href="/#process"   class="nav-link">Process</a></li>
            <li><a href="/team.html" class="nav-link">Our Team</a></li>
            <li><a href="/careers"    class="nav-link">Careers</a></li>
            <li><a href="/#contact"   class="nav-link">Contact</a></li>
          </ul>

          <!-- Right-side Actions -->
          <div class="nav-actions">
            ${actionButtons}
          </div>

          <!-- Mobile Hamburger -->
          <div class="hamburger" id="mobile-toggle" aria-label="Toggle navigation">
            <span></span>
            <span></span>
            <span></span>
          </div>

        </div>
      </div>
    </nav>
  `;

  // ── Mobile menu toggle ──────────────────────────────────────
  const hamburger = document.getElementById('mobile-toggle');
  const navMenu   = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // ── Logout ──────────────────────────────────────────────────
  const logoutBtn = document.getElementById('nav-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    });
  }

  // ── Sticky scroll ───────────────────────────────────────────
  const navbar = document.getElementById('main-navbar');
  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      // Keep scrolled style since we don't have topbar now for layout alignment
      navbar.classList.add('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // ── Active link on scroll ───────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
      const top    = section.offsetTop - 130;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = navMenu ? navMenu.querySelector(`a[href*="${id}"]`) : null;
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }, { passive: true });
});

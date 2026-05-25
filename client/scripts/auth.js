/**
 * Brajwasi's Coders - Authentication API Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  const alertContainer = document.getElementById('auth-alert');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  // Utility to show messages
  function showAlert(message, type = 'danger') {
    if (!alertContainer) return;
    alertContainer.innerText = message;
    alertContainer.className = `alert alert-${type}`;
    alertContainer.style.display = 'flex';
    
    // Auto scroll to message
    alertContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // 1. REGISTRATION FORM HANDLING
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value.trim();

      const submitBtn = registerForm.querySelector('button[type="submit"]');
      const origBtnText = submitBtn.innerHTML;

      // Reset alert
      alertContainer.style.display = 'none';

      // Validation
      if (password.length < 6) {
        showAlert('Password must be at least 6 characters.');
        return;
      }

      // Show loader
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';

      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showAlert('Registration successful! Redirecting...', 'success');
          
          // Save credentials in local storage
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));

          // Redirect to dashboard
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1200);
        } else {
          showAlert(data.error || 'Registration failed. Please check credentials.');
        }
      } catch (err) {
        console.error('Registration Fetch Error:', err);
        showAlert('Network error. Check if backend database and server are live.');
      } finally {
        if (submitBtn.disabled && !localStorage.getItem('token')) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origBtnText;
        }
      }
    });
  }

  // 2. LOGIN FORM HANDLING
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value.trim();

      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const origBtnText = submitBtn.innerHTML;

      // Reset alert
      alertContainer.style.display = 'none';

      // Show loader
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking credentials...';

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showAlert('Login verified! Launching workspace...', 'success');

          // Save credentials in local storage
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));

          // Redirect to dashboard
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1000);
        } else {
          showAlert(data.error || 'Invalid email or password.');
        }
      } catch (err) {
        console.error('Login Fetch Error:', err);
        showAlert('Network error. Check if server backend is live.');
      } finally {
        if (submitBtn.disabled && !localStorage.getItem('token')) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origBtnText;
        }
      }
    });
  }

  // Handle Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('light-theme');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  }

  // If already authenticated, skip auth screens and jump straight to dashboard
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  if (token && user && (window.location.pathname === '/login' || window.location.pathname === '/register')) {
    window.location.href = '/dashboard';
  }
});

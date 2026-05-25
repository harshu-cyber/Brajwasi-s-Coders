/**
 * Brajwasi's Coders - Careers Form Submit Controller
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('career-apply-form');
  const feedback = document.getElementById('career-form-feedback');

  if (form && feedback) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const origBtnContent = submitBtn.innerHTML;

      // Extract field inputs
      const name = document.getElementById('career-name').value.trim();
      const email = document.getElementById('career-email').value.trim();
      const phone = document.getElementById('career-phone').value.trim();
      const role = document.getElementById('career-role').value;
      const type = document.getElementById('career-type').value;
      const experience = document.getElementById('career-exp').value;
      const resumeLink = document.getElementById('career-resume').value.trim();
      const message = document.getElementById('career-message').value.trim();

      // Show loader
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
      feedback.style.display = 'none';
      feedback.className = 'form-message';

      try {
        const response = await fetch('/api/career', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, phone, role, type, experience, resumeLink, message })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          feedback.innerText = data.message || 'Application submitted successfully!';
          feedback.className = 'form-message success';
          feedback.style.display = 'block';
          form.reset();
        } else {
          feedback.innerText = data.error || 'Failed to submit application. Please check input values.';
          feedback.className = 'form-message error';
          feedback.style.display = 'block';
        }
      } catch (err) {
        console.error('Career Submit Fetch Error:', err);
        feedback.innerText = 'Network error. Please make sure the server database is live and retry.';
        feedback.className = 'form-message error';
        feedback.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtnContent;
      }
    });
  }
});

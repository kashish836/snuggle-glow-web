/**
 * Contact page JavaScript
 */

function showError(message) {
  const errorDiv = document.getElementById('error-message');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 5000);
}

function showSuccess(message) {
  const successDiv = document.getElementById('success-message');
  successDiv.textContent = message;
  successDiv.style.display = 'block';
  setTimeout(() => {
    successDiv.style.display = 'none';
  }, 5000);
}

document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    first_name: document.getElementById('first-name').value.trim(),
    last_name: document.getElementById('last-name').value.trim() || undefined,
    email: document.getElementById('email').value.trim(),
    topic: document.getElementById('topic').value,
    message: document.getElementById('message').value.trim(),
    newsletter: document.getElementById('newsletter').checked,
  };

  const submitBtn = document.getElementById('submit-btn');
  if (typeof showLoading === 'function') {
    showLoading('submit-btn');
  } else {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
  }

  try {
    const result = await submitContactMessage(formData);
    if (result.success) {
      showSuccess('Message sent! Thank you for reaching out. 💕');
      document.getElementById('contact-form').reset();
    } else {
      showError(result.error?.detail || 'Failed to send message. Please try again.');
    }
  } catch (error) {
    console.error('Contact form error:', error);
    showError('An error occurred. Please try again.');
  } finally {
    if (typeof hideLoading === 'function') {
      hideLoading('submit-btn');
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message 💕';
    }
  }
});


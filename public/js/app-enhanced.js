/**
 * Enhanced app utilities
 * Better error handling, user feedback, etc.
 */

// Enhanced error handling
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  if (typeof showToast === 'function') {
    showToast('An unexpected error occurred. Please refresh the page.', 'error', 5000);
  }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  if (typeof showToast === 'function') {
    showToast('A network error occurred. Please check your connection.', 'error', 5000);
  }
});

// Check API connection on page load
async function checkApiConnection() {
  try {
    const response = await fetch(`${window.API_BASE_URL || 'http://localhost:8000/api/v1'}/health`);
    if (!response.ok) {
      console.warn('Backend health check failed');
    }
  } catch (error) {
    console.warn('Cannot connect to backend:', error);
    if (window.location.pathname !== '/auth.html' && window.location.pathname !== '/index.html') {
      // Show warning but don't block user
    }
  }
}

// Run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkApiConnection);
} else {
  checkApiConnection();
}

// Add smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Form validation helper
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return false;
  
  const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      input.classList.add('border-red-400');
    } else {
      input.classList.remove('border-red-400');
    }
  });
  
  return isValid;
}

// Add to global scope
window.validateForm = validateForm;
window.checkApiConnection = checkApiConnection;


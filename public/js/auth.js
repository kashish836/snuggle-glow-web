/**
 * Authentication page JavaScript
 */

let isLogin = true;

function toggleAuthMode() {
  isLogin = !isLogin;
  const formTitle = document.getElementById('form-title');
  const submitBtn = document.getElementById('submit-btn');
  const toggleBtn = document.getElementById('toggle-mode');
  const displayNameGroup = document.getElementById('display-name-group');

  if (isLogin) {
    formTitle.textContent = 'Welcome Back, Mama!';
    submitBtn.textContent = 'Sign In';
    toggleBtn.innerHTML = "Don't have an account? <a href='#' onclick='toggleAuthMode(); return false;'>Sign Up</a>";
    displayNameGroup.style.display = 'none';
  } else {
    formTitle.textContent = 'Join SnuggleNest';
    submitBtn.textContent = 'Create Account';
    toggleBtn.innerHTML = "Already have an account? <a href='#' onclick='toggleAuthMode(); return false;'>Sign In</a>";
    displayNameGroup.style.display = 'block';
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  return password.length >= 8;
}

function showError(message) {
  const errorDiv = document.getElementById('error-message');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => {
      errorDiv.style.display = 'none';
    }, 5000);
  } else {
    // Fallback to toast if error div doesn't exist
    if (typeof showToast === 'function') {
      showToast(message, 'error');
    } else {
      alert(message);
    }
  }
}

function showSuccess(message) {
  const successDiv = document.getElementById('success-message');
  if (successDiv) {
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    setTimeout(() => {
      successDiv.style.display = 'none';
    }, 3000);
  } else {
    // Fallback to toast
    if (typeof showToast === 'function') {
      showToast(message, 'success');
    }
  }
}

async function handleSubmit(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const displayName = document.getElementById('display-name')?.value.trim() || '';

  // Validation
  if (!validateEmail(email)) {
    showError('Please enter a valid email address');
    return;
  }

  if (!validatePassword(password)) {
    showError('Password must be at least 8 characters long');
    return;
  }

  if (!isLogin && !displayName) {
    showError('Please enter a display name');
    return;
  }

  const submitBtn = document.getElementById('submit-btn');
  if (typeof showLoading === 'function') {
    showLoading('submit-btn');
  } else {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Please wait...';
  }

  try {
    if (isLogin) {
      // Login
      const result = await login({ email, password });
      if (result.error) {
        showError(result.error.detail || 'Login failed. Please check your credentials.');
        if (typeof hideLoading === 'function') {
          hideLoading('submit-btn');
        } else {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Sign In';
        }
        return;
      }

      // Get user info
      const user = await getCurrentUser();
      localStorage.setItem('current_user', JSON.stringify(user));
      
      showSuccess('Welcome back! Redirecting...');
      setTimeout(() => {
        window.location.href = '/index.html';
      }, 1000);
    } else {
      // Register
      const result = await register({ email, password, display_name: displayName });
      if (result.error) {
        showError(result.error.detail || 'Registration failed. Email may already be registered.');
        if (typeof hideLoading === 'function') {
          hideLoading('submit-btn');
        } else {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Create Account';
        }
        return;
      }

      // Auto-login after registration
      const loginResult = await login({ email, password });
      if (loginResult.tokens) {
        const user = await getCurrentUser();
        localStorage.setItem('current_user', JSON.stringify(user));
        showSuccess('Account created! Redirecting...');
        setTimeout(() => {
          window.location.href = '/index.html';
        }, 1000);
      }
    }
  } catch (error) {
    console.error('Auth error:', error);
    showError('An error occurred. Please try again.');
    if (typeof hideLoading === 'function') {
      hideLoading('submit-btn');
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = isLogin ? 'Sign In' : 'Create Account';
    }
  }
}

// Check if already logged in
window.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('current_user');
  if (user) {
    window.location.href = '/index.html';
  }
  
  // Initialize form
  toggleAuthMode();
  
  // Setup form handler
  document.getElementById('auth-form').addEventListener('submit', handleSubmit);
});


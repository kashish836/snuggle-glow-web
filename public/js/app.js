/**
 * Main application JavaScript
 * Handles navigation, auth state, and common utilities
 */

// Check authentication state
function isAuthenticated() {
  return !!localStorage.getItem('access_token');
}

function getCurrentUser() {
  const userStr = localStorage.getItem('current_user');
  return userStr ? JSON.parse(userStr) : null;
}

function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('current_user');
  window.location.href = '/auth.html';
}

// Update navigation based on auth state
function updateNavigation() {
  const user = getCurrentUser();
  const authLinks = document.getElementById('auth-links');
  const userMenu = document.getElementById('user-menu');
  
  if (user && authLinks && userMenu) {
    authLinks.style.display = 'none';
    userMenu.style.display = 'block';
    const userName = document.getElementById('user-name');
    if (userName) {
      userName.textContent = user.email;
    }
  } else if (authLinks && userMenu) {
    authLinks.style.display = 'block';
    userMenu.style.display = 'none';
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateNavigation();
  
  // Setup logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
});

// Toast notification system
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);


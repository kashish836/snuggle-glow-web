/**
 * Settings page JavaScript
 */

async function loadProfile() {
  try {
    const profile = await getProfile();
    const user = getCurrentUser();
    const profileInfo = document.getElementById('profile-info');
    profileInfo.innerHTML = `
      <p><strong>Display Name:</strong> ${profile.display_name || 'Not set'}</p>
      <p><strong>Email:</strong> ${user?.email || 'N/A'}</p>
      <p><strong>Bio:</strong> ${profile.bio || 'No bio yet'}</p>
    `;

    // Show verification status
    const verificationStatus = document.getElementById('verification-status');
    if (user && !user.is_verified) {
      verificationStatus.innerHTML = `
        <div class="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mt-4">
          <p class="font-medium mb-2">📧 Email Not Verified</p>
          <p class="text-sm mb-2">Please verify your email to access all features.</p>
          <button id="resend-verification" class="text-sm text-yellow-700 hover:text-yellow-800 underline">
            Resend Verification Email
          </button>
        </div>
      `;
      document.getElementById('resend-verification').addEventListener('click', async () => {
        try {
          const result = await requestVerification();
          if (result.success) {
            showToast('Verification email sent! Check your inbox.', 'success');
          } else {
            showToast(result.error || 'Failed to send verification email', 'error');
          }
        } catch (error) {
          showToast('An error occurred', 'error');
        }
      });
    } else if (user && user.is_verified) {
      verificationStatus.innerHTML = `
        <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mt-4">
          <p class="font-medium">✅ Email Verified</p>
        </div>
      `;
    }

    // Set toggle states
    document.getElementById('dark-mode-toggle').checked = profile.theme_preference === 'dark';
    document.getElementById('notifications-toggle').checked = profile.notifications_enabled;
  } catch (error) {
    console.error('Failed to load profile:', error);
    if (error.status_code === 401) {
      window.location.href = 'auth.html';
    }
  }
}

async function updateTheme(isDark) {
  const toggle = document.getElementById('dark-mode-toggle');
  try {
    showLoading('dark-mode-toggle');
    await updateProfile({ theme_preference: isDark ? 'dark' : 'light' });
    showToast('Theme updated!', 'success');
    // Apply theme immediately
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  } catch (error) {
    console.error('Failed to update theme:', error);
    showToast('Failed to update theme', 'error');
    toggle.checked = !isDark; // Revert toggle
  } finally {
    hideLoading('dark-mode-toggle');
  }
}

async function updateNotifications(enabled) {
  const toggle = document.getElementById('notifications-toggle');
  try {
    showLoading('notifications-toggle');
    await updateProfile({ notifications_enabled: enabled });
    showToast(enabled ? 'Notifications enabled!' : 'Notifications disabled', 'success');
  } catch (error) {
    console.error('Failed to update notifications:', error);
    showToast('Failed to update notifications', 'error');
    toggle.checked = !enabled; // Revert toggle
  } finally {
    hideLoading('notifications-toggle');
  }
}

// Check authentication
window.addEventListener('DOMContentLoaded', () => {
  if (!isAuthenticated()) {
    window.location.href = '/auth.html';
    return;
  }

  loadProfile();

  // Theme toggle
  document.getElementById('dark-mode-toggle').addEventListener('change', (e) => {
    updateTheme(e.target.checked);
  });

  // Notifications toggle
  document.getElementById('notifications-toggle').addEventListener('change', (e) => {
    updateNotifications(e.target.checked);
  });
});


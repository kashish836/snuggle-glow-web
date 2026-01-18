/**
 * Profile editor JavaScript
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
  }, 3000);
}

async function loadProfile() {
  try {
    const profile = await getProfile();
    document.getElementById('display-name').value = profile.display_name || '';
    document.getElementById('avatar-url').value = profile.avatar_url || '';
    document.getElementById('bio').value = profile.bio || '';
    updateBioCount();
  } catch (error) {
    console.error('Failed to load profile:', error);
    if (error.status_code === 401) {
      window.location.href = '/auth.html';
    }
  }
}

function updateBioCount() {
  const bio = document.getElementById('bio').value;
  document.getElementById('bio-count').textContent = bio.length;
}

document.getElementById('bio').addEventListener('input', updateBioCount);

document.getElementById('profile-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    display_name: document.getElementById('display-name').value.trim() || null,
    avatar_url: document.getElementById('avatar-url').value.trim() || null,
    bio: document.getElementById('bio').value.trim() || null,
  };

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';

  try {
    await updateProfile(formData);
    showSuccess('Profile updated! 💕');
    setTimeout(() => {
      window.location.href = '/settings.html';
    }, 1500);
  } catch (error) {
    console.error('Failed to update profile:', error);
    showError(error.detail || 'Failed to update profile. Please try again.');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Save Profile';
  }
});

// Check authentication and load profile
window.addEventListener('DOMContentLoaded', () => {
  if (!isAuthenticated()) {
    window.location.href = '/auth.html';
    return;
  }
  loadProfile();
});


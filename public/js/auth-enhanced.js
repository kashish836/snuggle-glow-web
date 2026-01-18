/**
 * Enhanced authentication features
 * Password reset, email verification, etc.
 */

async function requestPasswordReset(email) {
  try {
    const response = await apiClient.post('/auth/request-password-reset', { email });
    return { success: true, message: response.message };
  } catch (error) {
    return { success: false, error: error.detail || 'Failed to request password reset' };
  }
}

async function resetPassword(token, newPassword) {
  try {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      new_password: newPassword
    });
    return { success: true, message: response.message };
  } catch (error) {
    return { success: false, error: error.detail || 'Failed to reset password' };
  }
}

async function requestVerification() {
  try {
    const response = await apiClient.post('/auth/request-verification');
    return { success: true, message: response.message };
  } catch (error) {
    return { success: false, error: error.detail || 'Failed to request verification' };
  }
}

async function verifyEmail(token) {
  try {
    const response = await apiClient.post('/auth/verify-email', { token });
    return { success: true, message: response.message };
  } catch (error) {
    return { success: false, error: error.detail || 'Failed to verify email' };
  }
}


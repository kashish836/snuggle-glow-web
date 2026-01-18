/**
 * API Client for SnuggleNest Backend
 * Vanilla JavaScript version
 */

const API_BASE_URL = window.API_BASE_URL || 'http://localhost:8000/api/v1';

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.loadTokens();
  }

  loadTokens() {
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  getAccessToken() {
    return this.accessToken;
  }

  async refreshAccessToken() {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: this.refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setTokens(data.access_token, data.refresh_token);
        return true;
      } else {
        this.clearTokens();
        return false;
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      this.clearTokens();
      return false;
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    let response = await fetch(url, { ...options, headers });

    // If 401, try to refresh token
    if (response.status === 401 && this.refreshToken) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed && this.accessToken) {
        headers['Authorization'] = `Bearer ${this.accessToken}`;
        response = await fetch(url, { ...options, headers });
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`,
        status_code: response.status,
      }));
      throw error;
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return {};
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Export singleton instance
const apiClient = new ApiClient(API_BASE_URL);

// Auth functions
async function register(data) {
  try {
    const user = await apiClient.post('/auth/register', data);
    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
}

async function login(credentials) {
  try {
    const tokens = await apiClient.post('/auth/login', credentials);
    apiClient.setTokens(tokens.access_token, tokens.refresh_token);
    return { tokens, error: null };
  } catch (error) {
    return { tokens: null, error };
  }
}

async function getCurrentUser() {
  return apiClient.get('/auth/me');
}

function logout() {
  apiClient.clearTokens();
}

// Profile functions
async function getProfile() {
  return apiClient.get('/users/profile');
}

async function updateProfile(data) {
  return apiClient.put('/users/profile', data);
}

// Contact functions
async function submitContactMessage(data) {
  try {
    await apiClient.post('/contact/message', data);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

async function subscribeNewsletter(data) {
  try {
    await apiClient.post('/contact/newsletter/subscribe', data);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}


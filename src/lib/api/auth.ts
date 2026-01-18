/**
 * Authentication API functions
 */

import { apiClient, type User, type AuthTokens, type ApiError } from './client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  display_name?: string;
}

/**
 * Register a new user
 */
export async function register(data: RegisterData): Promise<{ user: User; error: null } | { user: null; error: ApiError }> {
  try {
    const user = await apiClient.post<User>('/auth/register', data);
    return { user, error: null };
  } catch (error) {
    return { user: null, error: error as ApiError };
  }
}

/**
 * Login user
 */
export async function login(credentials: LoginCredentials): Promise<{ tokens: AuthTokens; error: null } | { tokens: null; error: ApiError }> {
  try {
    const tokens = await apiClient.post<AuthTokens>('/auth/login', credentials);
    apiClient.setTokens(tokens.access_token, tokens.refresh_token);
    return { tokens, error: null };
  } catch (error) {
    return { tokens: null, error: error as ApiError };
  }
}

/**
 * Get current user info
 */
export async function getCurrentUser(): Promise<User> {
  return apiClient.get<User>('/auth/me');
}

/**
 * Logout user
 */
export function logout(): void {
  apiClient.clearTokens();
}


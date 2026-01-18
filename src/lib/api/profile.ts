/**
 * Profile API functions
 */

import { apiClient, type Profile, type ApiError } from './client';

export interface ProfileUpdate {
  display_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  theme_preference?: string;
  notifications_enabled?: boolean;
}

/**
 * Get current user's profile
 */
export async function getProfile(): Promise<Profile> {
  return apiClient.get<Profile>('/users/profile');
}

/**
 * Update current user's profile
 */
export async function updateProfile(data: ProfileUpdate): Promise<Profile> {
  return apiClient.put<Profile>('/users/profile', data);
}

/**
 * Delete current user's profile
 */
export async function deleteProfile(): Promise<{ message: string }> {
  return apiClient.delete<{ message: string }>('/users/profile');
}


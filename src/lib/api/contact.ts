/**
 * Contact and Newsletter API functions
 */

import { apiClient, type ApiError } from './client';

export interface ContactMessage {
  first_name: string;
  last_name?: string;
  email: string;
  topic: string;
  message: string;
  newsletter: boolean;
}

export interface NewsletterSubscribe {
  email: string;
}

/**
 * Submit contact form
 */
export async function submitContactMessage(
  data: ContactMessage
): Promise<{ success: true } | { success: false; error: ApiError }> {
  try {
    await apiClient.post('/contact/message', data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error as ApiError };
  }
}

/**
 * Subscribe to newsletter
 */
export async function subscribeNewsletter(
  data: NewsletterSubscribe
): Promise<{ success: true } | { success: false; error: ApiError }> {
  try {
    await apiClient.post('/contact/newsletter/subscribe', data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error as ApiError };
  }
}

/**
 * Unsubscribe from newsletter
 */
export async function unsubscribeNewsletter(
  data: NewsletterSubscribe
): Promise<{ success: true } | { success: false; error: ApiError }> {
  try {
    await apiClient.post('/contact/newsletter/unsubscribe', data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error as ApiError };
  }
}


/**
 * Input Validation & Sanitization Module
 * 
 * SECURITY: Implements OWASP best practices for input validation
 * - Schema-based validation using Zod
 * - Length limits to prevent DoS attacks
 * - Type checking to prevent injection attacks
 * - HTML/XSS sanitization
 * - Rejects unexpected fields (strict mode)
 */

import { z } from 'zod';

// ============================================================================
// COMMON VALIDATION HELPERS
// ============================================================================

/**
 * Sanitizes string input by trimming and removing potentially dangerous characters
 * SECURITY: Prevents XSS by removing script-related characters
 */
export const sanitizeString = (input: string): string => {
  return input
    .trim()
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove onclick and other event handlers
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove javascript: URLs
    .replace(/javascript:/gi, '');
};

/**
 * Creates a sanitized string schema with length limits
 * SECURITY: All strings have maximum length to prevent buffer overflow/DoS
 */
const sanitizedString = (maxLength: number = 500) =>
  z
    .string()
    .max(maxLength, { message: `Must be less than ${maxLength} characters` })
    .transform(sanitizeString);

// ============================================================================
// AUTH SCHEMAS
// ============================================================================

/**
 * Email validation with strict format checking
 * SECURITY: Prevents email injection attacks
 */
export const emailSchema = z
  .string()
  .trim()
  .min(1, { message: 'Email is required' })
  .max(255, { message: 'Email must be less than 255 characters' })
  .email({ message: 'Please enter a valid email address' })
  .transform((email) => email.toLowerCase());

/**
 * Password validation with security requirements
 * SECURITY: Enforces minimum complexity for auth security
 */
export const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters' })
  .max(128, { message: 'Password must be less than 128 characters' })
  .refine((password) => /[A-Z]/.test(password), {
    message: 'Password must contain at least one uppercase letter',
  })
  .refine((password) => /[a-z]/.test(password), {
    message: 'Password must contain at least one lowercase letter',
  })
  .refine((password) => /[0-9]/.test(password), {
    message: 'Password must contain at least one number',
  });

/**
 * Simple password schema for login (less strict)
 */
export const loginPasswordSchema = z
  .string()
  .min(1, { message: 'Password is required' })
  .max(128, { message: 'Password must be less than 128 characters' });

/**
 * Display name validation
 * SECURITY: Sanitizes to prevent XSS
 */
export const displayNameSchema = z
  .string()
  .max(50, { message: 'Display name must be less than 50 characters' })
  .transform(sanitizeString)
  .optional();

/**
 * Login form schema (strict mode - rejects unexpected fields)
 */
export const loginFormSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
}).strict();

/**
 * Signup form schema (strict mode)
 */
export const signupFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: displayNameSchema,
}).strict();

// ============================================================================
// PROFILE SCHEMAS
// ============================================================================

/**
 * Bio validation with length limit
 * SECURITY: Sanitizes HTML to prevent XSS
 */
export const bioSchema = z
  .string()
  .max(500, { message: 'Bio must be less than 500 characters' })
  .transform(sanitizeString)
  .optional()
  .nullable();

/**
 * Avatar URL validation
 * SECURITY: Only allows https URLs to prevent mixed content
 */
export const avatarUrlSchema = z
  .string()
  .max(2048, { message: 'URL must be less than 2048 characters' })
  .refine((url) => !url || url.startsWith('https://') || url.startsWith('/'), {
    message: 'Avatar URL must use HTTPS',
  })
  .optional()
  .nullable();

/**
 * Profile update schema (strict mode)
 */
export const profileUpdateSchema = z.object({
  display_name: displayNameSchema.nullable(),
  bio: bioSchema,
  avatar_url: avatarUrlSchema,
  notifications_enabled: z.boolean().optional(),
  theme_preference: z.enum(['light', 'dark']).optional(),
}).strict();

// ============================================================================
// CONTACT FORM SCHEMAS
// ============================================================================

/**
 * Name validation for contact forms
 */
export const nameSchema = z
  .string()
  .trim()
  .min(1, { message: 'Name is required' })
  .max(100, { message: 'Name must be less than 100 characters' })
  .transform(sanitizeString);

/**
 * Message validation for contact forms
 * SECURITY: Length limited and sanitized
 */
export const messageSchema = z
  .string()
  .trim()
  .min(10, { message: 'Message must be at least 10 characters' })
  .max(5000, { message: 'Message must be less than 5000 characters' })
  .transform(sanitizeString);

/**
 * Contact topic enum
 */
export const contactTopicSchema = z.enum([
  'General Question',
  'Resource Request',
  'Community Support',
  'Partnership Inquiry',
  'Technical Issue',
  'Share My Story',
]);

/**
 * Contact form schema (strict mode - rejects unexpected fields)
 */
export const contactFormSchema = z.object({
  firstName: nameSchema,
  lastName: z.string().max(100).transform(sanitizeString).optional(),
  email: emailSchema,
  topic: contactTopicSchema,
  message: messageSchema,
  newsletter: z.boolean().optional(),
}).strict();

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type LoginFormData = z.infer<typeof loginFormSchema>;
export type SignupFormData = z.infer<typeof signupFormSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;

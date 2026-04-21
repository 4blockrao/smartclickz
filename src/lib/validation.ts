import { z } from 'zod';

// ============================================
// AUTH VALIDATION SCHEMAS
// ============================================

export const emailSchema = z
  .string()
  .trim()
  .email({ message: "Invalid email address" })
  .max(255, { message: "Email must be less than 255 characters" })
  .toLowerCase();

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .max(128, { message: "Password must be less than 128 characters" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" });

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format" })
  .optional();

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Password is required" }),
});

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  phone: phoneSchema,
  countryCode: z.string().optional(),
  referralCode: z.string().trim().max(50).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// ============================================
// PROFILE VALIDATION SCHEMAS
// ============================================

export const profileUpdateSchema = z.object({
  full_name: z
    .string()
    .trim()
    .max(100, { message: "Name must be less than 100 characters" })
    .optional(),
  bio: z
    .string()
    .trim()
    .max(500, { message: "Bio must be less than 500 characters" })
    .optional(),
  location: z
    .string()
    .trim()
    .max(100, { message: "Location must be less than 100 characters" })
    .optional(),
  website: z
    .string()
    .trim()
    .url({ message: "Invalid website URL" })
    .max(255, { message: "Website URL must be less than 255 characters" })
    .optional()
    .or(z.literal('')),
});

// ============================================
// TASK VALIDATION SCHEMAS
// ============================================

export const taskSubmissionSchema = z.object({
  screenshot_url: z
    .string()
    .url({ message: "Invalid screenshot URL" })
    .max(500, { message: "URL must be less than 500 characters" }),
  notes: z
    .string()
    .trim()
    .max(1000, { message: "Notes must be less than 1000 characters" })
    .optional(),
});

// ============================================
// COMMENT VALIDATION SCHEMAS
// ============================================

export const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: "Comment cannot be empty" })
    .max(2000, { message: "Comment must be less than 2000 characters" }),
});

// ============================================
// WITHDRAWAL VALIDATION SCHEMAS
// ============================================

export const withdrawalSchema = z.object({
  amount: z
    .number()
    .positive({ message: "Amount must be positive" })
    .max(1000000, { message: "Amount too large" }),
  method: z.enum(['bank_transfer', 'paypal', 'crypto'], {
    errorMap: () => ({ message: "Invalid withdrawal method" }),
  }),
  account_details: z
    .string()
    .trim()
    .min(1, { message: "Account details are required" })
    .max(500, { message: "Account details must be less than 500 characters" }),
});

// ============================================
// CAMPAIGN VALIDATION SCHEMAS
// ============================================

export const campaignSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(200, { message: "Title must be less than 200 characters" }),
  description: z
    .string()
    .trim()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(5000, { message: "Description must be less than 5000 characters" }),
  target_url: z
    .string()
    .url({ message: "Invalid URL" })
    .max(500, { message: "URL must be less than 500 characters" })
    .optional()
    .or(z.literal('')),
  reward_per_task: z
    .number()
    .positive({ message: "Reward must be positive" })
    .max(10000, { message: "Reward too large" }),
  total_budget: z
    .number()
    .positive({ message: "Budget must be positive" })
    .max(1000000, { message: "Budget too large" }),
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Sanitize HTML content - removes potentially dangerous elements
 */
export function sanitizeHtml(html: string): string {
  // Basic sanitization - remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '');
}

/**
 * Encode URL parameters safely
 */
export function encodeUrlParam(param: string): string {
  return encodeURIComponent(param);
}

/**
 * Validate and sanitize user input
 */
export function sanitizeInput(input: string, maxLength: number = 1000): string {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, ''); // Remove < and > to prevent XSS
}

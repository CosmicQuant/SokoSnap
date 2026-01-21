/**
 * Input validation schemas using Zod
 * Provides type-safe validation for all user inputs
 */

import { z } from 'zod';

// ============================================
// Phone Number Validation
// ============================================

/**
 * Kenyan phone number validation
 * Supports formats: 07XXXXXXXX, +254XXXXXXXXX, 254XXXXXXXXX
 */
export const kenyanPhoneSchema = z
    .string()
    .min(1, 'Phone number is required')
    .transform((val) => val.replace(/\s+/g, '').replace(/-/g, ''))
    .refine(
        (val) => {
            // Remove common prefixes and validate
            const cleaned = val.replace(/^\+?254/, '0');
            return /^0[17]\d{8}$/.test(cleaned);
        },
        {
            message: 'Please enter a valid Kenyan phone number (e.g., 0712 345 678)',
        }
    );

/**
 * Normalize phone number to standard format
 */
export const normalizePhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\s+/g, '').replace(/-/g, '');
    if (cleaned.startsWith('+254')) {
        return '0' + cleaned.slice(4);
    }
    if (cleaned.startsWith('254')) {
        return '0' + cleaned.slice(3);
    }
    return cleaned;
};

// ============================================
// Location Validation
// ============================================

export const locationSchema = z
    .string()
    .min(3, 'Location must be at least 3 characters')
    .max(200, 'Location must be less than 200 characters')
    .regex(
        /^[a-zA-Z0-9\s,.\-']+$/,
        'Location contains invalid characters'
    );

// ============================================
// Authentication Schemas
// ============================================

export const loginSchema = z.object({
    phone: kenyanPhoneSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ============================================
// Checkout Schemas
// ============================================

export const checkoutSchema = z.object({
    phone: kenyanPhoneSchema,
    location: locationSchema,
    notes: z
        .string()
        .max(500, 'Notes must be less than 500 characters')
        .optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// ============================================
// Seller Registration Schemas
// ============================================

export const sellerRegistrationSchema = z.object({
    businessName: z
        .string()
        .min(2, 'Business name must be at least 2 characters')
        .max(100, 'Business name must be less than 100 characters')
        .regex(
            /^[a-zA-Z0-9\s\-&']+$/,
            'Business name contains invalid characters'
        ),
    phone: kenyanPhoneSchema,
    email: z
        .string()
        .email('Please enter a valid email address')
        .optional()
        .or(z.literal('')),
    category: z.enum([
        'fashion',
        'electronics',
        'beauty',
        'home',
        'sports',
        'other',
    ]),
    socialLinks: z
        .array(z.string().url('Please enter a valid URL'))
        .max(5, 'Maximum 5 social links allowed')
        .optional(),
});

export type SellerRegistrationFormData = z.infer<typeof sellerRegistrationSchema>;

// ============================================
// Product Schemas
// ============================================

export const productSchema = z.object({
    name: z
        .string()
        .min(3, 'Product name must be at least 3 characters')
        .max(150, 'Product name must be less than 150 characters'),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(1000, 'Description must be less than 1000 characters'),
    price: z
        .number()
        .min(1, 'Price must be at least KES 1')
        .max(10000000, 'Price must be less than KES 10,000,000'),
    category: z.string().min(1, 'Category is required'),
    stock: z.number().int().min(0, 'Stock cannot be negative').optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

// ============================================
// Smart Link Schemas
// ============================================

export const smartLinkSchema = z.object({
    url: z
        .string()
        .url('Please enter a valid URL')
        .refine(
            (val) =>
                val.includes('tiktok.com') ||
                val.includes('instagram.com') ||
                val.includes('twitter.com') ||
                val.includes('facebook.com'),
            {
                message: 'URL must be from TikTok, Instagram, Twitter, or Facebook',
            }
        ),
});

export type SmartLinkFormData = z.infer<typeof smartLinkSchema>;

// ============================================
// Search & Filter Schemas
// ============================================

export const searchSchema = z.object({
    query: z
        .string()
        .min(2, 'Search must be at least 2 characters')
        .max(100, 'Search must be less than 100 characters')
        .optional(),
    minPrice: z.number().min(0).optional(),
    maxPrice: z.number().min(0).optional(),
    category: z.string().optional(),
    verified: z.boolean().optional(),
});

export type SearchFormData = z.infer<typeof searchSchema>;

// ============================================
// Validation Helper Functions
// ============================================

/**
 * Validate data against a schema and return typed result
 */
export function validateData<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, errors: result.error };
}

/**
 * Get formatted error messages from Zod errors
 */
export function getErrorMessages(errors: z.ZodError): Record<string, string> {
    const messages: Record<string, string> = {};
    errors.errors.forEach((err) => {
        const path = err.path.join('.');
        if (!messages[path]) {
            messages[path] = err.message;
        }
    });
    return messages;
}

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeInput(input: string): string {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

/**
 * Validate and sanitize form data
 */
export function sanitizeFormData<T extends Record<string, unknown>>(
    data: T
): T {
    const sanitized = { ...data };
    for (const key in sanitized) {
        if (typeof sanitized[key] === 'string') {
            (sanitized as Record<string, unknown>)[key] = sanitizeInput(
                sanitized[key] as string
            );
        }
    }
    return sanitized;
}

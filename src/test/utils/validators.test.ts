/**
 * Validators Tests
 */

import { describe, it, expect } from 'vitest';
import {
    kenyanPhoneSchema,
    locationSchema,
    checkoutSchema,
    validateData,
    sanitizeInput,
    normalizePhoneNumber,
} from '../../utils/validators';

describe('kenyanPhoneSchema', () => {
    it('accepts valid Safaricom numbers', () => {
        const result = kenyanPhoneSchema.safeParse('0712345678');
        expect(result.success).toBe(true);
    });

    it('accepts valid Airtel numbers', () => {
        const result = kenyanPhoneSchema.safeParse('0100123456');
        expect(result.success).toBe(true);
    });

    it('accepts numbers with country code', () => {
        const result = kenyanPhoneSchema.safeParse('+254712345678');
        expect(result.success).toBe(true);
    });

    it('accepts numbers with spaces', () => {
        const result = kenyanPhoneSchema.safeParse('0712 345 678');
        expect(result.success).toBe(true);
    });

    it('rejects invalid numbers', () => {
        const result = kenyanPhoneSchema.safeParse('123456');
        expect(result.success).toBe(false);
    });

    it('rejects empty strings', () => {
        const result = kenyanPhoneSchema.safeParse('');
        expect(result.success).toBe(false);
    });
});

describe('locationSchema', () => {
    it('accepts valid locations', () => {
        const result = locationSchema.safeParse('Westlands, Nairobi');
        expect(result.success).toBe(true);
    });

    it('rejects too short locations', () => {
        const result = locationSchema.safeParse('AB');
        expect(result.success).toBe(false);
    });

    it('rejects locations with invalid characters', () => {
        const result = locationSchema.safeParse('Location <script>');
        expect(result.success).toBe(false);
    });
});

describe('checkoutSchema', () => {
    it('validates complete checkout data', () => {
        const data = {
            phone: '0712345678',
            location: 'Westlands, Nairobi',
        };
        const result = checkoutSchema.safeParse(data);
        expect(result.success).toBe(true);
    });

    it('validates with optional notes', () => {
        const data = {
            phone: '0712345678',
            location: 'Westlands, Nairobi',
            notes: 'Call before delivery',
        };
        const result = checkoutSchema.safeParse(data);
        expect(result.success).toBe(true);
    });

    it('fails with invalid phone', () => {
        const data = {
            phone: 'invalid',
            location: 'Westlands, Nairobi',
        };
        const result = checkoutSchema.safeParse(data);
        expect(result.success).toBe(false);
    });
});

describe('normalizePhoneNumber', () => {
    it('normalizes +254 prefix', () => {
        expect(normalizePhoneNumber('+254712345678')).toBe('0712345678');
    });

    it('normalizes 254 prefix', () => {
        expect(normalizePhoneNumber('254712345678')).toBe('0712345678');
    });

    it('keeps already normalized numbers', () => {
        expect(normalizePhoneNumber('0712345678')).toBe('0712345678');
    });

    it('removes spaces', () => {
        expect(normalizePhoneNumber('0712 345 678')).toBe('0712345678');
    });
});

describe('sanitizeInput', () => {
    it('escapes HTML tags', () => {
        expect(sanitizeInput('<script>alert("xss")</script>')).not.toContain('<script>');
    });

    it('escapes quotes', () => {
        const result = sanitizeInput('Test "quoted" and \'single\'');
        expect(result).not.toContain('"');
        expect(result).not.toContain("'");
    });

    it('preserves normal text', () => {
        expect(sanitizeInput('Hello World')).toBe('Hello World');
    });
});

describe('validateData', () => {
    it('returns success with valid data', () => {
        const result = validateData(locationSchema, 'Valid Location');
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toBe('Valid Location');
        }
    });

    it('returns errors with invalid data', () => {
        const result = validateData(locationSchema, 'AB');
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.errors).toBeDefined();
        }
    });
});

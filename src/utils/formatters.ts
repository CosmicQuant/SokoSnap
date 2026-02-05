/**
 * Formatting utility functions
 */

/**
 * Format currency in Kenyan Shillings
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
    return `KES ${amount.toLocaleString('en-US')}`;
}

/**
 * Format large numbers with K, M, B suffixes
 * @param num - Number to format
 * @returns Formatted string
 */
export function formatCompactNumber(num: number): string {
    if (num >= 1000000000) {
        return `${(num / 1000000000).toFixed(1)}B`;
    }
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
}

/**
 * Format phone number for display
 * @param phone - Phone number string
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    }
    return phone;
}

/**
 * Mask phone number for privacy
 * @param phone - Phone number string
 * @returns Masked phone number
 */
export function maskPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 6) {
        return `${cleaned.slice(0, 4)}***${cleaned.slice(-3)}`;
    }
    return '****';
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param date - Date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string): string {
    const now = new Date();
    const then = typeof date === 'string' ? new Date(date) : date;
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
        { label: 'second', seconds: 1 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return count === 1
                ? `${count} ${interval.label} ago`
                : `${count} ${interval.label}s ago`;
        }
    }

    return 'Just now';
}

/**
 * Format date to readable string
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Format date and time
 * @param date - Date to format
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('en-KE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Generate order ID
 * @param prefix - Prefix for the ID
 * @returns Generated order ID
 */
export function generateOrderId(prefix = 'ORD'): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}${random}`;
}

/**
 * Generate OTP code
 * @param length - Length of OTP
 * @returns Generated OTP
 */
export function generateOTP(length = 4): string {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

/**
 * Parse likes string to number
 * @param likes - Likes string (e.g., "12.4k")
 * @returns Number value
 */
export function parseLikesCount(likes: string): number {
    const normalized = likes.toLowerCase().replace(/,/g, '');
    if (normalized.endsWith('k')) {
        return parseFloat(normalized) * 1000;
    }
    if (normalized.endsWith('m')) {
        return parseFloat(normalized) * 1000000;
    }
    return parseInt(normalized, 10) || 0;
}

/**
 * Get initials from name
 * @param name - Full name
 * @returns Initials (max 2 characters)
 */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

/**
 * Generate an SEO-friendly slug from a string
 * @param text - Text to slugify
 * @returns Slugified string (e.g., "My Shop Name" -> "my-shop-name")
 */
export function slugify(text: string): string {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
        .replace(/\-\-+/g, '-')      // Replace multiple - with single -
        .replace(/^-+/, '')          // Trim - from start of text
        .replace(/-+$/, '');         // Trim - from end of text
}

/**
 * Capitalize first letter of each word
 * @param text - Text to capitalize
 * @returns Capitalized text
 */
export function capitalizeWords(text: string): string {
    return text
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

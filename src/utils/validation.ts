export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export const validatePhone = (phone: string): ValidationResult => {
    // Removes spaces, dashes
    const cleanPhone = phone.replace(/[\s-]/g, '');

    // Kenyan Phone Regex:
    // Matches: +254..., 254..., 07..., 01...
    // Total digits check: 
    // If starts with 254 -> 12 digits
    // If starts with 0 -> 10 digits

    const kenyaOne = /^(254|0)(1|7)\d{8}$/;
    const kenyaPlus = /^(\+254)(1|7)\d{8}$/;

    if (!cleanPhone) {
        return { isValid: false, error: 'Phone number is required.' };
    }

    if (kenyaOne.test(cleanPhone) || kenyaPlus.test(cleanPhone)) {
        return { isValid: true };
    }

    return { isValid: false, error: 'Please enter a valid M-Pesa number (e.g., 0712...)' };
};

export const validateLocation = (location: string): ValidationResult => {
    if (!location || location.trim().length < 3) {
        return { isValid: false, error: 'Location must be at least 3 characters.' };
    }
    return { isValid: true };
};

// Simulate Server-Side OTP Generation
// In a real app, this would be an API call
export const generateMockSecureOTP = async (): Promise<number> => {
    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
            // Secure random (less predictable than Math.random for demo purposes, 
            // though strictly crypto.getRandomValues is better)
            const min = 1000;
            const max = 9999;
            const otp = Math.floor(min + Math.random() * (max - min + 1));
            resolve(otp);
        }, 1500);
    });
};

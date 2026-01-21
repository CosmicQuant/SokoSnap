/**
 * Test Utilities
 * Helper functions for testing React components
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from '../components/common';

/**
 * All providers wrapper for testing
 * Add providers here as your app grows (e.g., React Query, Router, etc.)
 */
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ErrorBoundary>
            {children}
        </ErrorBoundary>
    );
};

/**
 * Custom render function that includes providers
 */
const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
) => {
    return {
        user: userEvent.setup(),
        ...render(ui, { wrapper: AllTheProviders, ...options }),
    };
};

/**
 * Re-export everything from testing-library
 */
export * from '@testing-library/react';

/**
 * Override render with custom render
 */
export { customRender as render };

/**
 * Wait for loading states to complete
 */
export const waitForLoadingToFinish = async () => {
    // This can be customized based on your loading indicators
    await new Promise((resolve) => setTimeout(resolve, 100));
};

/**
 * Create a mock product for testing
 */
export const createMockProduct = (overrides = {}) => ({
    id: 'test-prod-1',
    sellerId: 'test-seller-1',
    sellerName: 'Test Seller',
    sellerHandle: '@test_seller',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Test',
    verified: true,
    name: 'Test Product',
    price: 1000,
    currency: 'KES',
    type: 'image' as const,
    mediaUrl: 'https://example.com/image.jpg',
    description: 'Test product description',
    likes: '100',
    comments: '10',
    isHighValue: false,
    ...overrides,
});

/**
 * Create a mock user for testing
 */
export const createMockUser = (overrides = {}) => ({
    id: 'test-user-1',
    name: 'Test User',
    phone: '0712345678',
    type: 'verified_buyer' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
});

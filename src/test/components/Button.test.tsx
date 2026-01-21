/**
 * Button Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../utils';
import { Button } from '../../components/common';

describe('Button', () => {
    it('renders with default props', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('applies variant classes correctly', () => {
        render(<Button variant="success">Success</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-emerald-500');
    });

    it('shows loading state', () => {
        render(<Button isLoading>Submit</Button>);
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('calls onClick handler', async () => {
        const handleClick = vi.fn();
        const { user } = render(<Button onClick={handleClick}>Click</Button>);

        await user.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
        const handleClick = vi.fn();
        const { user } = render(<Button onClick={handleClick} disabled>Click</Button>);

        await user.click(screen.getByRole('button'));
        expect(handleClick).not.toHaveBeenCalled();
    });

    it('renders with left and right icons', () => {
        render(
            <Button leftIcon={<span data-testid="left-icon">L</span>} rightIcon={<span data-testid="right-icon">R</span>}>
                Icon Button
            </Button>
        );

        expect(screen.getByTestId('left-icon')).toBeInTheDocument();
        expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('applies full width class', () => {
        render(<Button fullWidth>Full Width</Button>);
        expect(screen.getByRole('button')).toHaveClass('w-full');
    });
});

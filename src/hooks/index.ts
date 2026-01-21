/**
 * Custom React Hooks
 * Reusable hooks for common functionality
 */

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * useIntersectionObserver - Lazy loading for videos and images
 * @param options - IntersectionObserver options
 * @returns [ref, isIntersecting] - Ref to attach and visibility state
 */
export function useIntersectionObserver<T extends HTMLElement>(
    options: IntersectionObserverInit = {}
): [React.RefObject<T | null>, boolean] {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const ref = useRef<T | null>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry) {
                setIsIntersecting(entry.isIntersecting);
            }
        }, {
            threshold: 0.5,
            ...options,
        });

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [options]);

    return [ref, isIntersecting];
}

/**
 * useDebounce - Debounce a value
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

/**
 * useLocalStorage - Persist state in localStorage
 * @param key - localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns [storedValue, setValue] - Current value and setter
 */
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = useCallback(
        (value: T | ((val: T) => T)) => {
            try {
                const valueToStore = value instanceof Function ? value(storedValue) : value;
                setStoredValue(valueToStore);
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            } catch (error) {
                console.warn(`Error setting localStorage key "${key}":`, error);
            }
        },
        [key, storedValue]
    );

    return [storedValue, setValue];
}

/**
 * usePrevious - Get previous value of a variable
 * @param value - Current value
 * @returns Previous value
 */
export function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T | undefined>(undefined);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

/**
 * useMediaQuery - Responsive design hook
 * @param query - CSS media query string
 * @returns Whether the query matches
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia(query).matches;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, [query]);

    return matches;
}

/**
 * useIsMobile - Check if device is mobile
 * @returns Whether device is mobile
 */
export function useIsMobile(): boolean {
    return useMediaQuery('(max-width: 768px)');
}

/**
 * useOnClickOutside - Detect clicks outside an element
 * @param ref - Ref of the element
 * @param handler - Callback when clicked outside
 */
export function useOnClickOutside<T extends HTMLElement>(
    ref: React.RefObject<T | null>,
    handler: (event: MouseEvent | TouchEvent) => void
): void {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            const el = ref.current;
            if (!el || el.contains(event.target as Node)) {
                return;
            }
            handler(event);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
}

/**
 * useKeyPress - Detect key presses
 * @param targetKey - Key to detect
 * @param handler - Callback when key is pressed
 */
export function useKeyPress(
    targetKey: string,
    handler: (event: KeyboardEvent) => void
): void {
    useEffect(() => {
        const keyHandler = (event: KeyboardEvent) => {
            if (event.key === targetKey) {
                handler(event);
            }
        };

        window.addEventListener('keydown', keyHandler);
        return () => window.removeEventListener('keydown', keyHandler);
    }, [targetKey, handler]);
}

/**
 * useScrollLock - Lock body scroll (for modals)
 * @param isLocked - Whether scroll should be locked
 */
export function useScrollLock(isLocked: boolean): void {
    useEffect(() => {
        if (isLocked) {
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [isLocked]);
}

/**
 * useAsync - Handle async operations with loading/error states
 * @param asyncFunction - Async function to execute
 * @param immediate - Whether to execute immediately
 */
export function useAsync<T, E = Error>(
    asyncFunction: () => Promise<T>,
    immediate = true
): {
    execute: () => Promise<void>;
    data: T | null;
    isLoading: boolean;
    error: E | null;
} {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(immediate);
    const [error, setError] = useState<E | null>(null);

    const execute = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await asyncFunction();
            setData(result);
        } catch (err) {
            setError(err as E);
        } finally {
            setIsLoading(false);
        }
    }, [asyncFunction]);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);

    return { execute, data, isLoading, error };
}

/**
 * useCountdown - Countdown timer hook
 * @param initialSeconds - Starting seconds
 * @param onComplete - Callback when countdown reaches 0
 */
export function useCountdown(
    initialSeconds: number,
    onComplete?: () => void
): {
    seconds: number;
    isRunning: boolean;
    start: () => void;
    pause: () => void;
    reset: () => void;
} {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const start = useCallback(() => setIsRunning(true), []);
    const pause = useCallback(() => setIsRunning(false), []);
    const reset = useCallback(() => {
        setIsRunning(false);
        setSeconds(initialSeconds);
    }, [initialSeconds]);

    useEffect(() => {
        if (isRunning && seconds > 0) {
            intervalRef.current = setInterval(() => {
                setSeconds((s) => s - 1);
            }, 1000);
        } else if (seconds === 0) {
            setIsRunning(false);
            onComplete?.();
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, seconds, onComplete]);

    return { seconds, isRunning, start, pause, reset };
}

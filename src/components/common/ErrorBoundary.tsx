import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors in child components and displays a fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.setState({ errorInfo });

        // Log error to console in development
        if (import.meta.env.DEV) {
            console.error('Error caught by ErrorBoundary:', error);
            console.error('Component stack:', errorInfo.componentStack);
        }

        // Call optional error handler (for external logging services)
        this.props.onError?.(error, errorInfo);

        // TODO: In production, send to error tracking service like Sentry
        // if (import.meta.env.PROD) {
        //   Sentry.captureException(error, { extra: errorInfo });
        // }
    }

    handleReload = (): void => {
        window.location.reload();
    };

    handleGoHome = (): void => {
        window.location.href = '/';
    };

    handleRetry = (): void => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                    <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center animate-in zoom-in-95 duration-300">
                        {/* Error Icon */}
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-10 h-10 text-red-500" />
                        </div>

                        {/* Error Message */}
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">
                            Oops! Something went wrong
                        </h1>
                        <p className="text-slate-500 mb-6 leading-relaxed">
                            We apologize for the inconvenience. An unexpected error occurred.
                            Please try again or return to the home page.
                        </p>

                        {/* Error Details (Development Only) */}
                        {import.meta.env.DEV && this.state.error && (
                            <div className="bg-slate-100 rounded-xl p-4 mb-6 text-left overflow-auto max-h-32">
                                <p className="text-xs font-mono text-red-600 break-words">
                                    {this.state.error.message}
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={this.handleRetry}
                                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wide shadow-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={18} />
                                Try Again
                            </button>

                            <button
                                onClick={this.handleGoHome}
                                className="w-full bg-slate-100 text-slate-700 py-4 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <Home size={18} />
                                Return Home
                            </button>
                        </div>

                        {/* Support Info */}
                        <p className="mt-6 text-xs text-slate-400">
                            If this problem persists, please contact our support team.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * Higher-order component for adding error boundary to any component
 */
export function withErrorBoundary<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    fallback?: ReactNode
): React.FC<P> {
    const ComponentWithErrorBoundary: React.FC<P> = (props) => (
        <ErrorBoundary fallback={fallback}>
            <WrappedComponent {...props} />
        </ErrorBoundary>
    );

    ComponentWithErrorBoundary.displayName = `WithErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name || 'Component'
        })`;

    return ComponentWithErrorBoundary;
}

export default ErrorBoundary;

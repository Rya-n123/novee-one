import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-[400px] items-center justify-center p-6">
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                                </div>
                            </div>
                            <CardTitle>Something went wrong</CardTitle>
                            <CardDescription>
                                An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <details className="text-xs text-muted-foreground">
                                    <summary className="cursor-pointer">Error details</summary>
                                    <pre className="mt-2 overflow-auto whitespace-pre-wrap break-words">
                                        {this.state.error.message}
                                        {this.state.error.stack}
                                    </pre>
                                </details>
                            )}
                            <div className="flex gap-2">
                                <Button onClick={() => window.location.reload()} className="flex-1 gap-2" variant="outline">
                                    <RefreshCw className="h-4 w-4" />
                                    Refresh Page
                                </Button>
                                <Button onClick={() => (window.location.href = '/dashboard')} className="flex-1 gap-2">
                                    <Home className="h-4 w-4" />
                                    Go Home
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

// Simple error display component for non-boundary errors
export function ErrorDisplay({
    title = 'Something went wrong',
    description,
    error,
    onRetry,
    showHome = true,
}: {
    title?: string;
    description?: string;
    error?: string;
    onRetry?: () => void;
    showHome?: boolean;
}) {
    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                </div>
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-3">
                {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{error}</div>}
                <div className="flex gap-2">
                    {onRetry && (
                        <Button onClick={onRetry} className="flex-1 gap-2" variant="outline">
                            <RefreshCw className="h-4 w-4" />
                            Try Again
                        </Button>
                    )}
                    {showHome && (
                        <Button onClick={() => (window.location.href = '/dashboard')} className={onRetry ? 'flex-1 gap-2' : 'w-full gap-2'}>
                            <Home className="h-4 w-4" />
                            Go Home
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

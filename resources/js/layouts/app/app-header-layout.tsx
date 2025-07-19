import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { ErrorBoundary } from '@/components/error-boundary';
import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';

export default function AppHeaderLayout({ children, breadcrumbs }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <ErrorBoundary>
            <AppShell>
                <AppHeader breadcrumbs={breadcrumbs} />
                <AppContent>
                    <ErrorBoundary>
                        {children}
                    </ErrorBoundary>
                </AppContent>

                <Toaster
                    position="top-center"
                    richColors
                    closeButton
                    duration={4000}
                    toastOptions={{
                        className: 'text-sm',
                    }}
                />
            </AppShell>
        </ErrorBoundary>
    );
}

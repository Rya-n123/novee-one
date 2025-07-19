import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    text?: string;
}

export function Loading({ size = 'md', className, text }: LoadingProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
    };

    return (
        <div className={cn('flex items-center justify-center gap-2', className)}>
            <Loader2 className={cn('animate-spin', sizeClasses[size])} />
            {text && <span className="text-sm text-muted-foreground">{text}</span>}
        </div>
    );
}

export function PageLoading({ text = 'Loading...' }: { text?: string }) {
    return (
        <div className="flex flex-1 items-center justify-center py-12">
            <div className="text-center">
                <Loading size="lg" />
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
        </div>
    );
}

export function ComponentLoading({ text }: { text?: string }) {
    return (
        <div className="flex items-center justify-center py-8">
            <Loading text={text} />
        </div>
    );
}

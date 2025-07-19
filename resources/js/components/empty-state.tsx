import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
        icon?: LucideIcon;
    };
    children?: ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function EmptyState({ icon: Icon, title, description, action, children, className, size = 'md' }: EmptyStateProps) {
    const sizeClasses = {
        sm: {
            container: 'py-8',
            icon: 'h-8 w-8',
            title: 'text-lg',
        },
        md: {
            container: 'py-12',
            icon: 'h-12 w-12',
            title: 'text-xl',
        },
        lg: {
            container: 'py-16',
            icon: 'h-16 w-16',
            title: 'text-2xl',
        },
    };

    return (
        <Card className={cn('w-full', className)}>
            <CardContent className={cn('flex flex-col items-center justify-center text-center', sizeClasses[size].container)}>
                {Icon && (
                    <div className="mb-4">
                        <Icon className={cn('text-muted-foreground', sizeClasses[size].icon)} />
                    </div>
                )}
                <h3 className={cn('font-semibold text-foreground mb-2', sizeClasses[size].title)}>{title}</h3>
                {description && <p className="text-muted-foreground text-center max-w-sm mb-4">{description}</p>}
                {action && (
                    <Button onClick={action.onClick} className="gap-2">
                        {action.icon && <action.icon className="h-4 w-4" />}
                        {action.label}
                    </Button>
                )}
                {children}
            </CardContent>
        </Card>
    );
}

export function InlineEmptyState({ icon: Icon, title, description, action, children, className }: Omit<EmptyStateProps, 'size'>) {
    return (
        <div className={cn('flex flex-col items-center justify-center text-center py-8', className)}>
            {Icon && (
                <div className="mb-3">
                    <Icon className="h-8 w-8 text-muted-foreground" />
                </div>
            )}
            <h4 className="font-medium text-foreground mb-1">{title}</h4>
            {description && <p className="text-sm text-muted-foreground text-center max-w-sm mb-3">{description}</p>}
            {action && (
                <Button onClick={action.onClick} size="sm" className="gap-2">
                    {action.icon && <action.icon className="h-3 w-3" />}
                    {action.label}
                </Button>
            )}
            {children}
        </div>
    );
}

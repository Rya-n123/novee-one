import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import { forwardRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    value: string;
    onChange: (value: string) => void;
    onClear?: () => void;
    placeholder?: string;
    className?: string;
    showClearButton?: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    ({ value, onChange, onClear, placeholder = 'Search...', className, showClearButton = true, ...props }, ref) => {
        const [isFocused, setIsFocused] = useState(false);

        const handleClear = () => {
            onChange('');
            onClear?.();
        };

        return (
            <div className={cn('relative', className)}>
                <div className="relative">
                    <Search
                        className={cn(
                            'absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors',
                            isFocused ? 'text-primary' : 'text-muted-foreground',
                        )}
                    />
                    <Input
                        ref={ref}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder}
                        className={cn('pl-10', value && showClearButton && 'pr-10')}
                        {...props}
                    />
                    {value && showClearButton && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleClear}
                            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 hover:bg-muted"
                        >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Clear search</span>
                        </Button>
                    )}
                </div>
            </div>
        );
    },
);

SearchInput.displayName = 'SearchInput';

import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { forwardRef, ReactNode } from 'react';
import { Input } from './input';
import { Label } from './label';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    success?: string;
    helperText?: string;
    icon?: ReactNode;
    required?: boolean;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
    ({ label, error, success, helperText, icon, required, className, id, ...props }, ref) => {
        const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;
        const hasError = Boolean(error);
        const hasSuccess = Boolean(success) && !hasError;

        return (
            <div className="space-y-2">
                {label && (
                    <Label htmlFor={fieldId} className="flex items-center gap-1">
                        {icon}
                        {label}
                        {required && <span className="text-red-500">*</span>}
                    </Label>
                )}

                <div className="relative">
                    <Input
                        ref={ref}
                        id={fieldId}
                        className={cn(className, hasError && 'form-field-error', hasSuccess && 'form-field-success')}
                        {...props}
                    />

                    {(hasError || hasSuccess) && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {hasError && <AlertCircle className="h-4 w-4 text-red-500" />}
                            {hasSuccess && <CheckCircle className="h-4 w-4 text-green-500" />}
                        </div>
                    )}
                </div>

                {(error || success || helperText) && (
                    <div className="text-sm">
                        {error && (
                            <p className="flex items-center gap-1 text-red-500">
                                <AlertCircle className="h-3 w-3" />
                                {error}
                            </p>
                        )}
                        {success && !error && (
                            <p className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="h-3 w-3" />
                                {success}
                            </p>
                        )}
                        {helperText && !error && !success && <p className="text-muted-foreground">{helperText}</p>}
                    </div>
                )}
            </div>
        );
    },
);

FormField.displayName = 'FormField';

// Enhanced validation utilities
export const validators = {
    required: (value: string) => (!value.trim() ? 'This field is required' : null),
    email: (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Please enter a valid email address' : null;
    },
    minLength: (min: number) => (value: string) => (value.length < min ? `Must be at least ${min} characters` : null),
    maxLength: (max: number) => (value: string) => (value.length > max ? `Must be no more than ${max} characters` : null),
    number: (value: string) => {
        const num = parseFloat(value);
        return isNaN(num) ? 'Please enter a valid number' : null;
    },
    positiveNumber: (value: string) => {
        const num = parseFloat(value);
        return isNaN(num) || num <= 0 ? 'Please enter a positive number' : null;
    },
    unique: (existingValues: string[]) => (value: string) => (existingValues.includes(value.trim()) ? 'This value already exists' : null),
};

export const validateField = (value: string, validatorFns: Array<(value: string) => string | null>): string | null => {
    for (const validator of validatorFns) {
        const error = validator(value);
        if (error) return error;
    }
    return null;
};

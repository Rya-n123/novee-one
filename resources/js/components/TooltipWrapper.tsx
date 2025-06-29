// components/ui/tooltip-wrapper.tsx
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { type ReactNode } from 'react';

interface Props {
    label: string;
    children: ReactNode;
}

export default function TooltipWrapper({ label, children }: Props) {
    return (
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

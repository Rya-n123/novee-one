// resources/js/hooks/use-can.ts
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

export function useCan(role: string) {
    const { auth } = usePage<PageProps>().props;
    return auth.user?.role === role;
}

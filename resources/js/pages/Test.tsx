import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Test() {
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(message);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Test Page', href: '/test' }]}>
            <Head title="Test Page" />

            <div className="mx-auto max-w-lg space-y-6 p-6">
                <h1 className="text-2xl font-bold">Test Page</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input placeholder="Type something..." value={message} onChange={(e) => setMessage(e.target.value)} />
                    <Button type="submit">Submit</Button>
                </form>

                {submitted && (
                    <div className="rounded-lg border border-muted p-4">
                        <p className="text-muted-foreground">You submitted:</p>
                        <p className="font-medium">{submitted}</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

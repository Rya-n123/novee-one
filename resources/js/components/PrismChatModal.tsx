import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

import { useState } from 'react';

export default function PrismChatModal() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        try {
            const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch(route('ai.predict'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content,
                },
                body: JSON.stringify({ content: prompt }),
            });

            if (!res.ok) throw new Error('Failed to connect');
            const data = await res.json();
            console.log('AI response:', data); // ✅ Correct place
            setResponse(data.response);
        } catch {
            setResponse('⚠️ Error connecting to AI service.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">🤖 Open AI Assistant</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>AI Inventory Assistant</DialogTitle>
                    <DialogDescription>Ask something about your inventory below.</DialogDescription>
                </DialogHeader>

                <div className="space-y-2">
                    <Textarea
                        placeholder="Ask something about your inventory..."
                        value={prompt}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
                        rows={3}
                    />

                    <Button onClick={handleSend} disabled={loading} className="w-full">
                        {loading ? 'Thinking...' : 'Send to AI'}
                    </Button>
                    {response && <div className="rounded border bg-muted p-2 text-sm">{response}</div>}
                </div>
            </DialogContent>
        </Dialog>
    );
}

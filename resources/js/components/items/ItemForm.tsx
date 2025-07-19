import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCan } from '@/hooks/use-can';
import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { toast } from 'sonner';

interface Props {
    categoryId: number;
    onSuccess: (newItem: { id: number; name: string; price: number; stock: number }) => void;
}

export default function ItemForm({ categoryId, onSuccess }: Props) {
    const isAdmin = useCan('admin');

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        price: '',
        category_id: categoryId,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!isAdmin) {
            toast.error('❌ You are not allowed to add items.');
            return;
        }

        post(route('items.store'), {
            preserveScroll: true,
            onSuccess: () => {
                const newItem = {
                    id: Date.now(),
                    name: data.name,
                    price: parseFloat(data.price),
                    stock: 0, // ✅ Added to fix type error
                };
                onSuccess(newItem);
                toast.success('✅ Item added successfully!');
                reset();
            },
            onError: () => toast.error('❌ Failed to add item'),
        });
    };

    if (!isAdmin) return null;

    return (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <Input placeholder="Item name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
            <Input type="number" step="0.01" placeholder="Price" value={data.price} onChange={(e) => setData('price', e.target.value)} />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
            <div className="text-right">
                <Button type="submit" disabled={processing} className="w-auto">
                    Add Item
                </Button>
            </div>
        </form>
    );
}

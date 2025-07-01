// components/categories/CreateCategoryDialog.tsx
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { type Category } from '@/types';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

interface Props {
    categories: Category[];
}

export default function CreateCategoryDialog({ categories }: Props) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({ name: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('categories.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Category added!');
                reset(); // clear input
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Category</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Category</DialogTitle>
                    <p className="text-sm text-muted-foreground">Add a new category. Existing ones are listed below.</p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Category name" />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            Add Another
                        </Button>
                    </DialogFooter>
                </form>

                {/* Existing Categories Preview */}
                <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700">Existing Categories:</h3>
                    <ul className="mt-2 max-h-40 list-disc overflow-y-auto pl-5 text-sm text-gray-600">
                        {categories.length === 0 ? <li>No categories yet</li> : categories.map((c) => <li key={c.id}>{c.name}</li>)}
                    </ul>
                </div>
            </DialogContent>
        </Dialog>
    );
}

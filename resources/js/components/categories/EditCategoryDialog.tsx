// components/categories/EditCategoryDialog.tsx
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { type Category } from '@/types';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

interface Props {
    category: Category;
    onClose: () => void;
}

export default function EditCategoryDialog({ category, onClose }: Props) {
    const { data, setData, put, processing, errors } = useForm({ name: category.name });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('categories.update', category.id), {
            onSuccess: () => {
                toast.success('Category updated!');
                onClose(); // close dialog
            },
        });
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Category name" />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

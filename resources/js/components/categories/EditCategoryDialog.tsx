import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCan } from '@/hooks/use-can'; // ✅ Import role checker
import { Category } from '@/types';
import { useForm } from '@inertiajs/react';
import { AlertCircle, Edit, Package } from 'lucide-react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

interface Props {
    category: Category;
    onClose: () => void;
}

export default function EditCategoryDialog({ category, onClose }: Props) {
    const { data, setData, put, processing, errors, clearErrors } = useForm({ name: category.name });

    const isAdmin = useCan('admin'); // ✅ Check role

    if (!isAdmin) return null; // ✅ Don't allow non-admins to see or open the dialog

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.name.trim()) {
            toast.error('Please enter a category name');
            return;
        }

        put(route('categories.update', category.id), {
            onSuccess: () => {
                toast.success('Category updated!');
                onClose();
                toast.success('✅ Category updated successfully!');
                onClose();
            },
            onError: () => {
                toast.error('❌ Failed to update category');
            },
        });
    };

    const handleClose = () => {
        clearErrors();
        onClose();
    };

    return (
        <Dialog open={true} onOpenChange={() => handleClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Edit className="h-5 w-5" />
                        Edit Category
                    </DialogTitle>
                    <DialogDescription>Update the name of this category. Changes will be reflected across your inventory.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="category-name" className="flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            Category Name
                        </Label>
                        <Input
                            id="category-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Enter category name..."
                            className={errors.name ? 'border-red-500 focus:border-red-500' : ''}
                            autoFocus
                        />
                        {errors.name && (
                            <p className="flex items-center gap-1 text-sm text-red-500">
                                <AlertCircle className="h-3 w-3" />
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing || !data.name.trim()} className="gap-2">
                            {processing ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Edit className="h-4 w-4" />
                                    Update Category
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

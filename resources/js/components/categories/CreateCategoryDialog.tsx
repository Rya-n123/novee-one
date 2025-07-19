import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useCan } from '@/hooks/use-can'; // ✅ Import role checker
import { Category } from '@/types';
import { useForm } from '@inertiajs/react';
import { AlertCircle, Package, Plus } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

interface Props {
    categories: Category[];
    children?: ReactNode;
}

export default function CreateCategoryDialog({ categories, children }: Props) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({ name: '' });

    const isAdmin = useCan('admin'); // ✅ Role check

    if (!isAdmin) return null; // ✅ Hide entirely for non-admins

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.name.trim()) {
            toast.error('Please enter a category name');
            return;
        }

        // Check for duplicate names
        const isDuplicate = categories.some((cat) => cat.name.toLowerCase() === data.name.trim().toLowerCase());

        if (isDuplicate) {
            toast.error('A category with this name already exists');
            return;
        }

        post(route('categories.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Category added!');
                reset();
                toast.success('✅ Category created successfully!');
                reset();
                setOpen(false);
            },
            onError: () => {
                toast.error('❌ Failed to create category');
            },
        });
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            reset();
            clearErrors();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children || (
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Category
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Create New Category
                    </DialogTitle>
                    <DialogDescription>Add a new category to organize your inventory items. Category names must be unique.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="category-name">Category Name</Label>
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
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing || !data.name.trim()} className="gap-2">
                            {processing ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4" />
                                    Create Category
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>

                <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700">Existing Categories:</h3>
                    <ul className="mt-2 max-h-40 list-disc overflow-y-auto pl-5 text-sm text-gray-600">
                        {categories.length === 0 ? <li>No categories yet</li> : categories.map((c) => <li key={c.id}>{c.name}</li>)}
                    </ul>
                </div>
                {categories.length > 0 && (
                    <>
                        <Separator />
                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <h4 className="text-sm font-medium">Existing Categories</h4>
                                <Badge variant="secondary">{categories.length}</Badge>
                            </div>
                            <ScrollArea className="h-24">
                                <div className="space-y-1">
                                    {categories.map((category) => (
                                        <div key={category.id} className="flex items-center gap-2 text-sm">
                                            <Package className="h-3 w-3 text-muted-foreground" />
                                            <span>{category.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

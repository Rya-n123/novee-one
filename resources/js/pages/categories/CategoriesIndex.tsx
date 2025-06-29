import TooltipWrapper from '@/components/TooltipWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type Category, type PageProps } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

interface CategoryPageProps extends PageProps {
    categories: Category[];
}

export default function CategoriesIndex({ categories }: CategoryPageProps) {
    const flash = usePage().props.flash as { success?: string };
    const shown = useRef(false);

    const { data, setData, post, processing, reset, errors } = useForm({ name: '' });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('categories.store'), {
            onSuccess: () => {
                toast.success('Category created successfully.');
                reset();
            },
        });
    };

    useEffect(() => {
        if (flash.success && !shown.current) {
            toast.success(flash.success);
            shown.current = true;
        }
    }, [flash.success]);

    return (
        <AppLayout breadcrumbs={[{ title: 'Categories', href: '/categories' }]}>
            <Head title="Categories" />

            <div className="space-y-4 p-4">
                <Dialog>
                    {categories.length === 0 ? (
                        <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
                            <h1 className="text-center text-2xl font-semibold">No categories found</h1>
                            <DialogTrigger asChild>
                                <Button>Add Your First Category</Button>
                            </DialogTrigger>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl font-semibold">Categories</h1>
                            <DialogTrigger asChild>
                                <Button>Add Category</Button>
                            </DialogTrigger>
                        </div>
                    )}

                    <DialogContent aria-describedby="category-dialog-description">
                        <DialogHeader>
                            <DialogTitle>Create Category</DialogTitle>
                            <p id="category-dialog-description" className="text-sm text-muted-foreground">
                                Please enter the name of the category you want to add.
                            </p>
                        </DialogHeader>

                        <form onSubmit={submit} className="space-y-4">
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Category name" />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

                            <DialogFooter>
                                <Button type="submit" disabled={processing}>
                                    Save
                                </Button>
                            </DialogFooter>
                        </form>

                        {/* Live category preview inside dialog */}
                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-700">Existing Categories:</h3>
                            <ul className="mt-2 max-h-40 list-disc overflow-y-auto pl-5 text-sm text-gray-600">
                                {categories.map((c) => (
                                    <li key={c.id}>{c.name}</li>
                                ))}
                            </ul>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Only render cards if there are categories */}
                {categories.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {categories.map((category) => (
                            <Card key={category.id}>
                                <CardContent className="py-4">
                                    <p className="font-medium">{category.name}</p>
                                </CardContent>
                                <CardFooter className="flex justify-end gap-2">
                                    <TooltipWrapper label="Edit category">
                                        <Button variant="outline" asChild>
                                            <Link href={`/categories/${category.id}/edit`}>Edit</Link>
                                        </Button>
                                    </TooltipWrapper>
                                    <TooltipWrapper label="Delete category">
                                        <Button
                                            variant="destructive"
                                            onClick={() => {
                                                toast.warning('Are you sure you want to delete this category?', {
                                                    id: `delete-${category.id}`,
                                                    action: {
                                                        label: 'Delete',
                                                        onClick: () =>
                                                            router.delete(route('categories.destroy', category.id), {
                                                                onSuccess: () => toast.success('Category deleted successfully.'),
                                                            }),
                                                    },
                                                    cancel: {
                                                        label: 'Cancel',
                                                        onClick: () => toast.dismiss(`delete-${category.id}`),
                                                    },
                                                });
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </TooltipWrapper>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

import AppLayout from '@/layouts/app-layout';
import { type Category, type PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

import CategoryCard from '@/components/categories/CategoryCard';
import CreateCategoryDialog from '@/components/categories/CreateCategoryDialog';
import EditCategoryDialog from '@/components/categories/EditCategoryDialog';
<<<<<<< HEAD
import ViewCategoryDialog from './ViewCategoryDialog';
=======
>>>>>>> d850e28d8e6213ead6e6ba7276fd1fe7e5f31b37

interface Props extends PageProps {
    categories: Category[];
}

export default function CategoriesIndex({ categories }: Props) {
    const [editing, setEditing] = useState<Category | null>(null);
<<<<<<< HEAD
    const [viewing, setViewing] = useState<Category | null>(null);
=======
>>>>>>> d850e28d8e6213ead6e6ba7276fd1fe7e5f31b37

    const confirmDelete = (category: Category) => {
        toast.warning(`Delete "${category.name}"?`, {
            id: `delete-${category.id}`,
            action: {
                label: 'Delete',
                onClick: () =>
                    router.delete(route('categories.destroy', category.id), {
                        onSuccess: () => toast.success('Deleted'),
                    }),
            },
            cancel: {
                label: 'Cancel',
                onClick: () => toast.dismiss(`delete-${category.id}`),
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Categories', href: '/categories' }]}>
            <Head title="Categories" />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Categories</h1>
                    <CreateCategoryDialog categories={categories} />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {categories.map((category) => (
<<<<<<< HEAD
                        <CategoryCard key={category.id} category={category} onEdit={setEditing} onDelete={confirmDelete} onView={setViewing} />
=======
                        <CategoryCard key={category.id} category={category} onEdit={setEditing} onDelete={confirmDelete} />
>>>>>>> d850e28d8e6213ead6e6ba7276fd1fe7e5f31b37
                    ))}
                </div>

                {editing && <EditCategoryDialog category={editing} onClose={() => setEditing(null)} />}
<<<<<<< HEAD
                {viewing && <ViewCategoryDialog category={viewing} open={!!viewing} onClose={() => setViewing(null)} />}
=======
>>>>>>> d850e28d8e6213ead6e6ba7276fd1fe7e5f31b37
            </div>
        </AppLayout>
    );
}

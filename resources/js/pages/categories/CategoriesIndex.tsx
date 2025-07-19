import AppLayout from '@/layouts/app-layout';
import { type Category, type PageProps } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

import CategoryCard from '@/components/categories/CategoryCard';
import CreateCategoryDialog from '@/components/categories/CreateCategoryDialog';
import EditCategoryDialog from '@/components/categories/EditCategoryDialog';
import ViewCategoryDialog from '@/components/categories/ViewCategoryDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchInput } from '@/components/search-input';
import { Plus, Package, Grid3X3, Search } from 'lucide-react';

interface Props extends PageProps {
    categories: (Category & { items?: any[] })[];
}

export default function CategoriesIndex({ categories }: Props) {
    const [editing, setEditing] = useState<Category | null>(null);
    const [viewing, setViewing] = useState<Category | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // ✅ Use correctly typed usePage()
    const { props } = usePage<PageProps>();

    // Filter categories based on search
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ✅ Show flash success and error messages
    useEffect(() => {
        if (props.flash?.success) {
            toast.success(props.flash.success);
        } else if (props.flash?.error) {
            toast.error(props.flash.error);
        }
    }, [props.flash]);

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

            <div className="space-y-8 p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                        <p className="text-muted-foreground">
                            Organize your inventory into categories for better management
                        </p>
                    </div>
                    <CreateCategoryDialog categories={categories} />
                </div>

                {/* Stats and Search */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{categories.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                            <Grid3X3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {categories.reduce((sum, cat) => sum + (cat.items?.length || 0), 0)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Search Categories</CardTitle>
                        </CardHeader>
                                                <CardContent>
                            <SearchInput
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Search categories..."
                                onClear={() => setSearchTerm('')}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Categories Grid */}
                <div>
                    {filteredCategories.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">
                                    {searchTerm ? 'No categories match your search' : 'No categories yet'}
                                </h3>
                                <p className="text-muted-foreground text-center mb-4">
                                    {searchTerm
                                        ? `No categories found matching "${searchTerm}". Try a different search term.`
                                        : 'Get started by creating your first category to organize your inventory.'
                                    }
                                </p>
                                {!searchTerm && (
                                    <CreateCategoryDialog categories={categories}>
                                        <Button className="gap-2">
                                            <Plus className="h-4 w-4" />
                                            Create Your First Category
                                        </Button>
                                    </CreateCategoryDialog>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        {searchTerm ? `Search Results (${filteredCategories.length})` : 'All Categories'}
                                    </h2>
                                    {searchTerm && (
                                        <p className="text-sm text-muted-foreground">
                                            Showing categories matching "{searchTerm}"
                                        </p>
                                    )}
                                </div>
                                {searchTerm && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setSearchTerm('')}
                                        size="sm"
                                    >
                                        Clear Search
                                    </Button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {filteredCategories.map((category) => (
                                    <CategoryCard
                                        key={category.id}
                                        category={category}
                                        onEdit={setEditing}
                                        onDelete={confirmDelete}
                                        onView={setViewing}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {editing && <EditCategoryDialog category={editing} onClose={() => setEditing(null)} />}
                {viewing && <ViewCategoryDialog category={viewing} onClose={() => setViewing(null)} />}
            </div>
        </AppLayout>
    );
}

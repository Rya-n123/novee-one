import AppLayout from '@/layouts/app-layout';
import { Category, Item, type PageProps } from '@/types';
import { Head } from '@inertiajs/react';

interface DashboardProps extends PageProps {
    categories: (Category & { items: Item[] })[];
}

export default function Dashboard({ categories }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
            <Head title="Dashboard" />

            <div className="space-y-6 p-6">
                <h1 className="text-2xl font-bold">Inventory Overview</h1>

                {categories.length === 0 ? (
                    <p className="text-muted-foreground">No categories found.</p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category) => (
                            <div key={category.id} className="rounded-lg border p-4 shadow-sm">
                                <h2 className="text-lg font-semibold">{category.name}</h2>

                                {category.items.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No items in this category.</p>
                                ) : (
                                    <ul className="mt-2 space-y-1 text-sm">
                                        {category.items.map((item) => (
                                            <li key={item.id} className="flex justify-between">
                                                <span>{item.name}</span>
                                                <p className="text-sm text-muted-foreground">₱{Number(item.price).toFixed(2)}</p>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

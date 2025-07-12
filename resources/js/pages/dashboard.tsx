import useDebounce from '@/hooks/useDebounce';
import AppLayout from '@/layouts/app-layout';
import { Category, Item, PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
interface DashboardProps extends PageProps {
    categories: (Category & { items: Item[] })[];
    filters: {
        search: string;
        category: string;
    };
    allCategories: { id: number; name: string }[];
}

export default function Dashboard({ categories, filters, allCategories }: DashboardProps) {
    const { data, setData, get } = useForm({
        search: filters.search || '',
        category: filters.category || '',
    });

    useEffect(() => {
        get(route('dashboard'), {
            preserveScroll: true,
            replace: true,
            preserveState: true,
        });
    }, [data.category]);

    // 🔄 Debounce live search (400ms)
    useDebounce(data.search, 400, () => {
        get(route('dashboard'), {
            preserveScroll: true,
            replace: true,
            preserveState: true,
        });
    });

    // 🔄 Trigger filter immediately on dropdown change
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setData('category', e.target.value);
        // get(route('dashboard'), {
        //     preserveScroll: true,
        //     replace: true,
        //     preserveState: true,
        // });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
            <Head title="Dashboard" />

            <div className="space-y-6 p-6">
                <h1 className="text-2xl font-bold">Inventory Overview</h1>

                {/* 🔍 Search and Category Filter */}
                <div className="mb-4 flex flex-wrap gap-2">
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={data.search}
                        onChange={(e) => setData('search', e.target.value)}
                        className="w-full rounded border px-3 py-2 md:w-64"
                    />

                    <select value={data.category} onChange={handleCategoryChange} className="w-full rounded border px-3 py-2 md:w-48">
                        <option value="">All Categories</option>
                        {allCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 📦 Category Grid */}
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

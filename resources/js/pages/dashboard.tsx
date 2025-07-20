import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCan } from '@/hooks/use-can';
import useDebounce from '@/hooks/useDebounce';
import AppLayout from '@/layouts/app-layout';
import { Category, Item, PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useMemo } from 'react';

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
        category: filters.category || 'all',
    });

    const canView = useCan('admin');

    useEffect(() => {
        get(route('dashboard'), {
            preserveScroll: true,
            replace: true,
            preserveState: true,
        });
    }, [data.category]);

    useDebounce(data.search, 400, () => {
        get(route('dashboard'), {
            preserveScroll: true,
            replace: true,
            preserveState: true,
        });
    });

    const handleCategoryChange = (value: string) => {
        setData('category', value);
    };

    const getStockBadge = (stock: number) => {
        if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>;
        if (stock <= 5) return <Badge variant="default">Low: {stock}</Badge>;
        return <Badge variant="default">Stock: {stock}</Badge>;
    };

    // ✅ Properly filter categories and items
    const filteredCategories = useMemo(() => {
        return categories
            .map((cat) => ({
                ...cat,
                items: cat.items.filter((item) => item.name.toLowerCase().includes(data.search.toLowerCase())),
            }))
            .filter((cat) => (data.category === 'all' || String(cat.id) === data.category) && cat.items.length > 0);
    }, [categories, data.search, data.category]);

    const totalCategories = filteredCategories.length;

    const totalItems = useMemo(() => {
        return filteredCategories.reduce((total, cat) => total + cat.items.length, 0);
    }, [filteredCategories]);

    const totalInventoryValue = useMemo(() => {
        return filteredCategories.reduce((total, cat) => total + cat.items.reduce((sum, item) => sum + item.price * item.stock, 0), 0);
    }, [filteredCategories]);

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
            <Head title="Dashboard" />

            <div className="space-y-6 p-6">
                <h1 className="text-2xl font-bold">Inventory Dashboard</h1>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card className="transition hover:shadow-md">
                        <CardHeader>
                            <CardTitle>Total Categories</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{totalCategories}</p>
                        </CardContent>
                    </Card>

                    <Card className="transition hover:shadow-md">
                        <CardHeader>
                            <CardTitle>Total Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{totalItems}</p>
                        </CardContent>
                    </Card>

                    {canView && (
                        <Card className="transition hover:shadow-md">
                            <CardHeader>
                                <CardTitle>Total Inventory Value</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-primary">
                                    ₱{totalInventoryValue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="flex flex-col gap-2 md:flex-row">
                    <Input
                        type="text"
                        placeholder="Search items..."
                        value={data.search}
                        onChange={(e) => setData('search', e.target.value)}
                        className="w-full md:w-64"
                    />

                    <Select value={data.category} onValueChange={handleCategoryChange}>
                        <SelectTrigger className="w-full md:w-48">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {allCategories.map((cat) => (
                                <SelectItem key={cat.id} value={String(cat.id)}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {filteredCategories.length === 0 ? (
                    <p className="text-muted-foreground">No categories found.</p>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {filteredCategories.map((category) => (
                            <Card key={category.id} className="transition hover:scale-[1.01] hover:shadow-md">
                                <CardHeader>
                                    <CardTitle>{category.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">Total Items: {category.items.length}</p>
                                </CardHeader>

                                <CardContent>
                                    {category.items.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No items in this category.</p>
                                    ) : (
                                        <ul className="space-y-3">
                                            {category.items.map((item) => (
                                                <li
                                                    key={item.id}
                                                    className="flex items-start justify-between rounded border-b p-1 pb-2 transition hover:bg-muted"
                                                >
                                                    <div>
                                                        <p className="font-medium">{item.name}</p>
                                                        <p className="text-2xl text-accent-foreground">
                                                            ₱
                                                            {Number(item.price).toLocaleString('en-PH', {
                                                                minimumFractionDigits: 2,
                                                            })}
                                                        </p>
                                                    </div>
                                                    <div>{getStockBadge(item.stock)}</div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

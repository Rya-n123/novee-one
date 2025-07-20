import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
        category: filters.category || 'all',
    });

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

    const totalCategories = categories.length;
    const totalItems = categories.reduce((total, cat) => total + cat.items.length, 0);
    const totalInventoryValue = categories.reduce((total, cat) => total + cat.items.reduce((sum, item) => sum + item.price * item.stock, 0), 0);

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
            <Head title="Dashboard" />

            <div className="space-y-6 p-6">
                <h1 className="text-2xl font-bold">Inventory Dashboard</h1>

                {/* 📊 Summary Cards */}
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
                </div>
                {/* 🧠 AI-Powered Predictions */}
                <Card className="transition hover:shadow-md">
                    <CardHeader>
                        <CardTitle>AI-Powered Inventory Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {(() => {
                            const lowStockItems = categories.flatMap((cat) => cat.items.filter((item) => item.stock <= 5));

                            const totalAtRiskValue = lowStockItems.reduce((sum, item) => sum + item.price * item.stock, 0);

                            return (
                                <div className="space-y-2">
                                    {lowStockItems.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">All stocks are in healthy levels.</p>
                                    ) : (
                                        <>
                                            <p className="text-sm font-medium text-yellow-600">
                                                ⚠️ {lowStockItems.length} item(s) are running low on stock.
                                            </p>
                                            <ul className="list-disc pl-5 text-xs">
                                                {lowStockItems.slice(0, 5).map((item) => (
                                                    <li key={item.id}>
                                                        <span className="font-semibold">{item.name}</span> — {item.stock} left. Recommend reorder:{' '}
                                                        <span className="text-primary">20 pcs</span>.
                                                    </li>
                                                ))}
                                                {lowStockItems.length > 5 && <li>...and {lowStockItems.length - 5} more low-stock items.</li>}
                                            </ul>
                                            <p className="text-xs font-semibold text-red-600">
                                                Total at risk value: ₱{totalAtRiskValue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                            </p>
                                        </>
                                    )}
                                </div>
                            );
                        })()}
                    </CardContent>
                </Card>

                {/* 🔍 Search & Filter */}
                <div className="flex flex-wrap gap-2">
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

                {/* 📦 Category Cards */}
                {categories.length === 0 ? (
                    <p className="text-muted-foreground">No categories found.</p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category) => (
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
                                                        <p className="text-xs text-muted-foreground">
                                                            ₱{Number(item.price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
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

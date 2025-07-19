import { SearchInput } from '@/components/search-input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import useDebounce from '@/hooks/useDebounce';
import AppLayout from '@/layouts/app-layout';
import { Category, Item, PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { BarChart3, DollarSign, Eye, Filter, Package, Plus, Search, TrendingUp } from 'lucide-react';
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

    // Calculate stats
    const totalCategories = categories.length;
    const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);
    const totalValue = categories.reduce((sum, cat) => sum + cat.items.reduce((itemSum, item) => itemSum + Number(item.price), 0), 0);
    const avgItemsPerCategory = totalCategories > 0 ? Math.round(totalItems / totalCategories) : 0;

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
            <Head title="Dashboard" />

            <div className="space-y-8 p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Inventory Dashboard</h1>
                        <p className="text-muted-foreground">Manage your inventory categories and items</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/categories">
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Category
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalCategories}</div>
                            <p className="text-xs text-muted-foreground">Organized collections</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalItems}</div>
                            <p className="text-xs text-muted-foreground">Items in inventory</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₱{totalValue.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">Combined inventory value</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg Items/Category</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{avgItemsPerCategory}</div>
                            <p className="text-xs text-muted-foreground">Average per category</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filter Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Search & Filter
                        </CardTitle>
                        <CardDescription>Find items across all categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <SearchInput
                                value={data.search}
                                onChange={(value) => setData('search', value)}
                                placeholder="Search items across all categories..."
                                className="flex-1"
                            />
                            <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                                <SelectTrigger className="w-full gap-2 sm:w-[200px]">
                                    <Filter className="h-4 w-4" />
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Categories</SelectItem>
                                    {allCategories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Categories Overview */}
                <div>
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight">Categories Overview</h2>
                            <p className="text-muted-foreground">Browse your inventory by category</p>
                        </div>
                        <Link href="/categories">
                            <Button variant="outline" className="gap-2">
                                <Eye className="h-4 w-4" />
                                View All
                            </Button>
                        </Link>
                    </div>

                    {categories.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Package className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-semibold">No categories found</h3>
                                <p className="mb-4 text-center text-muted-foreground">
                                    {data.search || data.category
                                        ? 'No categories match your search criteria.'
                                        : 'Get started by creating your first category.'}
                                </p>
                                {!data.search && !data.category && (
                                    <Link href="/categories">
                                        <Button className="gap-2">
                                            <Plus className="h-4 w-4" />
                                            Create Category
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {categories.map((category) => (
                                <Card key={category.id} className="transition-all hover:shadow-lg">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg">{category.name}</CardTitle>
                                            <Badge variant="secondary">
                                                {category.items.length} {category.items.length === 1 ? 'item' : 'items'}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {category.items.length === 0 ? (
                                            <div className="flex flex-col items-center py-6 text-center">
                                                <Package className="mb-2 h-8 w-8 text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground">No items in this category</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                    <span>Total Value:</span>
                                                    <span className="font-medium">
                                                        ₱{category.items.reduce((sum, item) => sum + Number(item.price), 0).toFixed(2)}
                                                    </span>
                                                </div>
                                                <Separator />
                                                <div className="max-h-32 space-y-2 overflow-y-auto">
                                                    {category.items.slice(0, 4).map((item) => (
                                                        <div key={item.id} className="flex items-center justify-between text-sm">
                                                            <span className="mr-2 flex-1 truncate">{item.name}</span>
                                                            <span className="font-medium text-muted-foreground">
                                                                ₱{Number(item.price).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {category.items.length > 4 && (
                                                        <p className="pt-1 text-center text-xs text-muted-foreground">
                                                            +{category.items.length - 4} more items
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { AlertCircle, DollarSign, Package, Plus } from 'lucide-react';
import { FormEvent } from 'react';
import { toast } from 'sonner';

interface Props {
    categoryId: number;
    onSuccess: (newItem: { id: number; name: string; price: number; stock: number }) => void;
}

export default function ItemForm({ categoryId, onSuccess }: Props) {
    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        name: '',
        price: '',
        category_id: categoryId,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!data.name.trim()) {
            toast.error('Please enter an item name');
            return;
        }

        if (!data.price || parseFloat(data.price) <= 0) {
            toast.error('Please enter a valid price');
            return;
        }

        post(route('items.store'), {
            preserveScroll: true,
            onSuccess: () => {
                const newItem = {
                    id: Date.now(),
                    name: data.name,
                    price: parseFloat(data.price),
                    stock: 0, // ✅ Added to fix type error
                };
                onSuccess(newItem);
                toast.success('✅ Item added successfully!');
                reset();
                clearErrors();
            },
            onError: () => toast.error('❌ Failed to add item'),
        });
    };

    return (
        <Card className="mt-4">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Plus className="h-5 w-5" />
                    Add New Item
                </CardTitle>
                <CardDescription>Add a new item to this category with name and price information.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="item-name" className="flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            Item Name
                        </Label>
                        <Input
                            id="item-name"
                            placeholder="Enter item name..."
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={errors.name ? 'border-red-500 focus:border-red-500' : ''}
                        />
                        {errors.name && (
                            <p className="flex items-center gap-1 text-sm text-red-500">
                                <AlertCircle className="h-3 w-3" />
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="item-price" className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            Price (₱)
                        </Label>
                        <Input
                            id="item-price"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            className={errors.price ? 'border-red-500 focus:border-red-500' : ''}
                        />
                        {errors.price && (
                            <p className="flex items-center gap-1 text-sm text-red-500">
                                <AlertCircle className="h-3 w-3" />
                                {errors.price}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button type="submit" disabled={processing || !data.name.trim() || !data.price} className="gap-2">
                            {processing ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4" />
                                    Add Item
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

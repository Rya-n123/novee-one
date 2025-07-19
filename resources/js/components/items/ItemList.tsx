import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Item } from '@/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Package, Edit, Trash2, Check, X, DollarSign, AlertTriangle, Undo } from 'lucide-react';

interface Props {
    items: Item[];
    onUpdateLocalItems: (items: Item[]) => void;
}

export default function ItemList({ items, onUpdateLocalItems }: Props) {
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [tempEditItem, setTempEditItem] = useState<Partial<Item> | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

    const startEditing = (item: Item) => {
        setEditingItemId(item.id);
        setTempEditItem({ ...item });
    };

    const handleUpdate = () => {
        if (!tempEditItem || !tempEditItem.id) return;

        const { id, name, price } = tempEditItem;

        if (!name || name.trim() === '') {
            toast.error('Item name is required');
            return;
        }

        if (price === undefined || isNaN(price)) {
            toast.error('Valid price is required');
            return;
        }

        router.post(
            route('items.update', id),
            { name, price },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('✅ Item updated!');
                    onUpdateLocalItems(items.map((item) => (item.id === id ? { ...item, name, price } : item)));
                    setEditingItemId(null);
                    setTempEditItem(null);
                },
                onError: () => toast.error('❌ Update failed'),
            },
        );
    };

    const handleDelete = (itemId: number) => {
        setPendingDeleteId(itemId);
    };

    const handleUndo = () => {
        setPendingDeleteId(null);
    };

    const confirmDelete = (itemId: number) => {
        router.post(
            route('items.destroy', itemId),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('✅ Item deleted!');
                    onUpdateLocalItems(items.filter((item) => item.id !== itemId));
                    setPendingDeleteId(null);
                },
                onError: () => {
                    toast.error('❌ Failed to delete');
                    setPendingDeleteId(null);
                },
            },
        );
    };

        return (
        <div className="space-y-3">
            {items.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-8">
                        <Package className="h-12 w-12 text-muted-foreground mb-3" />
                        <p className="text-lg font-medium text-muted-foreground">No items yet</p>
                        <p className="text-sm text-muted-foreground text-center">
                            Add your first item to this category using the form above.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-muted-foreground">
                            Items ({items.length})
                        </h4>
                        <Badge variant="secondary">
                            Total: ₱{items.reduce((sum, item) => sum + Number(item.price), 0).toFixed(2)}
                        </Badge>
                    </div>

                    <div className="grid gap-3">
                        {items.map((item) => (
                            <Card key={item.id} className="transition-all hover:shadow-md">
                                <CardContent className="p-4">
                                    {pendingDeleteId === item.id ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-amber-600">
                                                <AlertTriangle className="h-4 w-4" />
                                                <span className="text-sm font-medium">Delete Confirmation</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Are you sure you want to delete <strong>"{item.name}"</strong>?
                                            </p>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" onClick={handleUndo} className="gap-1">
                                                    <Undo className="h-3 w-3" />
                                                    Cancel
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => confirmDelete(item.id)} className="gap-1">
                                                    <Trash2 className="h-3 w-3" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    ) : editingItemId === item.id ? (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor={`edit-name-${item.id}`} className="text-xs text-muted-foreground">
                                                        Item Name
                                                    </Label>
                                                    <Input
                                                        id={`edit-name-${item.id}`}
                                                        value={tempEditItem?.name || ''}
                                                        onChange={(e) => setTempEditItem((prev) => ({ ...prev, name: e.target.value }))}
                                                        placeholder="Item name"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor={`edit-price-${item.id}`} className="text-xs text-muted-foreground">
                                                        Price (₱)
                                                    </Label>
                                                    <Input
                                                        id={`edit-price-${item.id}`}
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={tempEditItem?.price ?? ''}
                                                        onChange={(e) =>
                                                            setTempEditItem((prev) => ({
                                                                ...prev,
                                                                price: Number(e.target.value),
                                                            }))
                                                        }
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={handleUpdate} className="gap-1">
                                                    <Check className="h-3 w-3" />
                                                    Save
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setEditingItemId(null);
                                                        setTempEditItem(null);
                                                    }}
                                                    className="gap-1"
                                                >
                                                    <X className="h-3 w-3" />
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <h5 className="font-medium leading-none">{item.name}</h5>
                                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                        <DollarSign className="h-3 w-3" />
                                                        <span>₱{Number(item.price).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                                <Badge variant="outline">
                                                    Item #{item.id}
                                                </Badge>
                                            </div>

                                            <Separator />

                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" onClick={() => startEditing(item)} className="gap-1 flex-1">
                                                    <Edit className="h-3 w-3" />
                                                    Edit
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)} className="gap-1">
                                                    <Trash2 className="h-3 w-3" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

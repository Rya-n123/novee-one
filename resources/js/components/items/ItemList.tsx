import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Item } from '@/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

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
        <div className="relative space-y-2">
            {items.length === 0 ? (
                <p className="text-sm text-muted-foreground">No items in this category.</p>
            ) : (
                items.map((item) => (
                    <div key={item.id} className="rounded border bg-background p-3 shadow-sm">
                        {pendingDeleteId === item.id ? (
                            <div className="flex flex-col items-start gap-2">
                                <p className="text-sm text-muted-foreground italic">Item "{item.name}" marked for deletion.</p>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={handleUndo}>
                                        Undo
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => confirmDelete(item.id)}>
                                        Confirm Delete
                                    </Button>
                                </div>
                            </div>
                        ) : editingItemId === item.id ? (
                            <div className="space-y-1">
                                <Input
                                    value={tempEditItem?.name || ''}
                                    onChange={(e) => setTempEditItem((prev) => ({ ...prev, name: e.target.value }))}
                                />
                                <Input
                                    type="number"
                                    value={tempEditItem?.price ?? ''}
                                    onChange={(e) =>
                                        setTempEditItem((prev) => ({
                                            ...prev,
                                            price: Number(e.target.value),
                                        }))
                                    }
                                />
                                <div className="mt-1 flex gap-2">
                                    <Button size="sm" onClick={handleUpdate}>
                                        Save
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                            setEditingItemId(null);
                                            setTempEditItem(null);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">₱{item.price}</p>
                                <div className="mt-1 flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => startEditing(item)}>
                                        Edit
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                                        Delete
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

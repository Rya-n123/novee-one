import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

    const [stockDialogItem, setStockDialogItem] = useState<Item | null>(null);
    const [stockAction, setStockAction] = useState<'add' | 'decrease' | null>(null);
    const [stockQty, setStockQty] = useState<number>(1);

    const [editDialogItem, setEditDialogItem] = useState<Item | null>(null);
    const [editName, setEditName] = useState<string>('');
    const [editPrice, setEditPrice] = useState<number>(0);

    const handleDelete = (itemId: number) => setPendingDeleteId(itemId);

    const handleUndo = () => setPendingDeleteId(null);

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

    const openStockDialog = (item: Item, action: 'add' | 'decrease') => {
        setStockDialogItem(item);
        setStockAction(action);
        setStockQty(1);
    };

    const handleStockSubmit = () => {
        if (!stockDialogItem || !stockAction || stockQty <= 0 || isNaN(stockQty)) {
            toast.error('Enter a valid stock quantity.');
            return;
        }

        const routeName = stockAction === 'add' ? 'items.add-stock' : 'items.decrease-stock';

        router.post(
            route(routeName, stockDialogItem.id),
            { quantity: stockQty },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(stockAction === 'add' ? `✅ Added ${stockQty} to stock!` : `✅ Decreased stock by ${stockQty}!`);
                    onUpdateLocalItems(
                        items.map((i) =>
                            i.id === stockDialogItem.id ? { ...i, stock: (i.stock ?? 0) + (stockAction === 'add' ? stockQty : -stockQty) } : i,
                        ),
                    );
                    setStockDialogItem(null);
                    setStockAction(null);
                },
                onError: () => toast.error('❌ Failed to update stock'),
            },
        );
    };

    const openEditDialog = (item: Item) => {
        setEditDialogItem(item);
        setEditName(item.name);
        setEditPrice(item.price);
    };

    const handleEditSubmit = () => {
        if (!editDialogItem || editName.trim() === '' || isNaN(editPrice)) {
            toast.error('Please enter valid item name and price.');
            return;
        }

        router.post(
            route('items.update', editDialogItem.id),
            { name: editName, price: editPrice },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('✅ Item updated!');
                    onUpdateLocalItems(items.map((item) => (item.id === editDialogItem.id ? { ...item, name: editName, price: editPrice } : item)));
                    setEditDialogItem(null);
                },
                onError: () => toast.error('❌ Failed to update item'),
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
                        ) : (
                            <>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    ₱{item.price} • Stock: {item.stock}
                                </p>
                                <div className="mt-1 flex flex-wrap gap-2">
                                    <Button size="sm" variant="outline" onClick={() => openEditDialog(item)}>
                                        Edit
                                    </Button>
                                    <Button size="sm" variant="default" onClick={() => openStockDialog(item, 'add')}>
                                        Add Stock
                                    </Button>
                                    <Button size="sm" variant="default" onClick={() => openStockDialog(item, 'decrease')}>
                                        Decrease Stock
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

            {/* Stock Dialog */}
            <Dialog open={!!stockDialogItem} onOpenChange={(open) => !open && setStockDialogItem(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {stockAction === 'add' ? 'Add Stock' : 'Decrease Stock'} — {stockDialogItem?.name}
                        </DialogTitle>
                    </DialogHeader>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleStockSubmit();
                        }}
                        className="space-y-2"
                    >
                        <Input
                            type="number"
                            min="1"
                            value={stockQty}
                            onChange={(e) => setStockQty(Number(e.target.value))}
                            placeholder="Enter quantity"
                        />
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="ghost" onClick={() => setStockDialogItem(null)}>
                                Cancel
                            </Button>
                            <Button type="submit">Confirm</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={!!editDialogItem} onOpenChange={(open) => !open && setEditDialogItem(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Item — {editDialogItem?.name}</DialogTitle>
                    </DialogHeader>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleEditSubmit();
                        }}
                        className="space-y-2"
                    >
                        <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Item name" />
                        <Input type="number" min="0" value={editPrice} onChange={(e) => setEditPrice(Number(e.target.value))} placeholder="Price" />
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="ghost" onClick={() => setEditDialogItem(null)}>
                                Cancel
                            </Button>
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

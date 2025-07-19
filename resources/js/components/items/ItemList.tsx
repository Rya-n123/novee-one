import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCan } from '@/hooks/use-can';
import { Item } from '@/types';
import { router } from '@inertiajs/react';
import { AlertTriangle, Check, DollarSign, Edit, Package, Trash2, Undo, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    items: Item[];
    onUpdateLocalItems: (items: Item[]) => void;
}

export default function ItemList({ items, onUpdateLocalItems }: Props) {
    const isAdmin = useCan('admin');

    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
    const [stockDialogItem, setStockDialogItem] = useState<Item | null>(null);
    const [stockAction, setStockAction] = useState<'add' | 'decrease' | null>(null);
    const [stockQty, setStockQty] = useState<number>(1);
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [tempEditItem, setTempEditItem] = useState<Item | null>(null);

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

    function startEditing(item: Item) {
        setEditingItemId(item.id);
        setTempEditItem({ ...item });
    }

    function handleUpdate() {
        if (!tempEditItem || editingItemId === null) return;

        router.post(
            route('items.update', editingItemId),
            { name: tempEditItem.name, price: tempEditItem.price },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('✅ Item updated!');
                    onUpdateLocalItems(items.map((i) => (i.id === editingItemId ? { ...i, ...tempEditItem } : i)));
                    setEditingItemId(null);
                    setTempEditItem(null);
                },
                onError: () => toast.error('❌ Failed to update'),
            },
        );
    }

    function handleStockSubmit() {
        if (!stockDialogItem || !stockAction) return;

        router.post(
            route('items.stock', stockDialogItem.id),
            { action: stockAction, qty: stockQty },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`✅ Stock ${stockAction === 'add' ? 'added' : 'decreased'}!`);
                    setStockDialogItem(null);
                    onUpdateLocalItems([]); // Refresh in parent
                },
                onError: () => toast.error('❌ Failed to update stock'),
            },
        );
    }

    function handleEditSubmit() {
        if (!editDialogItem) return;
        router.post(
            route('items.update', editDialogItem.id),
            { name: editName, price: editPrice },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('✅ Item updated!');
                    onUpdateLocalItems(items.map((i) => (i.id === editDialogItem.id ? { ...i, name: editName, price: editPrice } : i)));
                    setEditDialogItem(null);
                },
                onError: () => toast.error('❌ Failed to update'),
            },
        );
    }

    return (
        <div className="space-y-3">
            {items.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-8">
                        <Package className="mb-3 h-12 w-12 text-muted-foreground" />
                        <p className="text-lg font-medium text-muted-foreground">No items yet</p>
                        <p className="text-center text-sm text-muted-foreground">Add your first item to this category using the form above.</p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-sm font-medium text-muted-foreground">Items ({items.length})</h4>
                        <Badge variant="secondary">Total: ₱{items.reduce((sum, item) => sum + Number(item.price), 0).toFixed(2)}</Badge>
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
                                                        onChange={(e) => setTempEditItem((prev) => (prev ? { ...prev, name: e.target.value } : prev))}
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
                                                            setTempEditItem((prev) => (prev ? { ...prev, price: Number(e.target.value) } : prev))
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
                                                    <h5 className="leading-none font-medium">{item.name}</h5>
                                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                        <DollarSign className="h-3 w-3" />
                                                        <span>₱{Number(item.price).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                                <Badge variant="outline">Item #{item.id}</Badge>
                                            </div>

                                            <Separator />

                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" onClick={() => startEditing(item)} className="flex-1 gap-1">
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
                        <Input
                            type="number"
                            value={editPrice}
                            onChange={(e) => {
                                if (e.target.value.length > 7) return;
                                setEditPrice(Number(e.target.value));
                            }}
                            placeholder="Price"
                            min="0"
                        />
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

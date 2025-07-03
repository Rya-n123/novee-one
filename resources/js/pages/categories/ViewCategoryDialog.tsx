import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Category } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

export default function ViewCategoryDialog({ category, open, onClose }: { category: Category; open: boolean; onClose: () => void }) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [tempItem, setTempItem] = useState({ name: '', price: '', stock: '' });

    const itemForm = useForm({ name: '', price: '', stock: '' });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('items.store', category.id), itemForm.data, {
            onSuccess: () => {
                toast.success('Item added');
                itemForm.reset();
            },
        });
    };

    const startEdit = (item: any) => {
        setEditingId(item.id);
        setTempItem({ name: item.name, price: item.price, stock: item.stock });
    };

    const saveEdit = (id: number) => {
        router.put(route('items.update', id), tempItem, {
            onSuccess: () => {
                toast.success('Item updated');
                setEditingId(null);
            },
        });
    };

    const deleteItem = (id: number) => {
        router.delete(route('items.destroy', id), {
            onSuccess: () => toast.success('Item deleted'),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Items under "{category.name}"</DialogTitle>
                </DialogHeader>

                {/* Item list */}
                <div className="space-y-2">
                    {category.items.length > 0 ? (
                        category.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between rounded border px-3 py-2">
                                {editingId === item.id ? (
                                    <>
                                        <input
                                            value={tempItem.name}
                                            onChange={(e) => setTempItem({ ...tempItem, name: e.target.value })}
                                            className="w-1/3 rounded border px-2 py-1 text-sm"
                                        />
                                        <input
                                            type="number"
                                            value={tempItem.price}
                                            onChange={(e) => setTempItem({ ...tempItem, price: e.target.value })}
                                            className="w-1/5 rounded border px-2 py-1 text-sm"
                                        />
                                        <input
                                            type="number"
                                            value={tempItem.stock}
                                            onChange={(e) => setTempItem({ ...tempItem, stock: e.target.value })}
                                            className="w-1/5 rounded border px-2 py-1 text-sm"
                                        />
                                        <Button size="sm" onClick={() => saveEdit(item.id)}>
                                            Save
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <span>{item.name}</span>
                                        <span>₱{item.price}</span>
                                        <span>Stock: {item.stock}</span>
                                        <Button size="sm" variant="outline" onClick={() => startEdit(item)}>
                                            Edit
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => deleteItem(item.id)}>
                                            Delete
                                        </Button>
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">No items yet.</p>
                    )}
                </div>

                {/* Add new item */}
                <form onSubmit={handleAdd} className="mt-4 space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                        <Input placeholder="Item name" value={itemForm.data.name} onChange={(e) => itemForm.setData('name', e.target.value)} />
                        <Input
                            placeholder="Price"
                            type="number"
                            value={itemForm.data.price}
                            onChange={(e) => itemForm.setData('price', e.target.value)}
                        />
                        <Input
                            placeholder="Stock"
                            type="number"
                            value={itemForm.data.stock}
                            onChange={(e) => itemForm.setData('stock', e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={itemForm.processing}>
                            Add Item
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

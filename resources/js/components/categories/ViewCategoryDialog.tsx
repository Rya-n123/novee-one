import ItemForm from '@/components/items/ItemForm';
import ItemList from '@/components/items/ItemList';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCan } from '@/hooks/use-can';
import { Category, Item } from '@/types';
import { useState } from 'react';

interface Props {
    category: Category & { items?: Item[] };
    onClose: () => void;
}

export default function ViewCategoryDialog({ category, onClose }: Props) {
    const [open, setOpen] = useState(true);
    const [localItems, setLocalItems] = useState<Item[]>(category.items || []);

    const isAdmin = useCan('admin'); // ✅ Role check

    const handleClose = () => {
        setOpen(false);
        onClose();
    };

    const handleNewItem = (newItem: Item) => {
        setLocalItems((prev) => [...prev, newItem]);
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
            <DialogContent className="max-h-[150vh] w-full max-w-[95vw] overflow-y-auto p-4 md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
                <DialogHeader className="mb-2">
                    <DialogTitle className="text-xl font-semibold">
                        📦 Items in <span className="text-primary">{category.name}</span>
                    </DialogTitle>
                </DialogHeader>

                {/* 🧾 Item List Section */}
                <section className="mb-6">
                    <div className="mb-2 flex items-center justify-between">
                        <h2 className="text-md font-medium">Existing Items</h2>
                        <span className="text-sm text-muted-foreground">{localItems.length} item(s)</span>
                    </div>

                    <ScrollArea className="h-[300px] w-full rounded-md border">
                        <div className="p-3">
                            <ItemList items={localItems} onUpdateLocalItems={setLocalItems} />
                        </div>
                    </ScrollArea>
                </section>

                {/* ➕ Add Item Form (Admin Only) */}
                {isAdmin && (
                    <section className="mt-6">
                        <h2 className="text-md mb-2 font-medium">Add New Item</h2>
                        <div className="rounded-md border p-4">
                            <ItemForm categoryId={category.id} onSuccess={handleNewItem} />
                        </div>
                    </section>
                )}

                <div className="mt-6 text-right">
                    <Button type="button" variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

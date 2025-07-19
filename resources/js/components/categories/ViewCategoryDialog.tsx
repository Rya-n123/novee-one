import ItemForm from '@/components/items/ItemForm';
import ItemList from '@/components/items/ItemList';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useCan } from '@/hooks/use-can';
import { Category, Item } from '@/types';
import { DollarSign, Package, ShoppingCart, X } from 'lucide-react';
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

    const totalValue = localItems.reduce((sum, item) => sum + Number(item.price), 0);
    const avgPrice = localItems.length > 0 ? totalValue / localItems.length : 0;

    return (
        <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
            <DialogContent className="max-h-[90vh] w-full max-w-[95vw] overflow-hidden p-0 md:max-w-4xl lg:max-w-5xl">
                <DialogHeader className="border-b bg-muted/30 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-semibold">{category.name}</DialogTitle>
                                <DialogDescription>Manage items in this category</DialogDescription>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-[calc(90vh-140px)]">
                        <div className="space-y-6 p-6">
                            {/* Stats Section */}
                            <div className="grid gap-4 md:grid-cols-3">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{localItems.length}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">₱{totalValue.toFixed(2)}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
                                        <Package className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">₱{avgPrice.toFixed(2)}</div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Items Section */}
                            <div>
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Items</h3>
                                    {localItems.length > 0 && (
                                        <Badge variant="secondary">
                                            {localItems.length} {localItems.length === 1 ? 'item' : 'items'}
                                        </Badge>
                                    )}
                                </div>
                                <ItemList items={localItems} onUpdateLocalItems={setLocalItems} />
                            </div>

                            <Separator />

                            {/* Add Item Section */}
                            <div>
                                <ItemForm categoryId={category.id} onSuccess={handleNewItem} />
                            </div>
                        </div>
                    </ScrollArea>
                </div>

                <div className="border-t bg-muted/30 px-6 py-4">
                    <div className="flex justify-end">
                        <Button variant="outline" onClick={handleClose}>
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

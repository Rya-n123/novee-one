import TooltipWrapper from '@/components/TooltipWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Category } from '@/types';
import { Package, Edit, Trash2, Eye, ShoppingCart } from 'lucide-react';

interface Props {
    category: Category;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
    onView: (category: Category) => void;
}

export default function CategoryCard({ category, onEdit, onDelete, onView }: Props) {
    const itemCount = (category as any).items?.length || 0;
    const totalValue = (category as any).items?.reduce((sum: number, item: any) => sum + Number(item.price || 0), 0) || 0;

    return (
        <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]" onClick={() => onView(category)}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                {category.name}
                            </CardTitle>
                        </div>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                        <ShoppingCart className="h-3 w-3" />
                        {itemCount}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                <div className="space-y-3">
                    <Separator />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Items</p>
                            <p className="font-medium">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Total Value</p>
                            <p className="font-medium">₱{totalValue.toFixed(2)}</p>
                        </div>
                    </div>

                    {itemCount === 0 && (
                        <div className="flex items-center justify-center py-4 text-muted-foreground">
                            <Package className="h-6 w-6 mr-2" />
                            <span className="text-sm">No items yet</span>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter
                className="flex gap-2 pt-3"
                onClick={(e) => e.stopPropagation()}
            >
                <TooltipWrapper label="View Details">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(category)}
                        className="flex-1 gap-2"
                    >
                        <Eye className="h-4 w-4" />
                        View
                    </Button>
                </TooltipWrapper>
                <TooltipWrapper label="Edit Category">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(category)}
                        className="gap-2"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                </TooltipWrapper>
                <TooltipWrapper label="Delete Category">
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(category)}
                        className="gap-2"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </TooltipWrapper>
            </CardFooter>
        </Card>
    );
}

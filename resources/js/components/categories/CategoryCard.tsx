// components/categories/CategoryCard.tsx
import TooltipWrapper from '@/components/TooltipWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { type Category } from '@/types';

interface Props {
    category: Category;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
}

export default function CategoryCard({ category, onEdit, onDelete }: Props) {
    return (
        <Card>
            <CardContent className="py-4">
                <p className="font-medium">{category.name}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <TooltipWrapper label="Edit Category">
                    <Button variant="outline" onClick={() => onEdit(category)}>
                        Edit
                    </Button>
                </TooltipWrapper>
                <TooltipWrapper label="Delete Category">
                    <Button variant="destructive" onClick={() => onDelete(category)}>
                        Delete
                    </Button>
                </TooltipWrapper>
            </CardFooter>
        </Card>
    );
}

import TooltipWrapper from '@/components/TooltipWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useCan } from '@/hooks/use-can'; // ✅ Import hook
import { Category } from '@/types';

interface Props {
    category: Category;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
    onView: (category: Category) => void;
}

export default function CategoryCard({ category, onEdit, onDelete, onView }: Props) {
    const isAdmin = useCan('admin'); // ✅ Role check

    return (
        <Card className="cursor-pointer transition hover:ring-2 hover:ring-primary" onClick={() => onView(category)}>
            <CardContent className="py-4">
                <p className="font-medium">{category.name}</p>
            </CardContent>
            {isAdmin && ( // ✅ Only show buttons if admin
                <CardFooter
                    className="flex justify-end gap-2"
                    onClick={(e) => e.stopPropagation()} // Prevent triggering view when clicking buttons
                >
                    <TooltipWrapper label="Edit">
                        <Button variant="outline" onClick={() => onEdit(category)}>
                            Edit
                        </Button>
                    </TooltipWrapper>
                    <TooltipWrapper label="Delete">
                        <Button variant="destructive" onClick={() => onDelete(category)}>
                            Delete
                        </Button>
                    </TooltipWrapper>
                </CardFooter>
            )}
        </Card>
    );
}

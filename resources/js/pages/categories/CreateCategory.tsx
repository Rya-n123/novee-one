import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { toast } from 'sonner'; // ✅ Import Sonner toast

export default function CreateCategory() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('categories.store'), {
            onSuccess: () => {
                toast.success('Category created successfully!');
                reset(); // optional: clear the form
            },
            onError: () => {
                toast.error('Please check the form for errors.');
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Categories', href: '/categories' },
                { title: 'Create', href: '' },
            ]}
        >
            <Head title="Create Category" />
            <div className="max-w-md p-4">
                <h1 className="mb-4 text-xl font-semibold">Create Category</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Category name" />
                        {errors.name && <div className="text-sm text-red-500">{errors.name}</div>}
                    </div>
                    <Button type="submit" disabled={processing}>
                        Save
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}

// import { Button } from '@/components/ui/button';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import AppLayout from '@/layouts/app-layout';
// import { type Category } from '@/types';
// import { Head, useForm } from '@inertiajs/react';
// import { useState } from 'react';

// interface Props {
//     category: Category;
// }

// export default function EditCategory({ category }: Props) {
//     const { data, setData, post, processing, errors } = useForm({
//         name: category.name,
//         _method: 'PUT',
//     });

//     const [open, setOpen] = useState(true); // open dialog by default

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         post(route('categories.update', category.id), {
//             onSuccess: () => setOpen(false),
//         });
//     };

//     return (
//         <AppLayout
//             breadcrumbs={[
//                 { title: 'Categories', href: '/categories' },
//                 { title: 'Edit', href: '' },
//             ]}
//         >
//             <Head title="Edit Category" />

//             <Dialog open={open} onOpenChange={setOpen}>
//                 <DialogContent className="sm:max-w-md">
//                     <DialogHeader>
//                         <DialogTitle>Edit Category</DialogTitle>
//                     </DialogHeader>

//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         <Input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Category name" />
//                         {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

//                         <div className="flex justify-end">
//                             <Button type="submit" disabled={processing}>
//                                 Update
//                             </Button>
//                         </div>
//                     </form>
//                 </DialogContent>
//             </Dialog>
//         </AppLayout>
//     );
// }

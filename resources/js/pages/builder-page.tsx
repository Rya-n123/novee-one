import { BuilderComponent, builder } from '@builder.io/react';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

builder.init(import.meta.env.VITE_BUILDER_PUBLIC_API_KEY);

export default function BuilderPage() {
    const [content, setContent] = useState<any>(null);

    useEffect(() => {
        builder
            .get('page', { url: window.location.pathname })
            .toPromise()
            .then((res) => setContent(res));
    }, []);

    return (
        <>
            <Head title="Builder Page" />
            {content ? <BuilderComponent model="page" content={content} /> : <div className="p-10 text-center">Loading...</div>}
        </>
    );
}

import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="flex min-h-screen items-center justify-center bg-[#FDFDFC] p-4 dark:bg-[#0a0a0a]">
                <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-xl shadow-xl lg:flex-row">
                    {/* Logo Area */}
                    <div className="flex flex-1 items-center justify-center bg-white px-6 py-12 dark:bg-[#1D0002]">
                        <img src="/iconnovee2.svg" alt="Novee One Logo" className="h-auto w-[500px] transition-all duration-500 hover:scale-150" />
                    </div>

                    {/* Form Area */}
                    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-[#F5F5F4] px-8 py-12 dark:bg-[#161615]">
                        <h1 className="text-2xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                            {auth.user ? 'Welcome back!' : 'Access your account'}
                        </h1>

                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-md bg-[#F53003] px-6 py-2 text-sm font-medium text-white shadow transition-all hover:bg-[#d72100]"
                            >
                                Go to Dashboard
                            </Link>
                        ) : (
                            <div className="flex w-full max-w-[220px] flex-col gap-4">
                                <Button asChild variant="default" size="lg">
                                    <Link href={route('login')}>Log in</Link>
                                </Button>

                                <Button asChild variant="outline" size="lg">
                                    <Link href={route('register')}>Register</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

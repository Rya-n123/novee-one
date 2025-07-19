import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Package, BarChart3, Users, Zap, ArrowRight, Sparkles } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

                        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
                {/* Hero Section */}
                <div className="flex min-h-screen flex-col">
                    {/* Header */}
                    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <div className="container mx-auto flex h-16 items-center justify-between px-4">
                            <div className="flex items-center gap-2">
                                <Package className="h-8 w-8 text-primary" />
                                <span className="text-xl font-bold">Inventory Pro</span>
                            </div>
                            {!auth.user && (
                                <div className="flex gap-2">
                                    <Button asChild variant="ghost">
                                        <Link href={route('login')}>Log in</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={route('register')}>Get Started</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1">
                        <div className="container mx-auto px-4">
                            {/* Hero */}
                            <section className="flex min-h-[80vh] items-center justify-center py-12">
                                <div className="mx-auto max-w-4xl text-center">
                                    <Badge variant="secondary" className="mb-6 gap-1">
                                        <Sparkles className="h-3 w-3" />
                                        Professional Inventory Management
                                    </Badge>

                                    <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
                                        Manage Your Inventory
                                        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"> Effortlessly</span>
                                    </h1>

                                    <p className="mb-8 text-xl text-muted-foreground">
                                        Streamline your inventory management with our modern, user-friendly platform.
                                        Track categories, manage items, and gain insights into your business.
                                    </p>

                                    {auth.user ? (
                                        <div className="space-y-4">
                                            <h2 className="text-2xl font-semibold">Welcome back, {auth.user.name}!</h2>
                                            <Button asChild size="lg" className="gap-2">
                                                <Link href={route('dashboard')}>
                                                    Go to Dashboard
                                                    <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                                            <Button asChild size="lg" className="gap-2">
                                                <Link href={route('register')}>
                                                    Get Started Free
                                                    <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button asChild variant="outline" size="lg">
                                                <Link href={route('login')}>Sign In</Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Features */}
                            <section className="py-12">
                                <div className="mx-auto max-w-4xl">
                                    <div className="mb-8 text-center">
                                        <h2 className="text-3xl font-bold">Why Choose Inventory Pro?</h2>
                                        <p className="mt-2 text-muted-foreground">Everything you need to manage your inventory efficiently</p>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-3">
                                        <Card className="transition-all hover:shadow-lg">
                                            <CardContent className="p-6">
                                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                                    <Package className="h-6 w-6 text-primary" />
                                                </div>
                                                <h3 className="mb-2 font-semibold">Smart Organization</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Organize your inventory into categories and track items with detailed information.
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <Card className="transition-all hover:shadow-lg">
                                            <CardContent className="p-6">
                                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                                    <BarChart3 className="h-6 w-6 text-primary" />
                                                </div>
                                                <h3 className="mb-2 font-semibold">Real-time Insights</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Get instant insights into your inventory value, trends, and performance metrics.
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <Card className="transition-all hover:shadow-lg">
                                            <CardContent className="p-6">
                                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                                    <Zap className="h-6 w-6 text-primary" />
                                                </div>
                                                <h3 className="mb-2 font-semibold">Lightning Fast</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Built with modern technology for blazing fast performance and seamless user experience.
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </main>

                    {/* Footer */}
                    <footer className="border-t bg-muted/30">
                        <div className="container mx-auto px-4 py-6">
                            <div className="flex items-center justify-center text-sm text-muted-foreground">
                                <p>&copy; 2024 Inventory Pro. Built with modern web technologies.</p>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}

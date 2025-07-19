import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { Badge } from '@/components/ui/badge';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Folder, LayoutGrid, Menu, Bell, Search } from 'lucide-react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Categories',
        href: '/categories',
        icon: Folder,
    },
];

const activeItemStyles = 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground';
const baseItemStyles = 'transition-all duration-200 hover:bg-accent/50';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();

        return (
        <>
            <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="mr-3 h-9 w-9">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex h-full w-72 flex-col items-stretch justify-start">
                                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                <SheetHeader className="flex justify-start text-left pb-4">
                                    <Link href="/dashboard" className="flex items-center gap-2">
                                        <AppLogoIcon className="h-8 w-8 fill-current" />
                                        <span className="font-bold text-lg">Inventory</span>
                                    </Link>
                                </SheetHeader>
                                <div className="flex flex-1 flex-col space-y-2 px-2">
                                    {mainNavItems.map((item) => (
                                        <Link
                                            key={item.title}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center space-x-3 rounded-lg px-3 py-2 font-medium transition-colors",
                                                page.url === item.href
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-accent hover:text-accent-foreground"
                                            )}
                                        >
                                            {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                            <span>{item.title}</span>
                                        </Link>
                                    ))}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Logo */}
                    <Link href="/dashboard" prefetch className="flex items-center space-x-2 group">
                        <AppLogo className="transition-transform group-hover:scale-105" />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="ml-8 hidden h-full items-center lg:flex">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-1">
                                {mainNavItems.map((item, index) => (
                                    <NavigationMenuItem key={index} className="relative flex h-full items-center">
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                baseItemStyles,
                                                page.url === item.href ? activeItemStyles : '',
                                                'h-10 cursor-pointer px-4 font-medium',
                                            )}
                                        >
                                            {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                            {item.title}
                                        </Link>
                                        {page.url === item.href && (
                                            <div className="absolute bottom-0 left-1/2 h-0.5 w-1/2 -translate-x-1/2 translate-y-px bg-primary rounded-full" />
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Right Section */}
                    <div className="ml-auto flex items-center space-x-2">
                        {/* Quick Actions - Hidden on mobile */}
                        <div className="hidden md:flex items-center space-x-1">
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                <Search className="h-4 w-4" />
                                <span className="sr-only">Search</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                                <Bell className="h-4 w-4" />
                                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">3</Badge>
                                <span className="sr-only">Notifications</span>
                            </Button>
                        </div>

                        {/* User Avatar */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-10 w-10 rounded-full p-0 ring-offset-2 transition-all hover:ring-2 hover:ring-primary/20">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64" align="end" sideOffset={8}>
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Breadcrumbs */}
            {breadcrumbs.length > 1 && (
                <div className="border-b border-border/40 bg-muted/30">
                    <div className="mx-auto flex h-11 w-full items-center justify-start px-4 text-muted-foreground md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}

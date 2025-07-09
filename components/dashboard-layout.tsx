"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    Menu,
    Home,
    Building,
    Users,
    FileText,
    CreditCard,
    Wrench,
    Truck,
    BarChart,
    MessageSquare,
    Settings,
    LogOut,
    User,
    Bell,
    Search,
    ChevronDown,
    Sun,
    Moon,
    Laptop
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth, useRole } from "@/lib/auth-context"
import { NAVIGATION_ITEMS } from "@/lib/constants"
import { useTheme } from "next-themes"

interface DashboardLayoutProps {
    children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const { user, logout } = useAuth()
    const { theme, setTheme } = useTheme()
    const router = useRouter()
    // Get navigation items based on user role
    const getNavItems = () => {
        if (!user) {
            return [
                { href: "/", label: "Home", icon: Home },
                { href: "/properties", label: "Properties", icon: Building },
            ]
        }

        const roleItems = NAVIGATION_ITEMS[user.role] || []
        return roleItems.map(item => ({
            ...item,
            icon: getIconComponent(item.icon)
        }))
    }

    // Icon mapping function
    const getIconComponent = (iconName: string) => {
        const iconMap: Record<string, any> = {
            Home,
            Building,
            Users,
            FileText,
            CreditCard,
            Wrench,
            Truck,
            BarChart,
            MessageSquare,
            Settings
        }
        return iconMap[iconName] || Home
    }

    const navItems = getNavItems()

    const handleLogout = () => {
        logout()
        setIsOpen(false)
        router.push("/")
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Top Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-16 items-center justify-between px-4">
                    {/* Left side - Logo and Mobile Menu */}
                    <div className="flex items-center space-x-4">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-64 p-0">
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center space-x-2 p-4 border-b">
                                        <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                                            <Building className="h-5 w-5 text-primary-foreground" />
                                        </div>
                                        <span className="font-bold text-xl">PropEase</span>
                                    </div>
                                    <nav className="flex-1 p-4">
                                        <div className="space-y-2">
                                            {navItems.map((item) => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className={cn(
                                                        "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                                        pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                                                    )}
                                                >
                                                    <item.icon className="h-4 w-4" />
                                                    <span>{item.label}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </nav>
                                </div>
                            </SheetContent>
                        </Sheet>

                        <Link href={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                                <Building className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="font-bold text-xl hidden sm:inline">PropEase</span>
                        </Link>
                    </div>

                    {/* Center - Search (hidden on mobile) */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search properties, tenants, payments..."
                                className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Right side - User menu and notifications */}
                    <div className="flex items-center space-x-4">
                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        >
                            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>

                        {/* Notifications */}
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-4 w-4" />
                            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                                3
                            </Badge>
                            <span className="sr-only">Notifications</span>
                        </Button>

                        {/* User Menu */}
                        {user ? (
                            <div className="flex items-center space-x-3">
                                <div className="hidden md:flex items-center space-x-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="/placeholder-user.jpg" alt={user.name} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="text-sm">
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{user.role.replace('_', ' ')}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={handleLogout}>
                                    <LogOut className="h-4 w-4" />
                                    <span className="sr-only">Logout</span>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Button asChild variant="ghost" size="sm">
                                    <Link href="/login">
                                        <User className="h-4 w-4 mr-2" />
                                        Login
                                    </Link>
                                </Button>
                                <Button asChild size="sm">
                                    <Link href="/signup">Sign Up</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex">
                {/* Sidebar - Desktop only */}
                <aside className="hidden md:flex w-64 flex-col border-r bg-background h-[calc(100vh-4rem)]">
                    <div className="flex-1 p-4">
                        <nav className="space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                        pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Sidebar Footer */}
                    <div className="border-t p-4">
                        <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder-user.jpg" alt={user?.name} />
                                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user?.name || 'Guest'}</p>
                                <p className="text-xs text-muted-foreground capitalize">
                                    {user?.role?.replace('_', ' ') || 'Guest'}
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto">
                    <div className="container mx-auto p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
} 
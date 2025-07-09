"use client"

import { Navigation } from "@/components/navigation"

interface MainLayoutProps {
    children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <>
            <Navigation />
            <main className="min-h-screen">{children}</main>
        </>
    )
} 
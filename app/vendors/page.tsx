"use client"

import { DashboardLayout } from "@/components/dashboard-layout"

export default function VendorsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
                    <p className="text-muted-foreground">
                        Manage vendor relationships and assignments
                    </p>
                </div>
            </div>
        </DashboardLayout>
    )
} 
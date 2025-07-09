"use client"

import { DashboardLayout } from "@/components/dashboard-layout"

export default function MyLeasePage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Lease</h1>
                    <p className="text-muted-foreground">
                        View your lease agreement and terms
                    </p>
                </div>
            </div>
        </DashboardLayout>
    )
} 
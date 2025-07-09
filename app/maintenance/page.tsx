"use client"

import { DashboardLayout } from "@/components/dashboard-layout"

export default function MaintenancePage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Maintenance</h1>
                    <p className="text-muted-foreground">
                        Manage maintenance requests and work orders
                    </p>
                </div>
            </div>
        </DashboardLayout>
    )
} 
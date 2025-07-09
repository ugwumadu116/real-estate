"use client"

import { DashboardLayout } from "@/components/dashboard-layout"

export default function ReportsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
                    <p className="text-muted-foreground">
                        View analytics and generate reports
                    </p>
                </div>
            </div>
        </DashboardLayout>
    )
} 
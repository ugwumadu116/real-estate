"use client"

import { DashboardLayout } from "@/components/dashboard-layout"

export default function AssignmentsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
                    <p className="text-muted-foreground">
                        View and manage your maintenance assignments
                    </p>
                </div>
            </div>
        </DashboardLayout>
    )
} 
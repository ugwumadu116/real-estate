"use client"

import { DashboardLayout } from "@/components/dashboard-layout"

export default function MessagesPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
                    <p className="text-muted-foreground">
                        Communicate with tenants, vendors, and team members
                    </p>
                </div>
            </div>
        </DashboardLayout>
    )
} 
"use client"

import { DashboardLayout } from "@/components/dashboard-layout"

export default function SettingsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your account and system preferences
                    </p>
                </div>
            </div>
        </DashboardLayout>
    )
} 
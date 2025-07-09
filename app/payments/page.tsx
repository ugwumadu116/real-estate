"use client"

import { DashboardLayout } from "@/components/dashboard-layout"

export default function PaymentsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
                    <p className="text-muted-foreground">
                        Track rent payments and financial transactions
                    </p>
                </div>
            </div>
        </DashboardLayout>
    )
} 
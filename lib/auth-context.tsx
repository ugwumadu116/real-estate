'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, UserRole } from './types'
import { mockUsers } from './mock-data'
import { ROLE_PERMISSIONS } from './constants'

interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<boolean>
    logout: () => void
    hasPermission: (permission: string) => boolean
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Check for existing session on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('propease_user')
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser)
                // Convert date strings back to Date objects
                userData.createdAt = new Date(userData.createdAt)
                userData.updatedAt = new Date(userData.updatedAt)
                setUser(userData)
            } catch (error) {
                console.error('Error parsing saved user:', error)
                localStorage.removeItem('propease_user')
            }
        }
        setIsLoading(false)
    }, [])

    const login = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true)

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Find user in mock data (in real app, this would be an API call)
            const foundUser = mockUsers.find(u => u.email === email)

            if (foundUser) {
                // In a real app, you would verify the password here
                // For demo purposes, we'll accept any password
                setUser(foundUser)
                localStorage.setItem('propease_user', JSON.stringify(foundUser))
                setIsLoading(false)
                return true
            }

            setIsLoading(false)
            return false
        } catch (error) {
            console.error('Login error:', error)
            setIsLoading(false)
            return false
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('propease_user')
    }

    const hasPermission = (permission: string): boolean => {
        if (!user) return false

        const userPermissions = ROLE_PERMISSIONS[user.role]

        // Admin has all permissions
        if (user.role === 'admin') return true

        // Check if user has the specific permission
        return userPermissions.includes(permission)
    }

    const value: AuthContextType = {
        user,
        login,
        logout,
        hasPermission,
        isLoading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

// Hook to check if user has specific role
export function useRole(role: UserRole): boolean {
    const { user } = useAuth()
    return user?.role === role
}

// Hook to check if user has any of the specified roles
export function useRoles(roles: UserRole[]): boolean {
    const { user } = useAuth()
    return user ? roles.includes(user.role) : false
}

// Hook to get user's permissions
export function usePermissions(): string[] {
    const { user } = useAuth()
    if (!user) return []

    return ROLE_PERMISSIONS[user.role] || []
}

// Protected route component
interface ProtectedRouteProps {
    children: ReactNode
    requiredPermission?: string
    requiredRole?: UserRole
    fallback?: ReactNode
}

export function ProtectedRoute({
    children,
    requiredPermission,
    requiredRole,
    fallback
}: ProtectedRouteProps) {
    const { user, hasPermission, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!user) {
        return fallback || (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
                    <p className="text-muted-foreground">Please log in to continue.</p>
                </div>
            </div>
        )
    }

    if (requiredRole && user.role !== requiredRole) {
        return fallback || (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
                    <p className="text-muted-foreground">
                        You don't have the required role to access this page.
                    </p>
                </div>
            </div>
        )
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
        return fallback || (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
                    <p className="text-muted-foreground">
                        You don't have the required permission to access this page.
                    </p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}

// Demo login credentials for testing
export const DEMO_CREDENTIALS = {
    admin: { email: 'john@propease.com', password: 'password' },
    property_manager: { email: 'sarah@propease.com', password: 'password' },
    landlord: { email: 'mike@propease.com', password: 'password' },
    tenant: { email: 'emily@email.com', password: 'password' },
    vendor: { email: 'bob@plumbing.com', password: 'password' }
} 
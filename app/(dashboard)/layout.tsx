import type React from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <Navbar />
        <main className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8 py-4 sm:py-8 w-full">{children}</main>
      </div>
    </AuthGuard>
  )
}

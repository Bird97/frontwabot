"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { authService } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { Users, LogOut } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isGerente, setIsGerente] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const user = authService.getUser()
    if (user) {
      setIsGerente(user.tipe === 'Gerente')
      setUserEmail(user.email)
    }
  }, [])

  const handleLogout = () => {
    authService.logout()
  }

  const handleGoogleRedirect = () => {
    window.open("http://localhost:3000/onboarding", "_blank")
  }

  const navItems = [
    { href: "/home", label: "Home" },
    { href: "/crear-menu", label: "Crear Menú" },
    { href: "/gestionar-pedidos", label: "Gestionar Pedidos" },
    { href: "/resumen-ventas", label: "Resumen Ventas" },
  ]

  // Agregar opción de usuarios solo para Gerentes
  if (isGerente) {
    navItems.push({ href: "/usuarios", label: "Usuarios" })
  }

  return (
    <nav className="border-b-2 border-[#128C7E] bg-[#0B3C2E] shadow-lg sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          {/* Logo y Nombre */}
          <div className="flex items-center gap-12">
            <Link href="/home" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-14 h-14 bg-[#25D366] rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <span className="text-3xl font-bold text-white tracking-tight">Wabot</span>
            </Link>

            {/* Navegación */}
            <div className="hidden md:flex items-center gap-3">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="lg"
                    className={cn(
                      "font-semibold text-lg transition-all duration-200 px-6 h-12",
                      pathname === item.href
                        ? "bg-[#25D366] text-white hover:bg-[#25D366]/90 shadow-md"
                        : "text-white/90 hover:text-white hover:bg-white/15",
                    )}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-4">
            <Button
              onClick={handleGoogleRedirect}
              size="lg"
              className="bg-[#25D366] hover:bg-[#25D366]/90 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all h-12 px-6"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              Bot WhatsApp
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="lg"
              className="border-2 border-white/30 text-white hover:bg-white/15 hover:border-white/50 bg-transparent font-semibold text-lg h-12 px-6 transition-all"
            >
              <LogOut className="h-6 w-6 mr-2" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

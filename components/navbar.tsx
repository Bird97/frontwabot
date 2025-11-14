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
    <nav className="border-b-2 border-[#128C7E] bg-[#0B3C2E] shadow-lg sticky top-0 z-50 overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8 w-full">
        <div className="flex h-16 sm:h-24 items-center justify-between min-w-0">          {/* Logo y Nombre */}
          <div className="flex items-center gap-4 sm:gap-8 lg:gap-12 min-w-0 flex-shrink-0">
            <Link href="/home" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-[#25D366] rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">Wabot</span>
            </Link>            {/* Navegación */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-3">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="lg"
                    className={cn(
                      "font-semibold text-sm xl:text-lg transition-all duration-200 px-3 xl:px-6 h-10 xl:h-12",
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
          </div>          {/* Acciones */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
            <Button
              onClick={handleGoogleRedirect}
              size="sm"
              className="bg-[#25D366] hover:bg-[#25D366]/90 text-white font-semibold text-xs sm:text-sm lg:text-lg shadow-lg hover:shadow-xl transition-all h-8 sm:h-10 lg:h-12 px-2 sm:px-4 lg:px-6"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <span className="hidden sm:inline">Bot WhatsApp</span>
              <span className="sm:hidden">Bot</span>
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-2 border-white/30 text-white hover:bg-white/15 hover:border-white/50 bg-transparent font-semibold text-xs sm:text-sm lg:text-lg h-8 sm:h-10 lg:h-12 px-2 sm:px-4 lg:px-6 transition-all"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 sm:mr-2" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

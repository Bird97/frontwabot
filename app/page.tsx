"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/auth"
import { MessageCircle, ArrowRight, CheckCircle, Zap, Users, TrendingUp, Loader2 } from "lucide-react"

export default function RootPage() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      // Pequeño delay para mostrar la landing antes de redirigir
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const isAuthenticated = authService.isAuthenticated()
      
      if (!isAuthenticated) {
        setIsChecking(false)
        return
      }

      const user = authService.getUserData()
      
      // Si el usuario no tiene restaurante, ir a onboarding
      if (!user?.id_restaurante) {
        router.push("/onboarding")
      } else {
        // Si tiene restaurante, ir al home
        router.push("/home")
      }
    }

    checkAuth()
  }, [router])

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#128C7E] to-[#25D366] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-4">
            <img src="/images/logoIcon.png" alt="Wabot logo" className="w-20 h-20 rounded-2xl object-contain animate-pulse" />
          </div>
          <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-[#128C7E] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <img src="/images/logoIcon.png" alt="Wabot logo" className="w-10 h-10 rounded-xl object-contain" />
              </div>
              <span className="text-2xl font-bold">Wabot</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/login")}
                className="px-6 py-2 text-white hover:text-white/90 transition-colors font-medium"
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => router.push("/register")}
                className="px-6 py-2 bg-[#25D366] hover:bg-[#128C7E] rounded-lg transition-colors font-semibold shadow-lg"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#128C7E] via-[#075E54] to-[#25D366] text-white py-20 relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Aprovecha todas las ventajas de las conversaciones
              </h1>
              <p className="text-xl mb-8 text-white/90 leading-relaxed">
                Atrae a tus públicos, acelera las ventas e impulsa mejores resultados 
                con el soporte técnico en la plataforma que tiene más de 2000 millones 
                de usuarios en el mundo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push("/login")}
                  className="px-8 py-4 bg-white text-[#128C7E] rounded-xl font-semibold hover:bg-white/90 transition-all shadow-xl flex items-center justify-center gap-2 group"
                >
                  <span>Comenzar ahora</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/30">
                  Ver demo
                </button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
                  <img
                    src="/images/cel.png"
                    alt="Wabot logo"
                    className="rounded-xl w-full max-w-sm mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para crecer
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Una plataforma completa para gestionar tu negocio a través de WhatsApp
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-[#25D366]/10 rounded-xl flex items-center justify-center mb-6">
                <MessageCircle className="w-7 h-7 text-[#25D366]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Automatización inteligente
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Responde automáticamente a tus clientes las 24/7 con nuestro bot inteligente.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-[#25D366]/10 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-[#25D366]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Gestión de pedidos
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Recibe, procesa y gestiona pedidos directamente desde WhatsApp en tiempo real.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-[#25D366]/10 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-[#25D366]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Catálogo digital
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Crea y comparte tu menú digital con precios actualizados automáticamente.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-[#25D366]/10 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-[#25D366]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Análisis y reportes
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Obtén insights detallados sobre tus ventas y el comportamiento de tus clientes.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-[#25D366]/10 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle className="w-7 h-7 text-[#25D366]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Fácil de usar
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Interfaz intuitiva que no requiere conocimientos técnicos para comenzar.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-[#25D366]/10 rounded-xl flex items-center justify-center mb-6">
                <MessageCircle className="w-7 h-7 text-[#25D366]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Soporte dedicado
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Equipo de soporte disponible para ayudarte en todo momento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#128C7E] to-[#25D366] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            ¿Listo para transformar tu negocio?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Únete a miles de negocios que ya están usando Wabot para crecer
          </p>
          <button
            onClick={() => router.push("/login")}
            className="px-10 py-4 bg-white text-[#128C7E] rounded-xl font-semibold hover:bg-white/90 transition-all shadow-xl inline-flex items-center gap-2 group text-lg"
          >
            <span>Comenzar gratis</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <img src="/images/logoIcon.png" alt="Wabot logo" className="w-10 h-10 rounded-xl object-contain" />
              </div>
              <span className="text-2xl font-bold">Wabot</span>
            </div>
            <p className="text-gray-400">
              © 2025 Wabot. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

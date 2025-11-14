"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { authService } from "@/lib/auth"
import { Loader2, MessageCircle, Lock, Mail, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const loginResponse = await authService.login(email, password)
      
      // Verificar si el usuario tiene id_restaurante
      const user = loginResponse.user
      
      if (!user.id_restaurante) {
        // Si no tiene restaurante, redirigir al onboarding
        console.log("Usuario sin restaurante, redirigiendo a onboarding")
        router.push("/onboarding")
      } else {
        // Si tiene restaurante, redirigir al home
        console.log("Usuario con restaurante, redirigiendo a home")
        router.push("/home")
      }
    } catch (err: any) {
      setError(err.message || "Credenciales incorrectas. Por favor, intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#128C7E] via-[#075E54] to-[#25D366] relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#25D366]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#128C7E]/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="relative z-10 flex min-h-screen">
        {/* Left side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-xl text-white">
            <div className="mb-8 flex items-center gap-3">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                <img src="/images/logoIcon.png" alt="Wabot logo" className="w-16 h-16 rounded-2xl object-contain" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Wabot</h1>
                <p className="text-white/80 text-sm">Business Platform</p>
              </div>
            </div>
            
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              !Automatiza tus pedidos y vende más!
            </h2>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Atrae a tus públicos, acelera las ventas e impulsa mejores resultados 
              con el soporte técnico en la plataforma que tiene más de 2000 millones 
              de usuarios en el mundo.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg">Atiende consultas y pedidos automáticamente para ahorrar tiempo y personal.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg">Recibe más pedidos al responder rápido y sin esfuerzo.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg">Funciona desde el primer día: solo escanea un QR para comenzar.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 text-center">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                  <img src="/images/logoIcon.png" alt="Wabot logo" className="w-12 h-12 rounded-xl object-contain" />
                </div>
                <div className="text-left">
                  <h1 className="text-2xl font-bold text-white">Wabot</h1>
                  <p className="text-white/80 text-sm">Business Platform</p>
                </div>
              </div>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 backdrop-blur-lg">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Bienvenido de nuevo
                </h2>
                <p className="text-gray-600">
                  Ingresa a tu cuenta para continuar
                </p>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#25D366] focus:border-transparent transition-all outline-none text-gray-900 placeholder-gray-400"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      id="password"
                      className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#25D366] focus:border-transparent transition-all outline-none text-gray-900 placeholder-gray-400"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-[#25D366] focus:ring-[#25D366]"
                    />
                    <span className="text-gray-600">Recordarme</span>
                  </label>
                  
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Iniciando sesión...</span>
                    </>
                  ) : (
                    <>
                      <span>Iniciar sesión</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  ¿No tienes una cuenta?{" "}
                  <button
                    onClick={() => router.push("/register")}
                    className="text-[#128C7E] hover:text-[#075E54] font-semibold transition-colors"
                  >
                    Regístrate gratis
                  </button>
                </p>
              </div>

              {/* Divider */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-500">
                  Al iniciar sesión, aceptas nuestros{" "}
                  <a href="#!" className="text-[#128C7E] hover:underline">
                    Términos de Servicio
                  </a>{" "}
                  y{" "}
                  <a href="#!" className="text-[#128C7E] hover:underline">
                    Política de Privacidad
                  </a>
                </p>
              </div>
            </div>

            {/* Footer text for mobile */}
            <div className="lg:hidden mt-8 text-center">
              <p className="text-white/80 text-sm">
                © 2025 Wabot. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

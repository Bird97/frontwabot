"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/auth"
import { restaurantService } from "@/lib/restaurant"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { UserPlus, Users, Loader2, AlertCircle, MessageCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WhatsAppBotButton } from "@/components/WhatsAppBotButton"

interface RestaurantConfig {
  nombre: string
  datosPago: string
}

export default function HomePage() {
  const router = useRouter()
  const [config, setConfig] = useState<RestaurantConfig>({
    nombre: "",
    datosPago: "",
  })
  const [restaurantId, setRestaurantId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isGerente, setIsGerente] = useState(false)

  useEffect(() => {
    // Verificar autenticación
    if (!authService.isAuthenticated()) {
      router.push('/login')
      return
    }

    // Verificar si es gerente
    setIsGerente(authService.isGerente())

    // Cargar datos del restaurante desde el backend
    loadRestaurantData()
  }, [router])

  const loadRestaurantData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const restaurant = await restaurantService.getCurrentRestaurant()
      
      if (restaurant) {
        setRestaurantId(restaurant.id)
        setConfig({
          nombre: restaurant.name || "",
          datosPago: restaurant.metodos_pago || "",
        })
      } else {
        // Si el usuario no tiene restaurante, redirigir a onboarding
        router.push('/onboarding')
      }
    } catch (err) {
      console.error('Error al cargar datos del restaurante:', err)
      setError('No se pudieron cargar los datos del restaurante. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleActualizar = async () => {
    if (!restaurantId) {
      setError('No se encontró el ID del restaurante')
      return
    }

    if (!config.nombre.trim()) {
      setError('El nombre del restaurante es requerido')
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      await restaurantService.updateRestaurant(restaurantId, {
        name: config.nombre.trim(),
        metodos_pago: config.datosPago.trim() || undefined,
      })

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (err) {
      console.error('Error al actualizar restaurante:', err)
      setError('No se pudo actualizar el restaurante. Intenta nuevamente.')
    } finally {
      setIsSaving(false)
    }
  }
  return (
    <div className="space-y-4 sm:space-y-6 w-full overflow-x-hidden">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#25D366] rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#1C1C1C] text-balance">Configuración del Restaurante</h1>
          <p className="text-[#1C1C1C]/70 mt-1 text-pretty">Administra la información básica de tu restaurante</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="shadow-md border-gray-200 bg-white">
        <CardHeader className="border-b border-gray-100 bg-[#FCF6ED]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0B3C2E] rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <CardTitle className="text-xl text-[#1C1C1C]">Información General</CardTitle>
              <CardDescription className="text-[#1C1C1C]/60">
                Actualiza los datos principales de tu negocio
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#25D366]" />
              <span className="ml-3 text-[#1C1C1C]/60">Cargando datos del restaurante...</span>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-sm font-medium text-[#1C1C1C]">
                  Nombre del Restaurante
                </Label>
                <Input
                  id="nombre"
                  placeholder="Ej: La Casa del Sabor"
                  value={config.nombre}
                  onChange={(e) => setConfig({ ...config, nombre: e.target.value })}
                  className="h-11 border-gray-200 focus:border-[#25D366] focus:ring-[#25D366]"
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="datosPago" className="text-sm font-medium text-[#1C1C1C]">
                  Datos de Pago
                </Label>
                <Textarea
                  id="datosPago"
                  placeholder="Ej: Nequi: 3434234&#10;Bancolombia cuenta: 100123403"
                  value={config.datosPago}
                  onChange={(e) => setConfig({ ...config, datosPago: e.target.value })}
                  className="min-h-32 border-gray-200 focus:border-[#25D366] focus:ring-[#25D366] resize-none"
                  disabled={isSaving}
                />
                <p className="text-sm text-[#1C1C1C]/60">Ingresa la información de pago que aparecerá en tus menús</p>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  onClick={handleActualizar}
                  disabled={isSaving || isLoading}
                  className="bg-[#25D366] hover:bg-[#25D366]/90 text-white font-medium shadow-md hover:shadow-lg transition-all"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Actualizar"
                  )}
                </Button>
                {showSuccess && (
                  <span className="text-sm font-medium text-[#25D366] flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Configuración actualizada exitosamente
                  </span>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Sección de Gestión de Usuarios - Solo visible para Gerentes */}
      {isGerente && (
        <Card className="shadow-md border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="border-b border-green-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-[#1C1C1C]">Gestión de Usuarios</CardTitle>
                <CardDescription className="text-[#1C1C1C]/60">
                  Administra los usuarios del sistema (Solo Gerentes)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => router.push('/usuarios/crear')}
                className="h-24 bg-primary hover:bg-primary/90 text-white flex flex-col items-center justify-center gap-2"
              >
                <UserPlus className="h-6 w-6" />
                <span className="font-medium">Crear Nuevo Usuario</span>
              </Button>

              <Button
                onClick={() => router.push('/usuarios')}
                variant="outline"
                className="h-24 border-primary text-primary hover:bg-primary/10 flex flex-col items-center justify-center gap-2"
              >
                <Users className="h-6 w-6" />
                <span className="font-medium">Ver Todos los Usuarios</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sección del Bot de WhatsApp */}
      <Card className="shadow-md border-[#25D366]/30 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader className="border-b border-[#25D366]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#25D366] rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-[#1C1C1C]">Bot de WhatsApp</CardTitle>
              <CardDescription className="text-[#1C1C1C]/60">
                Inicia y gestiona el bot de pedidos por WhatsApp
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <WhatsAppBotButton />
        </CardContent>
      </Card>

      <Card className="shadow-md border-gray-200 bg-[#FCF6ED]">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#0B3C2E] rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[#1C1C1C] mb-1">Próximos pasos</h3>
              <p className="text-sm text-[#1C1C1C]/70 text-pretty">
                Una vez configurado tu restaurante, dirígete a{" "}
                <span className="font-medium text-[#25D366]">"Crear Menú"</span> para agregar categorías y productos a
                tu carta.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

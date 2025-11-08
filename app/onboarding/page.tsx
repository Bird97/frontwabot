"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload, Download, Loader2, CheckCircle2, CreditCard, FolderOpen, Package } from "lucide-react"
import Image from "next/image"
import { authService } from "@/lib/auth"
import { restaurantService } from "@/lib/restaurant"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Category = {
  id: string
  name: string
}

type Product = {
  id: string
  name: string
  price: string
  category: string
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [restaurantName, setRestaurantName] = useState("")
  const [paymentMethods, setPaymentMethods] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState({ name: "", price: "", category: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [botCreated, setBotCreated] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const user = authService.getUserData()
    
    if (!authService.isAuthenticated()) {
      router.push("/login")
      return
    }

    // Si el usuario ya tiene restaurante, redirigir al home
    if (user?.id_restaurante) {
      router.push("/home")
      return
    }
  }, [router])

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, { id: Date.now().toString(), name: newCategory.trim() }])
      setNewCategory("")
    }
  }

  const handleRemoveCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id))
    setProducts(products.filter((prod) => prod.category !== categories.find((c) => c.id === id)?.name))
  }

  const handleAddProduct = () => {
    if (newProduct.name.trim() && newProduct.price.trim() && newProduct.category) {
      setProducts([
        ...products,
        {
          id: Date.now().toString(),
          name: newProduct.name.trim(),
          price: newProduct.price.trim(),
          category: newProduct.category,
        },
      ])
      setNewProduct({ name: "", price: "", category: "" })
    }
  }

  const handleRemoveProduct = (id: string) => {
    setProducts(products.filter((prod) => prod.id !== id))
  }

  const handleDownloadFormat = () => {
    const csvContent = "Nombre,Precio,Categoria\nEjemplo Producto,10000,Hamburguesas"
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "formato_productos.csv"
    a.click()
  }

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        const lines = text.split("\n").slice(1) // Skip header
        const newProducts = lines
          .filter((line) => line.trim())
          .map((line) => {
            const [name, price, category] = line.split(",")
            return {
              id: Date.now().toString() + Math.random(),
              name: name?.trim() || "",
              price: price?.trim() || "",
              category: category?.trim() || "",
            }
          })
        setProducts([...products, ...newProducts])
      }
      reader.readAsText(file)
    }
  }

  const handleFinish = async () => {
    setIsLoading(true)
    setError("")

    try {
      const user = authService.getUserData()
      
      if (!user) {
        throw new Error("Usuario no encontrado")
      }

      console.log("🏪 Creando restaurante...")
      
      // 1. Crear el restaurante
      const restaurant = await restaurantService.createRestaurant({
        name: restaurantName,
        metodos_pago: paymentMethods,
      })

      console.log("✅ Restaurante creado:", restaurant)

      // 2. Actualizar el usuario con el id del restaurante
      await restaurantService.updateUserRestaurant(user.id, restaurant.id)
      
      console.log("✅ Usuario actualizado con id_restaurante")

      // 3. Crear datos iniciales (categorías y productos de ejemplo)
      await restaurantService.setupInitialData(restaurant.id)
      
      console.log("✅ Datos iniciales creados")

      setBotCreated(true)

      setTimeout(() => {
        router.push("/home")
      }, 2000)
    } catch (err: any) {
      console.error("❌ Error en onboarding:", err)
      setError(err.message || "Error al configurar el restaurante")
      setIsLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="w-full max-w-2xl shadow-xl border-green-100">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-bM0UA7I4N5xOpoAd73IqxqyPjwLeM9.png"
                    alt="Restaurant icon"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <CardTitle className="text-3xl font-heading">Paso 1: Datos del Restaurante</CardTitle>
              </div>
              <CardDescription className="text-base">Ingresa la información básica de tu restaurante</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="restaurant-name" className="text-base font-medium">
                  Nombre del Restaurante *
                </Label>
                <Input
                  id="restaurant-name"
                  placeholder="Ej: La Casa de las Hamburguesas"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className="h-12 text-base"
                />
              </div>
              <Button
                onClick={() => setCurrentStep(2)}
                disabled={!restaurantName.trim()}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-base font-medium"
              >
                Continuar
              </Button>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card className="w-full max-w-2xl shadow-xl border-green-100">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-3xl font-heading">Paso 2: Métodos de Pago</CardTitle>
              </div>
              <CardDescription className="text-base">Ingresa los métodos de pago que aceptas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payment-methods" className="text-base font-medium">
                  Métodos de Pago *
                </Label>
                <textarea
                  id="payment-methods"
                  placeholder="Ej: Nequi: 3001234567&#10;Bancolombia: 123-456-789&#10;Efectivo&#10;Tarjeta de crédito"
                  value={paymentMethods}
                  onChange={(e) => setPaymentMethods(e.target.value)}
                  className="w-full min-h-[120px] px-3 py-2 text-base border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setCurrentStep(1)} variant="outline" className="flex-1 h-12 text-base">
                  Atrás
                </Button>
                <Button
                  onClick={handleFinish}
                  disabled={!paymentMethods.trim() || isLoading}
                  className="flex-1 h-12 bg-primary hover:bg-primary/90 text-base font-medium"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Configurando...
                    </>
                  ) : (
                    "Finalizar"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  if (botCreated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
        <Card className="w-full max-w-md shadow-xl border-green-100">
          <CardContent className="pt-6 pb-8">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-16 w-16 text-primary" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-4xl font-heading text-foreground">¡Restaurante Creado!</h3>
                <p className="text-base text-muted-foreground">Tu restaurante ha sido configurado exitosamente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
        <Card className="w-full max-w-md shadow-xl border-green-100">
          <CardContent className="pt-6 pb-8">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <Loader2 className="h-16 w-16 text-primary animate-spin" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-3xl font-heading text-foreground">Configurando tu restaurante...</h3>
                <p className="text-base text-muted-foreground">Esto solo tomará unos segundos...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-heading text-foreground mb-2">Configuración Inicial</h1>
          <p className="text-lg text-muted-foreground">Paso {currentStep} de 2</p>
          <div className="mt-4 flex justify-center gap-2">
            {[1, 2].map((step) => (
              <div
                key={step}
                className={`h-2 w-32 rounded-full transition-colors ${
                  step <= currentStep ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>
        {renderStep()}
      </div>
    </div>
  )
}

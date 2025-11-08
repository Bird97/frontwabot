"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import { authService } from "@/lib/auth"
import { tipoProductoService, productoService, getCurrentRestaurantId, formatPrice, type TipoProducto, type Producto } from "@/lib/menu"

export default function CrearMenuPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<TipoProducto[]>([])
  const [products, setProducts] = useState<Producto[]>([])
  const [restaurantId, setRestaurantId] = useState<string | null>(null)
  
  // Estados de UI
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingCategory, setIsSavingCategory] = useState(false)
  const [isSavingProduct, setIsSavingProduct] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Modales
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  
  // Formularios
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newProduct, setNewProduct] = useState({ 
    nombre: "", 
    valor: "", 
    id_tipo: "",
    descripcion: ""
  })

  useEffect(() => {
    // Verificar autenticación
    if (!authService.isAuthenticated()) {
      router.push('/login')
      return
    }

    // Obtener ID del restaurante
    const resId = getCurrentRestaurantId()
    if (!resId) {
      setError('No se encontró el restaurante asociado')
      router.push('/onboarding')
      return
    }

    setRestaurantId(resId)
    loadData(resId)
  }, [router])

  const loadData = async (resId: string) => {
    try {
      setIsLoading(true)
      setError(null)

      // Cargar categorías y productos en paralelo
      const [categoriesData, productsData] = await Promise.all([
        tipoProductoService.getByRestaurant(resId),
        productoService.getByRestaurant(resId),
      ])

      setCategories(categoriesData)
      setProducts(productsData)
    } catch (err) {
      console.error('Error al cargar datos:', err)
      setError('No se pudieron cargar los datos del menú. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim() || !restaurantId) return

    try {
      setIsSavingCategory(true)
      setError(null)

      const newCategory = await tipoProductoService.create({
        name: newCategoryName.trim(),
        id_restaurante: restaurantId,
      })

      setCategories([...categories, newCategory])
      setNewCategoryName("")
      setShowCategoryModal(false)
    } catch (err) {
      console.error('Error al crear categoría:', err)
      setError('No se pudo crear la categoría. Intenta nuevamente.')
    } finally {
      setIsSavingCategory(false)
    }
  }

  const handleCreateProduct = async () => {
    if (!newProduct.nombre.trim() || !newProduct.valor || !newProduct.id_tipo || !restaurantId) {
      setError('Todos los campos son requeridos')
      return
    }

    const precio = parseFloat(newProduct.valor)
    if (isNaN(precio) || precio <= 0) {
      setError('El precio debe ser un número válido mayor a 0')
      return
    }

    try {
      setIsSavingProduct(true)
      setError(null)

      const product = await productoService.create({
        name: newProduct.nombre.trim(),
        id_tipo: newProduct.id_tipo,
        id_restaurante: restaurantId,
        precio: precio,
        descripcion: newProduct.descripcion.trim() || undefined,
      })

      setProducts([...products, product])
      setNewProduct({ nombre: "", valor: "", id_tipo: "", descripcion: "" })
      setShowProductModal(false)
    } catch (err) {
      console.error('Error al crear producto:', err)
      setError('No se pudo crear el producto. Intenta nuevamente.')
    } finally {
      setIsSavingProduct(false)
    }
  }

  const handleDescargarFormato = async () => {
    try {
      setError(null)
      const token = authService.getToken()
      
      if (!token) {
        setError('No se encontró el token de autenticación')
        return
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      
      const response = await fetch(`${API_URL}/productos/download/excel`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Error al descargar el formato')
      }

      // Obtener el blob del archivo
      const blob = await response.blob()
      
      // Crear URL y descargar
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'productos.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error al descargar formato:', err)
      setError('No se pudo descargar el formato. Intenta nuevamente.')
    }
  }

  const handleSubirProductos = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !restaurantId) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        setError(null)
        const text = e.target?.result as string
        const lines = text.split("\n").slice(1) // Skip header
        
        for (const line of lines) {
          const [nombre, precio, categoriaNombre] = line.split(",")
          if (nombre && precio && categoriaNombre) {
            // Buscar la categoría por nombre
            const categoria = categories.find((c) => 
              c.name.toLowerCase().trim() === categoriaNombre.toLowerCase().trim()
            )

            if (categoria) {
              await productoService.create({
                name: nombre.trim(),
                id_tipo: categoria.id,
                id_restaurante: restaurantId,
                precio: parseFloat(precio.trim()),
              })
            }
          }
        }

        // Recargar productos
        if (restaurantId) {
          await loadData(restaurantId)
        }
      } catch (err) {
        console.error('Error al subir productos:', err)
        setError('Error al procesar el archivo CSV')
      }
    }
    reader.readAsText(file)
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return

    try {
      setError(null)
      await productoService.delete(id)
      setProducts(products.filter((p) => p.id !== id))
    } catch (err) {
      console.error('Error al eliminar producto:', err)
      setError('No se pudo eliminar el producto. Intenta nuevamente.')
    }
  }

  // Obtener nombre de categoría
  const getCategoryName = (id_tipo: string): string => {
    const categoria = categories.find((c) => c.id === id_tipo)
    return categoria?.name || 'Sin categoría'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#25D366] mx-auto" />
          <p className="mt-2 text-sm text-[#1C1C1C]/70">Cargando menú...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#25D366] rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#1C1C1C] text-balance">Gestión de Menú</h1>
          <p className="text-[#1C1C1C]/70 mt-1 text-pretty">Crea y administra las categorías y productos de tu menú</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-md border-gray-200 bg-white">
          <CardHeader className="border-b border-gray-100 bg-[#FCF6ED]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0B3C2E] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <div>
                <CardTitle className="text-lg text-[#1C1C1C]">Categorías</CardTitle>
                <CardDescription className="text-[#1C1C1C]/60">Organiza tu menú por categorías</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Button
              onClick={() => setShowCategoryModal(true)}
              className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white font-medium shadow-md"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear Categoría
            </Button>
            <div className="mt-4 space-y-2">
              {categories.map((cat) => (
                <div key={cat.id} className="p-3 bg-[#FCF6ED] rounded-lg border border-gray-200">
                  <p className="font-medium text-[#1C1C1C]">{cat.name}</p>
                </div>
              ))}
              {categories.length === 0 && (
                <p className="text-sm text-[#1C1C1C]/60 text-center py-4">No hay categorías creadas</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-gray-200 bg-white">
          <CardHeader className="border-b border-gray-100 bg-[#FCF6ED]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0B3C2E] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-lg text-[#1C1C1C]">Productos</CardTitle>
                <CardDescription className="text-[#1C1C1C]/60">Agrega productos a tu menú</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <Button
              onClick={() => setShowProductModal(true)}
              disabled={categories.length === 0}
              className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white font-medium shadow-md disabled:opacity-50"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear Producto
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleDescargarFormato}
                variant="outline"
                className="w-full border-[#0B3C2E] text-[#0B3C2E] hover:bg-[#FCF6ED] bg-transparent"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Descargar Formato
              </Button>
              <Button
                variant="outline"
                className="w-full border-[#0B3C2E] text-[#0B3C2E] hover:bg-[#FCF6ED] relative overflow-hidden bg-transparent"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Subir Excel con Productos
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleSubirProductos}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md border-gray-200 bg-white">
        <CardHeader className="border-b border-gray-100 bg-[#FCF6ED]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0B3C2E] rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <CardTitle className="text-lg text-[#1C1C1C]">Productos Actuales</CardTitle>
              <CardDescription className="text-[#1C1C1C]/60">Lista completa de productos en tu menú</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {products.length > 0 ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#FCF6ED]">
                    <TableHead className="font-semibold text-[#1C1C1C]">Nombre</TableHead>
                    <TableHead className="font-semibold text-[#1C1C1C]">Descripción</TableHead>
                    <TableHead className="font-semibold text-[#1C1C1C]">Valor</TableHead>
                    <TableHead className="font-semibold text-[#1C1C1C]">Categoría</TableHead>
                    <TableHead className="font-semibold text-[#1C1C1C] text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id} className="hover:bg-[#FCF6ED]/50">
                      <TableCell className="font-medium text-[#1C1C1C]">{product.name}</TableCell>
                      <TableCell className="text-[#1C1C1C]/70 text-sm max-w-xs truncate">
                        {product.descripcion || '-'}
                      </TableCell>
                      <TableCell className="text-[#1C1C1C]">{formatPrice(product.precio)}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#25D366]/20 text-[#0B3C2E]">
                          {getCategoryName(product.id_tipo)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => handleDeleteProduct(product.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 bg-[#FCF6ED] rounded-lg border-2 border-dashed border-gray-200">
              <svg
                className="mx-auto h-12 w-12 text-[#1C1C1C]/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="mt-2 text-sm text-[#1C1C1C]/70">No hay productos en el menú</p>
              <p className="text-sm text-[#1C1C1C]/60">Crea una categoría y agrega tu primer producto</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Modal */}
      <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1C1C1C]">Crear Nueva Categoría</DialogTitle>
            <DialogDescription className="text-[#1C1C1C]/60">
              Ingresa el nombre de la categoría para tu menú
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name" className="text-[#1C1C1C]">
                Nombre de la Categoría
              </Label>
              <Input
                id="category-name"
                placeholder="Ej: Hamburguesas, Perros, Picadas"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
                className="border-gray-200 focus:border-[#25D366] focus:ring-[#25D366]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCategoryModal(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateCategory} 
              className="bg-[#25D366] hover:bg-[#25D366]/90 text-white"
              disabled={isSavingCategory}
            >
              {isSavingCategory ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear Categoría'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Modal */}
      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1C1C1C]">Crear Nuevo Producto</DialogTitle>
            <DialogDescription className="text-[#1C1C1C]/60">Ingresa los detalles del producto</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="product-name" className="text-[#1C1C1C]">
                Nombre del Producto
              </Label>
              <Input
                id="product-name"
                placeholder="Ej: Hamburguesa Clásica"
                value={newProduct.nombre}
                onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
                className="border-gray-200 focus:border-[#25D366] focus:ring-[#25D366]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-value" className="text-[#1C1C1C]">
                Precio
              </Label>
              <Input
                id="product-value"
                type="number"
                placeholder="Ej: 15000"
                value={newProduct.valor}
                onChange={(e) => setNewProduct({ ...newProduct, valor: e.target.value })}
                className="border-gray-200 focus:border-[#25D366] focus:ring-[#25D366]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-descripcion" className="text-[#1C1C1C]">
                Descripción (Opcional)
              </Label>
              <Input
                id="product-descripcion"
                placeholder="Ej: Carne de res, queso, tomate y lechuga"
                value={newProduct.descripcion}
                onChange={(e) => setNewProduct({ ...newProduct, descripcion: e.target.value })}
                className="border-gray-200 focus:border-[#25D366] focus:ring-[#25D366]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-category" className="text-[#1C1C1C]">
                Categoría
              </Label>
              <Select
                value={newProduct.id_tipo}
                onValueChange={(val) => setNewProduct({ ...newProduct, id_tipo: val })}
              >
                <SelectTrigger className="border-gray-200 focus:border-[#25D366] focus:ring-[#25D366]">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProductModal(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateProduct} 
              className="bg-[#25D366] hover:bg-[#25D366]/90 text-white"
              disabled={isSavingProduct}
            >
              {isSavingProduct ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear Producto'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

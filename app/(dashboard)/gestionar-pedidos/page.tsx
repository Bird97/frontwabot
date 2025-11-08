"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Receipt, CheckCircle, Clock, Package } from "lucide-react"
import { authService } from "@/lib/auth"
import {
  pedidoService,
  formatCurrency,
  getEstadoColor,
  formatFecha,
  ESTADOS_PEDIDO,
  type Pedido,
} from "@/lib/pedidos"

export default function GestionarPedidosPage() {
  const router = useRouter()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [pedidosEnCurso, setPedidosEnCurso] = useState<Pedido[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    // Verificar autenticación
    if (!authService.isAuthenticated()) {
      router.push('/login')
      return
    }

    loadPedidos()
  }, [router])

  const loadPedidos = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const data = await pedidoService.getAll()
      setPedidos(data)
      
      // Filtrar solo pedidos en curso
      const enCurso = pedidoService.getPedidosEnCurso(data)
      setPedidosEnCurso(enCurso)
    } catch (err) {
      console.error('Error al cargar pedidos:', err)
      setError('No se pudieron cargar los pedidos. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFacturar = async (pedidoId: string) => {
    if (!confirm('¿Estás seguro de facturar este pedido?')) return

    try {
      setProcessingId(pedidoId)
      setError(null)

      await pedidoService.facturar(pedidoId)
      
      // Recargar pedidos
      await loadPedidos()
    } catch (err) {
      console.error('Error al facturar pedido:', err)
      setError('No se pudo facturar el pedido. Intenta nuevamente.')
    } finally {
      setProcessingId(null)
    }
  }

  const handleCambiarEstado = async (pedidoId: string, nuevoEstado: string) => {
    try {
      setProcessingId(pedidoId)
      setError(null)

      await pedidoService.cambiarEstado(pedidoId, nuevoEstado)
      
      // Recargar pedidos
      await loadPedidos()
    } catch (err) {
      console.error('Error al cambiar estado:', err)
      setError('No se pudo cambiar el estado del pedido.')
    } finally {
      setProcessingId(null)
    }
  }

  // Calcular estadísticas
  const totalPedidosEnCurso = pedidosEnCurso.length
  const totalVentasEnCurso = pedidosEnCurso.reduce((sum, p) => sum + p.total, 0)
  const pedidosPendientes = pedidosEnCurso.filter(p => p.estado === ESTADOS_PEDIDO.PENDIENTE).length
  const pedidosEnPreparacion = pedidosEnCurso.filter(p => p.estado === ESTADOS_PEDIDO.EN_PREPARACION).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#25D366] mx-auto" />
          <p className="mt-2 text-sm text-[#1C1C1C]/70">Cargando pedidos...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-[#25D366] rounded-xl flex items-center justify-center flex-shrink-0">
          <Receipt className="w-9 h-9 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-[#1C1C1C] text-balance">Gestionar Pedidos</h1>
          <p className="text-xl text-[#1C1C1C]/70 mt-2 text-pretty">
            Administra los pedidos en curso y factura los completados
          </p>
        </div>
      </div>

      {/* Mensajes de error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}      {/* Tarjetas de estadísticas */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="shadow-lg border-gray-200">
          <CardHeader className="pb-4">
            <CardDescription className="text-lg text-[#1C1C1C]/60 font-medium">Total en Curso</CardDescription>
            <CardTitle className="text-5xl font-bold text-[#1C1C1C]">{totalPedidosEnCurso}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 text-base text-[#25D366] font-medium">
              <Package className="w-6 h-6" />
              <span>Pedidos activos</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-gray-200">
          <CardHeader className="pb-4">
            <CardDescription className="text-lg text-[#1C1C1C]/60 font-medium">Ventas en Curso</CardDescription>
            <CardTitle className="text-4xl font-bold text-[#1C1C1C]">
              {formatCurrency(totalVentasEnCurso)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 text-base text-[#25D366] font-medium">
              <CheckCircle className="w-6 h-6" />
              <span>Total pendiente</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-4">
            <CardDescription className="text-lg text-yellow-800/60 font-medium">Pendientes</CardDescription>
            <CardTitle className="text-5xl font-bold text-yellow-800">{pedidosPendientes}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 text-base text-yellow-700 font-medium">
              <Clock className="w-6 h-6" />
              <span>Por preparar</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-blue-200 bg-blue-50">
          <CardHeader className="pb-4">
            <CardDescription className="text-lg text-blue-800/60 font-medium">En Preparación</CardDescription>
            <CardTitle className="text-5xl font-bold text-blue-800">{pedidosEnPreparacion}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 text-base text-blue-700 font-medium">
              <Package className="w-6 h-6" />
              <span>En cocina</span>
            </div>
          </CardContent>
        </Card>
      </div>      {/* Tabla de pedidos */}
      <Card className="shadow-lg border-gray-200 bg-white">
        <CardHeader className="border-b border-gray-100 bg-[#FCF6ED] py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#0B3C2E] rounded-lg flex items-center justify-center">
              <Receipt className="w-7 h-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-[#1C1C1C]">Pedidos en Curso</CardTitle>
              <CardDescription className="text-lg text-[#1C1C1C]/60 mt-1">
                Lista de pedidos activos y pendientes de facturar
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8">          {pedidosEnCurso.length > 0 ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#FCF6ED]">
                    <TableHead className="font-bold text-lg text-[#1C1C1C] py-4">N° Pedido</TableHead>
                    <TableHead className="font-bold text-lg text-[#1C1C1C] py-4">Tipo</TableHead>
                    <TableHead className="font-bold text-lg text-[#1C1C1C] py-4">Mesa/Dirección</TableHead>
                    <TableHead className="font-bold text-lg text-[#1C1C1C] py-4">Estado</TableHead>
                    <TableHead className="font-bold text-lg text-[#1C1C1C] py-4">Total</TableHead>
                    <TableHead className="font-bold text-lg text-[#1C1C1C] py-4">Fecha</TableHead>
                    <TableHead className="font-bold text-lg text-[#1C1C1C] text-right py-4">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pedidosEnCurso.map((pedido) => (
                    <TableRow key={pedido.id} className="hover:bg-[#FCF6ED]/50">
                      <TableCell className="font-bold text-lg text-[#1C1C1C] py-5">
                        #{pedido.numero}
                      </TableCell>
                      <TableCell className="py-5">
                        <span className="text-base text-[#1C1C1C]/70">{pedido.tipo_pedido}</span>
                      </TableCell>
                      <TableCell className="text-base text-[#1C1C1C] py-5">
                        {pedido.tipo_pedido === 'Mesa' 
                          ? `Mesa ${pedido.id_mesa}` 
                          : pedido.direccion || 'N/A'}
                      </TableCell>
                      <TableCell className="py-5">
                        <Badge className={`${getEstadoColor(pedido.estado)} border text-base font-semibold px-4 py-2`}>
                          {pedido.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-lg text-[#1C1C1C] py-5">
                        {formatCurrency(pedido.total)}
                      </TableCell>
                      <TableCell className="text-base text-[#1C1C1C]/70 py-5">
                        {formatFecha(pedido.created_at)}
                      </TableCell>
                      <TableCell className="text-right py-5">
                        <div className="flex items-center justify-end gap-3">
                          {pedido.estado !== ESTADOS_PEDIDO.LISTO && (
                            <Button
                              onClick={() => handleCambiarEstado(pedido.id, ESTADOS_PEDIDO.LISTO)}
                              disabled={processingId === pedido.id}
                              size="lg"
                              variant="outline"
                              className="border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 font-semibold text-base h-12 px-5"
                            >
                              {processingId === pedido.id ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle className="w-5 h-5 mr-2" />
                                  Marcar Listo
                                </>
                              )}
                            </Button>
                          )}
                          <Button
                            onClick={() => handleFacturar(pedido.id)}
                            disabled={processingId === pedido.id}
                            size="lg"
                            className="bg-[#25D366] hover:bg-[#25D366]/90 text-white font-semibold text-base h-12 px-5"
                          >
                            {processingId === pedido.id ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <>
                                <Receipt className="w-5 h-5 mr-2" />
                                Facturar
                              </>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>          ) : (
            <div className="text-center py-16 bg-[#FCF6ED] rounded-lg border-2 border-dashed border-gray-200">
              <Receipt className="mx-auto h-16 w-16 text-[#1C1C1C]/40" />
              <p className="mt-4 text-xl font-semibold text-[#1C1C1C]/70">No hay pedidos en curso</p>
              <p className="text-lg text-[#1C1C1C]/60 mt-2">
                Los nuevos pedidos aparecerán aquí automáticamente
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card className="shadow-lg border-gray-200 bg-[#FCF6ED]">
        <CardContent className="pt-8">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 bg-[#0B3C2E] rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-xl text-[#1C1C1C] mb-3">Información sobre estados</h3>
              <ul className="text-base text-[#1C1C1C]/70 space-y-2 text-pretty leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#1C1C1C] mt-0.5">•</span>
                  <span><strong className="text-[#1C1C1C]">Pendiente:</strong> El pedido fue recibido y está esperando preparación</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#1C1C1C] mt-0.5">•</span>
                  <span><strong className="text-[#1C1C1C]">En Preparación:</strong> El pedido está siendo preparado en cocina</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#1C1C1C] mt-0.5">•</span>
                  <span><strong className="text-[#1C1C1C]">Listo:</strong> El pedido está listo para entregar o servir</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#1C1C1C] mt-0.5">•</span>
                  <span><strong className="text-[#1C1C1C]">Facturado:</strong> El pedido ha sido facturado y completado</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

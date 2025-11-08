"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Order {
  id: string
  fecha: string
  productos: string[]
  total: number
  estado: "pendiente" | "completado" | "cancelado"
}

export default function ResumenVentasPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState({
    totalVentas: 0,
    pedidosHoy: 0,
    promedioVenta: 0,
  })

  useEffect(() => {
    // Load orders from localStorage or generate sample data
    const savedOrders = localStorage.getItem("orders")
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders)
      setOrders(parsedOrders)
      calculateStats(parsedOrders)
    } else {
      // Generate sample data for demonstration
      const sampleOrders: Order[] = [
        {
          id: "1",
          fecha: new Date().toISOString(),
          productos: ["Hamburguesa Clásica", "Papas Fritas", "Coca Cola"],
          total: 25000,
          estado: "completado",
        },
        {
          id: "2",
          fecha: new Date(Date.now() - 3600000).toISOString(),
          productos: ["Pizza Margarita", "Limonada"],
          total: 32000,
          estado: "completado",
        },
        {
          id: "3",
          fecha: new Date(Date.now() - 7200000).toISOString(),
          productos: ["Ensalada César", "Agua"],
          total: 18000,
          estado: "pendiente",
        },
      ]
      setOrders(sampleOrders)
      calculateStats(sampleOrders)
      localStorage.setItem("orders", JSON.stringify(sampleOrders))
    }
  }, [])

  const calculateStats = (ordersList: Order[]) => {
    const completedOrders = ordersList.filter((o) => o.estado === "completado")
    const totalVentas = completedOrders.reduce((sum, order) => sum + order.total, 0)
    const today = new Date().toDateString()
    const pedidosHoy = ordersList.filter((o) => new Date(o.fecha).toDateString() === today).length
    const promedioVenta = completedOrders.length > 0 ? totalVentas / completedOrders.length : 0

    setStats({ totalVentas, pedidosHoy, promedioVenta })
  }

  const getEstadoColor = (estado: Order["estado"]) => {
    switch (estado) {
      case "completado":
        return "bg-[#25D366]/20 text-[#0B3C2E]"
      case "pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha)
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#25D366] rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#1C1C1C] text-balance">Resumen de Ventas</h1>
          <p className="text-[#1C1C1C]/70 mt-1 text-pretty">Monitorea el desempeño de tu restaurante</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-md border-gray-200 bg-white">
          <CardHeader className="pb-3 bg-[#FCF6ED] border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#25D366] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <CardDescription className="text-[#1C1C1C]/70 font-medium">Total Ventas</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <CardTitle className="text-3xl font-bold text-[#1C1C1C]">${stats.totalVentas.toLocaleString()}</CardTitle>
            <p className="text-sm text-[#1C1C1C]/60 mt-2">Pedidos completados</p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-gray-200 bg-white">
          <CardHeader className="pb-3 bg-[#FCF6ED] border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0B3C2E] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <CardDescription className="text-[#1C1C1C]/70 font-medium">Pedidos Hoy</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <CardTitle className="text-3xl font-bold text-[#1C1C1C]">{stats.pedidosHoy}</CardTitle>
            <p className="text-sm text-[#1C1C1C]/60 mt-2">Últimas 24 horas</p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-gray-200 bg-white">
          <CardHeader className="pb-3 bg-[#FCF6ED] border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#25D366] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <CardDescription className="text-[#1C1C1C]/70 font-medium">Promedio por Venta</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <CardTitle className="text-3xl font-bold text-[#1C1C1C]">
              ${stats.promedioVenta.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </CardTitle>
            <p className="text-sm text-[#1C1C1C]/60 mt-2">Ticket promedio</p>
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
              <CardTitle className="text-lg text-[#1C1C1C]">Historial de Pedidos</CardTitle>
              <CardDescription className="text-[#1C1C1C]/60">
                Todos los pedidos registrados en el sistema
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {orders.length > 0 ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#FCF6ED]">
                    <TableHead className="font-semibold text-[#1C1C1C]">ID</TableHead>
                    <TableHead className="font-semibold text-[#1C1C1C]">Fecha</TableHead>
                    <TableHead className="font-semibold text-[#1C1C1C]">Productos</TableHead>
                    <TableHead className="font-semibold text-[#1C1C1C]">Total</TableHead>
                    <TableHead className="font-semibold text-[#1C1C1C]">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-[#FCF6ED]/50">
                      <TableCell className="font-medium text-[#1C1C1C]">#{order.id}</TableCell>
                      <TableCell className="text-[#1C1C1C]/70">{formatFecha(order.fecha)}</TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm text-[#1C1C1C] truncate">{order.productos.join(", ")}</p>
                          <p className="text-xs text-[#1C1C1C]/60">{order.productos.length} items</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-[#1C1C1C]">${order.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(order.estado)}`}
                        >
                          {order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}
                        </span>
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              <p className="mt-2 text-sm text-[#1C1C1C]/70">No hay pedidos registrados</p>
              <p className="text-sm text-[#1C1C1C]/60">Los pedidos aparecerán aquí cuando se realicen ventas</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

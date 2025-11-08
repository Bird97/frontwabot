import { authService } from "./auth";

// ============================================
// INTERFACES - PEDIDO
// ============================================

export interface Pedido {
  id: string;
  id_restaurante: string;
  id_mesa: string;
  tipo_pedido: string;
  estado: string;
  total: number;
  numero: string;
  direccion?: string;
  valor_domicilio?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePedidoDto {
  id_restaurante: string;
  id_mesa: string;
  tipo_pedido: string;
  estado: string;
  total: number;
  numero: string;
  direccion?: string;
  valor_domicilio?: string;
}

export interface UpdatePedidoDto {
  id_mesa?: string;
  tipo_pedido?: string;
  estado?: string;
  total?: number;
  numero?: string;
  direccion?: string;
  valor_domicilio?: string;
}

// ============================================
// CONSTANTES
// ============================================

export const ESTADOS_PEDIDO = {
  PENDIENTE: "Pendiente",
  EN_PREPARACION: "En Preparación",
  LISTO: "Listo",
  ENTREGADO: "Entregado",
  FACTURADO: "Facturado",
  CANCELADO: "Cancelado",
} as const;

export const TIPOS_PEDIDO = {
  MESA: "Mesa",
  DOMICILIO: "Domicilio",
  PARA_LLEVAR: "Para Llevar",
} as const;

// ============================================
// UTILIDADES
// ============================================

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getEstadoColor(estado: string): string {
  switch (estado) {
    case ESTADOS_PEDIDO.PENDIENTE:
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case ESTADOS_PEDIDO.EN_PREPARACION:
      return "bg-blue-100 text-blue-800 border-blue-300";
    case ESTADOS_PEDIDO.LISTO:
      return "bg-green-100 text-green-800 border-green-300";
    case ESTADOS_PEDIDO.ENTREGADO:
      return "bg-purple-100 text-purple-800 border-purple-300";
    case ESTADOS_PEDIDO.FACTURADO:
      return "bg-gray-100 text-gray-800 border-gray-300";
    case ESTADOS_PEDIDO.CANCELADO:
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
}

export function formatFecha(fecha: string): string {
  return new Date(fecha).toLocaleString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ============================================
// SERVICIO DE PEDIDOS
// ============================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getAuthHeaders(): Promise<HeadersInit> {
  const token = authService.getToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export const pedidoService = {
  // Crear pedido
  async create(data: CreatePedidoDto): Promise<Pedido> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/pedidos`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error al crear el pedido");
    }

    const result = await response.json();
    if (!result.isSuccess) {
      throw new Error(result.message || "Error al crear el pedido");
    }

    return result.data;
  },

  // Obtener todos los pedidos
  async getAll(): Promise<Pedido[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/pedidos`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error("Error al obtener los pedidos");
    }

    const result = await response.json();
    if (!result.isSuccess) {
      throw new Error(result.message || "Error al obtener los pedidos");
    }

    return result.data || [];
  },

  // Obtener pedido por ID
  async getById(id: string): Promise<Pedido> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/pedidos/${id}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error("Error al obtener el pedido");
    }

    const result = await response.json();
    if (!result.isSuccess) {
      throw new Error(result.message || "Error al obtener el pedido");
    }

    return result.data;
  },

  // Actualizar pedido
  async update(id: string, data: UpdatePedidoDto): Promise<Pedido> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/pedidos/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el pedido");
    }

    const result = await response.json();
    if (!result.isSuccess) {
      throw new Error(result.message || "Error al actualizar el pedido");
    }

    return result.data;
  },

  // Eliminar pedido
  async delete(id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/pedidos/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el pedido");
    }

    const result = await response.json();
    if (!result.isSuccess) {
      throw new Error(result.message || "Error al eliminar el pedido");
    }
  },

  // Facturar pedido (actualiza estado a Facturado)
  async facturar(id: string): Promise<Pedido> {
    return this.update(id, { estado: ESTADOS_PEDIDO.FACTURADO });
  },

  // Cambiar estado del pedido
  async cambiarEstado(id: string, nuevoEstado: string): Promise<Pedido> {
    return this.update(id, { estado: nuevoEstado });
  },

  // Filtrar pedidos por estado
  filterByEstado(pedidos: Pedido[], estado: string): Pedido[] {
    return pedidos.filter((p) => p.estado === estado);
  },

  // Filtrar pedidos por restaurante
  filterByRestaurante(pedidos: Pedido[], idRestaurante: string): Pedido[] {
    return pedidos.filter((p) => p.id_restaurante === idRestaurante);
  },

  // Obtener pedidos en curso (no facturados ni cancelados)
  getPedidosEnCurso(pedidos: Pedido[]): Pedido[] {
    return pedidos.filter(
      (p) =>
        p.estado !== ESTADOS_PEDIDO.FACTURADO &&
        p.estado !== ESTADOS_PEDIDO.CANCELADO
    );
  },
};

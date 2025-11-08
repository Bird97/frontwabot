import { authService } from "./auth";

// ============================================
// INTERFACES - TIPO PRODUCTO (CATEGORÍAS)
// ============================================

export interface TipoProducto {
  id: string;
  name: string;
  id_restaurante: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTipoProductoDto {
  name: string;
  id_restaurante: string;
}

export interface UpdateTipoProductoDto {
  name?: string;
  id_restaurante?: string;
}

// ============================================
// INTERFACES - PRODUCTO
// ============================================

export interface Producto {
  id: string;
  name: string;
  id_tipo: string;
  id_restaurante: string;
  precio: number;
  descripcion?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductoDto {
  name: string;
  id_tipo: string;
  id_restaurante: string;
  precio: number;
  descripcion?: string;
}

export interface UpdateProductoDto {
  name?: string;
  id_tipo?: string;
  id_restaurante?: string;
  precio?: number;
  descripcion?: string;
}

// ============================================
// RESPONSE TYPES
// ============================================

interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data?: T;
}

// ============================================
// SERVICIO DE TIPO PRODUCTO (CATEGORÍAS)
// ============================================

export const tipoProductoService = {
  /**
   * Crear un nuevo tipo de producto (categoría)
   */
  async create(data: CreateTipoProductoDto): Promise<TipoProducto> {
    const token = authService.getToken();
    console.log("📤 Creando tipo de producto:", data);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tipo-productos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Error al crear el tipo de producto");
    }

    const result: ApiResponse<TipoProducto> = await response.json();

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    console.log("✅ Tipo de producto creado:", result.data);
    return result.data!;
  },

  /**
   * Obtener todos los tipos de producto
   */
  async getAll(): Promise<TipoProducto[]> {
    const token = authService.getToken();
    console.log("📤 Obteniendo todos los tipos de producto");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tipo-productos`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener los tipos de producto");
    }

    const result: ApiResponse<TipoProducto[]> = await response.json();

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    console.log("✅ Tipos de producto obtenidos:", result.data?.length);
    return result.data || [];
  },

  /**
   * Obtener tipos de producto por restaurante
   */
  async getByRestaurant(restaurantId: string): Promise<TipoProducto[]> {
    const allTipos = await this.getAll();
    return allTipos.filter((tipo) => tipo.id_restaurante === restaurantId);
  },

  /**
   * Obtener tipo de producto por ID
   */
  async getById(id: string): Promise<TipoProducto> {
    const token = authService.getToken();
    console.log("📤 Obteniendo tipo de producto:", id);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tipo-productos/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener el tipo de producto");
    }

    const result: ApiResponse<TipoProducto> = await response.json();

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    console.log("✅ Tipo de producto obtenido:", result.data);
    return result.data!;
  },

  /**
   * Actualizar un tipo de producto
   */
  async update(id: string, data: UpdateTipoProductoDto): Promise<TipoProducto> {
    const token = authService.getToken();
    console.log("📤 Actualizando tipo de producto:", id, data);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tipo-productos/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Error al actualizar el tipo de producto");
    }

    const result: ApiResponse<TipoProducto> = await response.json();

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    console.log("✅ Tipo de producto actualizado:", result.data);
    return result.data!;
  },

  /**
   * Eliminar un tipo de producto
   */
  async delete(id: string): Promise<void> {
    const token = authService.getToken();
    console.log("📤 Eliminando tipo de producto:", id);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tipo-productos/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al eliminar el tipo de producto");
    }

    const result: ApiResponse<void> = await response.json();

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    console.log("✅ Tipo de producto eliminado");
  },
};

// ============================================
// SERVICIO DE PRODUCTO
// ============================================

export const productoService = {
  /**
   * Crear un nuevo producto
   */
  async create(data: CreateProductoDto): Promise<Producto> {
    const token = authService.getToken();
    console.log("📤 Creando producto:", data);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/productos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Error al crear el producto");
    }

    const result: ApiResponse<Producto> = await response.json();

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    console.log("✅ Producto creado:", result.data);
    return result.data!;
  },

  /**
   * Obtener todos los productos
   */
  async getAll(): Promise<Producto[]> {
    const token = authService.getToken();
    console.log("📤 Obteniendo todos los productos");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/productos`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener los productos");
    }

    const result: ApiResponse<Producto[]> = await response.json();

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    console.log("✅ Productos obtenidos:", result.data?.length);
    return result.data || [];
  },

  /**
   * Obtener productos por restaurante
   */
  async getByRestaurant(restaurantId: string): Promise<Producto[]> {
    const allProductos = await this.getAll();
    return allProductos.filter(
      (producto) => producto.id_restaurante === restaurantId
    );
  },

  /**
   * Obtener productos por tipo (categoría)
   */
  async getByTipo(tipoId: string): Promise<Producto[]> {
    const allProductos = await this.getAll();
    return allProductos.filter((producto) => producto.id_tipo === tipoId);
  },

  /**
   * Obtener producto por ID
   */
  async getById(id: string): Promise<Producto> {
    const token = authService.getToken();
    console.log("📤 Obteniendo producto:", id);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/productos/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener el producto");
    }

    const result: ApiResponse<Producto> = await response.json();

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    console.log("✅ Producto obtenido:", result.data);
    return result.data!;
  },

  /**
   * Actualizar un producto
   */
  async update(id: string, data: UpdateProductoDto): Promise<Producto> {
    const token = authService.getToken();
    console.log("📤 Actualizando producto:", id, data);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/productos/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Error al actualizar el producto");
    }

    const result: ApiResponse<Producto> = await response.json();

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    console.log("✅ Producto actualizado:", result.data);
    return result.data!;
  },

  /**
   * Eliminar un producto
   */
  async delete(id: string): Promise<void> {
    const token = authService.getToken();
    console.log("📤 Eliminando producto:", id);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/productos/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al eliminar el producto");
    }

    const result: ApiResponse<void> = await response.json();

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    console.log("✅ Producto eliminado");
  },
};

// ============================================
// UTILIDADES
// ============================================

/**
 * Obtener ID del restaurante del usuario actual
 */
export function getCurrentRestaurantId(): string | null {
  return authService.getRestaurantId();
}

/**
 * Validar precio
 */
export function isValidPrice(price: number): boolean {
  return !isNaN(price) && price > 0;
}

/**
 * Formatear precio
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);
}

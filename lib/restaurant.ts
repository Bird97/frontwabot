import { authService } from "./auth";

export interface Restaurant {
  id: string;
  name: string;
  metodos_pago: string;
  fecha_inicio_suscripcion: string;
  fecha_fin_suscripcion: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateRestaurantDto {
  name: string;
  metodos_pago: string;
  fecha_inicio_suscripcion?: string;
  fecha_fin_suscripcion?: string;
}

export interface UpdateRestaurantDto {
  name?: string;
  metodos_pago?: string;
  fecha_inicio_suscripcion?: string;
  fecha_fin_suscripcion?: string;
}

export interface Category {
  id: string;
  name: string;
  id_restaurante: string;
}

export interface Product {
  id: string;
  name: string;
  id_tipo: string;
  id_restaurante: string;
  precio: number;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data?: T;
}

export const restaurantService = {
  // Obtener restaurante por ID
  async getRestaurant(id: string): Promise<Restaurant> {
    const token = authService.getToken();
    console.log("📤 Obteniendo restaurante:", id);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/restaurantes/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener el restaurante");
    }

    const result: ApiResponse<Restaurant> = await response.json();

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    console.log("✅ Restaurante obtenido:", result.data);
    return result.data!;
  },

  // Obtener restaurante del usuario actual
  async getCurrentRestaurant(): Promise<Restaurant | null> {
    const restaurantId = authService.getRestaurantId();
    if (!restaurantId) {
      console.warn("Usuario no tiene restaurante asignado");
      return null;
    }

    return this.getRestaurant(restaurantId);
  },

  // Actualizar restaurante
  async updateRestaurant(
    id: string,
    data: UpdateRestaurantDto
  ): Promise<Restaurant> {
    const token = authService.getToken();
    console.log("📤 Actualizando restaurante:", { id, data });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/restaurantes/${id}`,
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
      const error = await response.json();
      throw new Error(error.message || "Error al actualizar restaurante");
    }

    const result: ApiResponse<Restaurant> = await response.json();

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    console.log("✅ Restaurante actualizado:", result.data);
    return result.data!;
  },

  async createRestaurant(data: CreateRestaurantDto): Promise<Restaurant> {
    const token = authService.getToken();

    // Calcular fechas de suscripción (1 mes desde hoy)
    const fecha_inicio = new Date();
    const fecha_fin = new Date();
    fecha_fin.setMonth(fecha_fin.getMonth() + 1);

    const requestData = {
      name: data.name,
      metodos_pago: data.metodos_pago,
      fecha_inicio_suscripcion: fecha_inicio.toISOString(),
      fecha_fin_suscripcion: fecha_fin.toISOString(),
    };
    console.log("📤 Creando restaurante:", requestData);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/restaurantes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      }
    );

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      if (contentType && contentType.includes("application/json")) {
        const error = await response.json();
        console.error("❌ Error del servidor:", error);
        throw new Error(error.message || "Error al crear el restaurante");
      }
      const errorText = await response.text();
      console.error("❌ Error response:", errorText);
      throw new Error(`Error al crear el restaurante: ${response.status}`);
    }

    const result: ApiResponse<Restaurant> = await response.json();
    console.log("✅ Restaurante creado:", result);

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    return result.data!;
  },

  async updateUserRestaurant(
    userId: string,
    restaurantId: string
  ): Promise<void> {
    const token = authService.getToken();
    console.log("📤 Actualizando usuario:", { userId, restaurantId });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_restaurante: restaurantId }),
      }
    );

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      if (contentType && contentType.includes("application/json")) {
        const error = await response.json();
        throw new Error(error.message || "Error al actualizar el usuario");
      }
      throw new Error(`Error al actualizar el usuario: ${response.status}`);
    }

    const result: ApiResponse<any> = await response.json();

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    console.log("✅ Usuario actualizado correctamente");

    // Update user in localStorage
    const userData = authService.getUserData();
    if (userData) {
      userData.id_restaurante = restaurantId;
      localStorage.setItem("user", JSON.stringify(userData));
    }

    console.log("✅ Usuario actualizado");
  },
  async createCategory(data: {
    name: string;
    id_restaurante: string;
  }): Promise<Category> {
    const token = authService.getToken();
    console.log("📤 Creando categoría:", data);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tipo-producto`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      if (contentType && contentType.includes("application/json")) {
        const error = await response.json();
        console.error("❌ Error del servidor:", error);
        throw new Error(error.message || "Error al crear la categoría");
      }
      const errorText = await response.text();
      console.error("❌ Error response:", errorText);
      throw new Error(`Error al crear la categoría: ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ Categoría creada:", result);
    return result;
  },
  async createProduct(data: {
    name: string;
    precio: number;
    id_tipo: string;
    id_restaurante: string;
  }): Promise<Product> {
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

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      if (contentType && contentType.includes("application/json")) {
        const error = await response.json();
        console.error("❌ Error del servidor:", error);
        throw new Error(error.message || "Error al crear el producto");
      }
      const errorText = await response.text();
      console.error("❌ Error response:", errorText);
      throw new Error(`Error al crear el producto: ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ Producto creado:", result);
    return result;
  },
  async setupInitialData(restaurantId: string): Promise<void> {
    console.log(
      "🔧 Configurando datos iniciales para restaurante:",
      restaurantId
    );

    // Crear categorías predeterminadas
    const categories = [
      { name: "Entradas" },
      { name: "Platos Principales" },
      { name: "Bebidas" },
      { name: "Postres" },
    ];

    const createdCategories: Category[] = [];

    for (const category of categories) {
      try {
        const created = await this.createCategory({
          name: category.name,
          id_restaurante: restaurantId,
        });
        createdCategories.push(created);
      } catch (error) {
        console.error(`❌ Error creando categoría ${category.name}:`, error);
      }
    }

    // Crear productos de ejemplo
    if (createdCategories.length > 0) {
      const exampleProducts = [
        {
          name: "Producto de Ejemplo",
          precio: 10000,
          id_tipo: createdCategories[0].id,
          id_restaurante: restaurantId,
        },
      ];

      for (const product of exampleProducts) {
        try {
          await this.createProduct(product);
        } catch (error) {
          console.error(`❌ Error creando producto ${product.name}:`, error);
        }
      }
    }

    console.log("✅ Datos iniciales configurados");
  },
};

import { authService } from "./auth";

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  user_name: string;
  phone_number: string;
  address: string;
  tipe: "Empleado" | "Gerente";
  id_restaurante?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  user_name: string;
  phone_number: string;
  address: string;
  tipe: string;
  is_active: boolean;
  id_restaurante?: string;
  last_login?: string;
  created_at?: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data?: T;
}

export const userService = {
  async createUser(userData: CreateUserDto) {
    const token = authService.getToken();
    const currentUser = authService.getUserData();

    // Si el usuario actual tiene restaurante, asignarlo al nuevo usuario
    const requestData = {
      ...userData,
      id_restaurante: currentUser?.id_restaurante || userData.id_restaurante,
    };

    console.log("📤 Creando usuario:", requestData);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al crear usuario");
    }

    const result: ApiResponse<User> = await response.json();

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    return result.data;
  },

  async getUsers(): Promise<User[]> {
    const token = authService.getToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener usuarios");
    }

    const result: ApiResponse<User[]> = await response.json();

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    return result.data || [];
  },

  async getUserById(id: string): Promise<User> {
    const token = authService.getToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener usuario");
    }

    const result: ApiResponse<User> = await response.json();

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    return result.data!;
  },

  async updateUser(id: string, userData: Partial<CreateUserDto>) {
    const token = authService.getToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al actualizar usuario");
    }

    const result: ApiResponse<User> = await response.json();

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    return result.data;
  },

  async deleteUser(id: string) {
    const token = authService.getToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al eliminar usuario");
    }

    const result: ApiResponse<any> = await response.json();

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    return result;
  },
};

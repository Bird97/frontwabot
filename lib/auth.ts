import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  tipe: string;
  id: string;
  email: string;
  name: string;
  address: string;
  phone_number: string;
  iat: number;
  exp: number;
}

interface StoredUser {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  tipe: string;
  user_name: string;
  phone_number: string;
  last_login: string | null;
  address: string;
  id_restaurante: string | null;
}

interface LoginResponse {
  message: string;
  user: StoredUser;
  token: string;
}

export const authService = {
  async login(email: string, password: string) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      console.log("🔍 Intentando conectar a:", `${apiUrl}/login`);

      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("📡 Respuesta recibida:", {
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get("content-type"),
      });

      // Check content type before parsing
      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        // Try to get error message from response
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Credenciales incorrectas");
        } else {
          const errorText = await response.text();
          console.error("❌ Error response:", errorText.substring(0, 500));
          throw new Error(
            `Error del servidor: ${response.status}. Verifica que la API esté funcionando correctamente.`
          );
        }
      }

      // Ensure response is JSON
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text();
        console.error(
          "❌ Expected JSON but got:",
          responseText.substring(0, 500)
        );
        throw new Error(
          "El servidor no devolvió un formato JSON válido. Verifica la URL de la API."
        );
      }
      const data: LoginResponse = await response.json();
      console.log("✅ Login exitoso:", data.message);

      // IMPORTANTE: Guardar SOLO el token y los datos del usuario (SIN la contraseña)
      // El usuario viene del backend sin la contraseña
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      return {
        user: data.user,
        hasRestaurant: !!data.user.id_restaurante,
      };
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.error("❌ Error de conexión:", error);
        throw new Error(
          "No se pudo conectar con el servidor. Verifica que NEXT_PUBLIC_API_URL esté configurado correctamente y que el servidor backend esté corriendo."
        );
      }
      throw error;
    }
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },

  getStoredUser(): StoredUser | null {
    if (typeof window === "undefined") return null;
    const userData = localStorage.getItem("user");
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  },

  getUser(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded;
    } catch {
      return null;
    }
  },

  getUserData(): StoredUser | null {
    return this.getStoredUser();
  },

  isAuthenticated(): boolean {
    const user = this.getUser();
    if (!user) return false;
    return user.exp * 1000 > Date.now();
  },

  isGerente(): boolean {
    const userData = this.getStoredUser();
    return userData?.tipe === "Gerente";
  },

  hasRestaurant(): boolean {
    const user = this.getStoredUser();
    return !!user?.id_restaurante;
  },

  getRestaurantId(): string | null {
    const user = this.getStoredUser();
    return user?.id_restaurante || null;
  },

  updateUserRestaurant(restaurantId: string): void {
    const user = this.getStoredUser();
    if (user) {
      user.id_restaurante = restaurantId;
      localStorage.setItem("user", JSON.stringify(user));
    }
  },
};

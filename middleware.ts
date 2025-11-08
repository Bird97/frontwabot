import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Lista de rutas públicas que no requieren autenticación
  const publicPaths = ["/login", "/"];
  const path = request.nextUrl.pathname;

  // Si la ruta es pública, permitir acceso
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  // Para rutas protegidas, verificar el token en localStorage
  // Nota: El middleware se ejecuta en el servidor, por lo que no puede acceder a localStorage
  // La verificación real se hace en los componentes del cliente con authService

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|images).*)",
  ],
};

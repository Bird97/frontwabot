'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { userService, CreateUserDto } from '@/lib/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, UserPlus, Loader2 } from 'lucide-react';

export default function CrearUsuarioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<CreateUserDto>({
    name: '',
    email: '',
    password: '',
    user_name: '',
    phone_number: '',
    address: '',
    tipe: 'Empleado',
  });

  useEffect(() => {
    // Verificar si el usuario está autenticado y es Gerente
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }
    if (!authService.isGerente()) {
      router.push('/home');
    }
  }, [router]);

  const handleChange = (field: keyof CreateUserDto, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await userService.createUser(formData);
      setSuccess(true);
      
      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        password: '',
        user_name: '',
        phone_number: '',
        address: '',
        tipe: 'Empleado',
      });
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push('/usuarios');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  if (!authService.isAuthenticated() || !authService.isGerente()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.push('/home')}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Crear Usuario</h1>
            <p className="text-muted-foreground">Registra un nuevo usuario en el sistema</p>
          </div>
        </div>

        <Card className="shadow-lg border-green-100">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <UserPlus className="h-6 w-6 text-primary" />
              Información del Usuario
            </CardTitle>
            <CardDescription>
              Completa todos los campos para registrar el nuevo usuario
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 text-green-900 border-green-200">
                  <AlertDescription>
                    ✅ ¡Usuario creado exitosamente! Redirigiendo...
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-medium">
                    Nombre completo <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Juan Pérez González"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    disabled={loading}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user_name" className="text-base font-medium">
                    Nombre de usuario <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="user_name"
                    placeholder="juanperez"
                    value={formData.user_name}
                    onChange={(e) => handleChange('user_name', e.target.value)}
                    required
                    disabled={loading}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-medium">
                    Correo electrónico <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="juan@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    disabled={loading}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_number" className="text-base font-medium">
                    Teléfono <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone_number"
                    type="tel"
                    placeholder="+57 300 123 4567"
                    value={formData.phone_number}
                    onChange={(e) => handleChange('phone_number', e.target.value)}
                    required
                    disabled={loading}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-base font-medium">
                    Contraseña <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    required
                    disabled={loading}
                    minLength={6}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipe" className="text-base font-medium">
                    Tipo de usuario <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.tipe}
                    onValueChange={(value) => handleChange('tipe', value)}
                    disabled={loading}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Empleado">Empleado</SelectItem>
                      <SelectItem value="Gerente">Gerente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="text-base font-medium">
                    Dirección <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="address"
                    placeholder="Calle 123 #45-67, Ciudad"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    required
                    disabled={loading}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 h-11"
                  onClick={() => router.push('/home')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 h-11 bg-primary hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Crear Usuario
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

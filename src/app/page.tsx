"use client";

import { useState } from "react";
import { Toaster, toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerNombre, setRegisterNombre] = useState("");
  const [registerApellido, setRegisterApellido] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!loginEmail || !loginPassword) {
      setError("Por favor, complete todos los campos.");
      return;
    }
    toast.loading("Iniciando sesión...");

    try {
      const responseNextAuth = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });

      if (responseNextAuth?.error) {
        setError(responseNextAuth.error.split(",")[0]);
        toast.error("Error", {
          description: responseNextAuth.error,
        });
        return;
      }

      toast.success("Inicio de sesión correcto");

      router.push("/class-room");
    } catch (error) {
      console.log(error);
    } finally {
      toast.dismiss();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!registerEmail || !registerPassword || !registerConfirmPassword) {
      setError("Por favor, complete todos los campos.");
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    toast.loading("Registrando...");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: registerNombre,
            lastname: registerApellido,
            email: registerEmail,
            password: registerPassword,
          }),
        }
      );
      const responseAPI = await res.json();
      if (!res.ok) {
        toast.error("Error", {
          description: responseAPI.message,
        });
        return;
      }

      toast.success("Inicio de sesión correcto");

      const responseNextAuth = await signIn("credentials", {
        email: registerEmail,
        password: registerPassword,
        redirect: false,
      });

      if (responseNextAuth?.error) {
        setError(responseNextAuth.error.split(",")[0]);
        return;
      }

      router.push("/class-room");
    } catch (error) {
      console.log(error);
    } finally {
      toast.dismiss();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-200 via-orange-200 to-gray-300 transition-colors duration-500 ease-in-out">
      <div className="max-w-md w-full mx-auto space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mb-4">
            <Image
              src="/Logo.png"
              alt="description"
              width={500}
              height={300}
              layout="responsive"
            />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Bienvenido a Nuestra Plataforma
          </h2>
        </div>

        <Tabs defaultValue="login" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Ingresar</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loginEmail">Correo electrónico</Label>
                <Input
                  id="loginEmail"
                  type="email"
                  placeholder="tu@ejemplo.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loginPassword">Contraseña</Label>
                <Input
                  id="loginPassword"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full  bg-primero-100">
                Ingresar
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="registerNombre">Nombre</Label>
                <Input
                  id="registerNombre"
                  type="name"
                  placeholder="Nombre"
                  value={registerNombre}
                  onChange={(e) => setRegisterNombre(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registerEmail">Usuario</Label>
                <Input
                  id="registerEmail"
                  type="name"
                  placeholder="Usuario"
                  value={registerApellido}
                  onChange={(e) => setRegisterApellido(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registerEmail">Correo electrónico</Label>
                <Input
                  id="registerEmail"
                  type="email"
                  placeholder="tu@ejemplo.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registerPassword">Contraseña</Label>
                <Input
                  id="registerPassword"
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registerConfirmPassword">
                  Confirmar Contraseña
                </Label>
                <Input
                  id="registerConfirmPassword"
                  type="password"
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-primero-100">
                Registrarse
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="text-center text-sm">
          <a href="#" className="text-primero-100 hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
}

"use client";

import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  PencilIcon,
  SearchIcon,
  UserIcon,
  ShieldIcon,
  EditIcon,
  ArrowLeftIcon,
} from "lucide-react";
import { Toaster, toast } from "sonner";

const roleColors = {
  admin: "bg-primero-200",
  estudiante: "bg-primero-300",
  moderador: "bg-primero-400",
};

const roleIcons = {
  admin: ShieldIcon,
  estudiante: EditIcon,
  moderador: UserIcon,
};

function Page() {
  const { data: session, status } = useSession();
  const { token } = session?.user || {};

  const router = useRouter();
  const [data2, setData2] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // Use useEffect to run the async call for fetching user data, without any conditionals
  useEffect(() => {
    if (!token) {
      return; // Si no hay token, no hacemos nada
    }

    const usersnew = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = await res.json();
      setData2(responseData);

      // Calculate role counts
      if (Array.isArray(responseData)) {
        const roleCount = responseData.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {});

        console.log(roleCount);
      } else {
        console.log("No es un array");
      }
    };

    usersnew();
  }, [token]); // Solo se ejecuta cuando el token cambia

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
    setIsDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (editingUser) {
      setData2((prevUsers) =>
        prevUsers.map((u) => (u.id === editingUser.id ? editingUser : u))
      );
      setEditingUser(null);
      setIsDialogOpen(false);

      toast.success("Usuario actualizado");
    }
  };

  const handleGoBack = () => {
    router.push("/class-room");
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <Button
          onClick={handleGoBack}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Regresar
        </Button>
        <h1 className="text-4xl font-bold text-primero-100">
          Dashboard de Usuarios
        </h1>
      </div>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-around">
              {data2?.reduce((acc, user) => {
                acc[user.role] = (acc[user.role] || 0) + 1;
                return acc;
              }, {}) &&
                Object.entries(
                  data2.reduce((acc, user) => {
                    acc[user.role] = (acc[user.role] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([role, count]) => (
                  <div key={role} className="text-center">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${roleColors[role]} text-white mb-2`}
                    >
                      {count}
                    </div>
                    <p className="capitalize">{role}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full rounded-full border-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.isArray(data2) &&
          data2
            .filter((user) =>
              `${user.name} ${user.lastName}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
            .map((order) => {
              const RoleIcon = roleIcons[order.role];
              return (
                <Card
                  key={order.id}
                  className="overflow-hidden transition-shadow duration-300 hover:shadow-lg"
                >
                  <CardHeader
                    className={`${roleColors[order.role]} text-white`}
                  >
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center space-x-2">
                        <RoleIcon className="h-6 w-6" />
                        <span>
                          {order.name} {order.lastName}
                        </span>
                      </CardTitle>
                      <Dialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditUser(order)}
                            className="text-white hover:bg-white/20"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Usuario</DialogTitle>
                          </DialogHeader>
                          {editingUser && (
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="firstName"
                                  className="text-right"
                                >
                                  Nombre
                                </Label>
                                <Input
                                  id="firstName"
                                  value={editingUser.firstName}
                                  onChange={(e) =>
                                    setEditingUser({
                                      ...editingUser,
                                      firstName: e.target.value,
                                    })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              {/* Más contenido aquí */}
                            </div>
                          )}
                          <div className="flex justify-end">
                            <Button variant="primary" onClick={handleSaveUser}>
                              Guardar cambios
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
      </div>
      <Toaster />
    </div>
  );
}

export default Page;

"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { signOut } from "next-auth/react";

function Navbar() {
  const router = useRouter();

  const handleGo = () => {
    router.push("/class-room/users");
  };
  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      <div className="mb-2">
        <img src="/Logo.png" alt="Logo" className="mx-auto h-10 w-auto" />
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" className="text-primero-100" onClick={handleGo}>
          Usuarios
        </Button>
        <Button className="bg-primero-100" onClick={() => signOut()}>
          Salir
        </Button>
      </div>
    </nav>
  );
}

export default Navbar;

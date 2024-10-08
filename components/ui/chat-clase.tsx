"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import Pusher from "pusher-js";

function Chat() {
  const { data: session, status } = useSession();
  const [username, setUsername] = useState("username");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // Hook para manejar el nombre del usuario basado en el token
  useEffect(() => {
    if (session) {
      const tokenA = parseJwt(session.user.token);
      const { name } = tokenA;
      setUsername(name);
    }
  }, [session]);

  // Hook para la suscripción al canal de Pusher
  useEffect(() => {
    Pusher.logToConsole = true;

    const pusher = new Pusher("b35e82ceab7dc7b14001", {
      cluster: "us2",
    });

    const channel = pusher.subscribe("chat");

    channel.bind("message", function (data) {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Limpiar suscripción al salir del componente
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  // Lógica para parsear el token JWT
  function parseJwt(token) {
    if (!token) return;
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  }

  // Manejar el envío de mensajes
  const submit = async (e) => {
    e.preventDefault();
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        message,
      }),
    });

    setMessage("");
  };

  // Mostrar "Loading..." mientras la sesión se está cargando
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Chat de la Clase</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <ScrollArea className="flex-grow mb-4 h-[300px]">
          {messages.map((msg, index) => (
            <div key={index} className="mb-2 flex items-start">
              <Avatar className="w-8 h-8 mr-2">
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${msg.username}`}
                />
                <AvatarFallback>{msg.username[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{msg.username}</p>
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
        <form className="flex gap-2" onSubmit={submit}>
          <Input
            type="text"
            placeholder="Escribe un mensaje..."
            value={message}
            onChange={(e) => setMessage(e.target.value)} // Actualiza el mensaje correctamente
          />
          <Button type="submit">Enviar</Button>
        </form>
      </CardContent>
    </>
  );
}

export default Chat;

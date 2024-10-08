"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chat from "@/components/ui/chat-clase";

export default function Component() {
  // Si necesitas algún estado o efecto, asegúrate de definirlo de forma incondicional
  const [classAvailable, setClassAvailable] = useState(true);

  // Uso del useEffect, llamado incondicionalmente
  useEffect(() => {
    // Simula la verificación de disponibilidad de clase o alguna lógica asincrónica
    const checkClassAvailability = () => {
      // Aquí podrías hacer una llamada API o alguna lógica asincrónica
      setTimeout(() => {
        setClassAvailable(false); // Cambia a falso después de 3 segundos como ejemplo
      }, 3000);
    };

    checkClassAvailability();
  }, []); // El efecto se ejecutará solo una vez al montar el componente

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-primero-100">
        Plataforma de Streaming de Clases
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Clase Actual: Introducción a React</CardTitle>
            </CardHeader>
            <CardContent>
              <iframe
                className="w-full aspect-video mb-4"
                width="100%"
                height="auto"
                src="https://www.youtube.com/embed/pFyAu4R684s?autoplay=1&loop=1&playlist=pFyAu4R684s"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
              <p className="text-sm text-gray-500">
                En esta clase, aprenderemos los fundamentos de React y cómo
                crear componentes interactivos.
              </p>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="h-full flex flex-col">
            <Chat />
          </Card>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Otras Clases Disponibles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            "JavaScript Avanzado",
            "CSS Flexbox y Grid",
            "Node.js para Principiantes",
          ].map((clase, index) => (
            <Card
              key={index}
              className={classAvailable ? "" : "opacity-50 cursor-not-allowed"}
            >
              <CardHeader>
                <CardTitle>{clase}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  {classAvailable
                    ? "Puedes inscribirte en esta clase."
                    : "Esta clase no está disponible en este momento."}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

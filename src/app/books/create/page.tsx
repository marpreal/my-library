"use client";

import { useState } from "react";

export default function CreateBookPage() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, autor }),
      });

      console.log("Estado de la respuesta:", response.status);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error desconocido");
      }

      const result = await response.json();
      alert("Libro creado!");
      setTitulo("");
      setAutor("");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error en la solicitud:", error.message);
        alert(`Error: ${error.message}`);
      } else {
        console.error("Error inesperado:", error);
        alert("Error desconocido");
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Crear un Nuevo Libro</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="titulo"
            className="block text-sm font-medium text-gray-700"
          >
            Título
          </label>
          <input
            id="titulo"
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 bg-white"
          />
        </div>
        <div>
          <label
            htmlFor="autor"
            className="block text-sm font-medium text-gray-700"
          >
            Autor
          </label>
          <input
            id="autor"
            type="text"
            placeholder="Autor"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 bg-white"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm"
        >
          Crear Libro
        </button>
      </form>
    </div>
  );
}

import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";

const COLAS_QUERY = gql`
  query {
    colas {
      id
      nombre
      numeroInicial
      numeroFinal
      numeroActual
      numeroGlobal
      Tipo
    }
  }
`;

const TIPOS_QUERY = gql`
  query {
    tipos {
      id
      nombre
    }
  }
`;

const CREAR_COLA = gql`
  mutation crearCola(
    $nombre: String!
    $numeroInicial: Int!
    $numeroFinal: Int!
    $tipoId: Int!
  ) {
    crearCola(
      nombre: $nombre
      numeroInicial: $numeroInicial
      numeroFinal: $numeroFinal
      tipoId: $tipoId
    ) {
      id
      nombre
      numeroInicial
      numeroFinal
      numeroActual
      Tipo
    }
  }
`;

export const CrearCola: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [numeroInicial, setNumeroInicial] = useState(1);
  const [numeroFinal, setNumeroFinal] = useState(100);
  const [tipoId, setTipoId] = useState<number | undefined>(undefined);

  const { data: tiposData, loading: tiposLoading, error: tiposError } = useQuery<{ tipos: { id: number; nombre: string }[] }>(TIPOS_QUERY);
  const [crearCola, { loading, error }] = useMutation(CREAR_COLA);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipoId) return; // Asegúrate que seleccionaron un tipo
    await crearCola({
      variables: {
        nombre,
        numeroInicial: Number(numeroInicial),
        numeroFinal: Number(numeroFinal),
        tipoId: Number(tipoId),
      },
      refetchQueries: [{ query: COLAS_QUERY }],
    });
    navigate("/listar-colas");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#111827]">
      <form
        className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full"
        onSubmit={handleSubmit}
      >
        <div className="mb-6">
          <label className="font-bold mb-2 block text-gray-700">
            Nombre de la Cola
          </label>
          <input
            type="text"
            className="w-full rounded-md border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="font-bold mb-2 block text-gray-700">
            Número Inicial del Ticket
          </label>
          <input
            type="number"
            className="w-full rounded-md border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none"
            value={numeroInicial}
            onChange={(e) => setNumeroInicial(Number(e.target.value))}
            required
            min={1}
          />
        </div>
        <div className="mb-6">
          <label className="font-bold mb-2 block text-gray-700">
            Número Final del Ticket
          </label>
          <input
            type="number"
            className="w-full rounded-md border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none"
            value={numeroFinal}
            onChange={(e) => setNumeroFinal(Number(e.target.value))}
            required
            min={numeroInicial}
          />
        </div>
        <div className="mb-6">
          <label className="font-bold mb-2 block text-gray-700">
            Tipo de Cola
          </label>
          {tiposLoading ? (
            <span>Cargando tipos...</span>
          ) : tiposError ? (
            <span className="text-red-600">Error al cargar tipos</span>
          ) : (
            <select
              className="w-full rounded-md border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none"
              value={tipoId ?? ""}
              onChange={e => setTipoId(Number(e.target.value))}
              required
            >
              <option value="" disabled>
                -- Selecciona el tipo --
              </option>
              {(tiposData?.tipos ?? []).map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="mb-8 bg-blue-50 rounded-xl p-4 flex items-start gap-2">
          <span className="text-blue-500 text-2xl mt-1">ℹ️</span>
          <div>
            <span className="font-bold text-blue-700">Información</span>
            <p className="text-blue-700 text-sm">
              Los tickets se mostrarán con formato de 3 dígitos (ej: 001, 002, 003).
            </p>
          </div>
        </div>
        {error && (
          <div className="mb-4 text-red-600">Error: {error.message}</div>
        )}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || tiposLoading || !tipoId}
            className={`w-1/2 py-3 rounded-lg font-bold ${
              loading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Crear Cola
          </button>
          <button
            type="button"
            className="w-1/2 py-3 rounded-lg font-bold bg-gray-200 text-gray-500"
            onClick={() => navigate("/")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearCola;
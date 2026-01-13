import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TIPOS_QUERY = gql`
  query {
    tipos {
      id
      nombre
    }
  }
`;

const CREAR_TIPO = gql`
  mutation crearTipo($nombre: String!) {
    crearTipo(nombre: $nombre) {
      id
      nombre
    }
  }
`;

export default function Crear_Tipo() {
  const [nombre, setNombre] = useState("");
  const [crearTipo, { loading, error }] = useMutation(CREAR_TIPO);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await crearTipo({
      variables: { nombre },
      refetchQueries: [{ query: TIPOS_QUERY }], 
    });
    navigate("/listar-tipo");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full"
      >
        <h2 className="text-xl font-bold mb-6">Crear Tipo</h2>
        <div className="mb-6">
          <label className="font-bold mb-2 block text-gray-700">
            Nombre del Tipo
          </label>
          <input
            type="text"
            className="w-full rounded-md border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        {error && (
          <div className="mb-4 text-red-600">Error: {error.message}</div>
        )}
        <div className="flex justify-between gap-4">
          <button
            type="submit"
            disabled={loading}
            className="w-1/2 py-3 rounded-lg font-bold bg-blue-700 text-white hover:bg-blue-800"
          >
            Crear
          </button>
          <button
            type="button"
            className="w-1/2 py-3 rounded-lg font-bold bg-gray-200 text-gray-500"
            onClick={() => navigate("/listar-tipo")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

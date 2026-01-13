import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const TIPO_QUERY = gql`
  query tipo($id: ID!) {
    tipo(id: $id) {
      id
      nombre
    }
  }
`;

const EDITAR_TIPO = gql`
  mutation editarTipo($id: ID!, $nombre: String!) {
    editarTipo(id: $id, nombre: $nombre) {
      id
      nombre
    }
  }
`;

interface TipoData {
  tipo: {
    id: string;
    nombre: string;
  };
}

export default function EditarTipo() {
  const { id } = useParams();
  const { data, loading } = useQuery<TipoData>(TIPO_QUERY, {
    variables: { id },
  });
  const [nombre, setNombre] = useState(""); // No inicialices con data aquí
  const [editarTipo, { loading: saving, error }] = useMutation(EDITAR_TIPO);
  const navigate = useNavigate();

  // Solo actualiza nombre por useEffect la PRIMERA vez que viene data y SOLO si el id cambia
  const prevId = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (data?.tipo && prevId.current !== data.tipo.id) {
      // Use a microtask to avoid cascading renders warning
      Promise.resolve().then(() => setNombre(data.tipo.nombre));
      prevId.current = data.tipo.id;
    }
  }, [data?.tipo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await editarTipo({
      variables: { id, nombre },
      refetchQueries: ["tipos"],
    });
    navigate("/listar-tipo");
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full"
      >
        <h2 className="text-xl font-bold mb-6">Editar Tipo</h2>
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
            disabled={saving}
            className="w-1/2 py-3 rounded-lg font-bold bg-blue-700 text-white hover:bg-blue-800"
          >
            Guardar
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

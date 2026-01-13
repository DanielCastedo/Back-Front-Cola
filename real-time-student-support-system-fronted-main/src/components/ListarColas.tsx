import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
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

const ELIMINAR_COLA_MUTATION = gql`
  mutation eliminarCola($id: ID!) {
    eliminarCola(id: $id)
  }
`;

interface Cola {
  id: string;
  nombre: string;
  numeroInicial: number;
  numeroFinal: number;
  numeroActual: number;
  numeroGlobal: number;
  Tipo: number;
}

export default function ListarColas() {
  const { data, loading, error, refetch } = useQuery<{ colas: Cola[] }>(COLAS_QUERY);
  const [eliminarCola] = useMutation(ELIMINAR_COLA_MUTATION);
  const navigate = useNavigate();

  const handleEliminar = async (id: string) => {
    await eliminarCola({ variables: { id } });
    refetch();
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar colas</div>;

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">Lista de Colas</h2>
      <table className="table-auto w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-slate-200">
            <th className="p-2">#</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Inicial</th>
            <th className="p-2">Final</th>
            <th className="p-2">Actual</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {(data?.colas ?? []).map((cola: Cola, idx: number) => (
            <tr key={cola.id} className="border-b">
              <td className="p-2">{idx + 1}</td>
              <td className="p-2">{cola.nombre}</td>
              <td className="p-2">{cola.numeroInicial}</td>
              <td className="p-2">{cola.numeroFinal}</td>
              <td className="p-2">{cola.numeroActual}</td>
              <td className="p-2 flex gap-2">
                <button
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                  onClick={() => navigate(`/editar-cola/${cola.id}`)}
                >
                  Editar
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleEliminar(cola.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
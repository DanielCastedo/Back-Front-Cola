import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";

const TIPOS_QUERY = gql`
  query {
    tipos {
      id
      nombre
    }
  }
`;

const ELIMINAR_TIPO = gql`
  mutation eliminarTipo($id: ID!) {
    eliminarTipo(id: $id)
  }
`;

type Tipo = {
  id: string;
  nombre: string;
};
type TiposData = {
  tipos: Tipo[];
};

const ListarTipo = () => {
  const { data, loading, error} = useQuery<TiposData>(TIPOS_QUERY);
const [eliminarTipo] = useMutation(ELIMINAR_TIPO);
  const navigate = useNavigate();

  const handleEliminar = async (id: string) => {
    await eliminarTipo({
      variables: { id },
      refetchQueries: [{ query: TIPOS_QUERY }],
    });
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar tipos</div>;

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">Lista de Tipos</h2>
      <button
        onClick={() => navigate("/crear-tipo")}
        className="mb-4 px-4 py-2 bg-green-700 text-white rounded font-bold"
      >
        + Nuevo Tipo
      </button>
      <table className="table-auto w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-slate-200">
            <th className="p-2">#</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {(data?.tipos ?? []).map((tipo: Tipo, idx: number) => (
            <tr key={tipo.id} className="border-b">
              <td className="p-2 text-center">{idx + 1}</td>
              <td className="p-2">{tipo.nombre}</td>
              <td className="p-2 flex gap-2">
                <button
                  className="px-2 py-1 bg-blue-600 text-white rounded"
                  onClick={() => navigate(`/editar-tipo/${tipo.id}`)}
                >
                  Editar
                </button>
                <button
                  className="px-2 py-1 bg-red-600 text-white rounded"
                  onClick={() => handleEliminar(tipo.id)}
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
};

export default ListarTipo;

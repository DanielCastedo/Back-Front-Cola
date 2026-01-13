import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";

const COLA_QUERY = gql`
  query GetCola($id: ID!) {
    cola(id: $id) {
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

const EDITAR_COLA_MUTATION = gql`
  mutation editarCola(
    $id: ID!
    $nombre: String!
    $numeroInicial: Int!
    $numeroFinal: Int!
    $tipoId: Int!
  ) {
    editarCola(
      id: $id
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
      numeroGlobal
      Tipo
    }
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
interface Tipo {
  id: string;
  nombre: string;
}

export default function EditarCola() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, loading } = useQuery<{ cola: Cola }>(COLA_QUERY, {
    variables: { id },
  });
  const { data: tiposData, loading: tiposLoading, error: tiposError } = useQuery<{ tipos: Tipo[] }>(TIPOS_QUERY);

  // Memo y state iniciales
  const colaData = useMemo(() => {
    const initialForm: Cola = {
      id: "",
      nombre: "",
      numeroInicial: 0,
      numeroFinal: 1,
      numeroActual: 0,
      numeroGlobal: 0,
      Tipo: tiposData?.tipos?.[0]?.id ? Number(tiposData!.tipos[0].id) : 1,
    };
    return data && data.cola ? data.cola : initialForm;
  }, [data, tiposData]);

  const [form, setForm] = useState<Cola>(colaData);

  // Sync form state when colaData or tiposData changes
  useEffect(() => {
    setForm(colaData);
  }, [colaData]);

  const [editarCola] = useMutation(EDITAR_COLA_MUTATION);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "number" ? Number(e.target.value) : e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await editarCola({
      variables: {
        id,
        nombre: form.nombre,
        numeroInicial: Number(form.numeroInicial),
        numeroFinal: Number(form.numeroFinal),
        tipoId: Number(form.Tipo),
      },
      // Puedes agregar refetchQueries aquí si lo necesitas
    });
    navigate("/listar-colas");
  };

  if (loading || tiposLoading) return <div>Cargando...</div>;
  if (tiposError) return <div className="text-red-600">Error al cargar tipos</div>;

  return (
    <form
      className="max-w-md mx-auto bg-white rounded shadow px-6 py-8 mt-8"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-6">Editar Cola</h2>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Nombre</label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Número Inicial</label>
        <input
          type="number"
          name="numeroInicial"
          value={form.numeroInicial}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Número Final</label>
        <input
          type="number"
          name="numeroFinal"
          value={form.numeroFinal}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Tipo de Cola</label>
        <select
          name="Tipo"
          value={form.Tipo}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
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
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Guardar cambios
      </button>
    </form>
  );
}
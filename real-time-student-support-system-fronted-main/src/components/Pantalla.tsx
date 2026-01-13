import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useSubscription } from "@apollo/client/react";
import { useEffect, useState } from "react";

// Consulta para traer todas las colas
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

// Suscripción para cada cola
const VIGILAR_COLA_SUB = gql`
  subscription vigilarCola($colaId: ID!) {
    vigilarCola(colaId: $colaId) {
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

const Caja = ({ cola }: { cola: Cola }) => {
  // Suscripción a actualizaciones en tiempo real
  const { data } = useSubscription<{ vigilarCola: Cola }>(VIGILAR_COLA_SUB, {
    variables: { colaId: cola.id },
  });
  const [datos, setDatos] = useState<Cola>(cola);

  useEffect(() => {
    if (
      data?.vigilarCola &&
      data.vigilarCola.numeroActual !== datos.numeroActual
    ) {
      setDatos(data.vigilarCola);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const anterior1 =
    datos.numeroActual - 1 >= datos.numeroInicial
      ? datos.numeroActual - 1
      : "-";
  const anterior2 =
    datos.numeroActual - 2 >= datos.numeroInicial
      ? datos.numeroActual - 2
      : "-";
  const pendientes = datos.numeroFinal - datos.numeroActual;

  return (
    <div className="bg-slate-800 rounded-xl mx-4 my-4 p-6 shadow-2xl flex-1 min-w-[330px] max-w-sm flex flex-col">
      <div className="text-center text-lg text-slate-300 tracking-widest mb-4 font-extrabold uppercase">
        {datos.nombre}
      </div>
      <div className="bg-slate-900 rounded-lg py-4 mb-6 flex flex-col items-center shadow-inner">
        <div className="text-slate-200 text-base font-medium mb-2 uppercase tracking-wider">
          Ticket Actual
        </div>
        <div
          className="text-yellow-400 font-extrabold text-7xl drop-shadow-lg animate-pulse"
          style={{ filter: "brightness(1.3)" }}
        >
          {datos.numeroActual}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-900 rounded-lg py-4 flex flex-col items-center shadow-inner">
          <div className="text-slate-400 text-xs mb-1 uppercase tracking-wide">
            Anterior
          </div>
          <div className="text-yellow-400 font-bold text-3xl">{anterior2}</div>
        </div>
        <div className="bg-slate-900 rounded-lg py-4 flex flex-col items-center shadow-inner">
          <div className="text-slate-400 text-xs mb-1 uppercase tracking-wide">
            Anterior
          </div>
          <div className="text-yellow-400 font-bold text-3xl">{anterior1}</div>
        </div>
      </div>
      <div className="text-center mt-auto text-slate-300 text-base">
        Pendientes:{" "}
        <span className="font-bold text-yellow-400">{pendientes}</span>
      </div>
    </div>
  );
};

export default function Pantalla() {
  const { data, loading } = useQuery<{ colas: Cola[] }>(COLAS_QUERY);

  if (loading)
    return <div className="text-white text-2xl text-center">Cargando...</div>;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-900 to-blue-700">
      <div className="text-white text-center text-3xl md:text-4xl font-extrabold pt-8 mb-8 tracking-widest">
        SISTEMAS DE TICKETS FICCT
      </div>
      <div className="flex flex-wrap justify-center gap-2 px-4">
        {(data?.colas ?? []).map((cola: Cola) => (
          <Caja key={cola.id} cola={cola} />
        ))}
      </div>
    </div>
  );
}

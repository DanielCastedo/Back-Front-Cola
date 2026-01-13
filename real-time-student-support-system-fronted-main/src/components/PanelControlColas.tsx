import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useSubscription, useMutation } from "@apollo/client/react";
import { PlayCircle } from "lucide-react";

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

const LLAMAR_SIGUIENTE = gql`
  mutation LlamarSiguiente($colaId: ID!) {
    llamarSiguiente(colaId: $colaId) {
      id
      numeroActual
      numeroFinal
      numeroInicial
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

const CajaControl = ({ cola }: { cola: Cola }) => {
    const { data: subData } = useSubscription<{ vigilarCola: Cola }>(VIGILAR_COLA_SUB, {
        variables: { colaId: cola.id },
    });
  const [llamarSiguiente, { loading: loadingMutation }] =
useMutation(LLAMAR_SIGUIENTE);

  // Solo usa datos de la suscripción si llegan, sino los iniciales
  const datos = subData && subData.vigilarCola ? subData.vigilarCola : cola;

  const pendientes = datos.numeroFinal - datos.numeroActual;
  const rango = `${datos.numeroInicial} - ${datos.numeroFinal}`;
  const progreso =
    Math.round(
      ((datos.numeroActual - datos.numeroInicial) /
        (datos.numeroFinal - datos.numeroInicial)) *
        1000
    ) / 10;

  const handleNext = async () => {
    if (datos.numeroActual < datos.numeroFinal) {
      await llamarSiguiente({ variables: { colaId: datos.id } });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl m-4 flex flex-col w-full max-w-xs min-w-[330px]">
      <div className="flex items-center justify-between px-6 pt-6">
        <div className="font-bold text-blue-900 uppercase tracking-wider text-lg">
          CAJA #{datos.id}
        </div>
        <span className="bg-green-500 text-white rounded-full px-4 py-1 text-xs font-bold">
          ACTIVA
        </span>
      </div>
      <div className="bg-gradient-to-b from-orange-400 to-orange-500 rounded-xl mt-5 mx-6 p-6 text-center shadow-md">
        <div className="text-white text-md font-bold tracking-wide uppercase mb-2">
          Ticket Actual
        </div>
        <div className="text-white font-black text-6xl md:text-7xl drop-shadow-md">
          {datos.numeroActual}
        </div>
      </div>
      <div className="flex justify-between px-6 mt-4">
        <div className="bg-slate-50 rounded-lg px-6 py-2 flex-1 mr-2 flex flex-col items-center">
          <div className="text-slate-500 font-semibold text-xs uppercase tracking-widest">
            Rango
          </div>
          <div className="font-bold text-blue-900 text-lg">{rango}</div>
        </div>
        <div className="bg-orange-50 rounded-lg px-6 py-2 flex-1 flex flex-col items-center">
          <div className="text-orange-400 font-semibold text-xs uppercase tracking-widest">
            Pendientes
          </div>
          <div className="font-bold text-orange-500 text-lg">{pendientes}</div>
        </div>
      </div>
      <div className="px-6 mt-6 mb-2">
        <div className="flex items-center justify-between text-slate-400 text-sm mb-1">
          <span>PROGRESO</span>
          <span>{isNaN(progreso) ? "0%" : `${progreso}%`}</span>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full relative overflow-hidden">
          <div
            className="h-4 bg-blue-500 rounded-full absolute left-0 top-0 transition-all"
            style={{ width: isNaN(progreso) ? "0%" : `${progreso}%` }}
          ></div>
        </div>
      </div>
      <button
        onClick={handleNext}
        disabled={datos.numeroActual >= datos.numeroFinal || loadingMutation}
        className={`rounded-xl mt-7 mb-6 mx-6 py-4 w-auto flex items-center justify-center gap-2
          font-bold text-base shadow-md transition
          ${
            datos.numeroActual >= datos.numeroFinal || loadingMutation
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-700"
          }`}
      >
        <PlayCircle className="w-6 h-6" /> SIGUIENTE TICKET
      </button>
    </div>
  );
};

export default function PanelControlColas() {
  const { data, loading } = useQuery<{ colas: Cola[] }>(COLAS_QUERY);

  if (loading)
    return <div className="text-white text-2xl text-center">Cargando...</div>;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-900 to-blue-700 flex flex-col items-center">
      <div className="text-white text-center text-3xl md:text-4xl font-extrabold pt-8 mb-8 tracking-widest">
        CONTROL DE CAJAS - SISTEMAS DE TICKETS
      </div>
      <div className="flex flex-wrap justify-center w-full gap-2 px-4">
        {(data?.colas ?? []).map((cola) => (
          <CajaControl key={cola.id} cola={cola} />
        ))}
      </div>
    </div>
  );
}

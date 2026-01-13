import { gql } from '@apollo/client';
import { useSubscription } from '@apollo/client/react';
import { Monitor } from 'lucide-react';

const SUSCRIPCION_COLA = gql`
  subscription VigilarCola($id: ID!) {
    vigilarCola(colaId: $id) {
      id
      nombre
      numeroActual
      numeroGlobal
    }
  }
`;

export const PantallaPublica = () => {
  const { data, loading, error } = useSubscription(SUSCRIPCION_COLA, {
    variables: { id: "1" },
  });

  if (error) return <div className="text-red-500">Error de conexión: {error.message}</div>;
  if (loading) return <div className="text-blue-500">Conectando al servidor...</div>;

  const info = data?.vigilarCola;

  return (
    <div className="flex flex-col items-center justify-center h-64 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 p-6">
      <div className="flex items-center gap-2 text-slate-400 mb-4">
        <Monitor className="w-6 h-6" />
        <h2 className="text-xl font-semibold uppercase tracking-widest">{info.nombre}</h2>
      </div>
      <div className="text-center">
        <span className="text-sm text-slate-400">Turno Actual</span>
        <div className="text-8xl font-black text-green-400 font-mono tracking-tighter">
          {info.numeroActual}
        </div>
      </div>
      <div className="mt-4 text-xs text-slate-500">
        Último ticket emitido: {info.numeroGlobal}
      </div>
    </div>
  );
};
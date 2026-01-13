import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Megaphone } from 'lucide-react';

const LLAMAR_SIGUIENTE = gql`
  mutation LlamarSiguiente($id: ID!) {
    llamarSiguiente(colaId: $id) {
      numeroActual
    }
  }
`;

export const PanelAdmin = () => {
  const [llamarSiguiente, { loading }] = useMutation(LLAMAR_SIGUIENTE);

  const handleClick = () => {
    llamarSiguiente({ variables: { id: "1" } });
  };

  return (
    <div className="flex flex-col items-center justify-center h-64 bg-white border border-slate-200 rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-slate-800 mb-6">Panel Administrativo</h3>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`flex items-center gap-3 px-8 py-4 rounded-lg font-bold text-white shadow-md transition-all
          ${loading 
            ? 'bg-slate-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'}
        `}
      >
        <Megaphone className="w-6 h-6" />
        {loading ? 'Procesando...' : 'Llamar Siguiente'}
      </button>
      <p className="mt-4 text-sm text-slate-500 text-center max-w-xs">
        Al presionar, se actualizarán todas las pantallas conectadas en tiempo real.
      </p>
    </div>
  );
};
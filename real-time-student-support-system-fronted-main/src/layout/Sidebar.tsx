import { Link, useLocation } from 'react-router-dom';

const menu = [
  { path: "/", label: "Dashboard" },
  { path: "/crear-cola", label: "Crear Cola" },
  { path: "/listar-colas", label: "Listar Colas" },
  { path: "/pantalla", label: "Pantalla Pública" },
  { path: "/control", label: "Panel de Control" },
  // puedes agregar más rutas aquí
];
export const Sidebar: React.FC = () => {
  const location = useLocation();
  return (
    <aside className="bg-slate-800 text-white h-screen w-64 flex flex-col py-8 px-4 shadow-lg">
      <div className="mb-10 font-extrabold text-2xl tracking-wider text-center">
        🎟️ Tickets SIS
      </div>
      <nav className="flex flex-col gap-4">
        {menu.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-3 py-2 rounded-lg font-semibold transition
              ${location.pathname === item.path
                ? 'bg-blue-600'
                : 'hover:bg-slate-700'}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex-1"></div>
      <div className="text-xs text-center text-slate-400 mt-8">Versión 1.0</div>
    </aside>
  );
};
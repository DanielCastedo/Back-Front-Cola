import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApolloProvider } from '@apollo/client/react';
import { client } from "./lib/apollo-client";

import { DashboardLayout } from './layout/DashboardLayout';
import { PanelAdmin } from './components/PanelAdmin';
import CrearCola from './components/CrearCola';
import ListarColas from "./components/ListarColas";
import EditarCola from "./components/EditarCola";
import Pantalla from "./components/pantalla";
import PanelControlColas from "./components/PanelControlColas";
import { PantallaPublica } from "./components/PantallaPublica";
import ListarTipo from "./components/ListarTipo";
import CrearTipo from "./components/CrearTipo";
import EditarTipo from "./components/EditarTipo";

function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
      <div>
        <h2 className="text-lg font-semibold text-slate-600 mb-4">Vista Estudiante (TV)</h2>
        <PantallaPublica />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-600 mb-4">Vista Empleado (PC)</h2>
        <PanelAdmin />
      </div>
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout><Dashboard /></DashboardLayout>} path="/" />
          <Route element={<DashboardLayout><CrearCola /></DashboardLayout>} path="/crear-cola" />
          <Route element={<DashboardLayout><ListarColas /></DashboardLayout>} path="/listar-colas" />
          <Route element={<DashboardLayout><EditarCola /></DashboardLayout>} path="/editar-cola/:id" />
          <Route element={<DashboardLayout><Pantalla /></DashboardLayout>} path="/pantalla" />
          <Route element={<DashboardLayout><PanelControlColas /></DashboardLayout>} path="/control" />
          <Route element={<DashboardLayout><ListarTipo /></DashboardLayout>} path="/listar-tipo" />
          <Route element={<DashboardLayout><CrearTipo /></DashboardLayout>} path="/crear-tipo" />
          <Route element={<DashboardLayout><EditarTipo /></DashboardLayout>} path="/editar-tipo/:id" />
          {/* Si tienes más rutas, ponlas aquí */}
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
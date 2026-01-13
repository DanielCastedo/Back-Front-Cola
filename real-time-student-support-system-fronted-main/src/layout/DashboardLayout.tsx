import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex h-screen bg-slate-50">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="p-8 flex-1 overflow-y-auto">{children}</main>
    </div>
  </div>
);
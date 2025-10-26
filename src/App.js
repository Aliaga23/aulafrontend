import { Routes, Route } from 'react-router-dom';
import './App.css';
import Landing from './pages/Landing';
import Login from './pages/Login';
import DashboardHome from './pages/DashboardHome';
import Roles from './pages/Roles';
import Usuarios from './pages/Usuarios';
import Permisos from './pages/Permisos';
import Carreras from './pages/Carreras';
import Materias from './pages/Materias';
import Grupos from './pages/Grupos';
import Gestiones from './pages/Gestiones';
import Asignaciones from './pages/Asignaciones';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<DashboardHome />} />
      <Route path="/dashboard/roles" element={<Roles />} />
      <Route path="/dashboard/usuarios" element={<Usuarios />} />
      <Route path="/dashboard/permisos" element={<Permisos />} />
      <Route path="/dashboard/carreras" element={<Carreras />} />
      <Route path="/dashboard/materias" element={<Materias />} />
      <Route path="/dashboard/grupos" element={<Grupos />} />
      <Route path="/dashboard/gestiones" element={<Gestiones />} />
      <Route path="/dashboard/asignaciones" element={<Asignaciones />} />
    </Routes>
  );
}

export default App;

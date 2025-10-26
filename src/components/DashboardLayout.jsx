import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Key, 
  BookOpen,
  UsersRound,
  ClipboardList,
  Calendar,
  GraduationCap,
  UserCircle, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import '../styles/dashboard.css';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/dashboard/roles', icon: Shield, label: 'Roles' },
    { path: '/dashboard/usuarios', icon: Users, label: 'Usuarios' },
    { path: '/dashboard/permisos', icon: Key, label: 'Permisos' },
    { path: '/dashboard/carreras', icon: GraduationCap, label: 'Carreras' },
    { path: '/dashboard/materias', icon: BookOpen, label: 'Materias' },
    { path: '/dashboard/grupos', icon: UsersRound, label: 'Grupos' },
    { path: '/dashboard/gestiones', icon: Calendar, label: 'Gestiones' },
    { path: '/dashboard/asignaciones', icon: ClipboardList, label: 'Asignaciones' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const handleOverlayClick = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="dashboard-layout">
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={handleOverlayClick}></div>
      )}

      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar__header">
          {sidebarOpen ? (
            <div className="sidebar__brand">
              <div className="sidebar__brand-icon">
                <LayoutDashboard size={24} />
              </div>
              <span>AulaVirtual</span>
            </div>
          ) : (
            <div className="sidebar__brand-icon" style={{ margin: '0 auto' }}>
              <LayoutDashboard size={24} />
            </div>
          )}
          <button 
            className="sidebar__toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar__nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar__item ${isActive(item.path) ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user">
            <UserCircle size={20} />
            {sidebarOpen && (
              <div className="sidebar__user-info">
                <span className="sidebar__user-name">
                  {user.nombre && user.apellido ? `${user.nombre} ${user.apellido}` : 'Usuario'}
                </span>
                <span className="sidebar__user-role">{user.rol || 'Sin rol'}</span>
              </div>
            )}
          </div>
          <button className="sidebar__logout" onClick={handleLogout}>
            <LogOut size={20} />
            {sidebarOpen && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="mobile-header">
          <button 
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          <div className="mobile-header__title">AulaVirtual</div>
        </div>

        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
}

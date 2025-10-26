import DashboardLayout from '../components/DashboardLayout';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Dashboard</h1>
          <p className="page-header__subtitle">Bienvenido al panel de administración</p>
        </div>
      </div>

      <div className="card">
        <div className="card__body">
          <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>
            Selecciona una opción del menú lateral para comenzar
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

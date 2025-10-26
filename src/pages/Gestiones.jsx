import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Plus, Edit, Trash2, Search, X, AlertTriangle, Calendar } from 'lucide-react';

const API_URL = 'https://aulabackend-production.up.railway.app';

export default function Gestiones() {
  const [gestiones, setGestiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [gestionToDelete, setGestionToDelete] = useState(null);
  const [editingGestion, setEditingGestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    anio: '',
    periodo: '',
    fechainicio: '',
    fechafin: ''
  });

  useEffect(() => {
    fetchGestiones();
  }, []);

  const fetchGestiones = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/gestiones`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setGestiones(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar gestiones:', error);
      setGestiones([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingGestion
        ? `${API_URL}/api/gestiones/${editingGestion.idgestion}`
        : `${API_URL}/api/gestiones`;
      
      const method = editingGestion ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchGestiones();
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error al guardar gestión:', error);
    }
  };

  const handleEdit = (gestion) => {
    setEditingGestion(gestion);
    setFormData({
      anio: gestion.anio || '',
      periodo: gestion.periodo || '',
      fechainicio: gestion.fechainicio || '',
      fechafin: gestion.fechafin || ''
    });
    setShowModal(true);
  };

  const confirmDelete = (gestion) => {
    setGestionToDelete(gestion);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!gestionToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/gestiones/${gestionToDelete.idgestion}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchGestiones();
        setShowDeleteModal(false);
        setGestionToDelete(null);
      }
    } catch (error) {
      console.error('Error al eliminar gestión:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingGestion(null);
    setFormData({
      anio: '',
      periodo: '',
      fechainicio: '',
      fechafin: ''
    });
  };

  const filteredGestiones = gestiones.filter(gestion =>
    gestion.anio?.toString().includes(searchTerm) ||
    gestion.periodo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEstadoGestion = (fechainicio, fechafin) => {
    const hoy = new Date();
    const inicio = new Date(fechainicio);
    const fin = new Date(fechafin);

    if (hoy < inicio) {
      return { label: 'Próxima', class: 'badge--info' };
    } else if (hoy >= inicio && hoy <= fin) {
      return { label: 'Activa', class: 'badge--success' };
    } else {
      return { label: 'Finalizada', class: 'badge--secondary' };
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Gestiones</h1>
          <p className="page-header__subtitle">Gestiona los períodos académicos</p>
        </div>
        <div className="page-header__actions">
          <button 
            className="btn btn--primary"
            onClick={() => setShowModal(true)}
          >
            <Plus size={20} />
            Nueva Gestión
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card__header">
          <h3 className="card__title">Lista de Gestiones</h3>
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Buscar gestiones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="card__body">
          {loading ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Cargando...</p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Año</th>
                    <th>Período</th>
                    <th>Fecha Inicio</th>
                    <th>Fecha Fin</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGestiones.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                        No se encontraron gestiones
                      </td>
                    </tr>
                  ) : (
                    filteredGestiones.map((gestion) => {
                      const estado = getEstadoGestion(gestion.fechainicio, gestion.fechafin);
                      return (
                        <tr key={gestion.idgestion}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{ 
                                width: '32px', 
                                height: '32px', 
                                borderRadius: '6px',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '0.875rem',
                                fontWeight: '600'
                              }}>
                                <Calendar size={16} />
                              </div>
                              <span style={{ fontWeight: '500' }}>{gestion.anio}</span>
                            </div>
                          </td>
                          <td>
                            <span className="badge badge--info">{gestion.periodo}</span>
                          </td>
                          <td>{new Date(gestion.fechainicio).toLocaleDateString()}</td>
                          <td>{new Date(gestion.fechafin).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${estado.class}`}>
                              {estado.label}
                            </span>
                          </td>
                          <td>
                            <div className="table__actions">
                              <button
                                className="btn btn--sm btn--secondary btn--icon"
                                onClick={() => handleEdit(gestion)}
                                title="Editar"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                className="btn btn--sm btn--danger btn--icon"
                                onClick={() => confirmDelete(gestion)}
                                title="Eliminar"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">
                {editingGestion ? 'Editar Gestión' : 'Nueva Gestión'}
              </h2>
              <button className="modal__close" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal__body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Año *</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.anio}
                      onChange={(e) => setFormData({ ...formData, anio: e.target.value })}
                      required
                      placeholder="Ej: 2025"
                      min="2000"
                      max="2100"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Período *</label>
                    <select
                      className="form-select"
                      value={formData.periodo}
                      onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
                      required
                    >
                      <option value="">Selecciona período</option>
                      <option value="I">Primer Semestre (I)</option>
                      <option value="II">Segundo Semestre (II)</option>
                      <option value="Verano">Verano</option>
                      <option value="Anual">Anual</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Fecha Inicio *</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.fechainicio}
                      onChange={(e) => setFormData({ ...formData, fechainicio: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Fecha Fin *</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.fechafin}
                      onChange={(e) => setFormData({ ...formData, fechafin: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal__footer">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn--primary">
                  {editingGestion ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal__header">
              <h2 className="modal__title">Confirmar eliminación</h2>
              <button className="modal__close" onClick={() => setShowDeleteModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal__body">
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ 
                  display: 'inline-flex',
                  padding: '1rem',
                  borderRadius: '50%',
                  background: '#fee2e2',
                  marginBottom: '1rem'
                }}>
                  <AlertTriangle size={24} color="#dc2626" />
                </div>
                <p style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#0f172a' }}>
                  ¿Estás seguro de eliminar esta gestión?
                </p>
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  {gestionToDelete?.anio} - {gestionToDelete?.periodo}
                </p>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>
                  Esta acción no se puede deshacer.
                </p>
              </div>
            </div>

            <div className="modal__footer">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn--danger"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

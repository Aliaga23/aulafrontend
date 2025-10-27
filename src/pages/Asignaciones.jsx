import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Plus, Trash2, Search, X, AlertTriangle, GraduationCap, BookOpen } from 'lucide-react';

const API_URL = 'https://aulabackend-production.up.railway.app';

export default function Asignaciones() {
  const [asignaciones, setAsignaciones] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [gestiones, setGestiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [asignacionToDelete, setAsignacionToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMateria, setSelectedMateria] = useState('');
  const [formData, setFormData] = useState({
    coddocente: '',
    idgrupo: '',
    idcarrera: '',
    sigla: '',
    idgestion: ''
  });

  useEffect(() => {
    fetchAsignaciones();
    fetchDocentes();
    fetchMaterias();
    fetchGrupos();
    fetchGestiones();
  }, []);

  const fetchAsignaciones = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/asignaciones`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setAsignaciones(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar asignaciones:', error);
      setAsignaciones([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocentes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/docentes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setDocentes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar docentes:', error);
      setDocentes([]);
    }
  };

  const fetchMaterias = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/materias`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setMaterias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar materias:', error);
      setMaterias([]);
    }
  };

  const fetchGrupos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/grupos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setGrupos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar grupos:', error);
      setGrupos([]);
    }
  };

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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/asignaciones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchAsignaciones();
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error al guardar asignación:', error);
    }
  };

  const confirmDelete = (asignacion) => {
    setAsignacionToDelete(asignacion);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!asignacionToDelete) return;

    try {
      alert('Las asignaciones no se pueden eliminar desde el frontend actualmente.');
      setShowDeleteModal(false);
      setAsignacionToDelete(null);
    } catch (error) {
      console.error('Error al eliminar asignación:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMateria('');
    setFormData({
      coddocente: '',
      idgrupo: '',
      idcarrera: '',
      sigla: '',
      idgestion: ''
    });
  };

  const handleMateriaChange = (e) => {
    const materiaKey = e.target.value;
    setSelectedMateria(materiaKey);
    
    if (materiaKey) {
      const [idcarrera, sigla] = materiaKey.split('|');
      setFormData({
        ...formData,
        idcarrera: idcarrera,
        sigla: sigla
      });
    } else {
      setFormData({
        ...formData,
        idcarrera: '',
        sigla: ''
      });
    }
  };

  const getDocenteNombre = (coddocente) => {
    const docente = docentes.find(d => d.coddocente === coddocente);
    return docente ? `${docente.nombre} ${docente.apellido}` : '-';
  };

  const getMateriaNombre = (idcarrera, sigla) => {
    const materia = materias.find(m => m.idcarrera === idcarrera && m.sigla === sigla);
    return materia ? materia.nombre : '-';
  };

  const getMateriaSigla = (sigla) => {
    return sigla || '-';
  };

  const getGrupoNombre = (idgrupo) => {
    const grupo = grupos.find(g => g.idgrupo === idgrupo);
    return grupo ? grupo.nombre : '-';
  };

  const getGestionNombre = (idgestion) => {
    const gestion = gestiones.find(g => g.idgestion === idgestion);
    return gestion ? `${gestion.anio} - ${gestion.periodo}` : '-';
  };

  const filteredAsignaciones = asignaciones.filter(asignacion => {
    const docenteNombre = getDocenteNombre(asignacion.coddocente).toLowerCase();
    const materiaNombre = getMateriaNombre(asignacion.idcarrera, asignacion.sigla).toLowerCase();
    const term = searchTerm.toLowerCase();
    return docenteNombre.includes(term) || materiaNombre.includes(term);
  });

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Asignaciones</h1>
          <p className="page-header__subtitle">Asigna materias a los docentes</p>
        </div>
        <div className="page-header__actions">
          <button 
            className="btn btn--primary"
            onClick={() => setShowModal(true)}
          >
            <Plus size={20} />
            Nueva Asignación
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card__header">
          <h3 className="card__title">Lista de Asignaciones</h3>
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Buscar asignaciones..."
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
                    <th>Docente</th>
                    <th>Materia</th>
                    <th>Grupo</th>
                    <th>Gestión</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAsignaciones.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                        No se encontraron asignaciones
                      </td>
                    </tr>
                  ) : (
                    filteredAsignaciones.map((asignacion, index) => (
                      <tr key={`${asignacion.coddocente}-${asignacion.idgrupo}-${asignacion.idcarrera}-${asignacion.sigla}-${asignacion.idgestion}-${index}`}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ 
                              width: '32px', 
                              height: '32px', 
                              borderRadius: '6px',
                              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '0.875rem',
                              fontWeight: '600'
                            }}>
                              <GraduationCap size={16} />
                            </div>
                            <span style={{ fontWeight: '500' }}>{getDocenteNombre(asignacion.coddocente)}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="badge badge--info">{getMateriaSigla(asignacion.sigla)}</span>
                            <span>{getMateriaNombre(asignacion.idcarrera, asignacion.sigla)}</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge--secondary">{getGrupoNombre(asignacion.idgrupo)}</span>
                        </td>
                        <td>
                          <span className="badge badge--success">{getGestionNombre(asignacion.idgestion)}</span>
                        </td>
                        <td>
                          <div className="table__actions">
                            <button
                              className="btn btn--sm btn--danger btn--icon"
                              onClick={() => confirmDelete(asignacion)}
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
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
                Nueva Asignación
              </h2>
              <button className="modal__close" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal__body">
                <div className="form-group">
                  <label className="form-label">
                    <GraduationCap size={16} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                    Docente *
                  </label>
                  <select
                    className="form-select"
                    value={formData.coddocente}
                    onChange={(e) => setFormData({ ...formData, coddocente: e.target.value })}
                    required
                  >
                    <option value="">Selecciona un docente</option>
                    {docentes.map((docente) => (
                      <option key={docente.coddocente} value={docente.coddocente}>
                        {docente.nombre} {docente.apellido} - {docente.especialidad || 'Sin especialidad'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <BookOpen size={16} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                    Materia *
                  </label>
                  <select
                    className="form-select"
                    value={selectedMateria}
                    onChange={handleMateriaChange}
                    required
                  >
                    <option value="">Selecciona una materia</option>
                    {materias.map((materia) => (
                      <option key={`${materia.idcarrera}|${materia.sigla}`} value={`${materia.idcarrera}|${materia.sigla}`}>
                        {materia.sigla} - {materia.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Grupo *</label>
                  <select
                    className="form-select"
                    value={formData.idgrupo}
                    onChange={(e) => setFormData({ ...formData, idgrupo: e.target.value })}
                    required
                  >
                    <option value="">Selecciona un grupo</option>
                    {grupos.map((grupo) => (
                      <option key={grupo.idgrupo} value={grupo.idgrupo}>
                        {grupo.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Gestión *</label>
                  <select
                    className="form-select"
                    value={formData.idgestion}
                    onChange={(e) => setFormData({ ...formData, idgestion: e.target.value })}
                    required
                  >
                    <option value="">Selecciona una gestión</option>
                    {gestiones.map((gestion) => (
                      <option key={gestion.idgestion} value={gestion.idgestion}>
                        {gestion.anio} - {gestion.periodo}
                      </option>
                    ))}
                  </select>
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
                  Crear
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
                  ¿Estás seguro de eliminar esta asignación?
                </p>
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  {getDocenteNombre(asignacionToDelete?.coddocente)} - {getMateriaNombre(asignacionToDelete?.idcarrera, asignacionToDelete?.sigla)}
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

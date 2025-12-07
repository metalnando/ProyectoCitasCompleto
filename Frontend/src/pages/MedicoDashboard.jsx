import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Alert, Spinner, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import citasService from '../services/citasService';
import { API_BASE_URL } from '../config/api';

const MedicoDashboard = () => {
  const navigate = useNavigate();
  const [medico, setMedico] = useState(null);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedCita, setSelectedCita] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEstadoModal, setShowEstadoModal] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [duracionEstimada, setDuracionEstimada] = useState('');
  const [updatingCita, setUpdatingCita] = useState(false);
  const [filtroMes, setFiltroMes] = useState('todos'); // "todos", "actual", "anteriores", "YYYY-MM"

  useEffect(() => {
    const medicoData = localStorage.getItem('medicoData');
    if (!medicoData) {
      navigate('/medico/login');
      return;
    }
    setMedico(JSON.parse(medicoData));
    cargarCitas(JSON.parse(medicoData)._id);
  }, [navigate]);

  const cargarCitas = async (medicoId) => {
    try {
      const result = await citasService.obtenerCitasPorMedico(medicoId);
      if (result.success) {
        // Ordenar por fecha más reciente primero
        const citasOrdenadas = result.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setCitas(citasOrdenadas);
      } else {
        setError('Error al cargar citas: ' + result.message);
      }
    } catch (err) {
      setError('Error al cargar las citas');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('medicoToken');
    localStorage.removeItem('medicoData');
    localStorage.removeItem('tipoUsuario');
    navigate('/medico/login');
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      pendiente: 'warning',
      confirmada: 'info',
      completada: 'success',
      cancelada: 'danger',
      reprogramada: 'secondary',
    };
    return badges[estado] || 'secondary';
  };

  const getEstadoPagoBadge = (estadoPago, habilitada) => {
    if (estadoPago === 'pagada' && habilitada) {
      return <Badge bg="success">Pagada</Badge>;
    } else if (estadoPago === 'pagada') {
      return <Badge bg="success">Pagada</Badge>;
    } else if (estadoPago === 'vencida') {
      return <Badge bg="danger">Vencida</Badge>;
    } else {
      return <Badge bg="warning">Pendiente</Badge>;
    }
  };

  const handleOpenEstadoModal = (cita) => {
    setSelectedCita(cita);
    setNuevoEstado(cita.estado);
    setDuracionEstimada(cita.duracion || '');
    setShowEstadoModal(true);
  };

  const handleActualizarCita = async () => {
    if (!selectedCita) return;
    setUpdatingCita(true);
    setError('');
    setSuccess('');

    try {
      // Actualizar estado
      if (nuevoEstado !== selectedCita.estado) {
        const resultEstado = await citasService.actualizarEstadoCita(selectedCita._id, nuevoEstado);
        if (!resultEstado.success) {
          setError('Error al actualizar estado: ' + resultEstado.message);
          setUpdatingCita(false);
          return;
        }
      }

      // Actualizar duración si se proporcionó
      if (duracionEstimada && duracionEstimada !== selectedCita.duracion) {
        const resultDuracion = await citasService.actualizarCita(selectedCita._id, {
          duracion: parseInt(duracionEstimada),
        });
        if (!resultDuracion.success) {
          setError('Error al actualizar duración: ' + resultDuracion.message);
          setUpdatingCita(false);
          return;
        }
      }

      setSuccess('Cita actualizada correctamente');
      setShowEstadoModal(false);
      // Recargar citas
      cargarCitas(medico._id);
    } catch (err) {
      setError('Error al actualizar la cita');
    } finally {
      setUpdatingCita(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const citasHoy = citas.filter((cita) => {
    const hoy = new Date().toDateString();
    const citaFecha = new Date(cita.fecha).toDateString();
    return citaFecha === hoy;
  });

  const citasPendientes = citas.filter((cita) => cita.estado === 'pendiente' || cita.estado === 'confirmada');

  const filtrarCitasPorMes = (citasArray) => {
    if (filtroMes === 'todos') {
      return citasArray;
    }

    const ahora = new Date();
    const mesActual = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}`;

    return citasArray.filter((cita) => {
      const fechaCita = cita.fecha; // Formato "YYYY-MM-DD" o Date object
      const fechaStr = typeof fechaCita === 'string' ? fechaCita : new Date(fechaCita).toISOString().split('T')[0];
      const mesCita = fechaStr.substring(0, 7); // "YYYY-MM"

      if (filtroMes === 'actual') {
        return mesCita === mesActual;
      } else if (filtroMes === 'anteriores') {
        return mesCita < mesActual;
      } else {
        // Filtro específico de mes "YYYY-MM"
        return mesCita === filtroMes;
      }
    });
  };

  const obtenerMesesDisponibles = () => {
    const meses = new Set();
    citas.forEach((cita) => {
      const fechaCita = cita.fecha;
      const fechaStr = typeof fechaCita === 'string' ? fechaCita : new Date(fechaCita).toISOString().split('T')[0];
      const mes = fechaStr.substring(0, 7);
      meses.add(mes);
    });
    return Array.from(meses).sort().reverse();
  };

  const citasFiltradas = filtrarCitasPorMes(citas);
  const mesesDisponibles = obtenerMesesDisponibles();

  const handleVerPaciente = (cita) => {
    setSelectedCita(cita);
    setShowModal(true);
  };

  const handleAgregarHistoria = (cita) => {
    navigate(`/medico/historia-clinica/nueva`, { state: { cita } });
  };

  const handleVerHistorial = (pacienteId) => {
    navigate(`/medico/paciente/${pacienteId}/historial`);
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" style={{ color: '#48C9B0' }} />
        <p className="mt-3">Cargando información...</p>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ color: '#48C9B0' }}>
            <i className="bi bi-person-badge me-2"></i>
            Portal del Médico
          </h2>
          {medico && (
            <p className="text-muted mb-0">
              Bienvenido, Dr. {medico.medicoNombre} {medico.medicoApellido}
            </p>
          )}
        </div>
        <Button variant="outline-danger" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-2"></i>
          Cerrar Sesión
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Estadísticas */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h3 style={{ color: '#48C9B0' }}>{citasHoy.length}</h3>
              <p className="mb-0 text-muted">Citas Hoy</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h3 style={{ color: '#f39c12' }}>{citasPendientes.length}</h3>
              <p className="mb-0 text-muted">Citas Pendientes</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h3 style={{ color: '#27ae60' }}>{citas.length}</h3>
              <p className="mb-0 text-muted">Total Citas</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Citas de Hoy */}
      <Card className="shadow-sm mb-4">
        <Card.Header style={{ backgroundColor: '#48C9B0', color: 'white' }}>
          <h5 className="mb-0">
            <i className="bi bi-calendar-day me-2"></i>
            Citas de Hoy
          </h5>
        </Card.Header>
        <Card.Body>
          {citasHoy.length === 0 ? (
            <Alert variant="info">No tienes citas programadas para hoy</Alert>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Duración</th>
                  <th>Paciente</th>
                  <th>Motivo</th>
                  <th>Pago</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {citasHoy.map((cita) => (
                  <tr key={cita._id}>
                    <td>
                      <strong>{cita.hora}</strong>
                    </td>
                    <td>
                      {cita.duracion ? `${cita.duracion} min` : <span className="text-muted">Sin definir</span>}
                    </td>
                    <td>
                      {cita.paciente ? (
                        <>
                          {cita.paciente.pacienteNombre} {cita.paciente.pacienteApellido}
                        </>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td>{cita.motivo}</td>
                    <td>
                      {getEstadoPagoBadge(cita.estadoPago, cita.habilitada)}
                    </td>
                    <td>
                      <Badge bg={getEstadoBadge(cita.estado)}>{cita.estado}</Badge>
                    </td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-1"
                        onClick={() => handleOpenEstadoModal(cita)}
                        title="Cambiar estado/duración"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </Button>
                      <Button
                        variant="info"
                        size="sm"
                        className="me-1"
                        onClick={() => handleVerPaciente(cita)}
                        title="Ver detalles"
                      >
                        <i className="bi bi-eye"></i>
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        className="me-1"
                        onClick={() => handleAgregarHistoria(cita)}
                        title={cita.estado === 'completada' ? 'Cita completada - No se puede modificar' : 'Agregar registro clínico'}
                        disabled={cita.estado === 'completada'}
                      >
                        <i className="bi bi-journal-medical"></i>
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleVerHistorial(cita.paciente?._id)}
                        title="Ver historial"
                      >
                        <i className="bi bi-folder2-open"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Todas las Citas */}
      <Card className="shadow-sm">
        <Card.Header style={{ backgroundColor: '#34495e', color: 'white' }}>
          <h5 className="mb-0">
            <i className="bi bi-list-ul me-2"></i>
            Todas mis Citas
          </h5>
        </Card.Header>
        <Card.Body>
          {/* Filtro por Mes */}
          <Card className="mb-4 border-secondary">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={3}>
                  <h6 className="mb-0" style={{ color: '#48C9B0' }}>
                    <i className="bi bi-funnel me-2"></i>
                    Filtrar por mes:
                  </h6>
                </Col>
                <Col md={9}>
                  <div className="d-flex gap-2 flex-wrap">
                    <Button
                      variant={filtroMes === 'todos' ? 'primary' : 'outline-primary'}
                      size="sm"
                      onClick={() => setFiltroMes('todos')}
                    >
                      Todas
                    </Button>
                    <Button
                      variant={filtroMes === 'actual' ? 'primary' : 'outline-primary'}
                      size="sm"
                      onClick={() => setFiltroMes('actual')}
                    >
                      Mes Actual
                    </Button>
                    <Button
                      variant={filtroMes === 'anteriores' ? 'primary' : 'outline-primary'}
                      size="sm"
                      onClick={() => setFiltroMes('anteriores')}
                    >
                      Meses Anteriores
                    </Button>
                    {mesesDisponibles.length > 0 && (
                      <>
                        <div className="vr"></div>
                        <Form.Select
                          size="sm"
                          style={{ width: 'auto' }}
                          value={filtroMes.includes('-') ? filtroMes : ''}
                          onChange={(e) => setFiltroMes(e.target.value || 'todos')}
                        >
                          <option value="">Seleccionar mes específico...</option>
                          {mesesDisponibles.map((mes) => {
                            const [year, month] = mes.split('-');
                            const fecha = new Date(year, month - 1);
                            const nombreMes = fecha.toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long'
                            });
                            return (
                              <option key={mes} value={mes}>
                                {nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)}
                              </option>
                            );
                          })}
                        </Form.Select>
                      </>
                    )}
                  </div>
                </Col>
              </Row>
              {filtroMes !== 'todos' && (
                <Alert variant="info" className="mt-3 mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  Mostrando {citasFiltradas.length} cita(s) filtrada(s)
                </Alert>
              )}
            </Card.Body>
          </Card>

          <Table responsive hover>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Duración</th>
                <th>Paciente</th>
                <th>Motivo</th>
                <th>Pago</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    {filtroMes === 'todos' ? 'No hay citas registradas' : 'No hay citas en el período seleccionado'}
                  </td>
                </tr>
              ) : (
                citasFiltradas.map((cita) => (
                  <tr key={cita._id}>
                    <td>{formatearFecha(cita.fecha)}</td>
                    <td>{cita.hora}</td>
                    <td>
                      {cita.duracion ? `${cita.duracion} min` : <span className="text-muted">-</span>}
                    </td>
                    <td>
                      {cita.paciente ? (
                        <>
                          {cita.paciente.pacienteNombre} {cita.paciente.pacienteApellido}
                        </>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td>{cita.motivo}</td>
                    <td>
                      {getEstadoPagoBadge(cita.estadoPago, cita.habilitada)}
                    </td>
                    <td>
                      <Badge bg={getEstadoBadge(cita.estado)}>{cita.estado}</Badge>
                    </td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-1"
                        onClick={() => handleOpenEstadoModal(cita)}
                        title="Cambiar estado/duración"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </Button>
                      <Button
                        variant="info"
                        size="sm"
                        className="me-1"
                        onClick={() => handleVerPaciente(cita)}
                        title="Ver detalles"
                      >
                        <i className="bi bi-eye"></i>
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        className="me-1"
                        onClick={() => handleAgregarHistoria(cita)}
                        title={cita.estado === 'completada' ? 'Cita completada - No se puede modificar' : 'Agregar registro clínico'}
                        disabled={cita.estado === 'completada'}
                      >
                        <i className="bi bi-journal-medical"></i>
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleVerHistorial(cita.paciente?._id)}
                        title="Ver historial del paciente"
                      >
                        <i className="bi bi-folder2-open"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal de Detalles de Cita */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton style={{ backgroundColor: '#48C9B0', color: 'white' }}>
          <Modal.Title>Detalles de la Cita</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCita && (
            <div>
              <Row>
                <Col md={6}>
                  <h6>Información del Paciente</h6>
                  <p>
                    <strong>Nombre:</strong> {selectedCita.paciente?.pacienteNombre}{' '}
                    {selectedCita.paciente?.pacienteApellido}
                  </p>
                  <p>
                    <strong>Documento:</strong> {selectedCita.paciente?.pacienteDocumento}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {selectedCita.paciente?.pacienteTelefono}
                  </p>
                  <p>
                    <strong>Edad:</strong> {selectedCita.paciente?.pacienteEdad} años
                  </p>
                </Col>
                <Col md={6}>
                  <h6>Información de la Cita</h6>
                  <p>
                    <strong>Fecha:</strong> {formatearFecha(selectedCita.fecha)}
                  </p>
                  <p>
                    <strong>Hora:</strong> {selectedCita.hora}
                  </p>
                  <p>
                    <strong>Duración estimada:</strong>{' '}
                    {selectedCita.duracion ? `${selectedCita.duracion} minutos` : 'Sin definir'}
                  </p>
                  <p>
                    <strong>Motivo:</strong> {selectedCita.motivo}
                  </p>
                  <p>
                    <strong>Estado:</strong>{' '}
                    <Badge bg={getEstadoBadge(selectedCita.estado)}>{selectedCita.estado}</Badge>
                  </p>
                  <p>
                    <strong>Consultorio:</strong> {selectedCita.consultorio || 'No asignado'}
                  </p>
                </Col>
              </Row>
              {selectedCita.notas && (
                <div className="mt-3">
                  <h6>Notas</h6>
                  <p>{selectedCita.notas}</p>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowModal(false);
              handleVerHistorial(selectedCita?.paciente?._id);
            }}
            disabled={!selectedCita?.paciente?._id}
            title="Ver historial clínico del paciente"
          >
            <i className="bi bi-folder2-open me-2"></i>
            Ver Historial
          </Button>
          <Button
            style={{ backgroundColor: '#48C9B0', border: 'none' }}
            onClick={() => {
              setShowModal(false);
              handleAgregarHistoria(selectedCita);
            }}
            disabled={selectedCita?.estado === 'completada'}
            title={selectedCita?.estado === 'completada' ? 'Cita completada - No se puede modificar' : 'Agregar Registro Clínico'}
          >
            <i className="bi bi-journal-medical me-2"></i>
            {selectedCita?.estado === 'completada' ? 'Cita Completada' : 'Agregar Registro Clínico'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para Cambiar Estado y Duración */}
      <Modal show={showEstadoModal} onHide={() => setShowEstadoModal(false)}>
        <Modal.Header closeButton style={{ backgroundColor: '#f39c12', color: 'white' }}>
          <Modal.Title>
            <i className="bi bi-pencil-square me-2"></i>
            Actualizar Cita
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCita && (
            <>
              <Alert variant="info">
                <strong>Paciente:</strong> {selectedCita.paciente?.pacienteNombre}{' '}
                {selectedCita.paciente?.pacienteApellido}
                <br />
                <strong>Fecha:</strong> {formatearFecha(selectedCita.fecha)} - {selectedCita.hora}
              </Alert>

              <Form.Group className="mb-3">
                <Form.Label>
                  <i className="bi bi-flag me-2"></i>
                  Estado de la Cita
                </Form.Label>
                <Form.Select value={nuevoEstado} onChange={(e) => setNuevoEstado(e.target.value)}>
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                  <option value="reprogramada">Reprogramada</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  <i className="bi bi-clock me-2"></i>
                  Duración Estimada (minutos)
                </Form.Label>
                <Form.Control
                  type="number"
                  value={duracionEstimada}
                  onChange={(e) => setDuracionEstimada(e.target.value)}
                  placeholder="Ej: 30, 45, 60"
                  min="15"
                  max="240"
                />
                <Form.Text className="text-muted">
                  Tiempo estimado de la consulta en minutos (opcional)
                </Form.Text>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEstadoModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="warning"
            onClick={handleActualizarCita}
            disabled={updatingCita}
          >
            {updatingCita ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Actualizando...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-2"></i>
                Guardar Cambios
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MedicoDashboard;

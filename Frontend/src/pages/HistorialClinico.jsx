import { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Alert, Spinner, Badge, Accordion, Image, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import historiaClinicaService from '../services/historiaClinicaService';
import { API_BASE_URL } from '../config/api';

const HistorialClinico = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [historiales, setHistoriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      cargarHistorial();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const cargarHistorial = async () => {
    try {
      console.log('🔍 [DEBUG] Usuario actual:', user);

      if (!user || !user.nombre) {
        setError('No se pudo identificar al usuario. Por favor, vuelve a iniciar sesión.');
        setLoading(false);
        return;
      }

      console.log('📤 [DEBUG] Obteniendo todas las historias clínicas...');

      // Obtener todas las historias clínicas
      const result = await historiaClinicaService.obtenerTodas();

      console.log('📥 [DEBUG] Resultado de obtenerTodas:', result);

      if (result.success) {
        // Filtrar las historias que pertenecen al usuario actual
        // Comparar por nombre del paciente con el nombre del usuario
        const historiasUsuario = (result.data || []).filter((historia) => {
          if (!historia.paciente) {
            console.log('❌ [DEBUG] Historia sin paciente:', historia);
            return false;
          }

          const nombrePaciente = `${historia.paciente.pacienteNombre || ''} ${
            historia.paciente.pacienteApellido || ''
          }`.trim().toLowerCase();
          const nombreUsuario = (user.nombre || '').toLowerCase();

          console.log('🔍 [DEBUG] Comparando:', { nombrePaciente, nombreUsuario });

          return nombrePaciente.includes(nombreUsuario) || nombreUsuario.includes(nombrePaciente);
        });

        console.log('✅ [DEBUG] Historiales filtrados:', historiasUsuario.length);
        setHistoriales(historiasUsuario);
      } else {
        console.error('❌ [DEBUG] Error al cargar:', result.message);
        setError('Error al cargar el historial: ' + result.message);
      }
    } catch (err) {
      console.error('❌ [DEBUG] Error capturado:', err);
      setError('Error al cargar el historial clínico: ' + (err.message || 'Error desconocido'));
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando historial clínico...</p>
      </Container>
    );
  }

  // Si el usuario no está autenticado, mostrar mensaje
  if (!isAuthenticated) {
    return (
      <Container className="my-5">
        <Card className="text-center shadow-sm">
          <Card.Body className="py-5">
            <i className="bi bi-lock-fill text-primary-odont" style={{ fontSize: '4rem' }}></i>
            <h3 className="mt-4 mb-3 text-primary-odont">
              Acceso Restringido
            </h3>
            <p className="text-muted mb-4">
              Debes iniciar sesión para acceder a tu historial clínico.
            </p>
            <div className="d-flex gap-2 justify-content-center">
              <Button
                variant="primary"
                onClick={() => navigate('/login')}
              >
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Iniciar Sesión
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => navigate('/register')}
              >
                <i className="bi bi-person-plus me-2"></i>
                Registrarse
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <div className="mb-4">
        <h2 className="text-primary-odont">
          <i className="bi bi-folder2-open me-2"></i>
          Mi Historial Clínico
        </h2>
        {user && (
          <p className="text-muted">
            <strong>Paciente:</strong> {user.nombre || user.name}
          </p>
        )}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-sm">
        <Card.Header className="card-header-secondary">
          <h5 className="mb-0">
            <i className="bi bi-journal-medical me-2"></i>
            Registros Clínicos ({historiales.length})
          </h5>
        </Card.Header>
        <Card.Body>
          {historiales.length === 0 ? (
            <Alert variant="info">
              <i className="bi bi-info-circle me-2"></i>
              No tienes registros clínicos aún. Estos se crearán después de tus consultas médicas.
            </Alert>
          ) : (
            <Accordion defaultActiveKey="0">
              {historiales.map((historia, index) => (
                <Accordion.Item key={historia._id} eventKey={index.toString()}>
                  <Accordion.Header>
                    <div className="d-flex justify-content-between align-items-center w-100 me-3">
                      <span>
                        <i className="bi bi-calendar3 me-2"></i>
                        {formatearFecha(historia.fechaConsulta)}
                      </span>
                      <Badge bg="info">{historia.diagnostico?.substring(0, 50)}...</Badge>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col md={12}>
                        <h6 className="text-primary-odont">
                          <i className="bi bi-person-badge me-2"></i>
                          Médico Tratante
                        </h6>
                        <p>
                          Dr. {historia.medico?.medicoNombre} {historia.medico?.medicoApellido}
                          {historia.medico?.especialidad && (
                            <Badge bg="secondary" className="ms-2">
                              {historia.medico.especialidad}
                            </Badge>
                          )}
                        </p>
                      </Col>
                    </Row>

                    <hr />

                    <h6 className="text-primary-odont">
                      <i className="bi bi-chat-square-text me-2"></i>
                      Motivo de Consulta
                    </h6>
                    <p>{historia.motivoConsulta}</p>

                    <hr />

                    <h6 className="text-primary-odont">
                      <i className="bi bi-clipboard-pulse me-2"></i>
                      Diagnóstico
                    </h6>
                    <p>{historia.diagnostico}</p>

                    <h6 className="text-primary-odont">
                      <i className="bi bi-bandaid me-2"></i>
                      Procedimiento Realizado
                    </h6>
                    <p>{historia.procedimientoRealizado}</p>

                    {historia.tratamientoIndicado && (
                      <>
                        <h6 className="text-primary-odont">
                          <i className="bi bi-prescription2 me-2"></i>
                          Tratamiento Indicado
                        </h6>
                        <p>{historia.tratamientoIndicado}</p>
                      </>
                    )}

                    {historia.medicamentos && (
                      <>
                        <h6 className="text-primary-odont">
                          <i className="bi bi-capsule me-2"></i>
                          Medicamentos
                        </h6>
                        <p style={{ whiteSpace: 'pre-line' }}>{historia.medicamentos}</p>
                      </>
                    )}

                    {historia.recomendaciones && (
                      <>
                        <h6 className="text-primary-odont">
                          <i className="bi bi-lightbulb me-2"></i>
                          Recomendaciones
                        </h6>
                        <p>{historia.recomendaciones}</p>
                      </>
                    )}

                    {historia.observaciones && (
                      <>
                        <h6 className="text-primary-odont">
                          <i className="bi bi-sticky me-2"></i>
                          Observaciones
                        </h6>
                        <p>{historia.observaciones}</p>
                      </>
                    )}

                    {historia.proximaCita && (
                      <Alert variant="warning">
                        <i className="bi bi-calendar-check me-2"></i>
                        <strong>Próxima Cita:</strong> {formatearFecha(historia.proximaCita)}
                      </Alert>
                    )}

                    {historia.imagenes && historia.imagenes.length > 0 && (
                      <>
                        <hr />
                        <h6 className="text-primary-odont">
                          <i className="bi bi-images me-2"></i>
                          Imágenes y Documentos de la Consulta
                        </h6>
                        <Row>
                          {historia.imagenes.map((img, imgIndex) => (
                            <Col key={imgIndex} xs={6} md={3} className="mb-3">
                              <Card className="shadow-sm">
                                {img.url?.endsWith('.pdf') ? (
                                  <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ height: '150px', backgroundColor: '#f0f0f0' }}
                                  >
                                    <a
                                      href={`${API_BASE_URL}${img.url}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-decoration-none"
                                    >
                                      <div className="text-center">
                                        <i
                                          className="bi bi-file-pdf"
                                          style={{ fontSize: '3rem', color: '#dc3545' }}
                                        ></i>
                                        <p className="mb-0 small text-dark mt-2">Ver PDF</p>
                                      </div>
                                    </a>
                                  </div>
                                ) : (
                                  <a
                                    href={`${API_BASE_URL}${img.url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Image
                                      src={`${API_BASE_URL}${img.url}`}
                                      thumbnail
                                      style={{ height: '150px', objectFit: 'cover', width: '100%' }}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/150?text=Error';
                                      }}
                                    />
                                  </a>
                                )}
                                <Card.Body className="p-2">
                                  <small className="text-muted d-block">
                                    {img.descripcion || 'Documento médico'}
                                  </small>
                                  <small className="text-muted">
                                    {img.fecha ? new Date(img.fecha).toLocaleDateString() : ''}
                                  </small>
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          )}
        </Card.Body>
      </Card>

      <Alert variant="info" className="mt-4">
        <i className="bi bi-info-circle me-2"></i>
        <strong>Nota:</strong> Este historial contiene información confidencial de tus consultas médicas.
        Puedes ver los diagnósticos, tratamientos, medicamentos recetados e imágenes de tus procedimientos.
      </Alert>
    </Container>
  );
};

export default HistorialClinico;

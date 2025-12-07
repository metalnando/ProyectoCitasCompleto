import { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Alert, Spinner, Badge, Accordion, Image, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import historiaClinicaService from '../services/historiaClinicaService';
import { API_BASE_URL } from '../config/api';

const HistorialPaciente = () => {
  const { pacienteId } = useParams();
  const navigate = useNavigate();
  const [historiales, setHistoriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paciente, setPaciente] = useState(null);

  useEffect(() => {
    cargarHistorial();
  }, [pacienteId]);

  const cargarHistorial = async () => {
    try {
      const result = await historiaClinicaService.obtenerPorPaciente(pacienteId);
      if (result.success) {
        setHistoriales(result.data);
        if (result.data.length > 0 && result.data[0].paciente) {
          setPaciente(result.data[0].paciente);
        }
      } else {
        setError('Error al cargar el historial: ' + result.message);
      }
    } catch (err) {
      setError('Error al cargar el historial clínico');
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

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary-odont">
          <i className="bi bi-folder2-open me-2"></i>
          Historial Clínico
        </h2>
        <Button variant="outline-secondary" onClick={() => navigate('/medico/dashboard')}>
          <i className="bi bi-arrow-left me-2"></i>
          Volver al Dashboard
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {paciente && (
        <Card className="mb-4 shadow-sm">
          <Card.Header className="card-header-primary">
            <h5 className="mb-0">Información del Paciente</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <p>
                  <strong>Nombre:</strong> {paciente.pacienteNombre} {paciente.pacienteApellido}
                </p>
                <p>
                  <strong>Documento:</strong> {paciente.pacienteDocumento}
                </p>
                <p>
                  <strong>Edad:</strong> {paciente.pacienteEdad} años
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <strong>Teléfono:</strong> {paciente.pacienteTelefono}
                </p>
                <p>
                  <strong>Dirección:</strong> {paciente.pacienteDireccion}
                </p>
                <p>
                  <strong>Sexo:</strong> {paciente.pacienteSexo}
                </p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      <Card className="shadow-sm">
        <Card.Header className="card-header-secondary">
          <h5 className="mb-0">
            <i className="bi bi-journal-medical me-2"></i>
            Registros Clínicos ({historiales.length})
          </h5>
        </Card.Header>
        <Card.Body>
          {historiales.length === 0 ? (
            <Alert variant="info">No hay registros clínicos para este paciente</Alert>
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
                      <Badge bg="info">{historia.diagnostico.substring(0, 50)}...</Badge>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col md={12}>
                        <h6 className="text-primary-odont">Médico Tratante</h6>
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

                    <h6 className="text-primary-odont">Motivo de Consulta</h6>
                    <p>{historia.motivoConsulta}</p>

                    <hr />

                    <h6 className="text-primary-odont">Diagnóstico</h6>
                    <p>{historia.diagnostico}</p>

                    <h6 className="text-primary-odont">Procedimiento Realizado</h6>
                    <p>{historia.procedimientoRealizado}</p>

                    {historia.tratamientoIndicado && (
                      <>
                        <h6 className="text-primary-odont">Tratamiento Indicado</h6>
                        <p>{historia.tratamientoIndicado}</p>
                      </>
                    )}

                    {historia.medicamentos && (
                      <>
                        <h6 className="text-primary-odont">Medicamentos</h6>
                        <p style={{ whiteSpace: 'pre-line' }}>{historia.medicamentos}</p>
                      </>
                    )}

                    {historia.recomendaciones && (
                      <>
                        <h6 className="text-primary-odont">Recomendaciones</h6>
                        <p>{historia.recomendaciones}</p>
                      </>
                    )}

                    {historia.observaciones && (
                      <>
                        <h6 className="text-primary-odont">Observaciones</h6>
                        <p>{historia.observaciones}</p>
                      </>
                    )}

                    {historia.proximaCita && (
                      <Alert variant="warning">
                        <strong>Próxima Cita:</strong> {formatearFecha(historia.proximaCita)}
                      </Alert>
                    )}

                    {historia.imagenes && historia.imagenes.length > 0 && (
                      <>
                        <hr />
                        <h6 className="text-primary-odont">
                          <i className="bi bi-images me-2"></i>
                          Imágenes y Documentos
                        </h6>
                        <Row>
                          {historia.imagenes.map((img, imgIndex) => (
                            <Col key={imgIndex} xs={6} md={3} className="mb-3">
                              <Card>
                                {img.url.endsWith('.pdf') ? (
                                  <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ height: '150px', backgroundColor: '#f0f0f0' }}
                                  >
                                    <a
                                      href={`${API_BASE_URL}${img.url}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <i
                                        className="bi bi-file-pdf"
                                        style={{ fontSize: '3rem', color: '#dc3545' }}
                                      ></i>
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
                                    />
                                  </a>
                                )}
                                <Card.Body className="p-2">
                                  <small className="text-muted">
                                    {img.descripcion || 'Sin descripción'}
                                  </small>
                                  <br />
                                  <small className="text-muted">
                                    {new Date(img.fecha).toLocaleDateString()}
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
    </Container>
  );
};

export default HistorialPaciente;

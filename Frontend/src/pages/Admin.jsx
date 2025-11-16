import { useState, useEffect } from "react";
import { Container, Card, Row, Col, Spinner, Alert, Table, Modal, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import estadisticasService from "../services/estadisticasService";

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [estadisticas, setEstadisticas] = useState({
    totalUsuarios: 0,
    totalCitas: 0,
    totalMedicos: 0,
    totalTratamientos: 0,
    gananciasTotales: 0,
    citasHoy: 0,
    citasPendientes: 0,
  });
  const [tratamientosPopulares, setTratamientosPopulares] = useState([]);

  // Estados para modales
  const [showUsuariosModal, setShowUsuariosModal] = useState(false);
  const [showCitasModal, setShowCitasModal] = useState(false);
  const [showCitasPendientesModal, setShowCitasPendientesModal] = useState(false);

  // Estados para datos detalles
  const [usuariosDetalle, setUsuariosDetalle] = useState([]);
  const [citasDetalle, setCitasDetalle] = useState([]);
  const [citasPendientesDetalle, setCitasPendientesDetalle] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    setLoading(true);
    const result = await estadisticasService.obtenerEstadisticas();

    if (result.success) {
      setEstadisticas(result.data);
    } else {
      setError(result.message);
    }

    const resultTratamientos = await estadisticasService.obtenerTratamientosMasUsados();
    if (resultTratamientos.success) {
      setTratamientosPopulares(resultTratamientos.data);
    }

    setLoading(false);
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleVerUsuarios = async () => {
    setLoadingModal(true);
    setShowUsuariosModal(true);
    const result = await estadisticasService.obtenerUsuarios();
    if (result.success) {
      setUsuariosDetalle(result.data);
    }
    setLoadingModal(false);
  };

  const handleVerCitas = async () => {
    setLoadingModal(true);
    setShowCitasModal(true);
    const result = await estadisticasService.obtenerCitas();
    if (result.success) {
      setCitasDetalle(result.data);
    }
    setLoadingModal(false);
  };

  const handleVerCitasPendientes = async () => {
    setLoadingModal(true);
    setShowCitasPendientesModal(true);
    const result = await estadisticasService.obtenerCitasPendientes();
    if (result.success) {
      setCitasPendientesDetalle(result.data);
    }
    setLoadingModal(false);
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" style={{ color: "#48C9B0" }} />
        <p className="mt-3">Cargando estadísticas...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h1 className="mb-4 fw-bold" style={{ color: "#48C9B0" }}>
        <i className="bi bi-speedometer2 me-2"></i>
        Dashboard Administrativo
      </h1>
      <p className="text-muted mb-5">
        Panel de control y estadísticas del consultorio odontológico
      </p>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Tarjetas de Estadísticas Principales */}
      <Row className="g-4 mb-5">
        <Col md={3}>
          <Card
            className="shadow-sm h-100 border-0 stat-card"
            onClick={handleVerUsuarios}
            style={{ cursor: "pointer" }}
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Usuarios Registrados</p>
                  <h2 className="fw-bold mb-0" style={{ color: "#48C9B0" }}>
                    {estadisticas.totalUsuarios || 0}
                  </h2>
                  <small className="text-muted">
                    <i className="bi bi-eye me-1"></i>Ver detalles
                  </small>
                </div>
                <i className="bi bi-people-fill" style={{ fontSize: "3rem", color: "#48C9B0", opacity: 0.2 }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card
            className="shadow-sm h-100 border-0 stat-card"
            onClick={handleVerCitas}
            style={{ cursor: "pointer" }}
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Total Citas</p>
                  <h2 className="fw-bold mb-0" style={{ color: "#3498db" }}>
                    {estadisticas.totalCitas || 0}
                  </h2>
                  <small className="text-muted">
                    <i className="bi bi-eye me-1"></i>Ver detalles
                  </small>
                </div>
                <i className="bi bi-calendar-check" style={{ fontSize: "3rem", color: "#3498db", opacity: 0.2 }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm h-100 border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Ganancias Totales</p>
                  <h2 className="fw-bold mb-0" style={{ color: "#27ae60" }}>
                    {formatearPrecio(estadisticas.gananciasTotales || 0)}
                  </h2>
                  <small className="text-muted">Citas completadas</small>
                </div>
                <i className="bi bi-currency-dollar" style={{ fontSize: "3rem", color: "#27ae60", opacity: 0.2 }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card
            className="shadow-sm h-100 border-0 stat-card"
            onClick={handleVerCitasPendientes}
            style={{ cursor: "pointer" }}
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Citas Pendientes</p>
                  <h2 className="fw-bold mb-0" style={{ color: "#e67e22" }}>
                    {estadisticas.citasPendientes || 0}
                  </h2>
                  <small className="text-muted">
                    <i className="bi bi-eye me-1"></i>Ver detalles
                  </small>
                </div>
                <i className="bi bi-clock-history" style={{ fontSize: "3rem", color: "#e67e22", opacity: 0.2 }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tratamientos Más Populares */}
      <Row className="g-4 mb-5">
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Header style={{ backgroundColor: "#48C9B0", color: "white" }}>
              <h5 className="mb-0">
                <i className="bi bi-graph-up me-2"></i>
                Tratamientos Más Solicitados
              </h5>
            </Card.Header>
            <Card.Body>
              {tratamientosPopulares.length === 0 ? (
                <p className="text-muted text-center py-4">No hay datos disponibles</p>
              ) : (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Tratamiento</th>
                      <th className="text-center">Cantidad</th>
                      <th className="text-end">Ingresos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tratamientosPopulares.map((item, index) => (
                      <tr key={index}>
                        <td>{item.nombre}</td>
                        <td className="text-center">
                          <span className="badge bg-primary">{item.cantidad}</span>
                        </td>
                        <td className="text-end text-success fw-bold">
                          {formatearPrecio(item.ingresos)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Header style={{ backgroundColor: "#48C9B0", color: "white" }}>
              <h5 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Resumen del Sistema
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3 pb-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Médicos Registrados</span>
                  <span className="fw-bold" style={{ color: "#48C9B0" }}>
                    {estadisticas.totalMedicos || 0}
                  </span>
                </div>
              </div>
              <div className="mb-3 pb-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Tratamientos Disponibles</span>
                  <span className="fw-bold" style={{ color: "#48C9B0" }}>
                    {estadisticas.totalTratamientos || 0}
                  </span>
                </div>
              </div>
              <div className="mb-3 pb-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Citas Hoy</span>
                  <span className="fw-bold" style={{ color: "#48C9B0" }}>
                    {estadisticas.citasHoy || 0}
                  </span>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Promedio Citas/Día</span>
                  <span className="fw-bold" style={{ color: "#48C9B0" }}>
                    {estadisticas.promedioCitasDia || 0}
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Accesos Rápidos */}
      <h4 className="mb-4 fw-bold" style={{ color: "#48C9B0" }}>
        Accesos Rápidos
      </h4>
      <Row className="g-4">
        <Col md={4}>
          <Link to="/admin/medicos" style={{ textDecoration: "none" }}>
            <Card className="shadow-sm h-100 hover-card border-0" style={{ cursor: "pointer" }}>
              <Card.Body className="text-center p-4">
                <i className="bi bi-person-badge" style={{ fontSize: "3rem", color: "#48C9B0" }}></i>
                <h5 className="mt-3 fw-bold" style={{ color: "#48C9B0" }}>
                  Gestionar Médicos
                </h5>
                <p className="text-muted mb-0">
                  Administrar especialistas
                </p>
              </Card.Body>
            </Card>
          </Link>
        </Col>

        <Col md={4}>
          <Link to="/admin/tratamientos" style={{ textDecoration: "none" }}>
            <Card className="shadow-sm h-100 hover-card border-0" style={{ cursor: "pointer" }}>
              <Card.Body className="text-center p-4">
                <i className="bi bi-heart-pulse" style={{ fontSize: "3rem", color: "#48C9B0" }}></i>
                <h5 className="mt-3 fw-bold" style={{ color: "#48C9B0" }}>
                  Gestionar Tratamientos
                </h5>
                <p className="text-muted mb-0">
                  Administrar procedimientos
                </p>
              </Card.Body>
            </Card>
          </Link>
        </Col>

        <Col md={4}>
          <Link to="/calendario" style={{ textDecoration: "none" }}>
            <Card className="shadow-sm h-100 hover-card border-0" style={{ cursor: "pointer" }}>
              <Card.Body className="text-center p-4">
                <i className="bi bi-calendar3" style={{ fontSize: "3rem", color: "#48C9B0" }}></i>
                <h5 className="mt-3 fw-bold" style={{ color: "#48C9B0" }}>
                  Ver Citas
                </h5>
                <p className="text-muted mb-0">
                  Calendario de citas
                </p>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row>

      {/* Modal de Usuarios */}
      <Modal show={showUsuariosModal} onHide={() => setShowUsuariosModal(false)} size="xl">
        <Modal.Header closeButton style={{ backgroundColor: "#48C9B0", color: "white" }}>
          <Modal.Title>
            <i className="bi bi-people-fill me-2"></i>
            Usuarios Registrados
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingModal ? (
            <div className="text-center py-5">
              <Spinner animation="border" style={{ color: "#48C9B0" }} />
              <p className="mt-3">Cargando usuarios...</p>
            </div>
          ) : (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Documento</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                </tr>
              </thead>
              <tbody>
                {usuariosDetalle.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      No hay usuarios registrados
                    </td>
                  </tr>
                ) : (
                  usuariosDetalle.map((usuario) => (
                    <tr key={usuario.id}>
                      <td>{usuario.nombre}</td>
                      <td>{usuario.email}</td>
                      <td>{usuario.documento || 'N/A'}</td>
                      <td>{usuario.telefono || 'N/A'}</td>
                      <td>
                        {usuario.roles && usuario.roles.includes('admin') ? (
                          <Badge bg="danger">Admin</Badge>
                        ) : (
                          <Badge bg="primary">Usuario</Badge>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUsuariosModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Citas */}
      <Modal show={showCitasModal} onHide={() => setShowCitasModal(false)} size="xl">
        <Modal.Header closeButton style={{ backgroundColor: "#3498db", color: "white" }}>
          <Modal.Title>
            <i className="bi bi-calendar-check me-2"></i>
            Todas las Citas
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingModal ? (
            <div className="text-center py-5">
              <Spinner animation="border" style={{ color: "#3498db" }} />
              <p className="mt-3">Cargando citas...</p>
            </div>
          ) : (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Paciente</th>
                  <th>Médico</th>
                  <th>Tratamiento</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {citasDetalle.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No hay citas registradas
                    </td>
                  </tr>
                ) : (
                  citasDetalle.map((cita) => (
                    <tr key={cita.id}>
                      <td>{formatearFecha(cita.fecha)}</td>
                      <td>{cita.hora}</td>
                      <td>
                        {cita.paciente?.pacienteNombre} {cita.paciente?.pacienteApellido}
                        <br />
                        <small className="text-muted">Doc: {cita.paciente?.pacienteDocumento}</small>
                      </td>
                      <td>
                        {cita.medico?.medicoNombre} {cita.medico?.medicoApellido}
                      </td>
                      <td>
                        {cita.tratamiento?.nombre}
                        <br />
                        <small className="text-success">
                          {cita.tratamiento?.precio ? formatearPrecio(cita.tratamiento.precio) : 'N/A'}
                        </small>
                      </td>
                      <td>
                        {cita.estado === 'completada' && <Badge bg="success">Completada</Badge>}
                        {cita.estado === 'pendiente' && <Badge bg="warning">Pendiente</Badge>}
                        {cita.estado === 'cancelada' && <Badge bg="danger">Cancelada</Badge>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCitasModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Citas Pendientes */}
      <Modal show={showCitasPendientesModal} onHide={() => setShowCitasPendientesModal(false)} size="xl">
        <Modal.Header closeButton style={{ backgroundColor: "#e67e22", color: "white" }}>
          <Modal.Title>
            <i className="bi bi-clock-history me-2"></i>
            Citas Pendientes
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingModal ? (
            <div className="text-center py-5">
              <Spinner animation="border" style={{ color: "#e67e22" }} />
              <p className="mt-3">Cargando citas pendientes...</p>
            </div>
          ) : (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Paciente</th>
                  <th>Médico</th>
                  <th>Tratamiento</th>
                  <th>Motivo</th>
                </tr>
              </thead>
              <tbody>
                {citasPendientesDetalle.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No hay citas pendientes
                    </td>
                  </tr>
                ) : (
                  citasPendientesDetalle.map((cita) => (
                    <tr key={cita.id}>
                      <td>{formatearFecha(cita.fecha)}</td>
                      <td>{cita.hora}</td>
                      <td>
                        {cita.paciente?.pacienteNombre} {cita.paciente?.pacienteApellido}
                        <br />
                        <small className="text-muted">Doc: {cita.paciente?.pacienteDocumento}</small>
                      </td>
                      <td>
                        {cita.medico?.medicoNombre} {cita.medico?.medicoApellido}
                      </td>
                      <td>
                        {cita.tratamiento?.nombre}
                        <br />
                        <small className="text-success">
                          {cita.tratamiento?.precio ? formatearPrecio(cita.tratamiento.precio) : 'N/A'}
                        </small>
                      </td>
                      <td>{cita.motivo || 'N/A'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCitasPendientesModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        .hover-card {
          transition: all 0.3s ease-in-out;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(72, 201, 176, 0.3) !important;
        }
        .stat-card {
          transition: all 0.3s ease-in-out;
        }
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </Container>
  );
};

export default Admin;

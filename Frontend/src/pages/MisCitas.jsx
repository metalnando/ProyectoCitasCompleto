import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Table,
  Badge,
  Spinner,
  Alert,
  Button,
  Modal,
  Form,
  Tabs,
  Tab,
  Row,
  Col,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import citasService from "../services/citasService";

const MisCitas = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [citas, setCitas] = useState([]);
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [comprobantePago, setComprobantePago] = useState("");
  const [procesandoPago, setProcesandoPago] = useState(false);

  useEffect(() => {
    cargarCitas();
  }, [user]);

  const cargarCitas = async () => {
    if (!user) {
      setError("Usuario no autenticado");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Usuario actual:", user);

      // Obtener todas las citas y filtrar por el nombre del usuario
      const resultado = await citasService.obtenerCitas();

      console.log("Resultado de obtener citas:", resultado);

      if (resultado.success) {
        // Filtrar las citas que pertenecen al usuario actual
        // Comparar por nombre del paciente con el nombre del usuario
        const citasUsuario = (resultado.data || []).filter((cita) => {
          if (!cita.paciente) {
            console.log("Cita sin paciente:", cita);
            return false;
          }

          const nombrePaciente = `${cita.paciente.pacienteNombre || ""} ${
            cita.paciente.pacienteApellido || ""
          }`.trim().toLowerCase();
          const nombreUsuario = (user.nombre || "").toLowerCase();

          console.log("Comparando:", { nombrePaciente, nombreUsuario });

          return nombrePaciente.includes(nombreUsuario) || nombreUsuario.includes(nombrePaciente);
        });

        console.log("Citas filtradas:", citasUsuario);
        setCitas(citasUsuario);
      } else {
        console.error("Error en resultado:", resultado);
        setError(resultado.message || "Error al cargar las citas");
      }
    } catch (err) {
      console.error("Error capturado:", err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "N/A";
    return new Date(fecha).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(precio);
  };

  const abrirModalPago = (cita) => {
    setCitaSeleccionada(cita);
    setShowPagoModal(true);
    setMetodoPago("efectivo");
    setComprobantePago("");
  };

  const handlePagar = async (e) => {
    e.preventDefault();
    setProcesandoPago(true);

    try {
      const resultado = await citasService.registrarPago(
        citaSeleccionada._id,
        metodoPago,
        comprobantePago
      );

      if (resultado.success) {
        setShowPagoModal(false);
        cargarCitas(); // Recargar las citas
        alert("Pago registrado exitosamente. Su cita ha sido habilitada.");
      } else {
        setError(resultado.message || "Error al registrar el pago");
      }
    } catch (err) {
      setError("Error al procesar el pago");
    } finally {
      setProcesandoPago(false);
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      pendiente: <Badge bg="warning">Pendiente</Badge>,
      confirmada: <Badge bg="info">Confirmada</Badge>,
      completada: <Badge bg="success">Completada</Badge>,
      cancelada: <Badge bg="danger">Cancelada</Badge>,
      reprogramada: <Badge bg="secondary">Reprogramada</Badge>,
    };
    return badges[estado] || <Badge bg="secondary">{estado}</Badge>;
  };

  const getEstadoPagoBadge = (estadoPago, habilitada) => {
    if (estadoPago === "pagada" && habilitada) {
      return <Badge bg="success">Pagada - Habilitada</Badge>;
    } else if (estadoPago === "pagada") {
      return <Badge bg="success">Pagada</Badge>;
    } else if (estadoPago === "vencida") {
      return <Badge bg="danger">Vencida</Badge>;
    } else {
      return <Badge bg="warning">Pendiente de Pago</Badge>;
    }
  };

  const citasPendientes = citas.filter(
    (cita) => cita.estado === "pendiente" || cita.estado === "confirmada"
  );
  const citasHistorial = citas.filter(
    (cita) => cita.estado === "completada" || cita.estado === "cancelada"
  );

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" style={{ color: "#48C9B0" }} />
        <p className="mt-3">Cargando citas...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h1 className="mb-4 fw-bold" style={{ color: "#48C9B0" }}>
        <i className="bi bi-calendar-check me-2"></i>
        Mis Citas
      </h1>
      <p className="text-muted mb-4">
        Administra tus citas médicas y realiza pagos
      </p>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Tabs defaultActiveKey="pendientes" className="mb-4">
        <Tab eventKey="pendientes" title="Citas Próximas">
          <Card className="shadow-sm border-0">
            <Card.Body>
              {citasPendientes.length === 0 ? (
                <Alert variant="info">
                  <i className="bi bi-info-circle me-2"></i>
                  No tienes citas próximas programadas
                </Alert>
              ) : (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Médico</th>
                      <th>Tratamiento</th>
                      <th>Costo</th>
                      <th>Estado Pago</th>
                      <th>Estado Cita</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {citasPendientes.map((cita) => (
                      <tr key={cita._id}>
                        <td>{formatearFecha(cita.fecha)}</td>
                        <td>{cita.hora}</td>
                        <td>
                          Dr. {cita.medico?.medicoNombre}{" "}
                          {cita.medico?.medicoApellido}
                          <br />
                          <small className="text-muted">
                            {cita.medico?.especialidad}
                          </small>
                        </td>
                        <td>{cita.tratamiento?.nombre || "N/A"}</td>
                        <td className="fw-bold">
                          {formatearPrecio(cita.costo || cita.tratamiento?.precio || 0)}
                        </td>
                        <td>
                          {getEstadoPagoBadge(
                            cita.estadoPago,
                            cita.habilitada
                          )}
                        </td>
                        <td>{getEstadoBadge(cita.estado)}</td>
                        <td>
                          {!cita.habilitada && cita.estadoPago !== "pagada" && (
                            <Button
                              size="sm"
                              style={{
                                backgroundColor: "#48C9B0",
                                border: "none",
                              }}
                              onClick={() => abrirModalPago(cita)}
                            >
                              <i className="bi bi-credit-card me-1"></i>
                              Pagar
                            </Button>
                          )}
                          {cita.habilitada && (
                            <Badge bg="success">
                              <i className="bi bi-check-circle me-1"></i>
                              Activa
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="historial" title="Historial">
          <Card className="shadow-sm border-0">
            <Card.Body>
              {citasHistorial.length === 0 ? (
                <Alert variant="info">
                  <i className="bi bi-info-circle me-2"></i>
                  No tienes historial de citas
                </Alert>
              ) : (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Médico</th>
                      <th>Tratamiento</th>
                      <th>Costo</th>
                      <th>Estado Pago</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {citasHistorial.map((cita) => (
                      <tr key={cita._id}>
                        <td>{formatearFecha(cita.fecha)}</td>
                        <td>{cita.hora}</td>
                        <td>
                          Dr. {cita.medico?.medicoNombre}{" "}
                          {cita.medico?.medicoApellido}
                          <br />
                          <small className="text-muted">
                            {cita.medico?.especialidad}
                          </small>
                        </td>
                        <td>{cita.tratamiento?.nombre || "N/A"}</td>
                        <td className="fw-bold">
                          {formatearPrecio(cita.costo || cita.tratamiento?.precio || 0)}
                        </td>
                        <td>
                          {getEstadoPagoBadge(
                            cita.estadoPago,
                            cita.habilitada
                          )}
                        </td>
                        <td>{getEstadoBadge(cita.estado)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Modal de Pago */}
      <Modal show={showPagoModal} onHide={() => setShowPagoModal(false)}>
        <Modal.Header closeButton style={{ backgroundColor: "#48C9B0", color: "white" }}>
          <Modal.Title>
            <i className="bi bi-credit-card me-2"></i>
            Registrar Pago
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handlePagar}>
          <Modal.Body>
            {citaSeleccionada && (
              <>
                <Row className="mb-3">
                  <Col>
                    <strong>Fecha:</strong> {formatearFecha(citaSeleccionada.fecha)}
                  </Col>
                  <Col>
                    <strong>Hora:</strong> {citaSeleccionada.hora}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <strong>Médico:</strong> Dr. {citaSeleccionada.medico?.medicoNombre}{" "}
                    {citaSeleccionada.medico?.medicoApellido}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <strong>Tratamiento:</strong> {citaSeleccionada.tratamiento?.nombre || "N/A"}
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col>
                    <h4 className="text-success">
                      <strong>Total a pagar:</strong>{" "}
                      {formatearPrecio(citaSeleccionada.costo || citaSeleccionada.tratamiento?.precio || 0)}
                    </h4>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Método de Pago *</Form.Label>
                  <Form.Select
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    required
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                    <option value="transferencia">Transferencia Bancaria</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Número de Comprobante (Opcional)
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: COMP-12345"
                    value={comprobantePago}
                    onChange={(e) => setComprobantePago(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    Ingresa el número de comprobante si realizaste el pago por
                    transferencia o tarjeta
                  </Form.Text>
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPagoModal(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              style={{ backgroundColor: "#48C9B0", border: "none" }}
              disabled={procesandoPago}
            >
              {procesandoPago ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    className="me-2"
                  />
                  Procesando...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Confirmar Pago
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default MisCitas;

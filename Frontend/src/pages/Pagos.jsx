import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Table,
  Badge,
  Alert,
  Spinner,
  Modal,
  Form,
  Tabs,
  Tab,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import citasService from "../services/citasService";

const Pagos = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [citasPendientes, setCitasPendientes] = useState([]);
  const [historialPagos, setHistorialPagos] = useState([]);
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [metodoPago, setMetodoPago] = useState("transferencia");
  const [comprobantePago, setComprobantePago] = useState("");
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [showInfoBancaria, setShowInfoBancaria] = useState(false);

  // Información bancaria de la clínica
  const infoBancaria = {
    banco: "Bancolombia",
    tipoCuenta: "Cuenta de Ahorros",
    numeroCuenta: "123-456789-00",
    titular: "Clínica Bela Sunrise S.A.S",
    nit: "900.123.456-7",
    email: "pagos@belasunrise.com",
  };

  useEffect(() => {
    if (user) {
      cargarCitas();
    }
  }, [user]);

  const cargarCitas = async () => {
    setLoading(true);
    try {
      const resultado = await citasService.obtenerMisCitas();
      if (resultado.success) {
        // Filtrar citas del usuario actual por documento
        const misCitas = resultado.data.filter(
          (cita) => cita.paciente?.pacienteDocumento === user.documento
        );

        // Separar citas pendientes de pago y pagadas
        const pendientes = misCitas.filter(
          (cita) => cita.estadoPago === "pendiente" || cita.estadoPago === "vencida"
        );
        const pagadas = misCitas.filter((cita) => cita.estadoPago === "pagada");
        setCitasPendientes(pendientes);
        setHistorialPagos(pagadas);
      } else {
        setError("Error al cargar las citas");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(valor || 0);
  };

  const getEstadoPagoBadge = (estado) => {
    const badges = {
      pendiente: { bg: "warning", text: "Pendiente" },
      pagada: { bg: "success", text: "Pagada" },
      vencida: { bg: "danger", text: "Vencida" },
    };
    const badge = badges[estado] || badges.pendiente;
    return <Badge bg={badge.bg}>{badge.text}</Badge>;
  };

  const abrirModalPago = (cita) => {
    setCitaSeleccionada(cita);
    setMetodoPago("transferencia");
    setComprobantePago("");
    setShowPagoModal(true);
  };

  const handleProcesarPago = async () => {
    if (!citaSeleccionada) return;

    if (metodoPago === "transferencia" && !comprobantePago.trim()) {
      setError("Por favor ingresa el número de comprobante de transferencia");
      return;
    }

    setProcesandoPago(true);
    setError("");

    try {
      const datoPago = {
        metodoPago: metodoPago,
        comprobantePago:
          metodoPago === "transferencia" ? comprobantePago : `PSE-${Date.now()}`,
        estadoPago: "pagada",
        fechaPago: new Date(),
        habilitada: true,
      };

      const resultado = await citasService.registrarPago(citaSeleccionada._id, datoPago);

      if (resultado.success) {
        setSuccess(
          metodoPago === "pse"
            ? "Pago PSE procesado correctamente. Tu cita ha sido habilitada."
            : "Pago registrado correctamente. Tu cita ha sido habilitada."
        );
        setShowPagoModal(false);
        cargarCitas();
      } else {
        setError(resultado.message || "Error al procesar el pago");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setProcesandoPago(false);
    }
  };

  const calcularTotalPendiente = () => {
    return citasPendientes.reduce((total, cita) => total + (cita.costo || 0), 0);
  };

  const simularPagoPSE = () => {
    // En producción, aquí se integraría con la pasarela PSE real
    // Por ahora simulamos el proceso
    setMetodoPago("pse");
    handleProcesarPago();
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" style={{ color: "#48C9B0" }} />
        <p className="mt-3">Cargando información de pagos...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4 fw-bold" style={{ color: "#2C3E50" }}>
        <i className="bi bi-credit-card me-2"></i>
        Pagos y Facturación
      </h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {/* Resumen de Pagos */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <i
                className="bi bi-clock-history"
                style={{ fontSize: "2rem", color: "#f39c12" }}
              ></i>
              <h3 className="mt-2">{citasPendientes.length}</h3>
              <p className="mb-0 text-muted">Pagos Pendientes</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <i
                className="bi bi-cash-stack"
                style={{ fontSize: "2rem", color: "#e74c3c" }}
              ></i>
              <h3 className="mt-2">{formatearMoneda(calcularTotalPendiente())}</h3>
              <p className="mb-0 text-muted">Total por Pagar</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <i
                className="bi bi-check-circle"
                style={{ fontSize: "2rem", color: "#27ae60" }}
              ></i>
              <h3 className="mt-2">{historialPagos.length}</h3>
              <p className="mb-0 text-muted">Pagos Realizados</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Información Bancaria */}
      <Card className="mb-4 shadow-sm">
        <Card.Header
          style={{ backgroundColor: "#3498db", color: "white", cursor: "pointer" }}
          onClick={() => setShowInfoBancaria(!showInfoBancaria)}
        >
          <h5 className="mb-0">
            <i className="bi bi-bank me-2"></i>
            Información para Transferencia Bancaria
            <i
              className={`bi bi-chevron-${showInfoBancaria ? "up" : "down"} float-end`}
            ></i>
          </h5>
        </Card.Header>
        {showInfoBancaria && (
          <Card.Body>
            <Row>
              <Col md={6}>
                <p>
                  <strong>Banco:</strong> {infoBancaria.banco}
                </p>
                <p>
                  <strong>Tipo de Cuenta:</strong> {infoBancaria.tipoCuenta}
                </p>
                <p>
                  <strong>Número de Cuenta:</strong> {infoBancaria.numeroCuenta}
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <strong>Titular:</strong> {infoBancaria.titular}
                </p>
                <p>
                  <strong>NIT:</strong> {infoBancaria.nit}
                </p>
                <p>
                  <strong>Email para soporte:</strong> {infoBancaria.email}
                </p>
              </Col>
            </Row>
            <Alert variant="info" className="mt-2">
              <i className="bi bi-info-circle me-2"></i>
              Después de realizar la transferencia, registra el número de comprobante en
              el sistema para habilitar tu cita.
            </Alert>
          </Card.Body>
        )}
      </Card>

      <Tabs defaultActiveKey="pendientes" className="mb-4">
        <Tab eventKey="pendientes" title={`Pagos Pendientes (${citasPendientes.length})`}>
          <Card className="shadow-sm">
            <Card.Body>
              {citasPendientes.length === 0 ? (
                <Alert variant="success">
                  <i className="bi bi-check-circle me-2"></i>
                  No tienes pagos pendientes
                </Alert>
              ) : (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Fecha Cita</th>
                      <th>Hora</th>
                      <th>Médico</th>
                      <th>Motivo</th>
                      <th>Costo</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {citasPendientes.map((cita) => (
                      <tr key={cita._id}>
                        <td>{formatearFecha(cita.fecha)}</td>
                        <td>{cita.hora}</td>
                        <td>
                          Dr. {cita.medico?.medicoNombre} {cita.medico?.medicoApellido}
                        </td>
                        <td>{cita.motivo}</td>
                        <td>
                          <strong>{formatearMoneda(cita.costo)}</strong>
                        </td>
                        <td>{getEstadoPagoBadge(cita.estadoPago)}</td>
                        <td>
                          <Button
                            size="sm"
                            style={{ backgroundColor: "#48C9B0", border: "none" }}
                            onClick={() => abrirModalPago(cita)}
                            className="me-1"
                          >
                            <i className="bi bi-credit-card me-1"></i>
                            Pagar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="historial" title={`Historial de Pagos (${historialPagos.length})`}>
          <Card className="shadow-sm">
            <Card.Body>
              {historialPagos.length === 0 ? (
                <Alert variant="info">
                  <i className="bi bi-info-circle me-2"></i>
                  No hay pagos registrados
                </Alert>
              ) : (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Fecha Cita</th>
                      <th>Médico</th>
                      <th>Motivo</th>
                      <th>Costo</th>
                      <th>Método de Pago</th>
                      <th>Fecha de Pago</th>
                      <th>Comprobante</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historialPagos.map((cita) => (
                      <tr key={cita._id}>
                        <td>{formatearFecha(cita.fecha)}</td>
                        <td>
                          Dr. {cita.medico?.medicoNombre} {cita.medico?.medicoApellido}
                        </td>
                        <td>{cita.motivo}</td>
                        <td>
                          <strong>{formatearMoneda(cita.costo)}</strong>
                        </td>
                        <td>
                          <Badge
                            bg={cita.metodoPago === "pse" ? "primary" : "secondary"}
                          >
                            {cita.metodoPago === "pse"
                              ? "PSE"
                              : cita.metodoPago === "transferencia"
                              ? "Transferencia"
                              : cita.metodoPago || "N/A"}
                          </Badge>
                        </td>
                        <td>
                          {cita.fechaPago
                            ? formatearFecha(cita.fechaPago)
                            : "No registrada"}
                        </td>
                        <td>
                          <small>{cita.comprobantePago || "N/A"}</small>
                        </td>
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
      <Modal show={showPagoModal} onHide={() => setShowPagoModal(false)} size="lg">
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#48C9B0", color: "white" }}
        >
          <Modal.Title>
            <i className="bi bi-credit-card me-2"></i>
            Realizar Pago
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {citaSeleccionada && (
            <>
              <Card className="mb-4">
                <Card.Header style={{ backgroundColor: "#f8f9fa" }}>
                  <h6 className="mb-0">Detalle de la Cita</h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p>
                        <strong>Fecha:</strong> {formatearFecha(citaSeleccionada.fecha)}
                      </p>
                      <p>
                        <strong>Hora:</strong> {citaSeleccionada.hora}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p>
                        <strong>Médico:</strong> Dr. {citaSeleccionada.medico?.medicoNombre}{" "}
                        {citaSeleccionada.medico?.medicoApellido}
                      </p>
                      <p>
                        <strong>Motivo:</strong> {citaSeleccionada.motivo}
                      </p>
                    </Col>
                  </Row>
                  <Alert variant="warning" className="mt-2 mb-0">
                    <h5 className="mb-0">
                      <i className="bi bi-cash me-2"></i>
                      Total a Pagar: {formatearMoneda(citaSeleccionada.costo)}
                    </h5>
                  </Alert>
                </Card.Body>
              </Card>

              <h5 className="mb-3">Selecciona el método de pago:</h5>

              <Tabs
                activeKey={metodoPago}
                onSelect={(k) => setMetodoPago(k)}
                className="mb-3"
              >
                <Tab
                  eventKey="transferencia"
                  title={
                    <>
                      <i className="bi bi-bank me-2"></i>Transferencia Bancaria
                    </>
                  }
                >
                  <Card className="border-0">
                    <Card.Body>
                      <Alert variant="info">
                        <h6>Datos para transferencia:</h6>
                        <p className="mb-1">
                          <strong>Banco:</strong> {infoBancaria.banco}
                        </p>
                        <p className="mb-1">
                          <strong>Cuenta:</strong> {infoBancaria.numeroCuenta}
                        </p>
                        <p className="mb-1">
                          <strong>Titular:</strong> {infoBancaria.titular}
                        </p>
                        <p className="mb-0">
                          <strong>NIT:</strong> {infoBancaria.nit}
                        </p>
                      </Alert>

                      <Form.Group className="mt-3">
                        <Form.Label>
                          <strong>Número de Comprobante *</strong>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={comprobantePago}
                          onChange={(e) => setComprobantePago(e.target.value)}
                          placeholder="Ingresa el número de comprobante de tu transferencia"
                          required
                        />
                        <Form.Text className="text-muted">
                          Ingresa el número de comprobante que te generó tu banco
                        </Form.Text>
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </Tab>

                <Tab
                  eventKey="pse"
                  title={
                    <>
                      <i className="bi bi-shield-check me-2"></i>Pago PSE
                    </>
                  }
                >
                  <Card className="border-0">
                    <Card.Body className="text-center">
                      <img
                        src="/pse-logo.png"
                        alt="PSE"
                        style={{ maxWidth: "150px", marginBottom: "20px" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      <h5>Pago Seguro en Línea</h5>
                      <p className="text-muted">
                        Serás redirigido a la plataforma segura de PSE para completar tu
                        pago directamente desde tu cuenta bancaria.
                      </p>

                      <Alert variant="success">
                        <i className="bi bi-shield-lock me-2"></i>
                        Transacción 100% segura y encriptada
                      </Alert>

                      <div className="mt-3">
                        <small className="text-muted">
                          Al hacer clic en "Pagar con PSE" serás redirigido al portal de
                          tu banco para autorizar el pago.
                        </small>
                      </div>
                    </Card.Body>
                  </Card>
                </Tab>
              </Tabs>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPagoModal(false)}>
            Cancelar
          </Button>
          {metodoPago === "transferencia" ? (
            <Button
              style={{ backgroundColor: "#48C9B0", border: "none" }}
              onClick={handleProcesarPago}
              disabled={procesandoPago || !comprobantePago.trim()}
            >
              {procesandoPago ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Procesando...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Confirmar Pago
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={simularPagoPSE}
              disabled={procesandoPago}
            >
              {procesandoPago ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Conectando con PSE...
                </>
              ) : (
                <>
                  <i className="bi bi-shield-check me-2"></i>
                  Pagar con PSE
                </>
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Pagos;

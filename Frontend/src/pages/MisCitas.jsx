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
  Accordion,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import citasService from "../services/citasService";
import historiaClinicaService from "../services/historiaClinicaService";
import CalendarioCitas from "../components/CalendarioCitas";

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
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [historiaClinica, setHistoriaClinica] = useState(null);
  const [loadingHistoria, setLoadingHistoria] = useState(false);
  const [showReprogramarModal, setShowReprogramarModal] = useState(false);
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [nuevaHora, setNuevaHora] = useState("");
  const [horasOcupadas, setHorasOcupadas] = useState([]);
  const [loadingHoras, setLoadingHoras] = useState(false);
  const [procesandoReprogramacion, setProcesandoReprogramacion] = useState(false);
  const [filtroMes, setFiltroMes] = useState("todos"); // "todos", "actual", "anteriores", "YYYY-MM"

  useEffect(() => {
    cargarCitas();
  }, [user]);

  const marcarCitasVencidas = async (citasArray) => {
    const ahora = new Date();
    const citasActualizadas = [];

    for (const cita of citasArray) {
      // Solo procesar citas pendientes o confirmadas
      if (cita.estado !== "pendiente" && cita.estado !== "confirmada") {
        citasActualizadas.push(cita);
        continue;
      }

      // Combinar fecha y hora para crear objeto Date
      const [year, month, day] = cita.fecha.split('-').map(Number);
      const [hours, minutes] = cita.hora.split(':').map(Number);
      const fechaCita = new Date(year, month - 1, day, hours, minutes);

      // Si la cita ya pasó, marcarla como cancelada
      if (fechaCita < ahora) {
        try {
          const resultado = await citasService.actualizarCita(cita._id, {
            estado: "cancelada"
          });

          if (resultado.success) {
            citasActualizadas.push({ ...cita, estado: "cancelada" });
          } else {
            citasActualizadas.push(cita);
          }
        } catch (err) {
          console.error(`Error al marcar cita ${cita._id} como cancelada:`, err);
          citasActualizadas.push(cita);
        }
      } else {
        citasActualizadas.push(cita);
      }
    }

    return citasActualizadas;
  };

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

        // Marcar citas vencidas como canceladas
        const citasActualizadas = await marcarCitasVencidas(citasUsuario);
        setCitas(citasActualizadas);
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

  // Función para filtrar citas por mes
  const filtrarCitasPorMes = (citasArray) => {
    if (filtroMes === "todos") {
      return citasArray;
    }

    const ahora = new Date();
    const mesActual = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}`;

    return citasArray.filter((cita) => {
      const fechaCita = cita.fecha; // Formato "YYYY-MM-DD"
      const mesCita = fechaCita.substring(0, 7); // "YYYY-MM"

      if (filtroMes === "actual") {
        return mesCita === mesActual;
      } else if (filtroMes === "anteriores") {
        return mesCita < mesActual;
      } else {
        // Filtro específico de mes "YYYY-MM"
        return mesCita === filtroMes;
      }
    });
  };

  // Obtener lista de meses únicos de las citas
  const obtenerMesesDisponibles = () => {
    const mesesSet = new Set();
    citas.forEach((cita) => {
      const mesCita = cita.fecha.substring(0, 7); // "YYYY-MM"
      mesesSet.add(mesCita);
    });
    return Array.from(mesesSet).sort().reverse(); // Más reciente primero
  };

  const mesesDisponibles = obtenerMesesDisponibles();

  // Aplicar filtro de mes
  const citasFiltradas = filtrarCitasPorMes(citas);

  const citasPendientes = citasFiltradas.filter(
    (cita) => cita.estado === "pendiente" || cita.estado === "confirmada"
  );
  const citasHistorial = citasFiltradas.filter(
    (cita) => cita.estado === "completada" || cita.estado === "cancelada"
  );

  const abrirDetallesCita = async (cita) => {
    setCitaSeleccionada(cita);
    setShowDetalleModal(true);
    setHistoriaClinica(null);

    // Cargar historia clínica asociada a la cita
    if (cita.estado === "completada") {
      setLoadingHistoria(true);
      try {
        const resultado = await historiaClinicaService.obtenerPorCita(cita._id);
        if (resultado.success && resultado.data) {
          setHistoriaClinica(resultado.data);
        }
      } catch (err) {
        console.error("Error al cargar historia clínica:", err);
      } finally {
        setLoadingHistoria(false);
      }
    }
  };

  const abrirModalReprogramar = (cita) => {
    setCitaSeleccionada(cita);
    setNuevaFecha("");
    setNuevaHora("");
    setHorasOcupadas([]);
    setShowReprogramarModal(true);
  };

  const handleFechaHoraSelect = async (selectedDate, selectedHour) => {
    setNuevaFecha(selectedDate);
    setNuevaHora(selectedHour || "");

    // Cargar horas ocupadas cuando se selecciona una fecha
    if (selectedDate && citaSeleccionada?.medico?._id) {
      setLoadingHoras(true);
      try {
        const resultado = await citasService.obtenerHorasOcupadas(
          citaSeleccionada.medico._id,
          selectedDate
        );
        if (resultado.success) {
          setHorasOcupadas(resultado.data);
        }
      } catch (err) {
        console.error("Error al cargar horas ocupadas:", err);
      } finally {
        setLoadingHoras(false);
      }
    }
  };

  const handleReprogramar = async () => {
    if (!nuevaFecha || !nuevaHora) {
      setError("Debes seleccionar una nueva fecha y hora");
      return;
    }

    setProcesandoReprogramacion(true);
    try {
      const resultado = await citasService.actualizarCita(citaSeleccionada._id, {
        fecha: nuevaFecha,
        hora: nuevaHora,
        estado: "pendiente",
      });

      if (resultado.success) {
        setShowReprogramarModal(false);
        cargarCitas();
        alert("Cita reprogramada exitosamente");
      } else {
        setError(resultado.message || "Error al reprogramar la cita");
      }
    } catch (err) {
      setError("Error al reprogramar la cita");
    } finally {
      setProcesandoReprogramacion(false);
    }
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" className="text-primary" />
        <p className="mt-3">Cargando citas...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h1 className="mb-4 fw-bold text-primary-odont">
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

      {/* Filtro por Mes */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={3}>
              <h6 className="mb-0 text-primary-odont">
                <i className="bi bi-funnel me-2"></i>
                Filtrar por mes:
              </h6>
            </Col>
            <Col md={9}>
              <div className="d-flex gap-2 flex-wrap">
                <Button
                  variant={filtroMes === "todos" ? "primary" : "outline-primary"}
                  size="sm"
                  onClick={() => setFiltroMes("todos")}
                >
                  Todas
                </Button>
                <Button
                  variant={filtroMes === "actual" ? "primary" : "outline-primary"}
                  size="sm"
                  onClick={() => setFiltroMes("actual")}
                >
                  Mes Actual
                </Button>
                <Button
                  variant={filtroMes === "anteriores" ? "primary" : "outline-primary"}
                  size="sm"
                  onClick={() => setFiltroMes("anteriores")}
                >
                  Meses Anteriores
                </Button>
                {mesesDisponibles.length > 0 && (
                  <>
                    <div className="vr"></div>
                    <Form.Select
                      size="sm"
                      style={{ width: "auto" }}
                      value={filtroMes.includes("-") ? filtroMes : ""}
                      onChange={(e) => setFiltroMes(e.target.value || "todos")}
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
          {filtroMes !== "todos" && (
            <Alert variant="info" className="mt-3 mb-0">
              <i className="bi bi-info-circle me-2"></i>
              Mostrando {citasFiltradas.length} cita(s) filtrada(s)
            </Alert>
          )}
        </Card.Body>
      </Card>

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
                          <Button
                            size="sm"
                            variant="info"
                            className="me-1"
                            onClick={() => abrirDetallesCita(cita)}
                            title="Ver detalles"
                          >
                            <i className="bi bi-eye"></i>
                          </Button>
                          <Button
                            size="sm"
                            variant="warning"
                            className="me-1"
                            onClick={() => abrirModalReprogramar(cita)}
                            title="Reprogramar cita"
                          >
                            <i className="bi bi-calendar-event"></i>
                          </Button>
                          {!cita.habilitada && cita.estadoPago !== "pagada" && (
                            <Button
                              variant="primary"
                              size="sm"
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
                      <th>Motivo</th>
                      <th>Estado Pago</th>
                      <th>Estado</th>
                      <th>Acciones</th>
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
                        <td>{cita.motivo}</td>
                        <td>
                          {getEstadoPagoBadge(
                            cita.estadoPago,
                            cita.habilitada
                          )}
                        </td>
                        <td>{getEstadoBadge(cita.estado)}</td>
                        <td>
                          <Button
                            size="sm"
                            variant="info"
                            className="me-1"
                            onClick={() => abrirDetallesCita(cita)}
                            title="Ver detalles y resumen médico"
                          >
                            <i className="bi bi-eye me-1"></i>
                            Ver Detalles
                          </Button>
                          {cita.estado === "cancelada" && (
                            <Button
                              size="sm"
                              variant="warning"
                              onClick={() => abrirModalReprogramar(cita)}
                              title="Reagendar cita cancelada"
                            >
                              <i className="bi bi-calendar-plus me-1"></i>
                              Reagendar
                            </Button>
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
      </Tabs>

      {/* Modal de Pago */}
      <Modal show={showPagoModal} onHide={() => setShowPagoModal(false)}>
        <Modal.Header closeButton className="modal-header-primary">
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
              variant="primary"
              type="submit"
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

      {/* Modal de Detalles de Cita */}
      <Modal show={showDetalleModal} onHide={() => setShowDetalleModal(false)} size="lg">
        <Modal.Header closeButton className="modal-header-primary">
          <Modal.Title>
            <i className="bi bi-file-medical me-2"></i>
            Detalles de la Cita
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {citaSeleccionada && (
            <>
              <Card className="mb-3">
                <Card.Header style={{ backgroundColor: "#f8f9fa" }}>
                  <h6 className="mb-0">
                    <i className="bi bi-calendar-event me-2"></i>
                    Información de la Cita
                  </h6>
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
                      <p>
                        <strong>Duración:</strong>{" "}
                        {citaSeleccionada.duracion
                          ? `${citaSeleccionada.duracion} minutos`
                          : "No especificada"}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p>
                        <strong>Médico:</strong> Dr. {citaSeleccionada.medico?.medicoNombre}{" "}
                        {citaSeleccionada.medico?.medicoApellido}
                      </p>
                      <p>
                        <strong>Especialidad:</strong>{" "}
                        {citaSeleccionada.medico?.especialidad || "General"}
                      </p>
                      <p>
                        <strong>Estado:</strong> {getEstadoBadge(citaSeleccionada.estado)}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <p>
                        <strong>Motivo de consulta:</strong> {citaSeleccionada.motivo}
                      </p>
                      {citaSeleccionada.notas && (
                        <p>
                          <strong>Notas:</strong> {citaSeleccionada.notas}
                        </p>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Historia Clínica */}
              {citaSeleccionada.estado === "completada" && (
                <Card>
                  <Card.Header style={{ backgroundColor: "#e8f5e9" }}>
                    <h6 className="mb-0">
                      <i className="bi bi-journal-medical me-2"></i>
                      Resumen Médico
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    {loadingHistoria ? (
                      <div className="text-center py-3">
                        <Spinner animation="border" size="sm" className="text-primary" />
                        <p className="mt-2 mb-0">Cargando historial médico...</p>
                      </div>
                    ) : historiaClinica ? (
                      <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>
                            <i className="bi bi-clipboard2-pulse me-2"></i>
                            Diagnóstico y Procedimiento
                          </Accordion.Header>
                          <Accordion.Body>
                            <p>
                              <strong>Diagnóstico:</strong>
                            </p>
                            <p className="ps-3">{historiaClinica.diagnostico}</p>

                            <p>
                              <strong>Procedimiento Realizado:</strong>
                            </p>
                            <p className="ps-3">{historiaClinica.procedimientoRealizado}</p>
                          </Accordion.Body>
                        </Accordion.Item>

                        {historiaClinica.tratamientoIndicado && (
                          <Accordion.Item eventKey="1">
                            <Accordion.Header>
                              <i className="bi bi-prescription2 me-2"></i>
                              Tratamiento y Medicamentos
                            </Accordion.Header>
                            <Accordion.Body>
                              <p>
                                <strong>Tratamiento Indicado:</strong>
                              </p>
                              <p className="ps-3">{historiaClinica.tratamientoIndicado}</p>

                              {historiaClinica.medicamentos && (
                                <>
                                  <p>
                                    <strong>Medicamentos:</strong>
                                  </p>
                                  <p className="ps-3" style={{ whiteSpace: "pre-line" }}>
                                    {historiaClinica.medicamentos}
                                  </p>
                                </>
                              )}
                            </Accordion.Body>
                          </Accordion.Item>
                        )}

                        {historiaClinica.recomendaciones && (
                          <Accordion.Item eventKey="2">
                            <Accordion.Header>
                              <i className="bi bi-info-circle me-2"></i>
                              Recomendaciones
                            </Accordion.Header>
                            <Accordion.Body>
                              <p>{historiaClinica.recomendaciones}</p>
                            </Accordion.Body>
                          </Accordion.Item>
                        )}

                        {historiaClinica.observaciones && (
                          <Accordion.Item eventKey="3">
                            <Accordion.Header>
                              <i className="bi bi-chat-left-text me-2"></i>
                              Observaciones
                            </Accordion.Header>
                            <Accordion.Body>
                              <p>{historiaClinica.observaciones}</p>
                            </Accordion.Body>
                          </Accordion.Item>
                        )}

                        {historiaClinica.proximaCita && (
                          <Alert variant="warning" className="mt-3">
                            <i className="bi bi-calendar-plus me-2"></i>
                            <strong>Próxima Cita Recomendada:</strong>{" "}
                            {formatearFecha(historiaClinica.proximaCita)}
                          </Alert>
                        )}
                      </Accordion>
                    ) : (
                      <Alert variant="info">
                        <i className="bi bi-info-circle me-2"></i>
                        No hay resumen médico disponible para esta cita
                      </Alert>
                    )}
                  </Card.Body>
                </Card>
              )}

              {citaSeleccionada.estado === "cancelada" && (
                <Alert variant="danger">
                  <i className="bi bi-x-circle me-2"></i>
                  Esta cita fue cancelada y no tiene registro médico asociado
                </Alert>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetalleModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Reprogramar Cita */}
      <Modal
        show={showReprogramarModal}
        onHide={() => setShowReprogramarModal(false)}
        size="xl"
      >
        <Modal.Header closeButton style={{ backgroundColor: "#ffc107", color: "#000" }}>
          <Modal.Title>
            <i className="bi bi-calendar-event me-2"></i>
            Reprogramar Cita
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {citaSeleccionada && (
            <>
              <Alert variant="info" className="mb-4">
                <h6 className="mb-2">
                  <i className="bi bi-info-circle me-2"></i>
                  Cita Actual:
                </h6>
                <Row>
                  <Col md={4}>
                    <strong>Fecha:</strong> {formatearFecha(citaSeleccionada.fecha)}
                  </Col>
                  <Col md={4}>
                    <strong>Hora:</strong> {citaSeleccionada.hora}
                  </Col>
                  <Col md={4}>
                    <strong>Médico:</strong> Dr. {citaSeleccionada.medico?.medicoNombre}{" "}
                    {citaSeleccionada.medico?.medicoApellido}
                  </Col>
                </Row>
              </Alert>

              <h5 className="mb-3">
                <i className="bi bi-calendar-plus me-2"></i>
                Selecciona Nueva Fecha y Hora
              </h5>

              <CalendarioCitas
                onSelectDateTime={handleFechaHoraSelect}
                selectedDate={nuevaFecha}
                selectedHour={nuevaHora}
                horasOcupadas={horasOcupadas}
                loadingHoras={loadingHoras}
              />

              {nuevaFecha && nuevaHora && (
                <Alert variant="success" className="mt-3">
                  <h6 className="mb-0">
                    <i className="bi bi-check-circle me-2"></i>
                    Nueva cita seleccionada: {(() => {
                      const [year, month, day] = nuevaFecha.split('-').map(Number);
                      const date = new Date(year, month - 1, day);
                      return date.toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      });
                    })()} a las {nuevaHora}
                  </h6>
                </Alert>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReprogramarModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="warning"
            onClick={handleReprogramar}
            disabled={!nuevaFecha || !nuevaHora || procesandoReprogramacion}
          >
            {procesandoReprogramacion ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  className="me-2"
                />
                Reprogramando...
              </>
            ) : (
              <>
                <i className="bi bi-calendar-check me-2"></i>
                Confirmar Reprogramación
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MisCitas;

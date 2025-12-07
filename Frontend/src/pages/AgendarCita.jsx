import { useState, useEffect } from "react";
import { Container, Form, Button, Card, Alert, Spinner, Row, Col, Badge } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import citasService from "../services/citasService";
import medicosService from "../services/medicosService";
import tratamientosService from "../services/tratamientosService";
import CalendarioCitas from "../components/CalendarioCitas";

const AgendarCita = () => {
  const [medicos, setMedicos] = useState([]);
  const [tratamientos, setTratamientos] = useState([]);
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState("");
  const [medicoId, setMedicoId] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [tratamientoId, setTratamientoId] = useState("");
  const [motivo, setMotivo] = useState("");
  const [notas, setNotas] = useState("");
  const [horasOcupadas, setHorasOcupadas] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMedicos, setLoadingMedicos] = useState(true);
  const [loadingTratamientos, setLoadingTratamientos] = useState(true);
  const [costoEstimado, setCostoEstimado] = useState(0);
  const [loadingHoras, setLoadingHoras] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Obtener especialidades únicas de los médicos
  const especialidades = [...new Set(medicos.map(m => m.especialidad))].filter(Boolean).sort();

  // Filtrar médicos por especialidad seleccionada
  const medicosFiltrados = especialidadSeleccionada
    ? medicos.filter(m => m.especialidad === especialidadSeleccionada)
    : medicos;

  // Cargar médicos y tratamientos al montar el componente
  useEffect(() => {
    cargarMedicos();
    cargarTratamientos();
  }, []);

  // Cargar preselección desde tratamientos
  useEffect(() => {
    if (!loadingMedicos && !loadingTratamientos && medicos.length > 0 && tratamientos.length > 0) {
      const preseleccionado = sessionStorage.getItem('tratamientoPreseleccionado');
      if (preseleccionado) {
        try {
          const { tratamientoId: preselTratamientoId, medicoId: preselMedicoId } = JSON.parse(preseleccionado);

          // Preseleccionar tratamiento
          if (preselTratamientoId) {
            const tratamiento = tratamientos.find(t => t._id === preselTratamientoId);
            if (tratamiento) {
              setTratamientoId(preselTratamientoId);
              setMotivo(tratamiento.nombre);
              setCostoEstimado(tratamiento.precio || 0);
            }
          }

          // Preseleccionar médico
          if (preselMedicoId) {
            const medico = medicos.find(m => m._id === preselMedicoId);
            if (medico) {
              setEspecialidadSeleccionada(medico.especialidad);
              setMedicoId(preselMedicoId);
            }
          }

          // Limpiar sessionStorage
          sessionStorage.removeItem('tratamientoPreseleccionado');
        } catch (error) {
          console.error('Error al cargar preselección:', error);
          sessionStorage.removeItem('tratamientoPreseleccionado');
        }
      }
    }
  }, [loadingMedicos, loadingTratamientos, medicos, tratamientos]);

  const cargarMedicos = async () => {
    setLoadingMedicos(true);
    const result = await medicosService.obtenerMedicos();

    console.log('Resultado de cargar médicos:', result);

    if (result.success) {
      console.log('Médicos cargados:', result.data);
      setMedicos(result.data);
      if (result.data.length === 0) {
        setErrorMessage("No hay médicos registrados en el sistema. Por favor, contacta al administrador.");
      }
    } else {
      setErrorMessage("Error al cargar los médicos: " + result.message);
    }
    setLoadingMedicos(false);
  };

  const cargarTratamientos = async () => {
    setLoadingTratamientos(true);
    const result = await tratamientosService.obtenerTratamientos();

    if (result.success) {
      // Filtrar solo tratamientos activos
      const tratamientosActivos = result.data.filter(t => t.estado !== false);
      setTratamientos(tratamientosActivos);
    } else {
      console.error("Error al cargar tratamientos:", result.message);
    }
    setLoadingTratamientos(false);
  };

  // Cargar horas ocupadas cuando cambia la fecha o el médico
  useEffect(() => {
    if (medicoId && fecha) {
      cargarHorasOcupadas();
    } else {
      setHorasOcupadas([]);
    }
  }, [medicoId, fecha]);

  const cargarHorasOcupadas = async () => {
    if (!medicoId || !fecha) return;

    setLoadingHoras(true);
    console.log('Cargando horas ocupadas para médico:', medicoId, 'fecha:', fecha);

    const result = await citasService.obtenerHorasOcupadas(medicoId, fecha);
    console.log('Horas ocupadas resultado:', result);

    if (result.success) {
      setHorasOcupadas(result.data);
      console.log('Horas ocupadas establecidas:', result.data);
    } else {
      console.error('Error al cargar horas ocupadas:', result.message);
      setHorasOcupadas([]);
    }
    setLoadingHoras(false);
  };

  const handleDateTimeSelect = (selectedDate, selectedHour) => {
    setFecha(selectedDate);
    setHora(selectedHour);
  };

  const handleEspecialidadChange = (e) => {
    const nuevaEspecialidad = e.target.value;
    setEspecialidadSeleccionada(nuevaEspecialidad);
    // Resetear médico seleccionado cuando cambia la especialidad
    setMedicoId("");
    setFecha("");
    setHora("");
  };

  const handleMedicoChange = (e) => {
    setMedicoId(e.target.value);
    // Resetear fecha y hora cuando cambia el médico
    setFecha("");
    setHora("");
  };

  const handleTratamientoChange = (e) => {
    const selectedId = e.target.value;
    setTratamientoId(selectedId);

    if (selectedId) {
      const tratamiento = tratamientos.find(t => t._id === selectedId);
      if (tratamiento) {
        setMotivo(tratamiento.nombre);
        setCostoEstimado(tratamiento.precio || 0);
      }
    } else {
      setMotivo("");
      setCostoEstimado(0);
    }
  };

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(valor || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!isAuthenticated) {
      setErrorMessage("Debes iniciar sesión para agendar una cita");
      return;
    }

    if (!medicoId || !fecha || !hora || !motivo) {
      setErrorMessage("Por favor, completa todos los campos requeridos.");
      return;
    }

    setLoading(true);

    try {
      // Verificar que el usuario tenga documento
      if (!user.documento) {
        setErrorMessage("Tu perfil no tiene un documento registrado. Por favor actualiza tu perfil primero.");
        setLoading(false);
        return;
      }

      // Crear objeto de cita según el backend
      const citaData = {
        pacienteDocumento: user.documento,
        medico: medicoId,
        fecha: fecha,
        hora: hora,
        motivo: motivo,
        notas: notas,
        tratamiento: tratamientoId || undefined,
        costo: costoEstimado
      };

      const result = await citasService.crearCita(citaData);

      if (result.success) {
        setSuccessMessage("¡Tu cita ha sido agendada con éxito! Recuerda realizar el pago para confirmar tu cita.");
        // Limpiar formulario
        setEspecialidadSeleccionada("");
        setMedicoId("");
        setFecha("");
        setHora("");
        setTratamientoId("");
        setMotivo("");
        setNotas("");
        setCostoEstimado(0);
      } else {
        setErrorMessage(result.message || "Error al agendar la cita");
      }
    } catch (error) {
      setErrorMessage("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5" style={{ maxWidth: "1000px" }}>
      <h2 className="text-center mb-4 fw-bold text-primary-odont">
        Agendar Nueva Cita
      </h2>

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      {/* Selector de Especialidad */}
      <Card className="shadow-lg mb-4">
        <Card.Header className="card-header-primary">
          <h5 className="mb-0">
            <i className="bi bi-hospital me-2"></i>
            Selecciona una Especialidad
          </h5>
        </Card.Header>
        <Card.Body>
          <Form.Group controlId="especialidad">
            <Form.Select
              value={especialidadSeleccionada}
              onChange={handleEspecialidadChange}
              disabled={loadingMedicos}
              size="lg"
            >
              <option value="">
                {loadingMedicos ? "Cargando especialidades..." : "Todas las especialidades"}
              </option>
              {especialidades.map((especialidad) => (
                <option key={especialidad} value={especialidad}>
                  {especialidad}
                </option>
              ))}
            </Form.Select>
            {especialidadSeleccionada && (
              <div className="mt-2">
                <Badge bg="info" className="me-2">
                  <i className="bi bi-funnel me-1"></i>
                  Filtrando por: {especialidadSeleccionada}
                </Badge>
                <Badge bg="secondary">
                  {medicosFiltrados.length} médico(s) disponible(s)
                </Badge>
              </div>
            )}
          </Form.Group>
        </Card.Body>
      </Card>

      {/* Selector de Médico */}
      <Card className="shadow-lg mb-4">
        <Card.Header className="card-header-primary">
          <h5 className="mb-0">
            <i className="bi bi-person-badge me-2"></i>
            Selecciona un Médico
          </h5>
        </Card.Header>
        <Card.Body>
          <Form.Group controlId="medico">
            <Form.Select
              value={medicoId}
              onChange={handleMedicoChange}
              disabled={loadingMedicos || medicosFiltrados.length === 0}
              required
              size="lg"
            >
              <option value="">
                {loadingMedicos
                  ? "Cargando médicos..."
                  : medicosFiltrados.length === 0
                    ? "No hay médicos disponibles"
                    : "Selecciona un médico"}
              </option>
              {medicosFiltrados.map((medico) => (
                <option key={medico._id} value={medico._id}>
                  Dr. {medico.medicoNombre} {medico.medicoApellido} - {medico.especialidad}
                </option>
              ))}
            </Form.Select>
            {medicoId && (
              <div className="mt-2">
                <Alert variant="light" className="py-2 border">
                  <small>
                    <i className="bi bi-info-circle me-1"></i>
                    Has seleccionado al <strong>Dr. {medicosFiltrados.find(m => m._id === medicoId)?.medicoNombre} {medicosFiltrados.find(m => m._id === medicoId)?.medicoApellido}</strong>
                  </small>
                </Alert>
              </div>
            )}
          </Form.Group>
        </Card.Body>
      </Card>

      {/* Calendario de Citas */}
      {medicoId && (
        <CalendarioCitas
          onSelectDateTime={handleDateTimeSelect}
          selectedDate={fecha}
          selectedHour={hora}
          horasOcupadas={horasOcupadas}
          loadingHoras={loadingHoras}
        />
      )}

      {/* Detalles de la Cita */}
      {medicoId && fecha && hora && (
        <Card className="shadow-lg">
          <Card.Header className="card-header-primary">
            <h5 className="mb-0">
              <i className="bi bi-card-text me-2"></i>
              Detalles de la Cita
            </h5>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="tratamiento">
                <Form.Label>
                  <i className="bi bi-clipboard2-pulse me-2"></i>
                  Tipo de Tratamiento / Servicio *
                </Form.Label>
                <Form.Select
                  value={tratamientoId}
                  onChange={handleTratamientoChange}
                  disabled={loadingTratamientos}
                  size="lg"
                >
                  <option value="">
                    {loadingTratamientos ? "Cargando servicios..." : "Selecciona un servicio"}
                  </option>
                  {tratamientos.map((tratamiento) => (
                    <option key={tratamiento._id} value={tratamiento._id}>
                      {tratamiento.nombre} - {formatearMoneda(tratamiento.precio)}
                    </option>
                  ))}
                </Form.Select>
                {tratamientoId && (
                  <div className="mt-2">
                    {tratamientos.find(t => t._id === tratamientoId)?.descripcion && (
                      <Alert variant="info" className="py-2">
                        <small>
                          <i className="bi bi-info-circle me-1"></i>
                          {tratamientos.find(t => t._id === tratamientoId)?.descripcion}
                        </small>
                      </Alert>
                    )}
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="motivo">
                <Form.Label>Motivo de la Consulta *</Form.Label>
                <Form.Control
                  type="text"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Se completará automáticamente al seleccionar un servicio"
                  required
                />
                <Form.Text className="text-muted">
                  Puedes modificar el motivo si necesitas agregar detalles adicionales
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4" controlId="notes">
                <Form.Label>Notas Adicionales (Opcional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Ej: Tengo sensibilidad en los dientes, alergia a algún medicamento, etc."
                />
              </Form.Group>

              {/* Resumen de costo */}
              {costoEstimado > 0 && (
                <Alert variant="warning" className="mb-4">
                  <Row className="align-items-center">
                    <Col>
                      <h5 className="mb-0">
                        <i className="bi bi-cash-stack me-2"></i>
                        Costo Estimado:
                      </h5>
                    </Col>
                    <Col className="text-end">
                      <h4 className="mb-0">
                        <Badge bg="success" className="fs-5">
                          {formatearMoneda(costoEstimado)}
                        </Badge>
                      </h4>
                    </Col>
                  </Row>
                  <small className="text-muted d-block mt-2">
                    * El pago debe realizarse antes de la cita para confirmarla
                  </small>
                </Alert>
              )}

              <Button
                variant="primary"
                type="submit"
                className="w-100"
                size="lg"
                disabled={loading || loadingMedicos || !isAuthenticated}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Agendando...
                  </>
                ) : !isAuthenticated ? (
                  "Inicia sesión para agendar"
                ) : (
                  <>
                    <i className="bi bi-calendar-check me-2"></i>
                    Confirmar Cita
                  </>
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* Mensaje si no ha seleccionado médico */}
      {!medicoId && (
        <Card className="shadow text-center py-5 border-primary">
          <Card.Body>
            <i className="bi bi-calendar-plus text-primary" style={{ fontSize: "3rem" }}></i>
            <h4 className="mt-3 mb-2 text-primary-odont">
              {!especialidadSeleccionada
                ? "Comienza seleccionando una especialidad"
                : "Ahora selecciona un médico"}
            </h4>
            <p className="text-muted">
              {!especialidadSeleccionada
                ? "Filtra por especialidad para encontrar el médico adecuado"
                : `Elige un médico de ${especialidadSeleccionada} para ver las fechas y horas disponibles`}
            </p>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default AgendarCita;

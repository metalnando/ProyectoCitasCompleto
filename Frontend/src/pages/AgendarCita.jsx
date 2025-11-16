import { useState, useEffect } from "react";
import { Container, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import citasService from "../services/citasService";
import medicosService from "../services/medicosService";
import CalendarioCitas from "../components/CalendarioCitas";

const AgendarCita = () => {
  const [medicos, setMedicos] = useState([]);
  const [medicoId, setMedicoId] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");
  const [notas, setNotas] = useState("");
  const [horasOcupadas, setHorasOcupadas] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMedicos, setLoadingMedicos] = useState(true);
  const { user, isAuthenticated } = useAuth();

  // Cargar médicos al montar el componente
  useEffect(() => {
    cargarMedicos();
  }, []);

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

    const result = await citasService.obtenerHorasOcupadas(medicoId, fecha);
    if (result.success) {
      setHorasOcupadas(result.data);
    }
  };

  const handleDateTimeSelect = (selectedDate, selectedHour) => {
    setFecha(selectedDate);
    setHora(selectedHour);
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
        notas: notas
      };

      const result = await citasService.crearCita(citaData);

      if (result.success) {
        setSuccessMessage("¡Tu cita ha sido agendada con éxito!");
        // Limpiar formulario
        setMedicoId("");
        setFecha("");
        setHora("");
        setMotivo("");
        setNotas("");
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

      {/* Selector de Médico */}
      <Card className="shadow-lg mb-4">
        <Card.Header style={{ backgroundColor: "#48C9B0" }} className="text-white">
          <h5 className="mb-0">
            <i className="bi bi-person-badge me-2"></i>
            Selecciona un Médico
          </h5>
        </Card.Header>
        <Card.Body>
          <Form.Group controlId="medico">
            <Form.Select
              value={medicoId}
              onChange={(e) => setMedicoId(e.target.value)}
              disabled={loadingMedicos}
              required
              size="lg"
            >
              <option value="">
                {loadingMedicos ? "Cargando médicos..." : "Selecciona un médico"}
              </option>
              {medicos.map((medico) => (
                <option key={medico._id} value={medico._id}>
                  Dr. {medico.medicoNombre} {medico.medicoApellido} - {medico.especialidad}
                </option>
              ))}
            </Form.Select>
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
        />
      )}

      {/* Detalles de la Cita */}
      {medicoId && fecha && hora && (
        <Card className="shadow-lg">
          <Card.Header style={{ backgroundColor: "#48C9B0" }} className="text-white">
            <h5 className="mb-0">
              <i className="bi bi-card-text me-2"></i>
              Detalles de la Cita
            </h5>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="motivo">
                <Form.Label>Motivo de la Consulta *</Form.Label>
                <Form.Control
                  type="text"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Ej: Dolor de muela, Revisión general, Limpieza dental"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="notes">
                <Form.Label>Notas Adicionales (Opcional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Ej: Necesito un chequeo de rutina y limpieza. Tengo sensibilidad en los dientes."
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100"
                size="lg"
                style={{ backgroundColor: "#48C9B0", border: "none" }}
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
        <Card className="shadow text-center py-5" style={{ borderColor: "#48C9B0" }}>
          <Card.Body>
            <i className="bi bi-calendar-plus" style={{ fontSize: "3rem", color: "#48C9B0" }}></i>
            <h4 className="mt-3 mb-2" style={{ color: "#48C9B0" }}>
              Comienza seleccionando un médico
            </h4>
            <p className="text-muted">
              Elige un médico de la lista para ver las fechas y horas disponibles
            </p>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default AgendarCita;

import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  ListGroup,
  Spinner,
  Button,
  Alert,
  Badge,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import citasService from "../services/citasService";

const HistorialClinico = () => {
  const { user } = useAuth();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReprogramModal, setShowReprogramModal] = useState(false);
  const [selectedCita, setSelectedCita] = useState(null);
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [nuevaHora, setNuevaHora] = useState("");

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    setLoading(true);
    setError("");

    try {
      // Obtener todas las citas del usuario
      const result = await citasService.obtenerCitas();

      if (result.success) {
        setCitas(result.data);
      } else {
        setError(result.message || "Error al cargar el historial");
      }
    } catch (error) {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleReprogramar = (cita) => {
    setSelectedCita(cita);
    setNuevaFecha(cita.fecha ? cita.fecha.split('T')[0] : "");
    setNuevaHora(cita.hora || "");
    setShowReprogramModal(true);
  };

  const confirmarReprogramacion = async () => {
    if (!selectedCita || !nuevaFecha || !nuevaHora) {
      setError("Por favor, completa la fecha y hora");
      return;
    }

    try {
      const result = await citasService.actualizarCita(selectedCita._id, {
        fecha: nuevaFecha,
        hora: nuevaHora,
        estado: "reprogramada"
      });

      if (result.success) {
        setShowReprogramModal(false);
        cargarHistorial();
        setError("");
      } else {
        setError(result.message || "Error al reprogramar la cita");
      }
    } catch (error) {
      setError("Error al conectar con el servidor");
    }
  };

  const handleCancelar = async (citaId) => {
    if (window.confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
      try {
        const result = await citasService.actualizarEstadoCita(citaId, "cancelada");

        if (result.success) {
          cargarHistorial();
        } else {
          setError(result.message || "Error al cancelar la cita");
        }
      } catch (error) {
        setError("Error al conectar con el servidor");
      }
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      pendiente: "warning",
      confirmada: "info",
      completada: "success",
      cancelada: "danger",
      reprogramada: "secondary"
    };
    return badges[estado] || "secondary";
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "No especificada";
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }; 

  return (
    <>
      <Container style={{ maxWidth: 900, marginTop: 40, marginBottom: 60 }}>
        <h2 className="mb-4 text-center fw-bold text-primary-odont">
          Mi Historial Clínico
        </h2>

        <Card className="shadow-lg mb-4">
          <Card.Header
            className="text-white fw-bold"
            style={{ backgroundColor: "#48C9B0" }}
          >
            Información del Paciente
          </Card.Header>
          <Card.Body>
            <Card.Title className="text-primary-odont mb-3">
              {user?.name || "Usuario"}
            </Card.Title>
            <Card.Text>
              <strong>Email:</strong> {user?.email || "No disponible"}
            </Card.Text>
          </Card.Body>
        </Card>

        <Card className="shadow-lg">
          <Card.Header
            className="fw-bold bg-light-green-odont"
          >
            Historial de Citas
          </Card.Header>

          {loading && (
            <Card.Body>
              <div className="text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Cargando historial...</span>
                </Spinner>
                <p className="mt-2">Cargando historial...</p>
              </div>
            </Card.Body>
          )}

          {error && (
            <Card.Body>
              <Alert variant="danger">{error}</Alert>
            </Card.Body>
          )}

          {!loading && !error && (
            <ListGroup variant="flush">
              {citas && citas.length > 0 ? (
                citas.map((cita, idx) => (
                  <ListGroup.Item key={idx}>
                    <Row className="align-items-center">
                      <Col md={8}>
                        <div className="mb-2">
                          <strong>Fecha:</strong> {formatearFecha(cita.fecha)} a las {cita.hora}
                        </div>
                        <div className="mb-2">
                          <strong>Motivo:</strong> {cita.motivo}
                        </div>
                        {cita.notas && (
                          <div className="mb-2">
                            <strong>Notas:</strong> {cita.notas}
                          </div>
                        )}
                        <div>
                          <strong>Estado:</strong>{" "}
                          <Badge bg={getEstadoBadge(cita.estado)}>
                            {cita.estado?.charAt(0).toUpperCase() + cita.estado?.slice(1) || "Pendiente"}
                          </Badge>
                        </div>
                      </Col>
                      <Col md={4} className="text-end">
                        {cita.estado !== "completada" && cita.estado !== "cancelada" && (
                          <>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2 mb-2"
                              onClick={() => handleReprogramar(cita)}
                            >
                              Reprogramar
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="mb-2"
                              onClick={() => handleCancelar(cita._id)}
                            >
                              Cancelar
                            </Button>
                          </>
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item className="text-center text-muted py-4">
                  No hay citas registradas. ¡Agenda tu primera cita!
                </ListGroup.Item>
              )}
            </ListGroup>
          )}
        </Card>
      </Container>

      {/* Modal para reprogramar cita */}
      <Modal show={showReprogramModal} onHide={() => setShowReprogramModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reprogramar Cita</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCita && (
            <>
              <p><strong>Cita actual:</strong> {formatearFecha(selectedCita.fecha)} a las {selectedCita.hora}</p>
              <p><strong>Motivo:</strong> {selectedCita.motivo}</p>
              <hr />
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Nueva Fecha</Form.Label>
                  <Form.Control
                    type="date"
                    value={nuevaFecha}
                    onChange={(e) => setNuevaFecha(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Nueva Hora</Form.Label>
                  <Form.Control
                    type="time"
                    value={nuevaHora}
                    onChange={(e) => setNuevaHora(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReprogramModal(false)}>
            Cancelar
          </Button>
          <Button
            style={{ backgroundColor: "#48C9B0", border: "none" }}
            onClick={confirmarReprogramacion}
          >
            Confirmar Reprogramación
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HistorialClinico;
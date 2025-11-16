import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Alert, Form } from "react-bootstrap";
import medicosService from "../services/medicosService";
import { API_BASE_URL } from "../config/api";

const Especialistas = () => {
  const [specialists, setSpecialists] = useState([]);
  const [filteredSpecialists, setFilteredSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("Todas");
  const [uniqueSpecialties, setUniqueSpecialties] = useState(["Todas"]);

  useEffect(() => {
    const cargarEspecialistas = async () => {
      try {
        const result = await medicosService.obtenerMedicos();
        if (result.success) {
          setSpecialists(result.data);
          setFilteredSpecialists(result.data);
          // Obtener especialidades únicas
          const specialties = ["Todas", ...new Set(result.data.map(m => m.especialidad || "General"))];
          setUniqueSpecialties(specialties);
        } else {
          setError("Error al cargar los especialistas: " + result.message);
        }
      } catch (err) {
        setError("Error al cargar los especialistas.");
      } finally {
        setLoading(false);
      }
    };

    cargarEspecialistas();
  }, []);

  useEffect(() => {
    let currentFiltered = specialists;

    // Filtrar por especialidad
    if (selectedSpecialty !== "Todas") {
      currentFiltered = currentFiltered.filter(s => s.especialidad === selectedSpecialty);
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentFiltered = currentFiltered.filter(s =>
        s.medicoNombre.toLowerCase().includes(lowerCaseSearchTerm) ||
        s.medicoApellido.toLowerCase().includes(lowerCaseSearchTerm) ||
        (s.especialidad && s.especialidad.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    setFilteredSpecialists(currentFiltered);
  }, [searchTerm, selectedSpecialty, specialists]);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status" style={{ color: "#48C9B0" }}>
          <span className="visually-hidden">Cargando especialistas...</span>
        </Spinner>
        <p className="mt-3">Cargando especialistas...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h1 className="text-center mb-5 fw-bold" style={{ color: "#48C9B0" }}>
        Nuestros Especialistas
      </h1>

      <Row className="mb-4">
        <Col md={6} className="mb-3 mb-md-0">
          <Form.Group controlId="searchSpecialist">
            <Form.Control
              type="text"
              placeholder="Buscar por nombre o especialidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="filterSpecialty">
            <Form.Select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              {uniqueSpecialties.map((s, index) => (
                <option key={index} value={s}>{s}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredSpecialists.length > 0 ? (
          filteredSpecialists.map((specialist) => (
            <Col key={specialist._id}>
              <Card className="h-100 shadow-sm specialist-card">
                {specialist.imagen ? (
                  <Card.Img
                    variant="top"
                    src={`${API_BASE_URL}${specialist.imagen}`}
                    alt={`Dr. ${specialist.medicoNombre} ${specialist.medicoApellido}`}
                    className="rounded-circle mx-auto mt-3"
                    style={{ width: "120px", height: "120px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="rounded-circle mx-auto mt-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "120px",
                      height: "120px",
                      backgroundColor: "#48C9B0",
                      color: "white",
                      fontSize: "2.5rem",
                      fontWeight: "bold",
                    }}
                  >
                    {specialist.medicoNombre?.charAt(0)}
                    {specialist.medicoApellido?.charAt(0)}
                  </div>
                )}
                <Card.Body className="text-center">
                  <Card.Title className="mb-2 fs-5">
                    Dr. {specialist.medicoNombre} {specialist.medicoApellido}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {specialist.especialidad || "General"}
                  </Card.Subtitle>
                  <Card.Text>
                    <p className="mb-1">
                      <strong>Teléfono:</strong> {specialist.medicoTelefono}
                    </p>
                    <p className="mb-0">
                      <strong>Email:</strong> {specialist.medicoEmail}
                    </p>
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="text-center" style={{ backgroundColor: "#e8f8f5" }}>
                  <small className="text-muted">¡Reserva tu cita con este especialista!</small>
                </Card.Footer>
              </Card>
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <Alert variant="info" className="text-center">
              No se encontraron especialistas que coincidan con los criterios de búsqueda.
            </Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Especialistas;

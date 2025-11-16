import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Button,
  Modal,
  Form,
  Alert,
  Spinner,
  Badge,
  Row,
  Col,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import tratamientosService from "../services/tratamientosService";

const Tratamientos = () => {
  const { user, isAuthenticated } = useAuth();
  const [tratamientos, setTratamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTratamiento, setCurrentTratamiento] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    duracion: "",
    imagen: "",
    estado: "activo"
  });

  useEffect(() => {
    cargarTratamientos();
  }, []);

  const cargarTratamientos = async () => {
    setLoading(true);
    setError("");

    const result = await tratamientosService.obtenerTratamientos();

    if (result.success) {
      setTratamientos(result.data);
    } else {
      setError(result.message || "Error al cargar los tratamientos");
    }

    setLoading(false);
  };

  const handleShowModal = (tratamiento = null) => {
    if (tratamiento) {
      setIsEditing(true);
      setCurrentTratamiento(tratamiento);
      setFormData({
        nombre: tratamiento.nombre,
        descripcion: tratamiento.descripcion,
        precio: tratamiento.precio.toString(),
        duracion: tratamiento.duracion.toString(),
        imagen: tratamiento.imagen || "",
        estado: tratamiento.estado || "activo"
      });
    } else {
      setIsEditing(false);
      setCurrentTratamiento(null);
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        duracion: "",
        imagen: "",
        estado: "activo"
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentTratamiento(null);
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      duracion: "",
      imagen: "",
      estado: "activo"
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const tratamientoData = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: parseFloat(formData.precio),
      duracion: parseInt(formData.duracion),
      imagen: formData.imagen || undefined,
      estado: formData.estado
    };

    let result;
    if (isEditing && currentTratamiento) {
      result = await tratamientosService.actualizarTratamiento(
        currentTratamiento._id,
        tratamientoData
      );
    } else {
      result = await tratamientosService.crearTratamiento(tratamientoData);
    }

    if (result.success) {
      setSuccessMessage(
        isEditing
          ? "Tratamiento actualizado exitosamente"
          : "Tratamiento creado exitosamente"
      );
      handleCloseModal();
      cargarTratamientos();

      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      setError(result.message || "Error al guardar el tratamiento");
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este tratamiento?")) {
      const result = await tratamientosService.eliminarTratamiento(id);

      if (result.success) {
        setSuccessMessage("Tratamiento eliminado exitosamente");
        cargarTratamientos();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(result.message || "Error al eliminar el tratamiento");
      }
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    const result = await tratamientosService.cambiarEstadoTratamiento(id, nuevoEstado);

    if (result.success) {
      setSuccessMessage("Estado actualizado exitosamente");
      cargarTratamientos();
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      setError(result.message || "Error al cambiar el estado");
    }
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary-odont">
          Tratamientos y Servicios
        </h2>
        {isAuthenticated && user?.role === 'admin' && (
          <Button
            style={{ backgroundColor: "#48C9B0", border: "none" }}
            onClick={() => handleShowModal()}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Nuevo Tratamiento
          </Button>
        )}
      </div>

      {successMessage && (
        <Alert variant="success" dismissible onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" style={{ color: "#48C9B0" }}>
            <span className="visually-hidden">Cargando tratamientos...</span>
          </Spinner>
          <p className="mt-2">Cargando tratamientos...</p>
        </div>
      ) : tratamientos.length === 0 ? (
        <Card className="shadow-lg">
          <Card.Body>
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox" style={{ fontSize: "3rem" }}></i>
              <p className="mt-3">No hay tratamientos registrados</p>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {tratamientos.map((tratamiento) => (
            <Col key={tratamiento._id} xs={12} md={6} lg={4}>
              <Card className="h-100 shadow-sm hover-shadow" style={{ transition: "all 0.3s" }}>
                {tratamiento.imagen && (
                  <Card.Img
                    variant="top"
                    src={tratamiento.imagen}
                    alt={tratamiento.nombre}
                    style={{ height: "200px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x200?text=Sin+Imagen";
                    }}
                  />
                )}
                {!tratamiento.imagen && (
                  <div
                    style={{
                      height: "200px",
                      backgroundColor: "#48C9B0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white"
                    }}
                  >
                    <i className="bi bi-clipboard2-pulse" style={{ fontSize: "4rem" }}></i>
                  </div>
                )}
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="fw-bold" style={{ color: "#48C9B0" }}>
                      {tratamiento.nombre}
                    </Card.Title>
                    <Badge bg={tratamiento.estado === 'activo' ? 'success' : 'secondary'}>
                      {tratamiento.estado === 'activo' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  <Card.Text className="text-muted flex-grow-1">
                    {tratamiento.descripcion}
                  </Card.Text>
                  <div className="mt-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">
                        <i className="bi bi-clock me-1"></i>
                        {tratamiento.duracion} min
                      </span>
                      <span className="fw-bold text-success" style={{ fontSize: "1.2rem" }}>
                        {formatearPrecio(tratamiento.precio)}
                      </span>
                    </div>
                    {isAuthenticated && (user?.roles?.includes('admin') || user?.role === 'admin') && (
                      <div className="d-flex gap-2 mt-3">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="flex-grow-1"
                          onClick={() => handleShowModal(tratamiento)}
                        >
                          <i className="bi bi-pencil me-1"></i>
                          Editar
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleEliminar(tratamiento._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal para crear/editar tratamiento */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? 'Editar Tratamiento' : 'Nuevo Tratamiento'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del Tratamiento *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Limpieza Dental"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Descripción *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Describe el tratamiento o servicio"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>URL de la Imagen</Form.Label>
              <Form.Control
                type="url"
                name="imagen"
                value={formData.imagen}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen-tratamiento.jpg"
              />
              <Form.Text className="text-muted">
                URL de la imagen del tratamiento (opcional)
              </Form.Text>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio (COP) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    placeholder="Ej: 50000"
                    min="0"
                    step="1000"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duración (minutos) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="duracion"
                    value={formData.duracion}
                    onChange={handleChange}
                    placeholder="Ej: 30"
                    min="5"
                    step="5"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button
                type="submit"
                style={{ backgroundColor: "#48C9B0", border: "none" }}
              >
                {isEditing ? 'Actualizar' : 'Crear'} Tratamiento
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Tratamientos;

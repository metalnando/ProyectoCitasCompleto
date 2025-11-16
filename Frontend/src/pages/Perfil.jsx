import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import usuariosService from "../services/usuariosService";

const Perfil = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    documento: "",
    telefono: "",
    direccion: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Cargar datos del perfil al montar el componente
  useEffect(() => {
    cargarPerfil();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarPerfil = async () => {
    setLoading(true);
    const resultado = await usuariosService.obtenerPerfil();
    if (resultado.success) {
      setFormData({
        nombre: resultado.data.nombre || "",
        email: resultado.data.email || "",
        documento: resultado.data.documento || "",
        telefono: resultado.data.telefono || "",
        direccion: resultado.data.direccion || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      setError(resultado.message);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validaciones
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      // Preparar datos para enviar
      const updateData = {
        nombre: formData.nombre,
        email: formData.email,
        documento: formData.documento,
        telefono: formData.telefono,
        direccion: formData.direccion,
      };

      // Solo incluir contraseñas si se están cambiando
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const resultado = await usuariosService.actualizarPerfil(updateData);

      if (resultado.success) {
        setSuccess("Perfil actualizado exitosamente");
        setIsEditing(false);

        // Actualizar contexto de usuario si existe la función
        if (updateUser) {
          updateUser(resultado.data);
        }

        // Limpiar campos de contraseña
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(resultado.message || "Error al actualizar el perfil");
      }
    } catch (error) {
      setError("Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    cargarPerfil(); // Recargar datos originales
    setError("");
  };

  return (
    <Container className="my-5" style={{ maxWidth: "800px" }}>
      <h2 className="text-center mb-4 fw-bold text-primary-odont">
        Mi Perfil
      </h2>

      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-lg">
        <Card.Header style={{ backgroundColor: "#48C9B0" }} className="text-white fw-bold">
          <i className="bi bi-person-circle me-2"></i>
          Información Personal
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre Completo</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Documento de Identidad
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="documento"
                    value={formData.documento}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Ej: 1234567890"
                    required
                  />
                  <Form.Text className="text-muted">
                    {!formData.documento && (
                      <span className="text-warning">
                        ⚠️ Necesitas un documento para agendar citas
                      </span>
                    )}
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Ej: 3001234567"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Tu dirección"
                  />
                </Form.Group>
              </Col>
            </Row>

            {isEditing && (
              <>
                <hr className="my-4" />
                <h5 className="mb-3">Cambiar Contraseña (Opcional)</h5>

                <Form.Group className="mb-3">
                  <Form.Label>Contraseña Actual</Form.Label>
                  <Form.Control
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Ingresa tu contraseña actual"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nueva Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Mínimo 6 caracteres"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirma la nueva contraseña"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}

            <div className="d-flex justify-content-end gap-2 mt-4">
              {!isEditing ? (
                <Button
                  variant="primary"
                  onClick={() => setIsEditing(true)}
                  style={{ backgroundColor: "#48C9B0", border: "none" }}
                >
                  <i className="bi bi-pencil-square me-2"></i>
                  Editar Perfil
                </Button>
              ) : (
                <>
                  <Button variant="secondary" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    style={{ backgroundColor: "#48C9B0", border: "none" }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          className="me-2"
                        />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Guardar Cambios
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Card className="shadow-lg mt-4">
        <Card.Header style={{ backgroundColor: "#48C9B0" }} className="text-white fw-bold">
          <i className="bi bi-info-circle me-2"></i>
          Información de la Cuenta
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p className="mb-2">
                <strong>Rol:</strong> {user?.role || 'Usuario'}
              </p>
            </Col>
            <Col md={6}>
              <p className="mb-2">
                <strong>ID de Usuario:</strong> {user?.id || 'N/A'}
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <p className="mb-0 text-muted">
                <i className="bi bi-shield-check me-2"></i>
                Tu información está protegida y segura
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Perfil;

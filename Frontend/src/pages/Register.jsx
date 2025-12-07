import React, { useState } from "react";
import { Container, Form, Button, Card, Alert, Spinner, Row, Col } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    documento: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    fechaNacimiento: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.name || !formData.documento || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone || !formData.address) {
      setError("Por favor, completa todos los campos obligatorios");
      return false;
    }

    if (formData.documento.length < 6) {
      setError("La cédula debe tener al menos 6 caracteres");
      return false;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Por favor, ingresa un correo electrónico válido");
      return false;
    }

    if (formData.phone.length < 7) {
      setError("Por favor, ingresa un número de teléfono válido");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        nombre: formData.name,
        documento: formData.documento,
        email: formData.email,
        password: formData.password,
        telefono: formData.phone,
        direccion: formData.address,
        roles: ["user"]
      };

      // Agregar fecha de nacimiento si se proporcionó
      if (formData.fechaNacimiento) {
        userData.fechaNacimiento = formData.fechaNacimiento;
      }

      const result = await register(userData);

      if (result.success) {
        // Redirigir al home después del registro exitoso
        navigate("/");
      } else {
        setError(result.message || "Error al registrar usuario");
      }
    } catch (error) {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5" style={{ maxWidth: "600px" }}>
      <Card className="shadow-lg p-4">
        <Card.Body>
          <h2 className="text-center mb-4 fw-bold text-primary-odont">
            Crear Cuenta
          </h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Nombre Completo *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ingresa tu nombre completo"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="documento">
              <Form.Label>Cédula / Documento de Identidad *</Form.Label>
              <Form.Control
                type="text"
                name="documento"
                value={formData.documento}
                onChange={handleChange}
                placeholder="Ingresa tu número de cédula"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="fechaNacimiento">
              <Form.Label>Fecha de Nacimiento</Form.Label>
              <Form.Control
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
              />
              <Form.Text className="text-muted">
                Opcional - Ayuda a calcular tu edad para el historial médico
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Correo Electrónico *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                required
              />
            </Form.Group>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="password">
                <Form.Label>Contraseña *</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </Form.Group>

              <Form.Group as={Col} controlId="confirmPassword">
                <Form.Label>Confirmar Contraseña *</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirma tu contraseña"
                  required
                />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Teléfono *</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ej: 3001234567"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="address">
              <Form.Label>Dirección *</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Ingresa tu dirección completa"
                required
              />
            </Form.Group>

            <Button
              className="w-100 mb-3"
              variant="primary"
              type="submit"
              disabled={loading}
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
                  Registrando...
                </>
              ) : (
                "Crear Cuenta"
              )}
            </Button>

            <div className="text-center">
              <p className="mb-0">
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" className="text-primary-odont" style={{ textDecoration: "none" }}>
                  Inicia Sesión
                </Link>
              </p>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;

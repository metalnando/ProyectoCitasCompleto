import React, { useState } from "react";
import { Container, Form, Button, Card, Alert, Spinner, ButtonGroup, ToggleButton } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("paciente"); // paciente o medico
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (userType === "paciente") {
        // Login como paciente/usuario
        const result = await login(email, password);

        if (result.success) {
          // Verificar si el usuario es administrador
          const user = result.data.user;
          const isAdmin = user?.roles?.includes('admin') || user?.role === 'admin';

          if (isAdmin) {
            // Redirigir al panel de administración
            navigate("/admin");
          } else {
            // Redirigir a la página principal
            navigate("/");
          }
        } else {
          setError(result.message || "Credenciales incorrectas");
        }
      } else {
        // Login como médico
        const response = await fetch(API_ENDPOINTS.MEDICO_LOGIN, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error al iniciar sesión');
        }

        // Guardar token y datos del médico
        localStorage.setItem('medicoToken', data.token);
        localStorage.setItem('medicoData', JSON.stringify(data.medico));
        localStorage.setItem('tipoUsuario', 'medico');

        // Redirigir al dashboard del médico
        navigate('/medico/dashboard');
      }
    } catch (error) {
      setError(error.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <Card className="shadow-lg p-3" style={{ width: "28rem" }}>
        <Card.Body>
          <h2 className="text-center mb-4 text-primary-odont fw-bold">
            Iniciar Sesión
          </h2>

          {/* Selector de tipo de usuario */}
          <div className="text-center mb-4">
            <ButtonGroup>
              <ToggleButton
                id="toggle-paciente"
                type="radio"
                variant={userType === "paciente" ? "success" : "outline-secondary"}
                name="userType"
                value="paciente"
                checked={userType === "paciente"}
                onChange={(e) => setUserType(e.currentTarget.value)}
              >
                <i className="bi bi-person me-2"></i>
                Paciente
              </ToggleButton>
              <ToggleButton
                id="toggle-medico"
                type="radio"
                variant={userType === "medico" ? "success" : "outline-secondary"}
                name="userType"
                value="medico"
                checked={userType === "medico"}
                onChange={(e) => setUserType(e.currentTarget.value)}
              >
                <i className="bi bi-person-badge me-2"></i>
                Médico
              </ToggleButton>
            </ButtonGroup>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>
                <i className="bi bi-envelope me-2"></i>
                Correo Electrónico
              </Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={userType === "medico" ? "doctor@clinica.com" : "Ingresa tu correo"}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="password">
              <Form.Label>
                <i className="bi bi-lock me-2"></i>
                Contraseña
              </Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Ingresa tu contraseña"
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
                  Ingresando...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Ingresar como {userType === "medico" ? "Médico" : "Paciente"}
                </>
              )}
            </Button>

            {userType === "paciente" && (
              <div className="text-center">
                <p className="mb-0">
                  ¿No tienes una cuenta?{" "}
                  <Link to="/register" className="text-primary-odont" style={{ textDecoration: "none" }}>
                    Regístrate
                  </Link>
                </p>
              </div>
            )}

            {userType === "medico" && (
              <div className="text-center">
                <small className="text-muted">
                  Los médicos deben solicitar sus credenciales al administrador
                </small>
              </div>
            )}
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
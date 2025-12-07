import { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

const LoginMedico = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(API_ENDPOINTS.MEDICO_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
    } catch (err) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '100%', maxWidth: '450px' }} className="shadow-lg">
        <Card.Header className="text-center card-header-primary">
          <h3 className="mb-0">
            <i className="bi bi-person-badge me-2"></i>
            Portal del Médico
          </h3>
        </Card.Header>
        <Card.Body className="p-4">
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="bi bi-envelope me-2"></i>
                Correo Electrónico
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="doctor@clinica.com"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>
                <i className="bi bi-lock me-2"></i>
                Contraseña
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="w-100 mb-3"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Iniciar Sesión
                </>
              )}
            </Button>
          </Form>

          <div className="text-center">
            <small className="text-muted">
              ¿No eres médico?{' '}
              <Link to="/login" className="text-primary-odont">
                Ir al login de pacientes
              </Link>
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginMedico;

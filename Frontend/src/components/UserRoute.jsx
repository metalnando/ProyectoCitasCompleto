import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Alert } from 'react-bootstrap';

const UserRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <div className="spinner-border" style={{ color: "#48C9B0" }} role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si el usuario es administrador
  const isAdmin = user?.roles?.includes('admin') || user?.role === 'admin';

  if (isAdmin) {
    return (
      <Container className="my-5">
        <Alert variant="warning">
          <Alert.Heading>
            <i className="bi bi-exclamation-triangle me-2"></i>
            Acceso Restringido
          </Alert.Heading>
          <p>
            Esta sección es solo para usuarios regulares. Como administrador,
            tienes acceso al panel de administración.
          </p>
          <hr />
          <div className="d-flex justify-content-end">
            <Alert.Link href="/admin">
              Ir al Panel de Administración
            </Alert.Link>
          </div>
        </Alert>
      </Container>
    );
  }

  return children;
};

export default UserRoute;

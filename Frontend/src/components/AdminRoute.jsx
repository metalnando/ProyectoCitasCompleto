import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert, Container } from 'react-bootstrap';

const AdminRoute = ({ children }) => {
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

  // Verificar si el usuario tiene rol de admin
  const isAdmin = user?.roles?.includes('admin') || user?.role === 'admin';

  if (!isAdmin) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          <Alert.Heading>
            <i className="bi bi-shield-exclamation me-2"></i>
            Acceso Denegado
          </Alert.Heading>
          <p>
            No tienes permisos para acceder a esta página. Solo los administradores
            pueden acceder al panel de administración.
          </p>
          <hr />
          <p className="mb-0">
            Si crees que esto es un error, contacta al administrador del sistema.
          </p>
        </Alert>
      </Container>
    );
  }

  return children;
};

export default AdminRoute;

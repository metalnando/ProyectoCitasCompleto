import { Container, Navbar, Nav, Button, NavDropdown } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavbarOdonto = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar si estamos en el panel de administración
  const isAdminPanel = location.pathname.startsWith('/admin');

  // Verificar si el usuario es administrador
  const isAdmin = user?.roles?.includes('admin') || user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar
      expand="lg"
      style={{ backgroundColor: "#48C9B0" }}
      variant="dark"
      sticky="top"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold fs-4"
        >
          🦷 BELA SUNRISE
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Inicio
            </Nav.Link>

            {/* Opciones para usuarios NO administradores */}
            {isAuthenticated && !isAdmin && (
              <>
                <Nav.Link as={Link} to="/agendar-cita">
                  Agendar Cita
                </Nav.Link>
                <Nav.Link as={Link} to="/mis-citas">
                  Mis Citas
                </Nav.Link>
                <Nav.Link as={Link} to="/historial">
                  Mi Historial
                </Nav.Link>
              </>
            )}

            {/* Opciones públicas solo para NO administradores */}
            {!isAdmin && (
              <>
                <Nav.Link as={Link} to="/especialistas">
                  Especialistas
                </Nav.Link>
                <Nav.Link as={Link} to="/tratamientos">
                  Tratamientos
                </Nav.Link>
              </>
            )}

            {/* Opción de administración solo para administradores */}
            {isAuthenticated && isAdmin && (
              <Nav.Link as={Link} to="/admin">
                <i className="bi bi-gear-fill me-1"></i>
                Administración
              </Nav.Link>
            )}
          </Nav>

          <Nav>
            {isAuthenticated ? (
              <>
                <NavDropdown
                  title={
                    <span className="text-white">
                      <i className="bi bi-person-circle me-2"></i>
                      {user?.nombre || user?.name || 'Usuario'}
                    </span>
                  }
                  id="user-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/perfil">
                    <i className="bi bi-person me-2"></i>
                    Mi Perfil
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Cerrar Sesión
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-light"
                  className="me-2"
                >
                  Iniciar Sesión
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="light"
                  style={{ color: "#48C9B0" }}
                >
                  Registrarse
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarOdonto;

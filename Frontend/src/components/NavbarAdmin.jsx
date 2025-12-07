import { Container, Navbar, Nav, Button, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavbarAdmin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar
      expand="lg"
      className="navbar-admin"
      variant="dark"
      sticky="top"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/admin"
          className="fw-bold fs-4"
        >
          <i className="bi bi-gear-fill me-2"></i>
          Panel de Administración - BELASUNRISE
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-admin" />
        <Navbar.Collapse id="navbar-admin">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/admin">
              <i className="bi bi-speedometer2 me-1"></i>
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/medicos">
              <i className="bi bi-person-badge me-1"></i>
              Médicos
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/tratamientos">
              <i className="bi bi-clipboard2-pulse me-1"></i>
              Tratamientos
            </Nav.Link>
          </Nav>

          <Nav>
            <NavDropdown
              title={
                <span className="text-white">
                  <i className="bi bi-person-circle me-2"></i>
                  {user?.nombre || user?.name || 'Administrador'}
                </span>
              }
              id="admin-dropdown"
              align="end"
            >
              <NavDropdown.Item as={Link} to="/">
                <i className="bi bi-house me-2"></i>
                Ver Sitio Web
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>
                Cerrar Sesión
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarAdmin;

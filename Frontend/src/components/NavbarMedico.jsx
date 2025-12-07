import { Container, Navbar, Nav, Button, NavDropdown, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";

const NavbarMedico = () => {
  const navigate = useNavigate();
  const [medico, setMedico] = useState(null);

  useEffect(() => {
    const medicoData = localStorage.getItem('medicoData');
    if (medicoData) {
      setMedico(JSON.parse(medicoData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('medicoToken');
    localStorage.removeItem('medicoData');
    localStorage.removeItem('tipoUsuario');
    navigate('/login');
  };

  return (
    <Navbar
      expand="lg"
      className="navbar-medico"
      variant="dark"
      sticky="top"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/medico/dashboard"
          className="fw-bold fs-4"
        >
          <i className="bi bi-heart-pulse me-2"></i>
          BELA SUNRISE - Portal Médico
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-medico" />
        <Navbar.Collapse id="navbar-medico">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/medico/dashboard">
              <i className="bi bi-speedometer2 me-1"></i>
              Dashboard
            </Nav.Link>
          </Nav>

          <Nav>
            {medico && (
              <NavDropdown
                title={
                  <span className="text-white d-inline-flex align-items-center">
                    {medico.imagen ? (
                      <Image
                        src={`${API_BASE_URL}${medico.imagen}`}
                        roundedCircle
                        style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                        className="me-2"
                      />
                    ) : (
                      <i className="bi bi-person-badge me-2"></i>
                    )}
                    Dr. {medico.medicoNombre} {medico.medicoApellido}
                  </span>
                }
                id="medico-dropdown"
                align="end"
              >
                <NavDropdown.Item disabled>
                  <i className="bi bi-envelope me-2"></i>
                  {medico.medicoCorreo}
                </NavDropdown.Item>
                <NavDropdown.Item disabled>
                  <i className="bi bi-award me-2"></i>
                  {medico.especialidad || 'Odontología General'}
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarMedico;

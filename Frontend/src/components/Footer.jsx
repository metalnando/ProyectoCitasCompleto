import React from "react";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom"; 

function Footer() {
  return (
    <footer className="info-footer py-5 mt-auto"> 
      <Container>
        <Row className="justify-content-center text-center text-md-start">
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="fw-bold text-primary-odont mb-3">Bela Sunrise</h5>
            <p className="text-muted">
              Tu clínica dental de confianza. Cuidamos tu sonrisa con dedicación y la más alta calidad.
            </p>
            <div className="social-icons mt-3">
              <a href="https://facebook.com/belasunrise" target="_blank" rel="noopener noreferrer" className="me-3 text-primary-odont fs-4">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://instagram.com/belasunrise" target="_blank" rel="noopener noreferrer" className="me-3 text-primary-odont fs-4">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://wa.me/3217759280" target="_blank" rel="noopener noreferrer" className="text-primary-odont fs-4">
                <i className="bi bi-whatsapp"></i>
              </a>
            </div>
          </Col>

          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="fw-bold text-primary-odont mb-3">Enlaces Rápidos</h5>
            <ListGroup variant="flush" className="bg-transparent">
              <ListGroup.Item as={Link} to="/" className="bg-transparent border-0 py-1 text-muted hover-grow">
                Inicio
              </ListGroup.Item>
              <ListGroup.Item as={Link} to="/agendar-cita" className="bg-transparent border-0 py-1 text-muted hover-grow">
                Agendar Cita
              </ListGroup.Item>
              <ListGroup.Item as={Link} to="/especialistas" className="bg-transparent border-0 py-1 text-muted hover-grow">
                Nuestros Especialistas
              </ListGroup.Item>
              <ListGroup.Item as={Link} to="/historial" className="bg-transparent border-0 py-1 text-muted hover-grow">
                Mi Historial Clínico
              </ListGroup.Item>
              <ListGroup.Item as={Link} to="/login" className="bg-transparent border-0 py-1 text-muted hover-grow">
                Iniciar Sesión
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={4}>
            <h5 className="fw-bold text-primary-odont mb-3">Contacto</h5>
            <p className="text-muted mb-2">
              <i className="bi bi-geo-alt-fill me-2 text-info"></i>
              Cra. 13 A # 35 - 08 - Manizales - Caldas
            </p>
            <p className="text-muted mb-2">
              <i className="bi bi-phone-fill me-2 text-info"></i>
              +57 321 775 9280
            </p>
            <p className="text-muted mb-0">
              <i className="bi bi-envelope-fill me-2 text-info"></i>
              belasunrise@gmail.com
            </p>
          </Col>
        </Row>
        <hr className="my-4 text-muted" />
        <Row>
          <Col className="text-center text-muted">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} **Bela Sunrise**. Todos los derechos reservados.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
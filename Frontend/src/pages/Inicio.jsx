import React from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import 'animate.css'; 

function Inicio() {
  return (
    <div
      className="d-flex align-items-center justify-content-center text-center"
      style={{
        minHeight: "calc(100vh - 120px)", 
        background:
          "linear-gradient(to bottom right, #48C9B0, #A2D9CE)", 
        color: "white",
        padding: "2rem",
      }}
    >
      <Container>
        <h1 className="display-3 fw-bold mb-4 animate__animated animate__fadeInDown">
          Bienvenido a Bela Sunrise
        </h1>
        <p className="lead mb-5 animate__animated animate__fadeInUp">
          Tu salud oral es nuestra prioridad. Ofrecemos tratamientos de vanguardia con un toque humano.
        </p>
        <Row className="justify-content-center animate__animated animate__zoomIn">
          <Col xs={12} md={6} lg={4}>
            <Button
              as={Link}
              to="/login"
              variant="light"
              size="lg"
              className="w-100 shadow-sm hover-grow"
              style={{ padding: "15px 0", fontSize: "1.2rem", color: "#48C9B0" }}
            >
              Iniciar Sesión
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Inicio;
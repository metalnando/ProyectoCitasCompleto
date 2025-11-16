import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Container
      className="text-center d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "70vh" }}
    >
      <h1 className="display-1 fw-bold text-danger">404</h1>
      <h2 className="mb-3">¡Página no encontrada!</h2>
      <p className="lead mb-4">
        Lo sentimos, la página que buscas no existe o se ha movido.
      </p>
      <Button as={Link} to="/" variant="primary" style={{ backgroundColor: '#48C9B0', borderColor: '#48C9B0' }}>
        Volver al Inicio
      </Button>
    </Container>
  );
};

export default NotFound;
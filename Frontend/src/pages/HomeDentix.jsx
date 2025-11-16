import React from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import CardOdonto from "../components/CardOdonto";
import { Link } from "react-router-dom"; 

const HomeDentix = () => {
  const cardsData = [
    {
      title: "Agendar Cita",
      description: "Programa tu consulta fácilmente con nuestros especialistas.",
      img: "/AgendaCita.png", 
      link: "/agendar-cita", 
    },
    {
      title: "Historial Clínico",
      description: "Consulta tus citas pasadas y tratamientos recibidos.",
      img: "/HistorialC.png", 
      link: "/historial", 
    },
    {
      title: "Conoce nuestros especialistas",
      description: "Encuentra el especialista ideal para tu necesidad.",
      img: "/Especialistas.png", 
      link: "/especialistas", 
    },
    // {
    //   title: "Reprogramar Cita",
    //   description: "Modifica o cancela tu cita fácilmente desde aquí.",
    //   img: "/Reprogramacion.png", 
  
    //   onClick: () => alert("FPENDIENTE")
    // },
    {
      title: "Tratamientos y Procesos",
      description: "Descubre los procedimientos que ofrecemos para tu salud oral.",
      img: "/Procesos.png",
      link: "/tratamientos"
    },
    {
      title: "Pagos y Facturación",
      description: "Consulta y realiza tus pagos de manera segura.",
      img: "/pagos.png", 
      onClick: () => alert("PENDIENTE")
    },
    // {
    //   title: "Contacto Directo",
    //   description: "Contáctanos para resolver tus dudas o inquietudes.",
    //   img: "/contactanos.jpg", 
    //   onClick: () => alert("Funcionalidad de Contacto directo pendiente.")
    // },
    {
      title: "Testimonios de pacientes",
      description: "Lee las experiencias de otros pacientes con nuestros servicios.",
      img: "/testimonios.jpg",
      onClick: () => alert("PENDIENTE")
    }
  ];

  return (
    <>
      
      <div className="hero-image-container">
        <img
          src="/Home.png" 
          alt="Banner odontológico Bela Sunrise"
          className="img-fluid hero-image"
        />
        <div className="hero-text">
          <h1 className="display-4 fw-bold text-white">Bela Sunrise</h1>
          <p className="lead text-white-50">
            Tu sonrisa, nuestra prioridad. Te ofrecemos el mejor servicio y atención.
          </p>
        </div>
      </div>

      
      <Container className="text-center mt-5 mb-5">
        <h2 className="fw-bold text-primary-odont">Bienvenido a Bela Sunrise</h2>
        <p className="text-muted mt-3 fs-5">
          En nuestra clínica, nos dedicamos a cuidar tu salud oral con pasión y
          experiencia, garantizando que cada visita sea cómoda y efectiva.
        </p>
      </Container>

      
      <Container className="mt-5 mb-5">
        <CardOdonto cardsData={cardsData} />
      </Container>

      
      <Container className="text-center my-5">
        <h3 className="mb-4 fw-bold text-secondary-odont">
          ¿Listo para transformar tu sonrisa?
        </h3>
        <Button
          href="https://wa.me/3217759280"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: "#48C9B0",
            color: "white",
            border: "none",
            padding: "12px 30px",
            fontSize: "1.2rem",
            borderRadius: "50px", 
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
          className="d-inline-flex align-items-center justify-content-center gap-2 whatsapp-button-hover"
        >
          <i className="bi bi-whatsapp fs-4"></i> Agenda tu cita por WhatsApp
        </Button>
      </Container>
    </>
  );
};

export default HomeDentix;
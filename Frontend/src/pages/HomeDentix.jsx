import React, { useEffect } from "react";
import { Container, Button, Row, Col, Carousel } from "react-bootstrap";
import CardOdonto from "../components/CardOdonto";
import { Link, useNavigate } from "react-router-dom";
import Testimonios from "../components/Testimonios";
import { useAuth } from "../context/AuthContext";

const HomeDentix = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirigir administradores al panel de administración
  useEffect(() => {
    if (user) {
      const isAdmin = user?.roles?.includes('admin') || user?.role === 'admin';
      if (isAdmin) {
        navigate("/admin");
      }
    }
  }, [user, navigate]);

  const scrollToTestimonios = () => {
    const element = document.getElementById("testimonios-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

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
     {
       title: "Mis Citas",
       description: "Consulta tus citas fácilmente desde aquí.",
       img: "/Reprogramacion.png", 
  
       link: "/mis-Citas",
     },
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
      link: "/pagos"
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
      onClick: scrollToTestimonios
    }
  ];

  return (
    <>
      
      <Carousel fade interval={4000} className="hero-carousel">
        <Carousel.Item>
          <div className="hero-image-container">
            <img
              src="/Home.png"
              alt="Banner odontológico BelaSunrise"
              className="hero-image"
            />
            <div className="hero-overlay"></div>
            <div className="hero-text">
              <h1 className="display-4 fw-bold text-white">Bela Sunrise</h1>
              <p className="lead text-white">
                Tu sonrisa, nuestra prioridad. Te ofrecemos el mejor servicio y atención.
              </p>
            </div>
          </div>
        </Carousel.Item>

        <Carousel.Item>
          <div className="hero-image-container">
            <img
              src="/Banner2.jpg"
              alt="Servicios dentales profesionales"
              className="hero-image"
            />
            <div className="hero-overlay"></div>
            <div className="hero-text">
              <h1 className="display-4 fw-bold text-white">Servicios Profesionales</h1>
              <p className="lead text-white">
                Tecnología de punta y especialistas certificados para tu salud dental.
              </p>
            </div>
          </div>
        </Carousel.Item>

        <Carousel.Item>
          <div className="hero-image-container">
            <img
              src="/Banner3.jpg"
              alt="Atención personalizada"
              className="hero-image"
            />
            <div className="hero-overlay"></div>
            <div className="hero-text">
              <h1 className="display-4 fw-bold text-white">Atención Personalizada</h1>
              <p className="lead text-white">
                Cuidamos cada detalle para brindarte la mejor experiencia dental.
              </p>
            </div>
          </div>
        </Carousel.Item>
      </Carousel>

      
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

      {/* Sección de Testimonios */}
      <div id="testimonios-section">
        <Testimonios />
      </div>


      <Container className="text-center my-5">
        <h3 className="mb-4 fw-bold text-secondary-odont">
          ¿Listo para transformar tu sonrisa?
        </h3>
        <Button
          href="https://wa.me/3217759280"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp d-inline-flex align-items-center justify-content-center gap-2"
        >
          <i className="bi bi-whatsapp fs-4"></i> Agenda tu cita por WhatsApp
        </Button>
      </Container>
    </>
  );
};

export default HomeDentix;
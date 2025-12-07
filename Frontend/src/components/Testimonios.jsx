import { Container, Row, Col, Card } from "react-bootstrap";

const Testimonios = () => {
  const testimoniosData = [
    {
      id: 1,
      nombre: "María González",
      foto: "https://randomuser.me/api/portraits/women/2.jpg",
      tratamiento: "Blanqueamiento Dental",
      calificacion: 5,
      testimonio: "Excelente servicio. El Dr. Ortega fue muy profesional y el resultado superó mis expectativas. Mi sonrisa quedó increíble y el proceso fue completamente indoloro.",
      fecha: "Noviembre 2024"
    },
    {
      id: 2,
      nombre: "Carlos Rodríguez",
      foto: "https://randomuser.me/api/portraits/men/30.jpg",
      tratamiento: "Implante Dental",
      calificacion: 5,
      testimonio: "Tenía mucho miedo de hacerme el implante, pero el equipo de BelaSunrise me hizo sentir muy cómodo. El seguimiento post-operatorio fue excelente y el resultado es natural.",
      fecha: "Octubre 2024"
    },
    {
      id: 3,
      nombre: "Ana Martínez",
      foto: "https://randomuser.me/api/portraits/women/23.jpg",
      tratamiento: "Ortodoncia Invisible",
      calificacion: 5,
      testimonio: "Llevaba años queriendo corregir mis dientes pero no quería brackets metálicos. Los alineadores invisibles fueron la mejor decisión. Nadie nota que los tengo puestos.",
      fecha: "Septiembre 2024"
    },
    {
      id: 4,
      nombre: "Roberto Sánchez",
      foto: "https://randomuser.me/api/portraits/men/72.jpg",
      tratamiento: "Limpieza Dental",
      calificacion: 5,
      testimonio: "Llevo a toda mi familia a Bela Sunrise. El trato es excelente, las instalaciones son modernas y los precios son muy justos. Totalmente recomendado para toda la familia.",
      fecha: "Agosto 2024"
    }
  ];

  const renderEstrellas = (calificacion) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={`bi bi-star${index < calificacion ? "-fill" : ""}`}
        style={{ color: index < calificacion ? "#ffc107" : "#e0e0e0" }}
      ></i>
    ));
  };

  return (
    <Container className="my-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-primary-odont">
          <i className="bi bi-chat-quote me-2"></i>
          Lo que dicen nuestros pacientes
        </h2>
        <p className="text-muted fs-5">
          Testimonios reales de personas que han transformado su sonrisa con nosotros
        </p>
      </div>

      <Row>
        {testimoniosData.map((testimonio) => (
          <Col key={testimonio.id} md={6} lg={3} className="mb-4">
            <Card className="h-100 shadow-sm border-0 testimonio-card">
              <Card.Body className="d-flex flex-column">
                <div className="text-center mb-3">
                  <img
                    src={testimonio.foto}
                    alt={testimonio.nombre}
                    className="rounded-circle mb-3"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      border: "3px solid var(--primary-odont)"
                    }}
                  />
                  <h5 className="mb-1">{testimonio.nombre}</h5>
                  <small className="text-muted d-block mb-2">
                    {testimonio.tratamiento}
                  </small>
                  <div className="mb-2">
                    {renderEstrellas(testimonio.calificacion)}
                  </div>
                </div>

                <div className="flex-grow-1">
                  <p className="text-muted" style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
                    <i className="bi bi-quote text-primary-odont" style={{ fontSize: "1.2rem" }}></i>
                    {testimonio.testimonio}
                  </p>
                </div>

                <div className="text-end mt-3">
                  <small className="text-muted">
                    <i className="bi bi-calendar3 me-1"></i>
                    {testimonio.fecha}
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="text-center mt-4">
        <p className="text-muted">
          <i className="bi bi-heart-fill me-2" style={{ color: "#e74c3c" }}></i>
          Gracias a todos nuestros pacientes por confiar en nosotros
        </p>
      </div>
    </Container>
  );
};

export default Testimonios;

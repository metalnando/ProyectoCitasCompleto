import { Container, Row, Col, Card } from 'react-bootstrap';

const SobreNosotros = () => {
  return (
    <Container className="my-5">
      {/* Hero Section */}
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-3" style={{ color: '#48C9B0' }}>
          Sobre Nosotros
        </h1>
        <p className="lead text-muted" style={{ maxWidth: '800px', margin: '0 auto' }}>
          En BELASUNRISE nos dedicamos a brindar servicios odontológicos de la más alta calidad,
          combinando tecnología de punta con un trato humano y personalizado.
        </p>
      </div>

      {/* Misión y Visión */}
      <Row className="mb-5 g-4">
        <Col md={6}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="p-4">
              <div className="text-center mb-3">
                <i className="bi bi-bullseye" style={{ fontSize: '3rem', color: '#48C9B0' }}></i>
              </div>
              <Card.Title className="text-center mb-3 fw-bold" style={{ color: '#48C9B0' }}>
                Nuestra Misión
              </Card.Title>
              <Card.Text className="text-muted text-center" style={{ lineHeight: '1.8' }}>
                Proporcionar atención dental integral y personalizada, enfocándonos en la prevención,
                diagnóstico y tratamiento de las enfermedades bucales, utilizando tecnología avanzada
                y un equipo humano altamente capacitado para garantizar la salud y bienestar de nuestros pacientes.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="p-4">
              <div className="text-center mb-3">
                <i className="bi bi-eye" style={{ fontSize: '3rem', color: '#48C9B0' }}></i>
              </div>
              <Card.Title className="text-center mb-3 fw-bold" style={{ color: '#48C9B0' }}>
                Nuestra Visión
              </Card.Title>
              <Card.Text className="text-muted text-center" style={{ lineHeight: '1.8' }}>
                Ser reconocidos como el consultorio odontológico líder en la región, destacándonos por
                la excelencia en nuestros servicios, la innovación constante en tratamientos dentales
                y el compromiso inquebrantable con la satisfacción y salud bucal de cada paciente.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Valores */}
      <div className="mb-5">
        <h2 className="text-center fw-bold mb-4" style={{ color: '#48C9B0' }}>
          Nuestros Valores
        </h2>
        <Row className="g-4">
          <Col md={4}>
            <Card className="text-center h-100 shadow-sm border-0">
              <Card.Body className="p-4">
                <i className="bi bi-heart-pulse mb-3" style={{ fontSize: '2.5rem', color: '#48C9B0' }}></i>
                <Card.Title className="fw-bold mb-3">Compromiso</Card.Title>
                <Card.Text className="text-muted">
                  Dedicación total al bienestar y satisfacción de nuestros pacientes en cada tratamiento.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="text-center h-100 shadow-sm border-0">
              <Card.Body className="p-4">
                <i className="bi bi-award mb-3" style={{ fontSize: '2.5rem', color: '#48C9B0' }}></i>
                <Card.Title className="fw-bold mb-3">Excelencia</Card.Title>
                <Card.Text className="text-muted">
                  Búsqueda continua de los más altos estándares de calidad en todos nuestros servicios.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="text-center h-100 shadow-sm border-0">
              <Card.Body className="p-4">
                <i className="bi bi-shield-check mb-3" style={{ fontSize: '2.5rem', color: '#48C9B0' }}></i>
                <Card.Title className="fw-bold mb-3">Confianza</Card.Title>
                <Card.Text className="text-muted">
                  Construimos relaciones duraderas basadas en la honestidad y transparencia profesional.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="text-center h-100 shadow-sm border-0">
              <Card.Body className="p-4">
                <i className="bi bi-lightbulb mb-3" style={{ fontSize: '2.5rem', color: '#48C9B0' }}></i>
                <Card.Title className="fw-bold mb-3">Innovación</Card.Title>
                <Card.Text className="text-muted">
                  Incorporamos las últimas tecnologías y técnicas para ofrecer tratamientos de vanguardia.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="text-center h-100 shadow-sm border-0">
              <Card.Body className="p-4">
                <i className="bi bi-people mb-3" style={{ fontSize: '2.5rem', color: '#48C9B0' }}></i>
                <Card.Title className="fw-bold mb-3">Empatía</Card.Title>
                <Card.Text className="text-muted">
                  Entendemos las necesidades y preocupaciones de cada paciente, brindando un trato cálido.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="text-center h-100 shadow-sm border-0">
              <Card.Body className="p-4">
                <i className="bi bi-globe mb-3" style={{ fontSize: '2.5rem', color: '#48C9B0' }}></i>
                <Card.Title className="fw-bold mb-3">Responsabilidad</Card.Title>
                <Card.Text className="text-muted">
                  Actuamos con ética profesional y responsabilidad social en todas nuestras acciones.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Por qué elegirnos */}
      <div className="mb-5">
        <h2 className="text-center fw-bold mb-4" style={{ color: '#48C9B0' }}>
          ¿Por Qué Elegirnos?
        </h2>
        <Card className="shadow-sm border-0">
          <Card.Body className="p-4">
            <Row>
              <Col md={6} className="mb-3">
                <div className="d-flex align-items-start mb-3">
                  <i className="bi bi-check-circle-fill me-3 mt-1" style={{ fontSize: '1.5rem', color: '#48C9B0' }}></i>
                  <div>
                    <h5 className="fw-bold mb-2">Equipo Profesional Calificado</h5>
                    <p className="text-muted mb-0">
                      Contamos con odontólogos especialistas altamente capacitados y con amplia experiencia
                      en todas las áreas de la odontología.
                    </p>
                  </div>
                </div>
              </Col>

              <Col md={6} className="mb-3">
                <div className="d-flex align-items-start mb-3">
                  <i className="bi bi-check-circle-fill me-3 mt-1" style={{ fontSize: '1.5rem', color: '#48C9B0' }}></i>
                  <div>
                    <h5 className="fw-bold mb-2">Tecnología de Última Generación</h5>
                    <p className="text-muted mb-0">
                      Utilizamos equipos modernos y técnicas innovadoras para garantizar tratamientos
                      precisos, seguros y menos invasivos.
                    </p>
                  </div>
                </div>
              </Col>

              <Col md={6} className="mb-3">
                <div className="d-flex align-items-start mb-3">
                  <i className="bi bi-check-circle-fill me-3 mt-1" style={{ fontSize: '1.5rem', color: '#48C9B0' }}></i>
                  <div>
                    <h5 className="fw-bold mb-2">Atención Personalizada</h5>
                    <p className="text-muted mb-0">
                      Cada paciente es único. Diseñamos planes de tratamiento individualizados según
                      las necesidades específicas de cada persona.
                    </p>
                  </div>
                </div>
              </Col>

              <Col md={6} className="mb-3">
                <div className="d-flex align-items-start mb-3">
                  <i className="bi bi-check-circle-fill me-3 mt-1" style={{ fontSize: '1.5rem', color: '#48C9B0' }}></i>
                  <div>
                    <h5 className="fw-bold mb-2">Ambiente Cómodo y Acogedor</h5>
                    <p className="text-muted mb-0">
                      Nuestras instalaciones están diseñadas para brindar comodidad y tranquilidad,
                      reduciendo la ansiedad dental.
                    </p>
                  </div>
                </div>
              </Col>

              <Col md={6} className="mb-3">
                <div className="d-flex align-items-start mb-3">
                  <i className="bi bi-check-circle-fill me-3 mt-1" style={{ fontSize: '1.5rem', color: '#48C9B0' }}></i>
                  <div>
                    <h5 className="fw-bold mb-2">Horarios Flexibles</h5>
                    <p className="text-muted mb-0">
                      Ofrecemos horarios convenientes para adaptarnos a tu agenda y facilitar
                      el acceso a nuestros servicios.
                    </p>
                  </div>
                </div>
              </Col>

              <Col md={6} className="mb-3">
                <div className="d-flex align-items-start mb-3">
                  <i className="bi bi-check-circle-fill me-3 mt-1" style={{ fontSize: '1.5rem', color: '#48C9B0' }}></i>
                  <div>
                    <h5 className="fw-bold mb-2">Planes de Pago Accesibles</h5>
                    <p className="text-muted mb-0">
                      Brindamos opciones de financiamiento para que puedas acceder a los tratamientos
                      que necesitas sin preocupaciones económicas.
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>

      {/* Historia */}
      <div className="mb-5">
        <Card className="shadow-sm border-0" style={{ backgroundColor: '#f8f9fa' }}>
          <Card.Body className="p-5">
            <Row className="align-items-center">
              <Col md={12}>
                <h2 className="fw-bold mb-4" style={{ color: '#48C9B0' }}>
                  <i className="bi bi-book me-2"></i>
                  Nuestra Historia
                </h2>
                <p className="text-muted" style={{ lineHeight: '2', fontSize: '1.05rem' }}>
                  BELASUNRISE nació del sueño de crear un espacio donde la salud dental se encuentre con
                  la calidez humana. Desde nuestros inicios, hemos trabajado incansablemente para construir
                  un consultorio que no solo ofrezca servicios odontológicos excepcionales, sino que también
                  sea un lugar donde nuestros pacientes se sientan como en familia.
                </p>
                <p className="text-muted" style={{ lineHeight: '2', fontSize: '1.05rem' }}>
                  A lo largo de los años, hemos crecido junto a nuestra comunidad, adaptándonos a las
                  necesidades cambiantes y manteniéndonos siempre a la vanguardia de la odontología moderna.
                  Cada sonrisa que transformamos nos motiva a seguir mejorando y ofreciendo lo mejor de nosotros.
                </p>
                <p className="text-muted mb-0" style={{ lineHeight: '2', fontSize: '1.05rem' }}>
                  Hoy, BELASUNRISE es más que un consultorio dental: es un compromiso con la salud bucal
                  de nuestra comunidad, un espacio de confianza y profesionalismo donde cada paciente
                  encuentra no solo tratamiento, sino cuidado integral y atención personalizada.
                </p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="text-center py-5 mb-4" style={{ backgroundColor: '#48C9B0', borderRadius: '15px' }}>
        <h3 className="text-white fw-bold mb-3">
          ¿Listo para cuidar tu sonrisa?
        </h3>
        <p className="text-white mb-4">
          Agenda tu cita hoy y descubre la diferencia de una atención dental de calidad
        </p>
        <a
          href="https://wa.me/3217759280"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-light btn-lg"
          style={{ color: '#48C9B0', fontWeight: 'bold' }}
        >
          <i className="bi bi-whatsapp me-2"></i>
          Contactar por WhatsApp
        </a>
      </div>
    </Container>
  );
};

export default SobreNosotros;

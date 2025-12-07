import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, Spinner, Image } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import historiaClinicaService from '../services/historiaClinicaService';

const NuevaHistoriaClinica = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cita = location.state?.cita;

  const [medico, setMedico] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [imagenesPreview, setImagenesPreview] = useState([]);

  const [formData, setFormData] = useState({
    paciente: cita?.paciente?._id || '',
    medico: '',
    cita: cita?._id || '',
    fechaConsulta: new Date().toISOString().split('T')[0],
    motivoConsulta: cita?.motivo || '',
    diagnostico: '',
    procedimientoRealizado: '',
    tratamientoIndicado: '',
    medicamentos: '',
    recomendaciones: '',
    observaciones: '',
    proximaCita: '',
  });

  const [programarProximaCita, setProgramarProximaCita] = useState(false);

  useEffect(() => {
    const medicoData = localStorage.getItem('medicoData');
    if (!medicoData) {
      navigate('/medico/login');
      return;
    }
    const medicoObj = JSON.parse(medicoData);
    setMedico(medicoObj);
    setFormData((prev) => ({ ...prev, medico: medicoObj._id }));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImagenesChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      if (!file.type.match(/^image\/(jpeg|jpg|png|gif|webp)$/) && file.type !== 'application/pdf') {
        setError('Solo se permiten imágenes y PDFs');
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Los archivos no deben superar 10MB');
        return false;
      }
      return true;
    });

    setImagenes((prev) => [...prev, ...validFiles]);

    // Crear previews para imágenes
    validFiles.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagenesPreview((prev) => [...prev, { file: file.name, preview: reader.result }]);
        };
        reader.readAsDataURL(file);
      } else {
        setImagenesPreview((prev) => [...prev, { file: file.name, preview: null }]);
      }
    });
    setError('');
  };

  const removeImagen = (index) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
    setImagenesPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (imagenes.length > 0) {
        result = await historiaClinicaService.crearConImagenes(formData, imagenes);
      } else {
        result = await historiaClinicaService.crear(formData);
      }

      if (result.success) {
        setSuccess('Historia clínica guardada exitosamente');
        setTimeout(() => {
          navigate('/medico/dashboard');
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error al guardar la historia clínica');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: '#48C9B0' }}>
          <i className="bi bi-journal-medical me-2"></i>
          Nuevo Registro Clínico
        </h2>
        <Button variant="outline-secondary" onClick={() => navigate('/medico/dashboard')}>
          <i className="bi bi-arrow-left me-2"></i>
          Volver al Dashboard
        </Button>
      </div>

      {cita && (
        <Alert variant="info">
          <strong>Paciente:</strong> {cita.paciente?.pacienteNombre} {cita.paciente?.pacienteApellido}
          <br />
          <strong>Motivo de consulta:</strong> {cita.motivo}
        </Alert>
      )}

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card className="shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {/* Información básica */}
            <h5 className="mb-3" style={{ color: '#48C9B0' }}>
              Información de la Consulta
            </h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Consulta *</Form.Label>
                  <Form.Control
                    type="date"
                    name="fechaConsulta"
                    value={formData.fechaConsulta}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    id="programarProximaCita"
                    label="¿Desea programar próxima cita?"
                    checked={programarProximaCita}
                    onChange={(e) => {
                      setProgramarProximaCita(e.target.checked);
                      if (!e.target.checked) {
                        setFormData((prev) => ({ ...prev, proximaCita: '' }));
                      }
                    }}
                    className="mb-2"
                  />
                  {programarProximaCita && (
                    <>
                      <Form.Label>Próxima Cita</Form.Label>
                      <Form.Control
                        type="date"
                        name="proximaCita"
                        value={formData.proximaCita}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Motivo de Consulta *</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="motivoConsulta"
                value={formData.motivoConsulta}
                onChange={handleChange}
                required
                placeholder="Describa el motivo de la consulta"
              />
            </Form.Group>

            {/* Diagnóstico y Procedimiento */}
            <h5 className="mb-3 mt-4" style={{ color: '#48C9B0' }}>
              Diagnóstico y Procedimiento
            </h5>
            <Form.Group className="mb-3">
              <Form.Label>Diagnóstico *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="diagnostico"
                value={formData.diagnostico}
                onChange={handleChange}
                required
                placeholder="Describa el diagnóstico del paciente"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Procedimiento Realizado *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="procedimientoRealizado"
                value={formData.procedimientoRealizado}
                onChange={handleChange}
                required
                placeholder="Describa el procedimiento realizado"
              />
            </Form.Group>

            {/* Tratamiento */}
            <h5 className="mb-3 mt-4" style={{ color: '#48C9B0' }}>
              Tratamiento y Recomendaciones
            </h5>
            <Form.Group className="mb-3">
              <Form.Label>Tratamiento Indicado</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="tratamientoIndicado"
                value={formData.tratamientoIndicado}
                onChange={handleChange}
                placeholder="Tratamiento a seguir"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Medicamentos</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="medicamentos"
                value={formData.medicamentos}
                onChange={handleChange}
                placeholder="Medicamentos prescritos (nombre, dosis, frecuencia)"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Recomendaciones</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="recomendaciones"
                value={formData.recomendaciones}
                onChange={handleChange}
                placeholder="Recomendaciones para el paciente"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Observaciones Adicionales</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                placeholder="Observaciones adicionales"
              />
            </Form.Group>

            {/* Imágenes */}
            <h5 className="mb-3 mt-4" style={{ color: '#48C9B0' }}>
              Imágenes y Documentos
            </h5>
            <Form.Group className="mb-3">
              <Form.Label>Agregar Imágenes o PDFs</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,application/pdf"
                onChange={handleImagenesChange}
              />
              <Form.Text className="text-muted">
                Puede subir radiografías, fotos del procedimiento, etc. Máximo 10MB por archivo.
              </Form.Text>
            </Form.Group>

            {imagenesPreview.length > 0 && (
              <div className="mb-3">
                <p className="fw-bold">Archivos seleccionados:</p>
                <Row>
                  {imagenesPreview.map((img, index) => (
                    <Col key={index} xs={6} md={3} className="mb-2">
                      <Card>
                        {img.preview ? (
                          <Image src={img.preview} thumbnail style={{ height: '100px', objectFit: 'cover' }} />
                        ) : (
                          <div
                            className="d-flex align-items-center justify-content-center"
                            style={{ height: '100px', backgroundColor: '#f0f0f0' }}
                          >
                            <i className="bi bi-file-pdf" style={{ fontSize: '2rem', color: '#dc3545' }}></i>
                          </div>
                        )}
                        <Card.Body className="p-2">
                          <small className="d-block text-truncate">{img.file}</small>
                          <Button
                            variant="danger"
                            size="sm"
                            className="mt-1 w-100"
                            onClick={() => removeImagen(index)}
                          >
                            Eliminar
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {/* Botones */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="secondary" onClick={() => navigate('/medico/dashboard')}>
                Cancelar
              </Button>
              <Button
                type="submit"
                style={{ backgroundColor: '#48C9B0', border: 'none' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Guardar Historia Clínica
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default NuevaHistoriaClinica;

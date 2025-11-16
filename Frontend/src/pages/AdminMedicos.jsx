import { useState, useEffect } from "react";
import { Container, Card, Table, Button, Modal, Form, Alert, Spinner, Image } from "react-bootstrap";
import medicosService from "../services/medicosService";
import { API_BASE_URL } from "../config/api";

const AdminMedicos = () => {
  const [medicos, setMedicos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingMedico, setEditingMedico] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState("");

  const [formData, setFormData] = useState({
    medicoNombre: "",
    medicoApellido: "",
    medicoDocumento: "",
    medicoTelefono: "",
    medicoEmail: "",
    especialidad: "Odontología General",
  });

  useEffect(() => {
    cargarMedicos();
  }, []);

  const cargarMedicos = async () => {
    const result = await medicosService.obtenerMedicos();
    if (result.success) {
      setMedicos(result.data);
    } else {
      setError("Error al cargar médicos: " + result.message);
    }
  };

  const handleShowModal = (medico = null) => {
    if (medico) {
      setEditingMedico(medico);
      setFormData({
        medicoNombre: medico.medicoNombre,
        medicoApellido: medico.medicoApellido,
        medicoDocumento: medico.medicoDocumento,
        medicoTelefono: medico.medicoTelefono,
        medicoEmail: medico.medicoEmail,
        especialidad: medico.especialidad || "Odontología General",
      });
      // Si el médico tiene imagen, mostrar la preview
      if (medico.imagen) {
        setImagenPreview(`${API_BASE_URL}${medico.imagen}`);
      } else {
        setImagenPreview("");
      }
    } else {
      setEditingMedico(null);
      setFormData({
        medicoNombre: "",
        medicoApellido: "",
        medicoDocumento: "",
        medicoTelefono: "",
        medicoEmail: "",
        especialidad: "Odontología General",
      });
      setImagenPreview("");
    }
    setImagenFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMedico(null);
    setImagenFile(null);
    setImagenPreview("");
    setError("");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.match(/^image\/(jpeg|jpg|png|gif|webp)$/)) {
        setError("Solo se permiten imágenes (JPG, PNG, GIF, WEBP)");
        return;
      }
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        setError("La imagen no debe superar los 5MB");
        return;
      }
      setImagenFile(file);
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let result;
      if (editingMedico) {
        result = await medicosService.actualizarMedico(editingMedico._id, formData, imagenFile);
      } else {
        result = await medicosService.crearMedico(formData, imagenFile);
      }

      if (result.success) {
        setSuccess(editingMedico ? "Médico actualizado exitosamente" : "Médico creado exitosamente");
        handleCloseModal();
        cargarMedicos();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Error al guardar el médico");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este médico?")) {
      const result = await medicosService.eliminarMedico(id);
      if (result.success) {
        setSuccess("Médico eliminado exitosamente");
        cargarMedicos();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Error al eliminar médico: " + result.message);
      }
    }
  };

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{ color: "#48C9B0" }}>
          Administrar Médicos
        </h2>
        <Button
          style={{ backgroundColor: "#48C9B0", border: "none" }}
          onClick={() => handleShowModal()}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Nuevo Médico
        </Button>
      </div>

      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-lg">
        <Card.Body>
          <Table responsive hover>
            <thead style={{ backgroundColor: "#48C9B0", color: "white" }}>
              <tr>
                <th>Foto</th>
                <th>Nombre</th>
                <th>Documento</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Especialidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {medicos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <i className="bi bi-inbox" style={{ fontSize: "2rem", color: "#ccc" }}></i>
                    <p className="mt-2 text-muted">No hay médicos registrados</p>
                  </td>
                </tr>
              ) : (
                medicos.map((medico) => (
                  <tr key={medico._id}>
                    <td>
                      {medico.imagen ? (
                        <Image
                          src={`${API_BASE_URL}${medico.imagen}`}
                          roundedCircle
                          width={50}
                          height={50}
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: "50%",
                            backgroundColor: "#48C9B0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          {medico.medicoNombre?.charAt(0)}
                          {medico.medicoApellido?.charAt(0)}
                        </div>
                      )}
                    </td>
                    <td>
                      Dr. {medico.medicoNombre} {medico.medicoApellido}
                    </td>
                    <td>{medico.medicoDocumento}</td>
                    <td>{medico.medicoTelefono}</td>
                    <td>{medico.medicoEmail}</td>
                    <td>
                      <span className="badge bg-info">{medico.especialidad}</span>
                    </td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleShowModal(medico)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleEliminar(medico._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal para crear/editar médico */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton style={{ backgroundColor: "#48C9B0", color: "white" }}>
          <Modal.Title>
            {editingMedico ? "Editar Médico" : "Nuevo Médico"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            {/* Sección de imagen */}
            <Form.Group className="mb-4 text-center">
              <Form.Label className="d-block fw-bold">Foto del Médico</Form.Label>
              <div className="d-flex flex-column align-items-center">
                {imagenPreview ? (
                  <Image
                    src={imagenPreview}
                    roundedCircle
                    width={150}
                    height={150}
                    style={{ objectFit: "cover", marginBottom: "1rem" }}
                  />
                ) : (
                  <div
                    style={{
                      width: 150,
                      height: 150,
                      borderRadius: "50%",
                      backgroundColor: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1rem",
                      border: "2px dashed #ccc",
                    }}
                  >
                    <i className="bi bi-person-plus" style={{ fontSize: "3rem", color: "#ccc" }}></i>
                  </div>
                )}
                <Form.Control
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleImagenChange}
                  style={{ maxWidth: "300px" }}
                />
                <Form.Text className="text-muted">
                  Formatos: JPG, PNG, GIF, WEBP. Máximo 5MB.
                </Form.Text>
              </div>
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Nombre *</Form.Label>
                  <Form.Control
                    type="text"
                    name="medicoNombre"
                    value={formData.medicoNombre}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Juan"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Apellido *</Form.Label>
                  <Form.Control
                    type="text"
                    name="medicoApellido"
                    value={formData.medicoApellido}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Pérez"
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Documento *</Form.Label>
                  <Form.Control
                    type="text"
                    name="medicoDocumento"
                    value={formData.medicoDocumento}
                    onChange={handleChange}
                    required
                    disabled={editingMedico !== null}
                    placeholder="Ej: 1234567890"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="medicoTelefono"
                    value={formData.medicoTelefono}
                    onChange={handleChange}
                    required
                    placeholder="Ej: 3001234567"
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                name="medicoEmail"
                value={formData.medicoEmail}
                onChange={handleChange}
                required
                placeholder="medico@ejemplo.com"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Especialidad *</Form.Label>
              <Form.Select
                name="especialidad"
                value={formData.especialidad}
                onChange={handleChange}
                required
              >
                <option value="Odontología General">Odontología General</option>
                <option value="Ortodoncia">Ortodoncia</option>
                <option value="Endodoncia">Endodoncia</option>
                <option value="Periodoncia">Periodoncia</option>
                <option value="Odontopediatría">Odontopediatría</option>
                <option value="Cirugía Maxilofacial">Cirugía Maxilofacial</option>
                <option value="Implantología">Implantología</option>
                <option value="Estética Dental">Estética Dental</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button
                type="submit"
                style={{ backgroundColor: "#48C9B0", border: "none" }}
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
                    {editingMedico ? "Actualizar" : "Crear"}
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminMedicos;

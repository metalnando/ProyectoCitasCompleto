import { useState, useEffect } from "react";
import { Container, Card, Table, Button, Modal, Form, Alert, Spinner, Badge } from "react-bootstrap";
import tratamientosService from "../services/tratamientosService";
import medicosService from "../services/medicosService";

const AdminTratamientos = () => {
  const [tratamientos, setTratamientos] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingTratamiento, setEditingTratamiento] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    duracion: "",
    imagen: "",
    medicos: [],
  });

  useEffect(() => {
    cargarTratamientos();
    cargarMedicos();
  }, []);

  const cargarMedicos = async () => {
    const result = await medicosService.obtenerMedicos();
    if (result.success) {
      setMedicos(result.data);
    }
  };

  const cargarTratamientos = async () => {
    const result = await tratamientosService.obtenerTratamientos();
    if (result.success) {
      setTratamientos(result.data);
    } else {
      setError("Error al cargar tratamientos: " + result.message);
    }
  };

  const handleShowModal = (tratamiento = null) => {
    if (tratamiento) {
      setEditingTratamiento(tratamiento);
      setFormData({
        nombre: tratamiento.nombre,
        descripcion: tratamiento.descripcion || "",
        precio: tratamiento.precio || "",
        duracion: tratamiento.duracion || "",
        imagen: tratamiento.imagen || "",
        medicos: tratamiento.medicos?.map(m => m._id || m) || [],
      });
    } else {
      setEditingTratamiento(null);
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        duracion: "",
        imagen: "",
        medicos: [],
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTratamiento(null);
    setError("");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMedicosChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({
      ...formData,
      medicos: selectedOptions
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const dataToSend = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        duracion: formData.duracion ? parseInt(formData.duracion) : undefined,
        imagen: formData.imagen || undefined,
        medicos: formData.medicos,
      };

      let result;
      if (editingTratamiento) {
        result = await tratamientosService.actualizarTratamiento(editingTratamiento._id, dataToSend);
      } else {
        result = await tratamientosService.crearTratamiento(dataToSend);
      }

      if (result.success) {
        setSuccess(editingTratamiento ? "Tratamiento actualizado exitosamente" : "Tratamiento creado exitosamente");
        handleCloseModal();
        cargarTratamientos();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Error al guardar el tratamiento");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este tratamiento?")) {
      const result = await tratamientosService.eliminarTratamiento(id);
      if (result.success) {
        setSuccess("Tratamiento eliminado exitosamente");
        cargarTratamientos();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Error al eliminar tratamiento: " + result.message);
      }
    }
  };

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary-odont">
          Administrar Tratamientos/Procedimientos
        </h2>
        <Button
          variant="primary"
          onClick={() => handleShowModal()}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Nuevo Tratamiento
        </Button>
      </div>

      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-lg">
        <Card.Body>
          <Table responsive hover>
            <thead className="card-header-primary">
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Costo</th>
                <th>Duración (min)</th>
                <th>Médicos Asignados</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tratamientos.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <i className="bi bi-inbox" style={{ fontSize: "2rem", color: "#ccc" }}></i>
                    <p className="mt-2 text-muted">No hay tratamientos registrados</p>
                  </td>
                </tr>
              ) : (
                tratamientos.map((tratamiento) => (
                  <tr key={tratamiento._id}>
                    <td className="fw-bold">{tratamiento.nombre}</td>
                    <td>{tratamiento.descripcion || "Sin descripción"}</td>
                    <td className="text-success fw-bold">
                      ${tratamiento.precio?.toLocaleString()}
                    </td>
                    <td>{tratamiento.duracion ? `${tratamiento.duracion} min` : "-"}</td>
                    <td>
                      {tratamiento.medicos && tratamiento.medicos.length > 0 ? (
                        <div>
                          {tratamiento.medicos.map((medico) => (
                            <Badge
                              key={medico._id || medico}
                              bg="info"
                              className="me-1 mb-1"
                            >
                              Dr. {medico.medicoNombre} {medico.medicoApellido}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted">Sin asignar</span>
                      )}
                    </td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleShowModal(tratamiento)}
                        title="Editar tratamiento"
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleEliminar(tratamiento._id)}
                        title="Eliminar tratamiento"
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

      {/* Modal para crear/editar tratamiento */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton className="modal-header-primary">
          <Modal.Title>
            {editingTratamiento ? "Editar Tratamiento" : "Nuevo Tratamiento"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Tratamiento *</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Ej: Limpieza Dental, Ortodoncia, Implante, etc."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Descripción detallada del tratamiento"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>URL de la Imagen</Form.Label>
              <Form.Control
                type="url"
                name="imagen"
                value={formData.imagen}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen-tratamiento.jpg"
              />
              <Form.Text className="text-muted">
                URL de la imagen del tratamiento (opcional)
              </Form.Text>
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Precio *</Form.Label>
                  <Form.Control
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="Ej: 50000"
                  />
                  <Form.Text className="text-muted">
                    Ingresa el precio en pesos
                  </Form.Text>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Duración (minutos)</Form.Label>
                  <Form.Control
                    type="number"
                    name="duracion"
                    value={formData.duracion}
                    onChange={handleChange}
                    min="0"
                    placeholder="Ej: 30, 60, 90"
                  />
                  <Form.Text className="text-muted">
                    Tiempo estimado del procedimiento
                  </Form.Text>
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>
                <i className="bi bi-person-badge me-2"></i>
                Médicos Especialistas Asignados
              </Form.Label>
              <Form.Select
                multiple
                value={formData.medicos}
                onChange={handleMedicosChange}
                style={{ height: "150px" }}
              >
                {medicos.map((medico) => (
                  <option key={medico._id} value={medico._id}>
                    Dr. {medico.medicoNombre} {medico.medicoApellido} - {medico.especialidad}
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Mantén presionado Ctrl (o Cmd en Mac) para seleccionar múltiples médicos.
                Los médicos asignados podrán atender citas de este tratamiento.
              </Form.Text>
              {formData.medicos.length > 0 && (
                <div className="mt-2">
                  <small className="text-success">
                    <i className="bi bi-check-circle me-1"></i>
                    {formData.medicos.length} médico(s) seleccionado(s)
                  </small>
                </div>
              )}
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
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
                    {editingTratamiento ? "Actualizar" : "Crear"}
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

export default AdminTratamientos;

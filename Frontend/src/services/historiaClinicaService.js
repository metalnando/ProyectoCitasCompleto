import { API_ENDPOINTS, getAuthHeaders } from '../config/api';

class HistoriaClinicaService {
  async obtenerTodas() {
    try {
      const response = await fetch(API_ENDPOINTS.HISTORIA_CLINICA, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener historias clínicas');
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async obtenerPorId(id) {
    try {
      const response = await fetch(`${API_ENDPOINTS.HISTORIA_CLINICA}/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener historia clínica');
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async obtenerPorPaciente(pacienteId) {
    try {
      const url = API_ENDPOINTS.HISTORIA_BY_PACIENTE(pacienteId);
      const headers = getAuthHeaders();

      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}: Error al obtener historial del paciente`);
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async obtenerPorMedico(medicoId) {
    try {
      const response = await fetch(API_ENDPOINTS.HISTORIA_BY_MEDICO(medicoId), {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener historias del médico');
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async obtenerPorCita(citaId) {
    try {
      const response = await fetch(API_ENDPOINTS.HISTORIA_BY_CITA(citaId), {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener historia de la cita');
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async crear(historiaData) {
    try {
      const response = await fetch(API_ENDPOINTS.HISTORIA_CLINICA, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(historiaData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al crear historia clínica');
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async crearConImagenes(historiaData, imagenes) {
    try {
      const formData = new FormData();

      // Agregar campos de la historia
      Object.keys(historiaData).forEach((key) => {
        if (historiaData[key] !== undefined && historiaData[key] !== null) {
          if (typeof historiaData[key] === 'object' && key !== 'imagenes') {
            formData.append(key, JSON.stringify(historiaData[key]));
          } else {
            formData.append(key, historiaData[key]);
          }
        }
      });

      // Agregar imágenes
      if (imagenes && imagenes.length > 0) {
        imagenes.forEach((imagen) => {
          formData.append('imagenes', imagen);
        });
      }

      const token = localStorage.getItem('medicoToken') || localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_ENDPOINTS.HISTORIA_CLINICA}/con-imagenes`, {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al crear historia clínica');
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async actualizar(id, historiaData) {
    try {
      const response = await fetch(`${API_ENDPOINTS.HISTORIA_CLINICA}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(historiaData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar historia clínica');
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async agregarImagenes(id, imagenes, descripciones = []) {
    try {
      const formData = new FormData();
      imagenes.forEach((imagen) => {
        formData.append('imagenes', imagen);
      });
      descripciones.forEach((desc) => {
        formData.append('descripciones', desc);
      });

      const token = localStorage.getItem('medicoToken') || localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_ENDPOINTS.HISTORIA_CLINICA}/${id}/imagenes`, {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al agregar imágenes');
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async eliminar(id) {
    try {
      const response = await fetch(`${API_ENDPOINTS.HISTORIA_CLINICA}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar historia clínica');
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

export default new HistoriaClinicaService();

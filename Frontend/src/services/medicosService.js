import { API_ENDPOINTS, getAuthHeaders } from '../config/api';

/**
 * Servicio para gestionar médicos
 */
class MedicosService {
  /**
   * Obtener todos los médicos
   */
  async obtenerMedicos() {
    try {
      const response = await fetch(API_ENDPOINTS.MEDICOS, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener los médicos');
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error de conexión con el servidor'
      };
    }
  }

  /**
   * Obtener médico por ID
   */
  async obtenerMedicoPorId(id) {
    try {
      const response = await fetch(`${API_ENDPOINTS.MEDICOS}/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener el médico');
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error de conexión con el servidor'
      };
    }
  }

  /**
   * Crear nuevo médico (con soporte para imagen)
   */
  async crearMedico(medicoData, imagenFile = null) {
    try {
      const formData = new FormData();

      // Agregar campos del médico
      formData.append('medicoNombre', medicoData.medicoNombre);
      formData.append('medicoApellido', medicoData.medicoApellido);
      formData.append('medicoDocumento', medicoData.medicoDocumento);
      formData.append('medicoTelefono', medicoData.medicoTelefono);
      formData.append('medicoEmail', medicoData.medicoEmail);
      if (medicoData.especialidad) {
        formData.append('especialidad', medicoData.especialidad);
      }

      // Agregar imagen si existe
      if (imagenFile) {
        formData.append('imagen', imagenFile);
      }

      // Obtener token de autorización
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(API_ENDPOINTS.MEDICOS, {
        method: 'POST',
        headers: headers, // No incluir Content-Type, el navegador lo configura automáticamente para FormData
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear el médico');
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error de conexión con el servidor'
      };
    }
  }

  /**
   * Actualizar médico (con soporte para imagen)
   */
  async actualizarMedico(id, medicoData, imagenFile = null) {
    try {
      const formData = new FormData();

      // Agregar campos del médico
      formData.append('medicoNombre', medicoData.medicoNombre);
      formData.append('medicoApellido', medicoData.medicoApellido);
      formData.append('medicoDocumento', medicoData.medicoDocumento);
      formData.append('medicoTelefono', medicoData.medicoTelefono);
      formData.append('medicoEmail', medicoData.medicoEmail);
      if (medicoData.especialidad) {
        formData.append('especialidad', medicoData.especialidad);
      }

      // Agregar imagen si existe
      if (imagenFile) {
        formData.append('imagen', imagenFile);
      }

      // Obtener token de autorización
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_ENDPOINTS.MEDICOS}/${id}`, {
        method: 'PUT',
        headers: headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar el médico');
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error de conexión con el servidor'
      };
    }
  }

  /**
   * Eliminar médico
   */
  async eliminarMedico(id) {
    try {
      const response = await fetch(`${API_ENDPOINTS.MEDICOS}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar el médico');
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error de conexión con el servidor'
      };
    }
  }
}

export default new MedicosService();

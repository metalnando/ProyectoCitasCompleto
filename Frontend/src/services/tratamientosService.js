import { API_ENDPOINTS, getAuthHeaders } from '../config/api';

/**
 * Servicio para gestionar tratamientos
 */
class TratamientosService {
  /**
   * Obtener todos los tratamientos
   */
  async obtenerTratamientos() {
    try {
      const response = await fetch(API_ENDPOINTS.TRATAMIENTOS, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener los tratamientos');
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
   * Obtener tratamiento por ID
   */
  async obtenerTratamientoPorId(id) {
    try {
      const response = await fetch(`${API_ENDPOINTS.TRATAMIENTOS}/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener el tratamiento');
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
   * Crear nuevo tratamiento
   */
  async crearTratamiento(tratamientoData) {
    try {
      const response = await fetch(API_ENDPOINTS.TRATAMIENTOS, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(tratamientoData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear el tratamiento');
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
   * Actualizar tratamiento
   */
  async actualizarTratamiento(id, tratamientoData) {
    try {
      const response = await fetch(`${API_ENDPOINTS.TRATAMIENTOS}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(tratamientoData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar el tratamiento');
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
   * Eliminar tratamiento
   */
  async eliminarTratamiento(id) {
    try {
      const response = await fetch(`${API_ENDPOINTS.TRATAMIENTOS}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar el tratamiento');
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
   * Cambiar estado de tratamiento
   */
  async cambiarEstadoTratamiento(id, estado) {
    try {
      const response = await fetch(`${API_ENDPOINTS.TRATAMIENTOS}/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ estado }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al cambiar el estado');
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

export default new TratamientosService();

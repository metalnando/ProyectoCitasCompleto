import { API_ENDPOINTS, getAuthHeaders } from '../config/api';

/**
 * Servicio para obtener estadísticas del dashboard
 */
class EstadisticasService {
  /**
   * Obtener estadísticas generales del dashboard
   */
  async obtenerEstadisticas() {
    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/estadisticas`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener estadísticas');
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
   * Obtener tratamientos más utilizados
   */
  async obtenerTratamientosMasUsados() {
    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/estadisticas/tratamientos-populares`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener tratamientos populares');
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
   * Obtener lista detallada de usuarios registrados
   */
  async obtenerUsuarios() {
    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/estadisticas/usuarios`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener usuarios');
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
   * Obtener lista detallada de citas
   */
  async obtenerCitas() {
    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/estadisticas/citas`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener citas');
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
   * Obtener lista detallada de citas pendientes
   */
  async obtenerCitasPendientes() {
    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/estadisticas/citas-pendientes`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener citas pendientes');
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

export default new EstadisticasService();

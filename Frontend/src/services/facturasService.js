import { API_ENDPOINTS, getAuthHeaders } from '../config/api';

/**
 * Servicio para gestionar facturas
 */
class FacturasService {
  /**
   * Obtener todas las facturas
   */
  async obtenerFacturas() {
    try {
      const response = await fetch(API_ENDPOINTS.FACTURAS, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener las facturas');
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
   * Obtener factura por ID
   */
  async obtenerFacturaPorId(id) {
    try {
      const response = await fetch(`${API_ENDPOINTS.FACTURAS}/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener la factura');
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
   * Obtener facturas por paciente
   */
  async obtenerFacturasPorPaciente(pacienteId) {
    try {
      const response = await fetch(API_ENDPOINTS.FACTURAS_BY_PACIENTE(pacienteId), {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener las facturas');
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
   * Crear nueva factura
   */
  async crearFactura(facturaData) {
    try {
      const response = await fetch(API_ENDPOINTS.FACTURAS, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(facturaData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear la factura');
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

export default new FacturasService();

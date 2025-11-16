import { API_ENDPOINTS, getAuthHeaders } from '../config/api';

/**
 * Servicio para gestionar pagos
 */
class PagosService {
  /**
   * Procesar un pago
   */
  async procesarPago(pagoData) {
    try {
      const response = await fetch(`${API_ENDPOINTS.PAGOS}/procesar`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(pagoData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al procesar el pago');
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
   * Obtener todos los pagos
   */
  async obtenerPagos() {
    try {
      const response = await fetch(API_ENDPOINTS.PAGOS, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener los pagos');
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
   * Obtener pago por ID
   */
  async obtenerPagoPorId(id) {
    try {
      const response = await fetch(`${API_ENDPOINTS.PAGOS}/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener el pago');
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
   * Obtener pagos por factura
   */
  async obtenerPagosPorFactura(facturaId) {
    try {
      const response = await fetch(`${API_ENDPOINTS.PAGOS}/factura/${facturaId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener los pagos');
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

export default new PagosService();

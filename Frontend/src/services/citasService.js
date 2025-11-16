import { API_ENDPOINTS, getAuthHeaders } from '../config/api';

/**
 * Servicio para gestionar citas
 */
class CitasService {
  /**
   * Crear nueva cita
   */
  async crearCita(citaData) {
    try {
      const response = await fetch(API_ENDPOINTS.CITAS, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(citaData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear la cita');
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
   * Obtener todas las citas
   */
  async obtenerCitas() {
    try {
      const response = await fetch(API_ENDPOINTS.CITAS, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener las citas');
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
   * Obtener cita por ID
   */
  async obtenerCitaPorId(id) {
    try {
      const response = await fetch(`${API_ENDPOINTS.CITAS}/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener la cita');
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
   * Obtener historial de citas por paciente
   */
  async obtenerHistorialPorPaciente(pacienteId) {
    try {
      const response = await fetch(API_ENDPOINTS.CITAS_BY_PACIENTE(pacienteId), {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener el historial');
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
   * Obtener citas por médico
   */
  async obtenerCitasPorMedico(medicoId, fecha = null) {
    try {
      let url = API_ENDPOINTS.CITAS_BY_MEDICO(medicoId);
      if (fecha) {
        url += `?fecha=${fecha}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener las citas del médico');
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
   * Obtener citas por estado
   */
  async obtenerCitasPorEstado(estado) {
    try {
      const response = await fetch(API_ENDPOINTS.CITAS_BY_ESTADO(estado), {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener las citas');
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
   * Actualizar cita
   */
  async actualizarCita(id, citaData) {
    try {
      const response = await fetch(`${API_ENDPOINTS.CITAS}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(citaData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar la cita');
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
   * Actualizar estado de cita
   */
  async actualizarEstadoCita(id, estado) {
    try {
      const response = await fetch(`${API_ENDPOINTS.CITAS}/${id}/estado`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ estado }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar el estado');
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
   * Eliminar cita (eliminación lógica)
   */
  async eliminarCita(id) {
    try {
      const response = await fetch(`${API_ENDPOINTS.CITAS}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar la cita');
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
   * Obtener horas ocupadas de un médico en una fecha específica
   */
  async obtenerHorasOcupadas(medicoId, fecha) {
    try {
      const response = await fetch(`${API_ENDPOINTS.CITAS}/horas-ocupadas/${medicoId}?fecha=${fecha}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener horas ocupadas');
      }

      return { success: true, data: data.horasOcupadas || [] };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error de conexión con el servidor',
        data: []
      };
    }
  }

  /**
   * Registrar pago de una cita
   */
  async registrarPago(citaId, metodoPago, comprobantePago = null) {
    try {
      const response = await fetch(`${API_ENDPOINTS.CITAS}/${citaId}/pagar`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          metodoPago,
          comprobantePago,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar el pago');
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

export default new CitasService();

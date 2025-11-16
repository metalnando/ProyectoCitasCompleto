import { API_BASE_URL } from '../config/api';

// Obtener headers con autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

class UsuariosService {
  /**
   * Obtener perfil del usuario actual
   */
  async obtenerPerfil() {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/perfil`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener el perfil');
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      return {
        success: false,
        message: error.message || 'Error de conexión con el servidor',
      };
    }
  }

  /**
   * Actualizar perfil del usuario
   */
  async actualizarPerfil(perfilData) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/perfil`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(perfilData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar el perfil');
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return {
        success: false,
        message: error.message || 'Error de conexión con el servidor',
      };
    }
  }
}

export default new UsuariosService();

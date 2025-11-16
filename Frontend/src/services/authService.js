import { API_ENDPOINTS, getAuthHeaders } from '../config/api';

/**
 * Servicio de autenticación
 */
class AuthService {
  /**
   * Login de usuario
   */
  async login(email, password) {
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // Guardar tokens y datos del usuario
      if (data.tokens) {
        localStorage.setItem('token', data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.tokens.refreshToken);
      }

      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
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
   * Registro de nuevo usuario
   */
  async register(userData) {
    try {
      console.log('🔍 [DEBUG] Iniciando registro...');
      console.log('📤 [DEBUG] URL:', API_ENDPOINTS.REGISTER);
      console.log('📦 [DEBUG] Datos a enviar:', userData);

      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('📥 [DEBUG] Respuesta recibida - Status:', response.status);

      const data = await response.json();
      console.log('📊 [DEBUG] Data recibida:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar usuario');
      }

      // Guardar tokens y datos del usuario
      if (data.tokens) {
        localStorage.setItem('token', data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.tokens.refreshToken);
        console.log('✅ [DEBUG] Tokens guardados');
      }

      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('✅ [DEBUG] Usuario guardado');
      }

      return { success: true, data };
    } catch (error) {
      console.error('❌ [DEBUG] Error capturado:', error);
      console.error('❌ [DEBUG] Error mensaje:', error.message);
      console.error('❌ [DEBUG] Error stack:', error.stack);

      return {
        success: false,
        message: error.message || 'Error de conexión con el servidor'
      };
    }
  }

  /**
   * Obtener perfil del usuario autenticado
   */
  async getProfile() {
    try {
      const response = await fetch(API_ENDPOINTS.PROFILE, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener perfil');
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
   * Refrescar token de acceso
   */
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        throw new Error('No hay refresh token disponible');
      }

      const response = await fetch(API_ENDPOINTS.REFRESH_TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al refrescar token');
      }

      // Actualizar token de acceso
      if (data.tokens?.accessToken) {
        localStorage.setItem('token', data.tokens.accessToken);
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
   * Cerrar sesión
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  /**
   * Obtener usuario del localStorage
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export default new AuthService();

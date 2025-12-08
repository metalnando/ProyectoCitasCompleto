// Configuración de la API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export default API_BASE_URL;

export const API_ENDPOINTS = {
  // Auth - usando el controlador de usuarios
  LOGIN: `${API_BASE_URL}/usuarios/login`,
  REGISTER: `${API_BASE_URL}/usuarios/register`,
  REFRESH_TOKEN: `${API_BASE_URL}/usuarios/refresh`,
  PROFILE: `${API_BASE_URL}/usuarios/perfil`,

  // Citas
  CITAS: `${API_BASE_URL}/citas`,
  CITAS_BY_PACIENTE: (pacienteId) => `${API_BASE_URL}/citas/historial/${pacienteId}`,
  CITAS_BY_MEDICO: (medicoId) => `${API_BASE_URL}/citas/medico/${medicoId}`,
  CITAS_BY_ESTADO: (estado) => `${API_BASE_URL}/citas/estado/${estado}`,

  // Médicos
  MEDICOS: `${API_BASE_URL}/medico`,

  // Pacientes
  PACIENTES: `${API_BASE_URL}/pacientes`,

  // Facturas
  FACTURAS: `${API_BASE_URL}/facturas`,
  FACTURAS_BY_PACIENTE: (pacienteId) => `${API_BASE_URL}/facturas/paciente/${pacienteId}`,

  // Pagos
  PAGOS: `${API_BASE_URL}/pago`,

  // Tratamientos
  TRATAMIENTOS: `${API_BASE_URL}/tratamientos`,

  // Historia Clínica
  HISTORIA_CLINICA: `${API_BASE_URL}/historia-clinica`,
  HISTORIA_BY_PACIENTE: (pacienteId) => `${API_BASE_URL}/historia-clinica/paciente/${pacienteId}`,
  HISTORIA_BY_MEDICO: (medicoId) => `${API_BASE_URL}/historia-clinica/medico/${medicoId}`,
  HISTORIA_BY_CITA: (citaId) => `${API_BASE_URL}/historia-clinica/cita/${citaId}`,

  // Login Médico
  MEDICO_LOGIN: `${API_BASE_URL}/medico/login`,

  // Base URL para construcción dinámica
  BASE_URL: API_BASE_URL,
};

// Helper para obtener el token del localStorage
export const getAuthToken = () => {
  // Primero intentar obtener token de médico, luego de usuario
  const medicoToken = localStorage.getItem('medicoToken');
  const userToken = localStorage.getItem('token');
  return medicoToken || userToken;
};

// Helper para obtener headers con autenticación
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};




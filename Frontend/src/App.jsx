import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'animate.css/animate.min.css';
import './index.css';

import { AuthProvider } from './context/AuthContext';
import NavbarOdonto from './components/NavbarOdonto';
import NavbarMedico from './components/NavbarMedico';
import NavbarAdmin from './components/NavbarAdmin';
import Footer from './components/Footer';
import { useLocation } from 'react-router-dom';

import HomeDentix from './pages/HomeDentix';
import HistorialClinico from './pages/HistorialClinico';
import Especialistas from './pages/Especialistas';
import Login from './pages/Login';
import Register from './pages/Register';
import AgendarCita from './pages/AgendarCita';
import Tratamientos from './pages/Tratamientos';
import SobreNosotros from './pages/SobreNosotros';
import Perfil from './pages/Perfil';
import Admin from './pages/Admin';
import AdminMedicos from './pages/AdminMedicos';
import AdminTratamientos from './pages/AdminTratamientos';
import MisCitas from './pages/MisCitas';
import Pagos from './pages/Pagos';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import UserRoute from './components/UserRoute';

// Portal del Médico
import LoginMedico from './pages/LoginMedico';
import MedicoDashboard from './pages/MedicoDashboard';
import NuevaHistoriaClinica from './pages/NuevaHistoriaClinica';
import HistorialPaciente from './pages/HistorialPaciente';

// Componente para seleccionar el navbar correcto
const AppContent = () => {
  const location = useLocation();
  const isMedicoRoute = location.pathname.startsWith('/medico/') && location.pathname !== '/medico/login';
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Determinar qué navbar mostrar
  let navbar;
  if (isMedicoRoute) {
    navbar = <NavbarMedico />;
  } else if (isAdminRoute) {
    navbar = <NavbarAdmin />;
  } else {
    navbar = <NavbarOdonto />;
  }

  return (
    <div className="app-container">
      {navbar}
      <main>
        <Routes>
          <Route path="/" element={<HomeDentix />} />

          <Route
            path="/agendar-cita"
            element={
              <UserRoute>
                <AgendarCita />
              </UserRoute>
            }
          />
          <Route
            path="/historial"
            element={
              <UserRoute>
                <HistorialClinico />
              </UserRoute>
            }
          />
          <Route
            path="/mis-citas"
            element={
              <UserRoute>
                <MisCitas />
              </UserRoute>
            }
          />
          <Route
            path="/pagos"
            element={
              <UserRoute>
                <Pagos />
              </UserRoute>
            }
          />
          <Route path="/especialistas" element={<Especialistas />} />
          <Route path="/tratamientos" element={<Tratamientos />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />

          <Route
            path="/perfil"
            element={
              <PrivateRoute>
                <Perfil />
              </PrivateRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas de Administración - Solo para administradores */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/medicos"
            element={
              <AdminRoute>
                <AdminMedicos />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/tratamientos"
            element={
              <AdminRoute>
                <AdminTratamientos />
              </AdminRoute>
            }
          />

          {/* Rutas del Portal del Médico */}
          <Route path="/medico/login" element={<LoginMedico />} />
          <Route path="/medico/dashboard" element={<MedicoDashboard />} />
          <Route path="/medico/historia-clinica/nueva" element={<NuevaHistoriaClinica />} />
          <Route path="/medico/paciente/:pacienteId/historial" element={<HistorialPaciente />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
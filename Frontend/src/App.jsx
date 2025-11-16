import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'animate.css/animate.min.css';
import './index.css';

import { AuthProvider } from './context/AuthContext'; 
import NavbarOdonto from './components/NavbarOdonto';
import Footer from './components/Footer';


import HomeDentix from './pages/HomeDentix';
import HistorialClinico from './pages/HistorialClinico';
import Especialistas from './pages/Especialistas';
import Login from './pages/Login';
import Register from './pages/Register';
import AgendarCita from './pages/AgendarCita';
import Tratamientos from './pages/Tratamientos';
import Perfil from './pages/Perfil';
import Admin from './pages/Admin';
import AdminMedicos from './pages/AdminMedicos';
import AdminTratamientos from './pages/AdminTratamientos';
import MisCitas from './pages/MisCitas';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

import UserRoute from './components/UserRoute';
function App() {
  return (
    <Router>
      <AuthProvider> 
        <div className="app-container">
          <NavbarOdonto />
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
              <Route path="/especialistas" element={<Especialistas />} />
              <Route path="/tratamientos" element={<Tratamientos />} />

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

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
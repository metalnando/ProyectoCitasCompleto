import { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar si hay un usuario autenticado al cargar la aplicación
        if (authService.isAuthenticated()) {
            const currentUser = authService.getCurrentUser();
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const result = await authService.login(email, password);

            if (result.success) {
                setUser(result.data.user);
                return { success: true, data: result.data };
            } else {
                return { success: false, message: result.message };
            }
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error de conexión con el servidor'
            };
        }
    };

    const register = async (userData) => {
        try {
            const result = await authService.register(userData);

            if (result.success) {
                setUser(result.data.user);
                return { success: true, data: result.data };
            } else {
                return { success: false, message: result.message };
            }
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Error de conexión con el servidor'
            };
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const refreshToken = async () => {
        try {
            const result = await authService.refreshToken();
            return result.success;
        } catch (error) {
            console.error('Error al refrescar token:', error);
            return false;
        }
    };

    const updateUser = (userData) => {
        setUser(userData);
    };

    const value = {
        user,
        login,
        register,
        logout,
        refreshToken,
        updateUser,
        isAuthenticated: !!user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
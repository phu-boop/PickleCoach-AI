import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [role, setRole] = useState(sessionStorage.getItem('role') || null);
  const [token, setToken] = useState(sessionStorage.getItem('token') || null);
  const [id_user, setIdUser] = useState(sessionStorage.getItem('id_user') || null);
  const [email, setEmail] = useState(sessionStorage.getItem('email') || null);

  const login = (newToken, newRole, newId, email) => {
    sessionStorage.setItem('id_user', newId);
    sessionStorage.setItem('token', newToken);
    sessionStorage.setItem('role', newRole);
    sessionStorage.setItem('email', email);
    setEmail(email);
    setToken(newToken);
    setRole(newRole);
    setIdUser(newId);
  };

  const loginWithGoogle = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google'; // Redirect đến endpoint Google OAuth2
  };

  const logout = () => {
    sessionStorage.removeItem('id_user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('email');
    setEmail(null);
    setToken(null);
    setRole(null);
    setIdUser(null);
  };

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    const storedRole = sessionStorage.getItem('role');
    if (storedToken) setToken(storedToken);
    if (storedRole) {
      // Chuẩn hóa role khi lấy từ sessionStorage
      const normalizedRole = storedRole.startsWith('ROLE_') ? storedRole : `ROLE_${storedRole}`;
      setRole(normalizedRole);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ role, token, id_user, login, logout, email }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

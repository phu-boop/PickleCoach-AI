import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [role, setRole] = useState(sessionStorage.getItem('role') || null);
  const [token, setToken] = useState(sessionStorage.getItem('token') || null);
  const [id_user, setIdUser] = useState(sessionStorage.getItem('id_user') || null);

  const login = (newToken, newRole, newId) => {
    sessionStorage.setItem('id_user', newId);
    sessionStorage.setItem('token', newToken);
    sessionStorage.setItem('role', newRole);
    setToken(newToken);
    setRole(newRole);
    setIdUser(newId);
  };

  const logout = () => {
    sessionStorage.removeItem('id_user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
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
    <AuthContext.Provider value={{ role, token, id_user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// Simplified AuthContext — no login, fixed student user
// Authentication will be implemented in a future phase
import { createContext, useContext } from 'react';

const AuthContext = createContext(null);

const FIXED_USER = {
  id: 'student1',
  nome: 'Estudante',
  email: ''
};

export function AuthProvider({ children }) {
  return (
    <AuthContext.Provider value={{
      user: FIXED_USER,
      userType: 'aluno',
      isAuthenticated: true,
      logout: () => {}
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

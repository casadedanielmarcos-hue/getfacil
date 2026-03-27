import { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState(null); // 'aluno' ou 'professor'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
        // Verificar se há usuário salvo no localStorage
                const savedUser = localStorage.getItem('getfacil_user');
        const savedType = localStorage.getItem('getfacil_userType');

                if (savedUser && savedType) {
                        const parsedUser = JSON.parse(savedUser);
                        setUser({ ...parsedUser, tipo: savedType });
                        setUserType(savedType);
                }
        setLoading(false);
  }, []);

  const login = (email, senha, tipo) => {
        const lista = tipo === 'aluno' ? mockUsers.alunos : mockUsers.professores;
        const usuario = lista.find(u => u.email === email && u.senha === senha);

        if (usuario) {
                const usuarioComTipo = { ...usuario, tipo };
                setUser(usuarioComTipo);
                setUserType(tipo);
                localStorage.setItem('getfacil_user', JSON.stringify(usuario));
                localStorage.setItem('getfacil_userType', tipo);
                return { success: true };
        }

        return { success: false, error: 'Email ou senha invalidos' };
  };

  const logout = () => {
        setUser(null);
        setUserType(null);
        localStorage.removeItem('getfacil_user');
        localStorage.removeItem('getfacil_userType');
  };

  const isAuthenticated = !!user;

  return (
        <AuthContext.Provider value={{ user, userType, isAuthenticated, login, logout, loading }}>
          {children}
        </AuthContext.Provider>
      );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
          throw new Error('useAuth deve ser usado dentro de AuthProvider');
    }
    return context;
};

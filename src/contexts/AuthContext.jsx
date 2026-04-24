import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const snap = await getDoc(doc(db, 'alunos', firebaseUser.uid));
          if (snap.exists()) {
            const d = snap.data();
            setUser({
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              nome: d.nome || firebaseUser.email,
              email: d.email || firebaseUser.email,
              cursosMatriculados: d.cursosMatriculados || [],
              progresso: d.progresso || {},
              status: d.status || 'ativo',
            });
          } else {
            setUser({
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              nome: firebaseUser.email,
              email: firebaseUser.email,
              cursosMatriculados: [],
              progresso: {},
              status: 'ativo',
            });
          }
        } catch (err) {
          console.error('Erro ao carregar aluno:', err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = (email, senha) =>
    signInWithEmailAndPassword(auth, email, senha);

  const signup = async (nome, email, senha) => {
    const result = await createUserWithEmailAndPassword(auth, email, senha);
    const uid = result.user.uid;
    await setDoc(doc(db, 'alunos', uid), {
      uid,
      nome,
      email,
      cursosMatriculados: [],
      progresso: {},
      status: 'ativo',
      dataCriacao: serverTimestamp(),
    });
    return result;
  };

  const logout = () => signOut(auth);

  // Atualiza cursosMatriculados localmente após matrícula
  const addCursoMatriculado = (cursoId) => {
    setUser(prev => {
      if (!prev || prev.cursosMatriculados.includes(cursoId)) return prev;
      return { ...prev, cursosMatriculados: [...prev.cursosMatriculados, cursoId] };
    });
  };

  // Atualiza progresso localmente após salvar no Firestore
  const updateProgresso = (cursoId, progData) => {
    setUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        progresso: { ...prev.progresso, [cursoId]: progData },
      };
    });
  };

  return (
    <AuthContext.Provider value={{
      user, loading, login, signup, logout, addCursoMatriculado, updateProgresso,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

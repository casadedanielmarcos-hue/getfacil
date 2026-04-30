import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [gestor, setGestor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const gestorDoc = await getDoc(doc(db, 'gestores', firebaseUser.uid));
        if (gestorDoc.exists()) {
          setUser(firebaseUser);
          setGestor({ uid: firebaseUser.uid, ...gestorDoc.data() });
        } else {
          await signOut(auth);
          setUser(null);
          setGestor(null);
        }
      } else {
        setUser(null);
        setGestor(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, gestor, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

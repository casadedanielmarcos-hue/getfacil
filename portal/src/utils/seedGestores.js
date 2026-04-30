import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';

const GESTORES = [
  { email: 'daniel@getfuturetoday.com', senha: '123456', nome: 'Daniel', role: 'admin' },
  { email: 'well@getfuturetoday.com', senha: '123456', nome: 'Well', role: 'admin' },
];

export async function seedGestores(log = console.log) {
  for (const g of GESTORES) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, g.email, g.senha);
      await setDoc(doc(db, 'gestores', cred.user.uid), {
        nome: g.nome,
        email: g.email,
        role: g.role,
      });
      log(`✅ Gestor "${g.nome}" criado com sucesso.`);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        log(`⚠️  ${g.email} já existe — pulando.`);
      } else {
        log(`❌ Erro em ${g.email}: ${err.message}`);
      }
    }
  }
}

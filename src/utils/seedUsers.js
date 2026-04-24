// Seed de alunos de teste — executar uma única vez no console do navegador:
// import { seedTestUsers } from './utils/seedUsers'; seedTestUsers();

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

const TEST_USERS = [
  {
    nome: 'Aluno Teste 1',
    email: 'alunoteste1@getfuturetoday.com',
    senha: '123456',
    cursosMatriculados: ['c2'],
  },
  {
    nome: 'Aluno Teste 2',
    email: 'alunoteste2@getfuturetoday.com',
    senha: '123456',
    cursosMatriculados: ['c2'],
  },
];

export async function seedTestUsers() {
  for (const u of TEST_USERS) {
    try {
      const result = await createUserWithEmailAndPassword(auth, u.email, u.senha);
      await setDoc(doc(db, 'alunos', result.user.uid), {
        uid: result.user.uid,
        nome: u.nome,
        email: u.email,
        cursosMatriculados: u.cursosMatriculados,
        progresso: {},
        status: 'ativo',
        dataCriacao: serverTimestamp(),
      });
      console.log(`✅ Criado: ${u.email}`);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        console.log(`⚠️ Já existe: ${u.email}`);
      } else {
        console.error(`❌ Erro ao criar ${u.email}:`, err.message);
      }
    }
  }
  console.log('Seed concluído.');
}

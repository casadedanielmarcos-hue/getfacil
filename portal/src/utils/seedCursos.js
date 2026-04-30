import { db } from '../firebase';
import { collection, getDocs, setDoc, doc, serverTimestamp } from 'firebase/firestore';

const CURSOS = [
  {
    id: 'pensamento-computacional',
    titulo: 'Pensamento Computacional',
    subtitulo: 'Lógica e Resolução de Problemas',
    cor: '#0088ff',
    icone: 'cpu',
    publicado: true,
    imagemCapa: '',
    modulos: [],
  },
  {
    id: 'canva',
    titulo: 'Canva',
    subtitulo: 'Design para todos',
    cor: '#00d4ff',
    icone: 'palette',
    publicado: false,
    imagemCapa: '',
    modulos: [],
  },
  {
    id: 'guia-sobrevivencia-offline',
    titulo: 'Guia de Sobrevivência Offline',
    subtitulo: 'Produtividade sem internet',
    cor: '#0055cc',
    icone: 'wifi-off',
    publicado: false,
    imagemCapa: '',
    modulos: [],
  },
  {
    id: 'design-instrucional',
    titulo: 'Design Instrucional',
    subtitulo: 'Criando experiências de aprendizado',
    cor: '#003399',
    icone: 'layout',
    publicado: false,
    imagemCapa: '',
    modulos: [],
  },
];

export async function seedCursos(log = console.log) {
  const snap = await getDocs(collection(db, 'cursos'));
  if (!snap.empty) {
    log?.(`Coleção cursos já possui ${snap.size} documento(s). Seed ignorado.`);
    return;
  }
  for (const curso of CURSOS) {
    await setDoc(doc(db, 'cursos', curso.id), {
      ...curso,
      dataCriacao: serverTimestamp(),
    });
    log?.(`✅ Curso "${curso.titulo}" criado.`);
  }
}

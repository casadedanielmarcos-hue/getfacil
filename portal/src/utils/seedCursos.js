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
    modulos: [
      {
        id: 'm1',
        titulo: 'Módulo 1 — Fundamentos',
        aulas: [
          { id: 'introducao', titulo: 'Introdução', slug: 'introducao', tipo: 'rise360', arquivoPath: '/cursos/pensamento-computacional/introducao/index.html' },
          { id: 'logica', titulo: 'Lógica de Programação', slug: 'logica', tipo: 'rise360', arquivoPath: '/cursos/pensamento-computacional/logica/index.html' },
          { id: 'algoritmos', titulo: 'Algoritmos', slug: 'algoritmos', tipo: 'rise360', arquivoPath: '/cursos/pensamento-computacional/algoritmos/index.html' },
        ],
      },
      {
        id: 'm2',
        titulo: 'Módulo 2 — Estruturas',
        aulas: [
          { id: 'variaveis', titulo: 'Variáveis e Tipos', slug: 'variaveis', tipo: 'rise360', arquivoPath: '/cursos/pensamento-computacional/variaveis/index.html' },
          { id: 'condicoes', titulo: 'Condições e Decisões', slug: 'condicoes', tipo: 'rise360', arquivoPath: '/cursos/pensamento-computacional/condicoes/index.html' },
        ],
      },
      {
        id: 'm3',
        titulo: 'Módulo 3 — Prática',
        aulas: [
          { id: 'projeto1', titulo: 'Projeto Prático 1', slug: 'projeto1', tipo: 'rise360', arquivoPath: '/cursos/pensamento-computacional/projeto1/index.html' },
          { id: 'projeto2', titulo: 'Projeto Prático 2', slug: 'projeto2', tipo: 'rise360', arquivoPath: '/cursos/pensamento-computacional/projeto2/index.html' },
          { id: 'conclusao', titulo: 'Conclusão', slug: 'conclusao', tipo: 'rise360', arquivoPath: '/cursos/pensamento-computacional/conclusao/index.html' },
        ],
      },
    ],
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

// Mock Data - Get Fácil
// Fácil de substituir por chamadas de API posteriormente

export const mockUsers = {
  alunos: [
    { id: 'a1', nome: 'Maria Silva', email: 'maria@email.com', senha: '123456', turma: 'Turma A' },
    { id: 'a2', nome: 'João Santos', email: 'joao@email.com', senha: '123456', turma: 'Turma A' },
    { id: 'a3', nome: 'Ana Oliveira', email: 'ana@email.com', senha: '123456', turma: 'Turma B' },
    { id: 'a4', nome: 'Carlos Souza', email: 'carlos@email.com', senha: '123456', turma: 'Turma B' },
    { id: 'a5', nome: 'Beatriz Lima', email: 'beatriz@email.com', senha: '123456', turma: 'Turma C' },
  ],
  professores: [
    { id: 'p1', nome: 'Prof. Roberto Mendes', email: 'roberto@email.com', senha: '123456' },
    { id: 'p2', nome: 'Prof. Lucia Ferreira', email: 'lucia@email.com', senha: '123456' },
  ]
};

export const mockCursos = [
  {
    id: 'c1',
    nome: 'Desenvolvimento Web Completo',
    descricao: 'Aprenda HTML, CSS, JavaScript e React do zero ao avançado',
    capa: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop',
    professorId: 'p1',
    modulos: [
      {
        id: 'm1',
        nome: 'Introdução ao HTML',
        ordem: 1,
        aulas: [
          { id: 'a1', nome: 'O que é HTML?', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duracao: '15:30', ordem: 1 },
          { id: 'a2', nome: 'Tags básicas', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duracao: '22:15', ordem: 2 },
          { id: 'a3', nome: 'Formulários', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duracao: '18:45', ordem: 3 },
        ],
        avaliacao: {
          id: 'av1',
          titulo: 'Avaliação - HTML Básico',
          questoes: [
            {
              id: 'q1',
              pergunta: 'Qual tag é usada para criar um parágrafo em HTML?',
              opcoes: ['<paragraph>', '<p>', '<text>', '<para>'],
              correta: 1
            },
            {
              id: 'q2',
              pergunta: 'O que significa HTML?',
              opcoes: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'],
              correta: 0
            },
            {
              id: 'q3',
              pergunta: 'Qual tag cria um link em HTML?',
              opcoes: ['<link>', '<a>', '<href>', '<url>'],
              correta: 1
            }
          ]
        }
      },
      {
        id: 'm2',
        nome: 'CSS Fundamentos',
        ordem: 2,
        aulas: [
          { id: 'a4', nome: 'Introdução ao CSS', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duracao: '20:00', ordem: 1 },
          { id: 'a5', nome: 'Seletores CSS', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duracao: '25:30', ordem: 2 },
          { id: 'a6', nome: 'Flexbox', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duracao: '30:00', ordem: 3 },
        ],
        avaliacao: {
          id: 'av2',
          titulo: 'Avaliação - CSS Básico',
          questoes: [
            {
              id: 'q4',
              pergunta: 'Qual propriedade altera a cor do texto?',
              opcoes: ['text-color', 'font-color', 'color', 'text-style'],
              correta: 2
            },
            {
              id: 'q5',
              pergunta: 'Como selecionar um elemento por ID no CSS?',
              opcoes: ['.elemento', '#elemento', '*elemento', '@elemento'],
              correta: 1
            }
          ]
        }
      },
      {
        id: 'm3',
        nome: 'JavaScript Essencial',
        ordem: 3,
        aulas: [
          { id: 'a7', nome: 'Variáveis e Tipos', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duracao: '28:00', ordem: 1 },
          { id: 'a8', nome: 'Funções', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duracao: '35:00', ordem: 2 },
          { id: 'a9', nome: 'DOM Manipulation', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duracao: '40:00', ordem: 3 },
        ],
        avaliacao: {
          id: 'av3',
          titulo: 'Avaliação - JavaScript Básico',
          questoes: [
            {
              id: 'q6',
              pergunta: 'Qual palavra-chave declara uma variável que pode ser alterada?',
              opcoes: ['const', 'let', 'var', 'let e var'],
              correta: 3
            },
            {
              id: 'q7',
              pergunta: 'Como exibir algo no console?',
              opcoes: ['print()', 'console.log()', 'log()', 'display()'],
              correta: 1
            }
          ]
        }
      }
    ],
    avaliacaoFinal: {
      id: 'avf1',
      titulo: 'Avaliação Final - Desenvolvimento Web',
      questoes: [
        {
          id: 'qf1',
          pergunta: 'Qual é a estrutura básica de um documento HTML?',
          opcoes: ['<html><head><body>', '<head><html><body>', '<body><head><html>', '<html><body><head>'],
          correta: 0
        },
        {
          id: 'qf2',
          pergunta: 'O que é o DOM?',
          opcoes: ['Document Object Model', 'Data Object Model', 'Document Oriented Model', 'Data Oriented Method'],
          correta: 0
        },
        {
          id: 'qf3',
          pergunta: 'Qual display do CSS coloca elementos em linha?',
          opcoes: ['block', 'inline', 'flex', 'grid'],
          correta: 1
        },
        {
          id: 'qf4',
          pergunta: 'Como adicionar um evento de clique em JavaScript?',
          opcoes: ['onClick()', 'addEventListener("click")', 'addClick()', 'setClick()'],
          correta: 1
        },
        {
          id: 'qf5',
          pergunta: 'Qual propriedade CSS centraliza horizontalmente um elemento block?',
          opcoes: ['text-align: center', 'margin: 0 auto', 'align: center', 'center: true'],
          correta: 1
        }
      ]
    }
  },
  {
    id: 'c2',
    nome: 'Marketing Digital',
    descricao: 'Estratégias completas de marketing para o mundo digital',
    capa: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
    professorId: 'p1',
    modulos: [
      {
        id: 'm4',
        nome: 'Fundamentos do Marketing Digital',
        ordem: 1,
        aulas: [
          { id: 'a10', nome: 'O que é Marketing Digital', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duracao: '20:00', ordem: 1 },
          { id: 'a11', nome: 'Funil de Vendas', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duracao: '25:00', ordem: 2 },
        ],
        avaliacao: {
          id: 'av4',
          titulo: 'Avaliação - Fundamentos',
          questoes: [
            {
              id: 'q8',
              pergunta: 'O que é um lead?',
              opcoes: ['Um cliente fiel', 'Um potencial cliente', 'Um funcionário', 'Um fornecedor'],
              correta: 1
            }
          ]
        }
      },
      {
        id: 'm5',
        nome: 'Redes Sociais',
        ordem: 2,
        aulas: [
          { id: 'a12', nome: 'Instagram Marketing', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duracao: '30:00', ordem: 1 },
          { id: 'a13', nome: 'Facebook Ads', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duracao: '35:00', ordem: 2 },
        ],
        avaliacao: {
          id: 'av5',
          titulo: 'Avaliação - Redes Sociais',
          questoes: [
            {
              id: 'q9',
              pergunta: 'Qual métrica mede o alcance de uma publicação?',
              opcoes: ['Likes', 'Impressões', 'Comentários', 'Salvos'],
              correta: 1
            }
          ]
        }
      }
    ],
    avaliacaoFinal: {
      id: 'avf2',
      titulo: 'Avaliação Final - Marketing Digital',
      questoes: [
        {
          id: 'qf6',
          pergunta: 'O que significa ROI?',
          opcoes: ['Return on Investment', 'Rate of Interest', 'Return of Income', 'Rate on Investment'],
          correta: 0
        },
        {
          id: 'qf7',
          pergunta: 'Qual é o objetivo do remarketing?',
          opcoes: ['Alcançar novos clientes', 'Reengajar visitantes anteriores', 'Criar novos produtos', 'Reduzir custos'],
          correta: 1
        }
      ]
    }
  },
  {
    id: 'c3',
    nome: 'Excel Avançado',
    descricao: 'Domine fórmulas, tabelas dinâmicas e automações',
    capa: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&h=250&fit=crop',
    professorId: 'p2',
    modulos: [
      {
        id: 'm6',
        nome: 'Fórmulas Avançadas',
        ordem: 1,
        aulas: [
          { id: 'a14', nome: 'PROCV e PROCH', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duracao: '25:00', ordem: 1 },
          { id: 'a15', nome: 'ÍNDICE e CORRESP', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duracao: '30:00', ordem: 2 },
        ],
        avaliacao: {
          id: 'av6',
          titulo: 'Avaliação - Fórmulas',
          questoes: [
            {
              id: 'q10',
              pergunta: 'O que faz a função PROCV?',
              opcoes: ['Procura vertical', 'Procura horizontal', 'Soma valores', 'Conta células'],
              correta: 0
            }
          ]
        }
      }
    ],
    avaliacaoFinal: {
      id: 'avf3',
      titulo: 'Avaliação Final - Excel',
      questoes: [
        {
          id: 'qf8',
          pergunta: 'Qual função conta células não vazias?',
          opcoes: ['CONT.SE', 'CONT.VALORES', 'CONTAR', 'SOMA'],
          correta: 1
        }
      ]
    }
  }
];

// Progresso dos alunos
export const mockProgresso = [
  // Maria - Curso 1 em andamento (60%)
  {
    alunoId: 'a1',
    cursoId: 'c1',
    status: 'andamento',
    aulasAssistidas: ['a1', 'a2', 'a3', 'a4', 'a5'],
    modulosCompletos: ['m1'],
    avaliacoesFeitas: [
      { avaliacaoId: 'av1', nota: 8, tentativa: 1, respostas: [1, 0, 1] }
    ],
    avaliacaoFinal: null,
    dataInicio: '2024-01-15',
    dataFim: null
  },
  // Maria - Curso 3 finalizado
  {
    alunoId: 'a1',
    cursoId: 'c3',
    status: 'finalizado',
    aulasAssistidas: ['a14', 'a15'],
    modulosCompletos: ['m6'],
    avaliacoesFeitas: [
      { avaliacaoId: 'av6', nota: 10, tentativa: 1, respostas: [0] }
    ],
    avaliacaoFinal: { nota: 9, tentativa: 1, respostas: [1] },
    resultado: 'aprovado',
    dataInicio: '2024-01-01',
    dataFim: '2024-02-01'
  },
  // João - Curso 1 em andamento (30%)
  {
    alunoId: 'a2',
    cursoId: 'c1',
    status: 'andamento',
    aulasAssistidas: ['a1', 'a2'],
    modulosCompletos: [],
    avaliacoesFeitas: [],
    avaliacaoFinal: null,
    dataInicio: '2024-02-01',
    dataFim: null
  },
  // João - Curso 2 finalizado reprovado
  {
    alunoId: 'a2',
    cursoId: 'c2',
    status: 'finalizado',
    aulasAssistidas: ['a10', 'a11', 'a12', 'a13'],
    modulosCompletos: ['m4', 'm5'],
    avaliacoesFeitas: [
      { avaliacaoId: 'av4', nota: 5, tentativa: 2, respostas: [0] },
      { avaliacaoId: 'av5', nota: 6, tentativa: 1, respostas: [0] }
    ],
    avaliacaoFinal: { nota: 4, tentativa: 2, respostas: [1, 0] },
    resultado: 'reprovado',
    dataInicio: '2023-11-01',
    dataFim: '2024-01-15'
  },
  // Ana - Curso 2 em andamento
  {
    alunoId: 'a3',
    cursoId: 'c2',
    status: 'andamento',
    aulasAssistidas: ['a10'],
    modulosCompletos: [],
    avaliacoesFeitas: [],
    avaliacaoFinal: null,
    dataInicio: '2024-02-10',
    dataFim: null
  },
  // Carlos - Curso 1 100% mas sem avaliação final
  {
    alunoId: 'a4',
    cursoId: 'c1',
    status: 'andamento',
    aulasAssistidas: ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9'],
    modulosCompletos: ['m1', 'm2', 'm3'],
    avaliacoesFeitas: [
      { avaliacaoId: 'av1', nota: 9, tentativa: 1, respostas: [1, 0, 1] },
      { avaliacaoId: 'av2', nota: 8, tentativa: 1, respostas: [2, 1] },
      { avaliacaoId: 'av3', nota: 10, tentativa: 1, respostas: [3, 1] }
    ],
    avaliacaoFinal: null,
    dataInicio: '2024-01-05',
    dataFim: null
  },
  // Beatriz - Curso 3 em andamento
  {
    alunoId: 'a5',
    cursoId: 'c3',
    status: 'andamento',
    aulasAssistidas: ['a14'],
    modulosCompletos: [],
    avaliacoesFeitas: [],
    avaliacaoFinal: null,
    dataInicio: '2024-02-15',
    dataFim: null
  }
];

// Turmas
export const mockTurmas = [
  { id: 't1', nome: 'Turma A', cursoIds: ['c1', 'c2'] },
  { id: 't2', nome: 'Turma B', cursoIds: ['c1'] },
  { id: 't3', nome: 'Turma C', cursoIds: ['c3'] },
];

// Função auxiliar para calcular progresso
export const calcularProgresso = (cursoId, alunoId) => {
  const curso = mockCursos.find(c => c.id === cursoId);
  const progresso = mockProgresso.find(p => p.cursoId === cursoId && p.alunoId === alunoId);
  
  if (!curso || !progresso) return 0;
  
  const totalAulas = curso.modulos.reduce((acc, m) => acc + m.aulas.length, 0);
  const aulasAssistidas = progresso.aulasAssistidas.length;
  
  return Math.round((aulasAssistidas / totalAulas) * 100);
};

// Certificados mock
export const mockCertificados = [
  {
    id: 'cert1',
    alunoId: 'a1',
    cursoId: 'c3',
    dataEmissao: '2024-02-01',
    codigo: 'GF-2024-001'
  }
];

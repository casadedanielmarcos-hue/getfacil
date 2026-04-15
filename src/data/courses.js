// GetFutureToday — Mock Course Data
// Replace with API calls when backend is ready

export const STUDENT_ID = 'student1';

export const courses = [
  {
    id: 'c1',
    title: 'Desenvolvimento Web Completo',
    subtitle: 'Do HTML ao React',
    description: 'Domine as tecnologias essenciais da web moderna: HTML semântico, CSS avançado, JavaScript ES6+ e React. Construa projetos reais do zero ao deploy.',
    coverColor: 'linear-gradient(135deg, #0066ff 0%, #00d4ff 100%)',
    modules: [
      {
        id: 'm1',
        title: 'Fundamentos do HTML',
        order: 1,
        lessons: [
          { id: 'l1', title: 'Estrutura e Semântica HTML', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '18:30', order: 1 },
          { id: 'l2', title: 'Tags e Atributos Essenciais', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '22:15', order: 2 },
          { id: 'l3', title: 'Formulários e Validação', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '19:45', order: 3 },
        ],
        quiz: {
          id: 'q1',
          title: 'Quiz — HTML Fundamentos',
          questions: [
            { id: 'qq1', question: 'Qual tag cria um parágrafo em HTML?', options: ['<paragraph>', '<p>', '<text>', '<para>'], correct: 1 },
            { id: 'qq2', question: 'O que significa HTML?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'], correct: 0 },
            { id: 'qq3', question: 'Qual atributo define o destino de um link?', options: ['src', 'href', 'link', 'url'], correct: 1 },
          ]
        }
      },
      {
        id: 'm2',
        title: 'CSS Moderno',
        order: 2,
        lessons: [
          { id: 'l4', title: 'Seletores e Especificidade', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '25:00', order: 1 },
          { id: 'l5', title: 'Flexbox na Prática', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '30:00', order: 2 },
          { id: 'l6', title: 'CSS Grid Layout', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '28:30', order: 3 },
        ],
        quiz: {
          id: 'q2',
          title: 'Quiz — CSS Moderno',
          questions: [
            { id: 'qq4', question: 'Qual propriedade altera a cor do texto?', options: ['text-color', 'font-color', 'color', 'text-style'], correct: 2 },
            { id: 'qq5', question: 'Como centralizar elementos com Flexbox?', options: ['center: true', 'justify-content: center', 'align: center', 'flex-center: yes'], correct: 1 },
          ]
        }
      },
      {
        id: 'm3',
        title: 'JavaScript ES6+',
        order: 3,
        lessons: [
          { id: 'l7', title: 'Arrow Functions e Destructuring', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '32:00', order: 1 },
          { id: 'l8', title: 'Promises e Async/Await', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '38:00', order: 2 },
          { id: 'l9', title: 'DOM e Eventos', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '35:00', order: 3 },
        ],
        quiz: {
          id: 'q3',
          title: 'Quiz — JavaScript',
          questions: [
            { id: 'qq6', question: 'Qual método adiciona elemento ao final de um array?', options: ['push()', 'add()', 'append()', 'insert()'], correct: 0 },
            { id: 'qq7', question: 'O que retorna typeof null?', options: ['"null"', '"undefined"', '"object"', '"boolean"'], correct: 2 },
          ]
        }
      }
    ],
    finalExam: {
      id: 'fe1',
      title: 'Prova Final — Desenvolvimento Web',
      questions: [
        { id: 'fq1', question: 'Qual é a estrutura básica de um documento HTML?', options: ['<html><head><body>', '<head><html><body>', '<body><head><html>', '<html><body><head>'], correct: 0 },
        { id: 'fq2', question: 'O que é o DOM?', options: ['Document Object Model', 'Data Object Model', 'Document Oriented Model', 'Data Oriented Method'], correct: 0 },
        { id: 'fq3', question: 'Qual valor de display coloca elementos em linha?', options: ['block', 'inline', 'flex', 'grid'], correct: 1 },
        { id: 'fq4', question: 'Como adicionar evento de clique em JavaScript?', options: ['onClick()', 'addEventListener("click")', 'addClick()', 'setClick()'], correct: 1 },
        { id: 'fq5', question: 'Qual propriedade CSS centraliza um bloco horizontalmente?', options: ['text-align: center', 'margin: 0 auto', 'align: center', 'center: true'], correct: 1 },
      ]
    }
  },
  {
    id: 'c2',
    title: 'Marketing Digital',
    subtitle: 'Estratégia e Performance',
    description: 'Aprenda a criar campanhas de alto impacto, dominar redes sociais, Google Ads e analisar resultados com métricas reais de mercado.',
    coverColor: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
    modules: [
      {
        id: 'm4',
        title: 'Fundamentos do Marketing Digital',
        order: 1,
        lessons: [
          { id: 'l10', title: 'O Ecossistema Digital', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '20:00', order: 1 },
          { id: 'l11', title: 'Funil de Vendas e Jornada do Cliente', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '25:00', order: 2 },
          { id: 'l12', title: 'SEO na Prática', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '30:00', order: 3 },
        ],
        quiz: {
          id: 'q4',
          title: 'Quiz — Fundamentos',
          questions: [
            { id: 'qq8', question: 'O que é um lead?', options: ['Um cliente fiel', 'Um potencial cliente', 'Um funcionário', 'Um fornecedor'], correct: 1 },
            { id: 'qq9', question: 'O que significa SEO?', options: ['Search Engine Optimization', 'Social Engagement Output', 'Sales Engagement Option', 'Search Engagement Output'], correct: 0 },
          ]
        }
      },
      {
        id: 'm5',
        title: 'Tráfego Pago e Redes Sociais',
        order: 2,
        lessons: [
          { id: 'l13', title: 'Meta Ads (Facebook e Instagram)', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '35:00', order: 1 },
          { id: 'l14', title: 'Google Ads Search', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '32:00', order: 2 },
          { id: 'l15', title: 'Análise de Métricas e ROI', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '28:00', order: 3 },
        ],
        quiz: {
          id: 'q5',
          title: 'Quiz — Tráfego Pago',
          questions: [
            { id: 'qq10', question: 'Qual métrica mede o alcance de uma publicação?', options: ['Likes', 'Impressões', 'Comentários', 'Salvos'], correct: 1 },
            { id: 'qq11', question: 'O que é CTR?', options: ['Click Through Rate', 'Customer Total Revenue', 'Content Transfer Rate', 'Click To Revenue'], correct: 0 },
          ]
        }
      }
    ],
    finalExam: {
      id: 'fe2',
      title: 'Prova Final — Marketing Digital',
      questions: [
        { id: 'fq6', question: 'O que significa ROI?', options: ['Return on Investment', 'Rate of Interest', 'Return of Income', 'Rate on Investment'], correct: 0 },
        { id: 'fq7', question: 'Qual é o objetivo do remarketing?', options: ['Alcançar novos clientes', 'Reengajar visitantes anteriores', 'Criar novos produtos', 'Reduzir custos'], correct: 1 },
        { id: 'fq8', question: 'O que é CPC?', options: ['Cost Per Campaign', 'Cost Per Click', 'Customer Purchase Cycle', 'Content Per Click'], correct: 1 },
      ]
    }
  },
  {
    id: 'c3',
    title: 'Excel & Power BI',
    subtitle: 'Análise de Dados Avançada',
    description: 'Domine fórmulas avançadas, tabelas dinâmicas, macros VBA e visualizações profissionais com Power BI. Transforme dados em decisões.',
    coverColor: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
    modules: [
      {
        id: 'm6',
        title: 'Excel Avançado',
        order: 1,
        lessons: [
          { id: 'l16', title: 'PROCV, ÍNDICE e CORRESP', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '25:00', order: 1 },
          { id: 'l17', title: 'Tabelas Dinâmicas Master', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '30:00', order: 2 },
          { id: 'l18', title: 'Macros e VBA Básico', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '35:00', order: 3 },
        ],
        quiz: {
          id: 'q6',
          title: 'Quiz — Excel Avançado',
          questions: [
            { id: 'qq12', question: 'O que faz a função PROCV?', options: ['Procura vertical em tabelas', 'Procura horizontal', 'Soma valores', 'Conta células'], correct: 0 },
            { id: 'qq13', question: 'Qual função conta células não vazias?', options: ['CONT.SE', 'CONT.VALORES', 'CONTAR', 'SOMA'], correct: 1 },
          ]
        }
      },
      {
        id: 'm7',
        title: 'Power BI na Prática',
        order: 2,
        lessons: [
          { id: 'l19', title: 'Importando e Transformando Dados', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '28:00', order: 1 },
          { id: 'l20', title: 'Criando Dashboards Profissionais', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '40:00', order: 2 },
          { id: 'l21', title: 'DAX Fundamentos', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '35:00', order: 3 },
        ],
        quiz: {
          id: 'q7',
          title: 'Quiz — Power BI',
          questions: [
            { id: 'qq14', question: 'O que é DAX?', options: ['Data Analysis Expressions', 'Dynamic Axis Extension', 'Data Aggregation Export', 'Dashboard Analytics Extension'], correct: 0 },
          ]
        }
      }
    ],
    finalExam: {
      id: 'fe3',
      title: 'Prova Final — Excel & Power BI',
      questions: [
        { id: 'fq9', question: 'Qual função une textos no Excel?', options: ['CONCAT', 'JOIN', 'MERGE', 'UNITE'], correct: 0 },
        { id: 'fq10', question: 'No Power BI, o que é um relacionamento?', options: ['Ligação entre tabelas', 'Um tipo de gráfico', 'Um filtro avançado', 'Uma fórmula DAX'], correct: 0 },
      ]
    }
  },
  {
    id: 'c4',
    title: 'Design UI/UX com Figma',
    subtitle: 'Do Conceito ao Protótipo',
    description: 'Aprenda os princípios de design centrado no usuário, crie sistemas de design escaláveis e prototipe interfaces de alta fidelidade no Figma.',
    coverColor: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)',
    modules: [
      {
        id: 'm8',
        title: 'Fundamentos de UI/UX',
        order: 1,
        lessons: [
          { id: 'l22', title: 'Princípios de Design Visual', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '22:00', order: 1 },
          { id: 'l23', title: 'Research e Personas', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '28:00', order: 2 },
          { id: 'l24', title: 'Wireframes e Fluxos', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '30:00', order: 3 },
        ],
        quiz: {
          id: 'q8',
          title: 'Quiz — UI/UX Fundamentos',
          questions: [
            { id: 'qq15', question: 'O que é um wireframe?', options: ['Protótipo de alta fidelidade', 'Esboço de baixa fidelidade', 'Código final', 'Documento de requisitos'], correct: 1 },
            { id: 'qq16', question: 'O que significa UX?', options: ['User Experience', 'Ultra Extended', 'User Extension', 'Unified Experience'], correct: 0 },
          ]
        }
      },
      {
        id: 'm9',
        title: 'Figma Avançado',
        order: 2,
        lessons: [
          { id: 'l25', title: 'Auto Layout e Componentes', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '35:00', order: 1 },
          { id: 'l26', title: 'Design System Completo', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '42:00', order: 2 },
          { id: 'l27', title: 'Prototipagem e Animações', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '38:00', order: 3 },
        ],
        quiz: {
          id: 'q9',
          title: 'Quiz — Figma',
          questions: [
            { id: 'qq17', question: 'O que é um Design System?', options: ['Conjunto de componentes e padrões reutilizáveis', 'Um software de design', 'Apenas uma paleta de cores', 'Um framework CSS'], correct: 0 },
          ]
        }
      }
    ],
    finalExam: {
      id: 'fe4',
      title: 'Prova Final — Design UI/UX',
      questions: [
        { id: 'fq11', question: 'O que é prototipagem?', options: ['Criar um modelo interativo do produto', 'Escrever código final', 'Fazer pesquisa com usuários', 'Definir paleta de cores'], correct: 0 },
        { id: 'fq12', question: 'Qual é o foco do design centrado no usuário?', options: ['Tecnologia bonita', 'Atender necessidades reais dos usuários', 'Velocidade de desenvolvimento', 'Redução de custos'], correct: 1 },
      ]
    }
  },
  {
    id: 'c5',
    title: 'Inteligência Artificial',
    subtitle: 'IA para o Mercado de Trabalho',
    description: 'Utilize ferramentas de IA para acelerar sua produtividade, dominar prompt engineering, automatizar tarefas e se destacar no mercado de trabalho do futuro.',
    coverColor: 'linear-gradient(135deg, #00d4ff 0%, #0066ff 100%)',
    modules: [
      {
        id: 'm10',
        title: 'Fundamentos de IA Generativa',
        order: 1,
        lessons: [
          { id: 'l28', title: 'Como Funcionam os LLMs', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '20:00', order: 1 },
          { id: 'l29', title: 'Prompt Engineering Avançado', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '35:00', order: 2 },
          { id: 'l30', title: 'ChatGPT, Claude e Gemini na Prática', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '28:00', order: 3 },
        ],
        quiz: {
          id: 'q10',
          title: 'Quiz — IA Generativa',
          questions: [
            { id: 'qq18', question: 'O que é um LLM?', options: ['Large Language Model', 'Low Level Machine', 'Linear Learning Module', 'Logic Language Method'], correct: 0 },
            { id: 'qq19', question: 'O que é prompt engineering?', options: ['Programar em Python', 'Arte de criar instruções eficazes para IAs', 'Treinar modelos de IA', 'Instalar ferramentas de IA'], correct: 1 },
          ]
        }
      },
      {
        id: 'm11',
        title: 'IA Aplicada no Trabalho',
        order: 2,
        lessons: [
          { id: 'l31', title: 'Automação com IA (Zapier, Make)', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '32:00', order: 1 },
          { id: 'l32', title: 'IA para Criação de Conteúdo', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '30:00', order: 2 },
          { id: 'l33', title: 'IA para Análise de Dados', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '35:00', order: 3 },
        ],
        quiz: {
          id: 'q11',
          title: 'Quiz — IA Aplicada',
          questions: [
            { id: 'qq20', question: 'O que é automação com IA?', options: ['Usar robôs físicos', 'Configurar fluxos que executam tarefas automaticamente', 'Programar em Python', 'Usar planilhas'], correct: 1 },
          ]
        }
      }
    ],
    finalExam: {
      id: 'fe5',
      title: 'Prova Final — Inteligência Artificial',
      questions: [
        { id: 'fq13', question: 'Qual ferramenta de IA é mais indicada para textos?', options: ['Stable Diffusion', 'Midjourney', 'ChatGPT/Claude', 'DALL-E'], correct: 2 },
        { id: 'fq14', question: 'O que é RAG em IA?', options: ['Retrieval-Augmented Generation', 'Random Automated Generation', 'Real AI Generator', 'Retrieval Algorithm Generator'], correct: 0 },
        { id: 'fq15', question: 'Qual é o principal benefício do prompt engineering?', options: ['Programar sem código', 'Obter melhores respostas das IAs', 'Criar imagens', 'Treinar modelos'], correct: 1 },
      ]
    }
  }
];

// Initial progress — student has started course 1
export const initialProgress = [
  {
    alunoId: 'student1',
    cursoId: 'c1',
    status: 'andamento',
    aulasAssistidas: ['l1', 'l2'],
    modulosCompletos: [],
    avaliacoesFeitas: [],
    avaliacaoFinal: null,
    dataInicio: '2025-01-15',
    dataFim: null
  }
];

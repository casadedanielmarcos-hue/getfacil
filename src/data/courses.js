// GetFutureToday — Course Data

export const STUDENT_ID = 'student1';

export const courses = [
  {
    id: 'c1',
    title: 'Canva',
    subtitle: 'Design Gráfico Profissional',
    description: 'Domine o Canva do zero ao avançado. Crie peças visuais impactantes para redes sociais, apresentações e materiais profissionais sem precisar ser designer.',
    coverColor: 'linear-gradient(135deg, #0a0a0f 0%, #00d4ff 100%)',
    accentColor: '#00d4ff',
    modules: [
      {
        id: 'm1',
        title: 'Primeiros Passos no Canva',
        order: 1,
        lessons: [
          { id: 'l1', title: 'Interface e Navegação', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '15:00', order: 1 },
          { id: 'l2', title: 'Templates e Personalização', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '18:30', order: 2 },
          { id: 'l3', title: 'Tipografia e Cores', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '20:00', order: 3 },
        ],
        quiz: {
          id: 'q1',
          title: 'Quiz — Primeiros Passos',
          questions: [
            { id: 'qq1', question: 'Qual recurso do Canva permite reutilizar elementos visuais?', options: ['Filtros', 'Elementos', 'Brand Kit', 'Grade'], correct: 2 },
            { id: 'qq2', question: 'O que é um template no Canva?', options: ['Um plugin externo', 'Um modelo pré-configurado editável', 'Uma fonte especial', 'Um tipo de exportação'], correct: 1 },
            { id: 'qq3', question: 'Qual formato é ideal para exportar imagens com fundo transparente?', options: ['JPG', 'PDF', 'PNG', 'SVG'], correct: 2 },
          ]
        }
      },
      {
        id: 'm2',
        title: 'Design para Redes Sociais',
        order: 2,
        lessons: [
          { id: 'l4', title: 'Tamanhos e Formatos por Plataforma', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '22:00', order: 1 },
          { id: 'l5', title: 'Criando Stories e Reels', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '25:00', order: 2 },
          { id: 'l6', title: 'Identidade Visual Consistente', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '28:00', order: 3 },
        ],
        quiz: {
          id: 'q2',
          title: 'Quiz — Redes Sociais',
          questions: [
            { id: 'qq4', question: 'Qual o tamanho padrão de um post quadrado para Instagram?', options: ['1920x1080px', '1080x1920px', '1080x1080px', '800x800px'], correct: 2 },
            { id: 'qq5', question: 'O que é identidade visual?', options: ['Apenas o logo da marca', 'Conjunto de elementos visuais que representam a marca', 'A paleta de cores isolada', 'O estilo tipográfico'], correct: 1 },
          ]
        }
      },
    ],
    finalExam: {
      id: 'fe1',
      title: 'Prova Final — Canva',
      questions: [
        { id: 'fq1', question: 'O que é o Brand Kit no Canva?', options: ['Um conjunto de templates gratuitos', 'Um espaço para guardar cores, fontes e logos da marca', 'Uma ferramenta de exportação', 'Um editor de vídeos'], correct: 1 },
        { id: 'fq2', question: 'Qual formato é melhor para impressão?', options: ['PNG', 'JPG', 'PDF', 'GIF'], correct: 2 },
        { id: 'fq3', question: 'O que são elementos no Canva?', options: ['Arquivos de texto', 'Ícones, formas, ilustrações e imagens disponíveis na biblioteca', 'Fontes instaladas', 'Filtros de foto'], correct: 1 },
        { id: 'fq4', question: 'Como criar um design colaborativo no Canva?', options: ['Exportar e enviar por e-mail', 'Usando a função de compartilhamento com link de edição', 'Salvando em PDF', 'Não é possível colaborar'], correct: 1 },
        { id: 'fq5', question: 'O que é o recurso "Magic Resize"?', options: ['Aumenta a qualidade da imagem', 'Redimensiona automaticamente o design para outros formatos', 'Remove o fundo', 'Muda as cores automaticamente'], correct: 1 },
      ]
    }
  },
  {
    id: 'c2',
    disponivel: true,
    title: 'Pensamento Computacional',
    subtitle: 'Lógica e Resolução de Problemas',
    description: 'Desenvolva o raciocínio lógico e estruturado para resolver problemas complexos. Aprenda decomposição, padrões, abstração e algoritmos na prática.',
    coverColor: 'linear-gradient(135deg, #0a0a0f 0%, #0088ff 100%)',
    accentColor: '#0088ff',
    slug: 'pensamento-computacional',
    modules: [
      {
        id: 'm1',
        title: 'Módulo 1 - Fundamentos',
        lessons: [
          { id: 'introducao',  title: 'Introdução',                                          slug: 'Introdução', type: 'rise360' },
          { id: 'capitulo-1', title: 'Capítulo 1: O Método para Decifrar o Futuro',          slug: 'Cap 1',      type: 'rise360' },
          { id: 'desafio-1',  title: 'Desafio 1: Duas Lentes para a Sua Prática',            slug: 'Des 1',      type: 'rise360' },
        ],
      },
      {
        id: 'm2',
        title: 'Módulo 2 - Aprofundamento',
        lessons: [
          { id: 'capitulo-2', title: 'Capítulo 2: Conectando Saberes',                       slug: 'Cap 2',      type: 'rise360' },
          { id: 'desafio-2',  title: 'Desafio 2',                                            slug: 'Des 2',      type: 'rise360' },
        ],
      },
      {
        id: 'm3',
        title: 'Módulo 3 - Avançado',
        lessons: [
          { id: 'capitulo-3', title: 'Capítulo 3: O Método para o Novo Mundo Digital',       slug: 'Cap 3',      type: 'rise360' },
          { id: 'desafio-3',  title: 'Desafio 3',                                            slug: 'Des 3',      type: 'rise360' },
          { id: 'materiais',  title: 'Materiais Complementares',                              slug: 'materiais',  type: 'rise360' },
        ],
      },
    ],
  },
  {
    id: 'c3',
    title: 'Guia de Sobrevivência Offline',
    subtitle: 'Habilidades para o Mundo Real',
    description: 'Desenvolva competências práticas essenciais para o dia a dia profissional e pessoal — comunicação, organização, finanças pessoais e produtividade sem depender da tecnologia.',
    coverColor: 'linear-gradient(135deg, #0a0a0f 0%, #0055cc 100%)',
    accentColor: '#0055cc',
    modules: [
      {
        id: 'm5',
        title: 'Comunicação e Relacionamentos',
        order: 1,
        lessons: [
          { id: 'l13', title: 'Comunicação Assertiva', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '22:00', order: 1 },
          { id: 'l14', title: 'Escuta Ativa e Empatia', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '18:00', order: 2 },
          { id: 'l15', title: 'Networking Genuíno', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '20:00', order: 3 },
        ],
        quiz: {
          id: 'q5',
          title: 'Quiz — Comunicação',
          questions: [
            { id: 'qq11', question: 'O que é comunicação assertiva?', options: ['Falar de forma agressiva', 'Expressar pensamentos com clareza e respeito', 'Concordar com tudo', 'Evitar conflitos'], correct: 1 },
            { id: 'qq12', question: 'O que é escuta ativa?', options: ['Ouvir enquanto faz outras coisas', 'Prestar atenção plena ao interlocutor', 'Anotar tudo que ouve', 'Repetir o que a outra pessoa disse'], correct: 1 },
            { id: 'qq13', question: 'Networking genuíno significa:', options: ['Adicionar o máximo de pessoas possível', 'Construir relações de valor mútuo e autênticas', 'Distribuir cartões de visita', 'Estar em todas as redes sociais'], correct: 1 },
          ]
        }
      },
      {
        id: 'm6',
        title: 'Organização e Produtividade',
        order: 2,
        lessons: [
          { id: 'l16', title: 'Gestão do Tempo', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '25:00', order: 1 },
          { id: 'l17', title: 'Método GTD Simplificado', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '28:00', order: 2 },
          { id: 'l18', title: 'Finanças Pessoais Básicas', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '30:00', order: 3 },
        ],
        quiz: {
          id: 'q6',
          title: 'Quiz — Organização',
          questions: [
            { id: 'qq14', question: 'O que é a técnica Pomodoro?', options: ['Uma dieta alimentar', 'Trabalhar em blocos de tempo focado com pausas', 'Um método de meditação', 'Uma forma de organizar arquivos'], correct: 1 },
            { id: 'qq15', question: 'GTD significa:', options: ['Get Things Done', 'Go To Development', 'Great Task Design', 'General To-Do'], correct: 0 },
          ]
        }
      },
    ],
    finalExam: {
      id: 'fe3',
      title: 'Prova Final — Guia de Sobrevivência Offline',
      questions: [
        { id: 'fq11', question: 'Qual é o principal benefício da comunicação assertiva?', options: ['Ganhar todos os debates', 'Expressar necessidades com respeito e clareza', 'Evitar toda forma de conflito', 'Falar mais alto'], correct: 1 },
        { id: 'fq12', question: 'O que é inteligência financeira básica?', options: ['Investir na bolsa', 'Entender receitas, despesas e poupar conscientemente', 'Ter cartão de crédito', 'Saber fazer planilhas'], correct: 1 },
        { id: 'fq13', question: 'Por que a escuta ativa é importante?', options: ['Para parecer mais inteligente', 'Porque cria conexões reais e evita mal-entendidos', 'Para falar menos', 'Para memorizar informações'], correct: 1 },
        { id: 'fq14', question: 'Qual é o primeiro passo para uma boa gestão do tempo?', options: ['Trabalhar mais horas', 'Identificar e priorizar tarefas por importância e urgência', 'Usar o celular menos', 'Acordar mais cedo'], correct: 1 },
        { id: 'fq15', question: 'O networking é mais eficaz quando:', options: ['Feito apenas em eventos formais', 'Baseado em troca de valor e autenticidade', 'Focado em pessoas famosas', 'Feito online exclusivamente'], correct: 1 },
      ]
    }
  },
  {
    id: 'c4',
    title: 'Design Instrucional',
    subtitle: 'Criação de Experiências de Aprendizagem',
    description: 'Aprenda a projetar cursos e treinamentos que realmente ensinam. Domine taxonomias, metodologias ativas, mapas de conteúdo e avaliação de aprendizagem.',
    coverColor: 'linear-gradient(135deg, #0a0a0f 0%, #003399 100%)',
    accentColor: '#003399',
    modules: [
      {
        id: 'm7',
        title: 'Fundamentos do Design Instrucional',
        order: 1,
        lessons: [
          { id: 'l19', title: 'O que é Design Instrucional', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '20:00', order: 1 },
          { id: 'l20', title: 'Taxonomia de Bloom', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '25:00', order: 2 },
          { id: 'l21', title: 'Análise de Público e Necessidades', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '22:00', order: 3 },
        ],
        quiz: {
          id: 'q7',
          title: 'Quiz — Fundamentos DI',
          questions: [
            { id: 'qq16', question: 'O que é Design Instrucional?', options: ['Design de interfaces', 'Processo de planejar experiências de aprendizagem eficazes', 'Criar apostilas', 'Dar aulas online'], correct: 1 },
            { id: 'qq17', question: 'A Taxonomia de Bloom organiza:', options: ['Tipos de alunos', 'Níveis de objetivos educacionais', 'Estilos de ensino', 'Ferramentas de criação'], correct: 1 },
            { id: 'qq18', question: 'O que é análise de público-alvo no DI?', options: ['Pesquisa de mercado', 'Entender quem são os alunos e suas necessidades de aprendizagem', 'Definir o preço do curso', 'Escolher a plataforma'], correct: 1 },
          ]
        }
      },
      {
        id: 'm8',
        title: 'Estrutura e Avaliação',
        order: 2,
        lessons: [
          { id: 'l22', title: 'Mapa de Conteúdo e Storyboard', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '30:00', order: 1 },
          { id: 'l23', title: 'Metodologias Ativas de Aprendizagem', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '28:00', order: 2 },
          { id: 'l24', title: 'Avaliação e Feedback Eficaz', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '25:00', order: 3 },
        ],
        quiz: {
          id: 'q8',
          title: 'Quiz — Estrutura e Avaliação',
          questions: [
            { id: 'qq19', question: 'O que é um storyboard de curso?', options: ['Um vídeo de apresentação', 'Um roteiro visual detalhado de cada tela/aula do curso', 'Uma lista de materiais', 'Um questionário'], correct: 1 },
            { id: 'qq20', question: 'Metodologias ativas priorizam:', options: ['Aula expositiva tradicional', 'O protagonismo e participação ativa do aluno', 'Leitura de apostilas', 'Provas escritas'], correct: 1 },
          ]
        }
      },
    ],
    finalExam: {
      id: 'fe4',
      title: 'Prova Final — Design Instrucional',
      questions: [
        { id: 'fq16', question: 'Qual modelo clássico de DI segue as etapas: Análise, Design, Desenvolvimento, Implementação e Avaliação?', options: ['BLOOM', 'ADDIE', 'SCRUM', 'AGILE'], correct: 1 },
        { id: 'fq17', question: 'Qual nível da Taxonomia de Bloom é o mais elevado?', options: ['Compreender', 'Aplicar', 'Criar', 'Analisar'], correct: 2 },
        { id: 'fq18', question: 'O que são objetivos de aprendizagem?', options: ['O conteúdo do curso', 'Declarações que descrevem o que o aluno será capaz de fazer ao final', 'O tempo de duração do curso', 'O número de aulas'], correct: 1 },
        { id: 'fq19', question: 'Uma avaliação formativa serve para:', options: ['Atribuir nota final', 'Monitorar o progresso e dar feedback durante o processo', 'Certificar o aluno', 'Comparar alunos'], correct: 1 },
        { id: 'fq20', question: 'O que é aprendizagem significativa?', options: ['Aprender muitas coisas rapidamente', 'Conectar novo conhecimento a conhecimentos já existentes de forma relevante', 'Memorizar conteúdos', 'Assistir muitos vídeos'], correct: 1 },
      ]
    }
  },
];

// Initial progress — empty (no pre-loaded progress)
export const initialProgress = [];

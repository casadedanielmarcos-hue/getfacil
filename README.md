# Get Fácil - Plataforma de Cursos

Plataforma educacional mobile-first para gestão de cursos online.

## 🚀 Demo

Acesse: https://SEU-USUARIO.github.io/getfacil

### Credenciais de Teste

**Aluno:**
- Email: `maria@email.com`
- Senha: `123456`

**Professor:**
- Email: `roberto@email.com`
- Senha: `123456`

## ✨ Funcionalidades

### Área do Aluno
- Dashboard com cursos em andamento e finalizados
- Player de aulas com embed (YouTube, Vimeo, etc)
- Avaliações de módulo e avaliação final
- Certificados para cursos aprovados
- Agente IA para dúvidas (preparado para integração)

### Área do Professor
- Gestão de cursos, módulos e aulas
- Criação de avaliações (múltipla escolha)
- Lista de alunos com ações (matricular, bloquear, remover)
- Estatísticas de progresso

## 🛠️ Tecnologias

- React 18
- Vite
- React Router DOM
- Lucide React (ícones)
- CSS Variables (design system)

## 📦 Instalação Local

```bash
# Clone o repositório
git clone https://github.com/SEU-USUARIO/getfacil.git
cd getfacil

# Instale as dependências
npm install

# Rode em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🚀 Deploy no GitHub Pages

### Opção 1: Automático (GitHub Actions)

1. Faça push para o branch `main`
2. Vá em Settings > Pages
3. Source: GitHub Actions
4. O deploy será automático a cada push

### Opção 2: Manual

```bash
# Build
npm run build

# O conteúdo da pasta dist/ deve ser publicado
```

## 🌐 Domínio Personalizado (Hostgator)

1. No GitHub, vá em Settings > Pages > Custom domain
2. Digite seu domínio (ex: `cursos.seudominio.com.br`)
3. No painel da Hostgator, configure o DNS:
   - Tipo: CNAME
   - Nome: `cursos` (ou `@` para raiz)
   - Valor: `SEU-USUARIO.github.io`
4. Aguarde a propagação (até 24h)

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/           # Componentes base (Button, Card, Modal...)
│   ├── AIAgent.jsx   # Agente IA flutuante
│   └── Header.jsx
├── contexts/
│   ├── AuthContext   # Autenticação
│   └── DataContext   # Estado global dos dados
├── data/
│   └── mockData.js   # Dados de demonstração
├── pages/
│   ├── aluno/        # Páginas do aluno
│   └── professor/    # Páginas do professor
└── styles/
    └── global.css    # Estilos globais
```

## 🎨 Paleta de Cores

- Primary: `#2563eb` (Blue 600)
- Background: `#f8fafc` (Slate 50)
- Surface: `#ffffff`
- Text: `#1e293b` (Slate 800)

## 📱 Mobile First

A aplicação foi desenvolvida com foco em dispositivos móveis, usando:
- Viewport units (dvh)
- Touch-friendly buttons
- Scrollbar customizada
- Safe areas para notch

## 🔜 Próximos Passos

- [ ] Integração com backend (Supabase/Firebase)
- [ ] Integração do Agente IA com API
- [ ] Upload de arquivos para aulas
- [ ] Sistema de notificações
- [ ] PWA (Progressive Web App)

## 📄 Licença

MIT

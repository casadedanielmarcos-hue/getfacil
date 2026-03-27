import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

export function AIAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Olá! 👋 Sou o assistente do Get Fácil. Como posso ajudar você hoje?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Função preparada para integração com API de IA
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // TODO: Integrar com API de IA (Anthropic/OpenAI)
    // Exemplo de integração:
    /*
    try {
      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          max_tokens: 1024
        })
      });
      const data = await response.json();
      // Processar resposta
    } catch (error) {
      console.error('Erro ao comunicar com IA:', error);
    }
    */

    // Resposta simulada para demonstração
    setTimeout(() => {
      const responses = [
        'Entendi sua dúvida! Para acessar seus cursos, basta ir em "Meus Cursos" no menu principal.',
        'Ótima pergunta! As avaliações ficam disponíveis após você completar todas as aulas do módulo.',
        'Seu certificado será gerado automaticamente quando você for aprovado no curso.',
        'Posso te ajudar a entender melhor o conteúdo. Qual parte específica você tem dúvida?',
        'Para ver seu progresso, acesse o curso e veja a barra de progresso na parte superior.'
      ];

      const assistantMessage = {
        id: Date.now(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)]
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Estilos
  const fabStyle = {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '60px',
    height: '60px',
    borderRadius: 'var(--radius-full)',
    background: 'linear-gradient(135deg, var(--blue-500) 0%, var(--blue-700) 100%)',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-lg), 0 4px 20px rgba(37, 99, 235, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    transition: 'all var(--transition-fast)',
    animation: 'float 3s ease-in-out infinite'
  };

  const chatContainerStyle = {
    position: 'fixed',
    bottom: '100px',
    right: '24px',
    width: 'calc(100vw - 48px)',
    maxWidth: '380px',
    height: '500px',
    maxHeight: 'calc(100vh - 150px)',
    background: 'white',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-xl)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 998,
    animation: 'slideUp 300ms ease',
    border: '1px solid var(--border)'
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, var(--blue-600) 0%, var(--blue-800) 100%)',
    color: 'white',
    padding: 'var(--space-md) var(--space-lg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const headerTitleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)'
  };

  const headerTextStyle = {
    fontFamily: 'var(--font-display)',
    fontWeight: '600',
    fontSize: '1rem'
  };

  const headerSubStyle = {
    fontSize: '0.75rem',
    opacity: 0.8
  };

  const closeBtnStyle = {
    width: '32px',
    height: '32px',
    borderRadius: 'var(--radius-full)',
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const messagesStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: 'var(--space-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)'
  };

  const messageStyle = (isUser) => ({
    display: 'flex',
    gap: 'var(--space-sm)',
    alignItems: 'flex-start',
    flexDirection: isUser ? 'row-reverse' : 'row'
  });

  const avatarStyle = (isUser) => ({
    width: '32px',
    height: '32px',
    borderRadius: 'var(--radius-full)',
    background: isUser 
      ? 'linear-gradient(135deg, var(--blue-400) 0%, var(--blue-600) 100%)'
      : 'linear-gradient(135deg, var(--blue-600) 0%, var(--blue-800) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    flexShrink: 0
  });

  const bubbleStyle = (isUser) => ({
    maxWidth: '75%',
    padding: 'var(--space-sm) var(--space-md)',
    borderRadius: isUser 
      ? 'var(--radius-lg) var(--radius-lg) var(--radius-sm) var(--radius-lg)'
      : 'var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-sm)',
    background: isUser ? 'var(--blue-600)' : 'var(--blue-50)',
    color: isUser ? 'white' : 'var(--text-primary)',
    fontSize: '0.9rem',
    lineHeight: 1.5
  });

  const inputContainerStyle = {
    padding: 'var(--space-md)',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    gap: 'var(--space-sm)'
  };

  const inputStyle = {
    flex: 1,
    padding: '12px 16px',
    borderRadius: 'var(--radius-full)',
    border: '2px solid var(--border)',
    outline: 'none',
    fontSize: '0.9rem',
    transition: 'all var(--transition-fast)'
  };

  const sendBtnStyle = {
    width: '44px',
    height: '44px',
    borderRadius: 'var(--radius-full)',
    background: input.trim() && !isLoading
      ? 'linear-gradient(135deg, var(--blue-500) 0%, var(--blue-700) 100%)'
      : 'var(--blue-100)',
    border: 'none',
    color: input.trim() && !isLoading ? 'white' : 'var(--blue-300)',
    cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all var(--transition-fast)'
  };

  const typingStyle = {
    display: 'flex',
    gap: '4px',
    padding: 'var(--space-sm) var(--space-md)',
    background: 'var(--blue-50)',
    borderRadius: 'var(--radius-lg)',
    width: 'fit-content'
  };

  const dotStyle = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--blue-400)',
    animation: 'pulse 1s ease-in-out infinite'
  };

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div style={chatContainerStyle}>
          <div style={headerStyle}>
            <div style={headerTitleStyle}>
              <Bot size={24} />
              <div>
                <div style={headerTextStyle}>Assistente IA</div>
                <div style={headerSubStyle}>Online • Pronto para ajudar</div>
              </div>
            </div>
            <button style={closeBtnStyle} onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div style={messagesStyle}>
            {messages.map((msg) => (
              <div key={msg.id} style={messageStyle(msg.role === 'user')}>
                <div style={avatarStyle(msg.role === 'user')}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div style={bubbleStyle(msg.role === 'user')}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={messageStyle(false)}>
                <div style={avatarStyle(false)}>
                  <Bot size={16} />
                </div>
                <div style={typingStyle}>
                  <span style={{ ...dotStyle, animationDelay: '0ms' }} />
                  <span style={{ ...dotStyle, animationDelay: '150ms' }} />
                  <span style={{ ...dotStyle, animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div style={inputContainerStyle}>
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--blue-400)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)';
              }}
            />
            <button 
              style={sendBtnStyle} 
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button 
        style={fabStyle} 
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  );
}

import React, { useState, useRef, useEffect } from 'react'
import { aiService } from '../services/api.js'

const SUGGESTIONS = [
  { icon: '📊', text: "Quel est l'état actuel de la ligne PN ?" },
  { icon: '🌡️', text: "Pourquoi y a-t-il une alerte sur la température du sécheur ?" },
  { icon: '⚗️', text: "Quel était le ratio NPK moyen ces dernières heures ?" },
  { icon: '🔧', text: "Proposer des actions correctives pour un dépassement de température sur la granulation." },
  { icon: '⚠️', text: "Quels capteurs sont dans une zone critique en ce moment ?" },
]

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '8px 4px', alignItems: 'center' }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: '50%',
          background: '#00C853',
          animation: `ocpBounce 1.2s ${i*0.2}s infinite ease-in-out`,
        }}/>
      ))}
      <style>{`
        @keyframes ocpBounce {
          0%,100%{transform:translateY(0);opacity:0.4}
          50%{transform:translateY(-6px);opacity:1}
        }
      `}</style>
    </div>
  )
}

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      gap: 10,
      alignItems: 'flex-start',
      marginBottom: 16,
    }}>
      {!isUser && (
        <div style={{
          width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #00C853, #1B5E20)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, boxShadow: '0 2px 8px rgba(0,200,83,0.3)',
        }}>🤖</div>
      )}
      <div style={{
        maxWidth: '75%',
        padding: '12px 16px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser
          ? 'linear-gradient(135deg, #1B5E20, #2E7D32)'
          : 'rgba(255,255,255,0.05)',
        border: isUser
          ? '1px solid rgba(0,200,83,0.3)'
          : '1px solid rgba(255,255,255,0.08)',
        color: '#E8F5E9',
        fontSize: 13.5,
        lineHeight: 1.7,
        whiteSpace: 'pre-wrap',
        boxShadow: isUser
          ? '0 4px 15px rgba(0,200,83,0.15)'
          : '0 2px 8px rgba(0,0,0,0.2)',
      }}>
        {!isUser && (
          <div style={{
            fontSize: 11, fontWeight: 600, color: '#00C853',
            marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase',
          }}>Assistant OCP IA</div>
        )}
        {msg.content}
      </div>
      {isUser && (
        <div style={{
          width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #1565C0, #0D47A1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700, color: 'white',
          boxShadow: '0 2px 8px rgba(21,101,192,0.3)',
        }}>OP</div>
      )}
    </div>
  )
}

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Bonjour ! Je suis votre assistant IA spécialisé en production d\'engrais OCP. Je peux analyser vos données capteurs en temps réel, détecter les anomalies et proposer des actions correctives. Comment puis-je vous aider ?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const q = text || input.trim()
    if (!q || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: q }])
    setLoading(true)
    try {
      const { answer } = await aiService.query(q)
      setMessages(prev => [...prev, { role: 'assistant', content: answer }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Erreur de connexion au service IA. Vérifiez la clé API.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '24px', height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,200,83,0.1), rgba(27,94,32,0.2))',
        border: '1px solid rgba(0,200,83,0.2)',
        borderRadius: 12, padding: '16px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'linear-gradient(135deg, #00C853, #1B5E20)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, boxShadow: '0 4px 15px rgba(0,200,83,0.3)',
          }}>🤖</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#E8F5E9' }}>
              Assistant IA — OCP Production
            </div>
            <div style={{ fontSize: 12, color: '#81C784', marginTop: 2 }}>
              Analyse temps réel · Lignes PN · GR · LAV · SEC · ENR · PF
            </div>
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(0,200,83,0.1)', padding: '6px 14px',
          borderRadius: 20, border: '1px solid rgba(0,200,83,0.3)',
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', background: '#00C853',
            boxShadow: '0 0 8px #00C853', animation: 'pulse 2s infinite',
          }}/>
          <span style={{ fontSize: 12, color: '#00C853', fontWeight: 500 }}>En ligne</span>
        </div>
      </div>

      {/* Chat area */}
      <div style={{
        flex: 1, overflowY: 'auto',
        background: 'rgba(0,0,0,0.2)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12, padding: '20px 16px',
        display: 'flex', flexDirection: 'column',
      }}>
        {messages.map((msg, i) => <Message key={i} msg={msg} />)}
        {loading && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #00C853, #1B5E20)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}>🤖</div>
            <div style={{
              padding: '10px 16px', borderRadius: '18px 18px 18px 4px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {SUGGESTIONS.map((s, i) => (
          <button key={i} onClick={() => sendMessage(s.text)}
            disabled={loading}
            style={{
              fontSize: 11.5, padding: '6px 12px',
              background: 'rgba(0,200,83,0.06)',
              color: '#A5D6A7',
              border: '1px solid rgba(0,200,83,0.2)',
              borderRadius: 20, cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
            onMouseEnter={e => { e.target.style.background = 'rgba(0,200,83,0.15)'; e.target.style.color = '#00C853' }}
            onMouseLeave={e => { e.target.style.background = 'rgba(0,200,83,0.06)'; e.target.style.color = '#A5D6A7' }}
          >
            {s.icon} {s.text.length > 45 ? s.text.slice(0,45)+'…' : s.text}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Posez votre question sur la production OCP..."
            disabled={loading}
            style={{
              width: '100%', padding: '14px 20px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(0,200,83,0.3)',
              borderRadius: 12, color: '#E8F5E9', fontSize: 13.5,
              outline: 'none', boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = '#00C853'}
            onBlur={e => e.target.style.borderColor = 'rgba(0,200,83,0.3)'}
          />
        </div>
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          style={{
            padding: '14px 24px',
            background: loading || !input.trim()
              ? 'rgba(255,255,255,0.05)'
              : 'linear-gradient(135deg, #00C853, #1B5E20)',
            color: loading || !input.trim() ? '#555' : 'white',
            border: 'none', borderRadius: 12,
            fontSize: 13.5, fontWeight: 600,
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            transition: 'all 0.2s',
            boxShadow: loading || !input.trim() ? 'none' : '0 4px 15px rgba(0,200,83,0.3)',
            whiteSpace: 'nowrap',
          }}
        >
          {loading ? '⏳ Analyse...' : '➤ Envoyer'}
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%,100%{opacity:1} 50%{opacity:0.4}
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,200,83,0.3); border-radius: 2px; }
      `}</style>
    </div>
  )
}
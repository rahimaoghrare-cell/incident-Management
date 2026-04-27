import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { envoyerMessageChat, createIncident, getCurrentUser } from '../services/api'

function Bulle({ msg }) {
  const bot = msg.expediteur === 'BOT'
  return (
    <div style={{ display:'flex', justifyContent: bot?'flex-start':'flex-end', marginBottom:'14px', gap:'8px', alignItems:'flex-end' }}>
      {bot && <div style={{ width:'30px', height:'30px', borderRadius:'50%', background:'linear-gradient(135deg,#0F766E,#065F46)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', flexShrink:0 }}>🤖</div>}
      <div style={{
        maxWidth:'75%', padding:'10px 14px',
        borderRadius: bot ? '4px 14px 14px 14px' : '14px 14px 4px 14px',
        background: bot ? '#fff' : 'linear-gradient(135deg,#0F766E,#065F46)',
        color: bot ? '#111827' : '#fff',
        fontSize:'13px', lineHeight:'1.5',
        boxShadow:'0 1px 6px rgba(0,0,0,0.08)',
        border: bot ? '1px solid #E5E7EB' : 'none'
      }}>
        {msg.message === '...'
          ? <span style={{ display:'flex', gap:'4px', alignItems:'center' }}>
              {[0,1,2].map(i => <span key={i} style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#9CA3AF', animation:`bounce 1.2s ${i*0.2}s infinite` }} />)}
            </span>
          : msg.message
        }

        {/* Suggestions d'incidents similaires */}
        {msg.suggestions && (
          <div style={{ marginTop:'12px' }}>
            {msg.suggestions.map(s => (
              <div key={s.id} style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:'10px', padding:'10px 12px', marginBottom:'8px' }}>
                <p style={{ color:'#166534', fontSize:'12px', fontWeight:'600', margin:'0 0 3px' }}>📄 {s.id} — {s.titre}</p>
                <p style={{ color:'#374151', fontSize:'12px', margin:'0 0 3px' }}>💡 {s.solution}</p>
                <p style={{ color:'#6B7280', fontSize:'11px', margin:0 }}>✓ A fonctionné pour {s.nb} utilisateurs</p>
              </div>
            ))}
          </div>
        )}

        {/* Boutons d'action rapide */}
        {msg.actions && (
          <div style={{ display:'flex', gap:'8px', marginTop:'10px', flexWrap:'wrap' }}>
            {msg.actions.map(a => (
              <button key={a.label} onClick={a.onClick}
                style={{ padding:'6px 12px', borderRadius:'20px', fontSize:'12px', background: a.danger ? '#FEF2F2' : '#F0FDF4', color: a.danger ? '#DC2626' : '#166534', border: `1px solid ${a.danger ? '#FECACA' : '#BBF7D0'}`, cursor:'pointer', fontWeight:'500' }}>
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ChatPage() {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const [messages, setMessages] = useState([{
    id:1, expediteur:'BOT',
    message:`Bonjour ${user?.prenom || ''} ! Décrivez votre problème et je vais chercher des solutions existantes avant de créer un ticket.`
  }])
  const [saisie, setSaisie]   = useState('')
  const [loading, setLoading] = useState(false)
  const finRef = useRef(null)

  useEffect(() => { finRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  const add = (expediteur, message, extras = {}) =>
    setMessages(prev => [...prev, { id:Date.now()+Math.random(), expediteur, message, ...extras }])

  const handleSend = async () => {
    if (!saisie.trim() || loading) return
    const texte = saisie.trim()
    setSaisie('')
    add('USER', texte)
    setLoading(true)
    add('BOT', '...')

    try {
      const rep = await envoyerMessageChat(texte)
      setMessages(prev => prev.filter(m => m.message !== '...'))

      if (rep.type === 'suggestions') {
        add('BOT', rep.message, {
          suggestions: rep.suggestions,
          actions: [
            { label:'✅ Ça a fonctionné !', onClick: () => add('BOT', 'Parfait ! Problème résolu. Bonne journée ! 😊') },
            { label:'❌ Aucune solution ne marche', danger:true, onClick: () => proposerTicket(texte) }
          ]
        })
      } else {
        add('BOT', rep.message, {
          actions: [{ label:'📋 Créer un ticket', onClick: () => proposerTicket(texte) }]
        })
      }
    } finally { setLoading(false) }
  }

  const proposerTicket = (desc) => {
    add('BOT', 'Je vais créer un ticket pour vous. Un technicien vous contactera dans les 2 heures.', {
      actions: [{ label:'✅ Confirmer la création', onClick: () => creerTicket(desc) }]
    })
  }

  const creerTicket = async (desc) => {
    const inc = await createIncident({ titre: desc.substring(0, 60), description: desc, priorite:'Moyenne', categorie:'Logiciel' })
    add('BOT', `Ticket créé !\n\n📋 Référence : ${inc.id}\nPriorité : Moyenne\n\nUn technicien prendra en charge votre incident prochainement.`, {
      actions: [{ label:'Voir mes incidents →', onClick: () => navigate('/incidents') }]
    })
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 120px)', fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px', background:'#F8FAFC' }}>
        {messages.map(m => <Bulle key={m.id} msg={m} />)}
        <div ref={finRef} />
      </div>

      {/* Saisie */}
      <div style={{ background:'#fff', borderTop:'1px solid #E5E7EB', padding:'12px 16px', display:'flex', gap:'10px', alignItems:'flex-end' }}>
        <textarea value={saisie} onChange={e => setSaisie(e.target.value)}
          onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
          placeholder="Décrivez votre problème... (Entrée pour envoyer)"
          rows={2}
          style={{ flex:1, padding:'10px 14px', background:'#F9FAFB', border:'1.5px solid #E5E7EB', borderRadius:'10px', color:'#111827', fontSize:'13px', outline:'none', resize:'none', fontFamily:'inherit', lineHeight:'1.5', boxSizing:'border-box' }} />
        <button onClick={handleSend} disabled={loading || !saisie.trim()}
          style={{ padding:'10px 18px', background: loading||!saisie.trim() ? '#E5E7EB' : 'linear-gradient(135deg,#0F766E,#065F46)', color: loading||!saisie.trim() ? '#9CA3AF' : '#fff', border:'none', borderRadius:'10px', fontSize:'13px', fontWeight:'600', cursor:'pointer', flexShrink:0 }}>
          Envoyer
        </button>
      </div>
      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }`}</style>
    </div>
  )
}

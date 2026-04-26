import { useState, useCallback, useEffect, createContext, useContext } from 'react'

// Contexte global pour les notifications
const NotifContext = createContext(null)

export function NotifProvider({ children }) {
  const [notifs, setNotifs] = useState([])

  const push = useCallback((message, type = 'success') => {
    const id = Date.now()
    setNotifs(prev => [...prev, { id, message, type }])
    setTimeout(() => setNotifs(prev => prev.filter(n => n.id !== id)), 4000)
  }, [])

  const remove = (id) => setNotifs(prev => prev.filter(n => n.id !== id))

  const COLORS = {
    success: { bg:'#0F2A1A', border:'#22C55E', text:'#4ADE80', icon:'✓' },
    error:   { bg:'#1A0808', border:'#EF4444', text:'#FCA5A5', icon:'✕' },
    info:    { bg:'#0F172A', border:'#3B82F6', text:'#93C5FD', icon:'ℹ' },
    warning: { bg:'#1A1000', border:'#F59E0B', text:'#FCD34D', icon:'⚠' },
  }

  return (
    <NotifContext.Provider value={{ push }}>
      {children}
      {/* Zone d'affichage — coin haut droit */}
      <div style={{ position:'fixed', top:'16px', right:'16px', zIndex:9999, display:'flex', flexDirection:'column', gap:'8px', pointerEvents:'none' }}>
        {notifs.map(n => {
          const c = COLORS[n.type] || COLORS.info
          return (
            <div key={n.id}
              style={{ background:c.bg, border:`1px solid ${c.border}`, borderRadius:'10px', padding:'12px 16px', display:'flex', alignItems:'center', gap:'10px', minWidth:'280px', maxWidth:'380px', boxShadow:'0 4px 20px rgba(0,0,0,0.4)', pointerEvents:'all', animation:'slideIn 0.25s ease' }}>
              <span style={{ color:c.text, fontSize:'16px', flexShrink:0 }}>{c.icon}</span>
              <p style={{ color:c.text, fontSize:'13px', margin:0, flex:1, lineHeight:'1.4' }}>{n.message}</p>
              <button onClick={() => remove(n.id)}
                style={{ background:'none', border:'none', color:c.border, cursor:'pointer', fontSize:'14px', padding:'0 2px', flexShrink:0 }}>✕</button>
            </div>
          )
        })}
      </div>
      <style>{`@keyframes slideIn { from { opacity:0; transform:translateX(20px) } to { opacity:1; transform:translateX(0) } }`}</style>
    </NotifContext.Provider>
  )
}

// Hook pour utiliser les notifs depuis n'importe quelle page
export const useNotif = () => {
  const ctx = useContext(NotifContext)
  if (!ctx) throw new Error('useNotif doit être dans NotifProvider')
  return ctx.push
}

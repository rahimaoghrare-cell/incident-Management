import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

const s = document.createElement('style')
s.textContent = `*{margin:0;padding:0;box-sizing:border-box} body{font-family:'Segoe UI',system-ui,sans-serif;background:#050B18} ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:#080F1E} ::-webkit-scrollbar-thumb{background:#1E293B;border-radius:3px}`
document.head.appendChild(s)

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>)

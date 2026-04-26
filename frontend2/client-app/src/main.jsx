import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

const s = document.createElement('style')
s.textContent = `*{margin:0;padding:0;box-sizing:border-box} body{font-family:'Segoe UI',system-ui,sans-serif;background:#F8FAFC} ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:#D1D5DB;border-radius:2px}`
document.head.appendChild(s)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
)

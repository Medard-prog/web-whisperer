
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Remove the Router from here as it should only be in App.tsx
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

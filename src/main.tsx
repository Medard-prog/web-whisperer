
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter as Router } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';

// Enable realtime subscriptions in Supabase
supabase.realtime.setAuth("public-anonymous-key");

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
)

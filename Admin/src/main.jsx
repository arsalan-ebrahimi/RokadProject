// ==========================================
// Application Bootstrap Entry Point
// Mounts React DOM tree into root element wrapped with Redux Provider and StrictMode
// ==========================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './Store/store'; 
import App from './App.jsx';
import './index.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
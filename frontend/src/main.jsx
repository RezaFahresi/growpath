import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/AppContext';
import { GoogleOAuthProvider } from '@react-oauth/google'; // <-- 1. Import ini
import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Bungkus dengan provider dan ganti teks di bawah dengan Client ID Anda */}
    <GoogleOAuthProvider clientId="4913593618-u6om07sp5dd6vsngp3ek7f8761s662ur.apps.googleusercontent.com">
      <AppProvider>
        <App />
      </AppProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
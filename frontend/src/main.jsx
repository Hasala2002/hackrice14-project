import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './assets/utilities/Auth.Context'
import { BrowserRouter as Router } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { Auth0Provider } from '@auth0/auth0-react';
import '@mantine/core/styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
    <Auth0Provider
    domain="dev-6it0e13v2l4fm1pz.us.auth0.com"
    clientId="nHkdL7zdxwaNuwnahdYJoxvkTyP0FlFo"
    authorizationParams={{
      redirect_uri: "http://localhost:5173/login"
    }}
  >
    <AuthProvider>
    <MantineProvider
        theme={{
          fontFamily: 'Inter, sans-serif',
        }}
      >
    <App />
    </MantineProvider>
    </AuthProvider>
    </Auth0Provider>
    </Router>
  </StrictMode>
)

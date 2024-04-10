import React from 'react'
import ReactDOM from 'react-dom/client'
import { MantleSepoliaTestnet } from '@particle-network/chains';
import { AuthCoreContextProvider } from '@particle-network/auth-core-modal';
import App from './App'

import('buffer').then(({ Buffer }) => {
  window.Buffer = Buffer;
});

// replace yours
// apply them from Paticle Dashboard: https://dashboard.particle.network/#/
const REACT_APP_PROJECT_ID=""
const REACT_APP_CLIENT_KEY=""
//get this by creating your app in `Particle Dashboard -> Your APPs` 
const REACT_APP_APP_ID=""

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthCoreContextProvider
      options={{
        projectId: REACT_APP_PROJECT_ID,
        clientKey: REACT_APP_CLIENT_KEY,
        appId: REACT_APP_APP_ID,
        erc4337: {
          name: 'SIMPLE',
          version: '1.0.0',
        },
        wallet: {
          visible: true,
          customStyle: {
              supportChains: [MantleSepoliaTestnet],
          }
        }
      }}
    >
    <App />
      </AuthCoreContextProvider>
  </React.StrictMode>
)

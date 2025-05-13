import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import configureStore from './store'
const store = configureStore();
import '../src/components/VoiceHelper/voiceEngine.js'
import './index.css'
import App from './App.jsx'
import { restoreCSRF, csrfFetch } from './store/csrf.js'
import * as userActions from './store/session.js';
import { Modal, ModalProvider } from './context/Modal.jsx';

if (import.meta.env.MODE !== 'production') {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.userActions = userActions;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ModalProvider>
      <Provider store={store}>
        <Modal />
        <App />
      </Provider>
    </ModalProvider>
  </StrictMode>
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import configureStore from './store'
const  store = configureStore();
import './index.css'
import App from './App.jsx'
import { restoreCSRF, csrfFetch } from './store/csrf.js'
import * as userActions from './store/session.js';

if (import.meta.env.MODE !== 'production') {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.userActions = userActions;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)

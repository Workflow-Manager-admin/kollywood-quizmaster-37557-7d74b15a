import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { MovieSessionProvider } from './MovieSessionContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* App will be given movies prop from itself, so MovieSessionProvider
        wrap must be performed inside App.js where movies are known */}
    <App />
  </React.StrictMode>
);

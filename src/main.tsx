/**
 * SokoSnap Entry Point
 * Application bootstrap with React 19 and strict mode
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/globals.css';

// Get root element
const container = document.getElementById('root');

if (!container) {
    throw new Error('Root element not found. Make sure there is a <div id="root"></div> in your HTML.');
}

// Create React root and render app
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <HelmetProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </HelmetProvider>
    </React.StrictMode>
);

// Enable hot module replacement in development
if (import.meta.hot) {
    import.meta.hot.accept();
}

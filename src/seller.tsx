import React from 'react';
import { createRoot } from 'react-dom/client';
import SellerLandingPage from './components/features/SellerLandingPage';
import './styles/globals.css';
import './styles/seller.css'; // Override global app styles for landing page

// Get root element
const container = document.getElementById('root');

if (!container) {
    throw new Error('Root element not found. Make sure there is a <div id="root"></div> in your HTML.');
}

// Create React root and render app
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <SellerLandingPage />
    </React.StrictMode>
);
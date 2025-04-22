import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { HelmetProvider } from 'react-helmet-async'; // <-- YENİ: HelmetProvider import edildi

createRoot(document.getElementById('root')).render(
	<StrictMode>
		{/* YENİ: Uygulamayı HelmetProvider ile sarmala */}
		<HelmetProvider>
			<App />
		</HelmetProvider>
		{/* YENİ SON */}
	</StrictMode>,
);
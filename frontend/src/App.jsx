import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TemplateDetail from './components/TemplateDetail';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import DeliveryReturn from './components/DeliveryReturn';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import TemplateList from './components/TemplateList';
import styles from './App.module.css';

function App() {
  return (
    <Router>
      <div className={styles.appContainer}> {/* Ana container */}
        <header className={styles.appHeader}>
          <Link to="/" className={styles.logo}>
    <img src="/logo.png" alt="Sözleşme Oluştur Logosu" height="60" />
</Link>
          <nav className={styles.appNav}>
            <ul>
              <li><Link to="/">Şablonlar</Link></li> {/* Ana sayfa artık şablon listesi */}
              <li><Link to="/hakkimizda">Hakkımızda</Link></li>
              <li><Link to="/iletisim">İletişim</Link></li>
            </ul>
          </nav>
        </header>

        <main className={styles.appMain}>
          <Routes>
            <Route path="/" element={<TemplateList />} /> {/* Ana sayfa şablon listesi */}
            <Route path="/templates/:id" element={<TemplateDetail />} />
            <Route path="/gizlilik-politikasi" element={<PrivacyPolicy />} />
            <Route path="/kullanim-sartlari" element={<TermsOfService />} />
            <Route path="/teslimat-iade" element={<DeliveryReturn />} />
            <Route path="/hakkimizda" element={<AboutUs />} />
            <Route path="/iletisim" element={<ContactUs />} />
          </Routes>
        </main>

        <footer className={styles.appFooter}>
          <p>&copy; 2025 BelgeHızlı</p>
          <nav>
            <ul>
              <li><Link to="/gizlilik-politikasi">Gizlilik Politikası</Link></li>
              <li><Link to="/kullanim-sartlari">Kullanım Şartları</Link></li>
              <li><Link to="/teslimat-iade">Teslimat ve İade</Link></li>
            </ul>
          </nav>
        </footer>
      </div>
    </Router>
  );
}

export default App;
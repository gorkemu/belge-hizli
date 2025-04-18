import React from 'react';
// ÖNEMLİ: Routes ve Route'u react-router-dom'dan import et
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import styles from './App.module.css'; // Mevcut stil dosyanız

// Bileşenleri import et
import HomePage from './components/HomePage'; // Yeni Ana Sayfa
import TemplateList from './components/TemplateList';
import TemplateDetail from './components/TemplateDetail';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import DeliveryReturn from './components/DeliveryReturn';

function App() {
  return (
    <Router>
      {/* Ana container class'ını koru */}
      <div className={styles.appContainer}>
        {/* Header class'ını koru */}
        <header className={styles.appHeader}>
          {/* Logo Linkini ve class'ını koru */}
          <Link to="/" className={styles.logo}>
            {/* Logo görselini ekle (public klasöründe olduğundan emin ol) */}
            <img src="/logo.png" alt="Belge Hızlı Logosu" height="50" /> {/* Yüksekliği ayarlayabilirsiniz */}
          </Link>
          {/* Nav class'ını koru */}
          <nav className={styles.appNav}>
            {/* Mevcut ul/li yapısını koru */}
            <ul>
              {/* Linkleri güncelle */}
              <li><Link to="/">Ana Sayfa</Link></li>
              <li><Link to="/templates">Şablonlar</Link></li>
              <li><Link to="/hakkimizda">Hakkımızda</Link></li>
              <li><Link to="/iletisim">İletişim</Link></li>
            </ul>
          </nav>
        </header>

        {/* Main class'ını koru */}
        <main className={styles.appMain}>
          {/* Routes yapısını kullan */}
          <Routes>
            {/* Ana yol (/) için HomePage */}
            <Route path="/" element={<HomePage />} />
            {/* /templates yolu için TemplateList */}
            <Route path="/templates" element={<TemplateList />} />
            {/* Diğer rotalar */}
            <Route path="/templates/:id" element={<TemplateDetail />} />
            <Route path="/gizlilik-politikasi" element={<PrivacyPolicy />} />
            <Route path="/kullanim-sartlari" element={<TermsOfService />} />
            {/* Teslimat linkini düzelt (muhtemelen - yerine / olmalı) */}
            <Route path="/teslimat-iade" element={<DeliveryReturn />} />
            <Route path="/hakkimizda" element={<AboutUs />} />
            <Route path="/iletisim" element={<ContactUs />} />
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </main>

        {/* Footer class'ını koru */}
        <footer className={styles.appFooter}> {/* Footer class'ını düzelt: appFooter olmalı */}
          <p>© {new Date().getFullYear()} Belge Hızlı. Tüm hakları saklıdır.</p>
          {/* Mevcut nav/ul/li yapısını koru */}
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
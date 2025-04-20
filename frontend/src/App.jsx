import React from 'react';
// ÖNEMLİ: Routes ve Route'u react-router-dom'dan import et
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CookieConsent from "react-cookie-consent"; // <-- YENİ IMPORT
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

        {/* ---- YENİ: Çerez Onay Banner'ı ---- */}
        <CookieConsent
          location="bottom" // Banner'ın konumu (bottom, top, none)
          buttonText="Kabul Et" // Kabul butonu metni
          declineButtonText="Reddet" // Reddet butonu metni (opsiyonel, enableDeclineButton true ise)
          cookieName="belgeHizliCookieConsent" // Tarayıcıda saklanacak cookie adı
          style={{ background: "var(--gray-800)", color: "var(--gray-100)", fontSize: "14px" }} // Temel stil
          buttonStyle={{ color: "var(--gray-900)", background: "var(--gray-100)", fontSize: "13px", fontWeight: "bold", borderRadius: "5px", padding: "8px 15px" }}
          declineButtonStyle={{ color: "#aaa", background: "#555", fontSize: "13px", borderRadius: "5px", padding: "8px 15px", marginLeft: "10px" }}
          expires={150} // Cookie geçerlilik süresi (gün)
          enableDeclineButton // Reddet butonunu aktif et
          // onAccept={() => { // Kabul edildiğinde çalışacak fonksiyon (opsiyonel)
          //   alert("Çerezleri kabul ettiniz! Analitikler şimdi başlayabilir.");
          //   // Burada Google Analytics'i başlatma vb. kodlar olabilir
          // }}
          // onDecline={() => { // Reddedildiğinde çalışacak fonksiyon (opsiyonel)
          //   alert("Pazarlama/Analitik çerezleri reddettiniz.");
          // }}
          // debug={true} // Geliştirme sırasında test için her zaman gösterir
        >
          Bu web sitesi, kullanıcı deneyimini geliştirmek ve site trafiğini analiz etmek için çerezleri kullanır. Zorunlu çerezler sitenin çalışması için gereklidir. Devam ederek veya "Kabul Et" butonuna tıklayarak tüm çerezleri kabul etmiş olursunuz. Daha fazla bilgi için{" "}
          <Link to="/gizlilik-politikasi" style={{ color: "var(--secondary-color)", textDecoration: "underline" }}>
            Gizlilik Politikamızı
          </Link>{" "}
          inceleyebilirsiniz.
           {/* İsterseniz buraya "Ayarlar" linki/butonu ekleyebilirsiniz */}
        </CookieConsent>
        {/* ---- YENİ SON ---- */}

      </div>
    </Router>
  );
}

export default App;
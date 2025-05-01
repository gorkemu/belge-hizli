import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CookieConsent from "react-cookie-consent";
import styles from './App.module.css';

// Bileşenleri import et
import HomePage from './components/HomePage';
import TemplateList from './components/TemplateList';
import TemplateDetail from './components/TemplateDetail';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import DeliveryReturn from './components/DeliveryReturn';
import PreInformationForm from './components/PreInformationForm'; // <-- YENİ: ÖBF component'ini import et

function App() {
	return (
		<Router>
			<div className={styles.appContainer}>
				<header className={styles.appHeader}>
					<Link to="/" className={styles.logo}>
						<img src="/logo.png" alt="Belge Hızlı Logosu" height="50" />
					</Link>
					<nav className={styles.appNav}>
						<ul>
							<li><Link to="/">Ana Sayfa</Link></li>
							<li><Link to="/sablonlar">Şablonlar</Link></li>
							<li><Link to="/hakkimizda">Hakkımızda</Link></li>
							<li><Link to="/iletisim">İletişim</Link></li>
						</ul>
					</nav>
				</header>

				<main className={styles.appMain}>
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/sablonlar" element={<TemplateList />} />
						<Route path="/sablonlar/detay/:slug" element={<TemplateDetail />} />
						<Route path="/gizlilik-politikasi" element={<PrivacyPolicy />} />
						<Route path="/kullanim-sartlari" element={<TermsOfService />} />
						<Route path="/teslimat-iade" element={<DeliveryReturn />} />
						<Route path="/hakkimizda" element={<AboutUs />} />
						{/* // <-- YENİ: ÖBF için route ekle --> */}
						<Route path="/on-bilgilendirme-formu" element={<PreInformationForm />} />

						<Route path="/iletisim">
							<Route path=":status" element={<ContactUs />} />
							<Route path="" element={<ContactUs />} />
						</Route>
						{/* <Route path="*" element={<NotFound />} /> */}
					</Routes>
				</main>

				<footer className={styles.appFooter}>
					<p>© {new Date().getFullYear()} Belge Hızlı. Tüm hakları saklıdır.</p>
					<nav>
						<ul>
							<li><Link to="/gizlilik-politikasi">Gizlilik Politikası</Link></li>
							<li><Link to="/kullanim-sartlari">Kullanım Şartları</Link></li>
							<li><Link to="/teslimat-iade">Teslimat ve İade</Link></li>
                            {/* // <-- YENİ: Footer'a ÖBF linki ekle (opsiyonel ama iyi olur) --> */}
                            <li><Link to="/on-bilgilendirme-formu">Ön Bilgilendirme Formu</Link></li>
						</ul>
					</nav>
				</footer>

				<CookieConsent
                    // ... (CookieConsent ayarları aynı kalır) ...
					location="bottom"
					buttonText="Kabul Et"
					declineButtonText="Reddet"
					cookieName="belgeHizliCookieConsent"
					style={{ background: "var(--gray-800)", color: "var(--gray-100)", fontSize: "14px" }}
					buttonStyle={{ color: "var(--gray-900)", background: "var(--gray-100)", fontSize: "13px", fontWeight: "bold", borderRadius: "5px", padding: "8px 15px" }}
					declineButtonStyle={{ color: "#aaa", background: "#555", fontSize: "13px", borderRadius: "5px", padding: "8px 15px", marginLeft: "10px" }}
					expires={150}
					enableDeclineButton
				>
					Bu web sitesi, kullanıcı deneyimini geliştirmek ve site trafiğini analiz etmek için çerezleri kullanır. Zorunlu çerezler sitenin çalışması için gereklidir. Devam ederek veya "Kabul Et" butonuna tıklayarak tüm çerezleri kabul etmiş olursunuz. Daha fazla bilgi için{" "}
					<Link to="/gizlilik-politikasi" style={{ color: "var(--secondary-color)", textDecoration: "underline" }}>
						Gizlilik Politikamızı
					</Link>{" "}
				</CookieConsent>
			</div>
		</Router>
	);
}

export default App;
// frontend/src/components/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Yönlendirme için Link bileşeni
import styles from './HomePage.module.css'; // Stil dosyasını import et
import { Helmet } from 'react-helmet-async'; // <-- YENİ: Helmet import edildi

// İkonları temsil etmek için basit yer tutucular (Daha sonra gerçek ikonlar eklenebilir)
const IconPlaceholder = ({ label }) => <div className={styles.iconPlaceholder}>{label}</div>;

function HomePage() {
	return (
		<> {/* Fragment kullanmak iyi */}
			{/* --- Helmet ile Dinamik Meta Etiketleri --- */}
			{/* Daha önceki doğrudan <title>, <meta>, <link> etiketleri Helmet içine taşındı */}
			<Helmet> {/* <-- YENİ: Helmet bileşeni başladı */}
				<title>Belge Hızlı - Online Sözleşme ve Belge Oluşturucu</title>
				<meta name="description" content="İhtiyacınıza özel kira sözleşmesi, iş anlaşması, dilekçe ve daha birçok belge şablonunu online olarak kolayca doldurun ve anında PDF indirin." />
				<link rel="canonical" href="https://www.belgehizli.com/" />
				{/* İsterseniz Open Graph vb. etiketleri de buraya ekleyebilirsiniz */}
				{/* <meta property="og:title" content="..." /> */}
			</Helmet> {/* <-- YENİ: Helmet bileşeni bitti */}
			{/* --- Meta Etiketleri Sonu --- */}

			<div className={styles.homeContainer}>
				{/* Ana Bölüm (Hero Section) */}
				<section className={styles.heroSection}>
					<div className={styles.heroContent}>
						{/* H1 etiketi zaten doğru kullanılmış */}
						<h1 className={styles.heroTitle}>
							Profesyonel Sözleşmeler ve Belgeler Anında Hazır
						</h1>
						<p className={styles.heroSubtitle}>
							İhtiyacınıza özel, dinamik olarak oluşturulan şablonlarla saniyeler içinde PDF belgelerinizi hazırlayın.
						</p>
						<Link to="/sablonlar" className={styles.ctaButton}>
							Şablonları İncele
						</Link>
					</div>
					<div className={styles.heroImagePlaceholder}>
						{/* Buraya isterseniz bir görsel veya ikon ekleyebilirsiniz */}
						<IconPlaceholder label="📄" />
					</div>
				</section>

				{/* Nasıl Çalışır Bölümü */}
				<section className={styles.howItWorksSection}>
					{/* H2 etiketi alt başlık için doğru kullanılmış */}
					<h2 className={styles.sectionTitle}>Nasıl Çalışır?</h2>
					<div className={styles.stepsContainer}>
						<div className={styles.step}>
							<IconPlaceholder label="🔍" />
							<h3>1. Şablon Seç</h3>
							<p>Geniş kütüphanemizden ihtiyacınız olan şablonu seçin.</p>
						</div>
						<div className={styles.step}>
							<IconPlaceholder label="✍️" />
							<h3>2. Formu Doldur</h3>
							<p>Dinamik formdaki alanları kolayca doldurun.</p>
						</div>
						<div className={styles.step}>
							<IconPlaceholder label="📄" />
							<h3>3. İndir ve Kullan</h3>
							<p>Oluşturulan PDF belgenizi anında indirin.</p>
						</div>
					</div>
				</section>

				{/* Alt Çağrı (Footer CTA) */}
				<section className={styles.footerCtaSection}>
					<Link to="/sablonlar" className={styles.ctaButton}>
						Tüm Şablonları Gör
					</Link>
				</section>
			</div>
		</>
	);
}

export default HomePage;
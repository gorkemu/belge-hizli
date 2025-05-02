import React from 'react';
import styles from './ContactUs.module.css'; // Stil dosyasını import et
import { Helmet } from 'react-helmet-async'; // <-- YENİ: Helmet import edildi

function ContactUs() {
	// Yalnızca şahıs firması için gerekli placeholder bilgileri
	// Lütfen kendi bilgilerinizle doldurun
	const ownerName = "Abdurrahman Görkem Ünal"; // veya direkt Adınız Soyadınız
	const address = "Gülbahar Mah. Kurtuluş 1 Sk. No: 15 İç Kapı No:10 Şişli / İSTANBUL";
	const taxOffice = "Zincirlikuyu Vergi Dairesi Müd.";
	const taxIdNumber = "9070132427";
	const email = "info@belgehizli.com"; // E-posta adresinizi buraya girin
	const phone = "05530968833";

	// Kaldırılan placeholder bilgileri: companyTitle, mersisNo, kepAddress,
	// businessName, registeredTrademark, chamberMembership, chamberRegistryNo, professionalRulesLink

	return (
		<>
			{/* --- Helmet ile Sayfa Başlığı ve Meta Etiketleri --- */}
			{/* Daha önceki doğrudan <title>, <meta>, <link> etiketleri Helmet içine taşındı */}
			<Helmet> {/* <-- YENİ: Helmet bileşeni başladı */}
				<title>İletişim - Belge Hızlı | Bize Ulaşın</title>
				<meta
					name="description"
					content="Belge Hızlı ile iletişime geçin. Soru, öneri veya işbirliği talepleriniz için e-posta gönderebilirsiniz."
				/>
				<link rel="canonical" href="https://www.belgehizli.com/iletisim" />
			</Helmet> {/* <-- YENİ: Helmet bileşeni bitti */}
			{/* --- Meta Etiketleri Sonu --- */}


			<div className={styles.container}>
				{/* Ana başlık H1 olarak güncellendi */}
				<h1 className={styles.title}>İletişim Bilgileri</h1> {/* <-- GÜNCELLENDİ: H2 yerine H1 */}
				<p className={styles.paragraph}>
					Bizimle iletişime geçmek için aşağıdaki bilgileri kullanabilirsiniz.
					Müşteri destek talepleriniz için öncelikli olarak e-posta adresimizi kullanmanızı rica ederiz.
				</p>

				{/* Şahıs Firması Bilgileri - Alt başlık H2 olarak güncellendi */}
				<div className={styles.infoBox}>
					<h2 className={styles.subHeading}>Firma Bilgileri</h2> {/* <-- GÜNCELLENDİ: H4 yerine H2 */}
					<p className={styles.infoItem}>
						<strong className={styles.label}>Adı Soyadı:</strong> {ownerName}
					</p>
					<p className={styles.infoItem}>
						<strong className={styles.label}>Vergi Dairesi:</strong> {taxOffice}
					</p>
					<p className={styles.infoItem}>
						<strong className={styles.label}>Vergi Kimlik Numarası:</strong> {taxIdNumber}
					</p>
					<p className={styles.infoItem}>
						<strong className={styles.label}>Merkez Adresi:</strong> {address}
					</p>
				</div>

				{/* İletişim Kanalları - Alt başlık H2 olarak güncellendi */}
				<div className={styles.contactChannels}>
					<h2 className={styles.subHeading}>İletişim Kanalları</h2> {/* <-- GÜNCELLENDİ: H4 yerine H2 */}
					<p className={styles.infoItem}>
						<strong className={styles.label}>E-posta:</strong> {email}
					</p>
					<p className={styles.infoItem}>
						<strong className={styles.label}>Telefon:</strong> {phone}
					</p>
				</div>

				{/* Diğer Bilgiler bölümü tamamen kaldırıldı */}
				{/* Yorumlu İletişim formu kısmı olduğu gibi bırakıldı */}
			</div>
		</>
	);
}

export default ContactUs;
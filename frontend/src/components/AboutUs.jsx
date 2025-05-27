import React from 'react';
import styles from './AboutUs.module.css'; // Stil dosyasını import et
import { Helmet } from 'react-helmet-async'; // <-- YENİ: Helmet import edildi

function AboutUs() {
	const siteName = "Belge Hızlı";

	return (
		<>
			{/* --- Helmet ile Sayfa Başlığı ve Meta Etiketleri --- */}
			{/* Daha önceki doğrudan <title>, <meta>, <link> etiketleri Helmet içine taşındı */}
			<Helmet> {/* <-- YENİ: Helmet bileşeni başladı */}
				<title>Hakkımızda - Belge Hızlı | Amacımız ve Kolaylaştırdığımız Belge Oluşturma Süreci</title>
				<meta name="description" content="Belge Hızlı'nın kuruluş amacı ve online belge oluşturma sürecini nasıl kolaylaştırdığımız hakkında bilgi edinin." />
				<link rel="canonical" href="https://www.belgehizli.com/hakkimizda" />
			</Helmet> {/* <-- YENİ: Helmet bileşeni bitti */}
			{/* --- Meta Etiketleri Sonu --- */}

			<div className={styles.container}>
				{/* Başlık stilini uygula - H1 olarak güncellendi */}
				<h1 className={styles.title}>Hakkımızda</h1> {/* <-- GÜNCELLENDİ: H2 yerine H1 */}

				{/* Paragraf stilini uygula */}
				<p className={styles.paragraph}>
					<strong>{siteName}</strong> olarak amacımız, sıkça ihtiyaç duyulan yasal belgeleri
					hazırlama sürecini kolaylaştırmak, hızlı ve pratik çözümler sunmaktır. Teknolojiyi kullanarak,
					belirli standartlardaki belge ihtiyaçlarınızı, uzmanlara danışma ihtiyacı duymadan (ancak bunun hukuki tavsiye olmadığını unutmayın!),
					kendi bilgilerinizle hızlıca oluşturmanıza olanak tanıyoruz.
				</p>

				{/* Paragraf stilini uygula */}
				<p className={styles.paragraph}>
					Sitemizde bulunan şablonlar, alanında deneyimli profesyonellerin katkılarıyla genel ihtiyaçlar göz önünde bulundurularak hazırlanmıştır.
					Form alanlarını doldurarak bu şablonları kendi durumunuza göre kişiselleştirebilir ve anında
					PDF formatında indirebilirsiniz.
				</p>

				{/* Uyarı/not stilini uygula */}
				<p className={styles.importantNote}>
					<strong>Unutmayın:</strong> {siteName} bir hukuk bürosu değildir ve sunduğumuz hizmetler hukuki danışmanlık
					yerine geçmez. Oluşturduğunuz belgelerin özel durumunuza tam uygunluğu ve yasal geçerliliği konusunda
					emin olmak için her zaman bir hukuk profesyoneline danışmanızı öneririz.
				</p>

			</div>
		</>
	);
}

export default AboutUs;
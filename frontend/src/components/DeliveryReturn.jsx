import React from 'react';
import styles from './DeliveryReturn.module.css'; // Stil dosyasını import et
import { Helmet } from 'react-helmet-async'; // <-- YENİ: Helmet import edildi

function DeliveryReturn() {
	const siteName = "Belge Hızlı";
	const email = "info@belgehizli.com";

	return (
		<>
			{/* --- Helmet ile Sayfa Başlığı ve Meta Etiketleri --- */}
			{/* Daha önceki doğrudan <title>, <meta>, <link> etiketleri Helmet içine taşındı */}
			<Helmet> {/* <-- YENİ: Helmet bileşeni başladı */}
				<title>Teslimat ve İade Koşulları - Belge Hızlı</title>
				<meta name="description" content="Belge Hızlı'dan satın alınan şablonların teslimatı ve olası iade süreçleri hakkındaki politikamız." />
				{/* Canonical URL'in App.jsx'teki rota ile tutarlı olduğundan emin olun */}
				<link rel="canonical" href="https://www.belgehizli.com/teslimat-iade" /> {/* Canonical URL güncellendi */}
			</Helmet> {/* <-- YENİ: Helmet bileşeni bitti */}
			{/* --- Meta Etiketleri Sonu --- */}


			<div className={styles.container}>
				{/* Ana başlık H1 olarak güncellendi */}
				<h1 className={styles.title}>Teslimat ve İade Politikası</h1> {/* <-- GÜNCELLENDİ: H2 yerine H1 */}

				<p className={styles.importantNote}>
					Sitemiz şu anda beta aşamasındadır ve tüm şablonlar geçici olarak ücretsiz sunulmaktadır. Ödeme entegrasyonumuz henüz aktif değildir. Aşağıdaki politikalar, gelecekte aktif olacak ücretli hizmetlerimiz ve ödeme süreçlerimiz için geçerlidir. Şu anda indirdiğiniz tüm şablonlar ücretsizdir.
				</p>

				{/* Alt başlık H2 olarak güncellendi */}
				<h2 className={styles.sectionTitle}>Teslimat Süreci</h2> {/* <-- GÜNCELLENDİ: H3 yerine H2 */}
				<p className={styles.paragraph}>
					{siteName} olarak sunduğumuz hizmet, kullanıcılarımızın seçtikleri şablonlar üzerindeki form alanlarını
					doldurarak kişiselleştirilmiş PDF formatında belgeler oluşturması ve indirmesidir. Hizmetimiz tamamen
					dijital ortamda gerçekleşmektedir.
				</p>
				{/* Sıralı liste stili */}
				<ol className={styles.orderedList}>
					<li>İhtiyacınıza uygun belge şablonunu seçin.</li>
					<li>Şablon detay sayfasındaki form alanlarını dikkatlice doldurun.</li>
					{/* ŞİMDİLİK YENİDEN İFADE EDİLDİ: Ödeme adımına geçiş GELECEKTE olacak */}
					<li>Gelecekteki ücretli hizmetimizde, gerekli bilgileri girdikten sonra ödeme adımına geçilecektir.</li> 
					{/* ŞİMDİLİK YENİDEN İFADE EDİLDİ: Ödeme sonrası indirme GELECEKTE olacak */}
					<li>Ücretli hizmetimizde ödemeniz ödeme altyapıları üzerinden başarıyla tamamlandıktan sonra, oluşturulan belgeniz indirilmeye hazır hale gelecektir.</li> 
				</ol>
				<p className={styles.paragraph}>
					{/* ŞİMDİLİK YENİDEN İFADE EDİLDİ: Teslimatın ödemeye bağlılığı GELECEKTE olacak */}
					Ücretli hizmetimizde teslimat, ödemenin başarıyla tamamlanmasının hemen ardından elektronik ortamda anında gerçekleşir. 
					Herhangi bir fiziksel kargo veya teslimat süreci bulunmamaktadır.
				</p>
				<p className={styles.paragraph}>
					Belgenizi indirirken veya alırken teknik bir sorun yaşarsanız, lütfen <a href={`mailto:${email}`}>{email}</a> adresi üzerinden
					bizimle iletişime geçiniz. Sorunun çözümü için size yardımcı olmaktan memnuniyet duyarız.
				</p>

				{/* Alt başlık H2 olarak güncellendi */}
				<h2 className={styles.sectionTitle}>İade Politikası ve Cayma Hakkı</h2> {/* <-- GÜNCELLENDİ: H3 yerine H2 */}
				<p className={styles.paragraph}>
					Sunduğumuz hizmet, "elektronik ortamda anında ifa edilen hizmetler" ve "tüketiciye anında teslim edilen
					gayrimaddi mallar" kategorisine girmektedir.
				</p>
				{/* Alıntı/Kanun maddesi stili */}
				<blockquote className={styles.quote}>
					Mesafeli Sözleşmeler Yönetmeliği'nin 15. Maddesi'nin 1. Fıkrası'nın (ğ) bendi uyarınca:
					<br />
					<em>
						"Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayrimaddi
						mallara ilişkin sözleşmelerde cayma hakkı kullanılamaz."
					</em>
				</blockquote>
				<p className={styles.paragraph}>
					{/* ŞİMDİLİK YENİDEN İFADE EDİLDİ: Cayma hakkının olmayışı ÖDEME SONRASI için GEÇERLİ */}
					Ücretli hizmetimiz kapsamında, {siteName} üzerinden satın alınan ve ödeme sonrası anında kullanıma/indirmeye sunulan dijital PDF belgeler için <strong>cayma hakkı bulunmamaktadır ve ücret iadesi yapılamamaktadır.</strong>"
				</p>
				<p className={styles.paragraph}>
					Kullanıcılarımız, sipariş vermeden önce şablon tanıtım sayfalarındaki açıklamaları, varsa örnek
					görselleri inceleyerek ve formu doldurma sürecini deneyimleyerek (ödeme öncesi önizleme varsa)
					hizmet hakkında yeterli bilgiye sahip olurlar. Ödeme yapılmasıyla birlikte bu koşullar kabul edilmiş sayılır. {/* <-- YENİDEN İFADE EDİLMELİ */}
				</p>
				<p className={styles.paragraph}>
					Form alanlarına girilen bilgilerin doğruluğu tamamen kullanıcının sorumluluğundadır. Kullanıcı
					hatasından kaynaklanan (yanlış veya eksik bilgi girme gibi) durumlarda iade veya değişiklik yapılmaz.
				</p>
				{/* İstisna durumu paragrafı */}
				<p className={styles.exceptionNote}>
					Ancak, sistemimizden kaynaklanan teknik bir hata nedeniyle belgenin hiç teslim edilememesi veya
					hatalı/boş bir belge teslim edilmesi gibi istisnai durumlarda, lütfen <a href={`mailto:${email}`}>{email}</a> adresinden bizimle
					iletişime geçiniz. Durum incelenecek ve hatanın bizden kaynaklandığı tespit edilirse gerekli
					düzeltme yapılacak veya istisnai olarak iade değerlendirilebilecektir.
				</p>
			</div>
		</>
	);
}

export default DeliveryReturn;
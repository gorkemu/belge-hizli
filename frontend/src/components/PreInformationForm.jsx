import React from 'react';
import { Helmet } from 'react-helmet-async';
import styles from './PreInformationForm.module.css';

function PreInformationForm() {

	const ownerName = "Abdurrahman Görkem Ünal"; // Şahıs firması sahibi Ad Soyad
	const address = "Gülbahar Mah. Kurtuluş 1 Sk. No: 15 İç Kapı No:10 Şişli / İSTANBUL"; // Resmi kayıtlardaki adresiniz
	const email = "info@belgehizli.com"; // E-posta adresiniz
	const siteUrl = "https://www.belgehizli.com"; // Sitenizin URL'si
	const phone = "05530968833"; // Telefon numaranız

	return (
		<>
			<Helmet>
				<title>Ön Bilgilendirme Formu - Belge Hızlı</title>
				<meta name="description" content="Belge Hızlı hizmetleri için yasal Ön Bilgilendirme Formu. Satın alma öncesi haklarınız ve hizmet detayları hakkında bilgi edinin." />
				<link rel="canonical" href={`${siteUrl}/on-bilgilendirme-formu`} />
			</Helmet>

			<div className={styles.container}>

				{/* YENİ: Geçici ücretsizlik açıklaması eklendi */}
				<p className={styles.importantNote}>
					Sitemiz şu anda beta aşamasındadır ve tüm şablonlar geçici olarak ücretsiz sunulmaktadır. Ödeme entegrasyonumuz henüz aktif değildir. Aşağıdaki formda belirtilen bilgiler ve koşullar, <strong>gelecekte aktif olacak ücretli hizmetlerimiz ve ödeme süreçlerimiz için geçerlidir</strong>. Şu anda indirdiğiniz tüm şablonlar ücretsizdir ve bu form, ücretli hizmetin koşulları hakkında bilgi vermek amacıyla sunulmaktadır.
				</p>
				{/* YENİ SON */}


				{/* Ana başlık H1 olarak güncellendi */}
				<h1 className={styles.title}>ÖN BİLGİLENDİRME FORMU</h1> {/* <-- GÜNCELLENDİ: H2 yerine H1 */}
				<p className={styles.intro}>
					İşbu Ön Bilgilendirme Formu, 6502 Sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri uyarınca, aşağıda detayları verilen hizmetin satın alınmasından önce ALICI'yı bilgilendirmek amacıyla düzenlenmiştir.
				</p>

				{/* Alt başlık H2 olarak güncellendi */}
				<h2 className={styles.sectionTitle}>1. SATICI BİLGİLERİ</h2> {/* <-- GÜNCELLENDİ: H3 yerine H2 */}
				<ul className={styles.infoList}>
					<li><strong>Unvan/Ad Soyad:</strong> {ownerName}</li>
					<li><strong>Adres:</strong> {address}</li>
					<li><strong>Telefon:</strong> {phone}</li>
					<li><strong>E-posta:</strong> {email}</li>
					<li><strong>Web Sitesi:</strong> {siteUrl}</li>
				</ul>

				{/* Alt başlık H2 olarak güncellendi */}
				<h2 className={styles.sectionTitle}>2. ALICI (TÜKETİCİ) BİLGİLERİ</h2> {/* <-- GÜNCELLENDİ: H3 yerine H2 */}
				<p className={styles.paragraph}>
					Hizmeti satın alan ve bilgileri sipariş/ödeme sırasında elektronik ortamda alınan gerçek veya tüzel kişidir. Alıcı'nın adı, soyadı, adresi, telefonu ve e-posta adresi gibi bilgileri, sipariş formunda ve düzenlenecek faturada yer alacaktır.
				</p>

				{/* Alt başlık H2 olarak güncellendi */}
				<h2 className={styles.sectionTitle}>3. SÖZLEŞME KONUSU HİZMETİN TEMEL NİTELİKLERİ</h2> {/* <-- GÜNCELLENDİ: H3 yerine H2 */}
				<ul className={styles.definitionList}>
					<li><strong>Hizmetin Tanımı:</strong> ALICI tarafından {siteUrl} adresindeki siteden seçilen belirli bir belge şablonunun (örn: Konut Kira Sözleşmesi, Araç Satış Sözleşmesi vb.), ALICI'nın elektronik form aracılığıyla girdiği bilgilerle kişiselleştirilerek, kullanıma hazır PDF formatında dijital bir belge oluşturulması ve bu belgenin elektronik ortamda ALICI'ya teslim edilmesi hizmetidir.</li>
					<li><strong>Şablon Seçimi:</strong> Sözleşmeye konu olan spesifik şablonun adı ve temel özellikleri, ALICI'nın sipariş anında seçtiği ve onayladığı şablon detay sayfasında belirtilmektedir.</li>
					<li><strong>Önemli Not:</strong> Satıcı (Belge Hızlı) bir hukuk bürosu değildir ve hukuki danışmanlık hizmeti vermemektedir. Sunulan şablonlar ve oluşturulan PDF belgeler genel bilgilendirme amaçlı olup, hukuki tavsiye niteliği taşımaz. ALICI, oluşturduğu belgenin kendi özel durumu için hukuki uygunluğunu ve geçerliliğini teyit etmekten ve gerekirse bir hukuk uzmanına danışmaktan kendisi sorumludur.</li>
				</ul>

				{/* Alt başlık H2 olarak güncellendi */}
				<h2 className={styles.sectionTitle}>4. HİZMETİN VERGİLER DAHİL TOPLAM FİYATI VE ÖDEME ŞEKLİ</h2> {/* <-- GÜNCELLENDİ: H3 yerine H2 */}
				<ul className={styles.definitionList}>
					{/*
					HATIRLATMA: Ödeme entegrasyonu tamamlandığında ve ücretli hizmet başladığında bu bölümü gerçek fiyat ve ödeme yöntemlerini yansıtacak şekilde güncelle.
					Bu kısımdaki metinler şu anda GELECEKTEKİ ücretli hizmeti tarif etmektedir.
					*/}
					<li>
						<strong>Hizmet Bedeli (KDV Dahil):</strong> Gelecekteki ücretli hizmetimizin bedeli, ALICI'nın seçtiği şablonun detay sayfasında belirtilecektir. Şu an tüm şablonlar ücretsizdir.
					</li>
					<li>
						<strong>Ödeme Yöntemi:</strong> Gelecekteki ücretli hizmetimiz için ödeme, Sitede sunulacak olan güvenli ödeme altyapıları kullanılarak yapılacaktır. Şu an ödeme kabul edilmemektedir.
					</li>
					<li>
						<strong>Ek Masraflar:</strong> Hizmet dijital olarak teslim edildiğinden, kargo, teslimat vb. ek bir masraf bulunmamaktadır.
					</li>
				</ul>

				{/* Alt başlık H2 olarak güncellendi */}
				<h2 className={styles.sectionTitle}>5. TESLİMAT BİLGİLERİ</h2> {/* <-- GÜNCELLENDİ: H3 yerine H2 */}
				<ul className={styles.definitionList}>
					{/*
					HATIRLATMA: Ödeme entegrasyonu tamamlandığında ve ücretli hizmet başladığında bu bölümü güncelle.
					Bu kısımdaki metinler şu anda GELECEKTEKİ ücretli hizmetin teslimat sürecini tarif etmektedir.
					*/}
					<li>
						<strong>Teslimat Şekli:</strong> Hizmet, elektronik ortamda anında ifa edilir. Gelecekteki ücretli hizmetimizde, başarılı ödemeyi takiben, oluşturulan kişiselleştirilmiş PDF belgesi ALICI tarafından Site üzerinden indirilebilir hale getirilecek ve ayrıca ALICI'nın sipariş sırasında belirttiği e-posta adresine gönderilecektir. Şu an indirme ücretsizdir.
					</li>
					<li>
						<strong>Teslimat Anı:</strong> Gelecekteki ücretli hizmetimizde teslimat anı, ödemenin başarıyla tamamlanması ve PDF belgesinin indirilebilir/gönderilebilir hale gelmesi anıdır. Şu an teslimat anı indirme işleminin tamamlandığı andır.
					</li>
					<li>
						<strong>Teknik Sorunlar:</strong> Belgenin indirilmesinde veya alınmasında teknik bir sorun yaşanması durumunda ALICI, Satıcı'nın {email} e-posta adresi üzerinden iletişime geçmelidir. Satıcı, sorunun giderilmesi için makul çabayı gösterecektir.
					</li>
				</ul>

				{/* Alt başlık H2 olarak güncellendi */}
				<h2 className={styles.sectionTitle}>6. CAYMA HAKKI</h2> {/* <-- GÜNCELLENDİ: H3 yerine H2 */}
				<p className={styles.paragraph}>
					Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesinin birinci fıkrasının (ğ) bendi uyarınca, <strong>"Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayrimaddi mallara ilişkin sözleşmelerde cayma hakkı kullanılamaz."</strong>
				</p>
				<p className={`${styles.paragraph} ${styles.warningNote}`}>
					{/*
					HATIRLATMA: Ödeme entegrasyonu tamamlandığında ve ücretli hizmet başladığında bu bölümü güncelle.
					Bu kısımdaki metinler şu anda GELECEKTEKİ ücretli hizmetin cayma hakkı koşullarını tarif etmektedir.
					*/}
					Bu doğrultuda, gelecekteki ücretli hizmetimiz kapsamında, ALICI'nın sipariş edeceği kişiselleştirilmiş PDF belge oluşturma hizmeti elektronik ortamda anında ifa edildiğinden ve belge anında teslim edilen gayrimaddi mal niteliğinde olacağından, ALICI'nın (tüketici olsa dahi) yasal olarak <strong>cayma hakkı bulunmayacaktır ve ödeme yapıldıktan sonra ücret iadesi yapılamayacaktır.</strong> ALICI, ücretli hizmeti kullanmaya başlamadan önce bu durumu bildiğini ve kabul ettiğini beyan eder.
				</p>

				{/* Alt başlık H2 olarak güncellendi */}
				<h2 className={styles.sectionTitle}>7. ŞİKAYET VE İTİRAZ BAŞVURULARI</h2> {/* <-- GÜNCELLENDİ: H3 yerine H2 */}
				<p className={styles.paragraph}>
					ALICI, hizmetle ilgili şikayetlerini yukarıda belirtilen SATICI iletişim bilgileri (özellikle e-posta: <a href={`mailto:${email}`}>{email}</a>) üzerinden iletebilir.
				</p>
				<p className={styles.paragraph}>
					Ayrıca, tüketici sıfatına haiz ALICI, uyuşmazlık konusundaki başvurularını, T.C. Ticaret Bakanlığı tarafından her yıl belirlenen parasal sınırlar dahilinde, kendi yerleşim yerinin bulunduğu veya hizmeti satın aldığı yerdeki Tüketici Sorunları Hakem Heyeti'ne veya Tüketici Mahkemesi'ne yapabilir.
				</p>

				<hr className={styles.separator} />

				<p className={styles.confirmation}>
					ALICI, işbu Ön Bilgilendirme Formu'nu okuyup anladığını ve Mesafeli Satış Sözleşmesi'ni onaylamadan önce hizmetin temel nitelikleri, satış fiyatı, ödeme şekli, teslimat ve cayma hakkı konularında açıkça bilgilendirildiğini kabul ve beyan eder.
				</p>
			</div>
		</>
	);
}

export default PreInformationForm;
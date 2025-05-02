import React from 'react';
import styles from './TermsOfService.module.css'; // Stil dosyasını import et
import { Helmet } from 'react-helmet-async'; // <-- YENİ: Helmet import edildi

function TermsOfService() {
	// Şahıs firması için gerekli temel bilgiler (Sözleşme tarafları ve iletişim için)
	const siteName = "Belge Hızlı"; 
	const ownerName = "Abdurrahman Görkem Ünal"; 
	const address = "Gülbahar Mah. Kurtuluş 1 Sk. No: 15 İç Kapı No:10 Şişli / İSTANBUL"; 
	const email = "info@belgehizli.com"; 
	const lastUpdateDate = "02.05.2025"; // Son güncelleme tarihi
	const siteUrl = "https://www.belgehizli.com/"; 
	const phone = "05530968833"; 

	return (
		<>
			{/* --- Helmet ile Sayfa Başlığı ve Meta Etiketleri --- */}
			{/* Daha önceki doğrudan <title>, <meta>, <link> etiketleri Helmet içine taşındı */}
			<Helmet> {/* <-- YENİ: Helmet bileşeni başladı */}
				<title>Kullanım Şartları - Belge Hızlı</title>
				<meta name="description" content="Belge Hızlı platformunun kullanım koşulları ve hizmet sözleşmesi. Sitemizi kullanarak kabul ettiğin şartları incele." />
				<link rel="canonical" href="https://www.belgehizli.com/kullanim-sartlari" />
			</Helmet> {/* <-- YENİ: Helmet bileşeni bitti */}
			{/* --- Meta Etiketleri Sonu --- */}

			<div className={styles.container}>
				{/* Ana başlık H1 olarak güncellendi */}
				<h1 className={styles.title}>Kullanım Şartları ve Mesafeli Satış Sözleşmesi</h1> {/* <-- GÜNCELLENDİ: H2 yerine H1 */}
				<p className={styles.lastUpdated}><strong>Son Güncelleme:</strong> {lastUpdateDate}</p>

				<p className={styles.importantNote}>
					Sitemiz şu anda beta aşamasındadır ve tüm şablonlar geçici olarak ücretsiz sunulmaktadır. Ödeme entegrasyonumuz henüz aktif değildir. Aşağıdaki şartlar ve sözleşme hükümleri, <strong>gelecekte aktif olacak ücretli hizmetlerimiz</strong> ve ödeme süreçlerimiz için geçerlidir. Şu anda indirdiğin tüm şablonlar ücretsizdir.
				</p>

				<p className={styles.paragraph}>
					Lütfen <strong>{siteUrl}</strong> ("Site") adresinde sunulan hizmetleri kullanmadan önce bu Kullanım Şartları'nı ("Sözleşme") dikkatlice oku.
					Site'ye erişerek veya hizmetleri kullanarak, bu Sözleşme'yi okuduğunu, anladığını ve hükümlerine bağlı kalmayı kabul ettiğini beyan etmiş olursun.
				</p>

				{/* Bölüm 1 Başlığı - H2 olarak güncellendi */}
				<h2 className={styles.mainSectionTitle}>BÖLÜM 1: KULLANIM ŞARTLARI</h2> {/* <-- GÜNCELLENDİ: H3 yerine H2 */}

				{/* Madde Başlığı - H3 olarak güncellendi */}
				<h3 className={styles.articleTitle}>MADDE 1: TARAFLAR VE TANIMLAR</h3> {/* <-- GÜNCELLENDİ: H4 yerine H3 */}
				<p className={styles.paragraph}>
					İşbu Sözleşme, bir tarafta merkezi {address} adresinde bulunan <strong>{ownerName}</strong> (bundan sonra "{siteName}" veya "Hizmet Sağlayıcı" olarak anılacak) ile diğer tarafta Site'yi kullanan veya Site üzerinden hizmet satın alan gerçek veya tüzel kişi ("Kullanıcı" veya "Müşteri") arasında akdedilmiştir.
				</p>
				<ul className={styles.definitionList}>
					<li><strong>Site:</strong> {siteUrl} adresindeki web sitesi.</li>
					<li><strong>Kullanıcı/Müşteri:</strong> Site'yi ziyaret eden, üye olan, formları dolduran veya hizmet satın alan kişi.</li>
					<li><strong>Hizmet:</strong> Site üzerinden sunulan, kullanıcıların belirli şablonlar (örn: Konut Kira Sözleşmesi) için gerekli bilgileri form alanlarına girerek kişiselleştirilmiş PDF formatında belge oluşturmasını ve indirmesini sağlayan dijital içerik üretme hizmeti.</li>
					<li><strong>Şablon:</strong> Site'de sunulan, belirli bir amaca yönelik önceden hazırlanmış belge taslağı.</li>
					<li><strong>PDF Belge:</strong> Kullanıcının form alanlarına girdiği bilgilerle Şablon'un kişiselleştirilmesi sonucu oluşturulan ve indirilebilen dijital dosya.</li>
				</ul>

				{/* Madde Başlığı - H3 olarak güncellendi */}
				<h3 className={styles.articleTitle}>MADDE 2: SUNULAN HİZMET</h3> {/* <-- GÜNCELLENDİ: H4 yerine H3 */}
				<p className={styles.paragraph}>
					{/* BURAYI YENİDEN İFADE ET: Ödeme sonrası indirme GELECEKTEKİ ücretli hizmet için */}
					{/*
					HATIRLATMA: Ödeme entegrasyonu tamamlandığında ve ücretli hizmet başladığında bu maddeyi güncelle.
					Bu kısımdaki metin şu anda GELECEKTEKİ ücretli hizmeti tarif etmektedir.
					*/}
					2.1. {siteName}, kullanıcıların seçtikleri şablonlar üzerindeki form alanlarını doldurarak kendi ihtiyaçlarına göre uyarlanmış PDF formatında belgeler oluşturmalarına ve gelecekteki ücretli hizmetimiz kapsamında ödeme sonrası bu belgeleri indirmelerine olanak tanıyan bir platformdur. Şu an indirme ücretsizdir.
				</p>
				{/* Önemli Not Stili */}
				<p className={styles.importantNote}>
					2.2. <strong>{siteName} bir hukuk bürosu veya avukatlık hizmeti değildir. Site'de sunulan şablonlar ve oluşturulan PDF Belgeler hukuki tavsiye niteliği taşımaz.</strong> Kullanıcılar, oluşturdukları belgelerin kendi özel durumlarına uygunluğunu ve yasal geçerliliğini teyit etmekten ve gerekirse bir hukuk uzmanına danışmaktan kendileri sorumludur. {siteName}, şablonların veya oluşturulan PDF Belgelerin kullanımından doğabilecek herhangi bir hukuki sonuçtan sorumlu tutulamaz.
				</p>
				<p className={styles.paragraph}>
					2.3. {siteName}, hizmetlerin kapsamını, şablonları veya Site'nin işleyişini önceden haber vermeksizin değiştirme, askıya alma veya durdurma hakkını saklı tutar.
				</p>

				{/* Madde Başlığı - H3 olarak güncellendi */}
				<h3 className={styles.articleTitle}>MADDE 3: ÜYELİK VE KULLANICI HESABI</h3> {/* <-- GÜNCELLENDİ: H4 yerine H3 */}
				<p className={styles.paragraph}>
					3.1. Bazı hizmetlerden yararlanmak veya oluşturulan belgelere daha sonra erişmek için üyelik gerekebilir. Kullanıcı, üyelik sırasında talep edilen bilgileri doğru, eksiksiz ve güncel olarak sağlamakla yükümlüdür.
				</p>
				<p className={styles.paragraph}>
					3.2. Kullanıcı, hesap bilgilerinin (e-posta, şifre vb.) gizliliğinden ve güvenliğinden sorumludur. Hesap üzerinden yapılan tüm işlemlerden Kullanıcı sorumludur. Yetkisiz kullanımı fark ettiğinde derhal {siteName}'e bildirmeli.
				</p>
				<p className={styles.paragraph}>
					3.3. {siteName}, herhangi bir gerekçe göstermeksizin üyelik talebini reddetme veya mevcut bir üyeliği iptal etme hakkını saklı tutar.
				</p>

				{/* Madde Başlığı - H3 olarak güncellendi */}
				<h3 className={styles.articleTitle}>MADDE 4: KULLANICI YÜKÜMLÜLÜKLERİ</h3> {/* <-- GÜNCELLENDİ: H4 yerine H3 */}
				<p className={styles.paragraph}>
					4.1. Kullanıcı, Site'yi ve Hizmetleri yalnızca yasal amaçlarla kullanacağını kabul eder.
				</p>
				<p className={styles.paragraph}>
					4.2. Kullanıcı, form alanlarına girdiği bilgilerin doğruluğundan ve eksiksizliğinden kendisi sorumludur. Oluşturulan PDF Belge, Kullanıcının girdiği verilere dayanmaktadır.
				</p>
				<p className={styles.paragraph}>
					4.3. Kullanıcı, Site'nin işleyişine müdahale etmeyecek, virüs veya zararlı kod bulaştırmayacak, aşırı yükleme yapmayacak.
				</p>
				<p className={styles.paragraph}>
					{/* BURAYI YENİDEN İFADE ET: Satın alma tanımı GELECEKTEKİ ücretli hizmet için */}
					4.4. Kullanıcı, Site'deki şablonları veya içerikleri {siteName}'in yazılı izni olmaksızın kopyalamayacak, çoğaltmayacak, dağıtmayacak veya türev eserler oluşturmayacak. Gelecekteki ücretli hizmetimiz kapsamında satın alınan PDF Belge, Kullanıcının kişisel veya belirtilen amaçlar doğrultusunda kullanımı içindir. Şu an indirme ücretsizdir.
				</p>

				{/* Madde Başlığı - H3 olarak güncellendi */}
				<h3 className={styles.articleTitle}>MADDE 5: FİKRİ MÜLKİYET HAKLARI</h3> {/* <-- GÜNCELLENDİ: H4 yerine H3 */}
				<p className={styles.paragraph}>
					5.1. Site'nin tasarımı, içeriği, yazılımları, şablonları ve markası dahil ancak bunlarla sınırlı olmamak üzere tüm fikri mülkiyet hakları {siteName}'e aittir. Kullanıcıya yalnızca Hizmetlerden yararlanmak amacıyla sınırlı, münhasır olmayan, devredilemez bir kullanım lisansı verilmektedir.
				</p>
				<p className={styles.paragraph}>
					5.2. Kullanıcı tarafından formlara girilen ve PDF Belge'yi oluşturan kişisel verilerin mülkiyeti Kullanıcı'ya aittir. Ancak Kullanıcı, bu verilerin Hizmet'in sunulması amacıyla {siteName} tarafından işlenmesine ve saklanmasına izin verir.
				</p>

				{/* Madde Başlığı - H3 olarak güncellendi */}
				<h3 className={styles.articleTitle}>MADDE 6: ÜCRETLENDİRME VE ÖDEME</h3> {/* <-- GÜNCELLENDİ: H4 yerine H3 */}
				<p className={styles.paragraph}>
					{/*
					HATIRLATMA: Ödeme entegrasyonu tamamlandığında ve ücretli hizmet başladığında bu maddeyi (6.1, 6.2, 6.3, 6.4) gerçek fiyat, ödeme yöntemleri ve süreçleri yansıtacak şekilde güncelle.
					Bu maddedeki metin şu anda GELECEKTEKİ ücretli hizmeti tarif etmektedir.
					*/}
					6.1. Gelecekteki ücretli hizmetimiz kapsamında Belirli şablonlardan PDF Belge oluşturma ve indirme hizmeti ücrete tabi olacaktır. Ücretler, ilgili şablonun sayfasında ve ödeme adımında açıkça belirtilecektir. Fiyatlara KDV dahildir.
				</p>
				<p className={styles.paragraph}>
					6.2. Gelecekteki ücretli hizmetimiz kapsamında ödemeler, Site üzerinde belirtilen güvenli ödeme yöntemleriyle (Kredi Kart, Banka Kartı vb.) yapılacaktır. Kullanıcı, ödeme için verdiği bilgilerin doğru olduğunu kabul edecektir.
				</p>
				<p className={styles.paragraph}>
					6.3. Gelecekteki ücretli hizmetimiz kapsamında başarılı ödeme sonrası, oluşturulan PDF Belge indirmeye hazır hale gelecek ve/veya Kullanıcının belirttiği e-posta adresine gönderilebilecektir.
				</p>
				<p className={styles.paragraph}>
					6.4. Gelecekteki ücretli hizmetimiz kapsamında Kullanıcı adına yasalara uygun şekilde e-arşiv fatura düzenlenecek ve Kullanıcının belirttiği e-posta adresine gönderilecektir.
				</p>

				{/* Madde Başlığı - H3 olarak güncellendi */}
				<h3 className={styles.articleTitle}>MADDE 7: SORUMLULUĞUN SINIRLANDIRILMASI</h3> {/* <-- GÜNCELLENDİ: H4 yerine H3 */}
				<p className={styles.paragraph}>
					7.1. {siteName}, Site'nin ve Hizmetlerin kesintisiz, hatasız veya güvenli olacağını taahhüt etmez. Teknik aksaklıklar, bakım çalışmaları veya mücbir sebepler nedeniyle hizmetlerde kesinti yaşanabilir.
				</p>
				<p className={styles.paragraph}>
					7.2. {siteName}, Kullanıcının formlara girdiği verilerin doğruluğunu kontrol etmez ve bu verilerden kaynaklanan hatalı veya eksik PDF Belgelerden sorumlu değildir.
				</p>
				<p className={styles.paragraph}>
					7.3. Hizmetin hukuki tavsiye niteliğinde olmadığı açıkça belirtilmiştir. {siteName}, oluşturulan PDF Belgelerin kullanımından veya hukuki sonuçlarından doğacak doğrudan veya dolaylı hiçbir zarardan (kar kaybı, itibar kaybı vb. dahil) sorumlu tutulamaz.
				</p>
				<p className={styles.paragraph}>
					{/* BURAYI YENİDEN İFADE ET: Sorumluluğun sınırlandırılması ücretli işlemle ilgili olabilir. */}
					{/*
					HATIRLATMA: Ödeme entegrasyonu tamamlandığında ve ücretli hizmet başladığında bu maddeyi (7.4) gözden geçir.
					Bu madde şu anda GELECEKTEKİ ücretli hizmeti tarif etmektedir.
					*/}
					7.4. {siteName}'in işbu Sözleşme kapsamındaki toplam sorumluluğu, her halükarda gelecekteki ilgili zarara neden olan hizmet için Kullanıcı tarafından ödenen tutar ile sınırlı olacaktır. Şu an hizmet ücretsiz olduğu için sorumluluk sınırlaması farklı değerlendirilebilir.
				</p>

				{/* Madde Başlığı - H3 olarak güncellendi */}
				<h3 className={styles.articleTitle}>MADDE 8: GİZLİLİK</h3> {/* <-- GÜNCELLENDİ: H4 yerine H3 */}
				<p className={styles.paragraph}>
					Kullanıcıların kişisel verilerinin işlenmesi ve korunmasına ilişkin esaslar, Site'de yer alan Gizlilik Politikası ve Aydınlatma Metni'nde düzenlenmiştir. Kullanıcı, Site'yi kullanarak bu politikayı kabul etmiş sayılır.
				</p>

				{/* Madde Başlığı - H3 olarak güncellendi */}
				<h3 className={styles.articleTitle}>MADDE 9: SÖZLEŞMENİN FESHİ</h3> {/* <-- GÜNCELLENDİ: H4 yerine H3 */}
				<p className={styles.paragraph}>
					Kullanıcı, dilediği zaman hesabını silerek veya Site'yi kullanmayı bırakarak bu Sözleşmeyi fiilen sona erdirebilir. {siteName}, Kullanıcının işbu Sözleşme hükümlerini ihlal etmesi halinde üyeliği veya hizmete erişimi derhal sona erdirebilir.
				</p>

				{/* Madde Başlığı - H3 olarak güncellendi */}
				<h3 className={styles.articleTitle}>MADDE 10: UYGULANACAK HUKUK VE YETKİLİ MAHKEME</h3> {/* <-- GÜNCELLENDİ: H4 yerine H3 */}
				<p className={styles.paragraph}>
					İşbu Sözleşme'den doğacak ihtilaflarda Türk Hukuku uygulanacaktır. Tüketici sıfatına haiz Kullanıcılar için, uyuşmazlıkların çözümünde 6502 Sayılı Kanun ve ilgili yönetmelikler uyarınca Kullanıcının yerleşim yerindeki veya hizmeti satın aldığı yerdeki Tüketici Sorunları Hakem Heyetleri veya Tüketici Mahkemeleri yetkilidir. Tacir veya diğer Kullanıcılar için İstanbul (Çağlayan) Mahkemeleri ve İcra Daireleri yetkilidir.
				</p>

				{/* Ayırıcı Çizgi */}
				<hr className={styles.separator} />

				{/* Bölüm 2 Başlığı - H2 olarak güncellendi */}
				<h2 className={styles.mainSectionTitle}>BÖLÜM 2: MESAFELİ SATIŞ SÖZLEŞMESİ</h2> {/* <-- GÜNCELLENDİ: H3 yerine H2 */}
				{/*
				HATIRLATMA: Mesafeli Satış Sözleşmesi bölümü (BÖLÜM 2 ve altındaki tüm maddeler), yasal olarak SADECE ücretli bir satış işlemi yapıldığında geçerlidir ve gösterilmelidir.
				Hizmetin tamamen veya kısmen ücretli hale geldiğinde bu bölümün güncel ve aktif olduğundan emin ol. Şu an ücretsiz indirme olduğu için bu bölümün burada olması yanıltıcı olabilir.
				İdeal çözüm: Bu bölümü sadece ücretli işlem anında göstermek veya bu politikanın SADECE GELECEKTEKİ ücretli işlemleri tarif ettiğini çok net belirten bir ÜST AÇIKLAMA eklemek.
				Aşağıdaki maddeler de GELECEKTEKİ ücretli işlemi tarif edecek şekilde yeniden ifade edilmelidir.
				*/}
				<p className={styles.paragraph}>
					İşbu Mesafeli Satış Sözleşmesi ("Satış Sözleşmesi"), 6502 Sayılı Tüketicinin Korunması Hakkında Kanun ("Kanun") ve Mesafeli Sözleşmeler Yönetmeliği ("Yönetmelik") uygun olarak <strong>gelecekteki ücretli hizmetimiz kapsamında</strong> düzenlenmiştir.
				</p>

				{/* Madde Başlığı - H3 olarak güncellendi */}
				<h3 className={styles.articleTitle}>MADDE 1: TARAFLAR</h3> {/* <-- GÜNCELLENDİ: H4 yerine H3 */}
				<p className={styles.paragraph}><strong>SATICI:</strong></p>
				<ul className={styles.infoList}>
					<li>Unvan/Ad Soyad: {ownerName}</li> 
					<li>Adres: {address}</li>
					<li>Telefon: {phone}</li> 
					<li>E-posta: {email}</li>
				</ul>
				<p className={styles.paragraph}><strong>ALICI (MÜŞTERİ/TÜKETİCİ):</strong></p>
				<p className={styles.paragraph}>
					{/* BURAYI YENİDEN İFADE ET: ALICI tanımı GELECEKTEKİ satış ile ilgili */}
					Site üzerinden <strong>gelecekteki ücretli hizmet kapsamında</strong> hizmet satın alan, adı soyadı ve iletişim bilgileri sipariş sırasında alınan Kullanıcı.
					(Bilgiler <strong>gelecekteki</strong> sipariş formunda ve faturada yer alacaktır.)
				</p>

				{/* Madde Başlığı - H3 olarak güncellendi */}
				<h3 className={styles.articleTitle}>MADDE 2: SÖZLEŞMENİN KONUSU</h3> {/* <-- GÜNCELLENDİ: H4 yerine H3 */}
				<p className={styles.paragraph}>
					{/* BURAYI YENİDEN İFADE ET: Sözleşmenin konusu GELECEKTEKİ satış ile ilgili */}
					İşbu Satış Sözleşmesi'nin konusu, Alıcı'nın Satıcı'ya ait {siteUrl} internet sitesinden <strong>gelecekteki ücretli hizmet kapsamında</strong> elektronik ortamda siparişini yaptığı, nitelikleri ve satış fiyatı Site'de belirtilen Hizmet'in (belirli bir şablona dayalı PDF Belge oluşturma ve indirme) satışı ve teslimi ile ilgili olarak Kanun ve Yönetmelik hükümleri gereğince tarafların hak ve yükümlülüklerinin belirlenmesidir.
				</p>

				{/* Madde Başlığı - H3 olarak güncellendi */}
				<h3 className={styles.articleTitle}>MADDE 3: SÖZLEŞME KONUSU HİZMETİN NİTELİKLERİ VE FİYATI</h3> {/* <-- GÜNCELLENDİ: H4 yerine H3 */}
				<p className={styles.paragraph}>
					{/* BURAYI YENİDEN İFADE ET: Nitelikler ve fiyat GELECEKTEKİ satış ile ilgili */}
					Hizmetin türü, adı, temel nitelikleri, KDV dahil satış fiyatı ve ödeme şekli, <strong>gelecekteki ücretli hizmetimiz kapsamında</strong> ilgili şablonun tanıtım sayfasında ve ödeme onay sayfasında belirtilecektir. Bu bilgiler <strong>gelecekteki</strong> Alıcı tarafından onaylanacaktır.
				</p>

				{/* Madde Başlığı - H3 olarak güncellendi */}
				<h3 className={styles.articleTitle}>MADDE 4: HİZMETİN TESLİMİ (İFA ŞEKLİ)</h3> {/* <-- GÜNCELLENDİ: H4 yerine H3 */}
				<p className={styles.paragraph}>
					4.1. Hizmet, dijital içerik (PDF Belge) olarak sunulmaktadır.
				</p>
				<p className={styles.paragraph}>
					{/* BURAYI YENİDEN İFADE ET: Sözleşmenin yürürlüğe girmesi GELECEKTEKİ ödeme ile ilgili */}
					4.2. İşbu Satış Sözleşmesi, <strong>gelecekteki ücretli hizmetimiz kapsamında</strong> Alıcı tarafından elektronik ortamda onaylanıp ödemenin başarıyla tamamlanmasını takiben yürürlüğe girecektir.
				</p>
				<p className={styles.paragraph}>
					{/* BURAYI YENİDEN İFADE ET: Teslimat anı GELECEKTEKİ ödeme sonrası ile ilgili */}
					4.3. <strong>Gelecekteki ücretli hizmetimiz kapsamında</strong> ödeme sonrası, Alıcı'nın formlara girdiği bilgilerle oluşturulan kişiselleştirilmiş PDF Belge, Alıcı tarafından Site üzerinden indirilebilir hale gelecek ve/veya Alıcı'nın belirttiği e-posta adresine gönderilecektir. Teslimat anı <strong>gelecekteki</strong>  ödeme sonrası (indirme veya e-posta ile gönderim) gerçekleşecektir.
				</p>
				<p className={styles.paragraph}>
					4.4. Teknik sorunlar nedeniyle belgenin indirilmemesi veya alınamaması durumunda Alıcı, {email} adresi üzerinden Satıcı ile iletişime geçmelidir. Satıcı, sorunun giderilmesi ve belgenin teslimi için makul çabayı gösterecektir.
				</p>

				{/* Madde Başlığı - H3 olarak güncellendi */}
				<h3 className={styles.articleTitle}>MADDE 5: CAYMA HAKKI</h3> {/* <-- GÜNCELLENDİ: H4 yerine H3 */}
				<p className={styles.paragraph}>
					Alıcı'nın sipariş ettiği Hizmet, Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesinin birinci fıkrasının (ğ) bendi uyarınca <strong>"Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayrimaddi mallara ilişkin sözleşmeler"</strong> kapsamındadır.
				</p>
				{/* Cayma Hakkı Uyarısı - GELECEKTEKİ ödeme ile ilgili yeniden ifade edildi */}
				<p className={styles.warningNote}>
					{/*
					HATIRLATMA: Mesafeli Satış Sözleşmesi aktif olduğunda (yani ücretli hizmet başladığında) bu maddeyi gözden geçir.
					Bu maddedeki metin şu anda SADECE GELECEKTEKİ ücretli hizmeti tarif etmektedir.
					*/}
					Bu nedenle, <strong>gelecekteki ücretli hizmetimiz kapsamında</strong> Alıcı'nın ödeme yaparak hizmeti satın alması ve PDF Belge'nin indirilmeye/gönderilmeye hazır hale gelmesiyle hizmet anında ifa edilmiş sayılacağından, Alıcı'nın (tüketici olsa dahi) <strong>yasal olarak cayma hakkı bulunmayacaktır ve ücret iadesi yapılamayacaktır.</strong> Alıcı, <strong>gelecekteki</strong> sipariş vermeden önce bu durumu bildiğini ve kabul ettiğini beyan edecektir.
				</p>

				{/* Madde Başlığı - H3 olarak güncellendi */}
				<h3 className={styles.articleTitle}>MADDE 6: UYUŞMAZLIKLARIN ÇÖZÜMÜ</h3> {/* <-- GÜNCELLENDİ: H4 yerine H3 */}
				<p className={styles.paragraph}>
					İşbu Satış Sözleşmesi'nden doğabilecek ihtilaflarda Türk Hukuku uygulanacaktır. Tüketici sıfatına haiz Kullanıcılar için, uyuşmazlıkların çözümünde 6502 Sayılı Kanun ve ilgili yönetmelikler uyarınca Kullanıcının yerleşim yerinin bulunduğu veya hizmeti satın aldığı yerdeki Tüketici Sorunları Hakem Heyetleri, bu değerin üzerindeki ihtilaflarda ise Tüketici Mahkemeleri yetkilidir. Tacir veya diğer Kullanıcılar için İstanbul (Çağlayan) Mahkemeleri ve İcra Daireleri yetkilidir.
				</p>

				{/* Madde Başlığı - H3 olarak güncellendi */}
				<h3 className={styles.articleTitle}>MADDE 7: BİLDİRİMLER VE DELİL SÖZLEŞMESİ</h3> {/* <-- GÜNCELLENDİ: H4 yerine H3 */}
				<p className={styles.paragraph}>
					Taraflar arasındaki bildirimler, Alıcı'nın belirttiği e-posta adresi ve Satıcı'nın {email} e-posta adresi üzerinden yapılacaktır. Alıcı, işbu Sözleşme'den doğabilecek ihtilaflarda Satıcı'nın resmi defter ve ticari kayıtlarıyla, kendi veritabanında, sunucularında tuttuğu elektronik bilgilerin ve bilgisayar kayıtlarının, bağlayıcı, kesin ve münhasır delil teşkil edeceğini, bu maddenin Hukuk Muhakemeleri Kanunu'nun 193. maddesi anlamında delil sözleşmesi niteliğinde olduğunu kabul eder.
				</p>

				{/* Madde Başlığı - H3 olarak güncellendi */}
				<h3 className={styles.articleTitle}>MADDE 8: YÜRÜRLÜK</h3> {/* <-- GÜNCELLENDİ: H4 yerine H3 */}
				<p className={styles.paragraph}>
					{/* BURAYI YENİDEN İFADE ET: Yürürlük GELECEKTEKİ sipariş/ödeme ile ilgili */}
					İşbu Satış Sözleşmesi, Alıcı tarafından <strong>gelecekteki ücretli hizmet kapsamında</strong> elektronik ortamda onaylandığı tarihte yürürlüğe girecektir.
				</p>

			</div>
		</>
	);
}

export default TermsOfService;
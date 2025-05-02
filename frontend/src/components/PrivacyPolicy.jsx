import React from 'react';
import styles from './PrivacyPolicy.module.css'; // Stil dosyasını import et
import { Helmet } from 'react-helmet-async'; // <-- YENİ: Helmet import edildi

function PrivacyPolicy() {
	// Şahıs firması için gerekli temel bilgiler (KVKK Aydınlatma Metni için)
	const siteName = "Belge Hızlı"; 
	const ownerName = "Abdurrahman Görkem Ünal"; 
	const address = "Gülbahar Mah. Kurtuluş 1 Sk. No: 15 İç Kapı No:10 Şişli / İSTANBUL"; 
	const email = "info@belgehizli.com"; 
	const lastUpdateDate = "02.05.2025"; 
	const siteUrl = "https://www.belgehizli.com/"; 

	return (
		<>
			{/* --- Helmet ile Sayfa Başlığı ve Meta Etiketleri --- */}
			{/* Daha önceki doğrudan <title>, <meta>, <link> etiketleri Helmet içine taşındı */}
			<Helmet> {/* <-- YENİ: Helmet bileşeni başladı */}
				<title>Gizlilik Politikası - Belge Hızlı</title>
				<meta name="description" content="Belge Hızlı web sitesinin gizlilik politikası. Kişisel verilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu öğrenin (KVKK ve GDPR uyumlu)." />
				<link rel="canonical" href="https://www.belgehizli.com/gizlilik-politikasi" />
			</Helmet> {/* <-- YENİ: Helmet bileşeni bitti */}
			{/* --- Meta Etiketleri Sonu --- */}

			<div className={styles.container}>
				{/* Ana başlık H1 olarak güncellendi */}
				<h1 className={styles.title}>Gizlilik Politikası ve Aydınlatma Metni</h1> {/* <-- GÜNCELLENDİ: H2 yerine H1 */}
				<p className={styles.lastUpdated}><strong>Son Güncelleme:</strong> {lastUpdateDate}</p>

				<p className={styles.importantNote}>
					Sitemiz şu anda beta aşamasındadır ve tüm şablonlar geçici olarak ücretsiz sunulmaktadır. Ödeme entegrasyonumuz henüz aktif değildir. Aşağıdaki politikalar, gelecekte aktif olacak ücretli hizmetlerimiz ve ödeme süreçlerimiz için geçerlidir. Şu anda indirdiğiniz tüm şablonlar ücretsizdir.
				</p>

				<p className={styles.paragraph}>
					<strong> {siteName}</strong> olarak (bundan sonra "{siteName}" veya "Biz" olarak anılacaktır),
					<strong> {siteUrl} </strong> internet sitemizi ("Site") ziyaret eden ve kullanan siz değerli
					kullanıcılarımızın/üyelerimizin kişisel verilerinin gizliliğine ve güvenliğine büyük önem veriyoruz.
					Bu kapsamda, 6698 sayılı Kişisel Verilerin Korunması Hakkında Kanun ("KVKK") ve ilgili diğer yasal mevzuat
					uyarınca kişisel verilerinizin işlenmesi ve korunması hakkında sizleri bilgilendirmek amacıyla bu
					Gizlilik Politikası ve Aydınlatma Metni'ni hazırladık.
				</p>

				{/* Alt başlık H2 olarak güncellendi */}
				<h2 className={styles.sectionTitle}>1. Veri Sorumlusunun Kimliği</h2> {/* <-- GÜNCELLENDİ: H3 yerine H2 */}
				<ul className={styles.infoList}>
					<li><strong>Veri Sorumlusu:</strong> {ownerName}</li> {/* Şahıs firması sahibi olarak */}
					<li><strong>Adres:</strong> {address}</li>
					<li><strong>E-posta:</strong> {email}</li>
					{/* KEP Adresi ve Ticaret Ünvanı gibi bilgiler şahıs firması için zorunlu değil, kaldırıldı. */}
				</ul>

				{/* Alt başlık H2 olarak güncellendi */}
				<h2 className={styles.sectionTitle}>2. İşlenen Kişisel Veriler ve Amaçları</h2> {/* <-- GÜNCELLENDİ: H3 yerine H2 */}
				<p className={styles.paragraph}>
					Sitemizi ziyaret etmeniz, üye olmanız, hizmetlerimizden faydalanmanız (şablonları doldurmanız,
					{/* YENİDEN İFADE EDİLDİ: Ödeme ve satın alma kısımları gelecekteki hizmet için */}
					gelecekteki ücretli hizmetimiz kapsamında ödeme yapmanız ve PDF indirmeniz) durumunda aşağıdaki kişisel verileriniz işlenebilmektedir:
				</p>
				<ul className={styles.dataList}>
					<li><strong>Kimlik Bilgileri:</strong> Adınız, soyadınız (üyelik veya fatura için).</li>
					<li><strong>İletişim Bilgileri:</strong> E-posta adresiniz, telefon numaranız (gerekirse), adresiniz (fatura için).</li>
					<li><strong>Fatura Bilgileri:</strong> Adınız, soyadınız, TC Kimlik Numaranız (gerçek kişi ise) veya Vergi Kimlik Numaranız ve Vergi Daireniz (tüzel kişi veya şahıs şirketi ise), adresiniz</li>
					<li>
						{/* YENİDEN İFADE EDİLDİ: Kullanıcı İşlem Bilgileri ödeme/satın alma kısımları gelecekteki hizmet için */}
						<strong>Kullanıcı İşlem Bilgileri:</strong> Üyelik bilgileriniz, doldurduğunuz formlara girdiğiniz veriler (sözleşme oluşturma amacıyla),
						gelecekteki ücretli hizmetimiz kapsamında satın aldığınız şablonlar, sipariş detayları, ödeme bilgileriniz
						(doğrudan tarafımızca saklanmaz, gelecekteki ücretli hizmetimiz kapsamında güvenli ödeme hizmeti sağlayıcısı
						(örneğin, ileride entegre edilecek ParamPOS gibi) aracılığıyla işlenir), indirdiğiniz belgeler.
					</li>
					<li><strong>e-Fatura/e-Arşiv Fatura Hizmeti Sağlayıcıları:</strong> Yasal faturaların oluşturulması ve saklanması amacıyla anlaşmalı özel entegratör firmalara</li>
					<li><strong>İşlem Güvenliği Bilgileri:</strong> IP adresiniz, log kayıtları, parola ve şifre bilgileri (güvenli şekilde saklanır), çerezler aracılığıyla toplanan bilgiler.</li>
					<li><strong>Pazarlama Bilgileri (Açık rızanız ile):</strong> Çerez kayıtları, hedefleme bilgileri, alışkanlık ve beğenileri gösteren değerlendirmeler.</li>
				</ul>
				<p className={styles.paragraph}>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
				<ul className={styles.purposeList}>
					<li>Hizmetlerimizin sunulması (belge şablonlarının doldurulması, PDF oluşturulması ve teslimi).</li>
					<li>Üyelik işlemlerinin gerçekleştirilmesi ve yönetilmesi.</li>
					{/* YENİDEN İFADE EDİLDİ: Sipariş ve ödeme süreçleri gelecekteki hizmet için */}
					<li>Gelecekteki ücretli hizmetimiz kapsamında sipariş ve ödeme süreçlerinin yürütülmesi (Ödeme sağlayıcıları aracılığıyla).</li> {/* <-- YENİDEN İFADE EDİLDİ */}
					<li>Sözleşmesel yükümlülüklerin yerine getirilmesi (Mesafeli Satış Sözleşmesi vb.).</li>
					<li>Müşteri hizmetleri ve destek taleplerinin karşılanması.</li>
					<li>Yasal yükümlülüklerin yerine getirilmesi (fatura düzenleme, yasal bildirimler vb.).</li>
					<li>Site'nin geliştirilmesi, kullanıcı deneyiminin iyileştirilmesi ve analizler yapılması.</li>
					<li>İletişim faaliyetlerinin yürütülmesi.</li>
					<li>Sahteciliğin önlenmesi ve site güvenliğinin sağlanması.</li>
					<li>Açık rızanız olması halinde, kampanya, promosyon ve tanıtım faaliyetleri hakkında bilgilendirme yapılması.</li>
				</ul>

				{/* Alt başlık H2 olarak güncellendi */}
				<h2 className={styles.sectionTitle}>3. Kişisel Veri İşlemenin Hukuki Sebepleri</h2> {/* <-- GÜNCELLENDİ: H3 yerine H2 */}
				<p className={styles.paragraph}>Kişisel verileriniz, KVKK'nın 5. maddesinde belirtilen aşağıdaki hukuki sebeplere dayanılarak işlenmektedir:</p>
				<ul className={styles.purposeList}>
					<li>Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması (KVKK m.5/2-c).</li>
					<li>Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması (KVKK m.5/2-ç).</li>
					<li>Bir hakkın tesisi, kullanılması veya korunması için veri işlemenin zorunlu olması (KVKK m.5/2-e).</li>
					<li>İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla, veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması (KVKK m.5/2-f).</li>
					<li>Açık rızanızın bulunması (KVKK m.5/1) (Örn: Pazarlama iletişimleri için).</li>
				</ul>

				{/* Alt başlık H2 olarak güncellendi */}
				<h2 className={styles.sectionTitle}>4. Kişisel Verilerin Aktarımı</h2> {/* <-- GÜNCELLENDİ: H3 yerine H2 */}
				<p className={styles.paragraph}>
					Kişisel verileriniz, yukarıda belirtilen amaçlar doğrultusunda ve KVKK'nın 8. ve 9. maddelerine uygun olarak,
					gerekli güvenlik önlemleri alınarak aşağıdaki taraflara aktarılabilecektir:
				</p>
				<ul className={styles.purposeList}>
					{/* YENİDEN İFADE EDİLDİ: Ödeme Hizmeti Sağlayıcıları gelecekteki hizmet için */}
					<li>
						<strong>Ödeme Hizmeti Sağlayıcıları:</strong> Gelecekteki ücretli hizmetimiz kapsamında ödeme işlemlerinin güvenli bir şekilde gerçekleştirilmesi amacıyla lisanslı ödeme kuruluşlarına.
					</li> {/* <-- YENİDEN İFADE EDİLDİ */}
					<li><strong>İş Ortakları ve Tedarikçiler:</strong> Hizmetlerin sunulması için destek alınan taraflar (örn: sunucu/hosting hizmeti, e-posta gönderim hizmeti, analitik hizmetleri).</li>
					<li><strong>Yetkili Kamu Kurum ve Kuruluşları:</strong> Yasal talepler doğrultusunda ve mevzuat gereği bilgi verilmesi gereken merciler (mahkemeler, savcılıklar vb.).</li>
					<li><strong>Hukuk ve Danışmanlık Büroları:</strong> Hukuki süreçlerin takibi veya danışmanlık alınması amacıyla sır saklama yükümlülüğü çerçevesinde.</li>
				</ul>

				{/* Alt başlık H2 olarak güncellendi */}
				<h2 className={styles.sectionTitle}>5. Kişisel Verilerin Toplanma Yöntemleri</h2> {/* <-- GÜNCELLENDİ: H3 yerine H2 */}
				<p className={styles.paragraph}>
					Kişisel verileriniz, Site üzerindeki formları doldurmanız, üye olmanız, hizmetlerimizi kullanmanız,
					bizimle iletişime geçmeniz ve çerezler gibi otomatik veya kısmen otomatik yöntemlerle toplanmaktadır.
				</p>

				{/* Alt başlık H2 olarak güncellendi */}
				<h2 className={styles.sectionTitle}>6. Çerezler (Cookies)</h2> {/* <-- GÜNCELLENDİ: H3 yerine H2 */}
				<p className={styles.paragraph}>
					Sitemizde kullanıcı deneyimini geliştirmek, sitenin verimli çalışmasını sağlamak ve tercihlerinizi
					hatırlamak gibi amaçlarla çerezler kullanmaktayız. Kullandığımız çerez türleri şunlardır:
				</p>
				<ul className={styles.dataList}>
					<li><strong>Zorunlu Çerezler:</strong> Sitenin temel fonksiyonlarının çalışması için gereklidir (örn: oturum açma).</li>
					<li><strong>Performans ve Analitik Çerezler:</strong> Site kullanımını analiz ederek performansı artırmamıza yardımcı olur (örn: Google Analytics).</li>
					<li><strong>İşlevsellik Çerezleri:</strong> Dil seçimi gibi tercihlerinizi hatırlar.</li>
					{/*
            HATIRLATMA: Hedefleme/Reklam çerezleri ile gerçek anlamda bir reklam veya retargeting kampanyası başlattığında (özellikle kullanıcı davranışları veya GELECEKTEKİ satın alma verilerine dayanarak) bu tanımı ve amacını daha detaylı açıkla.
            Ödeme entegrasyonu ve pazarlama faaliyetleri başladığında bu bölümü güncelle.
            */}
					<li>
						<strong>Hedefleme/Reklam Çerezleri (Açık rızanız ile):</strong> Web sitemizdeki gezinti geçmişiniz, ilgi alanlarınız ve davranışlarınız doğrultusunda size daha alakalı içerik ve reklamlar sunulabilmesi amacıyla kullanılabilir. Bu çerezler üçüncü taraf reklam ağları tarafından yerleştirilebilir.
					</li> {/* <-- YENİDEN İFADE EDİLDİ ve DETAYLANDIRILDI */}
				</ul>
				<p className={styles.paragraph}>
					Çerez tercihlerinizi tarayıcınızın ayarlarından yönetebilirsiniz. Ancak zorunlu çerezlerin engellenmesi
					sitenin bazı fonksiyonlarının çalışmamasına neden olabilir. Tarayıcı ayarları için aşağıdaki linkleri
					ziyaret edebilirsiniz:
				</p>
				<ul className={styles.linkList}>
					<li><a href="https://tools.google.com/dlpage/gaoptout?hl=tr" target="_blank" rel="noopener noreferrer">Google Analytics Kapsamı Dışında Kalma</a></li>
					<li><a href="https://support.google.com/chrome/answer/95647?hl=tr" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
					<li><a href="https://support.microsoft.com/tr-tr/windows/microsoft-edge-de-tan%C4%B1mlama-bilgilerini-y%C3%B6netme-g%C3%B6r%C3%BCnt%C3%BCleme-izin-verme-engelleme-silme-ve-kullanma-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
					<li><a href="https://support.mozilla.org/tr/kb/cerezler-web-sitelerinin-bilgisayarinizda-depoladi?redirectslug=Cookies&redirectlocale=en-US" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
					<li><a href="https://support.apple.com/kb/ph19214?locale=tr_TR" target="_blank" rel="noopener noreferrer">Safari</a></li>
					<li><a href="https://help.opera.com/en/latest/web-preferences/#cookies" target="_blank" rel="noopener noreferrer">Opera</a></li>
				</ul>

				{/* Alt başlık H2 olarak güncellendi */}
				<h2 className={styles.sectionTitle}>7. KVKK Kapsamındaki Haklarınız</h2> {/* <-- GÜNCELLENDİ: H3 yerine H2 */}
				<p className={styles.paragraph}>KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
				<ul className={styles.rightsList}>
					<li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
					<li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme,</li>
					<li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
					<li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,</li>
					<li>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,</li>
					<li>KVKK ve ilgili diğer kanun hükümlerine uygun olarak işlenmiş olmasına rağmen, işlenmesini gerektiren sebeplerin ortadan kalkması hâlinde kişisel verilerin silinmesini veya yok edilmesini isteme,</li>
					<li>(d) ve (e) bentleri uyarınca yapılan işlemlerin, kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
					<li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
					<li>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması hâlinde zararın giderilmesini talep etme.</li>
				</ul>
				<p className={styles.paragraph}>
					Bu haklarınızı kullanmak için taleplerinizi yazılı olarak veya kayıtlı elektronik posta (KEP) adresi,
					güvenli elektronik imza, mobil imza ya da tarafınızca bize daha önce bildirilen ve sistemimizde
					kayıtlı bulunan elektronik posta adresinizi kullanmak suretiyle <a href={`mailto:${email}`}>{email}</a> adresine {/* veya
                    {address} adresine posta yoluyla */} iletebilirsiniz. Başvurunuzda kimliğinizi tevsik edici belgelerin
					ve talep konusunun açıkça belirtilmesi gerekmektedir.
				</p>

				{/* Alt başlık H2 olarak güncellendi */}
				<h2 className={styles.sectionTitle}>8. Politika Değişiklikleri</h2> {/* <-- GÜNCELLENDİ: H3 yerine H2 */}
				<p className={styles.paragraph}>
					İşbu Gizlilik Politikası ve Aydınlatma Metni, değişen şartlara ve mevzuata uyum sağlamak amacıyla
					zaman zaman güncellenebilir. Güncellemeler Sitemizde yayınlandığı tarihte yürürlüğe girer.
				</p>

				{/*
				HATIRLATMA: Ödeme entegrasyonu tamamlandığında ve ücretli hizmet başladığında bu gizlilik politikasını,
				hangi verilerin (özellikle ödeme ve işlem verileri) tam olarak hangi ödeme sağlayıcılarıyla ve hangi amaçlarla
				(KVKK'nın ilgili maddelerine atıfla) paylaşıldığını detaylandırarak güncelle.
				*/}
			</div>
		</>
	);
}

export default PrivacyPolicy;
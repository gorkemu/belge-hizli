import React from 'react';
import styles from './PrivacyPolicy.module.css'; // Stil dosyasını import et

function PrivacyPolicy() {
  // Şahıs firması için gerekli temel bilgiler (KVKK Aydınlatma Metni için)
  // Lütfen kendi bilgilerinizle doldurun
  const siteName = "Belge Hızlı"; // Sitenizin Adı
  const ownerName = "Abdurrahman Görkem Ünal"; // veya direkt Adınız Soyadınız
  const address = "Gülbahar Mah. Kurtuluş 1 Sk. No: 15 İç Kapı No:10 Şişli / İSTANBUL"; // Resmi kayıtlardaki adresiniz
  const email = "info@belgehizli.com"; // E-posta adresiniz
  const lastUpdateDate = "22.04.2025"; // Son güncelleme tarihi
  const siteUrl = "https://www.belgehizli.com/"; // Sitenizin URL'si

  // Kaldırılan placeholder bilgisi: companyTitle

  return (
    <>
  <title>Gizlilik Politikası - Belge Hızlı</title>
  <meta name="description" content="Belge Hızlı web sitesinin gizlilik politikası. Kişisel verilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu öğrenin (KVKK ve GDPR uyumlu)." />
  <link rel="canonical" href="https://www.belgehizli.com/gizlilik-politikasi" />

    <div className={styles.container}>
      <h2 className={styles.title}>Gizlilik Politikası ve Aydınlatma Metni</h2>
      <p className={styles.lastUpdated}><strong>Son Güncelleme:</strong> {lastUpdateDate}</p>

      <p className={styles.paragraph}>
        <strong> Belge Hızlı</strong> olarak (bundan sonra "{siteName}" veya "Biz" olarak anılacaktır),
        <strong> {siteUrl} </strong> internet sitemizi ("Site") ziyaret eden ve kullanan siz değerli
        kullanıcılarımızın/üyelerimizin kişisel verilerinin gizliliğine ve güvenliğine büyük önem veriyoruz.
        Bu kapsamda, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") ve ilgili diğer yasal mevzuat
        uyarınca kişisel verilerinizin işlenmesi ve korunması hakkında sizleri bilgilendirmek amacıyla bu
        Gizlilik Politikası ve Aydınlatma Metni'ni hazırladık.
      </p>

      <h3 className={styles.sectionTitle}>1. Veri Sorumlusunun Kimliği</h3>
      <ul className={styles.infoList}>
        <li><strong>Veri Sorumlusu:</strong> {ownerName}</li> {/* Şahıs firması sahibi olarak */}
        <li><strong>Adres:</strong> {address}</li>
        <li><strong>E-posta:</strong> {email}</li>
        {/* KEP Adresi ve Ticaret Ünvanı gibi bilgiler şahıs firması için zorunlu değil, kaldırıldı. */}
      </ul>

      <h3 className={styles.sectionTitle}>2. İşlenen Kişisel Veriler ve Amaçları</h3>
      <p className={styles.paragraph}>
        Sitemizi ziyaret etmeniz, üye olmanız, hizmetlerimizden faydalanmanız (şablonları doldurmanız,
        ödeme yapmanız ve PDF indirmeniz) durumunda aşağıdaki kişisel verileriniz işlenebilmektedir:
      </p>
      <ul className={styles.dataList}>
        <li><strong>Kimlik Bilgileri:</strong> Adınız, soyadınız (üyelik veya fatura için).</li>
        <li><strong>İletişim Bilgileri:</strong> E-posta adresiniz, telefon numaranız (gerekirse), adresiniz (fatura için).</li>
        <li><strong>Kullanıcı İşlem Bilgileri:</strong> Üyelik bilgileriniz, doldurduğunuz formlara girdiğiniz veriler (sözleşme oluşturma amacıyla), satın aldığınız şablonlar, sipariş detayları, ödeme bilgileriniz (doğrudan tarafımızca saklanmaz, güvenli ödeme hizmeti sağlayıcısı aracılığıyla işlenir), indirdiğiniz belgeler.</li>
        <li><strong>İşlem Güvenliği Bilgileri:</strong> IP adresiniz, log kayıtları, parola ve şifre bilgileri (güvenli şekilde saklanır), çerezler aracılığıyla toplanan bilgiler.</li>
        <li><strong>Pazarlama Bilgileri (Açık rızanız ile):</strong> Çerez kayıtları, hedefleme bilgileri, alışkanlık ve beğenileri gösteren değerlendirmeler.</li>
      </ul>
      <p className={styles.paragraph}>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
      <ul className={styles.purposeList}>
        <li>Hizmetlerimizin sunulması (belge şablonlarının doldurulması, PDF oluşturulması ve teslimi).</li>
        <li>Üyelik işlemlerinin gerçekleştirilmesi ve yönetilmesi.</li>
        <li>Sipariş ve ödeme süreçlerinin yürütülmesi (iyzico gibi ödeme sağlayıcıları aracılığıyla).</li>
        <li>Sözleşmesel yükümlülüklerin yerine getirilmesi (Mesafeli Satış Sözleşmesi vb.).</li>
        <li>Müşteri hizmetleri ve destek taleplerinin karşılanması.</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi (fatura düzenleme, yasal bildirimler vb.).</li>
        <li>Site'nin geliştirilmesi, kullanıcı deneyiminin iyileştirilmesi ve analizler yapılması.</li>
        <li>İletişim faaliyetlerinin yürütülmesi.</li>
        <li>Sahteciliğin önlenmesi ve site güvenliğinin sağlanması.</li>
        <li>Açık rızanız olması halinde, kampanya, promosyon ve tanıtım faaliyetleri hakkında bilgilendirme yapılması.</li>
      </ul>

      <h3 className={styles.sectionTitle}>3. Kişisel Veri İşlemenin Hukuki Sebepleri</h3>
      <p className={styles.paragraph}>Kişisel verileriniz, KVKK'nın 5. maddesinde belirtilen aşağıdaki hukuki sebeplere dayanılarak işlenmektedir:</p>
      <ul className={styles.purposeList}>
        <li>Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması (KVKK m.5/2-c).</li>
        <li>Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması (KVKK m.5/2-ç).</li>
        <li>Bir hakkın tesisi, kullanılması veya korunması için veri işlemenin zorunlu olması (KVKK m.5/2-e).</li>
        <li>İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla, veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması (KVKK m.5/2-f).</li>
        <li>Açık rızanızın bulunması (KVKK m.5/1) (Örn: Pazarlama iletişimleri için).</li>
      </ul>

      <h3 className={styles.sectionTitle}>4. Kişisel Verilerin Aktarımı</h3>
      <p className={styles.paragraph}>
        Kişisel verileriniz, yukarıda belirtilen amaçlar doğrultusunda ve KVKK'nın 8. ve 9. maddelerine uygun olarak,
        gerekli güvenlik önlemleri alınarak aşağıdaki taraflara aktarılabilecektir:
      </p>
      <ul className={styles.purposeList}>
        <li><strong>Ödeme Hizmeti Sağlayıcıları:</strong> Ödeme işlemlerinin güvenli bir şekilde gerçekleştirilmesi amacıyla iyzico gibi lisanslı ödeme kuruluşlarına.</li>
        <li><strong>İş Ortakları ve Tedarikçiler:</strong> Hizmetlerin sunulması için destek alınan taraflar (örn: sunucu/hosting hizmeti, e-posta gönderim hizmeti, analitik hizmetleri).</li>
        <li><strong>Yetkili Kamu Kurum ve Kuruluşları:</strong> Yasal talepler doğrultusunda ve mevzuat gereği bilgi verilmesi gereken merciler (mahkemeler, savcılıklar vb.).</li>
        <li><strong>Hukuk ve Danışmanlık Büroları:</strong> Hukuki süreçlerin takibi veya danışmanlık alınması amacıyla sır saklama yükümlülüğü çerçevesinde.</li>
      </ul>

      <h3 className={styles.sectionTitle}>5. Kişisel Verilerin Toplanma Yöntemleri</h3>
      <p className={styles.paragraph}>
        Kişisel verileriniz, Site üzerindeki formları doldurmanız, üye olmanız, hizmetlerimizi kullanmanız,
        bizimle iletişime geçmeniz ve çerezler gibi otomatik veya kısmen otomatik yöntemlerle toplanmaktadır.
      </p>

      <h3 className={styles.sectionTitle}>6. Çerezler (Cookies)</h3>
      <p className={styles.paragraph}>
        Sitemizde kullanıcı deneyimini geliştirmek, sitenin verimli çalışmasını sağlamak ve tercihlerinizi
        hatırlamak gibi amaçlarla çerezler kullanmaktayız. Kullandığımız çerez türleri şunlardır:
      </p>
      <ul className={styles.dataList}>
        <li><strong>Zorunlu Çerezler:</strong> Sitenin temel fonksiyonlarının çalışması için gereklidir (örn: oturum açma).</li>
        <li><strong>Performans ve Analitik Çerezler:</strong> Site kullanımını analiz ederek performansı artırmamıza yardımcı olur (örn: Google Analytics).</li>
        <li><strong>İşlevsellik Çerezleri:</strong> Dil seçimi gibi tercihlerinizi hatırlar.</li>
        <li><strong>Hedefleme/Reklam Çerezleri (Açık rızanız ile):</strong> İlgi alanlarınıza yönelik içerik veya reklam sunulmasına yardımcı olabilir.</li>
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

      <h3 className={styles.sectionTitle}>7. KVKK Kapsamındaki Haklarınız</h3>
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

      <h3 className={styles.sectionTitle}>8. Politika Değişiklikleri</h3>
      <p className={styles.paragraph}>
        İşbu Gizlilik Politikası ve Aydınlatma Metni, değişen şartlara ve mevzuata uyum sağlamak amacıyla
        zaman zaman güncellenebilir. Güncellemeler Sitemizde yayınlandığı tarihte yürürlüğe girer.
      </p>
    </div>
    </>
  );
}

export default PrivacyPolicy;

import React from 'react';
import styles from './TermsOfService.module.css'; // Stil dosyasını import et

function TermsOfService() {
  const siteName = "Belge Hızlı";
  const siteUrl = "https://www.belgehizli.com/";
  // const companyTitle = "[Şahıs Şirketi Ünvanı (varsa)]"; // Şirket ünvanınız varsa burayı açın
  // const ownerName = "[Şirket Sahibi Adı Soyadı]"; // Şahıs şirketi ise sahip adı buraya
  // const address = "[Merkez Adresiniz]"; // Resmi adresiniz buraya
  const email = "info@belgehizli.com"; // E-posta adresinizi buraya girin
  // const phone = "[Telefon Numaranız]"; // Telefon numaranız varsa burayı açın
  const lastUpdateDate = "20.04.2025";
  // const taxOffice = "[Vergi Dairesi]"; // Vergi dairesi bilgisi buraya
  // const taxIdNumber = "[Vergi Kimlik Numarası (VKN)]"; // VKN bilgisi buraya
  // const mersisNo = "[MERSİS Numarası (varsa)]"; // Varsa ekleyin
  // const kepAddress = "[KEP Adresiniz (varsa)]"; // Varsa ekleyin

  return (
    <>
  <title>Kullanım Şartları - Belge Hızlı</title>
  <meta name="description" content="Belge Hızlı platformunun kullanım koşulları ve hizmet sözleşmesi. Sitemizi kullanarak kabul ettiğiniz şartları inceleyin." />
  <link rel="canonical" href="https://www.belgehizli.com/kullanim-sartlari" />

    <div className={styles.container}>
      <h2 className={styles.title}>Kullanım Şartları ve Mesafeli Satış Sözleşmesi</h2>
      <p className={styles.lastUpdated}><strong>Son Güncelleme:</strong> {lastUpdateDate}</p>

      <p className={styles.paragraph}>
        Lütfen <strong>{siteUrl}</strong> ("Site") adresinde sunulan hizmetleri kullanmadan önce bu Kullanım Şartları'nı ("Sözleşme") dikkatlice okuyunuz.
        Site'ye erişerek veya hizmetleri kullanarak, bu Sözleşme'yi okuduğunuzu, anladığınızı ve hükümlerine bağlı kalmayı kabul ettiğinizi beyan etmiş olursunuz.
      </p>

      {/* Bölüm 1 Başlığı */}
      <h3 className={styles.mainSectionTitle}>BÖLÜM 1: KULLANIM ŞARTLARI</h3>

      {/* Madde Başlığı */}
      <h4 className={styles.articleTitle}>MADDE 1: TARAFLAR VE TANIMLAR</h4>
      <p className={styles.paragraph}>
        İşbu Sözleşme, bir tarafta merkezi {/* address */} adresinde bulunan <strong>{/* companyTitle */} ( {/* ownerName */} )</strong> (bundan sonra "{siteName}" veya "Hizmet Sağlayıcı" olarak anılacaktır) ile diğer tarafta Site'yi kullanan veya Site üzerinden hizmet satın alan gerçek veya tüzel kişi ("Kullanıcı" veya "Müşteri") arasında akdedilmiştir.
      </p>
      <ul className={styles.definitionList}>
        <li><strong>Site:</strong> {siteUrl} adresindeki web sitesi.</li>
        <li><strong>Kullanıcı/Müşteri:</strong> Site'yi ziyaret eden, üye olan, formları dolduran veya hizmet satın alan kişi.</li>
        <li><strong>Hizmet:</strong> Site üzerinden sunulan, kullanıcıların belirli şablonlar (örn: Konut Kira Sözleşmesi) için gerekli bilgileri form alanlarına girerek kişiselleştirilmiş PDF formatında belge oluşturmasını ve indirmesini sağlayan dijital içerik üretme hizmeti.</li>
        <li><strong>Şablon:</strong> Site'de sunulan, belirli bir amaca yönelik önceden hazırlanmış belge taslağı.</li>
        <li><strong>PDF Belge:</strong> Kullanıcının form alanlarına girdiği bilgilerle Şablon'un kişiselleştirilmesi sonucu oluşturulan ve indirilebilen dijital dosya.</li>
      </ul>

      <h4 className={styles.articleTitle}>MADDE 2: SUNULAN HİZMET</h4>
      <p className={styles.paragraph}>
        2.1. {siteName}, kullanıcıların seçtikleri şablonlar üzerindeki form alanlarını doldurarak kendi ihtiyaçlarına göre uyarlanmış PDF formatında belgeler oluşturmalarına ve ödeme sonrası bu belgeleri indirmelerine olanak tanıyan bir platformdur.
      </p>
      {/* Önemli Not Stili */}
      <p className={styles.importantNote}>
        2.2. <strong>{siteName} bir hukuk bürosu veya avukatlık hizmeti değildir. Site'de sunulan şablonlar ve oluşturulan PDF Belgeler hukuki tavsiye niteliği taşımaz.</strong> Kullanıcılar, oluşturdukları belgelerin kendi özel durumlarına uygunluğunu ve yasal geçerliliğini teyit etmekten ve gerekirse bir hukuk uzmanına danışmaktan kendileri sorumludur. {siteName}, şablonların veya oluşturulan PDF Belgelerin kullanımından doğabilecek herhangi bir hukuki sonuçtan sorumlu tutulamaz.
      </p>
      <p className={styles.paragraph}>
        2.3. {siteName}, hizmetlerin kapsamını, şablonları veya Site'nin işleyişini önceden haber vermeksizin değiştirme, askıya alma veya durdurma hakkını saklı tutar.
      </p>

      <h4 className={styles.articleTitle}>MADDE 3: ÜYELİK VE KULLANICI HESABI</h4>
       <p className={styles.paragraph}>
        3.1. Bazı hizmetlerden yararlanmak veya oluşturulan belgelere daha sonra erişmek için üyelik gerekebilir. Kullanıcı, üyelik sırasında talep edilen bilgileri doğru, eksiksiz ve güncel olarak sağlamakla yükümlüdür.
      </p>
      <p className={styles.paragraph}>
        3.2. Kullanıcı, hesap bilgilerinin (e-posta, şifre vb.) gizliliğinden ve güvenliğinden sorumludur. Hesap üzerinden yapılan tüm işlemlerden Kullanıcı sorumludur. Yetkisiz kullanımı fark ettiğinde derhal {siteName}'e bildirmelidir.
      </p>
      <p className={styles.paragraph}>
        3.3. {siteName}, herhangi bir gerekçe göstermeksizin üyelik talebini reddetme veya mevcut bir üyeliği iptal etme hakkını saklı tutar.
      </p>

       <h4 className={styles.articleTitle}>MADDE 4: KULLANICI YÜKÜMLÜLÜKLERİ</h4>
       <p className={styles.paragraph}>
        4.1. Kullanıcı, Site'yi ve Hizmetleri yalnızca yasal amaçlarla kullanacağını kabul eder.
      </p>
      <p className={styles.paragraph}>
        4.2. Kullanıcı, form alanlarına girdiği bilgilerin doğruluğundan ve eksiksizliğinden kendisi sorumludur. Oluşturulan PDF Belge, Kullanıcının girdiği verilere dayanmaktadır.
      </p>
      <p className={styles.paragraph}>
        4.3. Kullanıcı, Site'nin işleyişine müdahale etmeyecek, virüs veya zararlı kod bulaştırmayacak, aşırı yükleme yapmayacaktır.
      </p>
      <p className={styles.paragraph}>
        4.4. Kullanıcı, Site'deki şablonları veya içerikleri {siteName}'in yazılı izni olmaksızın kopyalamayacak, çoğaltmayacak, dağıtmayacak veya türev eserler oluşturmayacaktır. Satın alınan PDF Belge, Kullanıcının kişisel veya belirtilen amaçlar doğrultusunda kullanımı içindir.
      </p>

      <h4 className={styles.articleTitle}>MADDE 5: FİKRİ MÜLKİYET HAKLARI</h4>
      <p className={styles.paragraph}>
        5.1. Site'nin tasarımı, içeriği, yazılımları, şablonları ve markası dahil ancak bunlarla sınırlı olmamak üzere tüm fikri mülkiyet hakları {siteName}'e aittir. Kullanıcıya yalnızca Hizmetlerden yararlanmak amacıyla sınırlı, münhasır olmayan, devredilemez bir kullanım lisansı verilmektedir.
      </p>
      <p className={styles.paragraph}>
        5.2. Kullanıcı tarafından formlara girilen ve PDF Belge'yi oluşturan kişisel verilerin mülkiyeti Kullanıcı'ya aittir. Ancak Kullanıcı, bu verilerin Hizmet'in sunulması amacıyla {siteName} tarafından işlenmesine ve saklanmasına izin verir.
      </p>

       <h4 className={styles.articleTitle}>MADDE 6: ÜCRETLENDİRME VE ÖDEME</h4>
      <p className={styles.paragraph}>
        6.1. Belirli şablonlardan PDF Belge oluşturma ve indirme hizmeti ücrete tabidir. Ücretler, ilgili şablonun sayfasında ve ödeme adımında açıkça belirtilir. Fiyatlara KDV dahildir.
      </p>
      <p className={styles.paragraph}>
        6.2. Ödemeler, Site üzerinde belirtilen yöntemlerle (örn: iyzico aracılığıyla kredi kartı) yapılır. Kullanıcı, ödeme için verdiği bilgilerin doğru olduğunu kabul eder.
      </p>
      <p className={styles.paragraph}>
        6.3. Başarılı ödeme sonrası, oluşturulan PDF Belge indirmeye hazır hale gelir ve/veya Kullanıcının belirttiği e-posta adresine gönderilebilir.
      </p>
      <p className={styles.paragraph}>
        6.4. Kullanıcı adına yasalara uygun şekilde e-arşiv fatura düzenlenir ve Kullanıcının belirttiği e-posta adresine gönderilir.
      </p>

      <h4 className={styles.articleTitle}>MADDE 7: SORUMLULUĞUN SINIRLANDIRILMASI</h4>
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
        7.4. {siteName}'in işbu Sözleşme kapsamındaki toplam sorumluluğu, her halükarda ilgili zarara neden olan hizmet için Kullanıcı tarafından ödenen tutar ile sınırlıdır.
      </p>

      <h4 className={styles.articleTitle}>MADDE 8: GİZLİLİK</h4>
      <p className={styles.paragraph}>
        Kullanıcıların kişisel verilerinin işlenmesi ve korunmasına ilişkin esaslar, Site'de yer alan Gizlilik Politikası ve Aydınlatma Metni'nde düzenlenmiştir. Kullanıcı, Site'yi kullanarak bu politikayı kabul etmiş sayılır.
      </p>

      <h4 className={styles.articleTitle}>MADDE 9: SÖZLEŞMENİN FESHİ</h4>
       <p className={styles.paragraph}>
        Kullanıcı, dilediği zaman hesabını silerek veya Site'yi kullanmayı bırakarak bu Sözleşmeyi fiilen sona erdirebilir. {siteName}, Kullanıcının işbu Sözleşme hükümlerini ihlal etmesi halinde üyeliği veya hizmete erişimi derhal sona erdirebilir.
      </p>

       <h4 className={styles.articleTitle}>MADDE 10: UYGULANACAK HUKUK VE YETKİLİ MAHKEME</h4>
      <p className={styles.paragraph}>
        İşbu Sözleşme'den doğacak ihtilaflarda Türk Hukuku uygulanacaktır. Tüketici sıfatına haiz Kullanıcılar için, uyuşmazlıkların çözümünde 6502 Sayılı Kanun ve ilgili yönetmelikler uyarınca Kullanıcının yerleşim yerindeki veya hizmeti satın aldığı yerdeki Tüketici Sorunları Hakem Heyetleri veya Tüketici Mahkemeleri yetkilidir. Tacir veya diğer Kullanıcılar için İstanbul (Çağlayan) Mahkemeleri ve İcra Daireleri yetkilidir. {/* VEYA Kendi şehrinizi yazın */}
      </p>

      {/* Ayırıcı Çizgi */}
      <hr className={styles.separator} />

      {/* Bölüm 2 Başlığı */}
      <h3 className={styles.mainSectionTitle}>BÖLÜM 2: MESAFELİ SATIŞ SÖZLEŞMESİ</h3>
      <p className={styles.paragraph}>
        İşbu Mesafeli Satış Sözleşmesi ("Satış Sözleşmesi"), 6502 Sayılı Tüketicinin Korunması Hakkında Kanun ("Kanun") ve Mesafeli Sözleşmeler Yönetmeliği'ne ("Yönetmelik") uygun olarak düzenlenmiştir.
      </p>

      <h4 className={styles.articleTitle}>MADDE 1: TARAFLAR</h4>
      <p className={styles.paragraph}><strong>SATICI:</strong></p>
      <ul className={styles.infoList}>
        {/* <li>Unvan/Ad Soyad: {companyTitle} ({ownerName})</li> */}
        {/* <li>Adres: {address}</li> */}
        {/* <li>Telefon: {phone}</li> */}
        <li>E-posta: {email}</li>
        {/* Varsa KEP ve MERSİS ekleyin */}
        {/* <li>KEP Adresi: {kepAddress}</li> */}
        {/* <li>MERSİS No: {mersisNo}</li> */}
        {/* <li>Vergi Dairesi: {taxOffice}</li> */}
        {/* <li>Vergi Kimlik No: {taxIdNumber}</li> */}
      </ul>
      <p className={styles.paragraph}><strong>ALICI (MÜŞTERİ/TÜKETİCİ):</strong></p>
      <p className={styles.paragraph}>
        Site üzerinden hizmet satın alan, adı soyadı ve iletişim bilgileri sipariş sırasında alınan Kullanıcı.
        (Bilgiler sipariş formunda ve faturada yer alacaktır.)
      </p>

      <h4 className={styles.articleTitle}>MADDE 2: SÖZLEŞMENİN KONUSU</h4>
      <p className={styles.paragraph}>
        İşbu Satış Sözleşmesi'nin konusu, Alıcı'nın Satıcı'ya ait {siteUrl} internet sitesinden elektronik ortamda siparişini yaptığı, nitelikleri ve satış fiyatı Site'de belirtilen Hizmet'in (belirli bir şablona dayalı PDF Belge oluşturma ve indirme) satışı ve teslimi ile ilgili olarak Kanun ve Yönetmelik hükümleri gereğince tarafların hak ve yükümlülüklerinin belirlenmesidir.
      </p>

      <h4 className={styles.articleTitle}>MADDE 3: SÖZLEŞME KONUSU HİZMETİN NİTELİKLERİ VE FİYATI</h4>
      <p className={styles.paragraph}>
        Hizmetin türü, adı, temel nitelikleri, KDV dahil satış fiyatı ve ödeme şekli, ilgili şablonun tanıtım sayfasında ve ödeme onay sayfasında belirtildiği gibidir. Bu bilgiler Alıcı tarafından onaylanmıştır.
      </p>

      <h4 className={styles.articleTitle}>MADDE 4: HİZMETİN TESLİMİ (İFA ŞEKLİ)</h4>
       <p className={styles.paragraph}>
        4.1. Hizmet, dijital içerik (PDF Belge) olarak sunulmaktadır.
      </p>
      <p className={styles.paragraph}>
        4.2. Sözleşme, Alıcı tarafından elektronik ortamda onaylanıp ödemenin başarıyla tamamlanmasını takiben yürürlüğe girer.
      </p>
      <p className={styles.paragraph}>
        4.3. Ödeme sonrası, Alıcı'nın formlara girdiği bilgilerle oluşturulan kişiselleştirilmiş PDF Belge, Alıcı tarafından Site üzerinden indirilebilir hale gelir ve/veya Alıcı'nın belirttiği e-posta adresine gönderilir. Teslimat anında (indirme veya e-posta ile gönderim) gerçekleşir.
      </p>
      <p className={styles.paragraph}>
        4.4. Teknik sorunlar nedeniyle belgenin indirilememesi veya alınamaması durumunda Alıcı, {email} adresi üzerinden Satıcı ile iletişime geçmelidir. Satıcı, sorunun giderilmesi ve belgenin teslimi için makul çabayı gösterecektir.
      </p>

      <h4 className={styles.articleTitle}>MADDE 5: CAYMA HAKKI</h4>
      <p className={styles.paragraph}>
        Alıcı'nın sipariş ettiği Hizmet, Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesinin birinci fıkrasının (ğ) bendi uyarınca <strong>"Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayrimaddi mallara ilişkin sözleşmeler"</strong> kapsamındadır.
      </p>
      {/* Cayma Hakkı Uyarısı */}
      <p className={styles.warningNote}>
        Bu nedenle, Alıcı'nın ödeme yaparak hizmeti satın alması ve PDF Belge'nin indirilmeye/gönderilmeye hazır hale gelmesiyle hizmet anında ifa edilmiş sayılacağından, Alıcı'nın (tüketici olsa dahi) <strong>cayma hakkı bulunmamaktadır ve ücret iadesi yapılamaz.</strong> Alıcı, sipariş vermeden önce bu durumu bildiğini ve kabul ettiğini beyan eder.
      </p>

      <h4 className={styles.articleTitle}>MADDE 6: UYUŞMAZLIKLARIN ÇÖZÜMÜ</h4>
      <p className={styles.paragraph}>
        İşbu Satış Sözleşmesi'nden doğabilecek ihtilaflarda, T.C. Gümrük ve Ticaret Bakanlığı'nca ilan edilen değere kadar Alıcı'nın yerleşim yerinin bulunduğu veya hizmeti satın aldığı yerdeki Tüketici Sorunları Hakem Heyetleri, bu değerin üzerindeki ihtilaflarda ise Tüketici Mahkemeleri yetkilidir.
      </p>

      <h4 className={styles.articleTitle}>MADDE 7: BİLDİRİMLER VE DELİL SÖZLEŞMESİ</h4>
      <p className={styles.paragraph}>
        Taraflar arasındaki bildirimler, Alıcı'nın belirttiği e-posta adresi ve Satıcı'nın {email} e-posta adresi üzerinden yapılacaktır. Alıcı, işbu Sözleşme'den doğabilecek ihtilaflarda Satıcı'nın resmi defter ve ticari kayıtlarıyla, kendi veritabanında, sunucularında tuttuğu elektronik bilgilerin ve bilgisayar kayıtlarının, bağlayıcı, kesin ve münhasır delil teşkil edeceğini, bu maddenin Hukuk Muhakemeleri Kanunu'nun 193. maddesi anlamında delil sözleşmesi niteliğinde olduğunu kabul eder.
      </p>

       <h4 className={styles.articleTitle}>MADDE 8: YÜRÜRLÜK</h4>
      <p className={styles.paragraph}>
        Alıcı, Site üzerinden siparişini tamamladığında işbu Sözleşme'nin tüm maddelerini okuduğunu, anladığını ve kabul ettiğini beyan etmiş sayılır. İşbu Sözleşme, Alıcı tarafından elektronik ortamda onaylandığı tarihte yürürlüğe girer.
      </p>

    </div>
    </>
  );
}

export default TermsOfService;
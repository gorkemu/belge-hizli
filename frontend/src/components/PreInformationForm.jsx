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
        <h2 className={styles.title}>ÖN BİLGİLENDİRME FORMU</h2>
        <p className={styles.intro}>
          İşbu Ön Bilgilendirme Formu, 6502 Sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri uyarınca, aşağıda detayları verilen hizmetin satın alınmasından önce ALICI'yı bilgilendirmek amacıyla düzenlenmiştir.
        </p>

        <h3 className={styles.sectionTitle}>1. SATICI BİLGİLERİ</h3>
        <ul className={styles.infoList}>
          <li><strong>Unvan/Ad Soyad:</strong> {ownerName}</li>
          <li><strong>Adres:</strong> {address}</li>
          <li><strong>Telefon:</strong> {phone}</li>
          <li><strong>E-posta:</strong> {email}</li>
          <li><strong>Web Sitesi:</strong> {siteUrl}</li>
        </ul>

        <h3 className={styles.sectionTitle}>2. ALICI (TÜKETİCİ) BİLGİLERİ</h3>
        <p className={styles.paragraph}>
          Hizmeti satın alan ve bilgileri sipariş/ödeme sırasında elektronik ortamda alınan gerçek veya tüzel kişidir. Alıcı'nın adı, soyadı, adresi, telefonu ve e-posta adresi gibi bilgileri, sipariş formunda ve düzenlenecek faturada yer alacaktır.
        </p>

        <h3 className={styles.sectionTitle}>3. SÖZLEŞME KONUSU HİZMETİN TEMEL NİTELİKLERİ</h3>
        <ul className={styles.definitionList}>
            <li><strong>Hizmetin Tanımı:</strong> ALICI tarafından {siteUrl} adresindeki siteden seçilen belirli bir belge şablonunun (örn: Konut Kira Sözleşmesi, Araç Satış Sözleşmesi vb.), ALICI'nın elektronik form aracılığıyla girdiği bilgilerle kişiselleştirilerek, kullanıma hazır PDF formatında dijital bir belge oluşturulması ve bu belgenin elektronik ortamda ALICI'ya teslim edilmesi hizmetidir.</li>
            <li><strong>Şablon Seçimi:</strong> Sözleşmeye konu olan spesifik şablonun adı ve temel özellikleri, ALICI'nın sipariş anında seçtiği ve onayladığı şablon detay sayfasında belirtilmektedir.</li>
            <li><strong>Önemli Not:</strong> Satıcı (Belge Hızlı) bir hukuk bürosu değildir ve hukuki danışmanlık hizmeti vermemektedir. Sunulan şablonlar ve oluşturulan PDF belgeler genel bilgilendirme amaçlı olup, hukuki tavsiye niteliği taşımaz. ALICI, oluşturduğu belgenin kendi özel durumu için hukuki uygunluğunu ve geçerliliğini teyit etmekten ve gerekirse bir hukuk uzmanına danışmaktan kendisi sorumludur.</li>
        </ul>

        <h3 className={styles.sectionTitle}>4. HİZMETİN VERGİLER DAHİL TOPLAM FİYATI VE ÖDEME ŞEKLİ</h3>
        <ul className={styles.definitionList}>
            <li><strong>Hizmet Bedeli (KDV Dahil):</strong> Satışa konu olan hizmetin (seçilen şablon için PDF oluşturma) tüm vergiler dahil toplam satış fiyatı, ALICI'nın seçtiği şablonun detay sayfasında ve ödeme adımından hemen önce açıkça gösterilmektedir.</li>
            <li><strong>Ödeme Yöntemi:</strong> Ödeme, Sitede sunulan güvenli ödeme altyapısı (örn: ileride entegre edilecek ParamPOS aracılığıyla Kredi Kartı, Banka Kartı) kullanılarak peşin olarak yapılır.</li>
            <li><strong>Ek Masraflar:</strong> Hizmet dijital olarak teslim edildiğinden, kargo, teslimat vb. ek bir masraf bulunmamaktadır.</li>
        </ul>

        <h3 className={styles.sectionTitle}>5. TESLİMAT BİLGİLERİ</h3>
        <ul className={styles.definitionList}>
            <li><strong>Teslimat Şekli:</strong> Hizmet, elektronik ortamda anında ifa edilir. Başarılı ödemeyi takiben, oluşturulan kişiselleştirilmiş PDF belgesi ALICI tarafından Site üzerinden indirilebilir hale getirilir ve ayrıca ALICI'nın sipariş sırasında belirttiği e-posta adresine gönderilir.</li>
            <li><strong>Teslimat Anı:</strong> Ödemenin başarıyla tamamlanması ve PDF belgesinin indirilebilir/gönderilebilir hale gelmesi anıdır.</li>
            <li><strong>Teknik Sorunlar:</strong> Belgenin indirilmesinde veya alınmasında teknik bir sorun yaşanması durumunda ALICI, Satıcı'nın {email} e-posta adresi üzerinden iletişime geçmelidir. Satıcı, sorunun giderilmesi için makul çabayı gösterecektir.</li>
        </ul>

        <h3 className={styles.sectionTitle}>6. CAYMA HAKKI</h3>
        <p className={styles.paragraph}>
            Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesinin birinci fıkrasının (ğ) bendi uyarınca, <strong>"Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayrimaddi mallara ilişkin sözleşmelerde cayma hakkı kullanılamaz."</strong>
        </p>
        <p className={`${styles.paragraph} ${styles.warningNote}`}>
             Bu nedenle, ALICI'nın sipariş ettiği kişiselleştirilmiş PDF belge oluşturma hizmeti elektronik ortamda anında ifa edildiğinden ve belge anında teslim edilen gayrimaddi mal niteliğinde olduğundan, ALICI'nın (tüketici olsa dahi) yasal olarak <strong>cayma hakkı bulunmamaktadır ve ödeme yapıldıktan sonra ücret iadesi yapılamaz.</strong> ALICI, siparişi tamamlamadan önce bu durumu bildiğini ve kabul ettiğini beyan eder.
        </p>

        <h3 className={styles.sectionTitle}>7. ŞİKAYET VE İTİRAZ BAŞVURULARI</h3>
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
import React from 'react';
import styles from './DeliveryReturn.module.css'; // Stil dosyasını import et

function DeliveryReturn() {
  const siteName = "Belge Hızlı";
  const email = "info@belgehizli.com";

  return (
    <>
  <title>Teslimat ve İade Koşulları - Belge Hızlı</title>
  <meta name="description" content="Belge Hızlı'dan satın alınan şablonların teslimatı ve olası iade süreçleri hakkındaki politikamız." />
  <link rel="canonical" href="https://www.belgehizli.com/teslimat-iade" /> {/* URL'yi kontrol edin, /teslimat-ve-iade olabilir */}

    <div className={styles.container}>
      <h2 className={styles.title}>Teslimat ve İade Politikası</h2>

      <p className={styles.importantNote}>
                Sitemiz şu anda beta aşamasındadır ve tüm şablonlar geçici olarak ücretsiz sunulmaktadır. Ödeme entegrasyonumuz henüz aktif değildir. Aşağıdaki politikalar, gelecekte aktif olacak ücretli hizmetlerimiz ve ödeme süreçlerimiz için geçerlidir. Şu anda indirdiğiniz tüm şablonlar ücretsizdir.
                </p>

      <h3 className={styles.sectionTitle}>Teslimat Süreci</h3>
      <p className={styles.paragraph}>
        {siteName} olarak sunduğumuz hizmet, kullanıcılarımızın seçtikleri şablonlar üzerindeki form alanlarını
        doldurarak kişiselleştirilmiş PDF formatında belgeler oluşturması ve indirmesidir. Hizmetimiz tamamen
        dijital ortamda gerçekleşmektedir.
      </p>
      {/* Sıralı liste stili */}
      <ol className={styles.orderedList}>
        <li>İhtiyacınıza uygun belge şablonunu seçin.</li>
        <li>Şablon detay sayfasındaki form alanlarını dikkatlice doldurun.</li>
        <li>Gerekli bilgileri girdikten sonra ödeme adımına geçin.</li>
        <li>Ödemeniz ödeme altyapıları üzerinden başarıyla tamamlandıktan sonra, girdiğiniz bilgilerle oluşturulan kişiselleştirilmiş PDF belgeniz indirilmeye hazır hale gelecektir.</li>
      </ol>
      <p className={styles.paragraph}>
        Teslimat, ödemenin başarıyla tamamlanmasının hemen ardından elektronik ortamda anında gerçekleşir.
        Herhangi bir fiziksel kargo veya teslimat süreci bulunmamaktadır.
      </p>
      <p className={styles.paragraph}>
        Belgenizi indirirken veya alırken teknik bir sorun yaşarsanız, lütfen <a href={`mailto:${email}`}>{email}</a> adresi üzerinden
        bizimle iletişime geçiniz. Sorunun çözümü için size yardımcı olmaktan memnuniyet duyarız.
      </p>

      <h3 className={styles.sectionTitle}>İade Politikası ve Cayma Hakkı</h3>
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
        Bu doğrultuda, {siteName} üzerinden satın alınan ve ödeme sonrası anında kullanıma/indirmeye sunulan
        dijital PDF belgeler için <strong>cayma hakkı bulunmamaktadır ve ücret iadesi yapılamamaktadır.</strong>
      </p>
      <p className={styles.paragraph}>
        Kullanıcılarımız, sipariş vermeden önce şablon tanıtım sayfalarındaki açıklamaları, varsa örnek
        görselleri inceleyerek ve formu doldurma sürecini deneyimleyerek (ödeme öncesi önizleme varsa)
        hizmet hakkında yeterli bilgiye sahip olurlar. Ödeme yapılmasıyla birlikte bu koşullar kabul edilmiş sayılır.
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
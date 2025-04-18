import React from 'react';
import styles from './AboutUs.module.css'; // Stil dosyasını import et

function AboutUs() {
  const siteName = "Belge Hızlı";

  return (
    // Ana container stilini uygula
    <div className={styles.container}>
      {/* Başlık stilini uygula */}
      <h2 className={styles.title}>Hakkımızda</h2>

      {/* Paragraf stilini uygula */}
      <p className={styles.paragraph}>
        <strong>{siteName}</strong> olarak amacımız, [amacınızı buraya yazın, örn: sıkça ihtiyaç duyulan yasal belgeleri
        hazırlama sürecini kolaylaştırmak, hızlı ve pratik çözümler sunmaktır]. Teknolojiyi kullanarak,
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

      {/* Paragraf stilini uygula */}
      <p className={styles.paragraph}>
        Bize güvendiğiniz için teşekkür ederiz!
      </p>
    </div>
  );
}

export default AboutUs;
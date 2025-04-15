import React from 'react';
import styles from './ContactUs.module.css'; // Stil dosyasını import et

function ContactUs() {
  // Placeholder bilgileri doldurun
  const ownerName = "[Şirket Sahibi Adı Soyadı]";
  const companyTitle = "[Şahıs Şirketi Ünvanı (varsa)]";
  const address = "[Merkez Adresiniz (Resmi kayıtlardaki adresiniz)]";
  const taxOffice = "[Vergi Dairesi]";
  const taxIdNumber = "[Vergi Kimlik Numanız (VKN)]";
  const mersisNo = "[MERSİS Numarası (Ticaret Odasına kayıtlıysanız ve varsa)]";
  const kepAddress = "[KEP Adresiniz (varsa)]";
  const email = "[E-posta Adresiniz (Müşteri desteği için)]";
  const phone = "[Telefon Numaranız]";
  const businessName = "[İşletme Adınız (Kullanıyorsanız)]";
  const registeredTrademark = "[Tescilli Markanız (varsa)]";
  const chamberMembership = "[Mensup Olduğunuz Meslek Odası (varsa)]";
  const chamberRegistryNo = "[Oda Sicil Numarası (varsa)]";
  const professionalRulesLink = "[Mesleki Davranış Kuralları ve Erişim Linki (varsa)]";

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>İletişim Bilgileri</h2>
      <p className={styles.paragraph}>
        Bizimle iletişime geçmek için aşağıdaki bilgileri kullanabilirsiniz. Müşteri destek talepleriniz için
        öncelikli olarak e-posta adresimizi kullanmanızı rica ederiz.
      </p>

      {/* Bilgi kutusu stili */}
      <div className={styles.infoBox}>
        {/* Alt başlık stili */}
        <h4 className={styles.subHeading}>Firma Bilgileri (iyzico ve Yasal Bilgilendirme Kapsamında)</h4>
        <p className={styles.infoItem}>
          {/* Etiket stili */}
          <strong className={styles.label}>Adı Soyadı / Unvan:</strong> {companyTitle || ownerName} {companyTitle && `(Sahibi: ${ownerName})`}
        </p>
        <p className={styles.infoItem}>
          <strong className={styles.label}>Vergi Dairesi:</strong> {taxOffice}
        </p>
        <p className={styles.infoItem}>
          <strong className={styles.label}>Vergi Kimlik Numarası:</strong> {taxIdNumber}
        </p>
        {mersisNo && <p className={styles.infoItem}><strong className={styles.label}>MERSİS Numarası:</strong> {mersisNo}</p>}
        <p className={styles.infoItem}>
          <strong className={styles.label}>Merkez Adresi:</strong> {address}
        </p>
      </div>

      <div className={styles.contactChannels}>
        <h4 className={styles.subHeading}>İletişim Kanalları</h4>
        <p className={styles.infoItem}><strong className={styles.label}>E-posta:</strong> {email}</p>
        <p className={styles.infoItem}><strong className={styles.label}>Telefon:</strong> {phone}</p>
        {kepAddress && <p className={styles.infoItem}><strong className={styles.label}>KEP Adresi:</strong> {kepAddress}</p>}
      </div>

      {/* Sadece varsa gösterilecek bölüm */}
      {(businessName || registeredTrademark || chamberMembership || professionalRulesLink) && (
        <div className={styles.otherInfo}>
            <h4 className={styles.subHeading}>Diğer Bilgiler (varsa)</h4>
            {businessName && <p className={styles.infoItem}><strong className={styles.label}>İşletme Adı:</strong> {businessName}</p>}
            {registeredTrademark && <p className={styles.infoItem}><strong className={styles.label}>Tescilli Marka:</strong> {registeredTrademark}</p>}
            {chamberMembership && (
            <p className={styles.infoItem}>
                <strong className={styles.label}>Mensup Olunan Meslek Odası:</strong> {chamberMembership} <br />
                {chamberRegistryNo && <><strong className={styles.label}>Oda Sicil No:</strong> {chamberRegistryNo}</>}
            </p>
            )}
            {professionalRulesLink && (
            <p className={styles.infoItem}>
                <strong className={styles.label}>Mesleki Davranış Kuralları:</strong> <a href={professionalRulesLink} target="_blank" rel="noopener noreferrer">Kurallara Erişmek İçin Tıklayınız</a>
            </p>
            )}
        </div>
      )}

      {/* İletişim formu (Şu an yorumlu, istenirse aktif edilebilir) */}
      {/*
      <form className={styles.contactForm}>
        <h3 className={styles.subHeading}>İletişim Formu</h3>
        <label className={styles.formLabel} htmlFor="name">Adınız Soyadınız:</label>
        <input className={styles.input} type="text" id="name" name="name"/>

        <label className={styles.formLabel} htmlFor="email">E-posta Adresiniz:</label>
        <input className={styles.input} type="email" id="email" name="email"/>

        <label className={styles.formLabel} htmlFor="message">Mesajınız:</label>
        <textarea className={styles.textarea} id="message" name="message" rows="5"></textarea>

        <button className={styles.submitButton} type="submit">Gönder</button>
      </form>
      */}
    </div>
  );
}

export default ContactUs;
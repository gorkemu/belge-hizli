// frontend/src/components/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Ana Sayfaya yönlendirmek için Link
import styles from './NotFound.module.css'; // Stil dosyasını import et
import { Helmet } from 'react-helmet-async'; // Head etiketlerini yönetmek için Helmet

function NotFound() {
  return (
    <>
      <Helmet>
        {/* Bu sayfa için spesifik başlık ve meta açıklama */}
        <title>Sayfa Bulunamadı - 404 - Belge Hızlı</title>
        <meta name="description" content="Aradığınız sayfa bulunamadı." />
        {/* Canonical URL eklemeyebiliriz veya ana sayfaya yönlendirebiliriz, 404 sayfaları için genellikle canonical eklenmez */}
        {/* <link rel="canonical" href="https://www.belgehizli.com/" /> */}
      </Helmet>

      <div className={styles.container}>
        {/* Ana başlık H1 olarak ayarlandı */}
        <h1 className={styles.title}>404</h1> {/* <-- H1 olarak ayarlandı */}
        <p className={styles.message}>Üzgünüz, aradığınız sayfa bulunamadı.</p>
        <Link to="/" className={styles.homeLink}>Ana Sayfaya Geri Dön</Link>
      </div>
    </>
  );
}

export default NotFound;
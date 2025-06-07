// frontend/src/components/PaymentFailurePage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './PaymentResultPage.module.css';
import { Helmet } from 'react-helmet-async';

function PaymentFailurePage() {
    const { transactionId } = useParams();

    return (
        <>
            <Helmet>
                <title>Ödeme Başarısız - Belge Hızlı</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className={`${styles.container} ${styles.failure}`}>
                <h2 className={styles.title}>Ödeme Başarısız Oldu 😟</h2>
                <p>
                    Ödeme işleminiz sırasında bir sorun oluştu ve tamamlanamadı.
                </p>
                <p>
                    Lütfen bilgilerinizi kontrol edip tekrar deneyin. {/* <--- Değişiklik */}
                </p>
                <p>İşlem ID'niz (eğer oluşturulduysa): <strong>{transactionId}</strong></p>
                <p>
                    Sorun devam ederse, lütfen <Link to="/iletisim" className={styles.link}>destek ekibimizle iletişime</Link> geçin.
                </p>
                {/* "Tekrar Dene" butonu şimdilik kullanıcıyı şablon listesine yönlendirsin */}
                <Link to="/sablonlar" className={styles.button}>
                    Başka Bir Şablon Dene
                </Link>
                 <Link to="/" className={`${styles.button} ${styles.homeButton}`}>
                    Ana Sayfaya Dön
                </Link>
            </div>
        </>
    );
}

export default PaymentFailurePage;
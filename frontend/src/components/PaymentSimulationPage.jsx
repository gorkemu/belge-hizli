// frontend/src/components/PaymentSimulationPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './PaymentSimulationPage.module.css'; 
import { Helmet } from 'react-helmet-async';

function PaymentSimulationPage() {
    const { transactionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation(); // gatewayPaymentRef'i query string'den almak için

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [gatewayPaymentRef, setGatewayPaymentRef] = useState('');

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

    useEffect(() => {
        // URL'den gatewayPaymentRef'i al (opsiyonel)
        const queryParams = new URLSearchParams(location.search);
        const ref = queryParams.get('ref');
        if (ref) {
            setGatewayPaymentRef(ref);
        }
        // Bu sayfada transaction detaylarını çekmeye gerek yok, sadece callback'i tetikleyeceğiz.
    }, [location.search]);

    const handlePaymentOutcome = async (outcome) => {
        setIsLoading(true);
        setError(null);
        try {
            const payload = {
                transactionId: transactionId,
                status: outcome, // 'success' or 'failure'
                gatewayReferenceId: gatewayPaymentRef || `SIM_REF_${transactionId}`, // Gerçek bir referans veya simüle edilmiş
                // Diğer olası callback verileri buraya eklenebilir (tutar, tarih vb.)
                paymentDate: new Date().toISOString(),
                // amount: 15.00 // Örnek, bu bilgi transaction'dan da çekilebilir.
            };

            // Backend'deki callback endpoint'ine POST isteği
            await axios.post(`${API_BASE_URL}/payment/callback`, payload);

            // Başarılı callback sonrası yönlendirme
            if (outcome === 'success') {
                navigate(`/odeme-basarili/${transactionId}`);
            } else {
                navigate(`/odeme-basarisiz/${transactionId}`);
            }

        } catch (err) {
            console.error('Error sending payment callback:', err);
            setError('Ödeme sonucu iletilirken bir hata oluştu. Lütfen durumu kontrol edin veya destek ile iletişime geçin.');
            setIsLoading(false);
        }
        // Yönlendirme olacağı için setIsLoading(false) burada gerekmeyebilir,
        // ama hata durumunda kalırsa diye ekliyoruz.
    };

    return (
        <>
            <Helmet>
                <title>Ödeme Simülasyonu - Belge Hızlı</title>
                <meta name="robots" content="noindex, nofollow" /> {/* Arama motorları indexlemesin */}
            </Helmet>
            <div className={styles.container}>
                <h2 className={styles.title}>Ödeme Simülasyon Sayfası</h2>
                <p className={styles.info}>
                    Bu sayfa, ödeme ağ geçidi entegrasyonunun simülasyonu içindir.
                    Normalde kullanıcı bu sayfayı görmez, doğrudan ödeme sağlayıcısının sayfasına yönlendirilir ve
                    ödeme sonrası sitemize geri döner.
                </p>
                <p><strong>İşlem ID:</strong> {transactionId}</p>
                {gatewayPaymentRef && <p><strong>Ağ Geçidi Ref:</strong> {gatewayPaymentRef}</p>}

                {isLoading && <p className={styles.loading}>İşleniyor, lütfen bekleyin...</p>}
                {error && <p className={styles.error}>{error}</p>}

                {!isLoading && !error && (
                    <div className={styles.buttonGroup}>
                        <button
                            onClick={() => handlePaymentOutcome('success')}
                            className={`${styles.button} ${styles.successButton}`}
                            disabled={isLoading}
                        >
                            Ödemeyi Başarıyla Tamamla
                        </button>
                        <button
                            onClick={() => handlePaymentOutcome('failure')}
                            className={`${styles.button} ${styles.failureButton}`}
                            disabled={isLoading}
                        >
                            Ödeme Başarısız Oldu
                        </button>
                    </div>
                )}
                 <p className={styles.note}>
                    Butonlardan birine tıkladığınızda, backend'e ödeme sonucu bilgisi gönderilecek ve
                    ardından ilgili sonuç sayfasına yönlendirileceksiniz.
                </p>
            </div>
        </>
    );
}

export default PaymentSimulationPage;
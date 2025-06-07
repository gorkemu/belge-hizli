// frontend/src/components/PaymentSuccessPage.jsx
import React, { useState, useEffect } from 'react'; // useState ve useEffect import edildi
import { useParams, Link } from 'react-router-dom';
import axios from 'axios'; // axios import edildi
import styles from './PaymentResultPage.module.css';
import { Helmet } from 'react-helmet-async';

function PaymentSuccessPage() {
    const { transactionId } = useParams();
    const [isLoading, setIsLoading] = useState(false); // İndirme butonu için yükleme durumu
    const [downloadError, setDownloadError] = useState(null); // İndirme hatası
    const [downloadLink, setDownloadLink] = useState(''); // Oluşturulan indirme linki
    const [filename, setFilename] = useState('belge.pdf'); // İndirilecek dosya adı

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

    // PDF indirme fonksiyonu
    const handleDownloadPdf = async () => {
        setIsLoading(true);
        setDownloadError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/document/download/${transactionId}`, {
                responseType: 'blob',
            });

            const contentDisposition = response.headers['content-disposition'] || response.headers['Content-Disposition']; // İki olasılığı da dene

            let dynamicFilename = 'belge.pdf';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
                // ... (geri kalan regex ve dosya indirme mantığı aynı)
                if (filenameMatch && filenameMatch.length > 1) {
                    dynamicFilename = filenameMatch[1];
                }
            }

            const blob = new Blob([response.data], { type: 'application/pdf' });
            // ... (indirme linki oluşturma vs.)
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = dynamicFilename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            console.log(`PDF "${dynamicFilename}" downloaded successfully.`);


        } catch (err) {
            // ... (hata yönetimi)
            console.error('Error downloading PDF:', err);
            let errorMessage = 'PDF indirilirken bir hata oluştu.';
            if (err.response && err.response.data) {
                if (err.response.data instanceof Blob && err.response.data.type === "application/json") {
                    try {
                        const errorJson = JSON.parse(await err.response.data.text());
                        errorMessage = errorJson.message || errorMessage;
                    } catch (parseErr) { /* ignore */ }
                } else if (err.response.data.message) {
                    errorMessage = err.response.data.message;
                }
            }
            setDownloadError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Sayfa yüklendiğinde otomatik indirme denemesi yapılabilir (isteğe bağlı)
    // useEffect(() => {
    //     handleDownloadPdf();
    // }, [transactionId]); // transactionId değiştiğinde tetikle (ilk yüklemede)

    return (
        <>
            <Helmet>
                <title>Ödeme Başarılı - Belge Hızlı</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className={`${styles.container} ${styles.success}`}>
                <h2 className={styles.title}>Ödeme Başarılı! 🎉</h2>
                <p>
                    Belge oluşturma ve e-posta ile gönderim işleminiz tamamlandı.
                </p>
                <p>
                    E-posta adresinizi kontrol etmeyi unutmayın. Belgeniz ayrıca aşağıdaki butona tıklayarak
                    hemen indirilebilir.
                </p>
                <p>İşlem ID'niz: <strong>{transactionId}</strong></p>

                {/* İndirme Butonu/Linki */}
                {!downloadLink ? (
                    <button
                        onClick={handleDownloadPdf}
                        className={`${styles.button} ${styles.downloadButton}`} // Yeni stil
                        disabled={isLoading}
                    >
                        {isLoading ? 'İndiriliyor...' : 'Belgeyi Şimdi İndir'}
                    </button>
                ) : (
                    // Eğer otomatik indirme sonrası link göstermek isterseniz
                    // <a href={downloadLink} download={filename} className={`${styles.button} ${styles.downloadButton}`}>
                    //     Belgeyi Tekrar İndir
                    // </a>
                    <p className={styles.downloadedMessage}>Belgeniz indirilmeye başlandı.</p>
                )}

                {downloadError && <p className={styles.downloadError}>{downloadError}</p>}

                <p className={styles.infoNote}>
                    Belgenizi indirme veya görüntüleme ile ilgili bir sorun yaşarsanız,
                    lütfen bu işlem ID'si ile bizimle <Link to="/iletisim" className={styles.link}>iletişime</Link> geçin.
                </p>
                <Link to="/sablonlar" className={styles.button}>
                    Yeni Bir Şablon Oluştur
                </Link>
                <Link to="/" className={`${styles.button} ${styles.homeButton}`}>
                    Ana Sayfaya Dön
                </Link>
            </div>
        </>
    );
}

export default PaymentSuccessPage;
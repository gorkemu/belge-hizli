import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './TemplateDetail.module.css';
import DocumentForm from './DocumentForm';       // Dinamik form bileşeni
import DocumentPreview from './DocumentPreview'; // Dinamik önizleme bileşeni
// import PaymentScreen from './PaymentScreen'; // Ayrı ödeme ekranı gerekirse aktif edilebilir

function TemplateDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const formRef = useRef(null); // DocumentForm bileşenine referans

    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({}); // Form verilerini tutacak state
    const [formErrors, setFormErrors] = useState({}); // Form hatalarını tutacak state (bilgi amaçlı)

    const [loadingPayment, setLoadingPayment] = useState(false); // Ödeme/İndirme işlemi yükleme durumu
    const [paymentError, setPaymentError] = useState(null); // Ödeme/İndirme hatası

    // Şablon verisini backend'den çek
    useEffect(() => {
        setLoading(true);
        setError(null);
        axios.get(`/api/templates/${id}`)
            .then(response => {
                console.log('Template data fetched:', response.data); // Debugging
                setTemplate(response.data);
                // Form state'ini sıfırla (yeni şablon için)
                setFormData({});
                setFormErrors({});
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching template:', error);
                setError('Şablon detayları yüklenirken bir hata oluştu.');
                setLoading(false);
            });
    }, [id]); // id değiştiğinde tekrar çek

    // DocumentForm'dan gelen veri ve hata güncellemelerini işle
    const handleFormChange = (newFormData, errors) => {
        setFormData(newFormData);
        setFormErrors(errors); // Hataları da takip edebiliriz (örn: butonu disable etmek için)
        // console.log('TemplateDetail FormData Updated:', newFormData); // Debugging
        // console.log('TemplateDetail FormErrors Updated:', errors); // Debugging
    };

    // Ödeme ve PDF indirme işlemini başlat
    const handlePayAndDownload = async () => {
        // 1. Form referansı var mı kontrol et
        if (!formRef.current) {
            console.error("DocumentForm referansı bulunamadı.");
            alert("Bir hata oluştu, lütfen sayfayı yenileyin.");
            return;
        }

        // 2. Formu doğrula (DocumentForm içindeki validateForm fonksiyonunu çağır)
        const isValid = await formRef.current.handleSubmit();

        // 3. Doğrulama başarısızsa işlemi durdur
        if (!isValid) {
            console.error("Form validation failed. Errors:", formErrors); // Konsolda hataları gör
            alert('Lütfen formdaki zorunlu alanları doldurun veya işaretli hataları düzeltin.');
            return;
        }

        // 4. Doğrulama başarılıysa, ödeme/indirme işlemini başlat
        console.log("Form geçerli, ödeme/indirme işlemi başlıyor..."); // Debugging
        console.log("Gönderilecek FormData:", formData); // Debugging
        setLoadingPayment(true);
        setPaymentError(null);

        try {
            // 5. Backend'e veriyi gönder (formData olduğu gibi gönderiliyor)
            const response = await axios.post(`/api/templates/${id}/process-payment`, {
                formData, // Dinamik formdan gelen tüm veri
                amount: template?.price || 0, // Şablondan fiyatı al
                currency: 'TRY', // Para birimi (gerekirse dinamikleştirilebilir)
                // E-posta alanı formda tanımlıysa onu kullan, değilse boş gönderilebilir
                // Backend tarafı gerekirse e-postayı ayrıca isteyebilir veya zorunlu kılabilir
                email: formData?.belge_email || ''
            }, {
                responseType: 'blob' // Yanıtı PDF dosyası olarak almak için
            });

            // 6. Başarılı yanıt geldiyse PDF'i indir
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            // Dosya adını şablon adından türet, geçersiz karakterleri temizle
            const filename = template?.name ? `${template.name.replace(/[^a-zA-Z0-9._-]/g, '_')}.pdf` : 'document.pdf';
            link.download = filename;
            document.body.appendChild(link);
            link.click();

            // 7. İndirme sonrası temizlik
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            console.log("PDF indirme işlemi başarılı."); // Debugging

            // İsteğe bağlı: Başarı mesajı gösterilebilir veya başka bir sayfaya yönlendirilebilir
            // alert('PDF dosyanız başarıyla indirildi!');

        } catch (error) {
            console.error('Ödeme/İndirme hatası:', error.response || error.message || error);
            // Backend'den gelen hata mesajını göstermeye çalış
            let errorMessage = 'Ödeme veya PDF oluşturma sırasında bir hata oluştu.';
            if (error.response && error.response.data) {
                 // Blob yerine JSON hatası gelmiş olabilir
                 if (error.response.data instanceof Blob && error.response.data.type === "application/json") {
                     try {
                         const errJson = JSON.parse(await error.response.data.text());
                         errorMessage = errJson.message || errorMessage;
                     } catch (parseError) {
                         console.error("Hata mesajı parse edilemedi:", parseError);
                     }
                 } else if (error.response.data.message) { // Normal JSON hatası
                    errorMessage = error.response.data.message;
                }
            }
            setPaymentError(errorMessage);
            alert(`Hata: ${errorMessage}`); // Kullanıcıya hata mesajını göster

        } finally {
            setLoadingPayment(false); // Yükleme durumunu kapat
        }
    };

    // --- Render Logic ---

    if (loading) {
        return <div className={styles.statusMessage}>Şablon yükleniyor...</div>;
    }

    if (error) {
        return <div className={styles.statusMessage}>{error} <button onClick={() => window.location.reload()}>Yeniden Dene</button></div>;
    }

    if (!template) {
        return <div className={styles.statusMessage}>Şablon bulunamadı.</div>;
    }

    // Formun geçerli olup olmadığını kontrol et (Ödeme butonunu etkinleştirmek için)
    const isFormCurrentlyValid = Object.keys(formErrors).length === 0; // Basit kontrol

    return (
        <div className={styles.container}>
            <button onClick={() => navigate(-1)} className={styles.backButton}>
                ← Geri
            </button>

            <h2 className={styles.title}>{template.name}</h2>
            <p className={styles.description}>{template.description}</p>
            {template.price > 0 && <p className={styles.price}>Fiyat: {template.price} TRY</p>}

            <div className={styles.editorContainer}>
                {/* Sol Sütun: Dinamik Form */}
                <div className={styles.formColumn}>
                    {template.fields && template.fields.length > 0 ? (
                        <DocumentForm
                            templateFields={template.fields} // Şablondan gelen alan tanımları
                            onChange={handleFormChange}     // Form verisi değiştikçe state'i güncelle
                            ref={formRef}                  // Form'a erişim için referans
                        />
                    ) : (
                        <div className={styles.statusMessage}>Bu şablon için doldurulacak form alanı bulunmamaktadır.</div>
                    )}
                </div>

                {/* Sağ Sütun: Dinamik Önizleme */}
                <div className={styles.previewColumn}>
                     {template.content ? (
                        <DocumentPreview
                            templateContent={template.content} // Şablondan gelen Handlebars içerik
                            formData={formData}             // Formdan gelen güncel veri
                        />
                     ) : (
                        <div className={styles.statusMessage}>Bu şablon için önizleme içeriği tanımlanmamış.</div>
                     )}

                </div>
            </div>

             {/* Alt Kısım: Ödeme ve İndirme Butonu */}
             <div className={styles.paymentSection}>
                 {/* Gerekirse ek ödeme bilgileri (örn: formda email yoksa burada sor) */}
                 {/* {!(template.fields.some(f => f.name === 'belge_email')) && ( ... input ... )} */}

                <button
                    onClick={handlePayAndDownload}
                    disabled={loadingPayment} // İşlem sırasında butonu devre dışı bırak
                    className={styles.payDownloadButton}
                >
                    {loadingPayment ? 'İşleniyor...' : `Öde (${template.price || 0} TRY) ve İndir`}
                </button>
                {paymentError && <p className={styles.paymentError}>{paymentError}</p>}
             </div>

            {/* Ayrı bir PaymentScreen modalı kullanılacaksa buraya eklenebilir */}
            {/* {showPaymentScreen && <PaymentScreen ... />} */}
        </div>
    );
}

export default TemplateDetail;
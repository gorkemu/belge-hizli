import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './TemplateDetail.module.css';
import DocumentForm from './DocumentForm';
import DocumentPreview from './DocumentPreview';
import PaymentScreen from './PaymentScreen'; // PaymentScreen bileşenini import edin

function TemplateDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const formRef = useRef(null); // DocumentForm bileşenine referans
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState({}); // Form hatalarını tutmak için
    const [isFormValid, setIsFormValid] = useState(true); // Formun geçerlilik durumu
    const [loadingPayment, setLoadingPayment] = useState(false); // Ödeme yükleme durumu
    const [paymentError, setPaymentError] = useState(null); // Ödeme hatası
    const [showPaymentScreen, setShowPaymentScreen] = useState(false); // Ödeme ekranını göstermek için
    const [paymentDetails, setPaymentDetails] = useState({
        amount: template ? template.price : 0, // Şablondan fiyat al
        currency: 'TRY', // Sabit para birimi veya şablondan alınabilir
        email: ''
    });
    const [pdfDownloadUrl, setPdfDownloadUrl] = useState(null); // PDF indirme URL'i
    const [pdfFilename, setPdfFilename] = useState('document.pdf'); // PDF dosya adı

    useEffect(() => {
        axios.get(`/api/templates/${id}`)
            .then(response => {
                console.log('Backend response:', response.data);
                setTemplate(response.data);
                console.log('Template Fields:', response.data.fields);
                setLoading(false);
                setPaymentDetails(prev => ({ ...prev, amount: response.data.price })); // Fiyatı ayarla
            })
            .catch(error => {
                console.error('Error fetching template:', error);
                setError('Failed to load template details');
                setLoading(false);
            });
    }, [id]);

    const handleFormChange = (newFormData, errors) => {
        setFormData(newFormData);
        console.log('FormData (handleFormChange):', newFormData);
        setFormErrors(errors);
        setIsFormValid(Object.keys(errors).length === 0); // Hata yoksa form geçerlidir
        console.log('FormErrors:', errors);
    };

    const handlePaymentInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentDetails(prev => ({ ...prev, [name]: value }));
    };

    const handlePayAndDownload = async () => {
        if (formRef.current) {
            const isValid = await formRef.current.handleSubmit(); // Doğrulamayı çalıştır ve sonucunu al
            if (!isValid) {
                alert('Lütfen formdaki zorunlu alanları doldurun.');
                return;
            }

            setLoadingPayment(true);
            setPaymentError(null);
            try {
                const response = await axios.post(`/api/templates/${id}/process-payment`, {
                    formData,
                    amount: paymentDetails.amount,
                    currency: paymentDetails.currency,
                    email: paymentDetails.email
                }, { responseType: 'blob' }); // Cevabı blob olarak al

                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${template ? template.name.replace(/[^a-zA-Z0-9._-]/g, '_') : 'document'}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                setLoadingPayment(false);

            } catch (error) {
                console.error('Ödeme hatası:', error);
                setPaymentError('Ödeme işlemi sırasında bir hata oluştu.');
            } finally {
                setLoadingPayment(false);
            }
        }
    };

    const handlePaymentSuccess = (paymentResult) => {
        console.log('Ödeme başarılı:', paymentResult);
        const link = document.createElement('a');
        link.href = pdfDownloadUrl;
        link.download = pdfFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setPdfDownloadUrl(null);
        setShowPaymentScreen(false);
    };

    const handlePaymentCancel = () => {
        console.log('Ödeme iptal edildi.');
        setShowPaymentScreen(false);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!template) return <div>Template not found</div>;

    return (
        <div className={styles.container}>
            <button onClick={() => navigate(-1)} className={styles.backButton}>
                &larr; Back
            </button>

            <h2 className={styles.title}>{template.name}</h2>
            <p className={styles.description}>{template.description}</p>

            <div className={styles.editorContainer}>
                <div className={styles.formColumn}>
                    {template.fields && (
                        <DocumentForm templateFields={template.fields} onChange={handleFormChange} ref={formRef} />
                    )}
                </div>
                <div className={styles.previewColumn}>
                    <DocumentPreview templateContent={template.content} formData={formData} />
                </div>
            </div>

            {showPaymentScreen && (
                <PaymentScreen
                    paymentDetails={paymentDetails}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentCancel={handlePaymentCancel}
                />
            )}
        </div>
    );
}

export default TemplateDetail;

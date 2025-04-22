import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './TemplateDetail.module.css';
import DocumentForm from './DocumentForm'; 		// Dinamik form bileşeni
import DocumentPreview from './DocumentPreview'; // Dinamik önizleme bileşeni
// import PaymentScreen from './PaymentScreen'; // Ayrı ödeme ekranı gerekirse aktif edilebilir
import { Helmet } from 'react-helmet-async'; // <-- YENİ: Helmet import edildi

function TemplateDetail() {
	const { slug } = useParams(); // slug parametresini alıyoruz
	const navigate = useNavigate();
	const formRef = useRef(null); // DocumentForm bileşenine referans

	const [template, setTemplate] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [formData, setFormData] = useState({}); // Form verilerini tutacak state
	const [formErrors, setFormErrors] = useState({}); // Form hatalarını tutacak state (bilgi amaçlı)

	const [loadingPayment, setLoadingPayment] = useState(false); // Ödeme/İndirme işlemi yükleme durumu
	const [paymentError, setPaymentError] = useState(null); // Ödeme/İndirme hatası

	const [showSuccessMessage, setShowSuccessMessage] = useState(false);

	const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

	// Şablon verisini backend'den çek
	useEffect(() => {
		setLoading(true);
		setError(null);
		// API çağrısını slug tabanlı rota üzerinden yapıyoruz
		axios.get(`${API_BASE_URL}/sablonlar/detay/${slug}`)
			.then(response => {
				// console.log('Template data fetched:', response.data); // Debugging
				setTemplate(response.data);
				// Form state'ini sıfırla (yeni şablon için)
				setFormData({});
				setFormErrors({});
				setLoading(false);
			})
			.catch(error => {
				console.error('Error fetching template:', error);
				if (error.response && error.response.status === 404) {
					setError('Şablon bulunamadı.');
				} else {
					setError('Şablon detayları yüklenirken bir hata oluştu.');
				}
				setLoading(false);
			});
	}, [slug]); // useEffect bağımlılığı slug

	// DocumentForm'dan gelen veri ve hata güncellemelerini işle
	const handleFormChange = (newFormData, errors) => {
		setFormData(newFormData);
		setFormErrors(errors);
		// console.log('TemplateDetail FormData Updated:', newFormData); // Debugging
		// console.log('TemplateDetail FormErrors Updated:', errors); // Debugging
	};

	// Ödeme ve PDF indirme işlemini başlat
	const handlePayAndDownload = async () => {
		if (!formRef.current) {
			console.error("DocumentForm referansı bulunamadı.");
			alert("Bir hata oluştu, lütfen sayfayı yenileyin.");
			return;
		}

		const isValid = await formRef.current.handleSubmit();

		if (!isValid) {
			console.error("Form validation failed. Errors:", formErrors);
			alert('Lütfen formdaki zorunlu alanları doldurun veya işaretli hataları düzeltin.');
			return;
		}

		setShowSuccessMessage(false);
		setPaymentError(null);

		setLoadingPayment(true);
		try {
			// Ödeme rotası hala ID kullandığı için burada template._id kullanıyoruz.
			const response = await axios.post(`${API_BASE_URL}/templates/${template._id}/process-payment`, {
				formData,
				amount: template?.price || 0,
				currency: 'TRY',
				email: formData?.belge_email || ''
			}, {
				responseType: 'blob'
			});

			const blob = new Blob([response.data], { type: 'application/pdf' });
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			const filename = template?.name ? `${template.name.replace(/[^a-zA-Z0-9._-]/g, '_')}.pdf` : 'document.pdf';
			link.download = filename;
			document.body.appendChild(link);
			link.click();

			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
			console.log("PDF indirme işlemi başarılı.");

			setShowSuccessMessage(true);
			setTimeout(() => {
				setShowSuccessMessage(false);
			}, 5000);

		} catch (error) {
			console.error('Ödeme/İndirme hatası:', error.response || error.message || error);
			let errorMessage = 'Ödeme veya PDF oluşturma sırasında bir hata oluştu.';
			if (error.response && error.response.data) {
				if (error.response.data instanceof Blob && error.response.data.type === "application/json") {
					try {
						const errJson = JSON.parse(await error.response.data.text());
						errorMessage = errJson.message || errorMessage;
					} catch (parseError) {
						console.error("Hata mesajı parse edilemedi:", parseError);
					}
				} else if (error.response.data.message) {
					errorMessage = error.response.data.message;
				}
			}
			setPaymentError(errorMessage);
			alert(`Hata: ${errorMessage}`);
			setShowSuccessMessage(false);

		} finally {
			setLoadingPayment(false);
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

	const isFormCurrentlyValid = Object.keys(formErrors).length === 0;

	return (
		<> {/* Fragment */}
			{/* --- Dinamik Meta Etiketleri (Helmet ile) --- */}
			{/* Daha önceki manuel <title>, <meta>, <link> etiketleri kaldırıldı */}
			<Helmet>
				{/* Şablon verisi yüklendiğinde dinamik başlık ve açıklama */}
				<title>{template.name ? `${template.name} - Belge Hızlı` : 'Şablon Detayı - Belge Hızlı'}</title>
				<meta
					name="description"
					content={template.description ? `${template.description} Şablonunu Belge Hızlı'da doldurun ve indirin.` : 'Belge Hızlı şablon detayı.'}
				/>
				{/* Canonical URL, slug tabanlı yeni yapıyı kullanıyor */}
				{template.slug && <link rel="canonical" href={`https://www.belgehizli.com/sablonlar/detay/${template.slug}`} />}
				{/* Open Graph başlığı da eklenebilir */}
				{/* {template.name && <meta property="og:title" content={`${template.name} - Belge Hızlı`} />} */}
				{/* Diğer Open Graph, Twitter Card etiketleri buraya eklenebilir */}
			</Helmet>
			{/* --- Meta Etiketleri Sonu --- */}


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
								templateFields={template.fields}
								onChange={handleFormChange}
								ref={formRef}
							/>
						) : (
							<div className={styles.statusMessage}>Bu şablon için doldurulacak form alanı bulunmamaktadır.</div>
						)}
					</div>

					{/* Sağ Sütun: Dinamik Önizleme */}
					<div className={styles.previewColumn}>
						{template.content ? (
							<DocumentPreview
								templateContent={template.content}
								formData={formData}
							/>
						) : (
							<div className={styles.statusMessage}>Bu şablon için önizleme içeriği tanımlanmamış.</div>
						)}

					</div>
				</div>

				 {/* Alt Kısım: Ödeme ve İndirme Butonu */}
				 <div className={styles.paymentSection}>
					 <button
						 onClick={handlePayAndDownload}
						 disabled={loadingPayment}
						 className={styles.payDownloadButton}
					 >
						 {loadingPayment ? 'İşleniyor...' : `Öde (${template.price || 0} TRY) ve İndir`}
					 </button>

					 {showSuccessMessage && (
						 <p className={styles.successMessage}>
							 ✅ PDF başarıyla oluşturuldu ve indiriliyor. Bir kopya da e-posta adresinize gönderiliyor...
						 </p>
					 )}

					 {paymentError && <p className={styles.paymentError}>{paymentError}</p>}
				 </div>
			</div>
		</>
	);
}

export default TemplateDetail;
// frontend/src/components/TemplateDetail.jsx
import React, { useState, useEffect, useRef } from 'react';
// Link component'ini import etmeyi unutmayın
import { useParams, useNavigate, Link } from 'react-router-dom'; // <-- GÜNCELLENDİ
import axios from 'axios';
import styles from './TemplateDetail.module.css';
import DocumentForm from './DocumentForm';
import DocumentPreview from './DocumentPreview';
import { Helmet } from 'react-helmet-async';

function TemplateDetail() {
	const { slug } = useParams();
	const navigate = useNavigate();
	const formRef = useRef(null);

	const [template, setTemplate] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [formData, setFormData] = useState({});
	const [formErrors, setFormErrors] = useState({});

	const [loadingPayment, setLoadingPayment] = useState(false);
	const [paymentError, setPaymentError] = useState(null);

	const [showSuccessMessage, setShowSuccessMessage] = useState(false);

	// --- YENİ: Onay durumu için state ---
	const [agreedToTerms, setAgreedToTerms] = useState(false);
	// --- YENİ SON ---

	const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

	useEffect(() => {
		setLoading(true);
		setError(null);
		axios.get(`${API_BASE_URL}/sablonlar/detay/${slug}`)
			.then(response => {
				setTemplate(response.data);
				setFormData({});
				setFormErrors({});
				setAgreedToTerms(false); // <-- YENİ: Şablon değiştiğinde onayı sıfırla
				setLoading(false);
			})
			.catch(error => {
				if (error.response && error.response.status === 404) {
					setError('Şablon bulunamadı.');
				} else {
					setError('Şablon detayları yüklenirken bir hata oluştu.');
				}
				setLoading(false);
			});
	}, [slug]);

	const handleFormChange = (newFormData, errors) => {
		setFormData(newFormData);
		setFormErrors(errors);
	};

	const handlePayAndDownload = async () => {
		// --- YENİ: Şartların kabul edilip edilmediğini kontrol et ---
		if (!agreedToTerms) {
			alert('Devam etmek için lütfen Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi\'ni okuyup kabul ettiğinizi onaylayın.');
			return;
		}
		// --- YENİ SON ---

		if (!formRef.current) {
			alert("Bir hata oluştu, lütfen sayfayı yenileyin.");
			return;
		}

		const isValid = await formRef.current.handleSubmit();

		if (!isValid) {
			alert('Lütfen formdaki zorunlu alanları doldurun veya işaretli hataları düzeltin.');
			return;
		}

		setShowSuccessMessage(false);
		setPaymentError(null);
		setLoadingPayment(true);

		try {
			const response = await axios.post(`${API_BASE_URL}/templates/${template._id}/process-payment`, {
				formData,
				amount: template?.price || 0,
				currency: 'TRY',
				email: formData?.belge_email || ''
				// İleride buraya onay zamanı gibi ek bilgiler de gönderilebilir
				// consentTimestamp: agreedToTerms ? new Date().toISOString() : null
			}, {
				responseType: 'blob'
			});

			// ... (PDF indirme ve e-posta gönderme kodları aynı kalır) ...
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

			setShowSuccessMessage(true);
			setTimeout(() => {
				setShowSuccessMessage(false);
			}, 5000);


		} catch (error) {
			// ... (Hata yönetimi kodları aynı kalır) ...
			let errorMessage = 'Ödeme veya PDF oluşturma sırasında bir hata oluştu.';
			if (error.response && error.response.data) {
				if (error.response.data instanceof Blob && error.response.data.type === "application/json") {
					try {
						const errJson = JSON.parse(await error.response.data.text());
						errorMessage = errJson.message || errorMessage;
					} catch (parseError) {
						// console.error("Hata mesajı parse edilemedi:", parseError);
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

	if (loading) {
		return <div className={styles.statusMessage}>Şablon yükleniyor...</div>;
	}

	if (error) {
		return <div className={styles.statusMessage}>{error} <button onClick={() => window.location.reload()}>Yeniden Dene</button></div>;
	}

	if (!template) {
		return <div className={styles.statusMessage}>Şablon bulunamadı.</div>;
	}

	// Formun geçerli olup olmadığını kontrol etmek için (opsiyonel, buton stilinde kullanılabilir)
	// const isFormCurrentlyValid = Object.keys(formErrors).length === 0;

	return (
		<>
			<Helmet>
				<title>{template.name ? `${template.name} - Belge Hızlı` : 'Şablon Detayı - Belge Hızlı'}</title>
				<meta
					name="description"
					content={template.description ? `${template.description} Şablonunu Belge Hızlı'da doldurun ve indirin.` : 'Belge Hızlı şablon detayı.'}
				/>
				{template.slug && <link rel="canonical" href={`https://www.belgehizli.com/sablonlar/detay/${template.slug}`} />}
			</Helmet>

			<div className={styles.container}>
				<button onClick={() => navigate(-1)} className={styles.backButton}>
					← Geri
				</button>

				<h2 className={styles.title}>{template.name}</h2>
				<p className={styles.description}>{template.description}</p>
				{/* Fiyat gösterimini beta notu ile güncelleyelim */}
				<p className={styles.price}>
					{template.price > 0 ? `Normal Fiyat: ${template.price} TRY` : 'Bu şablon ücretsizdir.'}
					<span className={styles.betaNote}> (Beta süresince tüm şablonlar ücretsizdir)</span>
				</p>

				<div className={styles.editorContainer}>
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

				<div className={styles.paymentSection}>
					{/* --- YENİ: Onay Checkbox ve Metni --- */}
					<div className={styles.termsCheckboxContainer}>
						<input
							type="checkbox"
							id="termsCheckbox"
							checked={agreedToTerms}
							onChange={(e) => setAgreedToTerms(e.target.checked)}
							className={styles.checkboxInput}
						/>
						<label htmlFor="termsCheckbox" className={styles.termsLabel}>
							{/* // <-- GÜNCELLENDİ: ÖBF linki doğru route'a yönlendirildi --> */}
							<Link to="/on-bilgilendirme-formu" target="_blank" rel="noopener noreferrer" className={styles.termsLink}>Ön Bilgilendirme Formu</Link>'nu
							ve <Link to="/kullanim-sartlari" target="_blank" rel="noopener noreferrer" className={styles.termsLink}>Mesafeli Satış Sözleşmesi</Link>'ni
							okudum, anladım ve kabul ediyorum.
						</label>
					</div>
					{/* --- YENİ SON --- */}

					<button
						onClick={handlePayAndDownload}
						// Butonun disabled durumunu güncelle
						disabled={loadingPayment || !agreedToTerms} // <-- GÜNCELLENDİ
						className={`${styles.payDownloadButton} ${!agreedToTerms ? styles.disabledButton : ''}`} // <-- Opsiyonel: Kabul edilmediğinde farklı stil
					>
						{/* Beta sürecinde buton metni */}
						{loadingPayment ? 'İşleniyor...' : `Ücretsiz İndir ve E-posta Gönder`}
						{/* İleride ücretli olunca: {loadingPayment ? 'İşleniyor...' : `Öde (${template?.price || 0} TRY) ve İndir`} */}
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
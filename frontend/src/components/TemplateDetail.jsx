// frontend/src/components/TemplateDetail.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './TemplateDetail.module.css';
import DocumentForm from './DocumentForm';
import DocumentPreview from './DocumentPreview';
import { Helmet } from 'react-helmet-async';

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateTCKN = (tckn) => /^[1-9]{1}[0-9]{9}[02468]{1}$/.test(tckn) && tckn.length === 11;
const validateVKN = (vkn) => /^[0-9]{10}$/.test(vkn);

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
    const [paymentError, setPaymentError] = useState(null); // Belge formu ve genel hatalar için
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // --- Fatura Bilgileri State'leri ---
    const [showBillingForm, setShowBillingForm] = useState(false); // Fatura formu başta gizli
    const [billingType, setBillingType] = useState('bireysel');
    const [billingInfo, setBillingInfo] = useState({
        name: '', tckn: '', companyName: '', taxOffice: '', vkn: '', address: '', email: '' // Telefon kaldırıldı
    });
    const [billingErrors, setBillingErrors] = useState({});
    const [isBillingInfoSaved, setIsBillingInfoSaved] = useState(false); // Sadece kaydedilip edilmediğini tutar
    // --- YENİ: Fatura Kaydetme Başarı Mesajı ---
    const [billingSaveSuccess, setBillingSaveSuccess] = useState(false);
    // --- YENİ SON ---

    // --- YENİ: Fatura Gerekli mi? (Beta için false) ---
    const isBillingRequired = false;
    // --- YENİ SON ---

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

    // Şablon yükleme useEffect'i
    useEffect(() => {
        setLoading(true);
        setError(null);
        setPaymentError(null); // Hataları temizle
        axios.get(`${API_BASE_URL}/sablonlar/detay/${slug}`)
            .then(response => {
                setTemplate(response.data);
                setFormData({});
                setFormErrors({});
                setAgreedToTerms(false);
                setBillingInfo({ name: '', tckn: '', companyName: '', taxOffice: '', vkn: '', address: '', email: '' }); // Telefon kaldırıldı
                setBillingErrors({});
                setShowBillingForm(false); // Başlangıçta gizli
                setIsBillingInfoSaved(false);
                setBillingSaveSuccess(false); // Başarı mesajını temizle
                setBillingType('bireysel');
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

    // --- GÜNCELLENDİ: Belge formu değişikliklerini işle ---
    const handleFormChange = (newFormData, errors) => {
        setFormData(newFormData);
        setFormErrors(errors); // DocumentForm'dan gelen alan bazlı hataları set et
        // setPaymentError(null); // <-- BU SATIRI YORUMA AL veya SİL
        // Genel gönderim hatasını (paymentError) sadece form değişikliğinde temizlememeliyiz.
        // Gönderim hatası ancak yeni bir gönderme denemesi başarılı olduğunda veya
        // kullanıcı şartları kabul etme gibi başka bir eylemle hatayı geçersiz kıldığında temizlenmeli.
    };
    // --- GÜNCELLENDİ SON ---

    const handleBillingInputChange = (e) => {
        const { name, value } = e.target;
        setBillingInfo(prev => ({ ...prev, [name]: value }));
        setIsBillingInfoSaved(false); // Bilgi değişince kaydedilmedi sayılır
        setBillingSaveSuccess(false); // Başarı mesajını kaldır
        if (billingErrors[name]) {
            setBillingErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleBillingTypeChange = (e) => {
        setBillingType(e.target.value);
        setBillingErrors({});
        setIsBillingInfoSaved(false);
        setBillingSaveSuccess(false);
        setBillingInfo(prev => ({
            ...prev,
            name: e.target.value === 'bireysel' ? prev.name : '',
            tckn: e.target.value === 'bireysel' ? prev.tckn : '',
            companyName: e.target.value === 'kurumsal' ? prev.companyName : '',
            taxOffice: e.target.value === 'kurumsal' ? prev.taxOffice : '',
            vkn: e.target.value === 'kurumsal' ? prev.vkn : '',
            // address ve email ortak olduğu için temizlenmez
        }));
    };

    const validateBillingForm = () => {
        // ... (Validasyon mantığı aynı kalır, telefon kontrolü yok) ...
        const errors = {};
        if (billingType === 'bireysel') {
            if (!billingInfo.name.trim()) errors.name = 'Ad Soyad zorunludur.';
            if (!billingInfo.tckn.trim()) errors.tckn = 'TC Kimlik Numarası zorunludur.';
            else if (!validateTCKN(billingInfo.tckn)) errors.tckn = 'Geçersiz TC Kimlik Numarası (11 hane olmalı).';
        } else {
            if (!billingInfo.companyName.trim()) errors.companyName = 'Şirket Unvanı zorunludur.';
            if (!billingInfo.taxOffice.trim()) errors.taxOffice = 'Vergi Dairesi zorunludur.';
            if (!billingInfo.vkn.trim()) errors.vkn = 'Vergi Kimlik Numarası zorunludur.';
            else if (!validateVKN(billingInfo.vkn)) errors.vkn = 'Geçersiz Vergi Kimlik Numarası (10 hane olmalı).';
        }
        if (!billingInfo.address.trim()) errors.address = 'Fatura Adresi zorunludur.';
        if (!billingInfo.email.trim()) errors.email = 'Fatura E-postası zorunludur.';
        else if (!validateEmail(billingInfo.email)) errors.email = 'Geçersiz e-posta formatı.';

        setBillingErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // --- GÜNCELLENDİ: Fatura Bilgilerini Kaydet ---
    const handleSaveBillingInfo = (e) => {
        e.preventDefault();
        setBillingSaveSuccess(false); // Önceki başarı mesajını temizle
        if (validateBillingForm()) {
            setIsBillingInfoSaved(true); // Bilgiler geçerli ve kaydedildi olarak işaretle
            // setShowBillingForm(false); // <-- Formu gizleme kaldırıldı
            setBillingSaveSuccess(true); // Başarı mesajını göster
            setTimeout(() => setBillingSaveSuccess(false), 3000); // 3 saniye sonra mesajı kaldır
        } else {
             // Opsiyonel: Hata varsa forma odaklanabilir veya bir uyarı gösterebiliriz.
             // Şu an sadece validasyon hataları input altında gösteriliyor.
        }
    };
    // --- GÜNCELLENDİ SON ---

    // --- GÜNCELLENDİ: Ödeme/İndirme İşlemini Başlat (Render Odaklı Hata Yönetimi) ---
    const handlePayAndDownload = async () => {
        let detectedError = null; // Hata mesajını tutacak geçici değişken
        setShowSuccessMessage(false); // Başarı mesajını temizle

        // 1. Şartlar kabul edilmiş mi?
        if (!agreedToTerms) {
            detectedError = 'Devam etmek için lütfen Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi\'ni onaylayın.';
        }

        // 2. Fatura Bilgisi Gerekli mi ve Geçerli/Kaydedilmiş mi? (Sadece önceki hata yoksa kontrol et)
        if (!detectedError && isBillingRequired) {
            if (!showBillingForm || !isBillingInfoSaved) {
                    setShowBillingForm(true);
                    detectedError = 'Lütfen devam etmek için fatura bilgilerinizi girip kaydedin.';
            }
        }

        // 3. Belge formu referansı var mı? (Sadece önceki hata yoksa kontrol et)
        if (!detectedError && !formRef.current) {
                detectedError = "Belge formuyla ilgili bir hata oluştu, lütfen sayfayı yenileyin.";
        }

        // 4. Belge formu geçerli mi? (Sadece önceki hata yoksa kontrol et)
        let isDocumentFormValid = false;
        if (!detectedError && formRef.current) {
            isDocumentFormValid = await formRef.current.handleSubmit();
            if (!isDocumentFormValid) {
                detectedError = 'Lütfen belge formundaki zorunlu alanları doldurun veya işaretli hataları düzeltin.';
            }
        }

        // 5. Eğer herhangi bir frontend hatası varsa, state'i güncelle ve çık
        if (detectedError) {
            setPaymentError(detectedError);
            return; // Fonksiyondan çık
        }

        // --- Eğer buraya kadar geldiyse, tüm frontend validasyonları OK ---
        // Önceki hatayı temizle (artık güvendeyiz)
        setPaymentError(null);

        // Backend isteği ve sonrası...
        setLoadingPayment(true);
        try {
            const backendPayload = {
                formData,
                billingInfo: isBillingInfoSaved ? billingInfo : null,
                amount: template?.price || 0,
                currency: 'TRY',
                email: billingInfo.email || formData?.belge_email || ''
            };

            const response = await axios.post(`${API_BASE_URL}/templates/${template._id}/process-payment`, backendPayload, {
                responseType: 'blob'
            });

            // ... (PDF indirme kodları) ...
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
            setPaymentError(null); // Başarı durumunda hatayı temizle


        } catch (error) {
            // ... (Hata mesajı parse etme) ...
                let errorMessage = 'Belge oluşturma veya indirme sırasında bir hata oluştu.';
                if (error.response && error.response.data) {
                    if (error.response.data instanceof Blob && error.response.data.type === "application/json") {
                        try {
                            const errJson = JSON.parse(await error.response.data.text());
                            errorMessage = errJson.message || errorMessage;
                        } catch (parseError) { }
                    } else if (error.response.data.message) {
                        errorMessage = error.response.data.message;
                    }
                }
                // Backend hatası durumunda HATA MESAJINI SET ET
                setPaymentError(errorMessage);
                setShowSuccessMessage(false);

        } finally {
            setLoadingPayment(false);
        }
    };
    // --- GÜNCELLENDİ SON ---

    // --- YENİ: Fatura Formunu Açma/Kapama Butonu (Opsiyonel ama kullanışlı) ---
    const toggleBillingForm = () => {
        setShowBillingForm(prev => !prev);
        setBillingSaveSuccess(false); // Form açılıp kapanınca başarı mesajını temizle
        // Eğer form açılırken zorunluluk varsa ve bilgi kayıtlı değilse uyarı verebiliriz
        if (!showBillingForm && isBillingRequired && !isBillingInfoSaved) {
             setPaymentError('Fatura bilgilerinizi girip kaydetmeniz gerekmektedir.');
        } else {
            setPaymentError(null); // Form kapanınca veya zorunlu değilse hatayı temizle
        }
    }
    // --- YENİ SON ---

    // --- Render Logic ---
    if (loading) return <div className={styles.statusMessage}>Şablon yükleniyor...</div>;
    if (error) return <div className={styles.statusMessage}>{error} <button onClick={() => window.location.reload()}>Yeniden Dene</button></div>;
    if (!template) return <div className={styles.statusMessage}>Şablon bulunamadı.</div>;

    return (
        <>
            <Helmet>
                {/* ... (Helmet içeriği aynı) ... */}
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
                 <p className={styles.price}>
                     {template.price > 0 ? `Normal Fiyat: ${template.price} TRY` : 'Bu şablon ücretsizdir.'}
                     <span className={styles.betaNote}> (Beta süresince tüm şablonlar ücretsizdir)</span>
                 </p>

                {/* Belge Formu ve Önizleme */}
                <div className={styles.editorContainer}>
                    <div className={styles.formColumn}>
                        {/* ... (DocumentForm aynı) ... */}
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
                        {/* ... (DocumentPreview aynı) ... */}
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

                {/* --- YENİ: Fatura Bilgileri Alanı (Aç/Kapa Butonlu) --- */}
                <div className={styles.billingToggleSection}>
                     {/* --- YENİ: Beta Notu --- */}
                     <p className={styles.billingBetaNotice}>
                        ℹ️ Beta sürecinde olduğumuz için şu an fatura bilgisi girmeniz gerekmemektedir. 
                     </p>
                     {/* --- YENİ SON --- */}

                     {/* Fatura Gerekliyse Bilgilendirme (Beta notu varken gereksiz) */}
                     {/* {isBillingRequired && !isBillingInfoSaved && (
                         <p className={styles.billingRequiredNotice}>
                             ⚠️ Devam etmek için fatura bilgilerinizi girmeniz gerekmektedir.
                         </p>
                     )} */}

                    <button onClick={toggleBillingForm} className={styles.toggleBillingButton}>
                        {showBillingForm ? 'Fatura Bilgilerini Gizle' : 'Fatura Bilgilerini Göster/Düzenle'}
                        {/* Kaydedildi göstergesi kalabilir */}
                        {isBillingInfoSaved && !showBillingForm && <span className={styles.savedIndicator}> (Kaydedildi ✓)</span>}
                    </button>
                </div>

                {/* Fatura Formu Container (showBillingForm true ise görünür) */}
                {showBillingForm && (
                    <div className={styles.billingFormContainer}>
                        <h3 className={styles.billingTitle}>Fatura Bilgileri</h3>
                        <p className={styles.billingDesc}>Lütfen yasal faturanızın düzenlenebilmesi için gerekli bilgileri girin.</p>
                        <form onSubmit={handleSaveBillingInfo} noValidate>
                             {/* Fatura Tipi Seçimi */}
                             <div className={styles.billingRadioGroup}>
                                 {/* ... (Radio butonlar aynı) ... */}
                                 <label>
                                    <input type="radio" value="bireysel" checked={billingType === 'bireysel'} onChange={handleBillingTypeChange} name="billingType" /> Bireysel
                                 </label>
                                 <label>
                                     <input type="radio" value="kurumsal" checked={billingType === 'kurumsal'} onChange={handleBillingTypeChange} name="billingType" /> Kurumsal
                                 </label>
                             </div>

                            {/* Bireysel/Kurumsal Alanlar */}
                             {billingType === 'bireysel' ? (
                                 <>
                                     <div className={styles.billingInputGroup}>
                                         <label htmlFor="billingName">Ad Soyad *</label>
                                         <input type="text" id="billingName" name="name" value={billingInfo.name} onChange={handleBillingInputChange} required />
                                         {billingErrors.name && <span className={styles.billingErrorText}>{billingErrors.name}</span>}
                                     </div>
                                     <div className={styles.billingInputGroup}>
                                         <label htmlFor="billingTckn">TC Kimlik Numarası *</label>
                                         <input type="text" id="billingTckn" name="tckn" value={billingInfo.tckn} onChange={handleBillingInputChange} maxLength="11" pattern="[0-9]*" inputMode='numeric' required />
                                         {billingErrors.tckn && <span className={styles.billingErrorText}>{billingErrors.tckn}</span>}
                                     </div>
                                 </>
                             ) : (
                                <>
                                    <div className={styles.billingInputGroup}>
                                        <label htmlFor="billingCompanyName">Şirket Unvanı *</label>
                                        <input type="text" id="billingCompanyName" name="companyName" value={billingInfo.companyName} onChange={handleBillingInputChange} required />
                                        {billingErrors.companyName && <span className={styles.billingErrorText}>{billingErrors.companyName}</span>}
                                    </div>
                                    <div className={styles.billingInputGroup}>
                                        <label htmlFor="billingTaxOffice">Vergi Dairesi *</label>
                                        <input type="text" id="billingTaxOffice" name="taxOffice" value={billingInfo.taxOffice} onChange={handleBillingInputChange} required />
                                        {billingErrors.taxOffice && <span className={styles.billingErrorText}>{billingErrors.taxOffice}</span>}
                                    </div>
                                    <div className={styles.billingInputGroup}>
                                        <label htmlFor="billingVkn">Vergi Kimlik Numarası (VKN) *</label>
                                        <input type="text" id="billingVkn" name="vkn" value={billingInfo.vkn} onChange={handleBillingInputChange} maxLength="10" pattern="[0-9]*" inputMode='numeric' required />
                                        {billingErrors.vkn && <span className={styles.billingErrorText}>{billingErrors.vkn}</span>}
                                    </div>
                                </>
                             )}

                            {/* Ortak Alanlar (Adres, E-posta) */}
                             <div className={styles.billingInputGroup}>
                                 <label htmlFor="billingAddress">Fatura Adresi *</label>
                                 <textarea id="billingAddress" name="address" value={billingInfo.address} onChange={handleBillingInputChange} rows="3" required />
                                 {billingErrors.address && <span className={styles.billingErrorText}>{billingErrors.address}</span>}
                             </div>
                              <div className={styles.billingInputGroup}>
                                 <label htmlFor="billingEmail">Fatura E-postası *</label>
                                 <input type="email" id="billingEmail" name="email" value={billingInfo.email} onChange={handleBillingInputChange} required />
                                 {billingErrors.email && <span className={styles.billingErrorText}>{billingErrors.email}</span>}
                             </div>

                            {/* Kaydet Butonu ve Başarı Mesajı */}
                             <button type="submit" className={styles.saveBillingButton}>
                                 Fatura Bilgilerini Kaydet
                             </button>
                             {billingSaveSuccess && (
                                 <p className={styles.billingSuccessMessage}>
                                     ✅ Fatura bilgileri başarıyla kaydedildi.
                                 </p>
                             )}
                        </form>
                    </div>
                )}
                 {/* --- YENİ SON --- */}

                {/* Onay ve İndirme/Ödeme Butonu Alanı */}
                <div className={styles.paymentSection}>
                    {/* ... (Checkbox kısmı aynı) ... */}
                     <div className={styles.termsCheckboxContainer}>
                        <input
                            type="checkbox"
                            id="termsCheckbox"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            className={styles.checkboxInput}
                        />
                         <label htmlFor="termsCheckbox" className={styles.termsLabel}>
                             <Link to="/on-bilgilendirme-formu" target="_blank" rel="noopener noreferrer" className={styles.termsLink}>Ön Bilgilendirme Formu</Link>'nu
                             ve <Link to="/kullanim-sartlari" target="_blank" rel="noopener noreferrer" className={styles.termsLink}>Mesafeli Satış Sözleşmesi</Link>'ni
                             okudum, anladım ve kabul ediyorum.
                         </label>
                    </div>

                    {/* Genel Hata Mesajı Alanı */}
                    {paymentError && <p className={styles.paymentError}>{paymentError}</p>}

                    {/* Ana İndirme/Ödeme Butonu */}
                    <button
                        onClick={handlePayAndDownload}
                        // Butonun aktifliği: Şartlar kabul edilmiş OLMALI VE (Fatura zorunlu DEĞİLSE VEYA (zorunlu VE kaydedilmişse))
                        disabled={loadingPayment || !agreedToTerms || (isBillingRequired && !isBillingInfoSaved)}
                        className={`${styles.payDownloadButton} ${(!agreedToTerms || (isBillingRequired && !isBillingInfoSaved)) ? styles.disabledButton : ''}`}
                    >
                        {loadingPayment ? 'İşleniyor...' : `Ücretsiz İndir ve E-posta Gönder`}
                    </button>

                    {/* İndirme Başarı Mesajı */}
                    {showSuccessMessage && (
                        <p className={styles.successMessage}>
                            ✅ PDF başarıyla oluşturuldu ve indiriliyor. Bir kopya da e-posta adresinize gönderiliyor...
                        </p>
                    )}
                     {/* Eski Hata Mesajı Alanı Kaldırıldı (Yukarıya taşındı) */}
                </div>
            </div>
        </>
    );
}

export default TemplateDetail;
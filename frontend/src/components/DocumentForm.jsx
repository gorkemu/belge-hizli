import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import styles from './DocumentForm.module.css';

const DocumentForm = forwardRef(({ templateFields, onChange, onPaymentSuccess, onPaymentError }, ref) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formValues, setFormValues] = useState({
        kiralanan_adres: '',
        kira_suresi_secimi: 'Belirli bir tarihe kadar yaşayacaktır',
        sozlesme_baslangic_tarihi: '',
        sozlesme_bitis_tarihi: '',
        kiralayan_sayisi: '1',
        kiraci_sayisi: '1',
        aylik_kira_bedeli: '',
        kira_iban: '',
        kira_odeme_donemi: 'aylık',
        kapora: 'hayir',
        depozito: 'hayir',
        evcil_hayvan_yasagi: 'evet',
        kefil_gerekli: 'evet',
        belge_email: ''
    });
    const [errors, setErrors] = useState({});
    const kiralayanSayisi = Math.max(0, Math.min(parseInt(formValues['kiralayan_sayisi'] || '1', 10), 100));
    const kiraciSayisi = Math.max(0, Math.min(parseInt(formValues['kiraci_sayisi'] || '1', 10), 100));

    useEffect(() => {
        onChange(formValues, errors);
    }, [formValues, errors, onChange]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues(prevValues => ({ ...prevValues, [name]: value }));
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    };

    useImperativeHandle(ref, () => ({
        handleSubmit: validateForm
    }));

    const validateForm = () => {
        const validationErrors = {};
        let isValid = true;

        templateFields.forEach(field => {
            if (field.required && !formValues[field.name]) {
                validationErrors[field.name] = `${field.label} alanı zorunludur.`;
                isValid = false;
            }
        });

        if (!formValues['sozlesme_baslangic_tarihi']) {
            validationErrors['sozlesme_baslangic_tarihi'] = 'Kira Sözleşmesinin Başlangıç Tarihi alanı zorunludur.';
            isValid = false;
        }

        for (let i = 0; i < kiralayanSayisi; i++) {
            if (!formValues[`kiralayan_adi_soyadi_${i}`]) {
                validationErrors[`kiralayan_adi_soyadi_${i}`] = `Kiralayan ${i + 1} Adı Soyadı zorunludur.`;
                isValid = false;
            }
            if (!formValues[`kiralayan_adres_${i}`]) {
                validationErrors[`kiralayan_adres_${i}`] = `Kiralayan ${i + 1} Adresi zorunludur.`;
                isValid = false;
            }
        }

        for (let i = 0; i < kiraciSayisi; i++) {
            if (!formValues[`kiraci_adi_soyadi_${i}`]) {
                validationErrors[`kiraci_adi_soyadi_${i}`] = `Kiracı ${i + 1} Adı Soyadı zorunludur.`;
                isValid = false;
            }
            if (!formValues[`kiraci_adres_${i}`]) {
                validationErrors[`kiraci_adres_${i}`] = `Kiracı ${i + 1} Adresi zorunludur.`;
                isValid = false;
            }
        }

        setErrors(validationErrors);
        onChange(formValues, validationErrors);
        return isValid;
    };

    const renderInputField = (field) => {
        const error = errors[field.name];
        const inputClass = error ? `${styles.input} ${styles.inputError}` : styles.input;
        const placeholderText = field.placeholder || field.label;

        switch (field.fieldType) {
            case 'text':
                return <input type="text" id={field.name} name={field.name} className={inputClass} onChange={handleInputChange} placeholder={placeholderText} value={formValues[field.name] || ''} />;
            case 'number':
                return <input type="number" id={field.name} name={field.name} className={inputClass} onChange={handleInputChange} placeholder={placeholderText} value={formValues[field.name] || ''} />;
            case 'date':
                return <input type="date" id={field.name} name={field.name} className={inputClass} onChange={handleInputChange} placeholder={placeholderText} value={formValues[field.name] || ''} />;
            case 'select':
                return (
                    <select id={field.name} name={field.name} className={error ? `${styles.select} ${styles.inputError}` : styles.select} onChange={handleInputChange} value={formValues[field.name] || ''}>
                        {field.options && field.options.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                );
            case 'radio':
                return (
                    <div className={styles.radioGroup}>
                        {field.options.map(option => (
                            <div key={option} className={styles.radioContainer}>
                                <input
                                    type="radio"
                                    id={`<span class="math-inline">\{field\.name\}\-</span>{option.toLowerCase().replace(/ /g, '_')}`}
                                    name={field.name}
                                    value={option}
                                    checked={formValues[field.name] === option}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor={`<span class="math-inline">\{field\.name\}\-</span>{option.toLowerCase().replace(/ /g, '_')}`}>{option}</label>
                            </div>
                        ))}
                        {error && <p className={styles.errorMessage}>{error}</p>}
                    </div>
                );
            case 'email':
                return <input type="email" id={field.name} name={field.name} className={inputClass} onChange={handleInputChange} placeholder={placeholderText} value={formValues[field.name] || ''} />;
            default:
                return <input type="text" className={styles.input} placeholder={placeholderText} />;
        }
    };

    const nextStep = () => {
        setCurrentStep(prevStep => prevStep + 1);
    };

    const prevStep = () => {
        setCurrentStep(prevStep => prevStep - 1);
    };

    const handlePayAndDownload = async () => {
        if (validateForm()) {
            const templateId = 'YOUR_TEMPLATE_ID'; // Gerçek template ID'nizi buraya ekleyin
            const paymentData = {
                formData: formValues,
                amount: 10, // Örnek ücret
                currency: 'TRY',
                email: formValues.belge_email,
            };

            try {
                const response = await fetch(`/api/templates/${templateId}/process-payment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(paymentData),
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'kira_sozlesmesi.pdf';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    if (onPaymentSuccess) {
                        onPaymentSuccess();
                    }
                } else {
                    console.error('Ödeme işlemi başarısız oldu.');
                    if (onPaymentError) {
                        onPaymentError('Ödeme işlemi başarısız oldu.');
                    }
                }
            } catch (error) {
                console.error('Ödeme sırasında bir hata oluştu:', error);
                if (onPaymentError) {
                    onPaymentError('Ödeme sırasında bir hata oluştu.');
                }
            }
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        {/* Adım 1 içeriği */}
                        <div className={styles.formGroup}>
                            <label htmlFor="kiralanan_adres" className={styles.label}>Kiralanan Mülkün Adresi</label>
                            {renderInputField(templateFields.find(f => f.name === 'kiralanan_adres'))}
                            {errors['kiralanan_adres'] && <p className={styles.errorMessage}>{errors['kiralanan_adres']}</p>}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="kira_suresi_secimi" className={styles.label}>Kira Süresi</label>
                            {renderInputField(templateFields.find(f => f.name === 'kira_suresi_secimi'))}
                            {errors['kira_suresi_secimi'] && <p className={styles.errorMessage}>{errors['kira_suresi_secimi']}</p>}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="sozlesme_baslangic_tarihi" className={styles.label}>Kira Sözleşmesinin Başlangıç Tarihi</label>
                            {renderInputField(templateFields.find(f => f.name === 'sozlesme_baslangic_tarihi'))}
                            {errors['sozlesme_baslangic_tarihi'] && <p className={styles.errorMessage}>{errors['sozlesme_baslangic_tarihi']}</p>}
                        </div>
                        {formValues.kira_suresi_secimi === 'Belirli bir tarihe kadar yaşayacaktır' && (
                            <div className={styles.formGroup}>
                                <label htmlFor="sozlesme_bitis_tarihi" className={styles.label}>Kira Sözleşmesinin Sona Erme Tarihi</label>
                                {renderInputField(templateFields.find(f => f.name === 'sozlesme_bitis_tarihi'))}
                                {errors['sozlesme_bitis_tarihi'] && <p className={styles.errorMessage}>{errors['sozlesme_bitis_tarihi']}</p>}
                            </div>
                        )}
                    </>
                );
            case 2:
                return (
                    <>
                        {/* Adım 2 içeriği */}
                        <div className={styles.formGroup}>
                            <label htmlFor="kiralayan_sayisi" className={styles.label}>Kiralayan Sayısı</label>
                            {renderInputField(templateFields.find(f => f.name === 'kiralayan_sayisi'))}
                            {errors['kiralayan_sayisi'] && <p className={styles.errorMessage}>{errors['kiralayan_sayisi']}</p>}
                        </div>
                        {Array.from({ length: kiralayanSayisi }, (_, index) => (
                            <div key={`kiralayan_${index}`} className={styles.dynamicGroup}>
                                <h4>Kiralayan {index + 1}</h4>
                                <div className={styles.formGroup}>
                                    <label htmlFor={`kiralayan_adi_soyadi_${index}`} className={styles.label}>Kiralayan {index + 1} Adı Soyadı</label>
                                    <input
                                        type="text"
                                        id={`kiralayan_adi_soyadi_${index}`}
                                        name={`kiralayan_adi_soyadi_${index}`}
                                        className={errors[`kiralayan_adi_soyadi_${index}`] ? `${styles.input} ${styles.inputError}` : styles.input}
                                        onChange={handleInputChange}
                                        placeholder="Örn: Ad Soyad"
                                        value={formValues[`kiralayan_adi_soyadi_${index}`] || ''}
                                    />
                                    {errors[`kiralayan_adi_soyadi_${index}`] && <p className={styles.errorMessage}>{errors[`kiralayan_adi_soyadi_${index}`]}</p>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor={`kiralayan_adres_${index}`} className={styles.label}>Kiralayan {index + 1} Adresi</label>
                                    <input
                                        type="text"
                                        id={`kiralayan_adres_${index}`}
                                        name={`kiralayan_adres_${index}`}
                                        className={errors[`kiralayan_adres_${index}`] ? `${styles.input} ${styles.inputError}` : styles.input}
                                        onChange={handleInputChange}
                                        placeholder="Örn: Açık Adres"
                                        value={formValues[`kiralayan_adres_${index}`] || ''}
                                    />
                                    {errors[`kiralayan_adres_${index}`] && <p className={styles.errorMessage}>{errors[`kiralayan_adres_${index}`]}</p>}
                                </div>
                            </div>
                        ))}
                        <div className={styles.formGroup}>
                            <label htmlFor="kiraci_sayisi" className={styles.label}>Kiracı Sayısı</label>
                            {renderInputField(templateFields.find(f => f.name === 'kiraci_sayisi'))}
                            {errors['kiraci_sayisi'] && <p className={styles.errorMessage}>{errors['kiraci_sayisi']}</p>}
                        </div>
                        {Array.from({ length: kiraciSayisi }, (_, index) => (
                            <div key={`kiraci_${index}`} className={styles.dynamicGroup}>
                                <h4>Kiracı {index + 1}</h4>
                                <div className={styles.formGroup}>
                                    <label htmlFor={`kiraci_adi_soyadi_${index}`} className={styles.label}>Kiracı {index + 1} Adı Soyadı</label>
                                    <input
                                        type="text"
                                        id={`kiraci_adi_soyadi_${index}`}
                                        name={`kiraci_adi_soyadi_${index}`}
                                        className={errors[`kiraci_adi_soyadi_${index}`] ? `${styles.input} ${styles.inputError}` : styles.input}
                                        onChange={handleInputChange}
                                        placeholder="Örn: Mehmet Türkoğlu"
                                        value={formValues[`kiraci_adi_soyadi_${index}`] || ''}
                                    />
                                    {errors[`kiraci_adi_soyadi_${index}`] && <p className={styles.errorMessage}>{errors[`kiraci_adi_soyadi_${index}`]}</p>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor={`kiraci_adres_${index}`} className={styles.label}>Kiracı {index + 1} Adresi</label>
                                    <input
                                        type="text"
                                        id={`kiraci_adres_${index}`}
                                        name={`kiraci_adres_${index}`}
                                        className={errors[`kiraci_adres_${index}`] ? `${styles.input} ${styles.inputError}` : styles.input}
                                        onChange={handleInputChange}
                                        placeholder="Örn: Milliyet Mah. Devrim Sok. 3/10 Eyüp/İstanbul"
                                        value={formValues[`kiraci_adres_${index}`] || ''}
                                    />
                                    {errors[`kiraci_adres_${index}`] && <p className={styles.errorMessage}>{errors[`kiraci_adres_${index}`]}</p>}
                                </div>
                            </div>
                        ))}
                        <div className={styles.formGroup}>
                            <label htmlFor="aylik_kira_bedeli" className={styles.label}>Aylık Kira Bedeli</label>
                            {renderInputField(templateFields.find(f => f.name === 'aylik_kira_bedeli'))}
                            {errors['aylik_kira_bedeli'] && <p className={styles.errorMessage}>{errors['aylik_kira_bedeli']}</p>}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="kira_iban" className={styles.label}>Kira IBAN</label>
                            {renderInputField(templateFields.find(f => f.name === 'kira_iban'))}
                            {errors['kira_iban'] && <p className={styles.errorMessage}>{errors['kira_iban']}</p>}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="kira_odeme_donemi" className={styles.label}>Kira Ödeme Dönemi</label>
                            {renderInputField(templateFields.find(f => f.name === 'kira_odeme_donemi'))}
                            {errors['kira_odeme_donemi'] && <p className={styles.errorMessage}>{errors['kira_odeme_donemi']}</p>}
                        </div>
                        </>
                );
            case 3:
                return (
                    <>
                        {/* Adım 3 içeriği */}
                        <div className={styles.formGroup}>
                            <label htmlFor="kapora" className={styles.label}>Kapora</label>
                            {renderInputField(templateFields.find(f => f.name === 'kapora'))}
                            {errors['kapora'] && <p className={styles.errorMessage}>{errors['kapora']}</p>}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="depozito" className={styles.label}>Depozito</label>
                            {renderInputField(templateFields.find(f => f.name === 'depozito'))}
                            {errors['depozito'] && <p className={styles.errorMessage}>{errors['depozito']}</p>}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="evcil_hayvan_yasagi" className={styles.label}>Evcil Hayvan Yasağı</label>
                            {renderInputField(templateFields.find(f => f.name === 'evcil_hayvan_yasagi'))}
                            {errors['evcil_hayvan_yasagi'] && <p className={styles.errorMessage}>{errors['evcil_hayvan_yasagi']}</p>}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="kefil_gerekli" className={styles.label}>Kefil</label>
                            {renderInputField(templateFields.find(f => f.name === 'kefil_gerekli'))}
                            {errors['kefil_gerekli'] && <p className={styles.errorMessage}>{errors['kefil_gerekli']}</p>}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="belge_email" className={styles.label}>E-posta Adresi (Belgenin Gönderileceği)</label>
                            {renderInputField(templateFields.find(f => f.name === 'belge_email'))}
                            {errors['belge_email'] && <p className={styles.errorMessage}>{errors['belge_email']}</p>}
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.container}>
            <h3>Formu Doldurun</h3>
            <div className={styles.stepIndicator}>
                Adım {currentStep} / 3
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
                {renderStepContent()}
                <div className={styles.buttonGroup}>
                    {currentStep > 1 && (
                        <button type="button" onClick={prevStep} className={styles.prevButton}>
                            Önceki
                        </button>
                    )}
                    {currentStep < 3 ? (
                        <button type="button" onClick={nextStep} className={styles.nextButton}>
                            Sonraki
                        </button>
                    ) : (
                        <button type="button" onClick={handlePayAndDownload} className={styles.payDownloadButton}>
                            Öde ve İndir
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
});

export default DocumentForm;
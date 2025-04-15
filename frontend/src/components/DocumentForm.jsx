import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import styles from './DocumentForm.module.css';

const DocumentForm = forwardRef(({ templateFields, onChange }, ref) => {
    const [formValues, setFormValues] = useState({});
    const [errors, setErrors] = useState({});

    // Başlangıç değerlerini ayarla (varsa) ve state'i initialize et
    useEffect(() => {
        const initialValues = {};
        if (templateFields && Array.isArray(templateFields)) {
             templateFields.forEach(field => {
                // Varsayılan değerleri ayarla (örn: select için ilk option, radio için varsayılan?)
                // Şimdilik boş bırakıyoruz, gerekirse eklenebilir.
                initialValues[field.name] = '';
            });
        }
        setFormValues(initialValues);
        setErrors({}); // Hataları sıfırla
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [templateFields]); // Sadece templateFields değiştiğinde çalışsın

    // Form değerleri veya hatalar değiştiğinde üst bileşeni bilgilendir
    useEffect(() => {
        if (onChange) {
            onChange(formValues, errors);
        }
    }, [formValues, errors, onChange]);

    // Input değişikliklerini işle
    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        const newValue = type === 'checkbox' ? checked : value; // Checkbox için 'checked' kullanılır

        setFormValues(prevValues => ({
            ...prevValues,
            [name]: newValue
        }));

        // Hata varsa temizle
        if (errors[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: ''
            }));
        }
    };

    // Dışarıdan form doğrulamasını tetiklemek için kullanılır (TemplateDetail'deki Pay butonundan)
    useImperativeHandle(ref, () => ({
        handleSubmit: validateForm
    }));

    // Formu doğrula
    const validateForm = () => {
        const validationErrors = {};
        let isValid = true;

        if (!templateFields || !Array.isArray(templateFields)) {
             console.error("templateFields prop'u eksik veya geçersiz.");
             return false; // Alanlar olmadan doğrulama yapılamaz
        }


        templateFields.forEach(field => {
            // Zorunluluk kontrolü
            if (field.required) {
                const value = formValues[field.name];
                 // Değerin boş veya tanımsız olup olmadığını kontrol et
                if (value === undefined || value === null || String(value).trim() === '') {
                     validationErrors[field.name] = `${field.label || field.name} alanı zorunludur.`;
                    isValid = false;
                }
            }

            // Ekstra doğrulamalar (örn: email formatı, sayı aralığı) buraya eklenebilir
            if (field.fieldType === 'email' && formValues[field.name] && !/\S+@\S+\.\S+/.test(formValues[field.name])) {
                validationErrors[field.name] = `${field.label || field.name} geçerli bir e-posta adresi olmalıdır.`;
                isValid = false;
            }
             if (field.fieldType === 'number' && formValues[field.name] && isNaN(Number(formValues[field.name]))) {
                 validationErrors[field.name] = `${field.label || field.name} bir sayı olmalıdır.`;
                isValid = false;
            }

        });

        setErrors(validationErrors);
        // Hata durumunu onChange ile de gönderelim (opsiyonel ama faydalı olabilir)
        if (onChange) {
            onChange(formValues, validationErrors);
        }
        return isValid;
    };

    // Alan tipine göre uygun input elemanını render et
    const renderInputField = (field) => {
        if (!field || !field.name) return null; // Geçersiz alanları atla

        const error = errors[field.name];
        const inputClass = error ? `${styles.input} ${styles.inputError}` : styles.input;
        const selectClass = error ? `${styles.select} ${styles.inputError}` : styles.select;
        const textareaClass = error ? `${styles.textarea} ${styles.inputError}` : styles.textarea;
        const placeholderText = field.placeholder || field.label || ''; // Placeholder veya label kullan

        switch (field.fieldType) {
            case 'text':
            case 'number':
            case 'date':
            case 'email': // Email de input type kullanır
                return <input
                           type={field.fieldType === 'email' ? 'email' : (field.fieldType === 'number' ? 'number' : (field.fieldType === 'date' ? 'date' : 'text'))}
                           id={field.name}
                           name={field.name}
                           className={inputClass}
                           onChange={handleInputChange}
                           placeholder={placeholderText}
                           value={formValues[field.name] || ''}
                       />;
            case 'textarea':
                 return <textarea
                            id={field.name}
                            name={field.name}
                            className={textareaClass}
                            onChange={handleInputChange}
                            placeholder={placeholderText}
                            value={formValues[field.name] || ''}
                            rows={field.rows || 3} // Opsiyonel satır sayısı
                        />;
            case 'select':
                return (
                    <select
                        id={field.name}
                        name={field.name}
                        className={selectClass}
                        onChange={handleInputChange}
                        value={formValues[field.name] || ''}
                    >
                        <option value="">{placeholderText || 'Seçiniz...'}</option> {/* Default boş seçenek */}
                        {field.options && field.options.map((option, index) => (
                             // option bir string ise doğrudan kullan, obje ise value ve label bekleyebiliriz
                             typeof option === 'string' ?
                                <option key={`${field.name}-opt-${index}`} value={option}>{option}</option> :
                                <option key={`${field.name}-opt-${index}`} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                );
            case 'radio':
                return (
                    <div className={styles.radioGroup}>
                        {field.options && field.options.map((option, index) => {
                            const optionValue = typeof option === 'string' ? option : option.value;
                            const optionLabel = typeof option === 'string' ? option : option.label;
                            const inputId = `${field.name}-opt-${index}`; // Benzersiz ID
                            return (
                                <div key={inputId} className={styles.radioContainer}>
                                    <input
                                        type="radio"
                                        id={inputId}
                                        name={field.name}
                                        value={optionValue}
                                        checked={String(formValues[field.name]) === String(optionValue)} // String karşılaştırması önemli
                                        onChange={handleInputChange}
                                        className={styles.radioInput}
                                    />
                                    <label htmlFor={inputId} className={styles.radioLabel}>{optionLabel}</label>
                                </div>
                            );
                         })}
                         {/* Genel hata mesajı radio grubu altına eklenebilir */}
                         {/* {error && <p className={styles.errorMessage}>{error}</p>} */}
                    </div>
                );
            // case 'checkbox': // Gerekirse checkbox desteği eklenebilir
            //     return (
            //         <div className={styles.checkboxContainer}>
            //             <input
            //                 type="checkbox"
            //                 id={field.name}
            //                 name={field.name}
            //                 checked={!!formValues[field.name]} // Boolean değere çevir
            //                 onChange={handleInputChange}
            //                 className={styles.checkboxInput}
            //             />
            //             <label htmlFor={field.name} className={styles.checkboxLabel}>{field.label}</label>
            //             {/* Checkbox için hata mesajı burada veya formGroup içinde olabilir */}
            //             {error && <p className={styles.errorMessage}>{error}</p>}
            //         </div>
            //     );
            default:
                console.warn(`Bilinmeyen fieldType: ${field.fieldType} (alan: ${field.name})`);
                return <input type="text" id={field.name} name={field.name} className={inputClass} onChange={handleInputChange} placeholder={`Desteklenmeyen Tip: ${field.fieldType}`} value={formValues[field.name] || ''} />;
        }
    };

    // Eğer templateFields yüklenmediyse veya boşsa gösterilecek mesaj
     if (!templateFields || templateFields.length === 0) {
         return <div className={styles.container}>Form alanları yükleniyor veya bu şablon için tanımlanmamış...</div>;
    }

    return (
        <div className={styles.container}>
            <h3>Formu Doldurun</h3>
            {/* Adımlar kaldırıldı, tüm alanlar tek seferde gösteriliyor */}
            <form onSubmit={(e) => e.preventDefault()} className={styles.dynamicForm}>
                {templateFields.map((field) => (
                     // Koşullu alanlar için temel mantık (opsiyonel, daha karmaşık hale getirilebilir)
                     // Örneğin: field.condition = { field: 'alan_adi', value: 'gerekli_deger' }
                     (!field.condition || formValues[field.condition.field] === field.condition.value) && (
                        <div key={field.name} className={styles.formGroup}>
                             {/* Checkbox tipi için label'ı input'tan sonra gösterme */}
                             {field.fieldType !== 'checkbox' && (
                                <label htmlFor={field.name} className={styles.label}>
                                    {field.label || field.name}
                                    {field.required && <span className={styles.requiredIndicator}>*</span>}
                                </label>
                             )}
                            {renderInputField(field)}
                             {/* Hata mesajını input'un altında göster */}
                             {errors[field.name] && <p className={styles.errorMessage}>{errors[field.name]}</p>}
                        </div>
                    )
                ))}
                {/* Ödeme/İndirme butonu artık TemplateDetail içinde, buradaki butonlar kaldırıldı */}
                 {/*
                 <div className={styles.buttonGroup}>
                     <button type="button" onClick={validateForm} className={styles.payDownloadButton}>
                         Doğrula (Test)
                     </button>
                 </div>
                 */}
            </form>
        </div>
    );
});

export default DocumentForm;
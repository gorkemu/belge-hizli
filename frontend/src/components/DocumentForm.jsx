import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import styles from './DocumentForm.module.css';

const DocumentForm = forwardRef(({ templateFields, onChange }, ref) => {
    const [formValues, setFormValues] = useState({});
    const [errors, setErrors] = useState({});

    // Helper function to check if a field should be visible based on its condition
    // Alanın koşula göre görünür olup olmadığını kontrol eden yardımcı fonksiyon
    const isFieldVisible = (field, currentFormValues) => {
        if (!field.condition) {
            return true; // Koşul yoksa her zaman görünür
        }
        const controllingFieldValue = currentFormValues[field.condition.field];
        // Şimdilik sadece 'eşitlik' kontrolü yapıyoruz (value string veya number olabilir)
        // TODO: Gelecekte operator (neq, gt, lt vb.) desteği eklenebilir
        return String(controllingFieldValue) === String(field.condition.value);
    };

    useEffect(() => {
        const initialValues = {};
        if (templateFields && Array.isArray(templateFields)) {
            templateFields.forEach(field => {
                initialValues[field.name] = ''; // Başlangıçta tüm alanları boşalt
            });
        }
        setFormValues(initialValues);
        setErrors({});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [templateFields]);

    useEffect(() => {
        if (onChange) {
            onChange(formValues, errors);
        }
    }, [formValues, errors, onChange]);

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormValues(prevValues => ({
            ...prevValues,
            [name]: newValue
        }));

        if (errors[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: ''
            }));
        }

        // --- YENİ: Koşullu Alanların Değerlerini Sıfırlama (Opsiyonel ama önerilir) ---
        // Eğer değişen alan başka alanların görünürlüğünü kontrol ediyorsa
        // ve o alan artık görünmeyecekse, değerini ve hatasını sıfırlayalım.
        setFormValues(currentValues => {
            const updatedValues = { ...currentValues };
            templateFields.forEach(f => {
                if (f.condition && f.condition.field === name && !isFieldVisible(f, updatedValues)) {
                     // Eğer alan artık görünmüyorsa değerini sıfırla
                     if (updatedValues[f.name] !== '') {
                        updatedValues[f.name] = '';
                        // console.log(`Field ${f.name} reset due to condition change.`); // Debugging
                     }
                     // İlgili hatayı da temizle
                     if (errors[f.name]) {
                        setErrors(prevErrors => {
                            const newErrors = {...prevErrors};
                            delete newErrors[f.name];
                            return newErrors;
                        });
                    }
                }
            });
            return updatedValues;
        });
        // --- YENİ SON ---

    };

    useImperativeHandle(ref, () => ({
        handleSubmit: validateForm
    }));

    const validateForm = () => {
        const validationErrors = {};
        let isValid = true;

        if (!templateFields || !Array.isArray(templateFields)) {
            console.error("templateFields prop is missing or invalid.");
            return false;
        }

        templateFields.forEach(field => {
            // --- YENİ: Alanın görünür olup olmadığını kontrol et ---
            const visible = isFieldVisible(field, formValues);

            // Eğer alan görünür değilse, bu alan için doğrulamayı atla
            if (!visible) {
                // Gizli alanın hatasını da temizleyelim (varsa)
                 if (errors[field.name]) {
                    delete errors[field.name]; // Doğrudan state'i mutate etmiyoruz, bir sonraki setErrors'da güncellenecek
                 }
                return; // Bu alanı atla, sonraki alana geç
            }
            // --- YENİ SON ---

            // --- Mevcut Doğrulama Mantığı (Sadece görünür alanlar için çalışacak) ---
            if (field.required) {
                const value = formValues[field.name];
                if (value === undefined || value === null || String(value).trim() === '') {
                    validationErrors[field.name] = `${field.label || field.name} alanı zorunludur.`;
                    isValid = false;
                }
            }

            if (field.fieldType === 'email' && formValues[field.name] && !/\S+@\S+\.\S+/.test(formValues[field.name])) {
                validationErrors[field.name] = `${field.label || field.name} geçerli bir e-posta adresi olmalıdır.`;
                isValid = false;
            }
            if (field.fieldType === 'number' && formValues[field.name] && isNaN(Number(formValues[field.name]))) {
                validationErrors[field.name] = `${field.label || field.name} bir sayı olmalıdır.`;
                isValid = false;
            }
            // --- Mevcut Doğrulama Mantığı Sonu ---
        });

        setErrors(validationErrors);
        if (onChange) {
            onChange(formValues, validationErrors); // Hataları üst bileşene bildir
        }
        return isValid;
    };

    const renderInputField = (field) => {
        // ... (renderInputField fonksiyonunun içeriği değişmedi) ...
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
                    </div>
                );
            // Diğer tipler...
            default:
                console.warn(`Bilinmeyen fieldType: ${field.fieldType} (alan: ${field.name})`);
                return <input type="text" id={field.name} name={field.name} className={inputClass} onChange={handleInputChange} placeholder={`Desteklenmeyen Tip: ${field.fieldType}`} value={formValues[field.name] || ''} />;
        }
    };

    if (!templateFields || templateFields.length === 0) {
        return <div className={styles.container}>Form alanları yükleniyor veya bu şablon için tanımlanmamış...</div>;
    }

    return (
        <div className={styles.container}>
            <h3>Formu Doldurun</h3>
            <form onSubmit={(e) => e.preventDefault()} className={styles.dynamicForm}>
                {templateFields.map((field) => {
                    // --- YENİ: Alanın görünür olup olmadığını kontrol et ---
                    const visible = isFieldVisible(field, formValues);

                    // Eğer görünür değilse, bu alanı render etme
                    if (!visible) {
                        return null;
                    }
                    // --- YENİ SON ---

                    // --- Mevcut Render Mantığı (Sadece görünür alanlar için çalışacak) ---
                    return (
                        <div key={field.name} className={styles.formGroup}>
                            {field.fieldType !== 'checkbox' && (
                                <label htmlFor={field.name} className={styles.label}>
                                    {field.label || field.name}
                                    {field.required && <span className={styles.requiredIndicator}>*</span>}
                                </label>
                            )}
                            {renderInputField(field)}
                            {errors[field.name] && <p className={styles.errorMessage}>{errors[field.name]}</p>}
                        </div>
                    );
                    // --- Mevcut Render Mantığı Sonu ---
                })}
            </form>
        </div>
    );
});

export default DocumentForm;
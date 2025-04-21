// frontend/src/components/DocumentForm.jsx
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import styles from './DocumentForm.module.css'; // Stil dosyasını import et

const DocumentForm = forwardRef(({ templateFields, onChange }, ref) => {
    // State artık sadece düz obje değil, diziler de içerebilir
    const [formValues, setFormValues] = useState({});
    const [errors, setErrors] = useState({}); // Hatalar da benzer yapıda olabilir

    // --- Yardımcı Fonksiyonlar ---
    const isFieldVisible = (field, currentFormValues) => {
        // ... (Koşullu alan görünürlük kontrolü - önceki gibi) ...
         if (!field.condition) { return true; }
         const controllingFieldValue = currentFormValues[field.condition.field];
         return String(controllingFieldValue) === String(field.condition.value);
    };

    // Verilen alt alanlar için boş bir obje oluşturur
    const createEmptyBlock = (subfields) => {
        const block = {};
        subfields.forEach(subfield => {
            block[subfield.name] = ''; // Tüm alt alanları boş başlat
        });
        return block;
    };
    // --- Yardımcı Fonksiyonlar Sonu ---


    // --- State Başlatma (Initialize) ---
    useEffect(() => {
        const initialValues = {};
        const initialErrors = {}; // Hataları da başlatalım
        if (templateFields && Array.isArray(templateFields)) {
            templateFields.forEach(field => {
                // Eğer alan tekrarlayan blok ise
                if (field.fieldType === 'repeatable') {
                    initialValues[field.name] = []; // Boş bir dizi ile başla
                    initialErrors[field.name] = []; // Hatalar için de boş dizi
                    const minInstances = field.minInstances || 1; // Varsayılan min 1
                    for (let i = 0; i < minInstances; i++) {
                        // Minimum sayıda boş blok ekle
                        initialValues[field.name].push(createEmptyBlock(field.subfields));
                        initialErrors[field.name].push({}); // Her blok için boş hata objesi
                    }
                } else {
                    // Normal alanları boş başlat
                    initialValues[field.name] = '';
                    // initialErrors[field.name] = ''; // Hataları başlangıçta boş bırakabiliriz
                }
            });
        }
        setFormValues(initialValues);
        setErrors(initialErrors); // Hataları da state'e set et
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [templateFields]);
    // --- State Başlatma Sonu ---


    // --- Değişiklikleri Üst Bileşene Bildirme ---
    useEffect(() => {
        if (onChange) {
            onChange(formValues, errors);
        }
    }, [formValues, errors, onChange]);
    // --- Değişiklik Bildirme Sonu ---


    // --- Input Değişikliklerini İşleme (Güncellendi) ---
    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        const newValue = type === 'checkbox' ? checked : value;

        // Alan adından blok adını, index'i ve alt alan adını ayrıştır
        // Örnek name: "kiracilar[0][ad_soyad]"
        const match = name.match(/^([a-zA-Z0-9_]+)\[(\d+)\]\[([a-zA-Z0-9_]+)\]$/);

        if (match) {
            // Bu tekrarlayan bir bloğun alt alanı
            const blockName = match[1];
            const index = parseInt(match[2], 10);
            const subfieldName = match[3];

            setFormValues(prevValues => {
                // İlgili bloğun dizisini kopyala
                const newBlockArray = [...(prevValues[blockName] || [])];
                // Dizideki doğru index'teki objeyi bul ve kopyala
                const updatedBlock = { ...(newBlockArray[index] || {}) };
                // Alt alanın değerini güncelle
                updatedBlock[subfieldName] = newValue;
                // Güncellenmiş objeyi dizideki yerine koy
                newBlockArray[index] = updatedBlock;
                // Ana state objesini güncelle
                return { ...prevValues, [blockName]: newBlockArray };
            });

             // --- Tekrarlayan alan için hata temizleme ---
             setErrors(prevErrors => {
                const newBlockErrors = [...(prevErrors[blockName] || [])];
                if (newBlockErrors[index] && newBlockErrors[index][subfieldName]) {
                    const updatedBlockError = { ...newBlockErrors[index] };
                    delete updatedBlockError[subfieldName]; // İlgili alt alan hatasını sil
                    newBlockErrors[index] = updatedBlockError;
                    return { ...prevErrors, [blockName]: newBlockErrors };
                }
                return prevErrors; // Hata yoksa değiştirme
            });


        } else {
            // Bu normal bir alan
            setFormValues(prevValues => ({
                ...prevValues,
                [name]: newValue
            }));

             // Normal alan için hata temizleme
             if (errors[name]) {
                setErrors(prevErrors => {
                    const newErrors = { ...prevErrors };
                    delete newErrors[name];
                    return newErrors;
                });
            }

            // Koşullu alanların değerlerini ve hatalarını sıfırlama (önceki gibi)
            setFormValues(currentValues => {
                 const updatedValues = { ...currentValues };
                 templateFields.forEach(f => {
                     if (f.condition && f.condition.field === name && !isFieldVisible(f, updatedValues)) {
                          if (updatedValues[f.name] !== '') updatedValues[f.name] = '';
                          // İlgili hatayı da temizle
                          if (errors[f.name]) {
                              setErrors(prevErrors => {
                                const newErrors = {...prevErrors};
                                delete newErrors[f.name];
                                return newErrors;
                            });
                          }
                     } else if (f.fieldType === 'repeatable' && f.condition && f.condition.field === name && !isFieldVisible(f, updatedValues)) {
                         // Eğer tekrarlayan blok gizleniyorsa, tüm bloğu temizle
                         if(updatedValues[f.name]?.length > 0) updatedValues[f.name] = [];
                         if(errors[f.name]?.length > 0) {
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
        }
    };
    // --- Input Değişiklik İşleme Sonu ---


    // --- Blok Ekleme/Silme Fonksiyonları ---
    const handleAddBlock = (blockName, subfields, maxInstances) => {
        setFormValues(prevValues => {
            const currentBlocks = prevValues[blockName] || [];
            // Maksimum limite ulaşıldıysa ekleme yapma
            if (maxInstances && currentBlocks.length >= maxInstances) {
                alert(`Maksimum ${maxInstances} adet ${blockName} ekleyebilirsiniz.`);
                return prevValues;
            }
            const newBlockArray = [...currentBlocks, createEmptyBlock(subfields)];
            return { ...prevValues, [blockName]: newBlockArray };
        });
         // Hata dizisine de boş bir obje ekle
        setErrors(prevErrors => {
             const currentErrors = prevErrors[blockName] || [];
              if (maxInstances && currentErrors.length >= maxInstances) {
                return prevErrors;
              }
             const newErrorArray = [...currentErrors, {}];
             return { ...prevErrors, [blockName]: newErrorArray };
        });
    };

    const handleRemoveBlock = (blockName, index, minInstances) => {
        setFormValues(prevValues => {
            const currentBlocks = prevValues[blockName] || [];
            // Minimum limitin altına düşülemiyorsa silme
            if (currentBlocks.length <= (minInstances || 0)) {
                 alert(`En az ${minInstances || 0} adet ${blockName} bulunmalıdır.`);
                return prevValues;
            }
            const newBlockArray = currentBlocks.filter((_, i) => i !== index);
            return { ...prevValues, [blockName]: newBlockArray };
        });
         // İlgili hatayı da hata dizisinden sil
        setErrors(prevErrors => {
            const currentErrors = prevErrors[blockName] || [];
             if (currentErrors.length <= (minInstances || 0)) {
                 return prevErrors;
             }
            const newErrorArray = currentErrors.filter((_, i) => i !== index);
             return { ...prevErrors, [blockName]: newErrorArray };
        });
    };
    // --- Blok Ekleme/Silme Sonu ---


    // --- Form Doğrulama (Güncellenecek - Şimdilik Basit) ---
    useImperativeHandle(ref, () => ({
        handleSubmit: validateForm
    }));

    const validateForm = () => {
        console.log("Validating form with values:", formValues); // Doğrulama başlangıcı log
        const newErrors = {}; // Hataları toplamak için boş obje
        let formIsValid = true;

        if (!templateFields || !Array.isArray(templateFields)) {
            console.error("templateFields prop is missing or invalid during validation.");
            return false;
        }

        templateFields.forEach(field => {
            const isVisible = isFieldVisible(field, formValues);

            // Alan görünmüyorsa doğrulamayı tamamen atla
            if (!isVisible) {
                 // Görünmeyen alan için mevcut hatayı temizle (varsa)
                 // Bu, setErrors içinde yapılacak
                 return;
            }

            // --- Normal Alan Doğrulaması ---
            if (field.fieldType !== 'repeatable') {
                let fieldError = ''; // Alan için hata mesajı
                if (field.required) {
                    const value = formValues[field.name];
                    if (value === undefined || value === null || String(value).trim() === '') {
                        fieldError = `${field.label || field.name} alanı zorunludur.`;
                        formIsValid = false;
                    }
                }
                // E-posta formatı kontrolü
                if (!fieldError && field.fieldType === 'email' && formValues[field.name] && !/\S+@\S+\.\S+/.test(formValues[field.name])) {
                    fieldError = `${field.label || field.name} geçerli bir e-posta adresi olmalıdır.`;
                    formIsValid = false;
                }
                // Sayı formatı kontrolü
                if (!fieldError && field.fieldType === 'number' && formValues[field.name] && isNaN(Number(formValues[field.name]))) {
                     fieldError = `${field.label || field.name} bir sayı olmalıdır.`;
                     formIsValid = false;
                }
                // Başka normal alan doğrulamaları buraya eklenebilir...

                if (fieldError) {
                    newErrors[field.name] = fieldError;
                }
            }
            // --- Tekrarlayan Blok Doğrulaması ---
            else {
                const blocks = formValues[field.name] || [];
                const blockErrorsArray = []; // Bu blok için hataları tutacak dizi
                let blockHasErrors = false;

                blocks.forEach((block, index) => {
                    const currentBlockErrors = {}; // Bu spesifik örnek için hatalar
                    field.subfields.forEach(subfield => {
                        // TODO: Alt alanlar için de koşul kontrolü eklenebilir
                        let subfieldError = '';
                        if (subfield.required) {
                            const subValue = block[subfield.name];
                            if (subValue === undefined || subValue === null || String(subValue).trim() === '') {
                                subfieldError = `${subfield.label || subfield.name} zorunludur.`;
                                formIsValid = false;
                                blockHasErrors = true;
                            }
                        }
                        // Başka alt alan doğrulamaları (email, number vb.) buraya eklenebilir...

                        if (subfieldError) {
                            currentBlockErrors[subfield.name] = subfieldError;
                        }
                    });
                    blockErrorsArray[index] = currentBlockErrors; // Hata objesini diziye ekle
                });

                // Eğer en az bir blokta hata varsa, ana hata objesine ekle
                if (blockHasErrors) {
                    newErrors[field.name] = blockErrorsArray;
                }
            }
        });

        console.log("Validation finished. Errors:", newErrors); // Doğrulama sonucu log
        setErrors(newErrors); // Hata state'ini güncelle
        if (onChange) {
            onChange(formValues, newErrors); // Hataları üst bileşene bildir
        }
        return formIsValid; // Formun genel geçerlilik durumunu döndür
    };
    // --- Form Doğrulama Sonu ---

    // --- Input Alanı Render Etme (Aynı kalıyor) ---
    const renderInputField = (field, blockIndex = null) => {
        // ... (renderInputField kodu önceki gibi) ...
         if (!field || !field.name) return null;
         const inputName = blockIndex !== null ? `${field.blockName}[${blockIndex}][${field.name}]` : field.name;
         const value = blockIndex !== null ? formValues[field.blockName]?.[blockIndex]?.[field.name] || '' : formValues[field.name] || '';
         // Hata objesini al (bu bir string veya obje olabilir)
         const errorData = blockIndex !== null ? errors[field.blockName]?.[blockIndex]?.[field.name] : errors[field.name];
         // Gösterilecek hata mesajı (string olmalı)
         const errorMessage = (typeof errorData === 'string') ? errorData : ''; // Sadece string hataları göster

         const inputClass = errorMessage ? `${styles.input} ${styles.inputError}` : styles.input;
         const selectClass = errorMessage ? `${styles.select} ${styles.inputError}` : styles.select;
         const textareaClass = errorMessage ? `${styles.textarea} ${styles.inputError}` : styles.textarea;
         const placeholderText = field.placeholder || field.label || '';

         switch (field.fieldType) {
             case 'text':
             case 'number':
             case 'date':
             case 'email':
                 return <input type={field.fieldType === 'email' ? 'email' : (field.fieldType === 'number' ? 'number' : (field.fieldType === 'date' ? 'date' : 'text'))} id={inputName} name={inputName} className={inputClass} onChange={handleInputChange} placeholder={placeholderText} value={value} />;
             case 'textarea':
                  return <textarea id={inputName} name={inputName} className={textareaClass} onChange={handleInputChange} placeholder={placeholderText} value={value} rows={field.rows || 3} />;
             case 'select':
                 return ( <select id={inputName} name={inputName} className={selectClass} onChange={handleInputChange} value={value}> <option value="">{placeholderText || 'Seçiniz...'}</option> {field.options && field.options.map((option, index) => ( typeof option === 'string' ? <option key={`${inputName}-opt-${index}`} value={option}>{option}</option> : <option key={`${inputName}-opt-${index}`} value={option.value}>{option.label}</option> ))} </select> );
             case 'radio':
                 return ( <div className={styles.radioGroup}> {field.options && field.options.map((option, index) => { const optionValue = typeof option === 'string' ? option : option.value; const optionLabel = typeof option === 'string' ? option : option.label; const inputId = `${inputName}-opt-${index}`; return ( <div key={inputId} className={styles.radioContainer}> <input type="radio" id={inputId} name={inputName} value={optionValue} checked={String(value) === String(optionValue)} onChange={handleInputChange} className={styles.radioInput} /> <label htmlFor={inputId} className={styles.radioLabel}>{optionLabel}</label> </div> ); })} </div> );
             default:
                  return <input type="text" id={inputName} name={inputName} className={inputClass} onChange={handleInputChange} placeholder={`Desteklenmeyen: ${field.fieldType}`} value={value} />;
         }
    };
    // --- Input Render Sonu ---


    // --- Ana Render Fonksiyonu (Güncellendi - Hata gösterimi) ---
    // ... (Başlangıç kısmı aynı) ...
    return (
        <div className={styles.container}>
            <h3>Formu Doldurun</h3>
            <form onSubmit={(e) => e.preventDefault()} className={styles.dynamicForm}>
                {templateFields.map((field) => {
                    const visible = isFieldVisible(field, formValues);
                    if (!visible) return null;

                    if (field.fieldType === 'repeatable') {
                        const blocks = formValues[field.name] || [];
                        // Hata dizisini al (blok bazında hata objeleri içerir)
                        const blockErrorsArray = errors[field.name] || [];
                        const minInstances = field.minInstances || 1;
                        const maxInstances = field.maxInstances;
                        // Silme butonu görünürlüğü GÜNCELLENDİ
                        const canRemove = blocks.length > minInstances;
                        const canAdd = !maxInstances || blocks.length < maxInstances;

                        return (
                            <div key={field.name} className={styles.repeatableBlockContainer}>
                                <label className={styles.repeatableBlockLabel}>{field.label}</label>
                                {blocks.map((blockData, index) => {
                                     // Bu spesifik blok örneği için hataları al
                                    const currentBlockErrors = blockErrorsArray[index] || {};
                                    return (
                                        <div key={`${field.name}-${index}`} className={styles.repeatableBlockInstance}>
                                            <div className={styles.blockHeader}>
                                                <h4>{field.blockTitle || 'Blok'} {index + 1}</h4>
                                                {canRemove && ( <button type="button" onClick={() => handleRemoveBlock(field.name, index, minInstances)} className={styles.removeButton}> {field.removeLabel || 'Sil'} </button> )}
                                            </div>

                                            {field.subfields.map(subfield => {
                                                // Alt alanın hatasını al
                                                const subfieldError = currentBlockErrors[subfield.name];
                                                return (
                                                    <div key={subfield.name} className={`${styles.formGroup} ${styles.subfieldGroup}`}>
                                                        <label htmlFor={`${field.name}[${index}][${subfield.name}]`} className={styles.label}>
                                                            {subfield.label || subfield.name}
                                                            {subfield.required && <span className={styles.requiredIndicator}>*</span>}
                                                        </label>
                                                        {renderInputField({ ...subfield, blockName: field.name }, index)}
                                                        {/* Alt alan hatasını göster */}
                                                        {subfieldError && <p className={styles.errorMessage}>{subfieldError}</p>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                                {canAdd && ( <button type="button" onClick={() => handleAddBlock(field.name, field.subfields, maxInstances)} className={styles.addButton}> {field.addLabel || 'Yeni Ekle'} </button> )}
                            </div>
                        );
                    }
                    else { // Normal Alan Render
                         const fieldError = errors[field.name];
                         // Hatanın string olduğundan ve obje olmadığından emin ol
                         const hasError = !!fieldError && typeof fieldError === 'string';
                        return (
                            <div key={field.name} className={styles.formGroup}>
                                {/* ... (label, input/renderInputField) ... */}
                                {renderInputField(field)}
                                {hasError && <p className={styles.errorMessage}>{fieldError}</p>}
                                {field.name === 'belge_email' && ( <small className={styles.emailInfoText}> (Oluşturulan PDF belgenizin bir kopyası bu e-posta adresine de gönderilecektir.) </small> )}
                            </div>
                        );
                    }
                })}
            </form>
        </div>
    );
    // --- Ana Render Sonu ---
});

export default DocumentForm;
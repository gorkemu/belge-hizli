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
        // TODO: Bu fonksiyon tekrarlayan blokları da içerecek şekilde güncellenmeli.
        // Şimdilik sadece normal alanları kontrol eden eski mantığı bırakıyoruz.
        // Tekrarlayan blokların doğrulaması sonraki adımda eklenecek.
        const validationErrors = {};
        let isValid = true;

        if (!templateFields || !Array.isArray(templateFields)) return false;

        templateFields.forEach(field => {
            const visible = isFieldVisible(field, formValues);
            if (!visible) return;

            // Sadece normal alanları doğrula (şimdilik)
            if (field.fieldType !== 'repeatable') {
                if (field.required) {
                    const value = formValues[field.name];
                    if (value === undefined || value === null || String(value).trim() === '') {
                        validationErrors[field.name] = `${field.label || field.name} alanı zorunludur.`;
                        isValid = false;
                    }
                }
                // ... diğer normal alan doğrulamaları ...
            } else {
                 // Tekrarlayan alanların doğrulaması buraya eklenecek
                 const blocks = formValues[field.name] || [];
                 const blockErrors = [];
                 blocks.forEach((block, index) => {
                     const currentBlockErrors = {};
                     field.subfields.forEach(subfield => {
                         // Alt alanın görünürlük koşulu varsa kontrol et (şimdilik basit tutuyoruz)
                         if (subfield.required) {
                             const subValue = block[subfield.name];
                              if (subValue === undefined || subValue === null || String(subValue).trim() === '') {
                                 currentBlockErrors[subfield.name] = `${subfield.label || subfield.name} zorunludur.`;
                                 isValid = false;
                             }
                         }
                         // ... diğer alt alan doğrulamaları ...
                     });
                      blockErrors[index] = currentBlockErrors;
                 });
                  if (blockErrors.some(err => Object.keys(err).length > 0)) { // Eğer herhangi bir blokta hata varsa
                     validationErrors[field.name] = blockErrors;
                  }
            }
        });

        setErrors(validationErrors);
        if (onChange) onChange(formValues, validationErrors);
        return isValid;
    };
    // --- Form Doğrulama Sonu ---


    // --- Input Alanı Render Etme (Güncellendi) ---
    const renderInputField = (field, blockIndex = null) => {
        if (!field || !field.name) return null;

        // Tekrarlayan blok içindeyse, name'i formatla: blockName[index][subfieldName]
        const inputName = blockIndex !== null ? `${field.blockName}[${blockIndex}][${field.name}]` : field.name;
        // Değeri alırken de doğru yerden al
        const value = blockIndex !== null
                        ? formValues[field.blockName]?.[blockIndex]?.[field.name] || ''
                        : formValues[field.name] || '';
        // Hatayı alırken de doğru yerden al
         const error = blockIndex !== null
                        ? errors[field.blockName]?.[blockIndex]?.[field.name]
                        : errors[field.name];


        const inputClass = error ? `${styles.input} ${styles.inputError}` : styles.input;
        const selectClass = error ? `${styles.select} ${styles.inputError}` : styles.select;
        const textareaClass = error ? `${styles.textarea} ${styles.inputError}` : styles.textarea;
        const placeholderText = field.placeholder || field.label || '';

        // Not: handleInputChange tüm inputlar için çalışır, çünkü name özniteliğini kullanır.
        switch (field.fieldType) {
            case 'text':
            case 'number':
            case 'date':
            case 'email':
                return <input
                           type={field.fieldType === 'email' ? 'email' : (field.fieldType === 'number' ? 'number' : (field.fieldType === 'date' ? 'date' : 'text'))}
                           id={inputName} // ID'yi de benzersiz yap
                           name={inputName} // Formatlanmış name
                           className={inputClass}
                           onChange={handleInputChange}
                           placeholder={placeholderText}
                           value={value} // Doğru yerden alınan değer
                       />;
            case 'textarea':
                 return <textarea
                            id={inputName}
                            name={inputName}
                            className={textareaClass}
                            onChange={handleInputChange}
                            placeholder={placeholderText}
                            value={value}
                            rows={field.rows || 3}
                        />;
            case 'select':
                return (
                    <select id={inputName} name={inputName} className={selectClass} onChange={handleInputChange} value={value}>
                        <option value="">{placeholderText || 'Seçiniz...'}</option>
                        {field.options && field.options.map((option, index) => (
                             typeof option === 'string' ?
                                <option key={`${inputName}-opt-${index}`} value={option}>{option}</option> :
                                <option key={`${inputName}-opt-${index}`} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                );
            case 'radio':
                return (
                    <div className={styles.radioGroup}>
                        {field.options && field.options.map((option, index) => {
                            const optionValue = typeof option === 'string' ? option : option.value;
                            const optionLabel = typeof option === 'string' ? option : option.label;
                            const inputId = `${inputName}-opt-${index}`;
                            return (
                                <div key={inputId} className={styles.radioContainer}>
                                    <input type="radio" id={inputId} name={inputName} value={optionValue}
                                        checked={String(value) === String(optionValue)}
                                        onChange={handleInputChange} className={styles.radioInput} />
                                    <label htmlFor={inputId} className={styles.radioLabel}>{optionLabel}</label>
                                </div>
                            );
                         })}
                    </div>
                );
            default:
                 return <input type="text" id={inputName} name={inputName} className={inputClass} onChange={handleInputChange} placeholder={`Desteklenmeyen: ${field.fieldType}`} value={value} />;
        }
    };
    // --- Input Render Sonu ---


    // --- Ana Render Fonksiyonu ---
    if (!templateFields || templateFields.length === 0) {
        return <div className={styles.container}>Form alanları yükleniyor...</div>;
    }

    return (
        <div className={styles.container}>
            <h3>Formu Doldurun</h3>
            <form onSubmit={(e) => e.preventDefault()} className={styles.dynamicForm}>
                {templateFields.map((field) => {
                    const visible = isFieldVisible(field, formValues);
                    if (!visible) return null;

                    // --- Tekrarlayan Blok Render ---
                    if (field.fieldType === 'repeatable') {
                        const blocks = formValues[field.name] || [];
                        const blockErrors = errors[field.name] || []; // Blok hatalarını al
                        const minInstances = field.minInstances || 1;
                        const maxInstances = field.maxInstances;
                        const canRemove = blocks.length > minInstances;
                        const canAdd = !maxInstances || blocks.length < maxInstances;

                        return (
                            <div key={field.name} className={styles.repeatableBlockContainer}>
                                <label className={styles.repeatableBlockLabel}>{field.label}</label>
                                {blocks.map((blockData, index) => (
                                    <div key={`${field.name}-${index}`} className={styles.repeatableBlockInstance}>
                                         <div className={styles.blockHeader}>
                                            <h4>{field.blockTitle || 'Blok'} {index + 1}</h4>
                                            {canRemove && (
                                                <button type="button" onClick={() => handleRemoveBlock(field.name, index, minInstances)} className={styles.removeButton}>
                                                    {field.removeLabel || 'Sil'}
                                                </button>
                                            )}
                                         </div>

                                        {field.subfields.map(subfield => {
                                             // Alt alan için görünürlük kontrolü (gerekirse eklenebilir)
                                             // const subfieldVisible = isFieldVisible(subfield, blockData);
                                             // if (!subfieldVisible) return null;

                                             // blockName'i subfield objesine geçici olarak ekleyelim ki renderInputField bilsin
                                              const subfieldWithError = errors[field.name]?.[index]?.[subfield.name];
                                              const subfieldHasError = !!subfieldWithError;


                                            return (
                                                <div key={subfield.name} className={`${styles.formGroup} ${styles.subfieldGroup}`}>
                                                    <label htmlFor={`${field.name}[${index}][${subfield.name}]`} className={styles.label}>
                                                        {subfield.label || subfield.name}
                                                        {subfield.required && <span className={styles.requiredIndicator}>*</span>}
                                                    </label>
                                                    {/* renderInputField'e blockName ve index'i de gönderelim */}
                                                    {renderInputField({ ...subfield, blockName: field.name }, index)}
                                                     {/* Alt alan hatasını göster */}
                                                     {subfieldHasError && <p className={styles.errorMessage}>{subfieldWithError}</p>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                                {canAdd && (
                                    <button type="button" onClick={() => handleAddBlock(field.name, field.subfields, maxInstances)} className={styles.addButton}>
                                        {field.addLabel || 'Yeni Ekle'}
                                    </button>
                                )}
                            </div>
                        );
                    }
                    // --- Normal Alan Render ---
                    else {
                         const fieldError = errors[field.name];
                         const hasError = !!fieldError && typeof fieldError === 'string'; // Hatanın string olduğundan emin ol
                        return (
                            <div key={field.name} className={styles.formGroup}>
                                {field.fieldType !== 'checkbox' && (
                                    <label htmlFor={field.name} className={styles.label}>
                                        {field.label || field.name}
                                        {field.required && <span className={styles.requiredIndicator}>*</span>}
                                    </label>
                                )}
                                {renderInputField(field)}
                                 {/* Normal alan hatasını göster */}
                                 {hasError && <p className={styles.errorMessage}>{fieldError}</p>}
                                 {field.name === 'belge_email' && (
            <small className={styles.emailInfoText}>
                (Oluşturulan PDF belgenizin bir kopyası bu e-posta adresine de gönderilecektir.)
            </small>
        )}
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
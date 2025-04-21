// frontend/src/components/DocumentForm.jsx
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import styles from './DocumentForm.module.css'; // Stil dosyasını import et

const DocumentForm = forwardRef(({ templateFields, onChange }, ref) => {
    const [formValues, setFormValues] = useState({});
    const [errors, setErrors] = useState({});

    // --- Yardımcı Fonksiyonlar ---
    const isFieldVisible = (field, currentFormValues) => {
         if (!field.condition) { return true; }
         const controllingFieldValue = currentFormValues[field.condition.field];
         return String(controllingFieldValue) === String(field.condition.value);
    };

    const createEmptyBlock = (subfields) => {
        const block = {};
        subfields.forEach(subfield => {
            block[subfield.name] = '';
        });
        return block;
    };
    // --- Yardımcı Fonksiyonlar Sonu ---

    // --- State Başlatma (Initialize) ---
    useEffect(() => {
        const initialValues = {};
        const initialErrors = {};
        if (templateFields && Array.isArray(templateFields)) {
            templateFields.forEach(field => {
                if (field.fieldType === 'repeatable') {
                    initialValues[field.name] = [];
                    initialErrors[field.name] = [];
                    const minInstances = field.minInstances || 1;
                    for (let i = 0; i < minInstances; i++) {
                        initialValues[field.name].push(createEmptyBlock(field.subfields));
                        initialErrors[field.name].push({});
                    }
                } else {
                    initialValues[field.name] = '';
                }
            });
        }
        setFormValues(initialValues);
        setErrors(initialErrors);
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

    // --- Input Değişikliklerini İşleme ---
    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        const newValue = type === 'checkbox' ? checked : value;
        const match = name.match(/^([a-zA-Z0-9_]+)\[(\d+)\]\[([a-zA-Z0-9_]+)\]$/);

        if (match) { // Repeatable field
            const blockName = match[1];
            const index = parseInt(match[2], 10);
            const subfieldName = match[3];
            setFormValues(prevValues => {
                const newBlockArray = [...(prevValues[blockName] || [])];
                const updatedBlock = { ...(newBlockArray[index] || {}) };
                updatedBlock[subfieldName] = newValue;
                newBlockArray[index] = updatedBlock;
                return { ...prevValues, [blockName]: newBlockArray };
            });
             setErrors(prevErrors => { // Clear specific subfield error
                const newBlockErrors = [...(prevErrors[blockName] || [])];
                if (newBlockErrors[index] && newBlockErrors[index][subfieldName]) {
                    const updatedBlockError = { ...newBlockErrors[index] };
                    delete updatedBlockError[subfieldName];
                    newBlockErrors[index] = updatedBlockError;
                    return { ...prevErrors, [blockName]: newBlockErrors };
                }
                return prevErrors;
            });
        } else { // Normal field
            setFormValues(prevValues => ({ ...prevValues, [name]: newValue }));
             if (errors[name] && typeof errors[name] === 'string') { // Clear normal field error
                setErrors(prevErrors => { const newErrors = { ...prevErrors }; delete newErrors[name]; return newErrors; });
            }
            // Clear conditional fields if controller changes
            setFormValues(currentValues => {
                 const updatedValues = { ...currentValues };
                 templateFields.forEach(f => {
                     const controllerChanged = f.condition?.field === name;
                     const fieldHidden = controllerChanged && !isFieldVisible(f, updatedValues);

                     if (fieldHidden) {
                        if (f.fieldType === 'repeatable') {
                            if(updatedValues[f.name]?.length > 0) updatedValues[f.name] = [];
                             if(errors[f.name]) { setErrors(prevErrors => { const ne = {...prevErrors}; delete ne[f.name]; return ne; }); }
                        } else {
                             if (updatedValues[f.name] !== '') updatedValues[f.name] = '';
                             if (errors[f.name]) { setErrors(prevErrors => { const ne = {...prevErrors}; delete ne[f.name]; return ne; }); }
                        }
                    }
                 });
                 return updatedValues;
             });
        }
    };
    // --- Input Değişiklik İşleme Sonu ---

    // --- Blok Ekleme/Silme Fonksiyonları ---
    const handleAddBlock = (blockName, subfields, maxInstances) => { /* ... (Kod aynı) ... */
        setFormValues(prevValues => {
            const currentBlocks = prevValues[blockName] || [];
            if (maxInstances && currentBlocks.length >= maxInstances) { alert(`Maksimum ${maxInstances} adet ${blockName} ekleyebilirsiniz.`); return prevValues; }
            const newBlockArray = [...currentBlocks, createEmptyBlock(subfields)];
            return { ...prevValues, [blockName]: newBlockArray };
        });
        setErrors(prevErrors => {
             const currentErrors = prevErrors[blockName] || [];
              if (maxInstances && currentErrors.length >= maxInstances) { return prevErrors; }
             const newErrorArray = [...currentErrors, {}];
             return { ...prevErrors, [blockName]: newErrorArray };
        });
    };
    const handleRemoveBlock = (blockName, index, minInstances) => { /* ... (Kod aynı) ... */
         setFormValues(prevValues => {
            const currentBlocks = prevValues[blockName] || [];
            if (currentBlocks.length <= (minInstances || 0)) { alert(`En az ${minInstances || 0} adet ${blockName} bulunmalıdır.`); return prevValues; }
            const newBlockArray = currentBlocks.filter((_, i) => i !== index);
            return { ...prevValues, [blockName]: newBlockArray };
        });
        setErrors(prevErrors => {
            const currentErrors = prevErrors[blockName] || [];
             if (currentErrors.length <= (minInstances || 0)) { return prevErrors; }
            const newErrorArray = currentErrors.filter((_, i) => i !== index);
             return { ...prevErrors, [blockName]: newErrorArray };
        });
    };
    // --- Blok Ekleme/Silme Sonu ---

    // --- Form Doğrulama ---
    useImperativeHandle(ref, () => ({ handleSubmit: validateForm }));
    const validateForm = () => { /* ... (Kod aynı, tekrarlayanları da içeriyor) ... */
        console.log("Validating form with values:", formValues);
        const newErrors = {};
        let formIsValid = true;
        if (!templateFields || !Array.isArray(templateFields)) return false;

        templateFields.forEach(field => {
            const isVisible = isFieldVisible(field, formValues);
            if (!isVisible) return;

            if (field.fieldType !== 'repeatable') { // Normal Alan Doğrulama
                let fieldError = '';
                if (field.required) {
                    const value = formValues[field.name];
                    if (value === undefined || value === null || String(value).trim() === '') {
                        fieldError = `${field.label || field.name} alanı zorunludur.`;
                        formIsValid = false;
                    }
                }
                if (!fieldError && field.fieldType === 'email' && formValues[field.name] && !/\S+@\S+\.\S+/.test(formValues[field.name])) { fieldError = `${field.label || field.name} geçerli bir e-posta adresi olmalıdır.`; formIsValid = false; }
                if (!fieldError && field.fieldType === 'number' && formValues[field.name] && isNaN(Number(formValues[field.name]))) { fieldError = `${field.label || field.name} bir sayı olmalıdır.`; formIsValid = false; }
                if (fieldError) { newErrors[field.name] = fieldError; }

            } else { // Tekrarlayan Blok Doğrulaması
                const blocks = formValues[field.name] || [];
                const blockErrorsArray = [];
                let blockHasErrors = false;
                blocks.forEach((block, index) => {
                    const currentBlockErrors = {};
                    field.subfields.forEach(subfield => {
                        let subfieldError = '';
                        if (subfield.required) {
                            const subValue = block[subfield.name];
                            if (subValue === undefined || subValue === null || String(subValue).trim() === '') {
                                subfieldError = `${subfield.label || subfield.name} zorunludur.`;
                                formIsValid = false;
                                blockHasErrors = true;
                            }
                        }
                        // Diğer alt alan doğrulamaları...
                        if (subfieldError) { currentBlockErrors[subfield.name] = subfieldError; }
                    });
                    blockErrorsArray[index] = currentBlockErrors;
                });
                if (blockHasErrors) { newErrors[field.name] = blockErrorsArray; }
            }
        });
        console.log("Validation finished. Errors:", newErrors);
        setErrors(newErrors);
        if (onChange) onChange(formValues, newErrors);
        return formIsValid;
     };
    // --- Form Doğrulama Sonu ---

    // --- Input Alanı Render Etme ---
    const renderInputField = (field, blockIndex = null) => { /* ... (Kod aynı) ... */
        if (!field || !field.name) return null;
        const inputName = blockIndex !== null ? `${field.blockName}[${blockIndex}][${field.name}]` : field.name;
        const value = blockIndex !== null ? formValues[field.blockName]?.[blockIndex]?.[field.name] || '' : formValues[field.name] || '';
        const errorData = blockIndex !== null ? errors[field.blockName]?.[blockIndex]?.[field.name] : errors[field.name];
        const errorMessage = (typeof errorData === 'string') ? errorData : '';

        const inputClass = errorMessage ? `${styles.input} ${styles.inputError}` : styles.input;
        const selectClass = errorMessage ? `${styles.select} ${styles.inputError}` : styles.select;
        const textareaClass = errorMessage ? `${styles.textarea} ${styles.inputError}` : styles.textarea;
        const placeholderText = field.placeholder || field.label || '';

        switch (field.fieldType) {
             case 'text': case 'number': case 'date': case 'email':
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

                    if (field.fieldType === 'repeatable') {
                        const blocks = formValues[field.name] || [];
                        const blockErrorsArray = errors[field.name] || [];
                        const minInstances = field.minInstances || 1;
                        const maxInstances = field.maxInstances;
                        const canRemove = blocks.length > minInstances;
                        const canAdd = !maxInstances || blocks.length < maxInstances;

                        return (
                            <div key={field.name} className={styles.repeatableBlockContainer}>
                                <label className={styles.repeatableBlockLabel}>{field.label}</label>
                                {blocks.map((blockData, index) => {
                                    const currentBlockErrors = blockErrorsArray[index] || {};
                                    return (
                                        <div key={`${field.name}-${index}`} className={styles.repeatableBlockInstance}>
                                            <div className={styles.blockHeader}>
                                                <h4>{field.blockTitle || 'Blok'} {index + 1}</h4>
                                                {canRemove && ( <button type="button" onClick={() => handleRemoveBlock(field.name, index, minInstances)} className={styles.removeButton}> {field.removeLabel || 'Sil'} </button> )}
                                            </div>
                                            {field.subfields.map(subfield => {
                                                const subfieldError = currentBlockErrors[subfield.name];
                                                return (
                                                    <div key={subfield.name} className={`${styles.formGroup} ${styles.subfieldGroup}`}>
                                                         {/* Subfield Label (Correctly placed) */}
                                                        <label htmlFor={`${field.name}[${index}][${subfield.name}]`} className={styles.label}>
                                                            {subfield.label || subfield.name}
                                                            {subfield.required && <span className={styles.requiredIndicator}>*</span>}
                                                        </label>
                                                        {renderInputField({ ...subfield, blockName: field.name }, index)}
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
                         const hasError = !!fieldError && typeof fieldError === 'string';
                        return (
                            <div key={field.name} className={styles.formGroup}>
                                {/* ---- NORMAL ALAN LABEL'I GERİ EKLENDİ ---- */}
                                {field.fieldType !== 'checkbox' && (
                                    <label htmlFor={field.name} className={styles.label}>
                                        {field.label || field.name}
                                        {field.required && <span className={styles.requiredIndicator}>*</span>}
                                    </label>
                                )}
                                {/* ---- LABEL SONU ---- */}
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
// frontend/src/components/DocumentForm.jsx
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { IMaskInput } from 'react-imask';
import styles from './DocumentForm.module.css';

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
        subfields.forEach(subfield => { block[subfield.name] = ''; });
        return block;
    };
    // --- Yardımcı Fonksiyonlar Sonu ---

    // --- State Başlatma ---
    useEffect(() => {
        const initialValues = {};
        const initialErrors = {};
        if (templateFields && Array.isArray(templateFields)) {
            templateFields.forEach(field => {
                if (field.fieldType === 'repeatable') {
                    initialValues[field.name] = []; initialErrors[field.name] = [];
                    const minInstances = field.minInstances || 1;
                    for (let i = 0; i < minInstances; i++) {
                        initialValues[field.name].push(createEmptyBlock(field.subfields));
                        initialErrors[field.name].push({});
                    }
                } else { initialValues[field.name] = ''; }
            });
        }
        setFormValues(initialValues); setErrors(initialErrors);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [templateFields]);
    // --- State Başlatma Sonu ---

    // --- Değişiklik Bildirme ---
    useEffect(() => { if (onChange) { onChange(formValues, errors); } }, [formValues, errors, onChange]);
    // --- Değişiklik Bildirme Sonu ---

    // --- Değeri Güncelleme ---
    const updateFormValue = (name, newValue) => {
        const match = name.match(/^([a-zA-Z0-9_]+)\[(\d+)\]\[([a-zA-Z0-9_]+)\]$/);
        if (match) { // Repeatable
            const [blockName, indexStr, subfieldName] = match.slice(1);
            const index = parseInt(indexStr, 10);
            setFormValues(prev => ({ ...prev, [blockName]: prev[blockName]?.map((item, i) => i === index ? { ...item, [subfieldName]: newValue } : item) ?? [] }));
            setErrors(prev => { // Clear subfield error
                const blockErrors = [...(prev[blockName] || [])];
                if (blockErrors[index]?.[subfieldName]) { const be = { ...blockErrors[index] }; delete be[subfieldName]; blockErrors[index] = be; return { ...prev, [blockName]: blockErrors }; }
                return prev;
            });
        } else { // Normal
            setFormValues(prev => ({ ...prev, [name]: newValue }));
            if (errors[name] && typeof errors[name] === 'string') { setErrors(prev => { const ne = { ...prev }; delete ne[name]; return ne; }); }
            // Clear conditional fields
            setFormValues(current => {
                 const updated = { ...current };
                 templateFields.forEach(f => {
                     if (f.condition?.field === name && !isFieldVisible(f, updated)) {
                         if (f.fieldType === 'repeatable') { if(updated[f.name]?.length > 0) updated[f.name] = []; if(errors[f.name]) setErrors(prev => { const ne = {...prev}; delete ne[f.name]; return ne; });}
                         else { if(updated[f.name] !== '') updated[f.name] = ''; if(errors[f.name]) setErrors(prev => { const ne = {...prev}; delete ne[f.name]; return ne; }); }
                     }
                 }); return updated; });
        }
    };
    // --- Değer Güncelleme Sonu ---

    // --- Normal Input Handler ---
    const handleInputChange = (event) => { updateFormValue(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value); };
    // --- Normal Input Handler Sonu ---

    // --- Blok Ekleme/Silme ---
    const handleAddBlock = (blockName, subfields, maxInstances) => { /* ... (Kod aynı) ... */
        setFormValues(prev => { const curr = prev[blockName] || []; if (maxInstances && curr.length >= maxInstances) { alert(`Maksimum ${maxInstances} ${blockName} ekleyebilirsiniz.`); return prev; } return { ...prev, [blockName]: [...curr, createEmptyBlock(subfields)] }; });
        setErrors(prev => { const curr = prev[blockName] || []; if (maxInstances && curr.length >= maxInstances) return prev; return { ...prev, [blockName]: [...curr, {}] }; });
    };
    const handleRemoveBlock = (blockName, index, minInstances) => { /* ... (Kod aynı) ... */
        setFormValues(prev => { const curr = prev[blockName] || []; if (curr.length <= (minInstances || 0)) { alert(`En az ${minInstances || 0} ${blockName} bulunmalıdır.`); return prev; } return { ...prev, [blockName]: curr.filter((_, i) => i !== index) }; });
        setErrors(prev => { const curr = prev[blockName] || []; if (curr.length <= (minInstances || 0)) return prev; return { ...prev, [blockName]: curr.filter((_, i) => i !== index) }; });
    };
    // --- Blok Ekleme/Silme Sonu ---

    // --- Form Doğrulama ---
    useImperativeHandle(ref, () => ({ handleSubmit: validateForm }));
    const validateForm = () => { /* ... (Kod aynı) ... */
        // console.log("Validating form with values:", formValues);
        const newErrors = {}; let formIsValid = true;
        if (!templateFields) return false;
        templateFields.forEach(field => {
            const isVisible = isFieldVisible(field, formValues); if (!isVisible) return;
            if (field.fieldType !== 'repeatable') { let fieldError = ''; if (field.required) { const v = formValues[field.name]; if (v === undefined || v === null || String(v).trim() === '') { fieldError = `${field.label || field.name} alanı zorunludur.`; formIsValid = false; } } if (!fieldError && field.fieldType === 'email' && formValues[field.name] && !/\S+@\S+\.\S+/.test(formValues[field.name])) { fieldError = `${field.label || field.name} geçerli bir e-posta adresi olmalıdır.`; formIsValid = false; } if (!fieldError && field.fieldType === 'number' && formValues[field.name] && isNaN(Number(formValues[field.name]))) { fieldError = `${field.label || field.name} bir sayı olmalıdır.`; formIsValid = false; } if (fieldError) { newErrors[field.name] = fieldError; } }
            else { const blocks = formValues[field.name] || []; const blockErrorsArray = []; let blockHasErrors = false; blocks.forEach((block, index) => { const currentBlockErrors = {}; field.subfields.forEach(subfield => { let subfieldError = ''; if (subfield.required) { const sv = block[subfield.name]; if (sv === undefined || sv === null || String(sv).trim() === '') { subfieldError = `${subfield.label || subfield.name} zorunludur.`; formIsValid = false; blockHasErrors = true; } } if (subfieldError) { currentBlockErrors[subfield.name] = subfieldError; } }); blockErrorsArray[index] = currentBlockErrors; }); if (blockHasErrors) { newErrors[field.name] = blockErrorsArray; } }
        });
        // console.log("Validation finished. Errors:", newErrors);
        setErrors(newErrors); if (onChange) onChange(formValues, newErrors); return formIsValid;
     };
    // --- Form Doğrulama Sonu ---

    // --- Input Alanı Render Etme ---
    const renderInputField = (field, blockIndex = null) => {
         if (!field || !field.name) return null;
         const inputName = blockIndex !== null ? `${field.blockName}[${blockIndex}][${field.name}]` : field.name;
         const value = blockIndex !== null ? formValues[field.blockName]?.[blockIndex]?.[field.name] || '' : formValues[field.name] || '';
         const errorData = blockIndex !== null ? errors[field.blockName]?.[blockIndex]?.[field.name] : errors[field.name];
         const errorMessage = (typeof errorData === 'string') ? errorData : '';

         const inputClass = errorMessage ? `${styles.input} ${styles.inputError}` : styles.input;
         const selectClass = errorMessage ? `${styles.select} ${styles.inputError}` : styles.select;
         const textareaClass = errorMessage ? `${styles.textarea} ${styles.inputError}` : styles.textarea;
         const placeholderText = field.placeholder || field.label || '';

         let maskOptions = null;
         let inputType = field.fieldType === 'email' ? 'email' : (field.fieldType === 'number' ? 'number' : (field.fieldType === 'date' ? 'date' : 'text'));

         // Telefon Maskesi Güncellendi
         if (field.name.toLowerCase().includes('telefon')) {
             maskOptions = { mask: '{0}(000) 000 00 00', lazy: false }; // Baştaki 0 için {0}
             inputType = 'tel';
         }
         else if (field.name.toLowerCase().includes('tc_no') || field.name.toLowerCase().includes('tc_kimlik_no')) {
             maskOptions = { mask: '00000000000' };
             inputType = 'tel';
         }
         else if (field.name.toLowerCase().includes('iban')) {
             maskOptions = { mask: 'TR00 0000 0000 0000 0000 0000 00', prepare: (str) => str.toUpperCase() };
             inputType = 'text';
         }

         switch (field.fieldType) {
             case 'text': case 'number': case 'email': case 'tel':
                 if (maskOptions) {
                     return <IMaskInput {...maskOptions} type={inputType} id={inputName} name={inputName} className={inputClass} value={value} placeholder={placeholderText} unmask={true} onAccept={(unmaskedValue) => { updateFormValue(inputName, unmaskedValue); }} />;
                 } else {
                     return <input type={inputType} id={inputName} name={inputName} className={inputClass} onChange={handleInputChange} placeholder={placeholderText} value={value} />;
                 }
             case 'date': return <input type="date" id={inputName} name={inputName} className={inputClass} onChange={handleInputChange} placeholder={placeholderText} value={value} />;
             case 'textarea': return <textarea id={inputName} name={inputName} className={textareaClass} onChange={handleInputChange} placeholder={placeholderText} value={value} rows={field.rows || 3} />;
             case 'select': return ( <select id={inputName} name={inputName} className={selectClass} onChange={handleInputChange} value={value}> <option value="">{placeholderText || 'Seçiniz...'}</option> {field.options?.map((opt, idx) => typeof opt === 'string' ? <option key={`${inputName}-opt-${idx}`} value={opt}>{opt}</option> : <option key={`${inputName}-opt-${idx}`} value={opt.value}>{opt.label}</option>)} </select> );
             case 'radio': return ( <div className={styles.radioGroup}> {field.options?.map((opt, idx) => { const val = typeof opt === 'string' ? opt : opt.value; const lbl = typeof opt === 'string' ? opt : opt.label; const id = `${inputName}-opt-${idx}`; return ( <div key={id} className={styles.radioContainer}> <input type="radio" id={id} name={inputName} value={val} checked={String(value) === String(val)} onChange={handleInputChange} className={styles.radioInput} /> <label htmlFor={id} className={styles.radioLabel}>{lbl}</label> </div> ); })} </div> );
             default: return <input type="text" id={inputName} name={inputName} className={inputClass} onChange={handleInputChange} placeholder={`Desteklenmeyen: ${field.fieldType}`} value={value} />;
          }
     };
    // --- Input Render Sonu ---

    // --- Ana Render Fonksiyonu ---
    if (!templateFields || templateFields.length === 0) { return <div className={styles.container}>Form alanları yükleniyor...</div>; }

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
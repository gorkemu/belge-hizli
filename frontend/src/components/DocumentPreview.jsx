import React from 'react';
import styles from './DocumentPreview.module.css';
import Handlebars from 'handlebars';

// "eq" helper'ını kaydet (güncellenmiş tanım)
Handlebars.registerHelper('eq', function (a, b) {
    return a === b;
});

function DocumentPreview({ templateContent, formData }) {
    if (!templateContent) {
        return <div className={styles.container}>Önizleme yükleniyor...</div>;
    }

    try {
        const kiralayanSayisi = formData['kiralayan_sayisi'] ? parseInt(formData['kiralayan_sayisi']) : 0;
        let kiralayanBilgileri = '';
        for (let i = 0; i < kiralayanSayisi; i++) {
            kiralayanBilgileri += `Kiralayan Adı Soyadı ${i + 1}: ${formData[`kiralayan_adi_soyadi_${i}`] || ''}\n`;
            kiralayanBilgileri += `Kiralayan Adresi ${i + 1}: ${formData[`kiralayan_adres_${i}`] || ''}\n`;
        }
        formData.kiralayanBilgileri = kiralayanBilgileri.trim();

        const kiraciSayisi = formData['kiraci_sayisi'] ? parseInt(formData['kiraci_sayisi']) : 0;
        let kiraciBilgileri = '';
        for (let i = 0; i < kiraciSayisi; i++) {
            kiraciBilgileri += `Kiracı Adı Soyadı ${i + 1}: ${formData[`kiraci_adi_soyadi_${i}`] || ''}\n`;
            kiraciBilgileri += `Kiracı Adresi ${i + 1}: ${formData[`kiraci_adres_${i}`] || ''}\n`;
        }
        formData.kiraciBilgileri = kiraciBilgileri.trim();

        const template = Handlebars.compile(templateContent);
        const previewHtml = template(formData);

        return (
            <div className={styles.container}>
                <h3 className={styles.previewTitle}>Önizleme</h3>
                <div className={styles.previewArea} style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>
        );
    } catch (error) {
        console.error("Handlebars şablonunu derlerken hata oluştu:", error);
        return <div className={styles.container}>Önizleme oluşturulurken bir hata oluştu.</div>;
    }
}

export default DocumentPreview;
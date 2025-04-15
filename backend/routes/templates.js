const express = require('express');
const router = express.Router();
const Template = require('../models/template');
const { generatePdf } = require('../pdf-generator/pdfGenerator');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const Handlebars = require('handlebars'); // Handlebars kütüphanesini ekle

// "eq" helper'ını kaydet
Handlebars.registerHelper('eq', function (a, b) {
    return a === b;
});

function turkceToLatin(text) {
    return text
        .replace(/Ğ/g, 'G')
        .replace(/Ü/g, 'U')
        .replace(/Ş/g, 'S')
        .replace(/I/g, 'I')
        .replace(/İ/g, 'I')
        .replace(/Ö/g, 'O')
        .replace(/Ç/g, 'C')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/i/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-zA-Z0-9._-]/g, '_');
}

async function processTemplateContent(templateContent, formData) {
    try {
        const template = Handlebars.compile(templateContent);
        const processedContent = template(formData);
        console.log('İşlendikten Sonraki İçerik (Handlebars):', processedContent.substring(0, 600));
        return processedContent;
    } catch (error) {
        console.error('Handlebars şablonunu işlerken hata oluştu:', error);
        return `Handlebars şablonunu işlerken bir hata oluştu: ${error.message}`;
    }
}

router.get('/templates', async (req, res) => {
    try {
        const templates = await Template.find({}, '_id name description price');
        res.json(templates);
    } catch (error) {
        console.error('Şablonlar alınırken hata oluştu:', error);
        res.status(500).json({ message: 'Şablonlar alınırken bir hata oluştu.' });
    }
});

router.get('/templates/:id', async (req, res) => {
    try {
        const template = await Template.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ message: 'Şablon bulunamadı' });
        }

        // template.fields dizisini filtrele (ek güvenlik)
        const filteredFields = template.fields.filter(field => {
            return !(field.name === 'kiralayan_adi_soyadi_0' ||
                     field.name === 'kiralayan_adres_0' ||
                     field.name === 'kiraci_adi_soyadi_0' ||
                     field.name === 'kiraci_adres_0');
        });

        res.json({ ...template.toObject(), fields: filteredFields }); // Filtrelenmiş alanları gönder

    } catch (error) {
        console.error('Şablon detayı alınırken hata oluştu:', error);
        res.status(500).json({ message: 'Şablon detayı alınırken bir hata oluştu.' });
    }
});

router.post('/templates/:id/generate-pdf', async (req, res) => {
    try {
        const template = await Template.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ message: 'Şablon bulunamadı' });
        }

        const { formData } = req.body;
        console.log('FormData (generate-pdf):', formData);

        const htmlContent = await processTemplateContent(template.content, formData);

        const pdfBuffer = await generatePdf(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8" />
                <title>${template.name}</title>
                <style>
                    body { font-family: sans-serif; font-size: 12px; white-space: pre-wrap; }
                    /* Önizlemedeki stillerin benzerini buraya ekleyin (gerekirse) */
                </style>
            </head>
            <body>
                <div>${htmlContent}</div>
            </body>
            </html>
        `);

        const safeFilename = turkceToLatin(template.name) + '.pdf';
        res.setHeader('Content-Length', pdfBuffer.length);
        res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
        res.contentType('application/pdf');
        res.send(pdfBuffer);

    } catch (error) {
        console.error('PDF oluşturulurken hata oluştu:', error);
        res.status(500).json({ message: 'PDF oluşturulurken bir hata oluştu.' });
    }
});

router.post('/templates/:id/process-payment', async (req, res) => {
    try {
        const template = await Template.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ message: 'Şablon bulunamadı' });
        }

        const { formData, amount, currency, email } = req.body;
        console.log('FormData (process-payment):', formData);

        const htmlContent = await processTemplateContent(template.content, formData);

        const pdfBuffer = await generatePdf(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8" />
                <title>${template.name}</title>
                <style>
                    body { font-family: sans-serif; font-size: 12px; white-space: pre-wrap; }
                    /* ... stiller ... */
                </style>
            </head>
            <body>
                <div>${htmlContent}</div>
            </body>
            </html>
        `);
        await fs.writeFile(path.join(__dirname, '..', 'temp-pdfs', `${crypto.randomBytes(16).toString('hex')}.pdf`), pdfBuffer);

        // Ödeme başarılıysa PDF'i doğrudan gönder
        const safeFilename = turkceToLatin(template.name) + '.pdf';
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
        res.send(pdfBuffer);
        return;

    } catch (error) {
        console.error('Ödeme işleme hatası:', error);
        res.status(500).json({ message: 'Ödeme işlemi sırasında bir hata oluştu.' });
        return;
    }
});

// Statik dosyaları sunmak için (geçici PDF'ler)
router.use('/temp-pdfs', express.static(path.join(__dirname, '..', 'temp-pdfs'), {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.pdf')) {
            res.setHeader('Content-Type', 'application/pdf');
        }
    }
}));

module.exports = router;
const express = require('express');
const router = express.Router();
const Template = require('../models/template');
const { generatePdf } = require('../pdf-generator/pdfGenerator');
const path = require('path'); // <<< DÜZELTİLDİ: path modülünü doğru şekilde import et
const fs = require('fs').promises;
const crypto = require('crypto');
const Handlebars = require('handlebars');

// Handlebars helper'ları (Bunlar doğruydu)
Handlebars.registerHelper('math', function (lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
    return {
        '+': lvalue + rvalue, '-': lvalue - rvalue,
        '*': lvalue * rvalue, '/': lvalue / rvalue,
        '%': lvalue % rvalue
    }[operator];
});

Handlebars.registerHelper('eq', function (a, b) {
    return String(a) == String(b);
});

Handlebars.registerHelper('gt', function (a, b) {
    return parseFloat(a) > parseFloat(b);
});

Handlebars.registerHelper('default', function (value, defaultValue) {
    return value !== undefined && value !== null && value !== '' ? value : defaultValue;
});


// Türkçe karakterleri Latin'e çevirme fonksiyonu (güvenli dosya adları için)
function turkceToLatin(text) {
    if (!text) return 'document';
    return text
        .replace(/Ğ/g, 'G').replace(/Ü/g, 'U').replace(/Ş/g, 'S')
        .replace(/I/g, 'I').replace(/İ/g, 'I').replace(/Ö/g, 'O')
        .replace(/Ç/g, 'C').replace(/ğ/g, 'g').replace(/ü/g, 'u')
        .replace(/ş/g, 's').replace(/ı/g, 'i').replace(/i/g, 'i')
        .replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^a-zA-Z0-9._-]/g, '_');
}


// --- Routes ---

// Tüm şablonların listesini getir
router.get('/templates', async (req, res) => {
    try {
        const templates = await Template.find({}, '_id name description price');
        res.json(templates);
    } catch (error) {
        console.error('Şablonlar alınırken hata oluştu:', error);
        res.status(500).json({ message: 'Şablonlar alınırken bir hata oluştu.' });
    }
});

// Belirli bir şablonun detaylarını getir
router.get('/templates/:id', async (req, res) => {
    try {
        const template = await Template.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ message: 'Şablon bulunamadı' });
        }
        res.json(template);
    } catch (error) {
        console.error('Şablon detayı alınırken hata oluştu:', error);
        res.status(500).json({ message: 'Şablon detayı alınırken bir hata oluştu.' });
    }
});

// PDF oluştur (Ödeme öncesi önizleme veya test için) - Kullanılmıyorsa kaldırılabilir
router.post('/templates/:id/generate-pdf', async (req, res) => {
    try {
        const template = await Template.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ message: 'Şablon bulunamadı' });
        }

        const { formData } = req.body;
        const compiledTemplate = Handlebars.compile(template.content || '');
        const htmlContent = compiledTemplate(formData);

        const pdfBuffer = await generatePdf(`
            <!DOCTYPE html><html><head><meta charset="utf-8" /><title>${template.name || 'Document'}</title>
            <style>body { font-family: sans-serif; font-size: 12px; white-space: pre-wrap; }</style></head>
            <body><div>${htmlContent}</div></body></html>
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

// Ödeme işlemi ve PDF oluşturma
router.post('/templates/:id/process-payment', async (req, res) => {
    try {
        const template = await Template.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ message: 'Şablon bulunamadı' });
        }

        const { formData, amount, currency, email } = req.body;

        const compiledTemplate = Handlebars.compile(template.content || '');
        const htmlContent = compiledTemplate(formData);

        const pdfBuffer = await generatePdf(`
            <!DOCTYPE html><html><head><meta charset="utf-8" /><title>${template.name || 'Document'}</title>
            <style>body { font-family: sans-serif; font-size: 12px; white-space: pre-wrap; }</style></head>
            <body><div>${htmlContent}</div></body></html>
        `);

        const paymentSuccessful = true; // Simülasyon

        if (paymentSuccessful) {
            try {
                 const tempDir = path.join(__dirname, '..', 'temp-pdfs'); // path modülünü kullan
                 await fs.mkdir(tempDir, { recursive: true });
                 const tempFilePath = path.join(tempDir, `${crypto.randomBytes(16).toString('hex')}.pdf`); // path modülünü kullan
                 await fs.writeFile(tempFilePath, pdfBuffer);
            } catch (writeError) {
                console.error("Geçici PDF dosyası kaydedilirken hata oluştu:", writeError);
            }

            const safeFilename = turkceToLatin(template.name) + '.pdf';
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
            res.send(pdfBuffer);
        } else {
             console.error('Ödeme işlemi başarısız (simülasyon).');
             res.status(402).json({ message: 'Ödeme işlemi başarısız oldu.' });
        }

    } catch (error) {
        console.error('Ödeme işleme hatası:', error);
        if (error.message.includes("Handlebars")) {
             res.status(500).json({ message: 'Şablon içeriği işlenirken bir hata oluştu. Şablonu kontrol edin.' });
        } else {
             res.status(500).json({ message: 'Ödeme işlemi sırasında bir sunucu hatası oluştu.' });
        }
    }
});

// Statik route (Opsiyonel)
router.use('/temp-pdfs', express.static(path.join(__dirname, '..', 'temp-pdfs'), { // path modülünü kullan
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.pdf')) {
            res.setHeader('Content-Type', 'application/pdf');
        }
    }
}));

module.exports = router;
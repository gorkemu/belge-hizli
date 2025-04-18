const express = require('express');
const router = express.Router();
const Template = require('../models/template');
const { generatePdf } = require('../pdf-generator/pdfGenerator');
const { sendPdfEmail } = require('../utils/mailer'); // <-- YENİ IMPORT
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

        // Gelen veriyi al (email'i de alıyoruz)
        const { formData, amount, currency } = req.body;
        const userEmail = formData?.belge_email || null; // Formdan e-posta adresini al

        if (!userEmail) {
            console.warn("PDF e-posta ile gönderilemedi: Formda 'belge_email' alanı bulunamadı veya boş.");
            // E-posta yoksa bile PDF indirmeye devam edebiliriz.
        }

        const compiledTemplate = Handlebars.compile(template.content || '');
        const htmlContent = compiledTemplate(formData);

        // PDF Oluştur
        console.log("Generating PDF buffer..."); // Log eklendi
        const pdfBuffer = await generatePdf(htmlContent);
        console.log("PDF buffer generated successfully."); // Log eklendi

        // --- Ödeme Simülasyonu ---
        const paymentSuccessful = true; // Simülasyon

        if (paymentSuccessful) {
            const safeFilename = turkceToLatin(template.name) + '.pdf';

            // ---- YENİ: E-posta Gönderme ----
            // E-posta adresi varsa ve PDF buffer'ı oluştuysa e-postayı gönder
            if (userEmail && pdfBuffer) {
                 // Basit HTML e-posta içeriği
                 const emailSubject = `Belge Hızlı - ${template.name} Belgeniz`;
                 const emailHtml = `
                    <p>Merhaba,</p>
                    <p>Belge Hızlı platformunu kullanarak oluşturduğunuz <strong>${template.name}</strong> belgesi ektedir.</p>
                    <p>İyi günlerde kullanın!</p>
                    <br>
                    <p>Saygılarımızla,<br>Belge Hızlı Ekibi</p>
                 `;
                 const emailText = `Merhaba,\n\nBelge Hızlı platformunu kullanarak oluşturduğunuz ${template.name} belgesi ektedir.\n\nİyi günlerde kullanın!\n\nSaygılarımızla,\nBelge Hızlı Ekibi`;

                 // E-posta gönderme fonksiyonunu çağır (asenkron ama await kullanmayalım ki yanıtı geciktirmesin)
                 sendPdfEmail(userEmail, emailSubject, emailText, emailHtml, pdfBuffer, safeFilename)
                    .catch(err => {
                        // Fonksiyon içindeki hata yakalamaya ek olarak burada da loglayabiliriz.
                        console.error("E-posta gönderme fonksiyonu rotada hata yakaladı (ama işlem devam ediyor):", err);
                    });
                 console.log(`E-posta gönderme işlemi ${userEmail} adresine başlatıldı.`); // Log eklendi
            }
            // ---- YENİ: E-posta Gönderme Sonu ----


            // (İsteğe bağlı) Geçici dosyaya kaydetme
            try {
                 const tempDir = path.join(__dirname, '..', 'temp-pdfs');
                 await fs.mkdir(tempDir, { recursive: true });
                 const tempFilePath = path.join(tempDir, `${crypto.randomBytes(16).toString('hex')}.pdf`);
                 await fs.writeFile(tempFilePath, pdfBuffer);
            } catch (writeError) {
                console.error("Geçici PDF dosyası kaydedilirken hata oluştu:", writeError);
            }

            // Ödeme başarılıysa PDF'i response olarak gönder (KULLANICI İNDİRMESİ İÇİN)
            console.log("Sending PDF response to client..."); // Log eklendi
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
            res.send(pdfBuffer);
            console.log("PDF response sent."); // Log eklendi

        } else {
             console.error('Ödeme işlemi başarısız (simülasyon).');
             res.status(402).json({ message: 'Ödeme işlemi başarısız oldu.' });
        }
        // --- Ödeme Simülasyonu Sonu ---

    } catch (error) {
        // Hata yönetimi (pdfGenerator veya başka yerden gelen)
        console.error('Ödeme işleme rotasında ana hata:', error);
        // Genel hata middleware'ine gitmeden önce spesifik mesaj gönderebiliriz
        if (!res.headersSent) { // Yanıt daha önce gönderilmediyse
             res.status(500).json({ message: error.message || 'PDF oluşturma veya ödeme işlemi sırasında bir sunucu hatası oluştu.' });
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
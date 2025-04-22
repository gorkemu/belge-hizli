const express = require('express');
const router = express.Router();
const Template = require('../models/template');
const { generatePdf } = require('../pdf-generator/pdfGenerator');
const { sendPdfEmail } = require('../utils/mailer');
const path = require('path');
const fs = require('fs'); // readFileSync için fs modülünü kullanıyoruz
const crypto = require('crypto');
const Handlebars = require('handlebars');

// --- DATE FORMAT HELPER ---
function formatDateHelper(dateString) {
    if (!dateString || typeof dateString !== 'string') return '';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    } catch (e) { return dateString; }
}
// --- HELPER SONU ---

// Handlebars helper'ları
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

Handlebars.registerHelper('formatDate', formatDateHelper);

// Türkçe karakterleri Latin'e çevirme fonksiyonu (güvenli dosya adları için)
function turkceToLatin(text) {
    if (!text) return 'document';
    return text
        .replace(/Ğ/g, 'G').replace(/Ü/g, 'U').replace(/Ş/g, 'S')
        .replace(/I/g, 'I').replace(/İ/g, 'I').replace(/Ö/g, 'O')
        .replace(/Ç/g, 'C').replace(/ğ/g, 'g').replace(/ü/g, 'u')
        .replace(/ş/g, 's').replace(/ı/g, 'i').replace(/i/g, 'i')
        .replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^a-zA-Z0-9._-]/g, '_'); // Sadece harf, rakam, alt çizgi, nokta ve tire kalsın
}

// --- PDF İçin Temel CSS Stilleri (Dosyadan Oku) ---
// CSS dosyasının yolu. __dirname, mevcut dosyanın (templates.js) bulunduğu dizindir.
// Eğer templates.js 'backend/routes' içinde ve pdfStyles.css 'backend/styles' içinde ise yol '../styles/pdfStyles.css' olmalıdır.
const cssFilePath = path.join(__dirname, '..', 'styles', 'pdfStyles.css');

let pdfStyles = ''; // CSS içeriğini tutacak değişken

try {
    // CSS dosyasını senkron olarak oku. utf8 encoding belirtildi.
    const cssContent = fs.readFileSync(cssFilePath, 'utf8');
    // Okunan içeriği <style> etiketleri arasına yerleştir
    pdfStyles = `<style>\n${cssContent}\n</style>`; // Okunurluk için satır sonları ekledik
    console.log('PDF stilleri CSS dosyası başarıyla yüklendi.');
} catch (error) {
    console.error(`PDF stilleri CSS dosyasını okuma hatası: ${cssFilePath}`, error);
    // Dosya okunamazsa veya yoksa, pdfStyles boş kalır. PDF yine oluşur ama stiller uygulanmaz.
    // Bu, uygulamanın çökmesini engeller.
    console.warn('UYARI: PDF stilleri yüklenemedi. PDF\'ler varsayılan stillerle oluşturulacak.');
}
// --- CSS Yükleme Sonu ---


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

// Ödeme işlemi ve PDF oluşturma (Ana Rota)
router.post('/templates/:id/process-payment', async (req, res) => {
    let pdfBuffer = null;
    let template = null;
    let safeFilename = 'document.pdf'; // Varsayılan dosya adı
    let userEmail = null;

    try {
        template = await Template.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ message: 'Şablon bulunamadı' });
        }

        const { formData, amount, currency } = req.body;
        // formData'nın sunucu tarafında geçerliliğini kontrol etmek ve sanitizasyon yapmak güvenlik açısından önemlidir.
        // Handlebars varsayılan olarak XSS'e karşı koruma sağlar ({{...}} ile), ancak yine de dikkatli olunmalıdır.

        // Kullanıcı e-postasını al (loglamadan)
        userEmail = formData?.belge_email || null;

        if (!userEmail) {
             // Hata değil, sadece bir uyarı olarak loglayalım, e-posta adresini göstermeden
            console.warn(`PDF e-posta ile gönderilemedi: Şablon "${template.name || 'Unknown'}" için formda e-posta alanı bulunamadı veya boş.`);
             // E-posta gönderimi yapılmayacak ama PDF oluşturulup kullanıcıya gönderilecek
        }

        // Handlebars template'ini derle
        // template.content'in güvenli kaynaklardan geldiğini varsayıyoruz veya DB'ye kaydedilmeden sanitize edildiğini.
        const compiledTemplate = Handlebars.compile(template.content || '');
        // Veriyi template'e uygula
        const htmlContent = compiledTemplate(formData);

        // PDF Oluşturma için HTML'i hazırla (Stillerle birlikte)
        const fullHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8" />
                <title>${template.name || 'Document'}</title>
                ${pdfStyles} </head>
            <body>
                <div>${htmlContent}</div>
            </body>
            </html>`;

        console.log(`Generating PDF buffer for template: ${template.name || 'Unknown'}...`);
        // generatePdf servisinin güvende olduğunu ve HTML içeriğini düzgün işlediğini varsayıyoruz.
        pdfBuffer = await generatePdf(fullHtml); // generatePdf'e stilli HTML'i gönder
        console.log(`PDF buffer generated successfully for template: ${template.name || 'Unknown'}.`);

        // --- Ödeme Simülasyonu ---
        // Buraya gerçek ödeme entegrasyonunuz gelecek.
        // Ödeme sağlayıcısından gelen sonucu kontrol etmelisiniz.
        const paymentSuccessful = true; // Gerçek entegrasyonda ödeme sonucuna göre belirlenecek

        if (!paymentSuccessful) {
            console.error(`Ödeme işlemi başarısız (simülasyon) for template: ${template.name || 'Unknown'}.`);
            // Eğer ödeme başarısızsa PDF gönderme veya e-posta atma işlemini durdur
            return res.status(402).json({ message: 'Ödeme işlemi başarısız oldu.' });
        }
        console.log(`Payment successful (simulated) for template: ${template.name || 'Unknown'}.`);
        // --- Ödeme Simülasyonu Sonu ---

        // Ödeme başarılıysa dosya adını güvenli hale getir
        safeFilename = turkceToLatin(template.name || 'Belge') + '.pdf';

        // E-posta Gönderme (Asenkron) - Ödeme başarılıysa ve email varsa
        if (userEmail && pdfBuffer) {
            const emailSubject = `Belge Hızlı - ${template.name || 'Belge'} Belgeniz`;
            const emailHtml = `<p>Merhaba,</p><p>Belge Hızlı platformunu kullanarak oluşturduğunuz <strong>${template.name || 'Belge'}</strong> belgesi ektedir.</p><p>İyi günlerde kullanın!</p><br><p>Saygılarımızla,<br>Belge Hızlı Ekibi</p>`;
            const emailText = `Merhaba,\n\nBelge Hızlı platformunu kullanarak oluşturduğunuz ${template.name || 'Belge'} belgesi ektedir.\n\nİyi günlerde kullanın!\n\nSaygılarımızla,\nBelge Hızlı Ekibi`;

            // E-posta adresini loglamadan işlemi başlattığımızı belirtelim
            console.log(`Initiating PDF email dispatch for template: ${template.name || 'Unknown Template'}`);

            // E-posta gönderme işlemi asenkron olarak devam edecek, yanıtı beklememize gerek yok.
            // Promise'in sonucunu sadece loglamak için kullanıyoruz.
            sendPdfEmail(userEmail, emailSubject, emailText, emailHtml, pdfBuffer, safeFilename)
                .then(() => console.log(`PDF email dispatch initiated successfully for template: ${template.name || 'Unknown Template'}.`))
                .catch(emailError => console.error(`Error initiating PDF email dispatch for template: ${template.name || 'Unknown Template'}:`, emailError));

        } else if (pdfBuffer) {
             // userEmail yok ama pdfBuffer var, e-posta gönderilmediğini belirttik
             console.log(`PDF email skipped for template: ${template.name || 'Unknown Template'} (no email provided or PDF missing).`);
        } else {
             // Hem userEmail hem pdfBuffer yok
             console.error(`PDF buffer was not created for template: ${template.name || 'Unknown Template'}. Cannot send email or file.`);
        }


        // --- Geçici dosya kaydetme (Gereksizse yorum satırında kalsın) ---
        // PDF kullanıcıya doğrudan gönderildiği veya e-posta ile eklendiği için
        // sunucu tarafında kalıcı veya geçici olarak kaydetmek genellikle gerekli değildir.
        // Debug veya arşivleme amaçlı kullanıyorsanız yorum satırından çıkarabilirsiniz.
        /*
        if (pdfBuffer) {
             try {
                 const tempDir = path.join(__dirname, '..', 'temp-pdfs');
                 // __dirname/../temp-pdfs klasörüne kaydedilir
                 await fs.promises.mkdir(tempDir, { recursive: true });
                 // Güvenlik için benzersiz bir dosya adı oluşturulur
                 const uniqueFileName = `${safeFilename.replace('.pdf', '')}_${crypto.randomBytes(4).toString('hex')}.pdf`;
                 const tempFilePath = path.join(tempDir, uniqueFileName);
                 await fs.promises.writeFile(tempFilePath, pdfBuffer);
                 console.log(`Temporary PDF saved to ${tempFilePath}`);
             } catch (writeError) {
                 console.error("Geçici PDF dosyası kaydedilirken hata oluştu:", writeError);
             }
        }
        */
        // --- Geçici dosya kaydetme Sonu ---


        // PDF'i kullanıcıya indirme yanıtı olarak gönder (Ödeme başarılıysa ve PDF oluştuysa)
        if (paymentSuccessful && pdfBuffer) {
             console.log(`Sending PDF response to client for template: ${template.name || 'Unknown'}...`);
             res.setHeader('Content-Type', 'application/pdf');
             res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
             res.send(pdfBuffer);
             console.log(`PDF response sent for template: ${template.name || 'Unknown'}.`);
        } else if (!res.headersSent) {
             // Ödeme başarılı değilse veya pdf oluşmadıysa ve henüz yanıt gönderilmediyse hata gönder
             // Bu durum, ödeme başarısızlığı veya generatePdf'in hata fırlatmasıyla zaten yakalanmış olmalı,
             // ama ek bir güvenlik katmanı.
             console.error(`Could not send PDF response for template: ${template.name || 'Unknown'}. Payment successful: ${paymentSuccessful}, PDF Buffer exists: ${!!pdfBuffer}.`);
             res.status(500).json({ message: 'PDF oluşturulamadı veya ödeme başarısız oldu.' });
        }

    } catch (error) {
        console.error(`An error occurred during payment process/PDF generation for template: ${template?.name || 'Unknown'}:`, error);
        // Hata yanıtını sadece headers gönderilmediyse gönder
        if (!res.headersSent) {
            res.status(500).json({ message: error.message || 'PDF oluşturma veya e-posta gönderimi sırasında bir sunucu hatası oluştu.' });
        }
        // Eğer genel bir hata yakalayıcınız varsa hatayı Express'e iletmek için next(error) kullanabilirsiniz.
        // next(error);
    }
});

module.exports = router;
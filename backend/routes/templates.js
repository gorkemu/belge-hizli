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

// --- HTML İçin Temel CSS Stilleri ---
// PDF oluştururken HTML'e eklenecek ortak stiller
const pdfStyles = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
      body {
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          font-size: 11pt; /* Biraz küçülttüm, A4'e daha uygun olabilir */
          line-height: 1.5; /* Biraz daha sıkı satır aralığı */
          color: #343a40; /* --text-color */
          /* white-space: pre-wrap; // HTML içeriğinde pre tag'leri kullanıldığı için buna gerek yok */
      }
      h1, h2, h3, h4, h5, h6 {
           font-family: 'Inter', sans-serif;
           color: #212529; /* --gray-900 */
           margin-top: 1.25rem;
           margin-bottom: 0.75rem;
           line-height: 1.3;
      }
      h1 { font-size: 18pt; }
      h2 { font-size: 16pt; }
      h3 { font-size: 14pt; }
      p {
          margin-bottom: 0.8rem;
      }
      ul, ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
      }
      li {
          margin-bottom: 0.4rem;
      }
      pre {
           font-family: monospace;
           background-color: #f8f9fa; /* --gray-100 */
           padding: 0.8rem; /* Biraz daha az padding */
           border-radius: 4px;
           border: 1px solid #dee2e6; /* --gray-300 */
           white-space: pre-wrap;
           word-wrap: break-word;
           font-size: 10pt; /* pre içeriği biraz daha küçük */
           margin-bottom: 1rem;
      }
      a {
          color: #218838; /* --primary-color */
          text-decoration: none;
      }
      strong, b {
          font-weight: 600; /* Kalın yazı için ağırlık */
      }
      /* Gerekirse ek stiller buraya eklenebilir */
  </style>
`;
// --- HTML İçin Temel CSS Stilleri Sonu ---

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
/* --- Kullanılmayan generate-pdf Rotası (Yorum Satırı) ---
router.post('/templates/:id/generate-pdf', async (req, res) => {
    try {
        const template = await Template.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ message: 'Şablon bulunamadı' });
        }

        const { formData } = req.body;
        const compiledTemplate = Handlebars.compile(template.content || '');
        const htmlContent = compiledTemplate(formData);

        // PDF Oluştur (Browserless ile)
        const pdfBuffer = await generatePdf(
            `<!DOCTYPE html>
             <html>
             <head>
                 <meta charset="utf-8" />
                 <title>${template.name || 'Document'}</title>
                 ${pdfStyles} // <-- Stilleri ekle
             </head>
             <body>
                 <div>${htmlContent}</div>
             </body>
             </html>`
        );

        const safeFilename = turkceToLatin(template.name) + '.pdf';
        res.setHeader('Content-Length', pdfBuffer.length);
        res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
        res.contentType('application/pdf');
        res.send(pdfBuffer);

    } catch (error) {
        console.error('PDF oluşturulurken hata oluştu (generate-pdf route):', error);
        res.status(500).json({ message: 'PDF oluşturulurken bir hata oluştu.' });
    }
});
*/ // --- Kullanılmayan generate-pdf Rotası Sonu ---

// Ödeme işlemi ve PDF oluşturma (Ana Rota)
router.post('/templates/:id/process-payment', async (req, res, next) => { // next eklendi (opsiyonel, hata yönetimi için)
    let pdfBuffer = null; // Buffer'ı try dışında tanımla
    let template = null; // Template'i try dışında tanımla
    let safeFilename = 'document.pdf'; // Varsayılan dosya adı
    let userEmail = null; // Kullanıcı email'i

    try {
        template = await Template.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ message: 'Şablon bulunamadı' });
        }
        // ... (template not found kontrolü) ...
        const { formData, amount, currency } = req.body;
        userEmail = formData?.belge_email || null;

        if (!userEmail) {
            console.warn("PDF e-posta ile gönderilemedi: Formda 'belge_email' alanı bulunamadı veya boş.");
        }

        const compiledTemplate = Handlebars.compile(template.content || '');
        const htmlContent = compiledTemplate(formData);

        // PDF Oluşturma için HTML'i hazırla (Stillerle birlikte)
        const fullHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8" />
                <title>${template.name || 'Document'}</title>
                ${pdfStyles} <!-- Ortak stilleri ekle -->
            </head>
            <body>
                <div>${htmlContent}</div>
            </body>
            </html>`;

        console.log("Generating PDF buffer via external service...");
        pdfBuffer = await generatePdf(fullHtml); // generatePdf'e stilli HTML'i gönder
        console.log("PDF buffer generated successfully.");

        // --- Ödeme Simülasyonu ---
        const paymentSuccessful = true;

        if (!paymentSuccessful) {
             console.error('Ödeme işlemi başarısız (simülasyon).');
             // Eğer ödeme başarısızsa PDF gönderme veya e-posta atma
             return res.status(402).json({ message: 'Ödeme işlemi başarısız oldu.' });
        }
        // --- Ödeme Simülasyonu Sonu ---

        safeFilename = turkceToLatin(template.name) + '.pdf';

        // E-posta Gönderme (Asenkron)
        if (userEmail && pdfBuffer) {
            const emailSubject = `Belge Hızlı - ${template.name} Belgeniz`;
            const emailHtml = `<p>Merhaba,</p><p>Belge Hızlı platformunu kullanarak oluşturduğunuz <strong>${template.name}</strong> belgesi ektedir.</p><p>İyi günlerde kullanın!</p><br><p>Saygılarımızla,<br>Belge Hızlı Ekibi</p>`;
            const emailText = `Merhaba,\n\nBelge Hızlı platformunu kullanarak oluşturduğunuz ${template.name} belgesi ektedir.\n\nİyi günlerde kullanın!\n\nSaygılarımızla,\nBelge Hızlı Ekibi`;

            // E-posta adresini loglamadan işlemi başlattığımızı belirtelim
            console.log(`Initiating PDF email dispatch for template: ${template.name}`); 

            sendPdfEmail(userEmail, emailSubject, emailText, emailHtml, pdfBuffer, safeFilename)
        }

        // Geçici dosya kaydetme
        try {
            const tempDir = path.join(__dirname, '..', 'temp-pdfs');
            await fs.mkdir(tempDir, { recursive: true });
            const tempFilePath = path.join(tempDir, `${crypto.randomBytes(16).toString('hex')}.pdf`);
            await fs.writeFile(tempFilePath, pdfBuffer);
        } catch (writeError) {
            console.error("Geçici PDF dosyası kaydedilirken hata oluştu:", writeError);
        }

        // PDF'i kullanıcıya indirme yanıtı olarak gönder
        console.log("Sending PDF response to client...");
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
        res.send(pdfBuffer);
        console.log("PDF response sent.");

    } catch (error) {
        console.error(`İşlem sırasında hata oluştu (Template: ${template?.name}):`, error);
        // Hata yanıtını sadece headers gönderilmediyse gönder
        if (!res.headersSent) {
             res.status(500).json({ message: error.message || 'PDF oluşturma veya e-posta gönderimi sırasında bir sunucu hatası oluştu.' });
        }
        // next(error); // Opsiyonel: Express'in genel hata yakalayıcısına göndermek için
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
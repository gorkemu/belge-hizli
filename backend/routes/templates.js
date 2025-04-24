const express = require('express');
const router = express.Router();
const Template = require('../models/template'); // Template modeli gerekli
const { generatePdf } = require('../pdf-generator/pdfGenerator');
const { sendPdfEmail } = require('../utils/mailer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const Handlebars = require('handlebars');
const { format } = require('date-fns'); // Sitemap için tarih formatlama

// --- DATE FORMAT HELPER (PDF için) ---
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

// Handlebars helper'ları (Mevcutlar korunuyor)
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

Handlebars.registerHelper('formatDate', formatDateHelper); // PDF için TR format

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
const cssFilePath = path.join(__dirname, '..', 'styles', 'pdfStyles.css');
let pdfStyles = '';
try {
    const cssContent = fs.readFileSync(cssFilePath, 'utf8');
    pdfStyles = `<style>\n${cssContent}\n</style>`;
    console.log('PDF stilleri CSS dosyası başarıyla yüklendi.');
} catch (error) {
    console.error(`PDF stilleri CSS dosyasını okuma hatası: ${cssFilePath}`, error);
    console.warn('UYARI: PDF stilleri yüklenemedi. PDF\'ler varsayılan stillerle oluşturulacak.');
}
// --- CSS Yükleme Sonu ---


// --- Routes ---

// Tüm şablonların listesini getir (Path değiştirildi)
router.get('/sablonlar', async (req, res) => {
    try {
        // Debug logu kaldırıldı
        const templates = await Template.find({}, '_id name description price slug');
        res.json(templates);
    } catch (error) {
        console.error('Şablonlar alınırken hata oluştu:', error);
        res.status(500).json({ message: 'Şablonlar alınırken bir hata oluştu.' });
    }
});

// Belirli bir şablonun detaylarını slug'a göre getir (Path değiştirildi)
router.get('/sablonlar/detay/:slug', async (req, res) => {
    try {
        // Slug alanına göre şablonu bul
        const template = await Template.findOne({ slug: req.params.slug });

        if (!template) {
            // Slug ile bulunamazsa 404 hatası dön
            return res.status(404).json({ message: 'Şablon bulunamadı' });
        }
        // Şablonu bulduysak gönder
        res.json(template);
    } catch (error) {
        console.error('Şablon detayı (slug ile) alınırken hata oluştu:', error);
        res.status(500).json({ message: 'Şablon detayı alınırken bir hata oluştu.' });
    }
});

// Belirli bir şablonun detaylarını ID'ye göre getir (Redirect Logic Kaldırıldı)
// Frontend'den /sablonlar/:id şeklinde çağrılmadığı sürece (ki artık slug kullanılıyor) bu rota kullanılmaz.
// Ancak backend tarafından ID ile çekilmesi gerekirse veya eski frontend code çalışırsa hala veri sağlar.
router.get('/sablonlar/:id', async (req, res) => {
    try {
        console.log(`Request received on /sablonlar/:id path: /api/sablonlar/${req.params.id}`); // Loglama
        const template = await Template.findById(req.params.id);
        if (!template) {
            console.warn(`Template with ID ${req.params.id} not found on /sablonlar/:id path.`); // Loglama
            return res.status(404).json({ message: 'Şablon bulunamadı' });
        }

        // Redirect logic kaldırıldı. Bu rota artık sadece ID ile şablon verisi döndürür.
        console.log(`Template found by ID ${req.params.id}. Returning JSON data.`); // Loglama
        res.json(template);

    } catch (error) {
        console.error('Şablon detayı (ID ile, /sablonlar/:id rotası) alınırken hata oluştu:', error);
        res.status(500).json({ message: 'Şablon detayı alınırken bir hata oluştu.' });
    }
});

// --- YENİ EKLEDİĞİMİZ /templates/:id Rotası DURACAK ---
// Bu rota, eski frontend URL'lerinden gelen trafiği yeni slug'lı Frontend URL'lerine yönlendirdiği için GEREKLİDİR.
// --- YENİ: Eski /templates/:id API rotasına gelen istekleri yakala ve 301 yönlendir ---
// Bu rota, Vercel'den gelen /templates/:id rewrite isteklerini karşılar.
// Amaç: Eski indexlenmiş veya link verilmiş /templates/:id URL'lerinden gelen trafiği yeni slug'lı URL'lere yönlendirmek.
router.get('/templates/:id', async (req, res) => {
    try {
        console.log(`Request received on old ID path: /api/templates/${req.params.id}`); // Loglama
        const template = await Template.findById(req.params.id);
        if (!template) {
            // Eski ID ile şablon bulunamazsa 404 döndür
            console.warn(`Template with old ID ${req.params.id} not found.`); // Loglama
            return res.status(404).json({ message: 'Şablon bulunamadı' });
        }

        // Eğer şablon bulunduysa ve bir slug'ı varsa, yeni slug'lı Frontend URL'ine 301 yönlendirme yap
        if (template.slug) {
            console.log(`301 Redirecting from /api/templates/${req.params.id} to /sablonlar/detay/${template.slug}`); // Loglama
            // Frontend URL yapısına yönlendiriyoruz. Vercel bu path'i tekrar işleyip index.html'e gidecek.
            return res.redirect(301, `/sablonlar/detay/${template.slug}`); // <-- 301 Yönlendirme (Frontend Path)
        } else {
             // Eğer slug'ı yoksa ve eski bir URL'den geldiyse, ne yapmalı?
             // Normalde tüm eski şablonlara slug ekledik, bu durum olmamalı.
             // Ama olursa 404 döndürmek en güvenlisi.
            console.warn(`Template found by old ID ${req.params.id} but no slug found. Returning 404.`); // Loglama
            return res.status(404).json({ message: 'Şablon bulunamadı veya slug atanmamış.' });
        }

    } catch (error) {
        console.error('Eski ID rotası (/templates/:id) işlenirken hata oluştu:', error);
        res.status(500).json({ message: 'Şablon detayı alınırken bir sunucu hatası oluştu.' });
    }
});
// --- YENİ SON ---


// Ödeme işlemi ve PDF oluşturma (Path şimdilik eski kaldı)
router.post('/templates/:id/process-payment', async (req, res) => {
    let pdfBuffer = null;
    let template = null;
    let safeFilename = 'document.pdf';
    let userEmail = null;

    try {
        template = await Template.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ message: 'Şablon bulunamadı' });
        }

        const { formData, amount, currency } = req.body;
        userEmail = formData?.belge_email || null;

        if (!userEmail) {
            console.warn(`PDF e-posta ile gönderilemedi: Şablon "${template.name || 'Unknown'}" için formda e-posta alanı bulunamadı veya boş.`);
        }

        const compiledTemplate = Handlebars.compile(template.content || '');
        const htmlContent = compiledTemplate(formData);

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
        pdfBuffer = await generatePdf(fullHtml);
        console.log(`PDF buffer generated successfully for template: ${template.name || 'Unknown'}.`);

        const paymentSuccessful = true;
        if (!paymentSuccessful) {
            console.error(`Ödeme işlemi başarısız (simülasyon) for template: ${template.name || 'Unknown'}.`);
            return res.status(402).json({ message: 'Ödeme işlemi başarısız oldu.' });
        }
        console.log(`Payment successful (simulated) for template: ${template.name || 'Unknown'}.`);

        safeFilename = turkceToLatin(template.name || 'Belge') + '.pdf';

        if (userEmail && pdfBuffer) {
            const emailSubject = `Belge Hızlı - ${template.name || 'Belge'} Belgeniz`;
            const emailHtml = `<p>Merhaba,</p><p>Belge Hızlı platformunu kullanarak oluşturduğunuz <strong>${template.name || 'Belge'}</strong> belgesi ektedir.</p><p>İyi günlerde kullanın!</p><br><p>Saygılarımızla,<br>Belge Hızlı Ekibi</p>`;
            const emailText = `Merhaba,\n\nBelge Hızlı platformunu kullanarak oluşturduğunuz ${template.name || 'Belge'} belgesi ektedir.\n\nİyi günlerde kullanın!\n\nSaygılarımızla,\nBelge Hızlı Ekibi`;

            console.log(`Initiating PDF email dispatch for template: ${template.name || 'Unknown Template'}`);

            sendPdfEmail(userEmail, emailSubject, emailText, emailHtml, pdfBuffer, safeFilename)
                .then(() => console.log(`PDF email dispatch initiated successfully for template: ${template.name || 'Unknown Template'}.`))
                .catch(emailError => console.error(`Error initiating PDF email dispatch for template: ${template.name || 'Unknown Template'}:`, emailError));

        } else if (pdfBuffer) {
             console.log(`PDF email skipped for template: ${template.name || 'Unknown Template'} (no email provided or PDF missing).`);
        } else {
             console.error(`PDF buffer was not created for template: ${template.name || 'Unknown Template'}. Cannot send email or file.`);
        }

        if (paymentSuccessful && pdfBuffer) {
             console.log(`Sending PDF response to client for template: ${template.name || 'Unknown'}...`);
             res.setHeader('Content-Type', 'application/pdf');
             res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
             res.send(pdfBuffer);
             console.log(`PDF response sent for template: ${template.name || 'Unknown'}.`);
        } else if (!res.headersSent) {
             console.error(`Could not send PDF response for template: ${template.name || 'Unknown'}. Payment successful: ${paymentSuccessful}, PDF Buffer exists: ${!!pdfBuffer}.`);
             res.status(500).json({ message: 'PDF oluşturulamadı veya ödeme başarısız oldu.' });
        }

    } catch (error) {
        console.error(`An error occurred during payment process/PDF generation for template: ${template?.name || 'Unknown'}:`, error);
        if (!res.headersSent) {
            res.status(500).json({ message: error.message || 'PDF oluşturma veya e-posta gönderimi sırasında bir sunucu hatası oluştu.' });
        }
    }
});



// --- Dinamik Sitemap Rotası (URL Yapısı Güncellendi) ---
router.get('/sitemap.xml', async (req, res) => {
    try {
        // Sadece slug ve updatedAt alanlarını çekiyoruz, gereksiz veri getirmemek için
        const templates = await Template.find({}, 'slug updatedAt').lean(); // .lean() daha hızlı okuma sağlar

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        // Statik sayfalar (manuel olarak eklenir, path'ler güncellendi)
        const staticUrls = [
            { loc: 'https://www.belgehizli.com/', changefreq: 'weekly', priority: '1.0' },
            { loc: 'https://www.belgehizli.com/sablonlar', changefreq: 'daily', priority: '0.9' }, // Path güncellendi
            { loc: 'https://www.belgehizli.com/hakkimizda', changefreq: 'monthly', priority: '0.7' },
            { loc: 'https://www.belgehizli.com/iletisim', changefreq: 'monthly', priority: '0.7' },
            { loc: 'https://www.belgehizli.com/gizlilik-politikasi', changefreq: 'monthly', priority: '0.5' },
            { loc: 'https://www.belgehizli.com/kullanim-sartlari', changefreq: 'monthly', priority: '0.5' },
            { loc: 'https://www.belgehizli.com/teslimat-iade', changefreq: 'monthly', priority: '0.5' },
            // Gelecekte eklenebilecek diğer statik sayfalar buraya eklenecek
        ];

        staticUrls.forEach(url => {
            xml += `
<url>
  <loc>${url.loc}</loc>
  <changefreq>${url.changefreq}</changefreq>
  <priority>${url.priority}</priority>
</url>`;
        });


        // Dinamik şablon sayfaları (veritabanından çekilir, URL yapısı güncellendi)
        templates.forEach(template => {
            // Sadece slug'ı olan şablonları dahil et
            if (template.slug) {
                const lastMod = template.updatedAt ? format(new Date(template.updatedAt), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'); // Son güncelleme tarihi formatlandı
                 // Yeni slug bazlı URL formatı kullanıldı ve path güncellendi
                const loc = `https://www.belgehizli.com/sablonlar/detay/${template.slug}`;

                xml += `
<url>
  <loc>${loc}</loc>
  <lastmod>${lastMod}</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>`;
            }
        });

        xml += `
</urlset>`;

        // Response header'larını ayarla ve XML içeriğini gönder
        res.header('Content-Type', 'application/xml');
        res.send(xml);

    } catch (error) {
        console.error('Sitemap oluşturulurken hata oluştu:', error);
        res.status(500).send('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>'); // Hata durumunda boş sitemap döndür
    }
});
// --- Dinamik Sitemap Rotası Sonu ---


module.exports = router;
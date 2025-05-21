const express = require('express');
const router = express.Router();
const Template = require('../models/template'); 
const Transaction = require('../models/transaction'); 
const Invoice = require('../models/invoice');      
const ConsentLog = require('../models/consentLog');
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

// --- Eski ID - Slug Eşleme Dosyasını Yükle ---
// Dosyanın backend ana dizininde olduğunu varsayarız.
const oldIdToSlugMapPath = path.join(__dirname, '..', 'old-id-to-slug-map.json');
let oldIdToSlugMap = {};
try {
    const mapData = fs.readFileSync(oldIdToSlugMapPath, 'utf8');
    oldIdToSlugMap = JSON.parse(mapData);
    console.log(`Successfully loaded old ID to slug map from ${oldIdToSlugMapPath}`); // Log
} catch (error) {
    // Eğer dosya yoksa veya okuma/parse hatası olursa logla ve boş eşleme objesiyle devam et
    console.error(`Failed to load old ID to slug map from ${oldIdToSlugMapPath}:`, error.message); // Log error
    // Hata durumunda eşleme objesi boş kalır, aşağıdaki logic 404'e düşer.
}
// --- Eşleme Yükleme Sonu ---

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

// --- Eski /templates/:id API rotasına gelen istekleri yakala ve 301 yönlendir ---
// Bu rota, Vercel'den gelen /templates/:id rewrite isteklerini karşılar.
// Amaç: Eski indexlenmiş veya link verilmiş /templates/:id URL'lerinden gelen trafiği yeni slug'lı URL'lere yönlendirmek.
router.get('/templates/:id', async (req, res) => {
    try {
        console.log(`Request received on old ID path: /api/templates/${req.params.id}. Checking map.`); // Loglama
        const oldId = req.params.id;

        // 1. Gelen ID'yi doğrudan mevcut eşleme haritasında ara
        if (oldIdToSlugMap[oldId]) {
            const currentSlug = oldIdToSlugMap[oldId];
            console.log(`Old ID ${oldId} found in map. Redirecting to /sablonlar/detay/${currentSlug}`); // Loglama
            // Haritadan bulunan slug ile yeni Frontend URL yapısına 301 yönlendir
            return res.redirect(301, `/sablonlar/detay/${currentSlug}`);
        }

        // 2. Eğer ID haritada bulunamadıysa, veritabanında ara (Bu kısım eğer eski ID silinmemiş ve slug eklenmişse işe yarar, genellikle harita yeterli olmalı)
        const template = await Template.findById(oldId);

        if (template && template.slug) {
            // Eğer şablon haritada olmamasına rağmen (beklenmedik şekilde) mevcut ID ile veritabanında bulunduysa ve slug'ı varsa
            console.log(`Template found directly by current ID ${oldId} (not in map). Redirecting to /sablonlar/detay/${template.slug}`); // Loglama
            return res.redirect(301, `/sablonlar/detay/${template.slug}`); // Frontend URL yapısına 301 yönlendir
        } else if (template && !template.slug) {
             // Eğer ID veritabanında bulundu ama slug yoksa (beklenmez), 404 dön.
            console.warn(`Template found directly by ID ${oldId} but no slug found. Returning 404.`); // Loglama
            return res.status(404).json({ message: 'Şablon bulundu ancak slug atanmamış.' });
        }

        // 3. Ne haritada ne de veritabanında bulunamadıysa 404 döndür
        console.warn(`Old ID ${oldId} not found in map or database. Returning 404.`); // Loglama
        return res.status(404).json({ message: 'Şablon bulunamadı.' });


    } catch (error) {
        console.error('Eski ID rotası (/templates/:id) işlenirken hata oluştu:', error);
        res.status(500).json({ message: 'Şablon detayı alınırken bir sunucu hatası oluştu.' });
    }
});
// --- 301 YÖNLENDİRME LOGİĞİ SONU ---

// --- Ödeme işlemi, PDF oluşturma ve KAYIT (Path templates olarak kaldı, sablonlar yerine) ---
router.post('/templates/:id/process-payment', async (req, res) => {
    let pdfBuffer = null;
    let template = null;
    let safeFilename = 'document.pdf';
    let userEmailForLog = null; // Bu isim kullanılacak (önceki userEmail yerine)
    let newTransaction = null;
    let newInvoice = null;
    let newConsentLog = null;

    try {
        template = await Template.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ message: 'Şablon bulunamadı' });
        }

        // Request body'den consentTimestamp ve documentVersion da alınacak
        const { formData, billingInfo, amount, currency, consentTimestamp, documentVersion } = req.body;

        userEmailForLog = billingInfo?.email || formData?.belge_email || 'unknown@example.com';

        if (userEmailForLog === 'unknown@example.com' && !billingInfo) { // belge_email de yoksa
            console.warn(`İşlem reddedildi: Geçerli bir e-posta adresi sağlanmadı. Template: ${template.name}`);
            return res.status(400).json({ message: 'Lütfen geçerli bir e-posta adresi girin.' });
        }

        // Onay Logu Oluşturma
        if (!consentTimestamp || !documentVersion) {
            console.warn(`Kullanıcı onayı bilgileri eksik (timestamp: ${consentTimestamp}, version: ${documentVersion}). İşlem reddedildi.`);
            return res.status(400).json({ message: 'Kullanıcı onayı bilgileri eksik.' });
        }

        try {
            newConsentLog = new ConsentLog({
                userEmail: userEmailForLog,
                ipAddress: req.ip || req.socket?.remoteAddress || 'N/A',
                userAgent: req.headers['user-agent'] || 'N/A',
                documentType: 'LEGAL_TERMS_AGREEMENT',
                documentVersion: documentVersion, // Frontend'den gelen birleşik versiyon
                consentTimestampClient: new Date(consentTimestamp)
            });
            // Transaction kaydedildikten sonra transactionId eklenecek ve bu log da kaydedilecek.
        } catch (consentError) {
            console.error('ConsentLog nesnesi oluşturulurken hata:', consentError);
            // Bu kritik bir hata, işlemi devam ettirmemek daha iyi olabilir.
            return res.status(500).json({ message: 'Kullanıcı onayı işlenirken bir hata oluştu (log hazırlama).' });
        }

        // İşlemi veritabanında başlat
        newTransaction = new Transaction({
            templateId: template._id,
            templateName: template.name || 'İsimsiz Şablon',
            userEmail: userEmailForLog,
            status: 'initiated',
            amount: amount || template.price || 0,
            currency: currency || 'TRY',
        });
        await newTransaction.save(); // Önce Transaction'ı kaydet
        console.log(`Transaction ${newTransaction._id} initiated for template: ${template.name || 'Unknown'}.`);

        // Transaction ID'yi ConsentLog'a ekle ve kaydet
        if (newConsentLog) { // newConsentLog yukarıdaki try-catch'ten dolayı null olabilir.
            newConsentLog.transactionId = newTransaction._id;
            try {
                await newConsentLog.save();
                console.log(`ConsentLog ${newConsentLog._id} saved for transaction ${newTransaction._id}.`);
                // Transaction'a consentLogId eklenebilir (modelde varsa)
                // newTransaction.consentLogId = newConsentLog._id;
                // await newTransaction.save();
            } catch (consentSaveError) {
                 console.error('Error saving ConsentLog to DB:', consentSaveError);
                 // Bu kritik bir hata. Transaction'ı failed yapıp çıkalım.
                 newTransaction.status = 'failed';
                 newTransaction.errorMessage = 'Onay kaydı DB\'ye yazılamadı.';
                 await newTransaction.save();
                 return res.status(500).json({ message: 'Kullanıcı onay kaydı oluşturulurken bir sunucu hatası oluştu.' });
            }
        } else {
            // Bu duruma düşmemeliydik, eğer consentTimestamp ve documentVersion geldiyse.
            // Güvenlik için bir log ve hata.
            console.error("CRITICAL: newConsentLog is null even though consentTimestamp and documentVersion were provided.");
            newTransaction.status = 'failed';
            newTransaction.errorMessage = 'Kritik onay logu nesne hatası.';
            await newTransaction.save();
            return res.status(500).json({ message: 'Kritik onay işleme hatası.' });
        }


        // PDF Oluşturma
        const compiledTemplate = Handlebars.compile(template.content || '');
        const htmlContent = compiledTemplate(formData);
        const fullHtml = `
            <!DOCTYPE html><html><head><meta charset="utf-8" /><title>${template.name || 'Document'}</title>${pdfStyles}</head>
            <body><div>${htmlContent}</div></body></html>`;

        console.log(`Generating PDF buffer for transaction ${newTransaction._id}...`);
        pdfBuffer = await generatePdf(fullHtml);
        newTransaction.status = 'pdf_generated';
        await newTransaction.save();
        console.log(`PDF buffer generated for transaction ${newTransaction._id}.`);

        // Ödeme Simülasyonu
        const paymentSuccessful = true;
        if (!paymentSuccessful) {
            newTransaction.status = 'failed';
            newTransaction.errorMessage = 'Ödeme işlemi başarısız (simülasyon)';
            await newTransaction.save();
            console.error(`Payment failed (simulated) for transaction ${newTransaction._id}.`);
            return res.status(402).json({ message: 'Ödeme işlemi başarısız oldu.' });
        }
        console.log(`Payment successful (simulated) for transaction ${newTransaction._id}.`);

        safeFilename = turkceToLatin(template.name || 'Belge') + '.pdf';

        // E-posta Gönderimi
        if (userEmailForLog !== 'unknown@example.com' && pdfBuffer) {
            const emailSubject = `Belge Hızlı - ${template.name || 'Belge'} Belgeniz`;
            const emailHtml = `<p>Merhaba,</p><p>Belge Hızlı platformunu kullanarak oluşturduğunuz <strong>${template.name || 'Belge'}</strong> belgesi ektedir.</p><p>İyi günlerde kullanın!</p><br><p>Saygılarımızla,<br>Belge Hızlı Ekibi</p>`;
            const emailText = `Merhaba,\n\nBelge Hızlı platformunu kullanarak oluşturduğunuz ${template.name || 'Belge'} belgesi ektedir.\n\nİyi günlerde kullanın!\n\nSaygılarımızla,\nBelge Hızlı Ekibi`;

            console.log(`Initiating PDF email dispatch for transaction ${newTransaction._id} to ${userEmailForLog}`);
            sendPdfEmail(userEmailForLog, emailSubject, emailText, emailHtml, pdfBuffer, safeFilename)
                .then(async () => {
                     console.log(`PDF email dispatch successful for transaction ${newTransaction._id}.`);
                     try {
                         const trans = await Transaction.findById(newTransaction._id);
                         if (trans && trans.status !== 'completed' && trans.status !== 'failed') {
                            trans.status = 'email_sent';
                            await trans.save();
                         }
                     } catch (dbError) {
                         console.error(`Error updating transaction ${newTransaction._id} status after email success:`, dbError);
                     }
                 })
                .catch(async (emailError) => {
                    console.error(`Error during PDF email dispatch for transaction ${newTransaction._id}:`, emailError);
                     try {
                         const trans = await Transaction.findById(newTransaction._id);
                         if (trans) {
                             trans.errorMessage = (trans.errorMessage ? trans.errorMessage + '; ' : '') + 'E-posta gönderim hatası: ' + emailError.message;
                             await trans.save();
                         }
                     } catch (dbError) {
                          console.error(`Error updating transaction ${newTransaction._id} status after email failure:`, dbError);
                     }
                });
        } else {
            console.log(`PDF email skipped for transaction ${newTransaction._id} (no valid email or PDF buffer).`);
        }
        
        // Fatura Kaydı Oluşturma
        // billingInfo'nun varlığını, boş obje olmadığını ve billingInfo.email'in de varlığını kontrol et
        if (billingInfo && Object.keys(billingInfo).length > 0 && billingInfo.email && userEmailForLog !== 'unknown@example.com') {
            try {
                console.log(`Creating invoice record for transaction ${newTransaction._id}...`);
                newInvoice = new Invoice({
                    transactionId: newTransaction._id,
                    templateName: template.name || 'İsimsiz Şablon',
                    status: 'pending_creation',
                    amount: amount || template.price || 0,
                    currency: currency || 'TRY',
                    billingType: billingInfo.billingType,
                    customerName: billingInfo.billingType === 'bireysel' ? billingInfo.name : undefined,
                    customerTckn: billingInfo.billingType === 'bireysel' ? billingInfo.tckn : undefined,
                    companyName: billingInfo.billingType === 'kurumsal' ? billingInfo.companyName : undefined,
                    taxOffice: billingInfo.billingType === 'kurumsal' ? billingInfo.taxOffice : undefined,
                    taxId: billingInfo.billingType === 'kurumsal' ? billingInfo.vkn : undefined,
                    customerAddress: billingInfo.address,
                    customerEmail: billingInfo.email, // Fatura için bu e-posta kullanılacak
                });
                await newInvoice.save();
                console.log(`Invoice ${newInvoice._id} created for transaction ${newTransaction._id}.`);
                
                newTransaction.invoiceId = newInvoice._id;
                await newTransaction.save(); 
            } catch (invoiceError) {
                console.error(`Error creating invoice record for transaction ${newTransaction._id}:`, invoiceError);
                if(newTransaction){
                    newTransaction.errorMessage = (newTransaction.errorMessage ? newTransaction.errorMessage + '; ' : '') + 'Fatura kaydı oluşturma hatası: ' + invoiceError.message;
                    await newTransaction.save();
                }
            }
        } else {
             console.log(`Invoice creation skipped for transaction ${newTransaction._id} (no valid billing info/email).`);
        }

        // İşlem tamamlandı durumunu ayarla
        if (newTransaction && newTransaction.status !== 'failed' && !newTransaction.errorMessage) {
             newTransaction.status = 'completed';
             await newTransaction.save();
        }

        // PDF'i kullanıcıya gönder
        if (pdfBuffer) {
            console.log(`Sending PDF response to client for transaction ${newTransaction?._id || 'N/A'}...`);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
            res.send(pdfBuffer);
            console.log(`PDF response sent for transaction ${newTransaction?._id || 'N/A'}.`);
        } else if (!res.headersSent) {
             console.error(`Could not send PDF response. PDF Buffer does not exist for transaction ${newTransaction?._id || 'N/A'}.`);
             if(newTransaction){
                 newTransaction.status = 'failed';
                 newTransaction.errorMessage = (newTransaction.errorMessage ? newTransaction.errorMessage + '; ' : '') + 'PDF Buffer oluşturulamadı (yanıt gönderilemedi).';
                 await newTransaction.save();
             }
             res.status(500).json({ message: 'PDF oluşturulamadı (Buffer yok).' });
        }

    } catch (error) {
        console.error(`General error in /process-payment for transaction ${newTransaction?._id || 'N/A'} (Template: ${template?.name || 'Unknown'}):`, error);
        // Transaction'ı 'failed' olarak işaretle (eğer oluşturulduysa)
        if (newTransaction && newTransaction._id && newTransaction.status !== 'failed') {
            try {
                 newTransaction.status = 'failed';
                 newTransaction.errorMessage = (newTransaction.errorMessage ? newTransaction.errorMessage + '; ' : '') + 'Genel İşlem Hatası: ' + error.message;
                 await newTransaction.save();
            } catch (dbError) {
                 console.error(`Error updating transaction ${newTransaction._id} status to failed after general error:`, dbError);
            }
        }
        // ConsentLog'a transactionId eklemeye çalış (eğer her ikisi de oluştuysa ve bağlanmadıysa)
        if (newConsentLog && !newConsentLog.transactionId && newTransaction && newTransaction._id) {
            try {
                newConsentLog.transactionId = newTransaction._id;
                await newConsentLog.save();
                 console.log(`ConsentLog ${newConsentLog._id} force-saved with transactionId after general error.`);
            } catch (consentSaveError) {
                console.error('Error force-saving ConsentLog with transactionId after general error:', consentSaveError);
            }
        }
        if (!res.headersSent) {
            res.status(500).json({ message: error.message || 'Belge işlenirken bir sunucu hatası oluştu.' });
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
            { loc: 'https://www.belgehizli.com/on-bilgilendirme-formu', changefreq: 'monthly', priority: '0.5' },

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
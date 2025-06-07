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
// backend/pdf-generator/pdfGenerator.js
const axios = require('axios');

// Browserless API anahtarını ortam değişkeninden al
const BROWSERLESS_API_KEY = process.env.BROWSERLESS_API_KEY;
const BROWSERLESS_API_URL = `https://chrome.browserless.io/pdf?token=${BROWSERLESS_API_KEY}`;

async function generatePdf(htmlContent, options = {}) {
    if (!BROWSERLESS_API_KEY) {
        console.error("Hata: BROWSERLESS_API_KEY ortam değişkeni tanımlanmamış!");
        throw new Error("PDF oluşturma servisi yapılandırılamadı.");
    }

    console.log("Sending request to Browserless API...");

    try {
        const response = await axios.post(
            BROWSERLESS_API_URL,
            {
                html: htmlContent, // Gönderilecek HTML içeriği
                options: {        // PDF oluşturma seçenekleri
                    format: 'A4',
                    printBackground: true,
                    margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
                    // Browserless'a özel veya Puppeteer'ın desteklediği diğer opsiyonlar eklenebilir
                     waitUntil: 'networkidle0', // İçerik yüklenmesini bekle
                     timeout: 60000, // İstek için timeout (ms)
                    ...options // Fonksiyona dışarıdan gelen ek opsiyonlar
                }
            },
            {
                responseType: 'arraybuffer', // Yanıtı buffer olarak almak için ÇOK ÖNEMLİ
                timeout: 70000 // Axios isteği için genel timeout (API timeout'undan biraz fazla)
            }
        );

        console.log("Received response from Browserless API. Status:", response.status);
        // Yanıt doğrudan PDF buffer'ını içerecek
        return response.data;

    } catch (error) {
        console.error("Error calling Browserless API:", error.response?.data?.toString() || error.message);
        // Hata detayını logla (eğer text ise)
        throw new Error(`PDF oluşturulurken harici serviste hata oluştu: ${error.message}`);
    }
}

module.exports = { generatePdf };
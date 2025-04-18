// backend/pdf-generator/pdfGenerator.js
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

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
                html: htmlContent,
                options: { // PDF oluşturma seçenekleri
                    format: 'A4',
                    printBackground: true,
                    margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
                    // waitUntil: 'networkidle0', // <-- BU SATIRI KALDIRDIK/YORUM YAPTIK
                    timeout: 60000, // PDF oluşturma için timeout (Browserless bunu destekliyor olabilir)
                    ...options // Dışarıdan gelen ek opsiyonlar
                }
            },
            {
                responseType: 'arraybuffer',
                timeout: 70000 // Axios isteği için genel timeout
            }
        );

        console.log("Received response from Browserless API. Status:", response.status);
        return response.data;

    } catch (error) {
        console.error("Error calling Browserless API:", error.response?.data?.toString() || error.message);
        throw new Error(`PDF oluşturulurken harici serviste hata oluştu: ${error.message}`);
    }
}
module.exports = { generatePdf };
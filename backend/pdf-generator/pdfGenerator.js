// backend/pdf-generator/pdfGenerator.js
const puppeteer = require('puppeteer');

async function generatePdf(htmlContent, options = {}) {
    console.log("Launching Puppeteer...");
    let browser = null;
    try {
        browser = await puppeteer.launch({
            headless: true,
            protocolTimeout: 60000, // <-- Timeout süresini 60 saniyeye çıkar (60000 ms)
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-zygote',
                // Render'daki kaynak kısıtlamaları için ek argümanlar (denenebilir):
                '--disable-features=site-per-process', // İşlem sayısını azaltabilir
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-default-browser-check',
                '--disable-extensions'
            ]
        });
        console.log("Browser launched successfully.");

        const page = await browser.newPage();
        console.log("New page created.");
        // Sayfa işlemleri için de timeout ayarlayabiliriz (opsiyonel)
        // page.setDefaultNavigationTimeout(60000);
        // page.setDefaultTimeout(60000);

        await page.setContent(htmlContent, { waitUntil: 'networkidle0', timeout: 60000 }); // setContent için de timeout
        console.log("Content set on page.");

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
            timeout: 60000, // PDF oluşturma için de timeout
            ...options,
        });
        console.log("PDF buffer generated.");

        await browser.close();
        console.log("Browser closed.");
        return pdfBuffer;

    } catch (error) {
        console.error("Error during PDF generation:", error);
        if (browser) {
            console.log("Closing browser due to error...");
            await browser.close();
        }
        throw error;
    }
}

module.exports = { generatePdf };
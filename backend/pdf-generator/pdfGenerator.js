// backend/pdf-generator/pdfGenerator.js
const puppeteer = require('puppeteer');

async function generatePdf(htmlContent, options = {}) {
    console.log("Launching Puppeteer..."); // Başlatma öncesi log
    let browser = null; // browser değişkenini try dışında tanımla
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu', // Bazı ortamlarda GPU sorunlarını önler
                '--no-zygote', // Bazen yardımcı olabilir
                // '--single-process' // Bunu şimdilik çıkaralım, bazen sorun yaratabilir
            ]
            // executablePath BELİRTMİYORUZ
        });
        console.log("Browser launched successfully.");

        const page = await browser.newPage();
        console.log("New page created.");
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        console.log("Content set on page.");

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
            ...options,
        });
        console.log("PDF buffer generated.");

        await browser.close();
        console.log("Browser closed.");
        return pdfBuffer;

    } catch (error) {
        console.error("Error during PDF generation:", error); // Hatayı detaylı logla
        if (browser) {
            console.log("Closing browser due to error...");
            await browser.close(); // Hata durumunda tarayıcıyı kapatmayı dene
        }
        throw error; // Hatayı tekrar fırlat ki routes yakalayabilsin
    }
}

module.exports = { generatePdf };
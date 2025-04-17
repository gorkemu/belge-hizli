// backend/pdf-generator/pdfGenerator.js
const puppeteer = require('puppeteer');

async function generatePdf(htmlContent, options = {}) {
    const browser = await puppeteer.launch({
        headless: true, // veya 'new'
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH, // ENV'den yolu al
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage', // Önemli olabilir
            '--single-process' // Denenebilir
        ]
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
        ...options,
    });

    await browser.close();
    return pdfBuffer;
}

module.exports = { generatePdf };
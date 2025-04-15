const puppeteer = require('puppeteer');

async function generatePdf(htmlContent, options = {}) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' }); // Tüm kaynakların yüklenmesini bekle

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true, // Arka plan renklerini ve resimleri dahil et
        margin: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm',
        },
        ...options,
    });

    await browser.close();
    return pdfBuffer;
}

module.exports = { generatePdf };
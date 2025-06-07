// backend/utils/documentService.js
const mongoose = require('mongoose');
const Template = require('../models/template');
const Transaction = require('../models/transaction');
const Invoice = require('../models/invoice'); // Fatura için
const { generatePdf } = require('../pdf-generator/pdfGenerator');
const { sendPdfEmail } = require('../utils/mailer');
const path = require('path');
const fs = require('fs');
const Handlebars = require('handlebars'); // Handlebars'ı burada da kullanacağız

// --- Helper Fonksiyonlar (templates.js'den kopyalandı, gerekirse ortak bir utils dosyasına taşınabilir) ---
const cssFilePath = path.join(__dirname, '..', 'styles', 'pdfStyles.css');
let pdfStyles = '';
try {
    const cssContent = fs.readFileSync(cssFilePath, 'utf8');
    pdfStyles = `<style>\n${cssContent}\n</style>`;
} catch (error) {
    console.error(`documentService: PDF stilleri CSS dosyasını okuma hatası: ${cssFilePath}`, error);
}

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

Handlebars.registerHelper('formatDate', function(dateString) {
    if (!dateString || typeof dateString !== 'string') return '';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    } catch (e) { return dateString; }
});
// Diğer Handlebars helper'ları (eq, gt, default, math) buraya da eklenebilir.
// --- Helper Fonksiyonlar Sonu ---


// --- YENİ: PDF Oluşturma Fonksiyonu ---
/**
 * Verilen Transaction ve Template için PDF buffer'ını oluşturur.
 * @param {object} transaction Transaction dokümanı
 * @param {object} template Template dokümanı
 * @param {object} formDataKullanilacak Form verisi
 * @returns {Promise<{pdfBuffer: Buffer, safeFilename: string} | null>}
 */
const createPdfForTransaction = async (transaction, template, formDataKullanilacak) => {
    try {
        const compiledTemplate = Handlebars.compile(template.content || '');
        const htmlContent = compiledTemplate(formDataKullanilacak);
        const fullHtml = `
            <!DOCTYPE html><html><head><meta charset="utf-8" /><title>${template.name || 'Document'}</title>${pdfStyles}</head>
            <body><div>${htmlContent}</div></body></html>`;

        console.log(`createPdfForTransaction: Generating PDF for transaction ${transaction._id}...`);
        const pdfBuffer = await generatePdf(fullHtml);
        const safeFilename = turkceToLatin(template.name || 'Belge') + '.pdf';
        console.log(`createPdfForTransaction: PDF generated for transaction ${transaction._id}. Filename: ${safeFilename}`);
        return { pdfBuffer, safeFilename };
    } catch (error) {
        console.error(`createPdfForTransaction: Error generating PDF for transaction ${transaction._id}:`, error);
        // Transaction'a hata yazılabilir
        if (transaction) {
            transaction.errorMessage = (transaction.errorMessage || '') + '; PDF oluşturma hatası (servis_pdf): ' + error.message;
            // transaction.status = 'failed'; // Durumu burada değiştirmeyelim, çağıran karar versin
            await transaction.save();
        }
        return null;
    }
};
// --- YENİ PDF OLUŞTURMA FONKSİYONU SONU ---

const generateAndDeliverDocument = async (transactionId) => {
    let transaction;
    let template;
    let userEmailForDelivery = null;
    let formDataToUse = null; 
    let billingInfoToUse = null; 

    try {
        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            console.error(`documentService: Geçersiz transactionId formatı: ${transactionId}`);
            return { success: false, message: 'Geçersiz işlem ID formatı.' };
        }

        transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            console.error(`documentService: Transaction bulunamadı. ID: ${transactionId}`);
            return { success: false, message: 'İşlem bulunamadı.' };
        }

        // Durum kontrolü
        if (transaction.status !== 'payment_successful') {
             console.warn(`documentService: Transaction ${transactionId} ödeme başarılı değil veya zaten işleniyor/işlenmiş. Mevcut durum: ${transaction.status}`);
             if (['pdf_generated', 'email_sent', 'completed', 'failed'].includes(transaction.status)) {
                // Eğer PDF zaten üretilmişse ve indirme isteniyorsa, bu fonksiyon değil, yeni /download endpointi çağrılmalı.
                // Bu fonksiyon sadece ilk üretim ve gönderim için.
                return { success: true, message: `İşlem daha önce işlenmiş veya ödeme başarılı değil: ${transaction.status}`, status: transaction.status };
             }
             return { success: false, message: `İşlem ödeme bekliyor veya başarısız/başlatılmamış: ${transaction.status}` };
        }

        template = await Template.findById(transaction.templateId);
        if (!template) {
            transaction.status = 'failed';
            transaction.errorMessage = 'Belge şablonu bulunamadı (servis).';
            await transaction.save();
            console.error(`documentService: Şablon bulunamadı. Transaction ID: ${transactionId}, Template ID: ${transaction.templateId}`);
            return { success: false, message: 'Belge şablonu bulunamadı.' };
        }

        // --- Snapshot'lardan veriyi al ---
        if (!transaction.formDataSnapshot) {
            transaction.status = 'failed';
            transaction.errorMessage = 'Belge oluşturmak için form verisi (snapshot) bulunamadı.';
            await transaction.save();
            console.error(`documentService: formDataSnapshot eksik. Transaction ID: ${transactionId}`);
            return { success: false, message: 'Belge oluşturmak için gerekli form verisi eksik.' };
        }
        try {
            formDataToUse = JSON.parse(transaction.formDataSnapshot);
        } catch (parseError) {
            transaction.status = 'failed';
            transaction.errorMessage = 'Form verisi (snapshot) parse edilemedi.';
            await transaction.save();
            console.error(`documentService: formDataSnapshot parse hatası. Transaction ID: ${transactionId}`, parseError);
            return { success: false, message: 'Kaydedilmiş form verisi bozuk.' };
        }

        if (transaction.billingInfoSnapshot) {
            try {
                billingInfoToUse = JSON.parse(transaction.billingInfoSnapshot);
            } catch (parseError) {
                // Fatura bilgisi parse edilemezse bu kritik bir hata değil, loglayıp devam edebiliriz.
                // Fatura oluşturma atlanacaktır.
                console.warn(`documentService: billingInfoSnapshot parse hatası. Transaction ID: ${transactionId}`, parseError);
                transaction.errorMessage = (transaction.errorMessage || '') + '; Fatura bilgisi (snapshot) parse edilemedi.';
                // status'u failed yapmayalım, sadece fatura oluşturulamaz.
            }
        }

        userEmailForDelivery = billingInfoToUse?.email || formDataToUse?.belge_email || transaction.userEmail;

        // PDF Oluşturma
        const pdfResult = await createPdfForTransaction(transaction, template, formDataToUse);

        if (!pdfResult || !pdfResult.pdfBuffer) {
            // createPdfForTransaction içinde hata zaten loglandı ve transaction'a işlendi (eğer transaction objesi varsa)
            // transaction.status = 'failed'; // createPdfForTransaction içinde status değişmiyor, burada yapalım
            // transaction.errorMessage = (transaction.errorMessage || '') + '; PDF oluşturulamadı (ana servis).';
            // await transaction.save(); // createPdfForTransaction içinde save yapıldıysa gerek yok.
            return { success: false, message: 'PDF oluşturulamadı.' };
        }
        transaction.status = 'pdf_generated'; // PDF başarıyla oluşturuldu
        await transaction.save();
        console.log(`documentService: PDF buffer obtained for transaction ${transaction._id}.`);
        // --- PDF OLUŞTURMA SONU ---

        // E-posta Gönderimi (pdfResult.pdfBuffer ve pdfResult.safeFilename kullanılır)
        if (userEmailForDelivery && userEmailForDelivery !== 'unknown@example.com' && pdfResult.pdfBuffer) {
            // ... (e-posta gönderme mantığı aynı kalır, pdfResult'tan gelenleri kullanır) ...
            const emailSubject = `Belge Hızlı - ${template.name || 'Belge'} Belgeniz`;
            const emailHtml = `<p>Merhaba,</p><p>Belge Hızlı platformunu kullanarak oluşturduğunuz <strong>${template.name || 'Belge'}</strong> belgesi ektedir.</p><p>İyi günlerde kullanın!</p><br><p>Saygılarımızla,<br>Belge Hızlı Ekibi</p>`;
            const emailText = `Merhaba,\n\nBelge Hızlı platformunu kullanarak oluşturduğunuz ${template.name || 'Belge'} belgesi ektedir.\n\nİyi günlerde kullanın!\n\nSaygılarımızla,\nBelge Hızlı Ekibi`;

            console.log(`documentService: Initiating PDF email dispatch for transaction ${transaction._id} to ${userEmailForDelivery}`);
            try {
                await sendPdfEmail(userEmailForDelivery, emailSubject, emailHtml, emailHtml, pdfResult.pdfBuffer, pdfResult.safeFilename);
                transaction.status = 'email_sent';
                await transaction.save();
            } catch (emailError) {
                console.error(`documentService: Error during PDF email dispatch for transaction ${transaction._id}:`, emailError);
                transaction.errorMessage = (transaction.errorMessage ? transaction.errorMessage + '; ' : '') + 'E-posta gönderim hatası (servis): ' + emailError.message;
                await transaction.save();
            }
        } else {
            console.log(`documentService: PDF email skipped for transaction ${transaction._id} (no valid email or PDF buffer).`);
        }

        // Fatura Kaydı Oluşturma
        // ... (Fatura kaydı oluşturma mantığı aynı kalır, billingInfoToUse kullanılır) ...
        if (billingInfoToUse && Object.keys(billingInfoToUse).length > 0 && billingInfoToUse.email && !transaction.invoiceId) {
            try {
                console.log(`documentService: Creating invoice record for transaction ${transaction._id}...`);
                const newInvoice = new Invoice({
                    transactionId: transaction._id,
                    templateName: template.name || 'İsimsiz Şablon',
                    status: 'pending_creation',
                    amount: transaction.amount,
                    currency: transaction.currency,
                    billingType: billingInfoToUse.billingType,
                    customerName: billingInfoToUse.billingType === 'bireysel' ? billingInfoToUse.name : undefined,
                    customerTckn: billingInfoToUse.billingType === 'bireysel' ? billingInfoToUse.tckn : undefined,
                    companyName: billingInfoToUse.billingType === 'kurumsal' ? billingInfoToUse.companyName : undefined,
                    taxOffice: billingInfoToUse.billingType === 'kurumsal' ? billingInfoToUse.taxOffice : undefined,
                    taxId: billingInfoToUse.billingType === 'kurumsal' ? billingInfoToUse.vkn : undefined,
                    customerAddress: billingInfoToUse.address,
                    customerEmail: billingInfoToUse.email,
                });
                await newInvoice.save();
                console.log(`documentService: Invoice ${newInvoice._id} created for transaction ${transaction._id}.`);
                transaction.invoiceId = newInvoice._id;
                await transaction.save();
            } catch (invoiceError) {
                console.error(`documentService: Error creating invoice record for transaction ${transaction._id}:`, invoiceError);
                transaction.errorMessage = (transaction.errorMessage ? transaction.errorMessage + '; ' : '') + 'Fatura kaydı oluşturma hatası (servis): ' + invoiceError.message;
                await transaction.save();
            }
        } else if (transaction.invoiceId) {
            console.log(`documentService: Invoice already exists or no billing info for transaction ${transaction._id}.`);
        }


        // İşlem tamamlandı durumunu ayarla
        if (transaction.status !== 'failed') {
             transaction.status = 'completed';
             await transaction.save();
        }

        return { success: true, message: 'Belge başarıyla işlendi.', status: transaction.status };

    } catch (error) {
        // ... (Genel hata yönetimi aynı kalır) ...
        console.error(`documentService: General error processing document for transaction ${transactionId || 'N/A'}:`, error);
        if (transaction && transaction._id && transaction.status !== 'failed') {
            try {
                 transaction.status = 'failed';
                 transaction.errorMessage = (transaction.errorMessage ? transaction.errorMessage + '; ' : '') + 'Belge işleme genel hata (servis): ' + error.message;
                 await transaction.save();
            } catch (dbError) {
                 console.error(`documentService: Error updating transaction ${transactionId} to failed after general error:`, dbError);
            }
        }
        return { success: false, message: error.message || 'Belge işlenirken bir sunucu hatası oluştu.' };
    }
};

module.exports = { generateAndDeliverDocument, createPdfForTransaction }; 

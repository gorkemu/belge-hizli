// backend/routes/payment.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Template = require('../models/template');
const Transaction = require('../models/transaction');
const ConsentLog = require('../models/consentLog');
// --- YENİ: Document Service'i import et ---
const { generateAndDeliverDocument } = require('../utils/documentService');
// --- YENİ SON ---

// POST /api/payment/initiate/:templateId
router.post('/initiate/:templateId', async (req, res) => {
    let template = null;
    let userEmailForLog = null;
    let newTransaction = null;
    let newConsentLog = null;

    try {
        const templateId = req.params.templateId;
        if (!mongoose.Types.ObjectId.isValid(templateId)) {
            return res.status(400).json({ message: 'Geçersiz şablon ID formatı.' });
        }
        template = await Template.findById(templateId);
        if (!template) {
            return res.status(404).json({ message: 'Şablon bulunamadı.' });
        }

        const { formData, billingInfo, amount, currency, consentTimestamp, documentVersion } = req.body;
        if (!formData || typeof formData !== 'object' || Object.keys(formData).length === 0) {
            return res.status(400).json({ message: 'Belge oluşturmak için gerekli form verileri eksik.' });
        }
        userEmailForLog = billingInfo?.email || formData?.belge_email || 'unknown@example.com';
        if (userEmailForLog === 'unknown@example.com' && !billingInfo) {
            return res.status(400).json({ message: 'Lütfen geçerli bir e-posta adresi girin.' });
        }
        if (!consentTimestamp || !documentVersion) {
            return res.status(400).json({ message: 'Kullanıcı onayı bilgileri eksik.' });
        }

        try {
            newConsentLog = new ConsentLog({ /* ... consent log fields ... */
                userEmail: userEmailForLog,
                ipAddress: req.ip || req.socket?.remoteAddress || 'N/A',
                userAgent: req.headers['user-agent'] || 'N/A',
                documentType: 'LEGAL_TERMS_AGREEMENT',
                documentVersion: documentVersion,
                consentTimestampClient: new Date(consentTimestamp)
            });
        } catch (consentError) {
            console.error('ConsentLog nesnesi oluşturulurken hata:', consentError);
            return res.status(500).json({ message: 'Kullanıcı onayı işlenirken bir hata oluştu (log hazırlama).' });
        }

        const transactionAmount = amount !== undefined ? amount : (template.price || 0);
        const transactionCurrency = currency || 'TRY';
        newTransaction = new Transaction({ /* ... transaction fields ... */
            templateId: template._id,
            templateName: template.name || 'İsimsiz Şablon',
            userEmail: userEmailForLog,
            status: 'payment_pending',
            amount: transactionAmount,
            currency: transactionCurrency,
            formDataSnapshot: JSON.stringify(formData),
            billingInfoSnapshot: billingInfo ? JSON.stringify(billingInfo) : undefined,
        });
        await newTransaction.save();
        console.log(`Transaction ${newTransaction._id} initiated with status 'payment_pending' for template: ${template.name}.`);

        if (newConsentLog) {
            newConsentLog.transactionId = newTransaction._id;
            try {
                await newConsentLog.save();
                console.log(`ConsentLog ${newConsentLog._id} saved for transaction ${newTransaction._id}.`);
            } catch (consentSaveError) {
                 console.error('Error saving ConsentLog to DB:', consentSaveError);
                 newTransaction.status = 'failed';
                 newTransaction.errorMessage = 'Onay kaydı DB\'ye yazılamadı (ödeme başlatma).';
                 await newTransaction.save();
                 return res.status(500).json({ message: 'Kullanıcı onay kaydı oluşturulurken bir sunucu hatası oluştu.' });
            }
        } else {
            console.error("CRITICAL: newConsentLog is null after validation in /payment/initiate.");
            newTransaction.status = 'failed';
            newTransaction.errorMessage = 'Kritik onay logu nesne hatası (ödeme başlatma).';
            await newTransaction.save();
            return res.status(500).json({ message: 'Kritik onay işleme hatası.' });
        }

        const simulatedGatewayPaymentRef = `PARAM_SIM_${newTransaction._id}_${Date.now()}`;
        const paymentPageUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/odeme-simulasyonu/${newTransaction._id}?ref=${simulatedGatewayPaymentRef}`;
        newTransaction.paymentGatewayRef = simulatedGatewayPaymentRef;
        await newTransaction.save();
        console.log(`Simulated payment page URL created for transaction ${newTransaction._id}: ${paymentPageUrl}`);
        res.status(200).json({
            message: 'Ödeme başlatma başarılı. Lütfen ödeme sayfasına yönlenin.',
            transactionId: newTransaction._id,
            paymentPageUrl: paymentPageUrl,
            gatewayPaymentRef: simulatedGatewayPaymentRef
        });
    } catch (error) {
        console.error(`Error in /payment/initiate for template ${template?._id || 'N/A'}:`, error);
        if (newTransaction && newTransaction._id && newTransaction.status !== 'failed') {
            try {
                 newTransaction.status = 'failed';
                 newTransaction.errorMessage = (newTransaction.errorMessage || '') + 'Ödeme başlatma hatası: ' + error.message;
                 await newTransaction.save();
            } catch (dbError) {
                 console.error(`Error updating transaction ${newTransaction._id} status to failed after general error in /payment/initiate:`, dbError);
            }
        }
        if (!res.headersSent) {
            res.status(500).json({ message: error.message || 'Ödeme başlatılırken bir sunucu hatası oluştu.' });
        }
    }
});


// --- YENİ: ÖDEME CALLBACK ENDPOINT'İ ---
// POST /api/payment/callback
router.post('/callback', async (req, res) => {
    // Gerçek bir entegrasyonda, bu isteğin ParamPOS'tan geldiğini doğrulamak için
    // IP whitelist, hash/imza kontrolü gibi güvenlik önlemleri alınmalıdır.
    // Şimdilik simülasyon olduğu için bu adımları atlıyoruz.

    const { transactionId, status, gatewayReferenceId, paymentDate, amount: callbackAmount } = req.body;
    console.log(`Received payment callback for transactionId: ${transactionId}, status: ${status}, ref: ${gatewayReferenceId}`);

    if (!transactionId || !status) {
        console.error('Payment callback error: Missing transactionId or status.');
        return res.status(400).json({ message: 'Eksik parametre: transactionId veya status.' });
    }

    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
        console.error(`Payment callback error: Invalid transactionId format: ${transactionId}`);
        return res.status(400).json({ message: 'Geçersiz işlem ID formatı.' });
    }

    let transaction;
    try {
        transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            console.error(`Payment callback error: Transaction not found with ID: ${transactionId}`);
            // ParamPOS'a hata bildirmek yerine, sadece 404 dönmek daha iyi olabilir.
            // Veya işlemi aldık ama işleyemedik anlamında 200 dönüp loglamak.
            // Şimdilik 404 dönelim.
            return res.status(404).json({ message: 'İşlem bulunamadı.' });
        }

        // İşlem zaten tamamlanmış veya iptal edilmişse tekrar işlem yapma
        if (['completed', 'failed', 'payment_successful', 'payment_failed'].includes(transaction.status)) {
            console.log(`Payment callback: Transaction ${transactionId} already processed. Current status: ${transaction.status}`);
            return res.status(200).json({ message: 'İşlem daha önce işlenmiş.', currentStatus: transaction.status });
        }

        if (status === 'success') {
            transaction.status = 'payment_successful';
            // Gerçek entegrasyonda gatewayReferenceId, paymentDate, callbackAmount gibi bilgiler de kaydedilebilir.
            if (gatewayReferenceId) transaction.paymentGatewayRef = gatewayReferenceId; // Gelen referansı kaydet
            // transaction.paymentActualAmount = callbackAmount; // Ödenen gerçek tutar (eğer farklıysa)
            // transaction.paymentDate = paymentDate ? new Date(paymentDate) : new Date();

            await transaction.save();
            console.log(`Transaction ${transactionId} status updated to 'payment_successful'.`);

            // Asenkron olarak belge oluşturma ve gönderme işlemini tetikle
            // Bu kısım, frontend'e yanıt döndükten sonra arka planda çalışacak.
            // Hata olursa documentService içinde transaction durumu güncellenecek.
            generateAndDeliverDocument(transactionId)
                .then(result => {
                    console.log(`Document service result for transaction ${transactionId}:`, result.message);
                    // Burada transaction durumu zaten documentService içinde güncelleniyor olacak.
                })
                .catch(serviceError => {
                    // Bu catch bloğu normalde generateAndDeliverDocument içindeki try-catch tarafından yakalanmalı.
                    // Ancak beklenmedik bir hata olursa diye burada da loglayalım.
                    console.error(`CRITICAL: Unhandled error from documentService for transaction ${transactionId}:`, serviceError);
                    // Transaction'ı tekrar failed yapmaya çalışabiliriz.
                    Transaction.findById(transactionId).then(async t => {
                        if (t && t.status !== 'failed') {
                            t.status = 'failed';
                            t.errorMessage = (t.errorMessage || '') + '; Belge servisi kritik hata: ' + serviceError.message;
                            await t.save();
                        }
                    }).catch(dbErr => console.error('Error marking transaction as failed after service critical error:', dbErr));
                });

            // ParamPOS'a (veya simülasyon frontend'ine) işlemin alındığını bildir.
            // Gerçek PDF oluşturma ve gönderme asenkron devam edecek.
            res.status(200).json({ message: 'Ödeme callback başarıyla işlendi. Belge oluşturuluyor.' });

        } else if (status === 'failure') {
            transaction.status = 'payment_failed';
            transaction.errorMessage = (transaction.errorMessage || '') + 'Ödeme ağ geçidi tarafından başarısız olarak bildirildi.';
            if (gatewayReferenceId) transaction.paymentGatewayRef = gatewayReferenceId;
            await transaction.save();
            console.log(`Transaction ${transactionId} status updated to 'payment_failed'.`);
            res.status(200).json({ message: 'Ödeme callback (başarısız) başarıyla işlendi.' });
        } else {
            console.warn(`Payment callback: Unknown status '${status}' for transactionId: ${transactionId}`);
            res.status(400).json({ message: `Bilinmeyen durum: ${status}` });
        }

    } catch (error) {
        console.error(`Error processing payment callback for transactionId ${transactionId}:`, error);
        // Bu genel bir sunucu hatası, ParamPOS'a 500 dönülebilir veya
        // işlemi aldık ama işleyemedik diye 200 dönüp loglamak daha iyi olabilir.
        // Şimdilik 500 dönelim.
        res.status(500).json({ message: 'Callback işlenirken sunucu hatası oluştu.' });
    }
});
// --- YENİ CALLBACK ENDPOINT'İ SONU ---


module.exports = router;
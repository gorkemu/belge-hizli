// backend/routes/document.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Transaction = require('../models/transaction');
const Template = require('../models/template');
// PDF oluşturma fonksiyonunu documentService'den import et
const { createPdfForTransaction } = require('../utils/documentService');

// GET /api/document/download/:transactionId
router.get('/download/:transactionId', async (req, res) => {
    try {
        const transactionId = req.params.transactionId;
        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            return res.status(400).json({ message: 'Geçersiz işlem ID formatı.' });
        }

        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: 'İşlem kaydı bulunamadı.' });
        }

        // Sadece tamamlanmış veya e-postası gönderilmiş veya en azından PDF'i üretilmiş işlemler için indirme izni ver
        if (!['completed', 'email_sent', 'pdf_generated'].includes(transaction.status)) {
            return res.status(403).json({ message: 'Bu belge için indirme işlemi henüz hazır değil veya yetkiniz yok.' });
        }

        const template = await Template.findById(transaction.templateId);
        if (!template) {
            return res.status(404).json({ message: 'İşleme ait şablon bulunamadı.' });
        }

        if (!transaction.formDataSnapshot) {
            return res.status(500).json({ message: 'İşleme ait form verisi bulunamadı.' });
        }
        
        let formDataToUse;
        try {
            formDataToUse = JSON.parse(transaction.formDataSnapshot);
        } catch (e) {
            return res.status(500).json({ message: 'Form verisi okunamadı.' });
        }

        // PDF'i (yeniden) oluştur
        // Cache mekanizması yoksa her seferinde oluşturulacak.
        // İdealde, generateAndDeliverDocument PDF'i bir yere kaydedip (örn. S3 veya GridFS)
        // path'ini transaction'a yazmalı, bu endpoint de oradan okumalı.
        // Şimdilik her istekte yeniden oluşturuyoruz.
        const pdfResult = await createPdfForTransaction(transaction, template, formDataToUse);

        if (pdfResult && pdfResult.pdfBuffer) {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition'); // <-- ÖNEMLİ: CORS için bu başlığa erişim izni ver
            res.setHeader('Content-Disposition', `attachment; filename="${pdfResult.safeFilename}"`);
            res.send(pdfResult.pdfBuffer);
        } else {
            console.error("Backend: pdfResult or pdfResult.pdfBuffer is missing.");
            res.status(500).json({ message: 'PDF oluşturulurken bir hata oluştu veya PDF bulunamadı.' });
        }

    } catch (error) {
        console.error(`Error in /document/download/${req.params.transactionId}:`, error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Belge indirilirken bir sunucu hatası oluştu.' });
        }
    }
});

module.exports = router;
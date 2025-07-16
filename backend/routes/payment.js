// backend/routes/payment.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const crypto = require('crypto'); // Hash için crypto modülü
const axios = require('axios'); // SOAP/HTTP istekleri için
// const xml2js = require('xml2js'); // Opsiyonel: XML parse etmek için daha sağlam bir yöntem

const Template = require('../models/template');
const Transaction = require('../models/transaction');
const ConsentLog = require('../models/consentLog');
const Invoice = require('../models/invoice');
const { generateAndDeliverDocument } = require('../utils/documentService');

// --- Ortam Değişkenlerinden Param Bilgilerini Al ---
const PARAM_CLIENT_CODE = process.env.PARAM_CLIENT_CODE;
const PARAM_CLIENT_USERNAME = process.env.PARAM_CLIENT_USERNAME;
const PARAM_CLIENT_PASSWORD = process.env.PARAM_CLIENT_PASSWORD;
const PARAM_GUID = process.env.PARAM_GUID; // Hem ST_WS_Guvenlik içinde hem de Hash için "Üye İş yerine ait Anahtar"

const PARAM_API_TEST_URL = process.env.PARAM_API_TEST_URL || "https://testposws.param.com.tr/turkpos.ws/service_turkpos_prod.asmx";
const PARAM_PAYMENT_PAGE_BASE_URL_TEST = process.env.PARAM_PAYMENT_PAGE_BASE_URL_TEST || "https://testpos.param.com.tr/Tahsilat/Default.aspx?s=";
// Canlı URL'leri de .env'de tanımlayıp NODE_ENV'e göre seçebilirsiniz.
const CURRENT_PARAM_API_URL = PARAM_API_TEST_URL; // Şimdilik test
const CURRENT_PARAM_PAYMENT_PAGE_URL = PARAM_PAYMENT_PAGE_BASE_URL_TEST; // Şimdilik test

const FRONTEND_DOMAIN = process.env.FRONTEND_URL || 'http://localhost:5173';
const BACKEND_API_DOMAIN = process.env.BACKEND_API_URL || 'http://localhost:8080/api'; // Kendi API adresiniz


// POST /api/payment/initiate/:templateId
router.post('/initiate/:templateId', async (req, res) => {
    let template = null;
    let newTransaction = null;
    let newConsentLog = null;
    let userEmailForLog = null;

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

        // 1. Transaction ve ConsentLog oluştur (status: 'payment_pending')
        try {
            newConsentLog = new ConsentLog({
                userEmail: userEmailForLog,
                ipAddress: req.ip || req.socket?.remoteAddress || 'N/A',
                userAgent: req.headers['user-agent'] || 'N/A',
                documentType: 'LEGAL_TERMS_AGREEMENT',
                documentVersion: documentVersion,
                consentTimestampClient: new Date(consentTimestamp)
            });
        } catch (e) { return res.status(500).json({ message: 'Onay logu hazırlanamadı.'}); }
        
        const transactionAmount = amount !== undefined ? amount : (template.price || 0);
        const transactionCurrency = currency || 'TRY'; // Param ParaBirimi "TL" mi "TRY" mi bekliyor kontrol edin.

        newTransaction = new Transaction({
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

        if (newConsentLog) {
            newConsentLog.transactionId = newTransaction._id;
            await newConsentLog.save();
        }
        console.log(`Transaction ${newTransaction._id} initiated for Param payment. Email: ${userEmailForLog}`);

        // 2. Param To_Pre_Encrypting_OOS SOAP İsteği İçin Veri Hazırlama
        const clientCode = process.env.PARAM_CLIENT_CODE;
        const clientUsername = process.env.PARAM_CLIENT_USERNAME;
        const clientPassword = process.env.PARAM_CLIENT_PASSWORD;
        const guid = process.env.PARAM_GUID;

        const siparisId = newTransaction._id.toString();
        const islemTutarParamFormat = newTransaction.amount.toFixed(2).replace('.', ',');
        
        const borcluAciklama = `Belge: ${template.name || 'Hizmet Bedeli'} - Sipariş No: ${siparisId.slice(-8)}`;
        const borcluAdSoyad = billingInfo?.name || formData?.musteri_adsoyad || userEmailForLog.split('@')[0] || 'Müşteri';
        const borcluGsm = billingInfo?.phone || formData?.musteri_gsm || "";
        const borcluTc = billingInfo?.tckn || "";

        // Return_URL, Param'dan POST isteğinin geleceği callback endpoint'imiz olmalı
        const callbackUrl = `${process.env.BACKEND_API_URL || 'http://localhost:8080/api'}/payment/parampos-callback`;

        // SOAP Request Body (Parametreler dokümandaki zorunluluklara göre kontrol edilmeli)
        const soapRequestXml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <To_Pre_Encrypting_OOS xmlns="https://turkodeme.com.tr/">
      <G>
        <CLIENT_CODE>${clientCode}</CLIENT_CODE>
        <CLIENT_USERNAME>${clientUsername}</CLIENT_USERNAME>
        <CLIENT_PASSWORD>${clientPassword}</CLIENT_PASSWORD>
      </G>
      <GUID>${guid}</GUID>
      <Borclu_Kisi_TC>${borcluTc || ''}</Borclu_Kisi_TC>
      <Borclu_Aciklama>${borcluAciklama}</Borclu_Aciklama>
      <Borclu_Tutar>${islemTutarParamFormat}</Borclu_Tutar>
      <Borclu_GSM>${borcluGsm || ''}</Borclu_GSM>
      <Borclu_Odeme_Tip>Kredi Kartı</Borclu_Odeme_Tip> 
      <Borclu_AdSoyad>${borcluAdSoyad}</Borclu_AdSoyad>
      <Return_URL>${callbackUrl}</Return_URL>
      <Islem_ID>${siparisId}</Islem_ID> {/* Bizim Siparis_ID'miz */}
      <Taksit>1</Taksit> {/* Tek çekim */}
      {/* Diğer zorunlu/opsiyonel parametreler (IPAdr, Data1-5, KK bilgileri vb.) dokümantasyona göre eklenebilir.
          Ortak Ödeme Sayfası olduğu için KK bilgileri burada gönderilmiyor olabilir.
          Dokümandaki "Ortak Ödeme / iFrame" -> "Gönderilecek Parametreler" tablosu esas alınmalı.
          O tabloda KK bilgileri yoktu, sadece Borclu_ bilgileri ve G, GUID, Return_URL, Islem_ID, Taksit vardı.
      */}
    </To_Pre_Encrypting_OOS>
  </soap:Body>
</soap:Envelope>`;

        const paramApiUrl = process.env.PARAM_TEST_API_URL || "https://testposws.param.com.tr/turkpos.ws/service_turkpos_prod.asmx";
        
        console.log(`Sending SOAP request to Param for Siparis_ID: ${siparisId}`);
        const { data: soapResponse } = await axios.post(paramApiUrl, soapRequestXml, {
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                // --- YENİ SOAPAction ---
                'SOAPAction': 'http://tempuri.org/To_Pre_Encrypting_OOS' 
                // --- YENİ SOAPAction ---
            }
        });

        const match = soapResponse.match(/<TO_Pre_Encrypting_OOSResult>([^<]+)<\/TO_Pre_Encrypting_OOSResult>/);
        if (!match || !match[1]) {
            console.error("Could not parse TO_Pre_Encrypting_OOSResult from Param response:", soapResponse);
            const sonuStrMatch = soapResponse.match(/<Sonuc_Str>([^<]+)<\/Sonuc_Str>/);
            const errorMessage = sonuStrMatch ? sonuStrMatch[1] : 'Param ödeme başlatma yanıtı anlaşılamadı.';
            newTransaction.status = 'failed';
            newTransaction.errorMessage = `Param Yanıt Hatası: ${errorMessage}`;
            await newTransaction.save();
            return res.status(500).json({ message: errorMessage });
        }
        const encryptedStringResult = match[1];
        
        const paymentPageUrl = `${CURRENT_PARAM_PAYMENT_PAGE_URL}${encryptedStringResult}`;
        
        newTransaction.paymentGatewayRef = siparisId; // Kendi sipariş ID'mizi referans olarak tutalım
        await newTransaction.save();

        res.status(200).json({
            message: 'Param ödeme başlatma başarılı. Yönlendiriliyorsunuz...',
            transactionId: newTransaction._id.toString(),
            paymentPageUrl: paymentPageUrl,
        });

    } catch (error) {
        console.error(`Error in /payment/initiate (Param Flow) for template ${template?._id || 'N/A'}:`, 
            error.isAxiosError ? error.response?.data || error.message : error.message);
        
        if (newTransaction && newTransaction._id && newTransaction.status !== 'failed') {
            newTransaction.status = 'failed';
            newTransaction.errorMessage = 'Param ödeme başlatma hatası: ' + (error.isAxiosError ? error.response?.data?.message || error.message : error.message);
            try { await newTransaction.save(); } catch (e) { console.error("Error saving failed transaction state:", e); }
        }
        if (!res.headersSent) {
            res.status(500).json({ message: error.response?.data?.message || error.message || 'Ödeme başlatılırken bir sunucu hatası oluştu.' });
        }
    }
});


// POST /api/payment/parampos-callback
router.post('/parampos-callback', async (req, res) => {
    console.log("Received ParamPOS Callback POST data:", req.body);
    const {
        TURKPOS_RETVAL_Sonuc,
        TURKPOS_RETVAL_Sonuc_Str,
        // TURKPOS_RETVAL_GUID, // Bu callback'te gelmiyor olabilir, hash için kendi GUID'imizi kullanacağız
        TURKPOS_RETVAL_Dekont_ID,
        TURKPOS_RETVAL_Tahsilat_Tutari, // <-- Teyit edilen Tutar alanı
        TURKPOS_RETVAL_Siparis_ID,
        TURKPOS_RETVAL_Islem_ID,    // <-- Teyit edilen Islem_ID alanı
        TURKPOS_RETVAL_Hash,
    } = req.body;

    if (!TURKPOS_RETVAL_Siparis_ID || !TURKPOS_RETVAL_Hash || typeof TURKPOS_RETVAL_Sonuc === 'undefined') {
        console.error("ParamPOS Callback: Missing critical parameters.");
        return res.status(400).send("CALLBACK_MISSING_PARAMS");
    }

    const clientCode = process.env.PARAM_CLIENT_CODE;
    const guidAnahtar = process.env.PARAM_GUID; // "Üye İş yerine ait Anahtar"

    // Hash için birleştirilecek string (AI Agent teyitlerine göre)
    const stringToHash =
        (clientCode || "") +
        (guidAnahtar || "") +
        (TURKPOS_RETVAL_Dekont_ID || "") +
        (TURKPOS_RETVAL_Tahsilat_Tutari || "") + // Boşsa boş string olarak dahil et
        (TURKPOS_RETVAL_Siparis_ID || "") +
        (TURKPOS_RETVAL_Islem_ID || "");

    const calculatedHash = crypto.createHash('sha1')
                                .update(stringToHash, 'utf-8')
                                .digest('base64');
    
    // console.log("Callback - String to Hash:", stringToHash);
    // console.log("Callback - Calculated Hash:", calculatedHash);
    // console.log("Callback - Received Hash:", TURKPOS_RETVAL_Hash);

    if (calculatedHash !== TURKPOS_RETVAL_Hash) {
        console.error(`ParamPOS Callback HASH MISMATCH for Siparis_ID: ${TURKPOS_RETVAL_Siparis_ID}.`);
        return res.status(400).send("CALLBACK_INVALID_HASH");
    }
    console.log(`ParamPOS Callback HASH MATCH for Siparis_ID: ${TURKPOS_RETVAL_Siparis_ID}.`);

    // 2. Transaction'ı Bul ve Güncelle
    let transaction;
    try {
        if (!mongoose.Types.ObjectId.isValid(TURKPOS_RETVAL_Siparis_ID)) {
             return res.status(400).send("CALLBACK_INVALID_SIPARIS_ID_FORMAT");
        }
        transaction = await Transaction.findById(TURKPOS_RETVAL_Siparis_ID);

        if (!transaction) {
            console.error(`ParamPOS Callback: Transaction not found with Siparis_ID: ${TURKPOS_RETVAL_Siparis_ID}`);
            return res.status(404).send("CALLBACK_SIPARIS_NOT_FOUND");
        }

        if (['completed', 'failed', 'payment_successful', 'payment_failed'].includes(transaction.status)) {
            console.log(`ParamPOS Callback: Transaction ${transaction._id} already processed. Status: ${transaction.status}`);
            return res.status(200).send("OK");
        }

        // Ödeme sonucunu kontrol et. Doküman: TURKPOS_RETVAL_Dekont_ID "0" dan büyükse kredi kartı işlemi tamamlanmış.
        if (TURKPOS_RETVAL_Dekont_ID && TURKPOS_RETVAL_Dekont_ID !== "0") {
            transaction.status = 'payment_successful';
            transaction.paymentGatewayRef = TURKPOS_RETVAL_Islem_ID || transaction.paymentGatewayRef;
            transaction.gatewayResponseDetails = JSON.stringify(req.body); // Tüm callback'i kaydetmek faydalı olabilir
            transaction.errorMessage = null;
            await transaction.save();
            console.log(`Transaction ${transaction._id} updated to 'payment_successful' via ParamPOS callback.`);

            generateAndDeliverDocument(transaction._id.toString())
                .then(result => console.log(`Document service for ${transaction._id} (callback) finished: ${result.message}`))
                .catch(serviceError => console.error(`CRITICAL: Unhandled error from documentService for ${transaction._id} (callback):`, serviceError));
            
            return res.status(200).send("OK");
        } else {
            transaction.status = 'payment_failed';
            transaction.errorMessage = `ParamPOS Ödeme Başarısız: ${TURKPOS_RETVAL_Sonuc_Str || 'Bilinmeyen Hata'} (Dekont ID: ${TURKPOS_RETVAL_Dekont_ID}, Sonuç Kodu: ${TURKPOS_RETVAL_Sonuc})`;
            transaction.paymentGatewayRef = TURKPOS_RETVAL_Islem_ID || transaction.paymentGatewayRef;
            transaction.gatewayResponseDetails = JSON.stringify(req.body);
            await transaction.save();
            console.log(`Transaction ${transaction._id} updated to 'payment_failed' via ParamPOS callback. Reason: ${transaction.errorMessage}`);
            return res.status(200).send("OK"); // Param'a alındığını bildir
        }
    } catch (error) {
        console.error(`Error processing ParamPOS callback for Siparis_ID ${TURKPOS_RETVAL_Siparis_ID || 'N/A'}:`, error);
        return res.status(500).send("CALLBACK_INTERNAL_SERVER_ERROR");
    }
});

module.exports = router;
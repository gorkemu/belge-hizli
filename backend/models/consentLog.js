// backend/models/consentLog.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consentLogSchema = new Schema({
    transactionId: { // Bu onayın doğrudan ilişkili olduğu işlem (opsiyonel ama önerilir)
        type: Schema.Types.ObjectId,
        ref: 'Transaction',
        index: true,
        // required: true // Her onay bir transaction'a bağlı olmayabilir, genel site kullanımı için de log tutulabilir. Şimdilik transaction'a bağlı.
    },
    userEmail: { // İşlemi yapan/onay veren kullanıcının e-postası
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    ipAddress: { // Onay anındaki IP adresi
        type: String,
        required: true
    },
    userAgent: { // Onay anındaki User-Agent bilgisi
        type: String,
        required: true
    },
    documentType: { // Onaylanan belgenin türü
        type: String,
        required: true,
        default: 'LEGAL_TERMS_AGREEMENT' // Veya "MSS_OBF_Onayi" kalabilir
    },
    documentVersion: { // Onaylanan spesifik metinlerin birleşik versiyonu/kimliği
        type: String,
        required: true // Bu zorunlu olmalı
    },
    consentTimestampClient: { // Frontend'den gelen, onayın verildiği zaman damgası
        type: Date,
        required: true
    }
}, {
    timestamps: true // createdAt (sunucu zamanı) ve updatedAt alanlarını otomatik ekler
});

module.exports = mongoose.model('ConsentLog', consentLogSchema);
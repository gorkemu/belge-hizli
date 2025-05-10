// backend/models/invoice.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
    transactionId: { // Bu faturanın ait olduğu işlem ID'si
        type: Schema.Types.ObjectId,
        ref: 'Transaction',
        required: true,
        index: true,
        unique: true // Her işlem için en fazla 1 fatura olmalı
    },
    templateName: { // Raporlama/görüntüleme kolaylığı için
        type: String,
        required: true
    },
    status: { // Fatura durumu
        type: String,
        required: true,
        enum: ['pending_creation', 'created', 'creation_failed', 'sent', 'paid'], // Olası durumlar
        default: 'pending_creation'
    },
    invoiceNumber: { // Entegratörden dönen fatura numarası/ID'si
        type: String,
        sparse: true,
        index: true
    },
    invoiceUrl: { // Faturanın görüntülenebileceği URL (entegratörden gelirse)
        type: String,
        sparse: true
    },
    amount: { // Fatura tutarı (KDV dahil)
        type: Number,
        required: true
    },
    currency: { // Para birimi
        type: String,
        required: true,
        default: 'TRY'
    },
    // --- Fatura Kesilecek Kişi/Kurum Bilgileri (Frontend'den gelen) ---
    billingType: { // 'bireysel' veya 'kurumsal'
        type: String,
        required: true,
        enum: ['bireysel', 'kurumsal']
    },
    // Bireysel için
    customerName: { // Ad Soyad
        type: String,
        required: function() { return this.billingType === 'bireysel'; } // Sadece bireysel ise zorunlu
    },
    customerTckn: { // TC Kimlik No
        type: String,
        required: function() { return this.billingType === 'bireysel'; }
    },
    // Kurumsal için
    companyName: { // Şirket Unvanı
        type: String,
        required: function() { return this.billingType === 'kurumsal'; }
    },
    taxOffice: { // Vergi Dairesi
        type: String,
        required: function() { return this.billingType === 'kurumsal'; }
    },
    taxId: { // Vergi Kimlik No (VKN)
        type: String,
        required: function() { return this.billingType === 'kurumsal'; }
    },
    // Ortak Alanlar
    customerAddress: { // Fatura Adresi
        type: String,
        required: true
    },
    customerEmail: { // Fatura E-postası
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    // --- Bilgiler Sonu ---
    errorMessage: { // Fatura oluşturma hatası oluştuysa
        type: String
    }
}, {
    timestamps: true // createdAt ve updatedAt alanlarını otomatik ekler
});

module.exports = mongoose.model('Invoice', invoiceSchema);
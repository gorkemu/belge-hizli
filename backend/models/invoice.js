// backend/models/invoice.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
    // ... (diğer alanlar transactionId, templateName vb. aynı kalır) ...
    transactionId: {
        type: Schema.Types.ObjectId,
        ref: 'Transaction',
        required: true,
        index: true,
        unique: true
    },
    templateName: {
        type: String,
        required: true
    },
    status: { // Fatura durumu
        type: String,
        required: true,
        // --- GÜNCELLENDİ: Yeni manuel statüleri ekle ---
        enum: [
            'pending_creation',       // Oluşturulmayı Bekliyor (Sistem tarafından)
            'created',                // Oluşturuldu (Sistem tarafından, entegratörden yanıt geldi)
            'creation_failed',        // Oluşturma Başarısız Oldu (Sistem tarafından)
            'sent',                   // Müşteriye Gönderildi (Sistem tarafından)
            'paid',                   // Ödendi
            'created_manual',         // Manuel Olarak Oluşturuldu (Admin tarafından)
            'sent_to_customer_manual' // Müşteriye Manuel Olarak Gönderildi (Admin tarafından)
        ],
        // --- GÜNCELLENDİ SON ---
        default: 'pending_creation'
    },
    invoiceNumber: {
        type: String,
        sparse: true,
        index: true
    },
    invoiceUrl: {
        type: String,
        sparse: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true,
        default: 'TRY'
    },
    billingType: {
        type: String,
        required: true,
        enum: ['bireysel', 'kurumsal']
    },
    customerName: {
        type: String,
        required: function() { return this.billingType === 'bireysel'; }
    },
    customerTckn: {
        type: String,
        required: function() { return this.billingType === 'bireysel'; }
    },
    companyName: {
        type: String,
        required: function() { return this.billingType === 'kurumsal'; }
    },
    taxOffice: {
        type: String,
        required: function() { return this.billingType === 'kurumsal'; }
    },
    taxId: {
        type: String,
        required: function() { return this.billingType === 'kurumsal'; }
    },
    customerAddress: {
        type: String,
        required: true
    },
    customerEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    errorMessage: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Invoice', invoiceSchema);
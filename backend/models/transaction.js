// backend/models/transaction.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    templateId: {
        type: Schema.Types.ObjectId,
        ref: 'Template', // 'Template' modeline referans
        required: true,
        index: true
    },
    templateName: { // Raporlama/görüntüleme kolaylığı için
        type: String,
        required: true
    },
    userEmail: { // İşlemi yapan kullanıcının e-postası (fatura veya belge e-postası)
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    status: { // İşlem durumu
        type: String,
        required: true,
        enum: ['initiated', 'pdf_generated', 'email_sent', 'completed', 'failed'], // Olası durumlar
        default: 'initiated'
    },
    amount: { // İşlem tutarı (beta'da 0 olabilir)
        type: Number,
        required: true,
        default: 0
    },
    currency: { // Para birimi
        type: String,
        required: true,
        default: 'TRY'
    },
    paymentGatewayRef: { // İleride ödeme ağ geçidinden dönen referans ID
        type: String,
        sparse: true, // Her zaman olmayabilir
        index: true
    },
    invoiceId: { // Bu işleme bağlı fatura ID'si (varsa)
        type: Schema.Types.ObjectId,
        ref: 'Invoice', // 'Invoice' modeline referans
        sparse: true,
        index: true
    },
    // İleride eklenebilir: userId, consentLogId vb.
    errorMessage: { // Hata oluştuysa mesajı
        type: String
    }
}, {
    timestamps: true // createdAt ve updatedAt alanlarını otomatik ekler
});

module.exports = mongoose.model('Transaction', transactionSchema);
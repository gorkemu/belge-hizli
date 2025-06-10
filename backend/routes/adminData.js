// backend/routes/adminData.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Transaction = require('../models/transaction');
const Invoice = require('../models/invoice');
const ConsentLog = require('../models/consentLog');

const mapSortKey = (key) => (key === 'id' ? '_id' : key);

// --- TRANSACTIONS ---
router.get('/transactions', async (req, res) => {
    try {
        const { 
            sort: sortQuery, 
            range: rangeQuery, 
            filter: filterObjectQuery, // Bu genellikle stringified JSON {q: "search"} gibi gelir
            id: idFromQuery, 
            ...potentialFilters // Geri kalan tüm query parametreleri
        } = req.query;

        const [sortField, sortOrderStr] = sortQuery ? JSON.parse(sortQuery) : ['createdAt', 'DESC'];
        // _start ve _end React Admin'in eski versiyonlarından kalma olabilir, range daha modern.
        // ra-data-json-server range kullanır: range=[0,9]
        const [start, end] = rangeQuery ? JSON.parse(rangeQuery) : 
                             (req.query._start && req.query._end ? [parseInt(req.query._start, 10), parseInt(req.query._end, 10) -1 ] : [0, 9]);
        
        const limit = end - start + 1;
        const skip = start;
        const sortOrder = sortOrderStr.toLowerCase() === 'asc' ? 1 : -1;
        const mappedSortField = mapSortKey(sortField);

        let finalMongoFilters = {};

        // 1. ID Filtrelerini işle (GET_MANY için idFromQuery kullanılır)
        if (idFromQuery) {
            const idsToQuery = Array.isArray(idFromQuery) ? idFromQuery : [idFromQuery];
            finalMongoFilters._id = {
                $in: idsToQuery.map(singleId => 
                    mongoose.Types.ObjectId.isValid(singleId) ? new mongoose.Types.ObjectId(singleId) : null
                ).filter(Boolean)
            };
        }
        const reactAdminInternalQueryKeys = ['_sort', '_order', '_start', '_end'];

        // Diğer Alan Filtreleri (potentialFilters objesinden)
        for (const key in potentialFilters) {
            if (potentialFilters.hasOwnProperty(key) && !reactAdminInternalQueryKeys.includes(key)) {
                const filterValue = potentialFilters[key];
                if (typeof filterValue === 'string' && filterValue.trim() !== '') {
                    if (key.endsWith('_like')) {
                        const actualKey = key.slice(0, -5);
                        finalMongoFilters[actualKey] = { $regex: filterValue, $options: 'i' };
                    } else if (key === 'q') {
                        const searchQuery = { $regex: filterValue, $options: 'i' };
                        finalMongoFilters.$or = [
                            { userEmail: searchQuery }, { templateName: searchQuery },
                        ];
                    // --- Tarih Aralığı Filtrelerini İşle ---
                    } else if (key === 'createdAt_gte') {
                        // Gelen tarih string'ini Date objesine çevir
                        // Gelen format "YYYY-MM-DD" olabilir. Saat bilgisini de dikkate almak için:
                        const date = new Date(filterValue);
                        if (!isNaN(date.getTime())) {
                            // Başlangıç tarihi için günün başını al (00:00:00)
                            date.setHours(0, 0, 0, 0);
                            if (!finalMongoFilters.createdAt) finalMongoFilters.createdAt = {};
                            finalMongoFilters.createdAt.$gte = date;
                        }
                    } else if (key === 'createdAt_lte') {
                        const date = new Date(filterValue);
                        if (!isNaN(date.getTime())) {
                            // Bitiş tarihi için günün sonunu al (23:59:59.999)
                            date.setHours(23, 59, 59, 999);
                            if (!finalMongoFilters.createdAt) finalMongoFilters.createdAt = {};
                            finalMongoFilters.createdAt.$lte = date;
                        }
                    } else {
                        // ... (ObjectId ve diğer tam eşleşme filtreleri) ...
                        if (['templateId', 'invoiceId', 'transactionId'].includes(key)) {
                            if (mongoose.Types.ObjectId.isValid(filterValue)) {
                                finalMongoFilters[key] = new mongoose.Types.ObjectId(filterValue);
                            }
                        } else {
                            if (filterValue === 'true') finalMongoFilters[key] = true;
                            else if (filterValue === 'false') finalMongoFilters[key] = false;
                            else finalMongoFilters[key] = filterValue;
                        }
                    }
                }
            }
        }
        
        // filterObjectQuery'den gelen filtreleri de işle (eğer varsa)
        if (filterObjectQuery) {
            try {
                const parsedFilter = JSON.parse(filterObjectQuery);
                for (const key in parsedFilter) {
                    if (parsedFilter.hasOwnProperty(key) && !finalMongoFilters.hasOwnProperty(key) && !key.startsWith('_')) {
                         // _q, _id gibi özel React Admin filtrelerini veya zaten işlenmişleri atla
                        const filterValue = parsedFilter[key];
                        // Benzer şekilde _like, ObjectId, boolean kontrolleri yapılabilir
                        finalMongoFilters[key] = filterValue;
                    }
                }
            } catch (e) {
                console.warn("Could not parse filterObjectQuery:", filterObjectQuery, e);
            }
        }


        console.log(`[TRANSACTIONS] Request Query: ${JSON.stringify(req.query)}`);
        console.log(`[TRANSACTIONS] Applying Mongo Filters: ${JSON.stringify(finalMongoFilters)}`);

        const total = await Transaction.countDocuments(finalMongoFilters);
        const transactions = await Transaction.find(finalMongoFilters)
            .sort({ [mappedSortField]: sortOrder })
            .skip(idFromQuery ? 0 : skip)
            .limit(idFromQuery ? total : limit)
            .lean();

        const formattedTransactions = transactions.map(t => ({ ...t, id: t._id.toString() }));
        res.setHeader('X-Total-Count', total.toString());
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.json(formattedTransactions);

    } catch (error) {
        console.error('Error fetching transactions for admin:', error);
        res.status(500).json({ message: 'Transaction listesi alınırken hata oluştu.' });
    }
});



router.get('/transactions/:id', async (req, res) => { 
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Geçersiz Transaction ID formatı.' });
        }
        const transaction = await Transaction.findById(req.params.id).lean();
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction bulunamadı.' });
        }
        res.json({ ...transaction, id: transaction._id.toString() });
    } catch (error) {
        console.error('Error fetching single transaction for admin:', error);
        res.status(500).json({ message: 'Transaction detayı alınırken hata oluştu.' });
    }
});


router.get('/transactions-pending-invoice', async (req, res) => {
    try {
        // React Admin'den gelen sayfalama ve sıralama parametreleri
        const { sort: sortQuery, range: rangeQuery, filter: filterObjectQuery } = req.query;

        const [sortField, sortOrderStr] = sortQuery ? JSON.parse(sortQuery) : ['createdAt', 'ASC']; // Eskiden yeniye sırala
        const [start, end] = rangeQuery ? JSON.parse(rangeQuery) : [0, 24]; // Varsayılan olarak ilk 25
        
        const limit = end - start + 1;
        const skip = start;
        const sortOrder = sortOrderStr.toLowerCase() === 'asc' ? 1 : -1;
        const mappedSortField = mapSortKey(sortField); // mapSortKey'in tanımlı olduğunu varsayıyoruz

        // Faturalanacakları bulmak için kriterler:
        // 1. Transaction durumu 'payment_successful' VEYA 'completed' VEYA 'email_sent' VEYA 'pdf_generated'
        //    (yani ödeme alınmış ve işlem bir şekilde ilerlemiş)
        // 2. Transaction'ın 'invoiceId' alanı YOK (null veya undefined) 
        //    VEYA 'invoiceId' VAR ama ilişkili Invoice'un durumu 'pending_creation'
        
        const query = {
            status: { $in: ['payment_successful', 'completed', 'email_sent', 'pdf_generated'] },
            // invoiceId alanı olmayanları veya olanların invoice durumunu kontrol etmemiz gerekecek.
            // Bu, MongoDB aggregation ile daha verimli yapılabilir.
        };

        // Basit Yöntem (Performans çok fazla kayıt için ideal olmayabilir):
        // Önce potansiyel transaction'ları çek, sonra invoice durumlarını kontrol et.
        let potentialTransactions = await Transaction.find(query)
            .sort({ [mappedSortField]: sortOrder })
            // Sayfalamayı tüm potansiyel sonuçlar üzerinden değil, filtrelenmiş sonuçlar üzerinden yapmak daha doğru.
            // Bu yüzden önce tümünü çekip sonra filtreleyip sonra sayfalayacağız ya da aggregation kullanacağız.
            .lean(); // Populate etmeden çekelim, invoice'a ayrıca bakarız.

        let transactionsPendingInvoice = [];
        for (const trans of potentialTransactions) {
            if (!trans.invoiceId) {
                transactionsPendingInvoice.push(trans);
            } else {
                const invoice = await Invoice.findById(trans.invoiceId).select('status').lean();
                if (invoice && invoice.status === 'pending_creation') {
                    transactionsPendingInvoice.push(trans);
                }
            }
        }

        const total = transactionsPendingInvoice.length;
        // Sayfalamayı manuel yap
        const paginatedTransactions = transactionsPendingInvoice.slice(skip, skip + limit);

        const formattedTransactions = paginatedTransactions.map(t => ({ 
            ...t, 
            id: t._id.toString(),
            // billingInfoSnapshot'ı da gönderelim ki fatura bilgileri listede görünsün
            billingInfo: t.billingInfoSnapshot ? JSON.parse(t.billingInfoSnapshot) : null 
        }));

        res.setHeader('X-Total-Count', total.toString());
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.json(formattedTransactions);

    } catch (error) {
        console.error('Error fetching transactions pending invoice:', error);
        res.status(500).json({ message: 'Faturalanacak işlemler alınırken hata oluştu.' });
    }
});


// --- INVOICES ---
router.get('/invoices', async (req, res) => {
    try {
        const { 
            sort: sortQuery, 
            range: rangeQuery, 
            filter: filterObjectQuery, // Bu, filter={key:value} string'i olabilir
            id: idFromQuery, 
            ...potentialFilters // Geri kalan tüm query parametreleri
        } = req.query;

        const [sortField, sortOrderStr] = sortQuery ? JSON.parse(sortQuery) : ['createdAt', 'DESC'];
        const [start, end] = rangeQuery ? JSON.parse(rangeQuery) : 
                             (req.query._start && req.query._end ? [parseInt(req.query._start, 10), parseInt(req.query._end, 10) -1 ] : [0, 9]); // _start, _end desteği
        
        const limit = end - start + 1;
        const skip = start;
        const sortOrder = sortOrderStr.toLowerCase() === 'asc' ? 1 : -1;
        const mappedSortField = mapSortKey(sortField);

        let finalMongoFilters = {};

        if (idFromQuery) { /* ... GET_MANY id işleme ... */
            const idsToQuery = Array.isArray(idFromQuery) ? idFromQuery : [idFromQuery];
            finalMongoFilters._id = {
                $in: idsToQuery.map(singleId => 
                    mongoose.Types.ObjectId.isValid(singleId) ? new mongoose.Types.ObjectId(singleId) : null
                ).filter(Boolean)
            };
        }
        
        const reactAdminInternalQueryKeys = ['_sort', '_order', '_start', '_end'];
        for (const key in potentialFilters) {
            if (potentialFilters.hasOwnProperty(key) && !reactAdminInternalQueryKeys.includes(key)) {
                const filterValue = potentialFilters[key];
                if (typeof filterValue === 'string' && filterValue.trim() !== '') {
                    if (key.endsWith('_like')) {
                        const actualKey = key.slice(0, -5);
                        finalMongoFilters[actualKey] = { $regex: filterValue, $options: 'i' };
                    } else if (key === 'q') {
                        // ... q filtresi ...
                        const searchQuery = { $regex: filterValue, $options: 'i' };
                        finalMongoFilters.$or = [
                            { customerEmail: searchQuery }, { templateName: searchQuery }, { invoiceNumber: searchQuery }
                        ];
                    } else if (key === 'createdAt_gte') { 
                        const date = new Date(filterValue);
                        if (!isNaN(date.getTime())) {
                            date.setHours(0, 0, 0, 0);
                            if (!finalMongoFilters.createdAt) finalMongoFilters.createdAt = {};
                            finalMongoFilters.createdAt.$gte = date;
                        }
                    } else if (key === 'createdAt_lte') { 
                        const date = new Date(filterValue);
                        if (!isNaN(date.getTime())) {
                            date.setHours(23, 59, 59, 999);
                            if (!finalMongoFilters.createdAt) finalMongoFilters.createdAt = {};
                            finalMongoFilters.createdAt.$lte = date;
                        }
                    } else {
                        // ... ObjectId ve diğer tam eşleşme filtreleri ...
                        if (key === 'transactionId') {
                            if (mongoose.Types.ObjectId.isValid(filterValue)) {
                                finalMongoFilters[key] = new mongoose.Types.ObjectId(filterValue);
                            }
                        } else { 
                            finalMongoFilters[key] = filterValue;
                        }
                    }
                }
            }
        }
        
        // filterObjectQuery'den gelen filtreleri de işle (eğer varsa)
        if (filterObjectQuery) {
            try {
                const parsedFilter = JSON.parse(filterObjectQuery);
                for (const key in parsedFilter) {
                    // Zaten işlenmiş veya React Admin içsel anahtarı değilse ve finalMongoFilters'da yoksa ekle
                    if (parsedFilter.hasOwnProperty(key) && 
                        !finalMongoFilters.hasOwnProperty(key) && 
                        !reactAdminInternalQueryKeys.includes(key) && 
                        key !== 'id' && key !=='q' /* q yukarıda potentialFilters'dan gelebilir */) {
                        finalMongoFilters[key] = parsedFilter[key];
                    }
                }
            } catch (e) { console.warn(`[INVOICES] Could not parse filterObjectQuery: ${filterObjectQuery}`, e); }
        }

        console.log(`[INVOICES] Request Query: ${JSON.stringify(req.query)}`);
        console.log(`[INVOICES] Applying Mongo Filters: ${JSON.stringify(finalMongoFilters)}`);

        const total = await Invoice.countDocuments(finalMongoFilters);
        const invoices = await Invoice.find(finalMongoFilters)
            .sort({ [mappedSortField]: sortOrder })
            .skip(idFromQuery ? 0 : skip)
            .limit(idFromQuery ? total : limit)
            .lean();
        const formattedInvoices = invoices.map(inv => ({ 
        ...inv, 
        id: inv._id.toString(),
        // transactionId alanı burada ObjectId olarak kalmalı, ReferenceField bunu alır.
        // Eğer string'e çevirirseniz de ReferenceField çalışır.
        // transactionId: inv.transactionId ? inv.transactionId.toString() : null // Bu satır opsiyonel
    }));
        res.setHeader('X-Total-Count', total.toString());
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.json(formattedInvoices);

    } catch (error) {
        console.error('Error fetching invoices for admin:', error);
        res.status(500).json({ message: 'Fatura listesi alınırken hata oluştu.' });
    }
});


router.get('/invoices/:id', async (req, res) => {
     try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Geçersiz Invoice ID formatı.' });
        }
        const invoice = await Invoice.findById(req.params.id)
            .populate('transactionId', 'userEmail amount status createdAt') // İlişkili transaction'dan daha fazla bilgi
            .lean();
        if (!invoice) {
            return res.status(404).json({ message: 'Fatura bulunamadı.' });
        }
        res.json({ ...invoice, id: invoice._id.toString() });
    } catch (error) {
        console.error('Error fetching single invoice for admin:', error);
        res.status(500).json({ message: 'Fatura detayı alınırken hata oluştu.' });
    }
});

router.put('/invoices/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Geçersiz Invoice ID formatı.' });
        }

        const { status, invoiceNumber, errorMessage } = req.body; // Güncellenecek alanları al
        
        // Sadece izin verilen alanların güncellenmesini sağla
        const updateData = {};
        if (status) {
            // Invoice modelindeki enum değerlerine uygunluğunu kontrol edebilirsiniz
            const validStatuses = Invoice.schema.path('status').enumValues;
            if (validStatuses.includes(status)) {
                updateData.status = status;
            } else {
                return res.status(400).json({ message: `Geçersiz fatura durumu: ${status}` });
            }
        }
        if (typeof invoiceNumber === 'string') { // invoiceNumber boş string de olabilir (silmek için)
            updateData.invoiceNumber = invoiceNumber;
        }
        if (typeof errorMessage === 'string') { // errorMessage boş string de olabilir
            updateData.errorMessage = errorMessage;
        }
        // Başka güncellenebilir alanlar varsa buraya eklenebilir (örn: notes)

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'Güncellenecek veri bulunamadı.' });
        }

        // new: true -> güncellenmiş dokümanı döndürür
        // runValidators: true -> Mongoose şema validasyonlarını çalıştırır
        const updatedInvoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedInvoice) {
            return res.status(404).json({ message: 'Güncellenecek fatura bulunamadı.' });
        }

        // React Admin update yanıtında güncellenmiş kaydın tamamını id ile bekler
        res.json({ ...updatedInvoice, id: updatedInvoice._id.toString() });

    } catch (error) {
        console.error('Error updating invoice for admin:', error);
        // Mongoose validasyon hatası olabilir
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Fatura güncelleme validasyon hatası: ' + error.message });
        }
        res.status(500).json({ message: 'Fatura güncellenirken bir sunucu hatası oluştu.' });
    }
});

// --- CONSENT LOGS ---
router.get('/consent-logs', async (req, res) => {
    try {
        const { 
            sort: sortQuery, 
            range: rangeQuery, 
            filter: filterObjectQuery,
            id: idFromQuery, 
            ...potentialFilters 
        } = req.query;

        const [sortField, sortOrderStr] = sortQuery ? JSON.parse(sortQuery) : ['createdAt', 'DESC'];
        const [start, end] = rangeQuery ? JSON.parse(rangeQuery) : 
                             (req.query._start && req.query._end ? [parseInt(req.query._start, 10), parseInt(req.query._end, 10) -1 ] : [0, 9]);
        
        const limit = end - start + 1;
        const skip = start;
        const sortOrder = sortOrderStr.toLowerCase() === 'asc' ? 1 : -1;
        const mappedSortField = mapSortKey(sortField);

        let finalMongoFilters = {};

        if (idFromQuery) { /* ... GET_MANY id işleme ... */
             const idsToQuery = Array.isArray(idFromQuery) ? idFromQuery : [idFromQuery];
            finalMongoFilters._id = {
                $in: idsToQuery.map(singleId => 
                    mongoose.Types.ObjectId.isValid(singleId) ? new mongoose.Types.ObjectId(singleId) : null
                ).filter(Boolean)
            };
        }
        
        // --- potentialFilters işlenirken React Admin anahtarlarını atla ---
        const reactAdminInternalQueryKeys = ['_sort', '_order', '_start', '_end'];
        for (const key in potentialFilters) {
            if (potentialFilters.hasOwnProperty(key) && !reactAdminInternalQueryKeys.includes(key)) {
                const filterValue = potentialFilters[key];
                if (typeof filterValue === 'string' && filterValue.trim() !== '') {
                    if (key.endsWith('_like')) {
                        const actualKey = key.slice(0, -5);
                        finalMongoFilters[actualKey] = { $regex: filterValue, $options: 'i' };
                    } else if (key === 'q') {
                        // ... q filtresi ...
                        const searchQuery = { $regex: filterValue, $options: 'i' };
                        finalMongoFilters.$or = [
                            { userEmail: searchQuery }, { documentVersion: searchQuery }, { ipAddress: searchQuery }
                        ];
                    } else if (key === 'createdAt_gte') { 
                        const date = new Date(filterValue);
                        if (!isNaN(date.getTime())) {
                            date.setHours(0, 0, 0, 0);
                            if (!finalMongoFilters.createdAt) finalMongoFilters.createdAt = {};
                            finalMongoFilters.createdAt.$gte = date;
                        }
                    } else if (key === 'createdAt_lte') { 
                        const date = new Date(filterValue);
                        if (!isNaN(date.getTime())) {
                            date.setHours(23, 59, 59, 999);
                            if (!finalMongoFilters.createdAt) finalMongoFilters.createdAt = {};
                            finalMongoFilters.createdAt.$lte = date;
                        }
                    } else {
                        // ... ObjectId ve diğer tam eşleşme filtreleri ...
                        if (key === 'transactionId') {
                            if (mongoose.Types.ObjectId.isValid(filterValue)) {
                                finalMongoFilters[key] = new mongoose.Types.ObjectId(filterValue);
                            }
                        } else { 
                            finalMongoFilters[key] = filterValue;
                        }
                    }
                }
            }
        }
        
        if (filterObjectQuery) {
            try {
                const parsedFilter = JSON.parse(filterObjectQuery);
                for (const key in parsedFilter) {
                    if (parsedFilter.hasOwnProperty(key) && 
                        !finalMongoFilters.hasOwnProperty(key) && 
                        !reactAdminInternalQueryKeys.includes(key) && 
                        key !== 'id' && key !== 'q') {
                        finalMongoFilters[key] = parsedFilter[key];
                    }
                }
            } catch (e) { console.warn(`[CONSENTLOGS] Could not parse filterObjectQuery: ${filterObjectQuery}`, e); }
        }
        // --- GÜNCELLENDİ SON ---

        console.log(`[CONSENTLOGS] Request Query: ${JSON.stringify(req.query)}`);
        console.log(`[CONSENTLOGS] Applying Mongo Filters: ${JSON.stringify(finalMongoFilters)}`);

        const total = await ConsentLog.countDocuments(finalMongoFilters);
        // ... (geri kalan kod aynı)
        const consentLogs = await ConsentLog.find(finalMongoFilters)
            .sort({ [mappedSortField]: sortOrder })
            .skip(idFromQuery ? 0 : skip)
            .limit(idFromQuery ? total : limit)
            .lean();
        const formattedConsentLogs = consentLogs.map(log => ({ 
        ...log, 
        id: log._id.toString(),
        // transactionId: log.transactionId ? log.transactionId.toString() : null // Opsiyonel
    }));
        res.setHeader('X-Total-Count', total.toString());
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        res.json(formattedConsentLogs);

    } catch (error) {
        console.error('Error fetching consent logs for admin:', error);
        res.status(500).json({ message: 'Onay log listesi alınırken hata oluştu.' });
    }
});



router.get('/consent-logs/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Geçersiz ConsentLog ID formatı.' });
        }
        const consentLog = await ConsentLog.findById(req.params.id)
            .populate('transactionId', 'templateName status userEmail createdAt')
            .lean();
        if (!consentLog) {
            return res.status(404).json({ message: 'Onay logu bulunamadı.' });
        }
        res.json({ ...consentLog, id: consentLog._id.toString() });
    } catch (error) {
        console.error('Error fetching single consent log for admin:', error);
        res.status(500).json({ message: 'Onay log detayı alınırken hata oluştu.' });
    }
});

module.exports = router;
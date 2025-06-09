// backend/routes/adminData.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Transaction = require('../models/transaction');
const Invoice = require('../models/invoice');
const ConsentLog = require('../models/consentLog');

const mapSortKey = (key) => (key === 'id' ? '_id' : key);

// --- TRANSACTIONS ---
// GET /api/admin-data/transactions 
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
        // filterObjectQuery'den gelen tekil id'yi de işleyebiliriz (eğer idFromQuery yoksa)
        // Ancak ra-data-json-server genellikle id'leri doğrudan query param olarak gönderir.
        // Şimdilik bu kısmı atlayabiliriz, çünkü idFromQuery öncelikli.

        // 2. Diğer Alan Filtrelerini (potentialFilters objesinden) işle
        // React Admin'e ait olmayan tüm query parametrelerini filtre olarak al
        for (const key in potentialFilters) {
            if (potentialFilters.hasOwnProperty(key)) {
                // Bilinen React Admin kontrol parametrelerini atla
                // (Aslında ...potentialFilters ile bunlar zaten ayrılmış olmalı, ama garanti için)
                if (['_sort', '_order', '_start', '_end'].includes(key)) {
                    continue;
                }

                const filterValue = potentialFilters[key];
                if (typeof filterValue === 'string' && filterValue.trim() !== '') {
                    if (key.endsWith('_like')) {
                        const actualKey = key.slice(0, -5);
                        finalMongoFilters[actualKey] = { $regex: filterValue, $options: 'i' };
                    } else if (key === 'q' && filterObjectQuery) { // Genel arama için filterObjectQuery'ye bakılabilir
                        // Eğer filter={"q":"search"} geliyorsa:
                        // const parsedFilterObject = JSON.parse(filterObjectQuery);
                        // if(parsedFilterObject.q) { ... }
                        // Ama ra-data-json-server q'yu da ?q=search şeklinde gönderir.
                        const searchQuery = { $regex: filterValue, $options: 'i' };
                        finalMongoFilters.$or = [
                            { userEmail: searchQuery },
                            { templateName: searchQuery },
                        ];
                    } else {
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
        
        // filterObjectQuery'den gelen filtreleri de işle (eğer varsa ve otherFilters'da yoksa)
        // Bu, filter={"status":"completed"} gibi durumlar için.
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

// --- INVOICES ---
// GET /api/admin-data/invoices (GET_MANY için güncellendi)
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
        
        // --- GÜNCELLENDİ: potentialFilters işlenirken React Admin anahtarlarını atla ---
        const reactAdminInternalQueryKeys = ['_sort', '_order', '_start', '_end']; // 'sort', 'range', 'filter', 'id' zaten ayrıldı

        for (const key in potentialFilters) {
            if (potentialFilters.hasOwnProperty(key) && !reactAdminInternalQueryKeys.includes(key)) { // <-- KONTROL EKLENDİ
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
        // --- GÜNCELLENDİ SON ---

        console.log(`[INVOICES] Request Query: ${JSON.stringify(req.query)}`);
        console.log(`[INVOICES] Applying Mongo Filters: ${JSON.stringify(finalMongoFilters)}`);

        const total = await Invoice.countDocuments(finalMongoFilters);
        // ... (geri kalan kod aynı)
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

// --- Update Invoice (PUT /api/admin-data/invoices/:id) ---
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
        
        // --- GÜNCELLENDİ: potentialFilters işlenirken React Admin anahtarlarını atla ---
        const reactAdminInternalQueryKeys = ['_sort', '_order', '_start', '_end'];

        for (const key in potentialFilters) {
            if (potentialFilters.hasOwnProperty(key) && !reactAdminInternalQueryKeys.includes(key)) { // <-- KONTROL EKLENDİ
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
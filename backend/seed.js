require('dotenv').config();
const mongoose = require('mongoose');
const Template = require('./models/template'); // Modelinizin yolunu doğru şekilde ayarlayın

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Atlas bağlantısı başarılı!'))
    .catch((error) => {
        console.error('MongoDB bağlantı hatası:', error);
        process.exit(1);
    });

const kiraSozlesmesiSablonu = {
    name: "Kira Sözleşmesi",
    description: "Kullanıcı girdilerine göre dinamik kira sözleşmesi oluşturma şablonu.",
    content: "İşbu Kira Sözleşmesi, aşağıdaki koşullarda akdedilmiştir.\n\n1. Kiralanan Mülkün Adresi: {{kiralanan_adres}}\n\n2. Kira Süresi:\n{{#if (eq kira_suresi_secimi 'Belirli bir tarihe kadar yaşayacaktır')}}\n    Kiracı, kiralanan konutta belirli bir tarihe kadar yaşayacaktır.\n    Kira Sözleşmesinin Başlangıç Tarihi: {{sozlesme_baslangic_tarihi}}\n    Kira Sözleşmesinin Sona Erme Tarihi: {{sozlesme_bitis_tarihi}}\n{{else if (eq kira_suresi_secimi 'Belirsiz süreliğine yaşayacaktır')}}\n    Kiracı, kiralanan konutta belirsiz süreliğine yaşayacaktır. Sözleşme sona ererse kiralananı tahliye edecektir.\n{{/if}}\n\n3. Kiralayan Bilgileri:\nKiralayan Sayısı: {{kiralayan_sayisi}}\n{{{kiralayanBilgileri}}}\n\n4. Kiracı Bilgileri:\nKiracı Sayısı: {{kiraci_sayisi}}\n{{{kiraciBilgileri}}}\n\n5. Kira Bedeli ve Ödeme Koşulları:\nKira Ödeme Dönemi: {{kira_odeme_donemi}}\nAylık Kira Bedeli: {{aylik_kira_bedeli}} TL\nKira Bedelinin Yatırılacağı Banka Hesap Numarası (IBAN): {{kira_iban}}\n\n6. Diğer Koşullar:\nKapora: {{#if (eq kapora 'Evet')}}Kiracı tarafından kiralayana kapora verilmiştir.{{else}}Kiracı tarafından kiralayana kapora verilmemiştir.{{/if}}\nDepozito: {{#if (eq depozito 'Evet')}}Kiracıdan teminat olarak depozito istenmektedir.{{else}}Kiracıdan teminat olarak depozito istenmemektedir.{{/if}}\nEvcil Hayvan Yasağı: {{#if (eq evcil_hayvan_yasagi 'Evet')}}Kiralanan konutta evcil hayvan beslemek yasaktır.{{else}}Kiralanan konutta evcil hayvan besleme konusunda bir yasak bulunmamaktadır.{{/if}}\nKefil: {{#if (eq kefil_gerekli 'Evet')}}Bu sözleşme kapsamında kiracının olası ödenmeyen borçları için kefil göstermesi gerekmektedir.{{else}}Bu sözleşme kapsamında kiracının kefil göstermesine gerek yoktur.{{/if}}",
    fields: [
        { "name": "kiralanan_adres", "label": "Kiracıya kiralanan mülkün/ konutun adresi nedir?", "fieldType": "text", "required": true, "placeholder": "Örn: Atatürk Mahallesi, Cumhuriyet Sokak, Kurtuluş Apartmanı, 19/1, Şişli/İstanbul" },
        { "name": "kira_suresi_secimi", "label": "Kiracı, kiralanan konutta:", "fieldType": "select", "required": true, "options": ["Belirli bir tarihe kadar yaşayacaktır", "Belirsiz süreliğine yaşayacaktır"] },
        { "name": "sozlesme_baslangic_tarihi", "label": "Kira Sözleşmesinin Başlangıç Tarihi Nedir?", "fieldType": "date" },
        { "name": "sozlesme_bitis_tarihi", "label": "Kira Sözleşmesinin Sona Erme Tarihi Nedir?", "fieldType": "date" },
        { "name": "kiralayan_sayisi", "label": "Mülkü kiraya veren kişi (kiralayan) sayısı kaçtır?", "fieldType": "select", "required": true, "options": ["1", "2", "3", "4", "5", "6 veya daha fazla"] },
        { "name": "kiraci_sayisi", "label": "Mülkün kullanımını kira karşılığı kiralamak isteyen (kiracı) kaç kişinin adı yer alacak?", "fieldType": "select", "required": true, "options": ["1", "2", "3", "4", "5", "6 veya daha fazla"] },
        { "name": "kira_odeme_donemi", "label": "Kira bedelinin hangi dönemlerde ödenmesi gerekmektedir?", "fieldType": "select", "required": true, "options": ["aylık", "yıllık"] },
        { "name": "aylik_kira_bedeli", "label": "Aylık kira bedelini Türk Lirası cinsinden yazın", "fieldType": "number", "required": true, "placeholder": "Bir rakam girin" },
        { "name": "kira_iban", "label": "Kira bedelinin yatırılması istenen, kiralayana ait banka hesap numarası (IBAN) bilgilerini girin", "fieldType": "text", "required": true, "placeholder": "Örn: TR 94 0006 6000 0056 6550 1298 33" },
        { "name": "kapora", "label": "Kiracının mülkü kiralayacağını garanti etmek adına kiralayana yaptığı bir ön ödeme (kapora) var mı?", "fieldType": "radio", "required": true, "options": ["Evet", "Hayır"] },
        { "name": "depozito", "label": "Kiracıdan teminat olarak depozito istenmekte midir? Depozito kiracı kiralanana zarar verdiğinde kullanılabilir", "fieldType": "radio", "required": true, "options": ["Evet", "Hayır"] },
        { "name": "evcil_hayvan_yasagi", "label": "Kiracının kiralanan konutta evcil hayvan (kedi, köpek, kuş gibi) beslemesine ilişkin bir yasak var mı?", "fieldType": "radio", "required": true, "options": ["Evet", "Hayır"] },
        { "name": "kefil_gerekli", "label": "Bu sözleşme kapsamında kiracının olası ödenmeyen borçları için kefil göstermesi gerekiyor mu?", "fieldType": "radio", "required": true, "options": ["Evet", "Hayır"] },
        { "name": "belge_email", "label": "E-posta adresi (belgenin gönderileceği)", "fieldType": "email", "required": true, "placeholder": "E-posta adresi" }
    ],
    createdAt: new Date()
};

async function seedDatabase() {
    try {
        const existingTemplate = await Template.findOne({ name: kiraSozlesmesiSablonu.name });
        if (existingTemplate) {
            console.log('Kira Sözleşmesi şablonu zaten var. Güncelleniyor...');
            existingTemplate.fields = kiraSozlesmesiSablonu.fields; // Mevcut alanları yeni alanlarla değiştir
            await existingTemplate.save();
            console.log('Kira Sözleşmesi şablonu başarıyla güncellendi:', existingTemplate._id);
            mongoose.disconnect();
            return;
        }

        const newTemplate = new Template(kiraSozlesmesiSablonu);
        const savedTemplate = await newTemplate.save();
        console.log('Kira Sözleşmesi şablonu başarıyla eklendi:', savedTemplate._id);
        mongoose.disconnect();
    } catch (error) {
        console.error('Şablon eklenirken/güncellenirken hata oluştu:', error);
        mongoose.disconnect();
        process.exit(1);
    }
}

seedDatabase();
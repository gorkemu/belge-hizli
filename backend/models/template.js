const mongoose = require('mongoose');

// Alt alanlar için şema tanımı (Recursive olabilir ama şimdilik tek seviye yeterli)
const subfieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  label: { type: String, required: true },
  fieldType: { type: String, required: true },
  placeholder: String,
  options: [String],
  required: Boolean,
  // Alt alanlar için de koşul ekleyebiliriz (gelecekte)
  // condition: {
  //   field: String,
  //   value: String
  // }
}, { _id: false }); // Alt alanlara ayrı _id vermeye gerek yok

// Ana alanlar için şema tanımı
const fieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  label: { type: String, required: true },
  fieldType: { type: String, required: true },
  placeholder: String,
  options: [String],
  required: Boolean,
  condition: { // Koşullu alanlar için
    field: String, // Hangi alana bağlı
    value: String  // Hangi değere bağlı
    // operator: { type: String, enum: ['eq', 'neq', 'gt', 'lt'], default: 'eq' } // Operatör eklenebilir
  },
  // --- YENİ: Tekrarlayan Bloklar İçin Alanlar ---
  blockTitle: String, // Her bloğun başlığı (örn: "Kiracı")
  addLabel: String,   // Ekleme butonu metni (örn: "Yeni Kiracı Ekle")
  removeLabel: String,// Silme butonu metni (örn: "Kiracıyı Sil")
  minInstances: Number, // Minimum blok sayısı
  maxInstances: Number, // Maksimum blok sayısı
  subfields: [subfieldSchema] // Tekrarlayan alanın içindeki alt alanlar
  // --- YENİ SON ---
}, { _id: false }); // Alanlara ayrı _id vermeye gerek yok

// Ana Template Şeması
const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true }, // Handlebars içeriği
  price: { type: Number, required: true, default: 0 },
  fields: [fieldSchema], // Alanların dizisi
  category: String, // Kategori alanı (filtreleme için eklenebilir)
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// updatedAt alanını her kayıtta güncelle
templateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Modelin oluşturulması
// Mongoose'un çoğul yapma özelliğini engellemek için üçüncü parametre kullanılabilir:
// const Template = mongoose.model('Template', templateSchema, 'templates');
// Ancak genellikle Mongoose'un otomatik çoğul yapması ('Template' -> 'templates') tercih edilir.
const Template = mongoose.model('Template', templateSchema);

module.exports = Template;
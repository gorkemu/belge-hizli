const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: String,
  description: String,
  content: String,
  fields: [{
    name: String,
    label: String,
    fieldType: String,
    placeholder: String, // Placeholder alanı eklendi
    options: [String],
    required: Boolean // Gerekirse required alanı da ekleyebilirsiniz
  }],
  createdAt: { type: Date, default: () => new Date() }
});

module.exports = mongoose.model('Template', templateSchema);
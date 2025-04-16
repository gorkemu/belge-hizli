const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: String,
  description: String,
  content: String,
  fields: [{
    name: String,
    label: String,
    fieldType: String,
    placeholder: String, 
    options: [String],
    required: Boolean 
  }],
  createdAt: { type: Date, default: () => new Date() }
});

module.exports = mongoose.model('Template', templateSchema);
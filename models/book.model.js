const mongoose = require('mongoose')

// Schema
const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: [String]
})

// Add virtual field to count comments
BookSchema.virtual('commentcount').get(function() {
  return this.comments.length;
});

BookSchema.set('toJSON', { getters: true, virtuals: true });

// Export Model Constructor
module.exports = mongoose.model('Book', BookSchema)
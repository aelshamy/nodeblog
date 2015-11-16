var mongoose = require('mongoose');

// Category Schema
categorySchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        // bcrypt: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

var Category = module.exports = mongoose.model('Category', categorySchema);

// Get All Categories
module.exports.getCategories = function(callback, limit) {
    Category.find(callback).limit(limit);
}

// Get Single Category
module.exports.getCategoryById = function(id, callback) {
    Category.findById(id, callback);
}

// Create Category
module.exports.createCategory = function(newCategory, callback) {
    newCategory.save(callback);
}

// Update Category
module.exports.editCategory = function(id, data, options, callback) {

    Category.findOneAndUpdate({
        _id: id
    }, data, options, callback);
}

// Remove Category
module.exports.removeCategory = function(id, callback) {
    Category.remove({
        _id: id
    }, callback);
}

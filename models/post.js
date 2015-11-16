var mongoose = require('mongoose');

// Post Schema
var postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    category: {
        type: String,
    },
    author: {
        type: String,
    },
    image: {
        type: String,
    },
    comments: [{
        name: {
            type: String,
        },
        email:{
            type: String,
        },
        body: {
            type: String,
        },
        created_at: {
            type: Date,
            default: Date.now()
        }
    }],
    created_at: {
        type: Date,
        default: Date.now()
    }
});

var Post = module.exports = mongoose.model('Post', postSchema);

// Get All Posts
module.exports.getPosts = function(query, callback, limit, skip) {
    Post.find(query, callback).limit(limit).skip(skip).sort({'created_at':-1});
}

// Get Single Post
module.exports.getPostById = function(id, callback) {
    Post.findById(id, callback);
}

// Create Post
module.exports.createPost = function(newCategory, callback) {
    newCategory.save(callback);
}

// Add a comment to Post
module.exports.addCommentsToPost = function(id, comment, callback) {
    Post.update({
        _id: id
    }, {
        $push: {
            "comments": comment
        }
    }, callback);
}


// Update Post
module.exports.editPost = function(id, newPost, options, callback) {

    var values = {
        title: newPost.title,
        body: newPost.body,
        category: newPost.category,
        author: newPost.author,
    }
    if (newPost.image) {
        values.image = newPost.image
    }

    Post.update({
        _id: id
    }, {
        $set: values
    }, options, callback);



};

// Remove Post
module.exports.removePost = function(id, callback) {

    Post.remove({
        _id: id
    }, callback);

};

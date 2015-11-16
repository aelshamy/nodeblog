var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// User Schema
userSchema = mongoose.Schema({
    name: {
        type: String
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        bcrypt: true
    },
    email: {
        type: String
    },
    profile_image: {
        type: String
    }
});

var User = module.exports = mongoose.model('User', userSchema);


// Get Users
module.exports.getUsers = function(callback, limit) {
    User.find(callback).limit(limit);
}

// Get User by Username
module.exports.getUserByUsername = function(username, callback) {
    var query = {
        username: username
    };
    User.findOne(query, callback);
}

// Get User by Id
module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

// Compare user input password
module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
}


// Create User
module.exports.createUser = function(newUser, callback) {
    bcrypt.hash(newUser.password, 10, function(err, hash) {
        if (err) {
            throw err;
        }
        // Set Hash Password
        newUser.password = hash;

        // Insert User
        newUser.save(callback);
    })
}

// Create User
module.exports.updateUser = function(id, newUser, options, callback) {

    var values = {
        name: newUser.name,
        email: newUser.email
    }
    if (newUser.profile_image) {
        values.profile_image = newUser.profile_image
    }

    if (newUser.password) {
        bcrypt.hash(newUser.password, 10, function(err, hash) {
            if (err) {
                throw err;
            }
            // Set Hash Password
            values.password = hash;

            User.update({
                _id: id
            }, {
                $set: values
            }, options, callback);

        });
    } else {
        User.update({
            _id: id
        }, {
            $set: values
        }, options, callback);
    }
}

// Remove User
module.exports.removeUser = function(id, callback) {

    User.remove({
        _id: id
    }, callback);

};


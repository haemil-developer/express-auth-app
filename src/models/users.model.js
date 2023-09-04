const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        minLength: 5
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
    // plain password => client, this.password => database
   if (plainPassword == this.password) {
        cb(null, true);
    } else {
        cb(null, false);
    }

    return cb(null, true);
}

const User = mongoose.model('User', userSchema);

module.exports = User;

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    },
    kakaoId: {
        type: String,
        unique: true,
        sparse: true
    }
});

const saltRounds = 10;
userSchema.pre('save', function (next) {
    let user = this;
    // when the password changed only
    if (user.isModified('password')) {
        // generate salt
        bcrypt.genSalt(saltRounds, function (error, salt) {
            if (error) return next(error);

            bcrypt.hash(user.password, salt, function (error, hash) {
                if (error) return next(error);
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
})

userSchema.methods.comparePassword = function (plainPassword, cb) {
    // plain password => client, this.password => database
    bcrypt.compare(plainPassword, this.password, function(error, isMatch) {
       if (error) return cb(error);
       cb(null, isMatch);
    })
}

const User = mongoose.model('User', userSchema);

module.exports = User;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// username, password, fname, lname,
const UserSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    userType: { type: String, enum: ['admin', 'registered'], default: 'registered' },//admin, registered
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    fullName: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', function (next) {
    let me = this;
    me.fullName = me.fname + ', ' + me.lname;
    const salt = bcrypt.genSaltSync();
    bcrypt.hash(me.password, salt, (err, encrypted) => {
        if (err) {
            console.log("Bcrypt User Model Password encryption Error", err);
            next();
        } else {
            me.password = encrypted;
            next();
        }
    });
});

module.exports = mongoose.model('User', UserSchema);



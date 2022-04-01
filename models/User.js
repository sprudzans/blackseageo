import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    salt: {type: String},
    password: {type: String, required: true},
    social: {type: String},
    contact: {type: String},
    phone: {type: String},
    isAdmin: {type: Boolean, required: true, default: false},

}, {
    timestamps: true
})

userSchema.pre('save', function (next){
    this.salt = crypto.randomBytes(16).toString('hex')
    this.password = crypto
        .pbkdf2Sync(this.password, this.salt, 1000, 64, 'sha512')
        .toString('hex')
    next()
})

userSchema.methods.validatePassword = function (password) {
    const hash = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
        .toString('hex')
    return this.password === hash
}

export default mongoose.models.User || mongoose.model('User', userSchema)
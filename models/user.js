const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');
if (passportLocalMongoose && typeof passportLocalMongoose !== 'function' && passportLocalMongoose.default && typeof passportLocalMongoose.default === 'function') {
    passportLocalMongoose = passportLocalMongoose.default;
}

const userSchema = new Schema({
    email: {
        type: String,   
        required: true,
        unique: true
    }
});

if (typeof passportLocalMongoose !== 'function') {
    throw new Error('passport-local-mongoose did not export a plugin function');
}
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);
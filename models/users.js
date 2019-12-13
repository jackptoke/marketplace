const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String,required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email_address: { type: String, required: true },
    avatar: { type: String,required: false }
}, {collection: 'users'});
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('users', userSchema);


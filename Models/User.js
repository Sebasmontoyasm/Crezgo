const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullName: String,
    email: String,
    mobile: String,
    role: String,
    company: String,
    industry: String
},{timestamps:true});

module.exports = mongoose.model('User', UserSchema);
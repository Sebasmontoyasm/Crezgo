const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    fullName:String,
    email:String,
    phone:String,
},{timestamps:true});

module.exports = mongoose.model('Customer', CustomerSchema);
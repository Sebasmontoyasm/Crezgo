const {model, Schema } = require('mongoose');

const ProductSchema = new Schema({
    name:String,
    img:String,
    hardWork: {type:String, default:"false"},
    price:Number,
},{timestamps:true});

module.exports = model('Product', ProductSchema);
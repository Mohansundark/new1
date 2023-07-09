var mongoose = require('mongoose')
var Schema = mongoose.Schema;

adminSchema = new Schema({
    username:String , 
    password:String
}),

admin = mongoose.model('admin' , adminSchema);

module.exports = admin;
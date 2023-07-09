var mongoose = require("mongoose")
var Schema = mongoose.Schema;

ticketSchema = new Schema({
    category:String,
    subCategory:String,
    description:String,
    user_id:Schema.ObjectId,
    is_delete: { type: Boolean, default: false },
	date : { type : Date, default: Date.now }
}),
ticket = mongoose.model('ticket' , ticketSchema);

module.exports = ticket;
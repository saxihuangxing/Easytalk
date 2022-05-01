var mongoose = require('./dbHandle.js'),
    Schema = mongoose.Schema;

var Studentschema = new Schema({
    id: { type: String, unique:true,required: true },
    walletId: { type: String, unique:true },
    accountName : { type: String,required: true },
    accountPassword: { type: String,required: true },
    status: { type: String },      // 'normal' || 'deactive'    
    name : { type: String },
    residence: { type: String },
    age: { type: Number },
    gender:{ type:String },
    hobby : { type: String },
    email: {type: String},
});

module.exports =   mongoose.model('Student',Studentschema);

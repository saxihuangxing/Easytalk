var mongoose = require('./dbHandle.js'),
    Schema = mongoose.Schema;

var Studentschema = new Schema({
    id: { type: String },
    accountName : { type: String },
    accountPassword: { type: String },
    status: { type: String },      // 'normal' || 'deactive'    
    name : { type: String },
    residence: { type: String },
    age: { type: Number },
    gender:{ type:String },
    hobby : { type: String },
    email: {type: String},
});

module.exports =   mongoose.model('Student',Studentschema);

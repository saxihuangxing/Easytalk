var mongoose = require('./dbHandle.js'),
    Schema = mongoose.Schema;

var Tutorchema = new Schema({
    id: { type: String, unique:true,required: true },
    accountName : { type: String,required: true },
    accountPassword: { type: String,required: true },
    applyStatus: { type: String},  // 'checking' || 'approved' || declined
    status: { type: String,default:'deactive' },      // 'active' || 'deactive'    
    name : { type: String },
    residence: { type: String },
    age: { type: Number },
    gender:{ type:String },
    nationality:{ type:String },
    introduction : { type: String },
    email: { type: String },
    photos: { type: Array, default: [] },
    video: { type: String },
    scheduleMap: { type: Map }
});

module.exports =   mongoose.model('Tutor',Tutorchema);

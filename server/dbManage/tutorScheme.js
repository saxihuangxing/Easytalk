var mongoose = require('./dbHandle.js'),
    Schema = mongoose.Schema;

var Tutorchema = new Schema({
    id: { type: String },
    accountName : { type: String },
    accountPassword: { type: String },
    applyStatus: { type: String},  // 'checking' || 'approved'
    status: { type: String },      // 'normal' || 'deactive'    
    name : { type: String },
    residence: { type: String },
    age: { type: Number },
    gender:{ type:String },
    nationality:{ type:String },
    introduction : { type: String },
    email: { type: String },
    photos: { type: Array, default: [] },
    video: { type: String },
    scheduleMap: { type: Map },
});

module.exports =   mongoose.model('Tutor',Tutorchema);

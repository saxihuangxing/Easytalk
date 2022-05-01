const mongoose = require('./dbHandle.js');
const   Schema = mongoose.Schema;


const topupApplySchema = new Schema({
    id: { type: String, unique:true },
    stuId: { type: String },
    stuName: { type: String },
    walletId: { type: String },
    amount: { type: Number },
    time: { type: Number },
    status: { type: String, default:'waiting' }  //'waiting'|approved'|'reject'
});

module.exports =   mongoose.model('topupApply',topupApplySchema);
const mongoose = require('./dbHandle.js');
const   Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    action: { type: Boolean },  //true: add  , false: decrease
    balance: { type: Number },
    amount: { type: Number },
    time: { type: Number },
    reason: { type: String }, // "Top Up" | "Book Lesson" | "Gift" | "Cancel Lesson" | "Apply Refund"
    refundRate: { type: Number },
    refLessonId: { type: String }, 
})

const WalletSchema = new Schema({
    id: { type: String, unique:true },
    userId: { type: String },
    balance: { type: Number },
    transations: [ TransactionSchema ],
});

module.exports =   mongoose.model('Wallet',WalletSchema);
var mongoose = require('./dbHandle.js'),
    Schema = mongoose.Schema;

var LessonSchema = new Schema({
    lessonId: { type: String, unique:true },
    stuId: { type: String },
    stuName: { type: String },
    tutorId: { type: String },
    tutorName: { type: String},
    bookTime: { type: Number },     //in ms
    lessonTime: { type: Number },   //in minute
    textBook: { type: String },
    lessonType: { type: String, enum:['book','sudden'] },
    status: { type: String, enum:['waiting', 'taking', 'finished', 'canceled', 'dispute', 'refund'] },
    cost: { type: Number },    
    refundCoin: { type: Number},
    stuRate: { type: Number, min:1 ,max:5 },
    stuComment: { type : String },
    tutorComment: { type: String },
});

module.exports =   mongoose.model('Lesson',LessonSchema);

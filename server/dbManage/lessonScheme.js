var mongoose = require('./dbHandle.js'),
    Schema = mongoose.Schema;

var LessonSchema = new Schema({
    lessonId: { type: String },
    stuId: { type: String },
    stuName: { type: String },
    tutorId: { type: String },
    tutorName: { type: String},
    bookTime: { type: Number },     //in ms
    lessonTime: { type: Number },   //in minute
    textBook: { type: String },
    lessonType: { type: String },  // 'book' | 'sudden'
    status: { type: String },      // 'waiting' | 'taking' | 'finished'    
});

module.exports =   mongoose.model('Lesson',LessonSchema);

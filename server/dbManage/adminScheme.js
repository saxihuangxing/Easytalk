var mongoose = require('./dbHandle.js'),
    Schema = mongoose.Schema;

var AdminSchema = new Schema({
    accountName : { type: String },
    accountPassword: { type: String },
});

module.exports = mongoose.model('Admin',AdminSchema);
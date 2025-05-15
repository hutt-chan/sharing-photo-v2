const mongoose = require('mongoose');
const schemaInfoSchema = new mongoose.Schema({
  version: Number,
});
module.exports = mongoose.model('SchemaInfo', schemaInfoSchema);
const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const schema = new Schema({
  text: String,
  status: String,
  userId: { type: ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Task', schema);

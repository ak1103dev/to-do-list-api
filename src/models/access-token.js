const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const schema = new Schema({
  token: String,
  userId: { type: ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AccessToken', schema);

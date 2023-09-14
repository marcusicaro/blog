const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
  title: { type: String, required: false },
  timestamp: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
});

CommentsSchema.virtual('url').get(function () {
  return `/comment/${this._id}`;
});

// Define a virtual property for formatted date
CommentsSchema.virtual('formattedDate').get(function () {
  return moment(this.timestamp).format('DD/MM/YYYY HH:mm');
});

module.exports = mongoose.model('Comment', CommentsSchema);

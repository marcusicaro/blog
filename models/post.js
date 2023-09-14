const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const PostsSchema = new Schema({
  title: { type: String, required: true },
  timestamp: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  visible: { type: Boolean, default: true },
});

PostsSchema.virtual('url').get(function () {
  return `/post/${this._id}`;
});

// Define a virtual property for formatted date
PostsSchema.virtual('formattedDate').get(function () {
  return moment(this.timestamp).format('DD/MM/YYYY HH:mm');
});

module.exports = mongoose.model('Post', PostsSchema);

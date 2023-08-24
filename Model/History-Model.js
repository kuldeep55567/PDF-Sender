const mongoose = require("mongoose");
const HistorySchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false
  },
  date_added: {
    type: Date,
    default: Date.now
  },
  history:{
    type:Array,
    default:[]
  }
},{
  versionKey:false
});

const HistoryModel = mongoose.model('History', HistorySchema);
module.exports = { HistoryModel };

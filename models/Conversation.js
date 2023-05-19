const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

const conversationSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },

    message: {
      type: String,
      required: true,
      min: 1,
      max: [500, "Has superado el máximo de caracteres para tu mensaje"],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = { Sample };

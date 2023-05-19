const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    salesman: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    messages: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      ref: "Message",
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = { Chat };

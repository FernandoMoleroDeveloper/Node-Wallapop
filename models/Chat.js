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
      type: [
        {
          text: {
            type: String,
            required: true,
            trim: true,
            minlength: [1, "El mensaje tiene que tener 1 caracter como mínimo y 150 como máximo."],
            maxlength: [150, "El mensaje tiene que tener 1 caracter como mínimo y 150 como máximo."],
          },
          from: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
          },
          to: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
          },
          date: {
            type: Date,
            default: new Date(),
            required: true,
          },
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = { Chat };

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [3, "The product name must have 3 characters minimum"],
      maxLength: [50, "The product name must have lower than 50 characters"],
      trim: true
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxLength: [150, "The product name must have 150 characters maximum"],
      trim: true
    },
    photo: {
      type: String,
      require: true,
    },
    salesman: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema, "products");
module.exports = { Product };

const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { User } = require("../models/User.js");
const { Product } = require("../models/Product.js");

const userReslationsSeed = async () => {
  try {
    await connect();
    console.log("Tenemos conexión!");

    // Recuperamos usuarios y productos
    const users = await User.find();
    const products = await Product.find();

    // Comprobar que existen coches
    if (!users.length) {
      console.error("No hay usuarios para relacionar en la base de datos");
      return;
    }

    if (!products.length) {
      console.error("No hay productos para relacionar en la base de datos");
      return;
    }

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const randomProduct = products[generateRandom(0, products.length - 1)];
      const randomUser = users[generateRandom(0, users.length - 1)];
      user.owner = randomUser.id;
      user.brand = randomProduct.id;
      await user.save();
    }

    console.log("Relaciones entre coches-marcas-usuarios creadas correctamente.");
  } catch (error) {
  } finally {
    mongoose.disconnect();
  }
};

userReslationsSeed();

const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { User } = require("../models/User.js");
const { Product } = require("../models/Product.js");

const relationSeed = async () => {
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

    for (let i = 0; i < products.length; i++) {
      products[i].salesman = users[i];
      await products[i].save();
    }

    console.log("Relaciones entre coches-marcas-usuarios creadas correctamente.");
  } catch (error) {
    console.error("Algo ha salido mal... :(");
  } finally {
    mongoose.disconnect();
  }
};

relationSeed();

const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { Product } = require("../models/Product.js");

let productList = [
  {
    name: "Satisfayer",
    price: 37,
    description: "Famoso succionador vaginal, sin usar, me lo regalaron y ya tenía uno",
  },
  {
    name: "Esposas sexuales",
    price: 12,
    description: "Esposas sexuales rojas, ribete de polipiel e interior suave al tacto. Las correas son ajustables para adaptarse a todos los tamaños de muñeca sin pellizcar",
  },
  {
    name: "Plug cola de zorra",
    price: 20,
    description: "La longitud total de este juguete anal es de 40 centímetros. La profundidad de inserción del tapón anal es de 6 centímetros. El diámetro es de 2.7 centímetros.",
    photo: imageContentThree,
  },
  {
    name: "Vibrador rabbit",
    price: 50,
    description: "Doble estimulación. Del clítoris y del punto G gracias a sus 10 programas de vibraciones intensificados por 5 niveles de velocidad para lograr distintas sensaciones progresivas y cada vez más potentes",
  },
];

console.log(productList);

const productSeed = async () => {
  try {
    const database = await connect();
    await Product.collection.drop();
    console.log("Borrados products");
    await Product.insertMany(productList);
    console.log("Creados products correctamente");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};

productSeed();

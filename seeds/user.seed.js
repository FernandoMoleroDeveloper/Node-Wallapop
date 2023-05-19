const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { User } = require("../models/User.js");

const userList = [
  {
    fullName: "Juan García Pérez",
    email: "juan.garcia.perez@example.com",
    password: "juan1234"
  },
  {
    fullName: "María Rodríguez López",
    email: "maria.rodriguez.lopez@example.com",
    password: "maria5678"
  },
  {
    fullName: "Pedro Fernández Ruiz",
    email: "pedro.fernandez.ruiz@example.com",
    password: "pedro9012"
  },
  {
    fullName: "Laura Sánchez Navarro",
    email: "laura.sanchez.navarro@example.com",
    password: "laura3456"
  }
];


console.log(userList);

const userSeed = async () => {
  try {
    const database = await connect();
    await User.collection.drop();
    console.log("Borrados users");
    const documents = userList.map((user) => new User(user));
    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];
      await document.save();
    }
    console.log("Creados users correctamente");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};

userSeed();

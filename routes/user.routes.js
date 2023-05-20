const express = require("express");
const bcrypt = require("bcrypt")
const { isAuth } = require("../middlewares/auth.middleware.js")
const { generateToken } = require("../utils/token.js")


// Modelos
const { User } = require("../models/User.js")

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("Estamos en el middlware / car que comprueba parámetros");
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;

  if (!isNaN(page) && !isNaN(limit) && page > 0 && limit > 0) {
    req.query.page = page;
    req.query.limit = limit;
    next()
  } else {
    console.log("Parámetros no válidos")
    console.log(JSON.stringify(req.query))
    res.status(400).json({ error: "Params page or limit are not valid" })
  }
})

// CRUD: READ
router.get("/", async (req, res) => {
  try {
    // Asi leemos query params
    const { page, limit} = req.query
    const users = await User.find()
      .limit(limit)
      .skip((page - 1) * limit);

    // Num total de elementos
    const totalElements = await User.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: users,
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// CRUD: READ
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const users = await User.findById(id);
    if (users) {
      res.json(users);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// CRUD: CREATE
router.post("/", async (req, res) => {

  try {
    const user = new User(req.user)

    const createdUser = await user.save();
    return res.status(201).json(createdUser);
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// CRUD: DELETE
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (req.user.id !== id || req.user.email !== "admin@gmail.com") {
      return res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
    }

    const userDeleted = await User.findByIdAndDelete(id);
    if (userDeleted) {
      res.json(userDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// CRUD: UPDATE
router.put("/:id", isAuth, async (req, res) => {
  try {
    const id = req.params.id;

    if (req.user.id !== id || req.user.email !== "admin@gmail.com") {
      return res.status(401).json({ error: "No tienes autorización para realizar esta operación" })
    }

    const userUpdated = await User.findById(id);
    if (userUpdated) {
      Object.assign(userUpdated, req.body)
      await userUpdated.save()
      const userToSend = userUpdated.toObject()
      delete userToSend.password
      res.json(userToSend);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error)
  }
});


//CRUD: LOGIN

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Se deben especificar los campos email y password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Email y/o contraseña incorrectos" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      // Quitamos password de la respuesta
      const userWithoutPass = user.toObject();
      delete userWithoutPass.password;

      const jwtToken = generateToken(user._id, user.email);

      return res.status(200).json({ token: jwtToken });
    } else {
      return res.status(401).json({ error: "Email y/o contraseña incorrectos" });
    }
  } catch (error) {
    next(error);
  }
});


module.exports = { userRouter: router };

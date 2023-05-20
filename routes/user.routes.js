const express = require("express");
const bcrypt = require("bcrypt")
const { isAuth } = require("../middlewares/auth.middleware.js")
const { generateToken } = require("../utils/token.js")
const fs = require("fs")
const multer = require("multer")
const upload = multer({ dest: "public" });


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
  console.log(req.headers);

  try {
    const sample = new Sample({
      title: req.body.title,
      subtitle: req.body.subtitle,
    });

    const createdSample = await sample.save();
    return res.status(201).json(createdSample);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// CRUD: DELETE
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const sampleDeleted = await Sample.findByIdAndDelete(id);
    if (sampleDeleted) {
      res.json(sampleDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// CRUD: UPDATE
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const sampleUpdated = await Sample.findByIdAndUpdate(id, req.body, { new: true });
    if (sampleUpdated) {
      res.json(sampleUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

module.exports = { sampleRouter: router };

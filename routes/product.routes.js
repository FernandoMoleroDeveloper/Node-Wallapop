const express = require("express");
// Modelos
const { Product } = require("../models/Product.js");
const { isAuth } = require("../middlewares/auth.middleware.js");

const router = express.Router();

// CRUD: READ
router.get("/", (req, res, next) => {
  console.log("Estamos en el middleware /product que comprueba parametros");
  const page = req.querypage ? parseInt(req.querypage) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  if (!isNaN(page) && !isNaN(limit) && page > 0 && limit > 0) {
    req.query.page = page;
    req.query.limit = limit;
    next();
  } else {
    console.log("Parametros no validos:");
    console.log(JSON.stringify(req.query));
    res.status(400).json({ error: "Params page or limit are not valid" });
  }
});
router.get("/", async (req, res, next) => {
  try {
    // Así leemos query params
    const { page, limit } = req.query;
    const products = await Product.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .populate("User");

    // Num total de elementos
    const totalElements = await Product.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: products,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// CRUD: READ
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id).populate("User");
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

router.get("/name/:name", async (req, res) => {
  const name = req.params.name;

  try {
    const product = await Product.find({ name: new RegExp("^" + name.toLowerCase(), "i") }).populate("author");
    if (product?.length) {
      res.json(product);
    } else {
      res.status(404).json([]);
    }
  } catch (error) {
    next(error);
  }
});

// CRUD: CREATE
router.post("/", isAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    if (req.user.id !== id && req.user.email !== "admin@gmail.com") {
      return res.status(404).json({ error: "No tienes autorizacion para realizar esta operacion" });
    }
    const product = new Product(req.body);
    const createdProduct = await product.save();
    return res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
});

// CRUD: DELETE
router.delete("/:id", isAuth, async (req, res) => {
  try {
    const id = req.params.id;
    if (req.user.id !== id && req.user.email !== "admin@gmail.com") {
      return res.status(404).json({ error: "No tienes autorizacion para realizar esta operacion" });
    }
    const productDeleted = await Product.findByIdAndDelete(id);
    if (productDeleted) {
      res.json(productDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

// CRUD: UPDATE
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const productUpdated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (productUpdated) {
      res.json(productUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

module.exports = { productRouter: router };

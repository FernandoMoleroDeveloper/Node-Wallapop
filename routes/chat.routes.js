const express = require("express");

// Modelos
const { Chat } = require("../models/Chat.js");
const { isAuth } = require("../middlewares/auth.middleware.js");
const { Product } = require("../models/Product.js");

// Router propio de usuarios
const router = express.Router();

// CRUD: READ
router.get("/", (req, res, next) => {
  try {
    console.log("Estamos en el middleware /chat que comprueba parámetros");

    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    if (!isNaN(page) && !isNaN(limit) && page > 0 && limit > 0) {
      req.query.page = page;
      req.query.limit = limit;
      next();
    } else {
      console.log("Parámetros no válidos:");
      console.log(JSON.stringify(req.query));
      res.status(400).json({ error: "Params page or limit are not valid" });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/", isAuth, async (req, res, next) => {
  try {
    // Asi leemos query params
    const { page, limit } = req.query;
    const chats = await Chat.find({ $or: [{ buyer: req.user.id }, { salesman: req.user.id }] })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate(["buyer", "salesman", "product"]);

    // Num total de elementos
    const totalElements = await Chat.countDocuments({ $or: [{ buyer: req.user.id }, { salesman: req.user.id }] });

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: chats,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// CRUD: READ
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const chat = await Chat.findById(id).populate(["buyer", "salesman", "product"]);
    if (chat) {
      res.json(chat);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

// Endpoint de creación de chats
// CRUD: CREATE
router.post("/", isAuth, async (req, res, next) => {
  try {
    const product = await Product.findById(req.body.productId);

    if (product) {
      const chat = new Chat({
        buyer: req.user.id,
        salesman: product.salesman,
        product: product,
        message: [],
      });

      const createdChat = await chat.save();
      return res.status(201).json(createdChat);
    } else {
      return res.status(404).json({ error: "Producto no encontrado..." });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/:id/add-message", isAuth, async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.query.id);
    if (chat) {
      const message = {
        text: req.body.text,
        from: req.user.id,
        to: req.user.id === chat.buyer ? chat.salesman : chat.buyer,
      };
      chat.messages.push(message);
    }
    const createdChat = await chat.save();
    return res.status(201).json(createdChat);
  } catch (error) {
    next(error);
  }
});

module.exports = { chatRouter: router };

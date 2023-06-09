const express = require("express");
const { chatRouter } = require("./routes/chat.routes.js");
const { productRouter } = require("./routes/product.routes.js");
const { userRouter } = require("./routes/user.routes.js");
const { errorServer } = require("./middlewares/error.middleware.js");

// Conexión a la BBDD
const { connect } = require("./db.js");
connect();

// Configuración del server
const PORT = 3000;
const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

// Rutas
const router = express.Router();
router.get("/", (req, res) => {
  res.send("Esta es la home de nuestra API");
});
router.get("*", (req, res) => {
  res.status(404).send("Lo sentimos :( No hemos encontrado la página solicitada.");
});

// Usamos las rutas
server.use("/chat", chatRouter);
server.use("/product", productRouter);
server.use("/user", userRouter);
server.use("/", router);

server.use((err, req, res, next) => {
  errorServer(err, req, res, next);
});

server.listen(PORT, () => {
  console.log(`Server levantado en el puerto ${PORT}`);
});

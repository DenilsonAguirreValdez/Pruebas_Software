const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const app = express();

// Socket.io Setup
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

io.on("connection", (socket) => {
  socket.on('send_car', function(data) {
    console.log(data);
    io.emit('listen_car', data);
  });
});

// Import Routes
const customer_router = require("./routes/customer");
const users_router = require("./routes/users");
const products_router = require("./routes/product");
const public_product = require("./routes/public");
const customer_ecomerce_router = require("./routes/customerEcomerce");

// Middleware
app.use(bodyparser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyparser.json({ limit: "50mb", extended: true }));

// Port Configuration
const port = process.env.PORT || 4200;

// Database Connection
mongoose
  .connect("mongodb+srv://ader0514:Ader0514@cluster0.wr9uiud.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("Conexión exitosa a la base de datos");
    httpServer.listen(port, () => {
      console.log(`El servidor se ejecuta en el puerto ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
  });

// CORS Configuration
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Allow", "GET, PUT, POST, DELETE, OPTIONS");
  next();
});

// Routes
app.use("/api", customer_router);
app.use("/api", users_router);
app.use("/api", products_router);
app.use("/api", public_product);
app.use("/api", customer_ecomerce_router);

module.exports = app;

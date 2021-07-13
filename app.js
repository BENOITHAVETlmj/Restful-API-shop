const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");

mongoose.connect(
  "mongodb+srv://benoitleehavet:" +
    process.env.MONGO_ATLAS_PW +
    "@api-rest-shop.pcmoz.mongodb.net/api-rest-shop?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

//get log of what request has been done
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Handling Cors and prevent errors in browser
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-Width, Content-Type, Accept, Authorization"
  );
  if (req.method == "Options") {
    res.header("Access-Control-Allow-Methods", "POST, PUT, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productRoutes);
app.use("/orders", ordersRoutes);

//error handling if none of the 2 routes above are not called
app.use((req, res, next) => {
  const error = new Error("not found");
  error.status = 404;
  //forward the request error
  next(error);
});

// handle any kind of errors
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ error: { message: error.message } });
});

module.exports = app;

const express = require("express");
const app = express();
const morgan = require("morgan");

const productRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");

//get log of what request has been done
app.use(morgan("dev"));

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

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../../models/order");
const Product = require("../../models/product");
const PROD = "https://shopserverapp.herokuapp.com/";

router.get("/", (req, res, next) => {
  Order.find()
    .select("_id product quantity")
    .populate("product", "name")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url:
                (process.env.PORT === PROD
                  ? PROD + "/orders/"
                  : "http://localhost:3000/orders/") + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      err.status(500).json({ error: err });
    });
});

router.post("/", (req, res, next) => {
  //check if we have this product
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      // we define that we need a body on a POST request as a json object like this
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity,
      });
      //persisting in data base and get response
      return order.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Order stored",
        request: {
          type: "GET",
          createdOrder: {
            _id: result._id,
            product: result.product,
            quantity: result.quantity,
          },
          url:
            (process.env.PORT === PROD
              ? PROD + "/orders/"
              : "http://localhost:3000/orders/") + result._id,
        },
      });
    })
    .catch((err) => {
      console.log(err), res.status(500).json({ error: err });
    });
});

router.get("/:orderId", (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate("product")
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url:
            process.env.PORT === PROD
              ? PROD + "/orders/"
              : "http://localhost:3000/orders/",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.delete("/:orderId", (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then((order) =>
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "POST",
          url:
            process.env.PORT === PROD
              ? PROD + "/orders/"
              : "http://localhost:3000/orders/",
          body: { productId: "String", quantity: "Number" },
        },
      })
    )
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;

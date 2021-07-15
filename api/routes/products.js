const express = require("express");
const router = express.Router();
const Product = require("../../models/product");
const mongoose = require("mongoose");

router.get("/", (req, res, next) => {
  Product.find()
    // wanna only this 3 property only
    .select("name price _id")
    .exec()
    .then((docs) => {
      if (docs.length > 0) {
        // set a new format of response
        const response = {
          count: docs.length,
          products: docs.map((doc) => {
            return {
              name: doc.name,
              price: doc.price,
              _id: doc._id,
              request: {
                type: "GET",
                url: "http://localhost:3000/products/" + doc._id,
              },
            };
          }),
        };
        res.status(200).json(response);
      } else {
        res.status(404).json({ message: "No entry found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.post("/", (req, res, next) => {
  // we define that we need a body on a POST request as a json object like this
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  //persist in database my new instance created
  const productExist = Product.findOne({
    existingName: req.body.name,
  });
  if (productExist) {
    res.status(406).json({
      error: { message: "This product name already exists in the list" },
    });
  } else {
    product
      .save()
      .then((result) => {
        console.log(result);
        res.status(201).json({
          messages: "Created product successfully",
          createdProduct: {
            name: result.name,
            price: result.price,
            _id: result._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + result._id,
            },
          },
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  }
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id")
    .exec()
    .then((doc) => {
      if (doc) {
        const response = {
          name: doc.name,
          price: doc.price,
          _id: doc._id,
          request: {
            type: "GET",
            description: "get all products",
            url: "http://localhost:3000/products/",
          },
        };
        res.status(200).json(response);
      } else {
        res.status(404).json({ message: "No valid id found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  //check my body req to see which update is requested
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product updated successfully",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) =>
      res.status(200).json({
        message: "Deleted successfully",
        request: {
          type: "POST",
          url: "http://localhost:3000/products/",
          body: { name: "String", price: "Number" },
        },
      })
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;

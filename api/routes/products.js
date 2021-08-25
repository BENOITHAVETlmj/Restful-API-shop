const express = require("express");
const router = express.Router();
const Product = require("../../models/product");
const mongoose = require("mongoose");
const multer = require("multer");
require("dotenv").config();
const PROD = "https://shopserverapp.herokuapp.com/";

// this function will be run everytime a newfile is created
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// store and filter type of img we wanna store
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

router.get("/", (req, res, next) => {
  Product.find()
    // wanna only this 3 property only
    .select("name price _id productImage")
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
              productImage: doc.productImage,
              request: {
                type: "GET",
                url:
                  (process.env.PORT === PROD
                    ? PROD + "products/"
                    : "http://localhost:3000/products/") + doc._id,
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

// single() middleware here will parse my data image file
router.post("/", upload.single("productImage"), (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    // get the image and sending it by the path
    // productImage: req.file.path,
  });
  //persist in database my new instance created
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
            url:
              (process.env.PORT === PROD
                ? PROD + "/products/"
                : "http://localhost:3000/products/") + result._id,
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
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id productImage")
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
            url:
              process.env.PORT === PROD
                ? PROD + "/products/"
                : "http://localhost:3000/products/",
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
          url:
            (process.env.PORT === PROD
              ? PROD + "/products/"
              : "http://localhost:3000/products/") + id,
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
          url:
            process.env.PORT === PROD
              ? PROD + "/products/"
              : "http://localhost:3000/products/",
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

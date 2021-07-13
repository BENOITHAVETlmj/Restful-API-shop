const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({ messages: "Handling GET resquest to /products" });
});

router.post("/", (req, res, next) => {
  res.status(201).json({ messages: "Handling POST resquest to /products" });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  if (id === "special") {
    res.status(200).json({ messages: "U got tje special id", id: id });
  } else {
    res.status(200).json({ messages: "you passed an id" });
  }
});

router.patch("/:productId", (req, res, next) => {
  res.status(200).json({ messages: "updated product" });
});

router.delete("/:productId", (req, res, next) => {
  res.status(200).json({ messages: "deleted product" });
});

module.exports = router;

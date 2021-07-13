const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({ messages: "orders were fetched" });
});

router.post("/", (req, res, next) => {
  res.status(201).json({ messages: "orders were created" });
});

router.get("/:orderId", (req, res, next) => {
  res.status(200).json({ messages: "orders details", orderId: orderId });
});

router.delete("/:orderId", (req, res, next) => {
  res.status(200).json({ messages: "order deleted" });
});

module.exports = router;

const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({ messages: "orders were fetched" });
});

router.post("/", (req, res, next) => {
  // we define that we need a body on a POST request as a json object like this
  const order = { projectId: req.body.projectId, quantity: req.body.quantity };
  res
    .status(201)
    .json({ messages: "orders were created", createdOrder: order });
});

router.get("/:orderId", (req, res, next) => {
  res.status(200).json({ messages: "orders details", orderId: orderId });
});

router.delete("/:orderId", (req, res, next) => {
  res.status(200).json({ messages: "order deleted" });
});

module.exports = router;

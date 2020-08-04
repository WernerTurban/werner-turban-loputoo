const express = require("express");
const Client = require("../../../models/client");
const verify = require("../verifyToken");

const router = express.Router();

router.post("/", verify, async (req, res) => {
  const client = new Client({
    name: req.body.name,
    email: req.body.email,
    gender: req.body.gender
  });
  try {
    const savedClient = await client.save();
    res.json(savedClient);
  } catch (err) {
    res.json({ message: err });
  }
  client.save();
});

module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  res.send("Login");
});

router.post("/register", async (req, res) => {
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(401).send("401");
  const nameExists = await User.findOne({ name: req.body.name });
  if (nameExists) return res.status(402).send("402");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    email: req.body.email,
    password: hashedPassword,
    name: req.body.name,
    userType: req.body.userType
  });
  try {
    user.save();
    const token = createToken(user);
    res.send({
      token: token
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(401).send("401");
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(401).send("401");

  const token = createToken(user);
  //res.header("auth-token", token).send(token);

  res.send({
    token: token
  });
});

router.get("/getUser", async (req, res) => {
  User.findOne({ email: req.query.email }).then(function(user) {
    user.password = null;
    res.send(user);
  });
});

function createToken(user) {
  const ONE_DAY = 60 * 60 * 24;
  const token = jwt.sign({ _id: user.id }, process.env.TOKEN_SECRET, {
    expiresIn: ONE_DAY
  });
  return token;
}
module.exports = router;

const express = require("express");
const router = express.Router();
const Session = require("../../../models/session");

router.post("/createSession", async (req, res) => {
  const session = new Session({
    therapistId: req.body.therapistId,
    therapistName: req.body.therapistName,
    clientId: req.body.clientId,
    clientName: req.body.clientName
  });
  try {
    await session.save();
    res.send(session);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/findSession", async (req, res) => {
  const sessionExists = await Session.findOne({
    therapistId: req.query.therapistId,
    clientId: req.query.clientId
  });
  if (sessionExists != null) {
    res.send(sessionExists);
  } else {
    res.send(false);
  }
});

router.get("/getSession", async (req, res) => {
  Session.findOne({
    _id: req.query.id
  }).then(function(session) {
    res.send(session);
  });
});

module.exports = router;

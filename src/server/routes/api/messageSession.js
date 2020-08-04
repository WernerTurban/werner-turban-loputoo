const express = require("express");
const MessageSession = require("../../../models/messageSession");
const router = express.Router();

router.post("/createMessageSession", (req, res) => {
  const message = new MessageSession({
    therapistId: req.body.therapistId,
    clientId: req.body.clientId,
    header: req.body.header
  });
  message.save();
  res.send(message);
});

router.get("/findMessageSession", (req, res) => {
  if (req.query.client == "true") {
    MessageSession.find({
      clientId: req.query.id
    }).then(function(messages) {
      res.send(messages);
    });
  } else {
    MessageSession.find({
      therapistId: req.query.id
    }).then(function(messages) {
      res.send(messages);
    });
  }
});

module.exports = router;

const express = require("express");
const Message = require("../../../models/message");

const router = express.Router();

router.post("/sendMessage", req => {
  const message = new Message({
    senderId: req.body.senderId,
    receiverId: req.body.receiverId,
    sessionId: req.body.sessionId,
    senderName: req.body.senderName,
    receiverName: req.body.receiverName,
    header: req.body.header,
    content: req.body.content
  });
  message.save();
});

router.get("/getMyMessages", (req, res) => {
  Message.find({
    receiverId: req.query.id
  }).then(function(messages) {
    messages.sort(compareDates);
    res.send(messages);
  });
});

router.get("/getMessage", (req, res) => {
  Message.findById({
    _id: req.query.id
  }).then(function(message) {
    res.send(message);
  });
});

router.get("/findLastMessage", (req, res) => {
  if (req.query.sender == "true") {
    Message.find({
      sessionId: req.query.sessionId,
      senderId: req.query.id
    })
      .sort({ sended_at: 1 })
      .then(function(messages) {
        if (messages.length > 0) {
          res.send(messages[0]);
        }
      });
  } else {
    Message.find({
      sessionId: req.query.sessionId,
      receiverId: req.query.id
    })
      .sort({ sended_at: -1 })
      .then(function(messages) {
        if (messages.length > 0) {
          res.send(messages[0]);
        }
      });
  }
});

router.get("/getMessagesBySessionId", (req, res) => {
  Message.find({
    sessionId: req.query.sessionId
  })
    .sort({ sended_at: -1 })
    .then(function(messages) {
      res.send(messages);
    });
});

router.patch("/messageIsSeen", async (req, res) => {
  try {
    const updatedMessage = await Message.updateOne(
      { _id: req.body.messageId },
      {
        $set: {
          seen: true
        }
      }
    );
    res.json(updatedMessage);
  } catch (err) {
    res.json({ message: err });
  }
});

function compareDates(firstElement, secondElement) {
  const firstDate = firstElement.date;
  const secondDate = secondElement.date;
  let sequence = 0;
  if (firstDate > secondDate) {
    sequence = 1;
  } else if (firstDate < secondDate) {
    sequence = -1;
  }
  return sequence;
}

module.exports = router;

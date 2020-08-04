const express = require("express");
const router = express.Router();
const Chat = require("../../../models/chat");

router.get("/getMessages", async (req, res) => {
  try {
    const chat = await Chat.findOne({
      appointmentId: req.query.id
    });
    res.send(chat.messages);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;

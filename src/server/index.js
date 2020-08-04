const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv/config");
const app = express();
const morgan = require("morgan");
const http = require("http");
const server = http.createServer(app);
app.use(express.urlencoded({ extended: true }));

//Middleware
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 5000;

const therapist = require("./routes/therapists");
const client = require("./routes/api/clients");
const auth = require("./routes/api/auth");
const chat = require("./routes/api/chat");
const appointment = require("./routes/api/appointment");
const session = require("./routes/api/session");
const message = require("./routes/api/message");
const messageSession = require("./routes/api/messageSession");
const Chat = require("../models/chat");
const ChatMessage = require("../models/chatMessage");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => {
    console.log("Connected to the database");
  }
);

app.use("/therapists", therapist);
app.use("/clients", client);
app.use("/auth", auth);
app.use("/chat", chat);
app.use("/appointment", appointment);
app.use("/session", session);
app.use("/message", message);
app.use("/messageSession", messageSession);

server.listen(port, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} and started on port ${port}`
  )
);

const io = require("socket.io").listen(server);

io.on("connection", socket => {
  console.log("there is a connection!");
  socket.on("save-chat", async data => {
    try {
      const chatExists = await Chat.findOne({
        appointmentId: data.appointmentId
      });
      if (chatExists) {
        console.log("chat already exists");
      } else {
        const chat = new Chat({
          clientId: data.clientId,
          therapistId: data.therapistId,
          appointmentId: data.appointmentId,
          time: data.time,
          date: data.date,
          messages: []
        });
        try {
          await chat.save();
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
  socket.on("disconnect", () => {
    console.log("Disconnect");
  });
  socket.on("chat-message", async data => {
    try {
      const chatExists = await Chat.findOne({
        appointmentId: data.appointmentId
      });
      if (chatExists) {
        const message = new ChatMessage({
          clientId: data.clientId,
          therapistId: data.therapistId,
          senderId: data.senderId,
          appointmentId: data.appointmentId,
          time: data.time,
          content: data.content
        });
        try {
          await Chat.updateOne(
            {
              appointmentId: data.appointmentId
            },
            {
              $push: {
                messages: {
                  clientId: message.clientId,
                  therapistId: message.therapistId,
                  senderId: message.senderId,
                  time: message.time,
                  content: message.content
                }
              }
            }
          );
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {
      console.log("chat does not exist");
    }
    socket.broadcast.emit("chat-message", data);
  });
});

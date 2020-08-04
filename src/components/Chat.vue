<template>
  <v-card flat class="ma-3 mt-10" v-if="status != 'confirmed'">
    <v-card-title id="title" v-if="user == appointment.therapistId">
      Suhtlus kasutajaga {{ appointment.clientName }}
      {{ appointment.formattedDate }}</v-card-title
    >
    <v-card-title id="title" v-if="user == appointment.clientId">
      Suhtlus terapeudiga {{ appointment.therapistName }}
      {{ appointment.formattedDate }}
    </v-card-title>
    <v-sheet id="sheet">
      <v-card-text>
        <v-row
          v-for="message in messages"
          :key="message.id"
          :justify="message.justify"
        >
          <v-col cols="12" md="6" :align="message.justify">
            <div class="caption grey--text">{{ message.time }}</div>
            <div :class="message.text" id="chatSentence">
              {{ message.message }}
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-sheet>
    <v-divider></v-divider>
    <v-card-text>
      <v-row v-if="status == 'active'" no-gutters>
        <v-col cols="8" md="10">
          <v-textarea
            label="Kirjuta sõnum"
            auto-grow
            outlined
            rows="1"
            row-height="15"
            v-model="newMessage"
          ></v-textarea>
        </v-col>
        <v-col cols="4" md="2" v-if="status == 'active'" align="end">
          <div class="my-2">
            <v-btn @click="send()" color="primary" large dark>
              <v-icon>send</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-card v-else>
    <v-card-title>
      <v-card-title v-if="user == appointment.therapistId">
        Suhtlus kasutajaga {{ appointment.clientName }} algab
        {{ appointment.formattedDate }} kell
        {{ appointment.time }}</v-card-title
      >
      <v-card-title v-if="user == appointment.clientId">
        Suhtlus terapeudiga {{ appointment.therapistName }} algab
        {{ appointment.formattedDate }} kell
        {{ appointment.time }}</v-card-title
      >
    </v-card-title>
  </v-card>
</template>

<script>
import io from "socket.io-client";
import moment from "moment";
var socket = io.connect("http://localhost:5000/");
import BookingService from "../service/BookingService";
import store from "../store";

export default {
  props: {
    appointment: {
      type: Object
    }
  },
  data() {
    return {
      newMessage: "",
      messages: [],
      user: "",
      status: "",
      checkTime: ""
    };
  },
  created() {
    moment.locale("et");
    this.checkAppointment();
    const messageHistory = [];
    let user;
    if (store.getters["auth/userType"] == "client") {
      user = store.getters["auth/id"];
    } else {
      user = store.getters["auth/therapistId"];
    }
    this.user = user;
    BookingService.getMessages(this.appointment._id)
      .then(response => {
        response.data.forEach(function(item) {
          if (item.senderId != null && item.senderId != undefined) {
            if (item.senderId == user) {
              messageHistory.push({
                message: item.content,
                user: 0,
                text: "myText",
                justify: "end",
                time: item.time
              });
            } else {
              messageHistory.push({
                message: item.content,
                user: 1,
                text: "otherText",
                justify: "start",
                time: item.time
              });
            }
          }
        });
        this.messages = messageHistory;
      })
      .catch(e => {
        console.log("error: ", e);
      });
    const chat = {
      clientId: this.appointment.clientId,
      therapistId: this.appointment.therapistId,
      appointmentId: this.appointment._id,
      time: this.appointment.time,
      date: this.appointment.date
    };
    socket.emit("save-chat", chat);
    socket.on("chat-message", () => {
      BookingService.getMessages(this.appointment._id).then(response => {
        let lastMessage = [];
        response.data.forEach(function(item) {
          lastMessage = item;
        });
        messageHistory.push({
          message: lastMessage.content,
          user: 1,
          text: "otherText",
          justify: "start",
          time: lastMessage.time
        });
      });
    });
  },
  methods: {
    async send() {
      const sendMessage = {
        clientId: this.appointment.clientId,
        therapistId: this.appointment.therapistId,
        senderId: this.user,
        appointmentId: this.appointment._id,
        time: moment(Date.now()).format("LT"),
        content: this.newMessage
      };
      await this.messages.push({
        message: this.newMessage,
        user: 0,
        text: "myText",
        justify: "end",
        time: sendMessage.time
      });
      socket.emit("chat-message", sendMessage);
      this.newMessage = null;
      this.scrollToEnd();
    },
    scrollToEnd: function() {
      const el = this.$el.querySelector("#sheet");
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    },
    checkAppointment() {
      let appointmentTime = moment(this.appointment.date, "DD-MM-YYYY");
      appointmentTime.set({ h: 9 + parseInt(this.appointment.hourId), m: 0 });
      let currentTime = moment();
      //currentTime = moment(currentTime).add(9, "hours");
      let appointmentEndTime = moment(appointmentTime).add(60, "minutes");
      if (currentTime >= appointmentTime && currentTime < appointmentEndTime) {
        if (status != "active") {
          this.status = "active";
          BookingService.activateAppointment(this.appointment._id);
        }
      } else {
        if (currentTime > appointmentTime) {
          this.status = "done";
          BookingService.endAppointment(this.appointment._id);
          clearInterval(this.checkTime);
        } else {
          this.status = "confirmed";
        }
      }
    }
  },
  mounted: function() {
    this.checkTime = window.setInterval(() => {
      this.checkAppointment();
    }, 10000);
  },
  beforeDestroy() {
    clearInterval(this.checkTime);
  }
};
</script>

<style lang="scss" scoped>
.myText,
.otherText {
  display: inline-block;
  padding: 10px;
  border-bottom-right-radius: 25px;
  border-bottom-left-radius: 25px;
}
.otherText {
  background-color: #5e35b1;
  border-top-right-radius: 25px;
  color: white;
}
.myText {
  background-color: whitesmoke;
  border-top-left-radius: 25px;
  color: black;
}
#chatSentence {
  word-wrap: break-word;
  max-width: 100%;
}
#sheet {
  max-height: 400px;
  overflow-y: auto;
}
#title {
  font-size: 20px;
  @media only screen and (max-width: 600px) {
    font-size: 16px;
    word-wrap: break-word !important;
  }
}
</style>

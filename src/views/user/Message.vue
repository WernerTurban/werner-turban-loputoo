<template>
  <v-container>
    <v-card flat class="ma-3 mt-10">
      <v-card-title> {{ message.header }} </v-card-title>
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12" sm="6">
            <p class="title">Sõnum kasutajalt: {{ message.senderName }}</p>
          </v-col>
          <v-col cols="12" sm="6" align="end">
            <p class="title">
              {{ message.sended_at }}
            </p>
          </v-col>
          <v-col cols="12">
            <p>kasutajale: {{ message.receiverName }}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <p style="color: black">
              {{ message.content }}
            </p>
          </v-col>
        </v-row>
      </v-card-text>
      <v-row>
        <v-col cols="12" align="end">
          <div>
            <v-btn
              v-if="replyButton"
              style="margin-top: 5px; margin-right: 30px"
              right
              rounded
              color="purple darken-1"
              depressed
              dark
              @click="sendReply()"
              >Vasta</v-btn
            >
            <v-btn
              style="margin-top: 5px; margin-right: 30px"
              right
              rounded
              color="purple darken-1"
              depressed
              dark
              @click="showConversation()"
              >Kuva kogu vestlust</v-btn
            >
          </div>
        </v-col>
      </v-row>
    </v-card>
    <v-dialog v-model="showSendDialog" max-width="600">
      <v-card>
        <v-container>
          <v-form ref="form">
            <v-card-title>Saada vastus</v-card-title>
            <v-row class="ml-2" style="margin-bottom: 10px">
              <v-col cols="12">
                <v-textarea
                  label="Vastuse sisu"
                  v-model="replyText"
                  auto-grow
                  rows="1"
                  :rules="inputRules"
                >
                </v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" align="end">
                <div>
                  <v-btn
                    style="margin-top: 5px; margin-right: 30px"
                    right
                    rounded
                    color="purple darken-1"
                    depressed
                    dark
                    @click="send()"
                    >Vasta</v-btn
                  >
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>
    <SessionMessages v-bind:messages="messages" v-if="showMessages" />
  </v-container>
</template>

<script>
import BookingService from "../../service/BookingService";
import moment from "moment";
import store from "../../store";
import SessionMessages from "../../components/SessionMessages";
export default {
  components: { SessionMessages },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      message: {},
      showSendDialog: false,
      inputRules: [
        v => (v && v.length >= 0) || "Väli peab saatmiseks olema täidetud!"
      ],
      replyText: "",
      replyButton: true,
      messages: [],
      showMessages: false
    };
  },
  created() {
    moment.locale("et");
    BookingService.getMessage(this.id).then(response => {
      this.message = response.data;
      console.log(response.data);
      this.message.sended_at = moment(this.message.sended_at).format("LLL");
      if (
        this.message.senderId == store.getters["auth/id"] ||
        this.message.senderId == store.getters["auth/therapistId"]
      ) {
        this.replyButton = false;
      }
      if (
        this.message.seen == false &&
        store.getters["auth/id"] != this.message.senderId &&
        store.getters["auth/therapistId"] != this.message.senderId
      ) {
        BookingService.messageIsSeen(this.message._id);
      }
    });
  },
  methods: {
    sendReply() {
      this.showSendDialog = true;
    },
    send() {
      if (this.$refs.form.validate()) {
        BookingService.sendMessage(
          this.message.receiverId,
          this.message.senderId,
          this.message.sessionId,
          this.message.receiverName,
          this.message.senderName,
          this.message.header,
          this.replyText
        );
        this.showSendDialog = false;
      }
    },
    showConversation() {
      BookingService.getMessagesBySessionId(this.message.sessionId).then(
        response => {
          this.messages = response.data;
          this.showMessages = true;
          this.formatDates();
        }
      );
    },
    formatDates() {
      moment.locale("et");
      moment;
      if (this.messages.length > 0) {
        this.messages.forEach(message => {
          message.sended_at = moment(message.sended_at).format("LLL");
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  @media only screen and (min-width: 1920px) {
    width: 1200px;
  }
}
</style>

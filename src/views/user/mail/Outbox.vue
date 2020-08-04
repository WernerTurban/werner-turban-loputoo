<template>
  <MessageList v-bind:messages="messages" v-bind:sentMessages="sentMessages" />
</template>

<script>
import BookingService from "../../../service/BookingService";
import moment from "moment";
import store from "../../../store";
import MessageList from "../../../components/MessageList";

export default {
  components: { MessageList },
  data() {
    return {
      messages: [],
      sessions: [],
      id: "",
      sentMessages: true
    };
  },
  mounted() {
    this.sessions = this.$store.state.mailSessions;
    if (store.getters["auth/userType"] == "client") {
      this.id = store.getters["auth/id"];
    } else {
      this.id = store.getters["auth/therapistId"];
    }
    this.findLatestSentMessages();
  },
  methods: {
    async findLatestSentMessages() {
      for (let session in this.sessions) {
        let messages = this.messages;
        await BookingService.findLastMessage(
          this.sessions[session]._id,
          this.id,
          true
        ).then(response => {
          messages.push(response.data);
          this.messages = messages;
          this.message = response.data;
        });
      }
      this.formatDates();
    },
    formatDates() {
      moment.locale("et");
      moment;
      if (this.messages.length > 0) {
        this.messages.forEach(message => {
          message.sended_at = moment(message.sended_at).format("LLL");
          message.seen = true;
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>

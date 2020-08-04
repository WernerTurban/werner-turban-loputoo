<template>
  <router-view v-if="isMounted"></router-view>
</template>

<script>
import BookingService from "../../service/BookingService";
import store from "../../store";
export default {
  data() {
    return {
      messages: [],
      sessions: [],
      message: {},
      isMounted: false,
      id: "",
      client: false
    };
  },
  async created() {
    if (store.getters["auth/userType"] == "client") {
      this.id = store.getters["auth/id"];
      this.client = true;
    } else {
      this.id = store.getters["auth/therapistId"];
      this.client = false;
    }
    await BookingService.findMessageSession(this.id, this.client).then(
      response => {
        this.sessions = response.data;
      }
    );
    this.$store.state.mailSessions = this.sessions;
    this.isMounted = true;
  }
};
</script>

<style lang="scss" scoped></style>

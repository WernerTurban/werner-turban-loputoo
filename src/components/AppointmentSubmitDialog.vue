<template>
  <v-card>
    <v-container>
      <v-card-title>Kinnita teraapia</v-card-title>
      <v-row class="ml-2" style="margin-bottom: 10px">
        <v-col cols="6">
          <div class="caption grey--text">Kuupäev</div>
          <div>{{ selectedAppointment.formattedDate }}</div>
        </v-col>
        <v-col cols="6">
          <div class="caption grey--text">Kellaaeg</div>
          <div>{{ selectedAppointment.time }}</div>
        </v-col>
      </v-row>
      <v-row class="ml-2">
        <v-col cols="6">
          <div class="caption grey--text">Terapeut</div>
          <div>{{ selectedAppointment.therapistName }}</div>
        </v-col>
        <v-col cols="6">
          <v-select
            v-model="test"
            :items="selectedAppointment.therapies"
            label="Vali teraapia"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" align="end">
          <div>
            <v-btn
              style="margin-top: 5px; margin-right: 30px"
              right
              small
              rounded
              color="purple darken-1"
              depressed
              dark
              @click="submitAppointment()"
              >Kinnita</v-btn
            >
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import BookingService from "../service/BookingService";
import store from "../store";
export default {
  props: {
    selectedAppointment: {
      type: Object
    },
    test: {
      type: String
    }
  },
  methods: {
    async submitAppointment() {
      if (this.selectedAppointment.id != "") {
        await BookingService.findSession(
          this.selectedAppointment.therapistId,
          this.clientId
        ).then(response => {
          if (response.data == false) {
            BookingService.createSession(
              this.selectedAppointment.therapistId,
              this.selectedAppointment.therapistName,
              this.clientId,
              store.getters["auth/name"]
            ).then(response => {
              this.sessionId = response.data._id;
              BookingService.bookAppointment(
                this.selectedAppointment.id,
                this.clientId,
                this.selectedTherapy,
                store.getters["auth/name"],
                this.sessionId
              );
            });
          } else {
            this.sessionId = response.data._id;
            BookingService.bookAppointment(
              this.selectedAppointment.id,
              this.clientId,
              this.selectedTherapy,
              store.getters["auth/name"],
              this.sessionId
            );
          }
        });
        this.$parent.submit();
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>

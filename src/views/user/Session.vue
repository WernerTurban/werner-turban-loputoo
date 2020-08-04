<template>
  <v-container style="margin-top: 100px">
    <v-tabs
      background-color="deep-purple accent-4"
      dark
      show-arrows
      v-model="tab"
      v-if="appointments.length > 0"
    >
      <v-tab href="#tab-1">
        <template v-if="therapist">Patsiendi info</template>
        <template v-else>Terapeudi info</template>
      </v-tab>
      <v-tab href="#tab-2">
        Vestlus
      </v-tab>
      <v-tab-item value="tab-1">
        <v-card flat class="ma-3 mt-10">
          <v-card-title class="display-2"
            ><template v-if="therapist">{{ session.clientName }}</template
            ><template v-else>{{
              session.therapistName
            }}</template></v-card-title
          >
          <v-card-title
            ><template v-if="therapist">Patsiendi broneeringud</template>
            <template v-else>Minu broneeringud</template>
          </v-card-title>
        </v-card>
        <v-card
          flat
          class="ma-3 mt-5"
          @click="changeTab(true, appointment)"
          v-for="appointment in appointments"
          :key="appointment.name"
          :class="`appointment ${appointment.status}`"
        >
          <v-row class="ml-2">
            <v-col cols="3">
              <div class="caption grey--text">Broneeringu aeg</div>
              <div>{{ appointment.date }} {{ appointment.time }}</div>
            </v-col>
            <v-col cols="3" v-if="therapist">
              <div class="caption grey--text">Patisent</div>
              <div>{{ appointment.clientName }}</div>
            </v-col>
            <v-col cols="3" v-else>
              <div class="caption grey--text">Terapeut</div>
              <div>Dr {{ appointment.therapistName }}</div>
            </v-col>
            <v-col cols="3">
              <div class="caption grey--text">Teraapia</div>
              <div>{{ appointment.therapy }}</div>
            </v-col>
            <v-col cols="3">
              <div class="caption grey--text">Staatus</div>
              <div v-if="appointment.status == 'booked'">
                Esitatud, kinnitamata
              </div>
              <div v-if="appointment.status == 'confirmed'">
                Esitatud, kinnitatud
              </div>
              <div v-if="appointment.status == 'denied'">
                Esitatud, tühistatud
              </div>
              <div v-if="appointment.status == 'activated'">
                Esitatud, aktiivne
              </div>
              <div v-if="appointment.status == 'done'">
                Esitatud, Lõpetatud
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-tab-item>
      <v-tab-item value="tab-2">
        <Chat v-if="renderComponent" v-bind:appointment="currentAppointment" />
      </v-tab-item>
    </v-tabs>
    <h1 v-else>
      Kinnitatud broneeringud puuduvad!
    </h1>
  </v-container>
</template>

<script>
import BookingService from "../../service/BookingService";
import moment from "moment";
import Chat from "../../components/Chat";

export default {
  components: { Chat },
  data() {
    return {
      tab: "tab-1",
      disabled: true,
      sessionId: "",
      appointments: [],
      session: {},
      therapist: this.$store.state.therapist,
      currentAppointment: {},
      renderComponent: true
    };
  },
  created() {
    this.sessionId = this.$route.params.id;
    BookingService.getSession(this.sessionId).then(response => {
      this.session = response.data;
      this.getAppointments();
    });
  },
  methods: {
    changeTab(disabledChat, appointment) {
      this.currentAppointment = appointment;
      disabledChat ? (this.disabled = false) : (this.disabled = true);
      this.forceRerender();
      clearInterval(true);
      this.tab = "tab-2";
    },
    getAppointments() {
      BookingService.getSessionAppointments(
        this.session.therapistId,
        this.session.clientId
      ).then(response => {
        this.appointments = response.data;
        this.modifyAppointments();
        if (this.appointments.length > 0) {
          this.currentAppointment = this.appointments[0];
        }
      });
    },
    modifyAppointments() {
      this.appointments.forEach(appointment => {
        appointment.date = moment(appointment.date).format("DD-MM-YYYY");
      });
    },
    forceRerender() {
      this.renderComponent = false;
      this.$nextTick(() => {
        this.renderComponent = true;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.therapistText,
.clientText {
  display: inline-block;
  padding: 10px;
  border-bottom-right-radius: 25px;
  border-bottom-left-radius: 25px;
}
.therapistText {
  background-color: #5e35b1;
  border-top-right-radius: 25px;
  color: white;
}
.clientText {
  background-color: whitesmoke;
  border-top-left-radius: 25px;
  color: black;
}

.appointment.booked {
  border-left: 4px solid yellow;
}
.appointment.confirmed,
.appointment.activated,
.appointment.done {
  border-left: 4px solid green;
}
.appointment.denied {
  border-left: 4px solid red;
}
.container {
  @media only screen and (min-width: 1920px) {
    width: 1200px;
  }
}
</style>

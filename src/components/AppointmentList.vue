<template>
  <div>
    <template>
      <v-container>
        <v-tabs background-color="deep-purple accent-4" dark show-arrows>
          <v-tab>
            Aktiivsed broneeringud
          </v-tab>
          <v-tab>
            Broneeringute ajalugu
          </v-tab>
          <v-tab-item>
            <v-card
              flat
              class="ma-3 mt-10"
              v-for="appointment in activeAppointments"
              :key="appointment.name"
              :class="`appointment ${appointment.status}`"
            >
              <v-row class="ml-2">
                <v-col
                  cols="6"
                  sm="3"
                  @click="openSession(appointment.sessionId)"
                  id="openSession"
                >
                  <div
                    class="caption grey--text"
                    @click="openSession(appointment.sessionId)"
                    id="openSession"
                  >
                    Broneeringu aeg
                  </div>
                  <div
                    @click="openSession(appointment.sessionId)"
                    id="openSession"
                  >
                    {{ appointment.time }} {{ appointment.date }}
                  </div>
                </v-col>
                <v-col
                  cols="6"
                  sm="2"
                  v-if="client == true"
                  @click="openSession(appointment.sessionId)"
                  id="openSession"
                >
                  <div
                    class="caption grey--text"
                    @click="openSession(appointment.sessionId)"
                    id="openSession"
                  >
                    Terapeut
                  </div>
                  <div
                    @click="openSession(appointment.sessionId)"
                    id="openSession"
                  >
                    Dr {{ appointment.therapistName }}
                  </div>
                </v-col>
                <v-col
                  cols="6"
                  sm="2"
                  v-else
                  @click="openSession(appointment.sessionId)"
                  id="openSession"
                >
                  <div
                    class="caption grey--text"
                    @click="openSession(appointment.sessionId)"
                    id="openSession"
                  >
                    Patsient
                  </div>
                  <div
                    @click="openSession(appointment.sessionId)"
                    id="openSession"
                  >
                    {{ appointment.clientName }}
                  </div>
                </v-col>
                <v-col
                  cols="6"
                  sm="3"
                  @click="openSession(appointment.sessionId)"
                  id="openSession"
                >
                  <div
                    class="caption grey--text"
                    @click="openSession(appointment.sessionId)"
                    id="openSession"
                  >
                    Teraapia
                  </div>
                  <div>{{ appointment.therapy }}</div>
                </v-col>
                <v-col
                  cols="5"
                  sm="3"
                  @click="openSession(appointment.sessionId)"
                  id="openSession"
                >
                  <div
                    class="caption grey--text"
                    @click="openSession(appointment.sessionId)"
                    id="openSession"
                  >
                    Staatus
                  </div>
                  <div
                    v-if="appointment.status == 'booked'"
                    @click="openSession(appointment.sessionId)"
                    id="openSession"
                  >
                    Esitatud, kinnitamata
                  </div>
                  <div
                    v-if="appointment.status == 'confirmed'"
                    @click="openSession(appointment.sessionId)"
                    id="openSession"
                  >
                    Esitatud, kinnitatud
                  </div>
                  <div
                    v-if="appointment.status == 'denied'"
                    @click="openSession(appointment.sessionId)"
                    id="openSession"
                  >
                    Esitatud, tühistatud
                  </div>
                  <div
                    v-if="appointment.status == 'activated'"
                    @click="openSession(appointment.sessionId)"
                    id="openSession"
                  >
                    Esitatud, aktiivne
                  </div>
                </v-col>
                <v-col cols="1">
                  <div v-if="appointment.status != 'denied'">
                    <v-row>
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            icon
                            v-on="on"
                            @click="selectAppointment(appointment)"
                          >
                            <v-icon>info</v-icon>
                          </v-btn>
                        </template>
                        <span>Broneeringu detailid</span>
                      </v-tooltip>
                    </v-row>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card
              flat
              class="ma-3 mt-10"
              v-for="appointment in pastAppointments"
              :key="appointment.name"
              :class="`appointment ${appointment.status}`"
            >
              <v-row class="ml-2">
                <v-col
                  cols="6"
                  sm="3"
                  @click="openSession(appointment.sessionId)"
                  id="openSession"
                >
                  <div
                    class="caption grey--text"
                    @click="openSession(appointment.sessionId)"
                    id="openSession"
                  >
                    Broneeringu aeg
                  </div>
                  <div
                    @click="openSession(appointment.sessionId)"
                    id="openSession"
                  >
                    {{ appointment.time }} {{ appointment.date }}
                  </div>
                </v-col>
                <v-col
                  cols="6"
                  sm="2"
                  v-if="client == true"
                  @click="openSession(appointment.sessionId)"
                  id="openSession"
                >
                  <div
                    class="caption grey--text"
                    @click="openSession(appointment.sessionId)"
                    id="openSession"
                  >
                    Terapeut
                  </div>
                  <div
                    @click="openSession(appointment.sessionId)"
                    id="openSession"
                  >
                    Dr {{ appointment.therapistName }}
                  </div>
                </v-col>
                <v-col
                  cols="6"
                  sm="2"
                  v-else
                  @click="openSession(appointment.sessionId)"
                  id="openSession"
                >
                  <div
                    class="caption grey--text"
                    @click="openSession(appointment.sessionId)"
                    id="openSession"
                  >
                    Patsient
                  </div>
                  <div
                    @click="openSession(appointment.sessionId)"
                    id="openSession"
                  >
                    {{ appointment.clientName }}
                  </div>
                </v-col>
                <v-col
                  cols="6"
                  sm="3"
                  @click="openSession(appointment.sessionId)"
                  id="openSession"
                >
                  <div
                    class="caption grey--text"
                    @click="openSession(appointment.sessionId)"
                    id="openSession"
                  >
                    Teraapia
                  </div>
                  <div>{{ appointment.therapy }}</div>
                </v-col>
                <v-col
                  cols="5"
                  sm="3"
                  @click="openSession(appointment.sessionId)"
                  id="openSession"
                >
                  <div
                    class="caption grey--text"
                    @click="openSession(appointment.sessionId)"
                    id="openSession"
                  >
                    Staatus
                  </div>
                  <div
                    @click="openSession(appointment.sessionId)"
                    id="openSession"
                  >
                    Esitatud, lõpetatud
                  </div>
                </v-col>
                <v-col cols="1">
                  <div v-if="appointment.status != 'denied'">
                    <v-row>
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            icon
                            v-on="on"
                            @click="selectAppointment(appointment)"
                          >
                            <v-icon>info</v-icon>
                          </v-btn>
                        </template>
                        <span>Broneeringu detailid</span>
                      </v-tooltip>
                    </v-row>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-container>
    </template>
    <v-dialog v-model="pickAppointment" max-width="500">
      <v-card>
        <v-card-title>Broneeringu info</v-card-title>
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
          <v-col cols="6" v-if="client == true">
            <div class="caption grey--text">Terapeut</div>
            <div>{{ selectedAppointment.therapistName }}</div>
          </v-col>
          <v-col cols="6" v-else>
            <div class="caption grey--text">Patsient</div>
            <div>{{ selectedAppointment.clientName }}</div>
          </v-col>
          <v-col>
            <div class="caption grey--text">Teraapia</div>
            <div>{{ selectedAppointment.therapy }}</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-row justify="end">
              <div
                v-if="client == false && selectedAppointment.status == 'booked'"
              >
                <v-btn
                  style="margin-top: 5px; margin-right: 30px"
                  right
                  small
                  rounded
                  color="purple darken-1"
                  depressed
                  dark
                  @click="confirmAppointment()"
                  >Kinnita</v-btn
                >
              </div>
              <div>
                <v-btn
                  style="margin-top: 5px; margin-right: 30px"
                  right
                  small
                  rounded
                  color="purple darken-1"
                  depressed
                  dark
                  @click="cancelAppointment()"
                  >Tühista</v-btn
                >
              </div>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import BookingService from "../service/BookingService";
import moment from "moment";
import store from "../store";

export default {
  data() {
    return {
      activeAppointments: [],
      pastAppointments: [],
      client: false,
      selectedAppointment: {},
      pickAppointment: false
    };
  },
  created() {
    this.getAppointments();
  },
  methods: {
    modifyAppointments(active) {
      if (this.activeAppointments.length > 0 && active == true) {
        this.activeAppointments.forEach(appointment => {
          appointment.date = moment(appointment.date).format("DD-MM-YYYY");
        });
      }
      if (this.pastAppointments.length > 0 && active == false) {
        this.pastAppointments.forEach(appointment => {
          appointment.date = moment(appointment.date).format("DD-MM-YYYY");
        });
      }
    },
    openSession(sessionId) {
      this.$router.push({ name: "Session info", params: { id: sessionId } });
    },
    selectAppointment(appointment) {
      this.selectedAppointment = appointment;
      this.pickAppointment = true;
    },
    async cancelAppointment() {
      if (store.getters["auth/userType"] == "client") {
        await BookingService.cancelAppointment(this.selectedAppointment._id);
        this.getAppointments();
        this.pickAppointment = false;
      } else {
        await BookingService.denyAppointment(this.selectedAppointment._id).then(
          () => {
            this.getAppointments();
            this.pickAppointment = false;
          }
        );
        await BookingService.getAppointment(this.selectedAppointment._id).then(
          response => {
            BookingService.createAvailableAppointment(
              this.selectedAppointment.time,
              this.selectedAppointment.formattedDate,
              this.selectedAppointment.therapistId,
              store.getters["auth/name"],
              response.data.date,
              this.selectedAppointment.hourId
            );
          }
        );
      }
    },
    async confirmAppointment() {
      await BookingService.confirmAppointment(this.selectedAppointment._id);
      this.getAppointments();
      this.pickAppointment = false;
    },
    getAppointments() {
      if (store.getters["auth/userType"] == "client") {
        this.client = true;
        BookingService.getClientAppointments(
          store.getters["auth/id"],
          true
        ).then(response => {
          console.log(response.data);
          this.activeAppointments = response.data;
          this.modifyAppointments(true);
        });
        BookingService.getClientAppointments(
          store.getters["auth/id"],
          false
        ).then(response => {
          this.pastAppointments = response.data;
          this.modifyAppointments(false);
        });
      } else {
        BookingService.getAllTherapistAppointments(
          store.getters["auth/therapistId"],
          true
        ).then(response => {
          this.activeAppointments = response.data;
          this.modifyAppointments(true);
        });
        BookingService.getAllTherapistAppointments(
          store.getters["auth/therapistId"],
          false
        ).then(response => {
          this.pastAppointments = response.data;
          this.modifyAppointments(false);
        });
      }
    },
    checkActiveAppointments() {
      this.activeAppointments.forEach(appointment => {
        if (appointment.status == "activated") {
          let appointmentTime = moment(appointment.date, "DD-MM-YYYY");
          let currentTime = moment();
          let appointmentEndTime = moment(appointmentTime).add(60, "minutes");
          if (currentTime > appointmentEndTime) {
            BookingService.endAppointment(appointment._id);
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.appointment.booked {
  border-left: 4px solid yellow;
}
.appointment.confirmed,
.appointment.done,
.appointment.activated {
  border-left: 4px solid green;
}
.appointment.denied {
  border-left: 4px solid red;
}
.container {
  @media only screen and (min-width: 1920px) {
    width: 1200px;
  }
  #openSession {
    cursor: pointer;
  }
}
</style>

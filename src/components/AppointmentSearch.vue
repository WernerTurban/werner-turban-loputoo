<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <v-select
          v-model="selectedTherapist"
          :items="this.therapists"
          label="Vali terapeudi nimi"
          clearable
          item-text="name"
          item-value="_id"
        >
        </v-select>
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          v-model="therapyType"
          :items="this.$store.state.therapyTypes"
          label="Vali teraapia liik"
          clearable
        >
        </v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6">
        <v-row>
          <v-col cols="6">
            <v-menu
              ref="menu1"
              v-model="menu1"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="startDateFormatted"
                  label="Vali alguskuupäev"
                  prepend-icon="event"
                  v-on="on"
                >
                </v-text-field>
              </template>
              <v-date-picker
                v-model="startDate"
                no-title
                @input="menu1 = false"
                color="primary"
                locale="et"
                :min="parseDate(today)"
                :max="monthDates()"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="6">
            <v-menu
              ref="menu2"
              v-model="menu2"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="endDateFormatted"
                  label="Vali lõppkuupäev"
                  prepend-icon="event"
                  v-on="on"
                >
                </v-text-field>
              </template>
              <v-date-picker
                v-model="endDate"
                no-title
                @input="menu2 = false"
                color="primary"
                locale="et"
                :min="parseDate(startDateFormatted)"
                :max="monthDates()"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="6">
        <div style="float: right;">
          <v-btn
            right
            large
            color="deep-purple accent-4"
            depressed
            dark
            @click="submitSearch()"
            >Otsi</v-btn
          >
        </div>
      </v-col>
    </v-row>
    <template v-if="showAppointments">
      <p class="headline mt-5" v-if="appointments.length > 0">
        Otsingule vastavaid aegu leitud: {{ appointments.length }}
      </p>
      <p class="headline mt-5" v-else>
        Otsingule ei vastanud ühtegi aega!
      </p>
      <v-card
        flat
        class="mt-10"
        style="border-left: 4px solid #4A148C"
        v-for="appointment in appointments"
        :key="appointment.id"
      >
        <v-row class="ml-2">
          <v-col cols="6" sm="3">
            <div class="caption grey--text">Kuupäev</div>
            <div>{{ appointment.date }}</div>
          </v-col>
          <v-col cols="6" sm="3">
            <div class="caption grey--text">Kellaaeg</div>
            <div>{{ appointment.time }}</div>
          </v-col>
          <v-col cols="6" sm="3">
            <div class="caption grey--text">Terapeut</div>
            <div>{{ appointment.therapistName }}</div>
          </v-col>
          <v-col cols="6" sm="3" align-md="end">
            <div>
              <v-btn
                style="margin-top: 5px"
                right
                small
                rounded
                color="purple darken-1"
                depressed
                dark
                @click="selectAppointment(appointment)"
                >Vali aeg</v-btn
              >
            </div>
          </v-col>
        </v-row>
      </v-card>
    </template>
    <v-dialog max-width="500" v-model="showAppointmentInfo">
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
                v-model="selectedTherapy"
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
    </v-dialog>
  </div>
</template>

<script>
import BookingService from "../service/BookingService";
import moment from "moment";
import store from "../store";

export default {
  data: vm => ({
    startDate: new Date().toISOString().substr(0, 10),
    endDate: new Date().toISOString().substr(0, 10),
    startDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    endDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    today: vm.formatDate(new Date().toISOString().substr(0, 10)),
    menu1: false,
    menu2: false,
    therapists: [],
    clientId: "",
    therapyAppointments: [],
    therapyType: "",
    showStartTime: false,
    startTime: "12:00",
    showEndTime: false,
    endTime: "12:30",
    pickAppointment: false,
    checkAppointments: false,
    selectedTherapist: "",
    selectedStartDate: "",
    selectedEndDate: "",
    showAppointments: false,
    appointments: [],
    selectedAppointment: {
      id: "",
      formattedDate: "",
      time: "",
      therapistId: "",
      therapistName: "",
      therapies: ""
    },
    selectedTherapy: "",
    showAppointmentInfo: false
  }),
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    }
  },
  created() {
    BookingService.getTherapists().then(res => {
      this.therapists = res.data;
    });
    this.clientId = store.getters["auth/id"];
  },
  watch: {
    startDate() {
      this.startDateFormatted = this.formatDate(this.startDate, true);
    },
    endDate() {
      this.endDateFormatted = this.formatDate(this.endDate, false);
    }
  },
  methods: {
    formatDate(date, start) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      if (start) {
        this.endDateFormatted = `${day}/${month}/${year}`;
      }
      return `${day}/${month}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;
      const [day, month, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    monthDates() {
      const weekStart = moment().startOf("week");
      const lastDate = moment(weekStart)
        .add(26, "days")
        .format("YYYY-MM-DD");
      return lastDate;
    },
    async submitSearch() {
      let startDate = new Date(this.startDate);
      let endDate = new Date(this.endDate);
      let therapy = "";

      if (this.selectedTherapist == undefined) {
        this.selectedTherapist = "";
      }
      if (this.therapyType != undefined && this.therapyType != "") {
        await BookingService.getTherapistsByTherapy(this.therapyType).then(
          response => {
            therapy = response.data;
          }
        );
      }
      await BookingService.searchAppointments(
        this.selectedTherapist,
        therapy,
        startDate,
        endDate
      ).then(response => {
        console.log(response.data);
        this.appointments = response.data;
        this.showAppointments = true;
        this.modifyAppointments();
      });
    },
    async modifyAppointments() {
      this.appointments.forEach(appointment => {
        appointment.date = moment(appointment.date).format("DD-MM-YYYY");
      });
    },
    async selectAppointment(appointment) {
      this.selectedAppointment.id = appointment._id;
      this.selectedAppointment.formattedDate = appointment.formattedDate;
      this.selectedAppointment.time = appointment.time;
      this.selectedAppointment.therapistId = appointment.therapistId;
      this.selectedAppointment.therapistName = appointment.therapistName;
      await BookingService.getTherapistTherapies(appointment.therapistId).then(
        response => {
          let therapy = [];
          therapy.push(response.data);
          this.selectedAppointment.therapies = therapy[0];
          this.selectedTherapy = this.selectedAppointment.therapies[0];
          this.showAppointmentInfo = true;
        }
      );
    },
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
        this.showAppointmentInfo = false;
        this.submitSearch();
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>

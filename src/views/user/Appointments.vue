<template>
  <div>
    <v-container>
      <v-tabs
        background-color="deep-purple accent-4"
        centered
        grow
        dark
        show-arrows
      >
        <v-tab>
          Vabad terapeudid
        </v-tab>
        <v-tab>
          Otsi vabu terapeute
        </v-tab>
        <v-tab-item>
          <v-row class="mt-3">
            <v-col
              cols="12"
              md="6"
              lg="4"
              v-for="therapist in therapists"
              :key="therapist.id"
            >
              <v-card>
                <v-row class="pt-4" justify="space-around">
                  <router-link
                    :to="{
                      name: 'Therapist info',
                      params: { id: therapist.id }
                    }"
                  >
                    <v-avatar size="200" v-if="therapist.gender == 'female'">
                      <img src="/female-doctor.png" alt="female doctor" />
                    </v-avatar>
                    <v-avatar size="200" v-else>
                      <img src="/male-doctor.png" alt="male doctor" />
                    </v-avatar>
                  </router-link>
                </v-row>
                <router-link
                  :to="{
                    name: 'Therapist info',
                    params: { id: therapist.id }
                  }"
                >
                  <v-card-title>Dr {{ therapist.name }}</v-card-title>
                </router-link>
                <v-card-text style="margin-top: -10px">
                  <div class="grey--text">
                    <template v-for="therapy in therapist.therapy">
                      {{ therapy }}
                    </template>
                  </div>
                  <div class="grey--text">{{ therapist.jobTitle }}</div>
                </v-card-text>
                <v-divider class="mx-4"></v-divider>
                <v-row>
                  <v-col cols="12" style="margin-left: 25px">
                    <p class="subtitle-2">
                      Esimesed vabad ajad
                    </p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" style="margin-top: -35px">
                    <v-chip-group
                      active-class="deep-purple accent-4 white--text"
                    >
                      <v-chip
                        @click="selectAppointment(appointment)"
                        style="margin: 10px"
                        label
                        v-for="appointment in therapist.appointments[0]"
                        :key="appointment.id"
                        >{{ appointment.formattedDate }}
                        {{ appointment.time }}</v-chip
                      >
                    </v-chip-group>
                  </v-col>
                </v-row>
                <v-card-actions>
                  <v-btn
                    color="deep-purple lighten-2"
                    text
                    @click="showAppointment()"
                  >
                    Broneeri
                  </v-btn>
                  <router-link
                    :to="{
                      name: 'Therapist appointments',
                      params: { id: therapist.id, name: therapist.name }
                    }"
                  >
                    <v-btn color="deep-purple lighten-2" text>
                      Kõik vabad ajad
                    </v-btn>
                  </router-link>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item>
          <AppointmentSearch />
        </v-tab-item>
      </v-tabs>
    </v-container>
    <v-dialog max-width="500" v-model="showAppointmentInfo">
      <v-card>
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
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import BookingService from "../../service/BookingService";
import AppointmentSearch from "../../components/AppointmentSearch";
import store from "../../store";

export default {
  components: { AppointmentSearch },
  data() {
    return {
      therapists: [],
      therapyAppointments: [],
      therapyType: "",
      clientId: "",
      therapist: {
        id: "",
        name: "",
        therapy: "",
        jobTitle: "",
        gender: "",
        appointments: []
      },
      appointments: [],
      selectedAppointment: {
        id: "",
        formattedDate: "",
        time: "",
        therapistId: "",
        therapistName: "",
        therapies: []
      },
      selectedTherapy: "",
      showAppointmentInfo: false
    };
  },

  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    }
  },
  async created() {
    await this.getTherapists();
    this.clientId = store.getters["auth/id"];
  },

  methods: {
    async getTherapists() {
      let allTherapists = [];
      await BookingService.getTherapists().then(res => {
        allTherapists = res.data;
      });
      for (let therapist of allTherapists) {
        await this.getFirstAvailableAppointments(therapist._id);
        if (this.checkAppointments == true) {
          let therapists = this.therapists;
          this.createTherapist(therapist);
          const addTherapist = Object.assign({}, this.therapist);
          therapists.push(addTherapist);
          this.therapists = therapists;
          this.checkAppointments = false;
          this.resetTherapist();
        }
      }
    },
    async getFirstAvailableAppointments(therapist) {
      await BookingService.getTherapistsAppointments(therapist, true).then(
        response => {
          let appointments = response.data;

          if (appointments.length > 0) {
            let therapyAppointments = this.therapist.appointments;
            therapyAppointments.push(appointments);
            this.therapist.appointments = therapyAppointments;
            this.checkAppointments = true;
          }
        }
      );
    },
    createTherapist(therapist) {
      this.therapist.id = therapist._id;
      this.therapist.name = therapist.name;
      this.therapist.therapy = therapist.therapy;
      this.therapist.jobTitle = therapist.jobTitle;
      this.therapist.gender = therapist.gender;
    },
    resetTherapist() {
      this.therapist.id = "";
      this.therapist.name = "";
      this.therapist.therapy = "";
      this.therapist.jobTitle = "";
      this.therapist.gender = "";
      this.therapist.appointments = [];
    },
    async selectAppointment(appointment) {
      if (this.selectedAppointment.id == "") {
        this.selectedAppointment.id = appointment._id;
        this.selectedAppointment.formattedDate = appointment.formattedDate;
        this.selectedAppointment.time = appointment.time;
        this.selectedAppointment.therapistId = appointment.therapistId;
        this.selectedAppointment.therapistName = appointment.therapistName;
        await BookingService.getTherapistTherapies(
          appointment.therapistId
        ).then(response => {
          let therapy = [];
          therapy.push(response.data);
          this.selectedAppointment.therapies = therapy[0];
          this.selectedTherapy = this.selectedAppointment.therapies[0];
        });
      } else {
        this.resetAppointment();
      }
    },
    showAppointment() {
      if (this.selectedAppointment.id != "") {
        this.showAppointmentInfo = true;
      }
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
        this.therapists = [];
        this.therapyAppointments = [];
        this.getTherapists();
      }
    },
    resetAppointment() {
      this.selectedAppointment.id = "";
      this.selectedAppointment.formattedDate = "";
      this.selectedAppointment.time = "";
      this.selectedAppointment.therapistId = "";
      this.selectedAppointment.therapistName = "";
      this.selectedAppointment.therapies = [];
    }
  }
};
</script>

<style lang="scss" scoped>
.v-application ul {
  padding-left: 0;
}
.container {
  @media only screen and (min-width: 1920px) {
    width: 1200px;
  }
}
</style>

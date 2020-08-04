<template>
  <v-container style="margin-top: 100px">
    <v-row justify="center">
      <v-col cols="12" sm="6" v-if="appointments.length > 0">
        <v-row>
          <v-col cols="12">
            <p class="display-1">Esimesed vabad ajad</p>
          </v-col>
        </v-row>
        <v-list-item-group
          color="primary"
          v-for="appointment in appointments"
          :key="appointment.id"
        >
          <v-list-item @click="selectAppointment(appointment)">
            <v-list-item-icon>
              <v-icon>mdi-clock</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              {{ appointment.time }}
            </v-list-item-content>
            <v-list-item-content>
              {{ appointment.formattedDate }}
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
        </v-list-item-group>
        <v-btn
          color="deep-purple lighten-2"
          class="mt-3"
          text
          @click="showAppointment()"
          >Broneeri aeg</v-btn
        >
      </v-col>
      <v-col cols="12" sm="6">
        <v-card>
          <v-row class="pt-4" justify="space-around">
            <v-avatar size="200" v-if="therapist.gender == 'female'">
              <img src="/female-doctor.png" alt="female doctor" />
            </v-avatar>
            <v-avatar size="200" v-else>
              <img src="/male-doctor.png" alt="male doctor" />
            </v-avatar>
          </v-row>
          <v-card-title>Dr {{ therapist.name }}</v-card-title>
          <v-card-text style="margin-top: -10px">
            <div class="grey--text">{{ therapist.jobTitle }}</div>
            <v-row> </v-row>
          </v-card-text>
          <v-card-text>
            {{ therapist.description }}
          </v-card-text>
          <v-divider></v-divider>
          <v-btn text @click.stop="message = true">
            <v-icon right class="mr-2">message</v-icon>
            Saada sõnum
          </v-btn>
          <v-dialog v-model="message" max-width="600">
            <v-card>
              <v-container>
                <v-form ref="form">
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="messageHeader"
                        label="Sõnumi pealkiri"
                        required
                        :rules="headerRules"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="messageContent"
                        label="Sõnumi sisu"
                        required
                        auto-grow
                        rows="2"
                        :rules="inputRules"
                      >
                      </v-textarea>
                    </v-col>
                    <v-btn class="mr-4 ml-4 primary" @click="submitMessage()"
                      >Saada</v-btn
                    >
                    <v-btn @click="clear">Tühjenda väljad</v-btn>
                  </v-row>
                </v-form>
              </v-container>
            </v-card>
          </v-dialog>
        </v-card>
      </v-col>
    </v-row>
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
  </v-container>
</template>

<script>
import BookingService from "../../service/BookingService";
import store from "../../store";

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dialog: false,
      message: false,
      clientId: "",
      messageHeader: "",
      messageContent: "",
      inputRules: [
        v => (v && v.length >= 0) || "Väli peab saatmiseks olema täidetud!"
      ],
      headerRules: [
        v => (v && v.length >= 0) || "Väli peab saatmiseks olema täidetud!",
        v => v.length <= 25 || "Pealkiri peab olema vähem kui 25 tähemärki!"
      ],
      appointments: [],
      therapist: {},
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
    };
  },
  created() {
    this.getAppointments();
    BookingService.getTherapistById(this.$route.params.id).then(response => {
      this.therapist = response.data;
    });
    this.clientId = store.getters["auth/id"];
  },
  methods: {
    async submitMessage() {
      if (this.$refs.form.validate()) {
        await BookingService.createMessageSession(
          this.therapist._id,
          store.getters["auth/id"],
          this.messageHeader
        ).then(response => {
          BookingService.sendMessage(
            store.getters["auth/id"],
            this.therapist._id,
            response.data._id,
            store.getters["auth/name"],
            this.therapist.name,
            this.messageHeader,
            this.messageContent
          );
          this.$store.state.messageSent = true;
          this.message = false;
        });
      }
    },
    clear() {
      this.messageHeader = "";
      this.messageContent = "";
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
      this.appointments = [];
      this.getAppointments();
      this.showAppointmentInfo = false;
    },
    getAppointments() {
      BookingService.getTherapistsAppointments(
        this.$route.params.id,
        true
      ).then(response => {
        this.appointments = response.data;
      });
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
.container {
  @media only screen and (min-width: 1920px) {
    width: 1200px;
  }
}
</style>

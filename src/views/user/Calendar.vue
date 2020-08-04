<template>
  <v-container>
    <v-tabs
      background-color="deep-purple accent-4"
      centered
      grow
      dark
      show-arrows
    >
      <v-tab>
        Päev
      </v-tab>
      <v-tab>
        Nädal
      </v-tab>
      <v-tab-item>
        <v-row style="margin-bottom: 100px">
          <v-col>
            <v-sheet height="400">
              <v-toolbar flat color="white">
                <v-row no-gutters>
                  <v-col cols="8">
                    <v-btn
                      @click="setToday()"
                      outlined
                      class="mr-4"
                      color="grey darken-2"
                    >
                      Täna
                    </v-btn>
                    <v-btn fab text small color="grey darken-2">
                      <v-icon
                        small
                        @click="changeDay(false)"
                        v-if="dayCounter != 0 || weekCounter != 0"
                        >mdi-chevron-left</v-icon
                      >
                    </v-btn>
                    <v-btn fab text small color="grey darken-2">
                      <v-icon
                        small
                        @click="changeDay(true)"
                        v-if="dayCounter != 6 || weekCounter < 3"
                        >mdi-chevron-right</v-icon
                      >
                    </v-btn>
                  </v-col>
                  <v-col cols="4"
                    ><p class="header">
                      {{ currentDay.date }}
                    </p>
                  </v-col>
                </v-row>
              </v-toolbar>
              <v-container class="calendarContainer">
                <v-row
                  v-for="schedule in currentDay.schedule"
                  :key="schedule.name"
                  style="border-bottom: 2px solid #ECECEC; height: 50px;"
                  no-gutters
                >
                  <v-col cols="2" align="center"
                    ><p style="margin-top: 8px">{{ schedule.hour }}</p>
                  </v-col>
                  <v-col cols="10" style="border-left: 2px solid #ececec;">
                    <v-btn
                      text
                      style="height: 100%; width: 100%"
                      :tile="tile"
                      @click.stop="selectTime(schedule.hour, currentDay.id)"
                      :class="`currentTime ${schedule.status}`"
                      :disabled="
                        currentDay.id < todayId ||
                          schedule.status === 'activated' ||
                          schedule.status === 'done'
                      "
                    >
                      <v-row
                        no-gutters
                        v-if="
                          schedule.status === 'booked' ||
                            schedule.status === 'available'
                        "
                      >
                        <v-col cols="6">
                          <div class="caption grey--text">
                            Broneeringu aeg
                          </div>
                          <div>
                            <p class="appointmentInfo">
                              {{ schedule.hour }} - {{ schedule.nextHour }}
                            </p>
                          </div>
                        </v-col>
                        <v-col cols="6">
                          <div class="caption grey--text">Teraapia</div>
                          <div>
                            <p class="appointmentInfo">
                              {{ schedule.therapy }}
                            </p>
                          </div>
                        </v-col>
                      </v-row>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-sheet>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item>
        <v-row no gutters>
          <v-col cols="6" align="end">
            <v-btn
              fab
              text
              color="grey darken-2"
              @click="changeWeek(false)"
              v-if="weekCounter > 0"
            >
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="6" align="start">
            <v-btn
              fab
              text
              color="grey darken-2"
              @click="changeWeek(true)"
              v-if="weekCounter < 3"
            >
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row no-gutters style="border: 2px solid #ECECEC; border-bottom: 0">
          <v-col class="rowElement" align="center"
            ><v-row no gutters class="d-none d-sm-flex"
              ><v-col cols="12" align="center">Kellaaeg</v-col></v-row
            >
            <v-row no-gutters
              ><v-col
                cols="12"
                align="center"
                style="border-bottom: 2px solid #ECECEC"
              >
                <v-btn fab depressed color="white" id="dateButton"></v-btn>
              </v-col>
            </v-row>
            <v-row
              v-for="currentTime in time"
              :key="currentTime.name"
              class="calendarRow"
              no-gutters
            >
              <v-col cols="12" justify="center" fill-height align="center"
                ><p class="hour">{{ currentTime.hour }}</p>
              </v-col>
            </v-row>
          </v-col>
          <v-col
            class="rowElement"
            v-for="weekDay in activeWeek"
            :key="weekDay.id"
          >
            <v-row class="d-none d-sm-flex"
              ><v-col cols="12" align="center">{{ weekDay.day }}</v-col></v-row
            >
            <v-row no-gutters
              ><v-col
                cols="12"
                align="center"
                style="border-bottom: 2px solid #ECECEC"
              >
                <v-btn fab depressed color="white" id="dateButton"
                  >{{ weekDay.monthDate }}
                </v-btn>
              </v-col>
            </v-row>
            <v-row
              v-for="currentTime in weekDay.schedule"
              :key="currentTime.name"
              class="calendarRow"
              no-gutters
            >
              <v-col cols="12" style="border-left: 2px solid #ececec;">
                <v-btn
                  style="height: 100%"
                  text
                  id="dateButton"
                  :tile="tile"
                  @click.stop="selectTime(currentTime.hour, weekDay.id)"
                  :class="`currentTime ${currentTime.status}`"
                  :disabled="
                    currentTime.status === 'activated' ||
                      currentTime.status == 'done'
                  "
                >
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs>
    <v-dialog v-model="pickAppointment" max-width="600">
      <v-card
        v-if="
          selectedTime.status != 'booked' && selectedTime.status != 'confirmed'
        "
      >
        <v-card-title>Valitud aeg </v-card-title>
        <v-card-text>
          <p class="headline">
            {{ selectedTime.hour }} - {{ selectedTime.nextHour }}
          </p>
        </v-card-text>
        <v-row>
          <v-col cols="12" align="end" v-if="selectedTime.status == 'none'">
            <v-btn class="mr-4 ml-4 primary" @click="submit('available')"
              >Kinnita vastuvõtuks</v-btn
            >
          </v-col>
          <v-col cols="12" align="end" v-else>
            <v-btn class="mr-4 ml-4 primary" @click="submit('none')"
              >Eemalda vastuvõtt</v-btn
            >
          </v-col>
        </v-row>
      </v-card>
      <v-card v-else>
        <v-card-title>Kas soovite broneeringu tühistada?</v-card-title>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="4">
              <div class="caption grey--text">Broneeringu aeg</div>
              <div>{{ selectedTime.hour }} - {{ selectedTime.nextHour }}</div>
            </v-col>
            <v-col cols="4">
              <div class="caption grey--text">Patsient</div>
              <div>
                {{ selectedTime.userName }}
              </div>
            </v-col>
            <v-col cols="4">
              <div class="caption grey--text">Teraapia</div>
              <div>
                {{ selectedTime.therapy }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-col cols="12" align="end">
          <v-btn class="mr-4 ml-4 primary" @click="submit('booked')"
            >Kinnita</v-btn
          >
          <v-btn
            class="mr-4 ml-4 primary"
            style="margin-left: 200px"
            @click="pickAppointment = false"
            >Tagasi</v-btn
          >
        </v-col>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showProfile" max-width="600">
      <v-card>
        <v-card-title>Profiil vajab täitmist</v-card-title>
        <v-card-text>
          <p class="headline">
            Vabade teraapiaaegade lisamiseks on esmalt vaja profiil täita!
          </p>
        </v-card-text>
        <v-row align="end">
          <v-col cols="12" align="end">
            <router-link
              :to="{
                name: 'Therapist Profile'
              }"
            >
              <v-btn class="mr-4 ml-4 primary">Mine profiilile</v-btn>
            </router-link>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import moment from "moment";
import BookingService from "../../service/BookingService";
import store from "../../store";
export default {
  data() {
    return {
      therapist: "",
      currentDay: [],
      time: [],
      calendarDates: [],
      activeWeek: [],
      weekCounter: 0,
      dayCounter: 0,
      todayId: 0,
      tile: true,
      showStartTime: false,
      startTime: "12:00",
      showEndTime: false,
      endTime: "12:30",
      pickAppointment: false,
      showProfile: false,
      profileUncomplete: false,
      appointments: [],
      selectedTime: {
        hour: "",
        status: "",
        userName: "",
        chatType: "",
        therapy: "",
        nextHour: ""
      },
      selectedDay: ""
    };
  },
  methods: {
    async checkBookings() {
      await this.refreshAppointments();
      if (this.appointments.length == 0) {
        await this.checkTherapistInfo();
      }
      this.activeWeek.forEach(date => {
        this.updateTime();
        date.schedule = this.time;
        let dateSessions = [];
        this.appointments.forEach(appointment => {
          if (appointment.formattedDate == date.date) {
            dateSessions.push(appointment);
          }
        });
        dateSessions.forEach(session => {
          date.schedule.forEach(timeElement => {
            if (session.time == timeElement.hour) {
              if (session.status == "booked" || session.status == "confirmed") {
                timeElement.appointmentId = session._id;
                timeElement.userName = session.clientName;
                timeElement.therapy = session.therapy;
              }
              timeElement.status = session.status;
            }
          });
        });
      });
    },
    changeWeek(nextWeek) {
      if (nextWeek == true && this.weekCounter < 3) {
        this.weekCounter = this.weekCounter + 1;
        this.activeWeek = this.calendarDates[this.weekCounter];
        this.checkBookings();
      } else if (nextWeek != true && this.weekCounter > 0) {
        this.weekCounter = this.weekCounter - 1;
        this.activeWeek = this.calendarDates[this.weekCounter];
        this.checkBookings();
      }
      this.currentDay = this.activeWeek[0];
      this.dayCounter = 0;
    },
    changeDay(nextDay) {
      if (nextDay) {
        this.dayCounter = this.dayCounter + 1;
        if (this.dayCounter > 6) {
          this.changeWeek(true);
          this.dayCounter = 0;
        }
      } else {
        this.dayCounter = this.dayCounter - 1;
        if (this.dayCounter < 0) {
          this.changeWeek(false);
          this.dayCounter = 6;
        }
      }
      this.currentDay = this.activeWeek[this.dayCounter];
      this.checkBookings();
    },
    async submit(status) {
      let selectedDay = this.activeWeek.find(o => o.id === this.selectedDay);
      let date = moment().add(selectedDay.id - this.todayId, "days");
      if (status == "available") {
        this.selectedTime.status = "available";
        BookingService.createAvailableAppointment(
          this.selectedTime.hour,
          selectedDay.date,
          this.therapist,
          store.getters["auth/name"],
          date,
          this.selectedTime.id
        ).catch(e => {
          console.log("error: ", e);
        });
      } else if (status == "none") {
        console.log("jõudis");
        BookingService.deleteAppointment(
          this.selectedTime.hour,
          selectedDay.date,
          this.therapist
        );
        this.selectedTime.status = "none";
      } else {
        BookingService.denyAppointment(this.selectedTime.appointmentId).then(
          response => {
            console.log(response.data);
          }
        );
        BookingService.createAvailableAppointment(
          this.selectedTime.hour,
          selectedDay.date,
          this.therapist,
          store.getters["auth/name"],
          date,
          this.selectedTime.id
        );
        this.selectedTime.status = "available";
      }
      this.selectedTime.appointmentId = "";
      this.selectedTime.userName = "";
      this.selectedTime.chatType = "";
      this.selectedTime.therapy = "";
      for (let day in this.activeWeek) {
        if (this.activeWeek[day].id == selectedDay.id) {
          this.activeWeek[day].schedule.forEach(session => {
            if (this.selectedTime.hour == session.hour) {
              this.calendarDates[this.weekCounter][day].schedule[
                session.id
              ].status = this.selectedTime.status;
            }
          });
        }
      }
      this.pickAppointment = false;
    },
    async refreshAppointments() {
      await BookingService.getTherapistsAppointments(
        this.therapist,
        false
      ).then(response => {
        this.$store.dispatch("setAppointments", response.data);
      });
      this.appointments = this.$store.state.appointments;
    },
    getAppointments() {
      BookingService.getAppointments()
        .then(response => {
          this.$store.dispatch("setAppointments", response.data);
        })
        .catch(e => {
          console.log("error: ", e);
        });
    },
    updateTime() {
      let resetTime = [
        {
          id: 0,
          appointmentId: "",
          hour: "09:00",
          status: "none",
          userName: "",
          chatType: "",
          therapy: "",
          nextHour: "10:00"
        },
        {
          id: 1,
          appointmentId: "",
          hour: "10:00",
          status: "none",
          userName: "",
          chatType: "",
          therapy: "",
          nextHour: "11:00"
        },

        {
          id: 2,
          appointmentId: "",
          hour: "11:00",
          status: "none",
          userName: "",
          chatType: "",
          therapy: "",
          nextHour: "12:00"
        },

        {
          id: 3,
          appointmentId: "",
          hour: "12:00",
          status: "none",
          userName: "",
          chatType: "",
          therapy: "",
          nextHour: "13:00"
        },

        {
          id: 4,
          appointmentId: "",
          hour: "13:00",
          status: "none",
          userName: "",
          chatType: "",
          therapy: "",
          nextHour: "14:00"
        },

        {
          id: 5,
          appointmentId: "",
          hour: "14:00",
          status: "none",
          userName: "",
          chatType: "",
          therapy: "",
          nextHour: "15:00"
        },
        {
          id: 6,
          appointmentId: "",
          hour: "15:00",
          status: "none",
          userName: "",
          chatType: "",
          therapy: "",
          nextHour: "16:00"
        },

        {
          id: 7,
          appointmentId: "",
          hour: "16:00",
          status: "none",
          userName: "",
          chatType: "",
          therapy: "",
          nextHour: "17:00"
        },

        {
          id: 8,
          appointmentId: "",
          hour: "17:00",
          status: "none",
          userName: "",
          chatType: "",
          therapy: "",
          nextHour: "18:00"
        }
      ];
      this.time = resetTime;
    },
    selectTime(hour, dayId) {
      if (!this.profileUncomplete) {
        this.pickAppointment = true;
      } else {
        this.showProfile = true;
      }
      let selectedDay = this.activeWeek.find(o => o.id === dayId);
      selectedDay.schedule.forEach(session => {
        if (hour == session.hour) {
          this.selectedTime = session;
        }
      });
      this.selectedDay = dayId;
    },
    setToday() {
      let today = moment();
      this.activeWeek = this.calendarDates[0];
      this.weekCounter = 0;
      this.activeWeek.forEach(day => {
        if (day.date == today.format("dddd, Do MMM")) {
          this.currentDay = day;
          this.dayCounter = day.id;
          this.todayId = day.id;
        }
      });
      this.checkBookings();
    },
    async checkTherapistInfo() {
      await BookingService.getTherapist(store.getters["auth/id"]).then(
        response => {
          if (
            response.data.jobTitle == null ||
            response.data.description == null ||
            response.data.therapy == undefined ||
            response.data.therapy.length == 0
          ) {
            this.profileUncomplete = true;
          }
        }
      );
    }
  },
  created() {
    this.therapist = store.getters["auth/therapistId"];
    BookingService.getTherapistsAppointments(this.therapist, false)
      .then(response => {
        console.log(response.data);
        this.$store.dispatch("setAppointments", response.data);
        moment.locale("et");

        const weekStart = moment().startOf("week");

        const days = [];
        for (let i = 0; i <= 27; i++) {
          days.push(moment(weekStart).add(i, "days"));
        }
        const daysOfMonth = [];
        const firstWeek = [];
        const secondWeek = [];
        const thirdWeek = [];
        const forthWeek = [];

        let weekDay = [];
        let id = -1;
        days.forEach(day => {
          id = id + 1;
          weekDay.id = id;
          weekDay.date = day.format("dddd, Do MMM");
          weekDay.schedule = [];
          weekDay.monthDate = day.format("D");
          weekDay.day = day.format("dddd");
          if (id < 7) {
            firstWeek.push(weekDay);
          } else if (id > 6 && id < 14) {
            secondWeek.push(weekDay);
          } else if (id > 13 && id < 21) {
            thirdWeek.push(weekDay);
          } else {
            forthWeek.push(weekDay);
          }
          weekDay = [];
        });
        daysOfMonth.push(firstWeek);
        daysOfMonth.push(secondWeek);
        daysOfMonth.push(thirdWeek);
        daysOfMonth.push(forthWeek);

        this.$store.dispatch("setDaysOfMonth", daysOfMonth);
        this.calendarDates = Object.assign({}, this.$store.state.daysOfMonth);
        this.activeWeek = this.calendarDates[0];
        this.time = this.$store.state.time;
        this.setToday();
      })
      .catch(e => {
        console.log("error: ", e);
      });
  }
};
</script>

<style lang="scss" scoped>
.currentTime.available {
  background-color: #b5f0a8 !important;
}
.currentTime.booked,
.currentTime.confirmed,
.currentTime.done {
  background-color: #e1bee7 !important;
}
.currentTime.none {
  background-color: #fcfdff !important;
}

@media (min-width: 400px) {
  .rowElement,
  .rowElement,
  .rowElement {
    width: 12.5;
    *width: 12.5;
  }
}

@media (min-width: 992px) {
  .rowElement,
  .rowElement,
  .rowElement {
    width: 12.5;
    *width: 12.5;
  }
}

@media (min-width: 1200px) {
  .rowElement,
  .rowElement,
  .rowElement {
    width: 12.5;
    *width: 12.5;
  }
}
</style>

<style lang="scss" scoped>
.container {
  @media only screen and (min-width: 1920px) {
    width: 1200px;
  }
}
.header {
  @media screen and (min-width: 961px) {
    font-size: 24px;
  }
  @media only screen and (max-width: 960px) {
    font-size: 16px;
  }
}
.calendarContainer {
  border-top: 2px solid #ececec;
  border-right: 2px solid #ececec;
  border-left: 2px solid #ececec;
  padding: 0px;
}
.appointmentInfo {
  @media only screen and (max-width: 600px) {
    font-size: 10px;
  }
}
#dateButton {
  height: 95%;
  width: 100%;
  min-width: 0px;
}
.calendarRow {
  border-bottom: 2px solid #ececec;
  height: 50px;
  @media only screen and (max-width: 600px) {
    height: 30px;
  }
}
.hour {
  font-size: 18px;
  margin-top: 10px;
  @media only screen and (max-width: 600px) {
    font-size: 14px;
    margin-top: 5px;
  }
}
</style>

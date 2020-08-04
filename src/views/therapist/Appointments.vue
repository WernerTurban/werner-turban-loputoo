<template>
  <v-container>
    <h1>{{ therapist.name }}</h1>
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
                        schedule.status === 'none' ||
                          schedule.status === 'activated' ||
                          schedule.status === 'done'
                      "
                    >
                      <v-row
                        no-gutters
                        v-if="
                          schedule.status === 'booked' ||
                            schedule.status === 'confirmed'
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
                    currentTime.status === 'none' ||
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
    <v-dialog v-model="pickAppointment" max-width="500">
      <v-card>
        <v-card-title v-if="selectedAppointment.status == 'available'"
          >Kinnita teraapia</v-card-title
        >
        <v-card-title v-else>Tühista teraapia</v-card-title>
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
          <v-col cols="6" v-if="selectedAppointment.status == 'available'">
            <v-select
              v-model="selectedTherapy"
              :items="selectedAppointment.therapies"
              label="Vali teraapia"
            ></v-select>
          </v-col>
          <v-col v-else>
            <div class="caption grey--text">Teraapia</div>
            <div>{{ selectedAppointment.therapy }}</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" align="end">
            <div v-if="selectedAppointment.status == 'available'">
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
            <div v-else>
              <v-btn
                style="margin-top: 5px; margin-right: 30px"
                right
                small
                rounded
                color="purple darken-1"
                depressed
                dark
                @click="cancelAppointment(selectedAppointment.id)"
                >Tühista</v-btn
              >
            </div>
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
      therapist: {
        id: "",
        name: ""
      },

      client: "",
      currentDay: [],
      time: [],
      calendarDates: [],
      activeWeek: [],
      weekCounter: 0,
      dayCounter: 0,
      tile: true,
      showStartTime: false,
      startTime: "12:00",
      showEndTime: false,
      endTime: "12:30",
      pickAppointment: false,
      appointments: [],
      selectedTime: {
        hour: "",
        status: "",
        userName: "",
        chatType: "",
        therapy: "",
        nextHour: ""
      },
      selectedAppointment: {
        id: "",
        formattedDate: "",
        time: "",
        therapistName: "",
        therapies: [],
        status: "",
        therapy: ""
      },
      selectedDay: "",
      selectedTherapy: "",
      sessionId: ""
    };
  },
  methods: {
    checkBookings() {
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
                timeElement.userName = session.clientId;
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
    async selectTime(hour, dayId) {
      this.pickAppointment = true;
      let selectedDay = this.activeWeek.find(o => o.id === dayId);
      selectedDay.schedule.forEach(session => {
        if (hour == session.hour) {
          this.selectedTime = session;
        }
      });
      this.selectedDay = dayId;
      this.selectAppointment(selectedDay.date, hour);
    },
    setToday() {
      let today = moment();
      this.activeWeek = this.calendarDates[0];
      this.weekCounter = 0;
      this.activeWeek.forEach(day => {
        if (day.date == today.format("dddd, Do MMM")) {
          this.currentDay = day;
          this.dayCounter = day.id;
        }
      });
      this.checkBookings();
    },
    selectAppointment(date, hour) {
      this.appointments.forEach(appointment => {
        if (appointment.formattedDate == date && appointment.time == hour) {
          this.selectedAppointment.id = appointment._id;
          this.selectedAppointment.formattedDate = appointment.formattedDate;
          this.selectedAppointment.time = appointment.time;
          this.selectedAppointment.therapistName = appointment.therapistName;
          this.selectedAppointment.status = appointment.status;
          this.selectedAppointment.therapy = appointment.therapy;
          BookingService.getTherapistTherapies(appointment.therapistId).then(
            response => {
              let therapy = [];
              therapy.push(response.data);
              this.selectedAppointment.therapies = therapy[0];
              this.selectedTherapy = this.selectedAppointment.therapies[0];
            }
          );
        }
      });
    },
    async submitAppointment() {
      await BookingService.findSession(this.therapist.id, this.client).then(
        response => {
          if (response.data == false) {
            BookingService.createSession(
              this.therapist.id,
              this.therapist.name,
              this.client,
              store.getters["auth/name"]
            ).then(response => {
              this.sessionId = response.data._id;
              BookingService.bookAppointment(
                this.selectedAppointment.id,
                this.client,
                this.selectedTherapy,
                store.getters["auth/name"],
                this.sessionId
              );
            });
          } else {
            this.sessionId = response.data._id;
            BookingService.bookAppointment(
              this.selectedAppointment.id,
              this.client,
              this.selectedTherapy,
              store.getters["auth/name"],
              this.sessionId
            );
          }
        }
      );

      this.pickAppointment = false;

      let selectedDay = this.activeWeek.find(o => o.id === this.selectedDay);
      for (let day in this.activeWeek) {
        if (this.activeWeek[day].id == selectedDay.id) {
          this.activeWeek[day].schedule.forEach(session => {
            if (this.selectedTime.hour == session.hour) {
              this.calendarDates[this.weekCounter][day].schedule[
                session.id
              ].status = "booked";
              this.calendarDates[this.weekCounter][day].schedule[
                session.id
              ].userName = this.selectedAppointment.clientId;
              this.calendarDates[this.weekCounter][day].schedule[
                session.id
              ].therapy = this.selectedTherapy;
            }
          });
        }
      }
      this.refreshAppointments();
    },
    async cancelAppointment(appointmentId) {
      await BookingService.cancelAppointment(appointmentId);
      this.pickAppointment = false;
      let selectedDay = this.activeWeek.find(o => o.id === this.selectedDay);
      for (let day in this.activeWeek) {
        if (this.activeWeek[day].id == selectedDay.id) {
          this.activeWeek[day].schedule.forEach(session => {
            if (this.selectedTime.hour == session.hour) {
              this.calendarDates[this.weekCounter][day].schedule[
                session.id
              ].status = "available";
            }
          });
        }
      }
      this.refreshAppointments();
    },
    async refreshAppointments() {
      await BookingService.getSelectedTherapistAppointments(
        this.therapist.id,
        this.client
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
          hour: "09:00",
          status: "none",
          userName: "",
          chatType: "",
          therapy: "",
          nextHour: "10:00"
        },
        {
          id: 1,
          hour: "10:00",
          status: "none",
          userName: "",
          chatType: "",
          therapy: "",
          nextHour: "11:00"
        },

        {
          id: 2,
          hour: "11:00",
          status: "none",
          userName: "",
          chatType: "",
          therapy: "",
          nextHour: "12:00"
        },

        {
          id: 3,
          hour: "12:00",
          status: "none",
          userName: "",
          chatType: "",
          therapy: "",
          nextHour: "13:00"
        },

        {
          id: 4,
          hour: "13:00",
          status: "none",
          userName: "",
          chatType: "",
          therapy: "",
          nextHour: "14:00"
        },

        {
          id: 5,
          hour: "14:00",
          status: "none",
          userName: "",
          chatType: "",
          therapy: "",
          nextHour: "15:00"
        },
        {
          id: 6,
          hour: "15:00",
          status: "none",
          userName: "",
          chatType: "",
          therapy: "",
          nextHour: "16:00"
        },

        {
          id: 7,
          hour: "16:00",
          status: "none",
          userName: "",
          chatType: "",
          therapy: "",
          nextHour: "17:00"
        },

        {
          id: 8,
          hour: "17:00",
          status: "none",
          userName: "",
          chatType: "",
          therapy: "",
          nextHour: "18:00"
        }
      ];
      this.time = resetTime;
    }
  },
  created() {
    this.therapist.id = this.$route.params.id;
    this.client = store.getters["auth/id"];

    BookingService.getTherapistById(this.therapist.id).then(response => {
      this.therapist.name = response.data.name;
    });
    BookingService.getSelectedTherapistAppointments(
      this.therapist.id,
      this.client
    )
      .then(response => {
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

        this.appointments = this.$store.state.appointments;
        this.calendarDates = Object.assign({}, this.$store.state.daysOfMonth);
        this.activeWeek = this.calendarDates[0];
        this.time = this.$store.state.time;
        this.checkBookings();
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
.currentTime.booked {
  background-color: #e1bee7 !important;
}
.currentTime.confirmed {
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

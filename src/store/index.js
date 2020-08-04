import Vue from "vue";
import Vuex from "vuex";

import auth from "./auth";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loggedIn: false,
    therapist: false,
    showDrawer: false,
    messageSent: false,
    notUniqueUsername: false,
    timeBooked: false,
    showMail: false,
    AppointmentTime: "",
    daysOfMonth: [],
    appointments: [],
    mailSessions: [],
    therapyTypes: [
      "Individuaalteraapia",
      "Alternatiivteraapia",
      "Uneteraapia",
      "Lapsed ja noorukid"
    ],
    time: [
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
    ],
    resetTime: [
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
    ]
  },
  getters: {
    showDrawer(state) {
      state.showDrawer;
    },
    loggedIn(state) {
      state.loggedIn;
    },
    therapist(state) {
      state.therapist;
    },
    messageSent(state) {
      state.messageSent;
    },
    notUniqueUsername(state) {
      state.notUniqueUsername;
    },
    timeBooked(state) {
      state.timeBooked;
    },
    showMail(state) {
      state.showMail;
    },
    AppointmentTime(state) {
      state.AppointmentTime;
    },
    time(state) {
      state.time;
    },
    daysOfMonth(state) {
      state.daysOfMonth;
    },
    appointments(state) {
      state.appointments;
    },
    mailSessions(state) {
      state.mailSessions;
    }
  },
  mutations: {
    commitShowDrawer(state, showDrawer) {
      state.showDrawer = showDrawer;
    },
    commitLoggedIn(state, loggedIn) {
      state.loggedIn = loggedIn;
    },
    commitTherapist(state, therapist) {
      state.therapist = therapist;
    },
    commitMessageSent(state, messageSent) {
      state.messageSent = messageSent;
    },
    commitDaysOfMonth(state, daysOfMonth) {
      state.daysOfMonth = daysOfMonth;
    },
    commitAppointments(state, appointments) {
      state.appointments = appointments;
    },
    commitInterval(state, interval) {
      state.AppointmentTime = interval;
    },
    commitUniqueUsername(state, showError) {
      state.notUniqueUsername = showError;
    },
    commitTimeBooked(state, timeBooked) {
      state.timeBooked = timeBooked;
    },
    commitShowMail(state, showMail) {
      state.showMail = showMail;
    },
    commitTime(state, time) {
      state.time = time;
    },
    commitMailSessions(state, mailSessions) {
      state.mailSessions = mailSessions;
    }
  },
  actions: {
    setShowDrawer({ commit }, showDrawer) {
      commit("commitShowDrawer", showDrawer);
    },
    setLoggedIn({ commit }, loggedIn) {
      commit("commitLoggedIn", loggedIn);
    },
    setTherapist({ commit }, therapist) {
      commit("commitTherapist", therapist);
    },
    setMessageSent({ commit }, messageSent) {
      commit("commitMessageSent", messageSent);
    },
    setTimeBooked({ commit }, timeBooked) {
      commit("commitTimeBooked", timeBooked);
    },
    setDaysOfMonth({ commit }, daysOfMonth) {
      commit("commitDaysOfMonth", daysOfMonth);
    },
    setAppointments({ commit }, appointments) {
      commit("commitAppointments", appointments);
    },
    setInterval({ commit }, interval) {
      commit("commitInterval", interval);
    },
    setNotUniqueUsername({ commit }, showError) {
      commit("commitNotUniqueUsername", showError);
    },
    setShowMail({ commit }, showMail) {
      commit("commitShowMail", showMail);
    },
    setTime({ commit }, time) {
      commit("commitTime", time);
    },
    setMailSessions({ commit }, mailSessions) {
      commit("commitMailSessions", mailSessions);
    }
  },
  modules: {
    auth: auth
  }
});

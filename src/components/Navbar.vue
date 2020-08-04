<template>
  <nav>
    <v-snackbar
      v-model="$store.state.messageSent"
      :timeout="3000"
      top
      color="primary"
    >
      <span>Teie sõnum on edukalt saadetud!</span>
      <v-btn text color="white" @click="$store.state.messageSent = false"
        >Sulge</v-btn
      >
    </v-snackbar>

    <v-snackbar
      v-model="$store.state.timeBooked"
      :timeout="3000"
      top
      color="primary"
    >
      <span>Teie broneering on edukalt edasi saadetud!</span>
      <v-btn text color="white" @click="$store.state.timeBooked = false"
        >Sulge</v-btn
      >
    </v-snackbar>

    <v-app-bar color="grey lighten-5" flat app>
      <v-app-bar-nav-icon
        class="grey--text"
        @click="drawer = !drawer"
        v-if="this.$store.state.showDrawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="grey--text">
        <v-icon>scatter_plot</v-icon>
        <span class="font-weight-light">TALK</span>
        <span>OUT</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <router-link
        to="/login"
        style="text-decoration: none"
        v-if="!this.$store.state.loggedIn"
      >
        <v-btn text color="grey">
          <span>Logi sisse</span>
          <v-icon right>exit_to_app</v-icon>
        </v-btn>
      </router-link>
      <router-link
        to="/login"
        style="text-decoration: none"
        v-if="this.$store.state.loggedIn"
      >
        <v-btn text color="grey">
          <span>Logi välja</span>
          <v-icon right>exit_to_app</v-icon>
        </v-btn>
      </router-link>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
      class="primary"
      color="deep-purple accent-4"
    >
      <v-list v-if="!showMail && therapist == false">
        <v-list-item
          v-for="link in clientLinks"
          :key="link.text"
          router
          :to="link.route"
          v-on:click="navigation(link.text)"
        >
          <v-list-item-icon>
            <v-icon class="white--text">{{ link.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="white--text">{{
              link.text
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list v-if="!showMail && therapist == true">
        <v-list-item
          v-for="link in therapistLinks"
          :key="link.text"
          router
          :to="link.route"
          v-on:click="navigation(link.text)"
        >
          <v-list-item-icon>
            <v-icon class="white--text">{{ link.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="white--text">{{
              link.text
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list v-if="showMail">
        <v-list-item
          v-for="link in mailLinks"
          :key="link.id"
          router
          :to="link.route"
          v-on:click="navigation(link.text)"
        >
          <v-list-item-icon>
            <v-icon class="white--text">{{ link.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content v-on:click="navigation(link.text)">
            <v-list-item-title class="white--text">{{
              link.text
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import store from "../store";
export default {
  data() {
    return {
      drawer: false,
      temporary: true,
      showMail: false,
      therapist: false,
      therapistLinks: [
        {
          icon: "account_circle",
          text: "Minu profiil",
          route: "/user/profile"
        },
        {
          icon: "calendar_today",
          text: "Minu broneeringud",
          route: "/user/bookings"
        },
        {
          icon: "calendar_today",
          text: "Minu kalender",
          route: "/user/calendar"
        },
        {
          icon: "mail_outline",
          text: "Postkast",
          route: "/user/mailbox"
        }
      ],
      clientLinks: [
        {
          icon: "calendar_today",
          text: "Minu broneeringud",
          route: "/user/bookings"
        },
        {
          icon: "meeting_room",
          text: "Broneeri uus aeg",
          route: "/user/appointments"
        },
        {
          icon: "mail_outline",
          text: "Postkast",
          route: "/user/mailbox"
        }
      ],
      mailLinks: [
        {
          icon: "calendar_today",
          text: "Minu broneeringud",
          route: "/user/bookings"
        },
        {
          icon: "edit",
          text: "Kirjutatud sõnumid",
          route: "/user/mailbox/outbox"
        },
        {
          icon: "mail_outline",
          text: "Saabunud sõnumid",
          route: "/user/mailbox/inbox"
        }
      ]
    };
  },
  methods: {
    navigation(linkText) {
      if (linkText == "Postkast") {
        this.$store.state.showMail = true;
        this.showMail = true;
      }
      if (linkText == "Minu broneeringud") {
        this.$store.state.showMail = false;
        this.showMail = false;
      }
    }
  },
  created() {
    if (store.getters["auth/userType"] == "therapist") {
      this.therapist = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.v-list {
  margin-top: 50%;
}
</style>

<template>
  <div class="main">
    <v-container>
      <v-card>
        <v-row justify="center" style="padding-top: 50px">
          <v-card-title style="font-size: 40px">Logi Sisse</v-card-title>
        </v-row>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row no-gutters justify="center">
            <v-col cols="10" md="6">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters justify="center">
            <v-col cols="10" md="6">
              <v-text-field
                v-model="password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                name="input-10-2"
                label="Parool"
                class="input-group--focused"
                :rules="passwordRule"
                @click:append="showPassword = !showPassword"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters justify="center">
            <v-col cols="10" md="6">
              <div class="my-2" @click="submit">
                <v-btn color="primary" dark large style="width: 100%"
                  >Logi sisse</v-btn
                >
              </div>
            </v-col>
          </v-row>
          <v-row no-gutters justify="center" style="padding-bottom: 50px">
            <p
              class="text--secondary"
              style="font-size: 14px; margin-right: 5px"
            >
              Pole kasutajat?
            </p>
            <router-link to="/register">
              <p style="font-size: 14px; color: #7B1FA2">Registreeri</p>
            </router-link>
          </v-row>
        </v-form>
      </v-card>
    </v-container>
    <v-snackbar v-model="wrongCredentials" :timeout="3000" top color="#F44336">
      <span>Sisetatud e-mail või parool on vale!</span>
      <v-btn text color="white" @click="wrongCredentials = false">Sulge</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import BookingService from "../service/BookingService";
import { mapActions } from "vuex";
import axios from "axios";
import store from "../store";

export default {
  data() {
    return {
      email: "",
      password: "",
      valid: true,
      wrongCredentials: false,
      emailRules: [
        v => !!v || "E-mail on sisenemiseks kohustluslik!",
        v => /.+@.+\..+/.test(v) || "E-mail on vigane!"
      ],
      passwordRule: [v => !!v || "Parool ei saa olla tühi!"],
      showPassword: false,
      userDetails: {}
    };
  },
  created() {
    this.setToken(null);
    this.setUser(null);
    this.setId(null);
    localStorage.setItem("token", null);
    localStorage.setItem("email", null);
    localStorage.setItem("id", null);
  },
  methods: {
    ...mapActions({
      setToken: "auth/setToken",
      setUser: "auth/setUser",
      setName: "auth/setName",
      setUserType: "auth/setUserType",
      setId: "auth/setId",
      setTherapistId: "auth/setTherapistId"
    }),
    async submit() {
      if (this.$refs.form.validate()) {
        await BookingService.login(this.email, this.password)
          .then(response => {
            this.setToken(response.data.token);
            this.setUser(this.email);
            axios.defaults.headers.common[
              "authorization"
            ] = `Bearer ${this.$store.state.auth.token}`;
            localStorage.setItem("token", this.$store.state.auth.token);
            localStorage.setItem("email", this.$store.state.auth.user);
          })
          .catch(e => {
            if (e.response.data == "401") {
              this.wrongCredentials = true;
            }
          });
        await this.getUserData();
      }
    },
    async getUserData() {
      await BookingService.getUser(store.getters["auth/user"]).then(
        response => {
          this.userDetails = response.data;
          this.setId(this.userDetails._id);
          localStorage.setItem("id", store.getters["auth/id"]);
          this.setUserType(this.userDetails.userType);
          localStorage.setItem("userType", store.getters["auth/userType"]);
          localStorage.setItem("authId", store.getters["auth/id"]);
          this.setName(this.userDetails.name);
          localStorage.setItem("name", store.getters["auth/name"]);
          if (this.userDetails.userType == "therapist") {
            BookingService.getTherapist(this.userDetails._id).then(response => {
              this.setTherapistId(response.data._id);
              localStorage.setItem(
                "therapistId",
                store.getters["auth/therapistId"]
              );
              this.login();
            });
          } else {
            this.setTherapistId(null);
            localStorage.setItem("therapistId", null);
            this.login();
          }
        }
      );
    },
    async login() {
      await this.$router.push("User").catch(err => {
        throw new Error(`Problem handling something: ${err}.`);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  @media only screen and (min-width: 1240px) {
    max-width: 600px;
  }
}
.main {
  margin-top: 10%;
}
</style>

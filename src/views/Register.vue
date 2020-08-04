<template>
  <div class="main">
    <v-container>
      <v-card>
        <v-row justify="center" style="padding-top: 50px">
          <v-card-title style="font-size: 40px">Registreeri</v-card-title>
        </v-row>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row no-gutters justify="center">
            <v-radio-group v-model="user" row>
              <v-radio label="Klient" value="client"></v-radio>
              <v-radio label="Terapeut" value="therapist"></v-radio>
            </v-radio-group>
          </v-row>
          <v-row no-gutters justify="center" v-if="user == 'therapist'">
            <v-col cols="10" sm="6">
              <v-text-field
                v-model="name"
                :rules="usernameRule"
                label="Ees- ja perekonnanimi"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters justify="center" v-else>
            <v-col cols="10" sm="6">
              <v-text-field
                v-model="userName"
                :rules="nameRule"
                label="Kasutajanimi"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters justify="center">
            <v-col cols="10" sm="6">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters justify="center">
            <v-col cols="10" sm="6">
              <v-text-field
                v-model="password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                name="input-10-2"
                label="Parool"
                class="input-group--focused"
                :rules="passwordRules"
                @click:append="showPassword = !showPassword"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters justify="center">
            <v-col cols="10" sm="6">
              <div class="my-2" @click="submit">
                <v-btn color="primary" dark large style="width: 100%"
                  >Registreeri</v-btn
                >
              </div>
            </v-col>
          </v-row>
          <v-row no-gutters justify="center">
            <p
              class="text--secondary"
              style="font-size: 14px; margin-right: 5px; padding-bottom: 50px"
            >
              Omad kasutajat?
            </p>
            <router-link to="/login">
              <p style="font-size: 14px; color: #7B1FA2">Logi sisse</p>
            </router-link>
          </v-row>
        </v-form>
      </v-card>
    </v-container>
    <v-snackbar v-model="notUniqueUsername" :timeout="3000" top color="#F44336">
      <span>Sisetatud nimi on juba kasutusel!</span>
      <v-btn text color="white" @click="notUniqueUsername = false">Sulge</v-btn>
    </v-snackbar>
    <v-snackbar v-model="notUniqueEmail" :timeout="3000" top color="#F44336">
      <span>Sisetatud e-mail on juba kasutusel!</span>
      <v-btn text color="white" @click="notUniqueEmail = false">Sulge</v-btn>
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
      user: "client",
      email: "",
      password: "",
      valid: true,
      name: "",
      userName: "",
      notUniqueUsername: false,
      notUniqueEmail: false,
      emailRules: [
        v => !!v || "E-mail on registreerimiseks kohustluslik!",
        v => /.+@.+\..+/.test(v) || "E-mail on vigane!"
      ],
      passwordRules: [
        v => !!v || "Parool ei saa olla tühi!",
        v => v.length >= 6 || "Parool peab olema vähemalt 6 kirjamärki pikk"
      ],
      showPassword: false,
      nameRule: [v => !!v || "Nimi on registreerimiseks kohustuslik!"],
      usernameRule: [
        v => !!v || "Kasutajanimi on registreerimiseks kohustuslik!"
      ]
    };
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
        let name;
        if (this.userName != "") {
          name = this.userName;
        } else {
          name = this.name;
        }
        await BookingService.register(
          this.email,
          this.password,
          name,
          this.user
        )
          .then(response => {
            this.setToken(response.data.token);
            this.setUser(this.email);
            axios.defaults.headers.common[
              "authorization"
            ] = `Bearer ${this.$store.state.auth.token}`;
            localStorage.setItem("token", store.getters["auth/token"]);
            localStorage.setItem("email", store.getters["auth/user"]);
            if (this.user == "therapist") {
              BookingService.getUser(this.email).then(res => {
                this.createTherapist(res.data._id, res.data.name);
                this.getUserData();
              });
            } else {
              this.getUserData();
            }
          })
          .catch(e => {
            if (e.response.data == "402") {
              this.notUniqueUsername = true;
            } else if (e.response.data == "401") {
              this.notUniqueEmail = true;
            }
          });
      }
    },
    createTherapist(userId, userName) {
      BookingService.createTherapist(userId, userName);
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
              this.$router.push("User").catch(err => {
                throw new Error(`Problem handling something: ${err}.`);
              });
            });
          } else {
            this.setTherapistId(null);
            localStorage.setItem("therapistId", null);
            this.$router.push("User").catch(err => {
              throw new Error(`Problem handling something: ${err}.`);
            });
          }
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  @media only screen and (min-width: 1240px) {
    max-width: 800px;
  }
}
.main {
  margin-top: 10%;
}
</style>

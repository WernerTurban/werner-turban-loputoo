<template>
  <v-container style="margin-top: 100px">
    <v-card class="ma-3 mt-10">
      <v-row no-gutters class="data">
        <v-col cols="12" sm="7" order="last">
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <p class="display-1 text--primary">
                  {{ therapist.name }}
                </p>
              </v-col>
              <v-col cols="6" align="end">
                <v-icon @click="showEditDialog = true">
                  edit
                </v-icon>
              </v-col>
            </v-row>
            <p class="title text--disabled" v-if="therapist.jobTitle != null">
              {{ therapist.jobTitle }}
            </p>
            <p class="title text--disabled" v-else>
              Ametinimi: puudub!
            </p>
            <p
              class="subheading text--primary"
              v-if="
                therapist.therapy != undefined && therapist.therapy.length > 0
              "
            >
              <template v-for="therapy in therapist.therapy">
                {{ therapy }}
              </template>
            </p>
            <p class="subheading text--primary" v-else>
              Teraapia valdkonnad: puuduvad!
            </p>
            <p class="body-1" v-if="therapist.description != null">
              {{ therapist.description }}
            </p>
            <p class="body-1" v-else>
              Enda kirjeldus: puudub!
            </p>
          </v-card-text>
        </v-col>
        <v-col cols="12" sm="5" align="center" order="first">
          <v-avatar id="avatar" size="200" v-if="therapist.gender == 'female'">
            <img src="/female-doctor.png" alt="female doctor" />
          </v-avatar>
          <v-avatar id="avatar" size="200" v-else>
            <img src="/male-doctor.png" alt="male doctor" />
          </v-avatar>
        </v-col>
      </v-row>
    </v-card>
    <v-dialog v-model="showEditDialog" max-width="900">
      <v-card>
        <v-form ref="form">
          <v-card-title>Muuda andmeid</v-card-title>
          <v-row class="ml-2">
            <v-col cols="12">
              <v-radio-group v-model="selectedGender" row>
                <v-radio label="Mees" value="male"></v-radio>
                <v-radio label="Naine" value="female"></v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Amet"
                v-model="selectedJobTitle"
                :rules="inputRules"
                style="margin-top: 14px"
              >
              </v-text-field
            ></v-col>
            <v-col cols="6">
              <v-select
                v-model="selectedTherapies"
                :items="this.$store.state.therapyTypes"
                multiple
                chips
                label="Teraapiad"
                :rules="selectRule"
              >
              </v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="ml-2">
              <v-textarea
                label="Tutvustav kirjeldus"
                v-model="selectedDescription"
                auto-grow
                rows="3"
                :rules="inputRules"
              >
              </v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" align="end">
              <div>
                <v-btn
                  style="margin-top: 5px; margin-right: 30px"
                  right
                  rounded
                  color="purple darken-1"
                  depressed
                  dark
                  @click="saveChanges()"
                  >Salvesta</v-btn
                >
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import BookingService from "../../service/BookingService";
import store from "../../store";

export default {
  data() {
    return {
      therapist: {},
      showEditDialog: false,
      therapies: [],
      selectedTherapies: [],
      selectedGender: "",
      selectedJobTitle: "",
      selectedDescription: "",
      inputRules: [
        v => (v && v.length >= 0) || "Väli peab saatmiseks olema täidetud!"
      ],
      selectRule: [
        selectedTherapies =>
          selectedTherapies.length > 0 || "Teraapia peab olema valitud!"
      ]
    };
  },
  created() {
    this.getTherapist();
  },
  methods: {
    async saveChanges() {
      if (this.$refs.form.validate()) {
        if (
          this.selectedJobTitle != this.therapist.jobTitle ||
          this.selectedTherapies != this.therapist.therapy ||
          this.selectedDescription != this.therapist.description ||
          this.selectedGender != this.therapist.gender
        ) {
          await BookingService.updateTherapist(
            this.therapist._id,
            this.selectedTherapies,
            this.selectedJobTitle,
            this.selectedDescription,
            this.selectedGender
          );
          this.getTherapist();
          this.showEditDialog = false;
        } else {
          this.showEditDialog = false;
        }
      }
    },
    getTherapist() {
      BookingService.getTherapist(store.getters["auth/id"]).then(response => {
        this.therapist = response.data;
        this.selectedTherapies = this.therapist.therapy;
        this.selectedJobTitle = this.therapist.jobTitle;
        this.selectedDescription = this.therapist.description;
        this.selectedGender = this.therapist.gender;
      });
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
.data {
  padding-bottom: 30px;
}
#avatar {
  margin-top: 40px;
}
</style>

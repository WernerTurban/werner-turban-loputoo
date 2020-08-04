<template>
  <v-container style="margin-top: 150px; width: 60%">
    <v-tabs background-color="deep-purple accent-4" dark show-arrows>
      <v-tab> <v-icon class="mr-2">info</v-icon> Info </v-tab>
      <v-tab> <v-icon class="mr-2">people</v-icon>Spetsialistid</v-tab>
      <v-tab-item>
        <v-row class="mx-5 my-10">
          <v-col
            ><h1>{{ name }}</h1></v-col
          >
          <v-col style="text-align: right">
            <div class="caption grey--text">Vabu vastuvõtu aegu</div>
            <div>12</div>
          </v-col>
        </v-row>
        <v-row class="mx-5" style="margin-top:-50px">
          <v-col cols="6">
            <div class="caption grey--text">Kadaka 7a, Tallinn</div>
          </v-col>
          <v-col cols="6" style="text-align: right">
            <div class="caption grey--text">Esimene vaba vastuvõtu aeg</div>
            <div>12:00 16.05.20</div>
          </v-col>
        </v-row>
        <v-row class="mx-4 my-5">
          <v-col
            >Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Dignissimos voluptates laudantium quaerat pariatur, est aperiam sint
            quibusdam ad cupiditate adipisci obcaecati magni non maiores
            necessitatibus et ab minima voluptatibus quae!</v-col
          >
        </v-row>
      </v-tab-item>
      <v-tab-item>
        <v-row class="mt-3">
          <v-col cols="12" md="4">
            <v-card>
              <v-row class="pt-4" justify="space-around">
                <router-link
                  :to="{
                    name: 'Specialist info',
                    params: { id: 0 }
                  }"
                >
                  <v-avatar size="200">
                    <img src="/female-doctor.png" alt="female doctor" />
                  </v-avatar>
                </router-link>
              </v-row>
              <router-link
                :to="{
                  name: 'Specialist info',
                  params: { id: 0 }
                }"
              >
                <v-card-title>Dr Riina Ora</v-card-title>
              </router-link>
              <v-card-text style="margin-top: -10px">
                <div class="grey--text">Psühhiaater</div>
                <div class="grey--text">Tallinn</div>
                <v-row align="center" class="mx-0">
                  <v-rating
                    :value="4.1"
                    color="amber"
                    dense
                    half-increments
                    readonly
                    size="14"
                  ></v-rating>
                  <div class="grey--text ml-4">4.1 (43)</div>
                </v-row>
              </v-card-text>
              <v-divider class="mx-4"></v-divider>
              <v-row>
                <v-col cols="12">
                  <v-chip-group active-class="deep-purple accent-4 white--text">
                    <v-chip label>12:00 16.05.20</v-chip>
                    <v-chip label>17:00 16.05.20</v-chip>
                    <v-chip label>09:00 17.05.20</v-chip>
                  </v-chip-group>
                </v-col>
              </v-row>
              <v-card-actions>
                <v-btn color="deep-purple lighten-2" text>
                  Broneeri
                </v-btn>
                <v-btn color="deep-purple lighten-2" text>
                  Kõik vabad ajad
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-row class="pt-4" justify="space-around">
                <router-link
                  :to="{
                    name: 'Specialist info',
                    params: { id: 1 }
                  }"
                >
                  <v-avatar size="200">
                    <img src="/male-doctor.png" alt="female doctor" />
                  </v-avatar>
                </router-link>
              </v-row>
              <router-link
                :to="{
                  name: 'Specialist info',
                  params: { id: 1 }
                }"
              >
                <v-card-title>Dr Paul Saul</v-card-title>
              </router-link>
              <v-card-text style="margin-top: -10px">
                <div class="grey--text">Psühholoog</div>
                <div class="grey--text">Tallinn</div>
                <v-row align="center" class="mx-0">
                  <v-rating
                    :value="4.7"
                    color="amber"
                    dense
                    half-increments
                    readonly
                    size="14"
                  ></v-rating>
                  <div class="grey--text ml-4">4.7 (95)</div>
                </v-row>
              </v-card-text>
              <v-divider class="mx-4"></v-divider>
              <v-row>
                <v-col cols="12">
                  <v-chip-group active-class="deep-purple accent-4 white--text">
                    <v-chip label>15:00 16.05.20</v-chip>
                    <v-chip label>13:00 16.05.20</v-chip>
                    <v-chip label>09:00 17.05.20</v-chip>
                  </v-chip-group>
                </v-col>
              </v-row>
              <v-card-actions>
                <v-btn color="deep-purple lighten-2" text>
                  Broneeri
                </v-btn>
                <v-btn color="deep-purple lighten-2" text>
                  Kõik vabad ajad
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-row class="pt-4" justify="space-around">
                <router-link
                  :to="{
                    name: 'Specialist info',
                    params: { id: 2 }
                  }"
                >
                  <v-avatar size="200">
                    <img src="/male-doctor.png" alt="female doctor" />
                  </v-avatar>
                </router-link>
              </v-row>
              <router-link
                :to="{
                  name: 'Specialist info',
                  params: { id: 2 }
                }"
              >
                <v-card-title>Dr Kaarel Maaler</v-card-title>
              </router-link>
              <v-card-text style="margin-top: -10px">
                <div class="grey--text">Psühhiaater</div>
                <div class="grey--text">Tallinn</div>
                <v-row align="center" class="mx-0">
                  <v-rating
                    :value="3.2"
                    color="amber"
                    dense
                    half-increments
                    readonly
                    size="14"
                  ></v-rating>
                  <div class="grey--text ml-4">3.2 (7)</div>
                </v-row>
              </v-card-text>
              <v-divider class="mx-4"></v-divider>
              <v-row>
                <v-col cols="12">
                  <v-chip-group active-class="deep-purple accent-4 white--text">
                    <v-chip label>14:00 16.05.20</v-chip>
                    <v-chip label>15:00 16.05.20</v-chip>
                    <v-chip label>09:00 17.05.20</v-chip>
                  </v-chip-group>
                </v-col>
              </v-row>
              <v-card-actions>
                <v-btn color="deep-purple lighten-2" text>
                  Broneeri
                </v-btn>
                <v-btn color="deep-purple lighten-2" text>
                  Kõik vabad ajad
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      people: [
        {
          name: "Dr Riina Ora",
          profession: "Psühhiaater",
          location: "Tallinn",
          rating: "4.1"
        },
        {
          name: "Dr Paul Saul",
          profession: "Psühholoog",
          location: "Tallinn",
          rating: "4.7"
        },
        {
          name: "Dr Kaarel Maaler",
          profession: "Psühholoog",
          location: "Tallinn",
          rating: "3.5"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>

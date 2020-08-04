<template>
  <v-app>
    <Navbar />
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Navbar from "../components/Navbar";

export default {
  components: { Navbar },
  data() {
    return {
      userDetails: {}
    };
  },
  async created() {
    this.$store.dispatch("setLoggedIn", true);
    this.$store.dispatch("setShowDrawer", true);
  }
};
</script>
<style lang="scss" scoped>
.v-content {
  padding: 0 !important;
  margin-top: 5%;
}
</style>

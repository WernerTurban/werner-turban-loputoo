import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import Multiselect from "vue-multiselect";
import moment from "moment";

Vue.prototype.moment = moment;
moment.locale();
import axios from "axios";

Vue.component("multiselect", Multiselect);

if (localStorage.getItem("token") != null) {
  axios.defaults.headers.common[
    "authorization"
  ] = `Bearer ${localStorage.getItem("token")}`;
  store.dispatch("auth/setUser", localStorage.getItem("email"));
  store.dispatch("auth/setToken", localStorage.getItem("token"));
  store.dispatch("auth/setId", localStorage.getItem("id"));
  store.dispatch("auth/setName", localStorage.getItem("name"));
  store.dispatch("auth/setUserType", localStorage.getItem("userType"));
  store.dispatch("auth/setTherapistId", localStorage.getItem("therapistId"));
}

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  moment,
  vuetify,
  render: h => h(App)
}).$mount("#app");

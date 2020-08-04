import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue")
  },
  {
    path: "/register",
    name: "Register",
    component: () =>
      import(/* webpackChunkName: "register" */ "../views/Register.vue")
  },
  {
    path: "/user",
    redirect: "user/bookings",
    name: "User",
    component: () => import(/* webpackChunkName: "user" */ "../views/User.vue"),
    beforeEnter: (to, from, next) => {
      if (from.path == "/login" || from.path == "/register") {
        if (store.getters["auth/authenticated"]) {
          next();
        } else {
          next({
            name: "Login"
          });
        }
      } else {
        if (store.getters["auth/id"] == localStorage.getItem("authId")) {
          next();
        } else {
          next({
            name: "Login"
          });
        }
      }
    },
    children: [
      {
        path: "profile",
        name: "Therapist Profile",
        component: () =>
          import(
            /* webpackChunkName: "user/profile" */ "../views/user/Profile.vue"
          ),
        beforeEnter: (to, from, next) => {
          if (store.getters["auth/userType"] == "therapist") {
            next();
          } else {
            next({
              name: "Login"
            });
          }
        }
      },
      {
        path: "bookings",
        component: () =>
          import(
            /* webpackChunkName: "user/bookings" */ "../views/user/Bookings.vue"
          )
      },
      {
        path: "appointments",
        component: () =>
          import(
            /* webpackChunkName: "user/appointments" */ "../views/user/Appointments.vue"
          ),
        beforeEnter: (to, from, next) => {
          if (store.getters["auth/userType"] == "client") {
            next();
          } else {
            next({
              name: "Login"
            });
          }
        }
      },
      {
        path: "calendar",
        component: () =>
          import(
            /* webpackChunkName: "user/calendar" */ "../views/user/Calendar.vue"
          ),
        beforeEnter: (to, from, next) => {
          if (store.getters["auth/userType"] == "therapist") {
            next();
          } else {
            next({
              name: "Login"
            });
          }
        }
      },
      {
        path: "mailbox",
        redirect: "mailbox/inbox",
        component: () =>
          import(
            /* webpackChunkName: "user/mailbox" */ "../views/user/Mailbox.vue"
          ),
        children: [
          {
            path: "inbox",
            name: "Inbox",
            component: () =>
              import(
                /* webpackChunkName: "user/mailbox/inbox" */ "../views/user/mail/Inbox.vue"
              )
          },
          {
            path: "outbox",
            name: "Outbox",
            component: () =>
              import(
                /* webpackChunkName: "user/mailbox/outbox" */ "../views/user/mail/Outbox.vue"
              )
          },
          {
            path: "message/:id",
            name: "Message",
            component: () =>
              import(
                /* webpackChunkName: "user/mailbox/message/:id" */ "../views/user/Message.vue"
              ),
            props: true
          }
        ]
      },
      {
        path: "/session/:id",
        name: "Session info",
        component: () =>
          import(/* webpackChunkName: "session" */ "../views/user/Session.vue"),
        props: true,
        beforeRouteLeave(to, from, next) {
          window.clearInterval(this.$store.state.AppointmentTime);
          next();
        }
      }
    ]
  },
  {
    path: "/therapist",
    name: "Therapist",
    component: () =>
      import(/* webpackChunkName: "therapist" */ "../views/Therapist.vue"),
    beforeEnter: (to, from, next) => {
      if (from.path == "/login" || from.path == "/register") {
        if (store.getters["auth/authenticated"]) {
          next();
        } else {
          next({
            name: "Login"
          });
        }
      } else {
        if (store.getters["auth/id"] == localStorage.getItem("authId")) {
          next();
        } else {
          next({
            name: "Login"
          });
        }
      }
    },
    children: [
      {
        path: ":id",
        name: "Therapist info",
        component: () =>
          import(
            /* webpackChunkName: "therapist/:id" */ "../views/therapist/Profile.vue"
          ),
        beforeEnter: (to, from, next) => {
          if (store.getters["auth/userType"] == "client") {
            next();
          } else {
            next({
              name: "Login"
            });
          }
        },
        props: true
      },
      {
        path: ":id/appointments",
        name: "Therapist appointments",
        component: () =>
          import(
            /* webpackChunkName: "therapist/appointments/:id" */ "../views/therapist/Appointments.vue"
          ),
        beforeEnter: (to, from, next) => {
          if (store.getters["auth/userType"] == "client") {
            next();
          } else {
            next({
              name: "Login"
            });
          }
        },
        props: true
      }
    ],
    props: true
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

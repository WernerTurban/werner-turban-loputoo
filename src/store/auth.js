export default {
  namespaced: true,
  state: {
    token: null,
    user: null,
    name: null,
    userType: null,
    id: null,
    therapistId: null
  },
  getters: {
    authenticated(state) {
      return state.token && state.user;
    },
    token(state) {
      return state.token;
    },
    user(state) {
      return state.user;
    },
    id(state) {
      return state.id;
    },
    therapistId(state) {
      return state.therapistId;
    },
    userType(state) {
      return state.userType;
    },
    name(state) {
      return state.name;
    }
  },
  mutations: {
    commitToken(state, token) {
      state.token = token;
    },
    commitUser(state, user) {
      state.user = user;
    },
    commitName(state, name) {
      state.name = name;
    },
    commitUserType(state, userType) {
      state.userType = userType;
    },
    commitId(state, id) {
      state.id = id;
    },
    commitTherapistId(state, therapistId) {
      state.therapistId = therapistId;
    }
  },
  actions: {
    setToken({ commit }, token) {
      commit("commitToken", token);
    },
    setUser({ commit }, user) {
      commit("commitUser", user);
    },
    setName({ commit }, name) {
      commit("commitName", name);
    },
    setUserType({ commit }, userType) {
      commit("commitUserType", userType);
    },
    setId({ commit }, id) {
      commit("commitId", id);
    },
    setTherapistId({ commit }, therapistId) {
      commit("commitTherapistId", therapistId);
    }
  }
};

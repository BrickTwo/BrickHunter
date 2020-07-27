import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    wantedList: ""
  },
  mutations: {
    setWantedList(state, payload) {
      state.wantedList = payload
      localStorage.setItem("wantedList", JSON.stringify(payload))
    }
  },
  actions: {}
});
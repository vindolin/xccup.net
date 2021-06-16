import { jwtDecrypt, tokenAlive } from "@/shared/jwtHelper";
import axios from "axios";

let baseURL = process.env.VUE_APP_API_URL;

const state = () => ({
  authData: {
    token: "",
    refreshToken: "",
    tokenExp: "",
    userId: "",
    username: "",
  },
  loginStatus: "",
});

const getters = {
  getLoginStatus(state) {
    return state.loginStatus;
  },
  getAuthData(state) {
    return state.authData;
  },
  isTokenActive(state) {
    if (!state.authData.tokenExp) {
      return false;
    }
    return tokenAlive(state.authData.tokenExp);
  },
  getUserId(state) {
    return state.authData.userId;
  },
};

const actions = {
  async login({ commit }, payload) {
    const response = await axios
      .post(baseURL + "users/login", payload)
      .catch((err) => {
        console.log(err);
      });
    if (response && response.data) {
      commit("saveTokenData", response.data);
      commit("setLoginStatus", "success");
    } else {
      commit("setLoginStatus", "failed");
    }
  },
  async logout({ commit }) {
    const accessToken = localStorage.getItem("accessToken");
    await axios
      .post(baseURL + "users/logout", { token: accessToken })
      .catch((err) => {
        console.log(err);
      });
    commit("logoutUser");
    console.log("Logged out");
  },
};

const mutations = {
  saveTokenData(state, data) {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    const jwtDecodedValue = jwtDecrypt(data.accessToken);
    const newTokenData = {
      token: data.accessToken,
      refreshToken: data.refreshToken,
      tokenExp: jwtDecodedValue.exp,
      userId: jwtDecodedValue.id,
      username: jwtDecodedValue.username,
    };

    state.authData = newTokenData;
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + localStorage.getItem("accessToken");
  },
  setLoginStatus(state, value) {
    state.loginStatus = value;
  },
  logoutUser(state) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    state.loginStatus = "";
    state.authData = {
      token: "",
      refreshToken: "",
      tokenExp: "",
      userId: "",
      username: "",
    };
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

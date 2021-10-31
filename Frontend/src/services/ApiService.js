import axios from "axios";
import jwtInterceptor from "@/shared/jwtInterceptor";

let baseURL = process.env.VUE_APP_API_URL;

const apiClient = axios.create({
  baseURL: baseURL,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
// Note: jwtInterceptor is used when a route needs authorization

export default {
  getFlights() {
    return apiClient.get("flights");
  },
  getFlight(flightId) {
    return apiClient.get("flights/" + flightId);
  },
  uploadIgc(data) {
    return jwtInterceptor.post(baseURL + "flights/", data);
  },
  uploadFlightDetails(flightId, data) {
    return jwtInterceptor.put(baseURL + "flights/" + flightId, data);
  },
  uploadImages(data) {
    return jwtInterceptor.post(baseURL + "flights/photos/", data);
  },
  getAirbuddies(flightId) {
    return apiClient.get("airbuddies/" + flightId);
  },
  getInitialData() {
    return apiClient.get("home");
  },
  addComment(comment) {
    return jwtInterceptor.post(baseURL + "comments", comment);
  },
  deleteComment(commentId) {
    return jwtInterceptor.delete(baseURL + "comments/" + commentId);
  },
  editComment(comment) {
    return jwtInterceptor.put(baseURL + "comments/" + comment.id, comment);
  },
  getCommentsOfFlight(flightId) {
    return apiClient.get("comments/flight/" + flightId);
  },
  getUserDetails() {
    return jwtInterceptor.get(baseURL + "users/");
  },
  updateUserProfile(userProfile) {
    return jwtInterceptor.put(baseURL + "users/", userProfile);
  },
  getGliders() {
    return jwtInterceptor.get(baseURL + "users/gliders/get");
  },
  setDefaultGlider(gliderId) {
    return jwtInterceptor.put(baseURL + "users/gliders/default" + gliderId);
  },
  addGlider(glider) {
    return jwtInterceptor.post(baseURL + "users/gliders/add", glider);
  },
  removeGlider(gliderId) {
    return jwtInterceptor.delete(baseURL + "users/gliders/remove/" + gliderId);
  },

  // General
  getBrands() {
    return apiClient.get(baseURL + "general/brands");
  },
  getGliderClasses() {
    return apiClient.get(baseURL + "general/gliderClasses");
  },
};

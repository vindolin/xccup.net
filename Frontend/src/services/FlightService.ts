import axios from "axios";

// Local Dev server
// const baseURL = "http://localhost:4000";

const baseURL = "https://xccup.lurb.org/";

const apiClient = axios.create({
  baseURL: baseURL,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// For https://my-json-server.typicode.com
const apiClient2 = axios.create({
  baseURL:
    "https://my-json-server.typicode.com/KaiWissel/XCCup-2.0/blob/master",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default {
  getFlights() {
    return apiClient.get("/flights");
  },
  getFlight(flightId: string) {
    return apiClient.get("/flights/" + flightId);
  },
  getPilots() {
    return apiClient2.get("/pilots");
  },
  getDailyRanking() {
    return apiClient2.get("/tageswertung");
  },
  getClassRanking() {
    return apiClient2.get("/geraetewertung");
  },
  getComments() {
    return apiClient2.get("/comments");
  },
  getDescription() {
    return apiClient2.get("/flightDescription");
  },
  uploadFlight(data: any) {
    return apiClient.post("/flights/upload", data);
  },
  getAirbuddies(flightId: string) {
    return apiClient.get("/airbuddies/" + flightId);
  },
};

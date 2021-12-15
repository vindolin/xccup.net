import Constants from "@/common/Constants";

const trackColors = Constants.TRACK_COLORS;

// Process tracklog data for barogramm
export function processBaroData(_flight, buddyTracks) {
  const allBaroData = [];
  const baroData = [];
  const elevation = [];
  // WIP:
  if (!_flight) return null;
  let lastPosition = 0;
  const flight = {};
  flight.fixes = _flight.fixes.filter((fix) => {
    if (lastPosition + 10000 > fix.timestamp) return false;
    lastPosition = fix.timestamp;
    return true;
  });
  console.log(_flight.fixes.length / flight.fixes.length);
  for (var i = 0; i < flight.fixes.length; i++) {
    elevation.push({
      x: flight.fixes[i].timestamp,
      y: flight.fixes[i].elevation,
    });
    baroData.push({
      x: flight.fixes[i].timestamp,
      y: flight.fixes[i].gpsAltitude,
      speed: flight.fixes[i].speed,
      climb: flight.fixes[i].climb,
    });
  }
  let hideGND = false;
  // Check if any buddy track is activated. If so: Hide the GND dataset
  // Maybe this can be done smarter
  if (buddyTracks) {
    buddyTracks.forEach((element) => {
      if (element.isActive) {
        hideGND = true;
      }
    });
  }
  // Dataset for elevation graph (GND)
  allBaroData[0] = {
    label: "GND",
    hidden: hideGND,
    fill: true,
    data: elevation,
    backgroundColor: "SaddleBrown",
    borderColor: "SaddleBrown",
  };
  // Dataset for main flight
  allBaroData[1] = {
    label: "Pilot 1",
    data: baroData,
    backgroundColor: trackColors[0],
    borderColor: trackColors[0],
  };
  // Datasets for all aribuddies
  if (buddyTracks) {
    buddyTracks.forEach((element, index) => {
      const buddyBaro = [];
      // Check if this track is activated
      if (element.isActive) {
        for (var i = 0; i < element.fixes.length; i++) {
          buddyBaro.push({
            x: element.fixes[i].timestamp,
            y: element.fixes[i].gpsAltitude,
            speed: element.fixes[i].speed,
            climb: element.fixes[i].climb,
          });
        }
      }
      // Create the buddy dataset
      allBaroData[index + 2] = {
        label: element.buddyName,
        data: buddyBaro,
        backgroundColor: trackColors[index + 1],
        borderColor: trackColors[index + 1],
      };
    });
  }
  return allBaroData;
}

export interface Flight {
  _id: string;
  airbuddies: [Airbuddy];
  fixes: [GPSFix];
  date: string;
  pilot: string;
  pilotId: string;
  distance: number;
  taskType: string;
  points: number;
  takeoff: string;
  takeoffTime: string;
  landingTime: string;
  description: string;
  gliderType: string;
  rankingClass: RankingClass;
  flightDuration: string;
}

export interface Airbuddy {
  pilotId: string;
  pilotName: string;
}

export interface GPSFix {
  gpsAltitude: number;
  latitude: number;
  longitude: number;
  timestamp: number;
  elevation: number;
}
export type RankingClass =
  | "gsSport"
  | "gsIntermediate"
  | "gsPerformance"
  | "gsComp"
  | "gsTandem"
  | "hgFlex"
  | "hgStarr";

export interface AirbuddyTrack {
  buddyName: string;
  buddyFlightId: string;
  isActive: boolean;
  fixes: [GPSFix];
}

export interface CommentItem {
  comment: number;
  name: string;
  date: string;
  id: string;
}

// Waypoints tracing the 50x50 road network circuit
export const ROAD_CIRCUIT_WAYPOINTS: [number, number, number][] = [
  // 1. Central Roundabout Plaza exit heading East
  [2.0, 0.05, 0.0],
  [4.0, 0.05, 0.0],
  [6.0, 0.05, 0.0], // Major crossroad

  // 2. Approach and cross elevated Bridge 1 (River Canal)
  [8.0, 0.05, 0.0],
  [10.0, 0.08, 0.0], // Apex of Bridge 1
  [12.0, 0.05, 0.0],
  [14.0, 0.05, 0.0], // East Crossroad

  // 3. Turn South along Eastern Riverside Palm Highway
  [14.0, 0.05, 4.0],
  [14.0, 0.05, 8.0],
  [14.0, 0.05, 14.0], // South-East Crossroad

  // 4. Turn West crossing Bridge 3 over the river
  [12.0, 0.05, 14.0],
  [10.0, 0.08, 14.0], // Apex of Bridge 3
  [8.0, 0.05, 14.0],
  [6.0, 0.05, 14.0], // Riverbank crossroad

  // 5. West along South Arterial Road
  [2.0, 0.05, 14.0],
  [0.0, 0.05, 14.0], // South central crossroad
  [-6.0, 0.05, 14.0],
  [-12.0, 0.05, 14.0], // Old Market Entrance

  // 6. Turn North through Old Market & Heritage Street
  [-12.0, 0.05, 8.0],
  [-12.0, 0.05, 3.5],
  [-12.0, 0.05, 0.0], // Old Market Center Crossroad

  // 7. Head East back toward Central Plaza
  [-8.0, 0.05, 0.0],
  [-5.0, 0.05, 0.0],
  [-2.0, 0.05, 0.0],
  [0.0, 0.05, 0.0], // Central Roundabout
];


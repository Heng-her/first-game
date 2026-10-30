// =============================================================================
// COLLISION & HITBOX SYSTEM (ប្រព័ន្ធទប់ស្កាត់ការដើរធ្លុះវត្ថុ)
// =============================================================================

export interface CircleCollider {
  x: number;
  z: number;
  radius: number;
}

export interface BoxCollider {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

// -----------------------------------------------------------------------------
// 1. STATIC CIRCLE COLLIDERS (Monuments, Palms, Poles, Street Lamps, Signs)
// -----------------------------------------------------------------------------
const CIRCLE_COLLIDERS: CircleCollider[] = [
  // A. Central Angkor Stupa Monument Plaza (ស្តូបកណ្តាលក្រុង)
  { x: 0, z: 0, radius: 1.05 },

  // B. Tourism Stop Platform & Parked Tuk-Tuk near Roundabout
  { x: 1.75, z: 1.75, radius: 0.55 },
  { x: 2.15, z: 2.15, radius: 0.5 },
  { x: 2.3, z: 2.3, radius: 0.25 }, // Tourism station sign post

  // C. Central Plaza Palm Trees (ដើមត្នោតកណ្តាលក្រុង)
  { x: 3.2, z: -3.2, radius: 0.22 },
  { x: -3.2, z: -3.2, radius: 0.22 },
  { x: -3.2, z: 3.2, radius: 0.22 },
  { x: 3.2, z: 3.2, radius: 0.22 },

  // D. Riverside Palm Trees (ដើមត្នោតមាត់ស្ទឹងសៀមរាប)
  ...[-20, -16, -11, -8, -4, 3, 7, 11, 16, 20].flatMap((pz) => [
    { x: 8.2, z: pz, radius: 0.22 },
    { x: 11.8, z: pz + 1.5, radius: 0.22 },
  ]),

  // E. East Countryside Palm Plantation
  { x: 18, z: -7, radius: 0.22 },
  { x: 17, z: -9, radius: 0.22 },
  { x: 19, z: -5, radius: 0.22 },
  { x: 18, z: 7, radius: 0.22 },
  { x: 17, z: 9, radius: 0.22 },
  { x: 19, z: 5, radius: 0.22 },

  // F. West Old Market Park Palms
  { x: -9, z: -3.5, radius: 0.22 },
  { x: -15, z: -3.5, radius: 0.22 },
  { x: -9, z: 3.5, radius: 0.22 },
  { x: -15, z: 3.5, radius: 0.22 },

  // G. Outer Far Corners Palms
  { x: -20, z: -18, radius: 0.22 },
  { x: -20, z: 18, radius: 0.22 },
  { x: 20, z: -18, radius: 0.22 },
  { x: 20, z: 18, radius: 0.22 },

  // H. Street Lamps (Curved Lamps at Roundabout & Bridges)
  { x: 1.8, z: 1.8, radius: 0.12 },
  { x: -1.8, z: 1.8, radius: 0.12 },
  { x: 1.8, z: -1.8, radius: 0.12 },
  { x: -1.8, z: -1.8, radius: 0.12 },
  { x: 8.5, z: 0.6, radius: 0.12 },
  { x: 11.5, z: 0.6, radius: 0.12 },
  { x: 8.5, z: -13.4, radius: 0.12 },
  { x: 11.5, z: -13.4, radius: 0.12 },
  { x: 8.5, z: 14.6, radius: 0.12 },
  { x: 11.5, z: 14.6, radius: 0.12 },

  // I. Traffic Lights (ភ្លើងស្តុប)
  { x: 6.6, z: 0.6, radius: 0.12 },
  { x: 5.4, z: -0.6, radius: 0.12 },
  { x: -5.4, z: 0.6, radius: 0.12 },
  { x: -6.6, z: -0.6, radius: 0.12 },
  { x: 0.6, z: 6.6, radius: 0.12 },
  { x: -0.6, z: -6.6, radius: 0.12 },
  { x: 14.6, z: 0.6, radius: 0.12 },
  { x: -12.6, z: 0.6, radius: 0.12 },

  // J. Highway & Road Signs (ស្លាកសញ្ញាចរាចរណ៍)
  { x: 16, z: 0.7, radius: 0.14 },
  { x: 16, z: -13.3, radius: 0.14 },
  { x: 16, z: 14.7, radius: 0.14 },
  { x: 2.6, z: 0.6, radius: 0.12 },
  { x: -2.4, z: 0.6, radius: 0.12 },
  { x: 6.6, z: -0.6, radius: 0.12 },
  { x: -11.4, z: -0.6, radius: 0.12 },

  // K. Cambodian Electricity Poles (បង្គោលភ្លើង)
  { x: -0.6, z: 3.5, radius: 0.14 },
  { x: -0.6, z: 9.5, radius: 0.14 },
  { x: -0.6, z: -3.5, radius: 0.14 },
  { x: -0.6, z: -9.5, radius: 0.14 },
  { x: -8.5, z: 0.6, radius: 0.14 },
  { x: -14.5, z: 0.6, radius: 0.14 },

  // L. Construction Zone props
  { x: -14.8, z: 0.25, radius: 0.1 },
  { x: -15.6, z: 0.25, radius: 0.1 },
  { x: -14.3, z: 0.3, radius: 0.1 },
];

// -----------------------------------------------------------------------------
// 2. STATIC BOX COLLIDERS (Tuk-Tuk, Dumpsters, Barriers)
// -----------------------------------------------------------------------------
const BOX_COLLIDERS: BoxCollider[] = [
  // Second Parked Tuk-Tuk at Old Market Stand ([-12.5, 0.02, -1.8])
  { minX: -13.25, maxX: -11.75, minZ: -2.35, maxZ: -1.25 },

  // Construction Barrier in Old Market district ([-15.2, 0.25])
  { minX: -15.65, maxX: -14.75, minZ: 0.12, maxZ: 0.38 },

  // Dumpster in Old Market district ([-16.2, -0.6])
  { minX: -16.7, maxX: -15.7, minZ: -0.95, maxZ: -0.25 },
];

// -----------------------------------------------------------------------------
// 3. RIVER BRIDGES SAFE CORRIDORS
// -----------------------------------------------------------------------------
interface BridgeCorridor {
  centerZ: number;
  halfWidthZ: number; // width along Z corridor
}

const BRIDGES: BridgeCorridor[] = [
  { centerZ: 0, halfWidthZ: 0.65 }, // Central East Bridge
  { centerZ: -14, halfWidthZ: 0.65 }, // North Bridge
  { centerZ: 14, halfWidthZ: 0.65 }, // South Bridge
];

const RIVER_WEST_BANK = 8.8;
const RIVER_EAST_BANK = 11.2;
const MAP_MIN = -23.5;
const MAP_MAX = 23.5;

/**
 * Resolves player movement against all obstacles, river banks, and boundaries.
 * Enables smooth sliding along surfaces rather than abrupt sticking.
 *
 * @param currentX Current player X position
 * @param currentZ Current player Z position
 * @param nextX Intended player X position
 * @param nextZ Intended player Z position
 * @param playerRadius Player collision radius (e.g. 0.08)
 * @returns Corrected [resolvedX, resolvedZ] position
 */
export function resolveMovementCollision(
  currentX: number,
  currentZ: number,
  nextX: number,
  nextZ: number,
  playerRadius: number
): [number, number] {
  let resolvedX = nextX;
  let resolvedZ = nextZ;

  // 1. World Bounds clamping
  resolvedX = Math.max(MAP_MIN + playerRadius, Math.min(MAP_MAX - playerRadius, resolvedX));
  resolvedZ = Math.max(MAP_MIN + playerRadius, Math.min(MAP_MAX - playerRadius, resolvedZ));

  // 2. River Canal & Bridge Railings Handling
  // Check if player is crossing the river width
  const inRiverX = resolvedX > RIVER_WEST_BANK - playerRadius && resolvedX < RIVER_EAST_BANK + playerRadius;
  if (inRiverX) {
    // Check if within any bridge's safe corridor
    const activeBridge = BRIDGES.find(
      (b) => Math.abs(currentZ - b.centerZ) <= b.halfWidthZ
    );

    if (activeBridge) {
      // Player is crossing on a bridge: prevent falling off north/south edges into the river!
      const minBridgeZ = activeBridge.centerZ - activeBridge.halfWidthZ + playerRadius;
      const maxBridgeZ = activeBridge.centerZ + activeBridge.halfWidthZ - playerRadius;
      resolvedZ = Math.max(minBridgeZ, Math.min(maxBridgeZ, resolvedZ));
    } else {
      // Player is NOT on a bridge: prevent jumping/walking into water canal
      if (currentX <= RIVER_WEST_BANK) {
        resolvedX = Math.min(resolvedX, RIVER_WEST_BANK - playerRadius);
      } else if (currentX >= RIVER_EAST_BANK) {
        resolvedX = Math.max(resolvedX, RIVER_EAST_BANK + playerRadius);
      }
    }
  }

  // 3. Box Colliders Resolution (Push out to nearest face with sliding)
  for (const box of BOX_COLLIDERS) {
    const boxMinX = box.minX - playerRadius;
    const boxMaxX = box.maxX + playerRadius;
    const boxMinZ = box.minZ - playerRadius;
    const boxMaxZ = box.maxZ + playerRadius;

    if (
      resolvedX > boxMinX &&
      resolvedX < boxMaxX &&
      resolvedZ > boxMinZ &&
      resolvedZ < boxMaxZ
    ) {
      // Determine shortest penetration distance to push out
      const distLeft = resolvedX - boxMinX;
      const distRight = boxMaxX - resolvedX;
      const distTop = resolvedZ - boxMinZ;
      const distBottom = boxMaxZ - resolvedZ;

      const minDist = Math.min(distLeft, distRight, distTop, distBottom);
      if (minDist === distLeft) {
        resolvedX = boxMinX;
      } else if (minDist === distRight) {
        resolvedX = boxMaxX;
      } else if (minDist === distTop) {
        resolvedZ = boxMinZ;
      } else {
        resolvedZ = boxMaxZ;
      }
    }
  }

  // 4. Circle Colliders Resolution (Iterate twice for smooth multi-obstacle sliding)
  for (let iter = 0; iter < 2; iter++) {
    for (const circle of CIRCLE_COLLIDERS) {
      const dx = resolvedX - circle.x;
      const dz = resolvedZ - circle.z;
      const distSq = dx * dx + dz * dz;
      const minDist = circle.radius + playerRadius;

      if (distSq < minDist * minDist) {
        const dist = Math.sqrt(distSq);
        if (dist > 0.0001) {
          const pushRatio = minDist / dist;
          resolvedX = circle.x + dx * pushRatio;
          resolvedZ = circle.z + dz * pushRatio;
        } else {
          // Exactly on top of obstacle center, push toward current position
          resolvedX = currentX;
          resolvedZ = currentZ;
        }
      }
    }
  }

  return [resolvedX, resolvedZ];
}


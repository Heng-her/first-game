export interface RoadModelItem {
  id: string;
  nameKm: string;
  nameEn: string;
  fileName: string;
  category: "roads" | "intersections" | "slopes_bridges" | "lights_poles" | "signs_signals" | "props";
  previewImg?: string;
}

export interface ModelCategory {
  key: "all" | "roads" | "intersections" | "slopes_bridges" | "lights_poles" | "signs_signals" | "props";
  titleKm: string;
  titleEn: string;
  icon: string;
}

export const ROAD_CATEGORIES: ModelCategory[] = [
  { key: "all", titleKm: "ទាំងអស់ (All)", titleEn: "All Models", icon: "🌐" },
  { key: "roads", titleKm: "ផ្លូវត្រង់ & បត់", titleEn: "Straight & Bends", icon: "🛣️" },
  { key: "intersections", titleKm: "ផ្លូវបំបែក & រង្វង់មូល", titleEn: "Intersections & Roundabouts", icon: "🔀" },
  { key: "slopes_bridges", titleKm: "ស្ពាន & ជម្រាល", titleEn: "Bridges & Slopes", icon: "🌉" },
  { key: "lights_poles", titleKm: "ភ្លើង & បង្គោល", titleEn: "Lights & Poles", icon: "💡" },
  { key: "signs_signals", titleKm: "ស្តុប & ស្លាកសញ្ញា", titleEn: "Signals & Signs", icon: "🚦" },
  { key: "props", titleKm: "ការដ្ឋាន & បរិក្ខារ", titleEn: "Construction & Props", icon: "🚧" },
];

export const ROAD_MODELS: RoadModelItem[] = [
  // 1. Roads (Straight & Bends)
  { id: "road-straight", nameKm: "ផ្លូវត្រង់ស្តង់ដារ", nameEn: "Straight Road", fileName: "road-straight.glb", category: "roads" },
  { id: "road-straight-half", nameKm: "ផ្លូវត្រង់ពាក់កណ្តាល", nameEn: "Straight Half", fileName: "road-straight-half.glb", category: "roads" },
  { id: "road-straight-barrier", nameKm: "ផ្លូវត្រង់មានរបាំង", nameEn: "Straight with Barrier", fileName: "road-straight-barrier.glb", category: "roads" },
  { id: "road-straight-barrier-half", nameKm: "របាំងផ្លូវត្រង់កន្លះ", nameEn: "Straight Barrier Half", fileName: "road-straight-barrier-half.glb", category: "roads" },
  { id: "road-straight-barrier-end", nameKm: "ចុងរបាំងផ្លូវត្រង់", nameEn: "Straight Barrier End", fileName: "road-straight-barrier-end.glb", category: "roads" },
  { id: "road-bend", nameKm: "ផ្លូវបត់កោង", nameEn: "Road Bend", fileName: "road-bend.glb", category: "roads" },
  { id: "road-bend-barrier", nameKm: "ផ្លូវបត់កោងមានរបាំង", nameEn: "Bend with Barrier", fileName: "road-bend-barrier.glb", category: "roads" },
  { id: "road-bend-sidewalk", nameKm: "ផ្លូវបត់មានចិញ្ចើម", nameEn: "Bend with Sidewalk", fileName: "road-bend-sidewalk.glb", category: "roads" },
  { id: "road-bend-square", nameKm: "ផ្លូវបត់ជ្រុង", nameEn: "Bend Square", fileName: "road-bend-square.glb", category: "roads" },
  { id: "road-bend-square-barrier", nameKm: "ផ្លូវបត់ជ្រុងមានរបាំង", nameEn: "Bend Square Barrier", fileName: "road-bend-square-barrier.glb", category: "roads" },
  { id: "road-curve", nameKm: "ផ្លូវកោងស្តង់ដារ", nameEn: "Road Curve", fileName: "road-curve.glb", category: "roads" },
  { id: "road-curve-barrier", nameKm: "ផ្លូវកោងមានរបាំង", nameEn: "Curve with Barrier", fileName: "road-curve-barrier.glb", category: "roads" },
  { id: "road-curve-pavement", nameKm: "ផ្លូវកោងក្រាលថ្ម", nameEn: "Curve Pavement", fileName: "road-curve-pavement.glb", category: "roads" },
  { id: "road-square", nameKm: "ផ្លូវជ្រុងស្តង់ដារ", nameEn: "Square Road", fileName: "road-square.glb", category: "roads" },
  { id: "road-square-barrier", nameKm: "ផ្លូវជ្រុងមានរបាំង", nameEn: "Square Road Barrier", fileName: "road-square-barrier.glb", category: "roads" },
  { id: "road-side", nameKm: "គែមផ្លូវស្តង់ដារ", nameEn: "Road Side", fileName: "road-side.glb", category: "roads" },
  { id: "road-side-barrier", nameKm: "គែមផ្លូវមានរបាំង", nameEn: "Road Side Barrier", fileName: "road-side-barrier.glb", category: "roads" },

  // 2. Intersections & Roundabouts
  { id: "road-crossroad", nameKm: "ផ្លូវបែកបួនស្តង់ដារ", nameEn: "Crossroad", fileName: "road-crossroad.glb", category: "intersections" },
  { id: "road-crossroad-barrier", nameKm: "ផ្លូវបែកបួនមានរបាំង", nameEn: "Crossroad with Barrier", fileName: "road-crossroad-barrier.glb", category: "intersections" },
  { id: "road-crossroad-line", nameKm: "ផ្លូវបែកបួនមានគំនូស", nameEn: "Crossroad with Line", fileName: "road-crossroad-line.glb", category: "intersections" },
  { id: "road-crossroad-path", nameKm: "ផ្លូវបែកបួនមានគន្លងថ្មើរជើង", nameEn: "Crossroad with Path", fileName: "road-crossroad-path.glb", category: "intersections" },
  { id: "road-intersection", nameKm: "ផ្លូវបំបែកបី (T-Junction)", nameEn: "3-Way Intersection", fileName: "road-intersection.glb", category: "intersections" },
  { id: "road-intersection-barrier", nameKm: "ផ្លូវបំបែកបីមានរបាំង", nameEn: "Intersection with Barrier", fileName: "road-intersection-barrier.glb", category: "intersections" },
  { id: "road-intersection-line", nameKm: "ផ្លូវបំបែកបីមានគំនូស", nameEn: "Intersection with Line", fileName: "road-intersection-line.glb", category: "intersections" },
  { id: "road-intersection-path", nameKm: "ផ្លូវបំបែកបីមានគន្លង", nameEn: "Intersection with Path", fileName: "road-intersection-path.glb", category: "intersections" },
  { id: "road-curve-intersection", nameKm: "ផ្លូវកោងបំបែក", nameEn: "Curve Intersection", fileName: "road-curve-intersection.glb", category: "intersections" },
  { id: "road-curve-intersection-barrier", nameKm: "ផ្លូវកោងបំបែកមានរបាំង", nameEn: "Curve Intersection Barrier", fileName: "road-curve-intersection-barrier.glb", category: "intersections" },
  { id: "road-roundabout", nameKm: "រង្វង់មូលចរាចរណ៍", nameEn: "Traffic Roundabout", fileName: "road-roundabout.glb", category: "intersections" },
  { id: "road-roundabout-barrier", nameKm: "រង្វង់មូលមានរបាំង", nameEn: "Roundabout with Barrier", fileName: "road-roundabout-barrier.glb", category: "intersections" },
  { id: "road-crossing", nameKm: "គន្លងថ្មើរជើងឆ្លងកាត់", nameEn: "Pedestrian Crossing", fileName: "road-crossing.glb", category: "intersections" },
  { id: "road-split", nameKm: "ផ្លូវបែកជាពីរ", nameEn: "Road Split", fileName: "road-split.glb", category: "intersections" },
  { id: "road-split-barrier", nameKm: "ផ្លូវបែកជាពីរមានរបាំង", nameEn: "Road Split Barrier", fileName: "road-split-barrier.glb", category: "intersections" },
  { id: "road-driveway-single", nameKm: "ផ្លូវចូលទោល", nameEn: "Driveway Single", fileName: "road-driveway-single.glb", category: "intersections" },
  { id: "road-driveway-single-barrier", nameKm: "ផ្លូវចូលទោលមានរបាំង", nameEn: "Driveway Single Barrier", fileName: "road-driveway-single-barrier.glb", category: "intersections" },
  { id: "road-driveway-double", nameKm: "ផ្លូវចូលទ្វេ", nameEn: "Driveway Double", fileName: "road-driveway-double.glb", category: "intersections" },
  { id: "road-driveway-double-barrier", nameKm: "ផ្លូវចូលទ្វេមានរបាំង", nameEn: "Driveway Double Barrier", fileName: "road-driveway-double-barrier.glb", category: "intersections" },
  { id: "road-side-entry", nameKm: "ច្រកចូលចំហៀង", nameEn: "Side Entry", fileName: "road-side-entry.glb", category: "intersections" },
  { id: "road-side-entry-barrier", nameKm: "ច្រកចូលចំហៀងមានរបាំង", nameEn: "Side Entry Barrier", fileName: "road-side-entry-barrier.glb", category: "intersections" },
  { id: "road-side-exit", nameKm: "ច្រកចេញចំហៀង", nameEn: "Side Exit", fileName: "road-side-exit.glb", category: "intersections" },
  { id: "road-side-exit-barrier", nameKm: "ច្រកចេញចំហៀងមានរបាំង", nameEn: "Side Exit Barrier", fileName: "road-side-exit-barrier.glb", category: "intersections" },
  { id: "road-end", nameKm: "ផ្លូវទាល់ស្តង់ដារ", nameEn: "Road End", fileName: "road-end.glb", category: "intersections" },
  { id: "road-end-barrier", nameKm: "ផ្លូវទាល់មានរបាំង", nameEn: "Road End Barrier", fileName: "road-end-barrier.glb", category: "intersections" },
  { id: "road-end-round", nameKm: "ផ្លូវទាល់រាងមូល", nameEn: "Road End Round", fileName: "road-end-round.glb", category: "intersections" },
  { id: "road-end-round-barrier", nameKm: "ផ្លូវទាល់មូលមានរបាំង", nameEn: "Road End Round Barrier", fileName: "road-end-round-barrier.glb", category: "intersections" },

  // 3. Slopes & Bridges
  { id: "road-bridge", nameKm: "ស្ពានរថយន្ត", nameEn: "Road Bridge", fileName: "road-bridge.glb", category: "slopes_bridges" },
  { id: "bridge-pillar", nameKm: "សសរស្ពាន", nameEn: "Bridge Pillar", fileName: "bridge-pillar.glb", category: "slopes_bridges" },
  { id: "bridge-pillar-wide", nameKm: "សសរស្ពានទទឹងធំ", nameEn: "Bridge Pillar Wide", fileName: "bridge-pillar-wide.glb", category: "slopes_bridges" },
  { id: "road-slant", nameKm: "ផ្លូវជម្រាលស្តង់ដារ", nameEn: "Road Slant", fileName: "road-slant.glb", category: "slopes_bridges" },
  { id: "road-slant-barrier", nameKm: "ផ្លូវជម្រាលមានរបាំង", nameEn: "Slant with Barrier", fileName: "road-slant-barrier.glb", category: "slopes_bridges" },
  { id: "road-slant-high", nameKm: "ផ្លូវជម្រាលខ្ពស់", nameEn: "Road Slant High", fileName: "road-slant-high.glb", category: "slopes_bridges" },
  { id: "road-slant-high-barrier", nameKm: "ជម្រាលខ្ពស់មានរបាំង", nameEn: "Slant High Barrier", fileName: "road-slant-high-barrier.glb", category: "slopes_bridges" },
  { id: "road-slant-flat", nameKm: "ជម្រាលរាបស្មើ", nameEn: "Slant Flat", fileName: "road-slant-flat.glb", category: "slopes_bridges" },
  { id: "road-slant-flat-high", nameKm: "ជម្រាលរាបស្មើខ្ពស់", nameEn: "Slant Flat High", fileName: "road-slant-flat-high.glb", category: "slopes_bridges" },
  { id: "road-slant-curve", nameKm: "ផ្លូវជម្រាលកោង", nameEn: "Slant Curve", fileName: "road-slant-curve.glb", category: "slopes_bridges" },
  { id: "road-slant-curve-barrier", nameKm: "ជម្រាលកោងមានរបាំង", nameEn: "Slant Curve Barrier", fileName: "road-slant-curve-barrier.glb", category: "slopes_bridges" },
  { id: "road-slant-flat-curve", nameKm: "ជម្រាលរាបស្មើកោង", nameEn: "Slant Flat Curve", fileName: "road-slant-flat-curve.glb", category: "slopes_bridges" },
  { id: "tile-high", nameKm: "កម្រាលដីខ្ពស់", nameEn: "Tile High", fileName: "tile-high.glb", category: "slopes_bridges" },
  { id: "tile-low", nameKm: "កម្រាលដីទាប", nameEn: "Tile Low", fileName: "tile-low.glb", category: "slopes_bridges" },
  { id: "tile-slant", nameKm: "កម្រាលដីជម្រាល", nameEn: "Tile Slant", fileName: "tile-slant.glb", category: "slopes_bridges" },
  { id: "tile-slantHigh", nameKm: "កម្រាលដីជម្រាលខ្ពស់", nameEn: "Tile Slant High", fileName: "tile-slantHigh.glb", category: "slopes_bridges" },

  // 4. Lights & Poles
  { id: "light-curved", nameKm: "បង្គោលភ្លើងកោង", nameEn: "Curved Street Light", fileName: "light-curved.glb", category: "lights_poles" },
  { id: "light-curved-double", nameKm: "បង្គោលភ្លើងកោងសងខាង", nameEn: "Curved Light Double", fileName: "light-curved-double.glb", category: "lights_poles" },
  { id: "light-curved-cross", nameKm: "បង្គោលភ្លើងកោង ៤ ទិស", nameEn: "Curved Light Cross", fileName: "light-curved-cross.glb", category: "lights_poles" },
  { id: "light-square", nameKm: "បង្គោលភ្លើងជ្រុង", nameEn: "Square Street Light", fileName: "light-square.glb", category: "lights_poles" },
  { id: "light-square-double", nameKm: "បង្គោលភ្លើងជ្រុងសងខាង", nameEn: "Square Light Double", fileName: "light-square-double.glb", category: "lights_poles" },
  { id: "light-square-cross", nameKm: "បង្គោលភ្លើងជ្រុង ៤ ទិស", nameEn: "Square Light Cross", fileName: "light-square-cross.glb", category: "lights_poles" },
  { id: "electricity-pole", nameKm: "បង្គោលភ្លើងស្តង់ដារ", nameEn: "Electricity Pole", fileName: "electricity-pole.glb", category: "lights_poles" },
  { id: "electricity-pole-single", nameKm: "បង្គោលភ្លើងទោល", nameEn: "Electricity Pole Single", fileName: "electricity-pole-single.glb", category: "lights_poles" },
  { id: "electricity-pole-wide", nameKm: "បង្គោលភ្លើងធំទូលាយ", nameEn: "Electricity Pole Wide", fileName: "electricity-pole-wide.glb", category: "lights_poles" },
  { id: "electricity-side", nameKm: "បង្គោលភ្លើងចំហៀង", nameEn: "Side Pole", fileName: "electricity-side.glb", category: "lights_poles" },
  { id: "electricity-side-single", nameKm: "បង្គោលចំហៀងទោល", nameEn: "Side Pole Single", fileName: "electricity-side-single.glb", category: "lights_poles" },
  { id: "electricity-side-wide", nameKm: "បង្គោលចំហៀងធំ", nameEn: "Side Pole Wide", fileName: "electricity-side-wide.glb", category: "lights_poles" },
  { id: "electricity-wires", nameKm: "ខ្សែភ្លើងដងផ្លូវ", nameEn: "Electricity Wires", fileName: "electricity-wires.glb", category: "lights_poles" },
  { id: "electricity-wires-wide", nameKm: "ខ្សែភ្លើងទទឹងធំ", nameEn: "Wires Wide", fileName: "electricity-wires-wide.glb", category: "lights_poles" },

  // 5. Signals & Signs
  { id: "traffic-light", nameKm: "បង្គោលភ្លើងស្តុបចរាចរណ៍", nameEn: "Traffic Light Post", fileName: "traffic-light.glb", category: "signs_signals" },
  { id: "traffic-light-hanging", nameKm: "ភ្លើងស្តុបព្យួរ", nameEn: "Traffic Light Hanging", fileName: "traffic-light-hanging.glb", category: "signs_signals" },
  { id: "traffic-light-object-horizontal", nameKm: "ប្រអប់ភ្លើងស្តុបផ្តេក", nameEn: "Light Box Horizontal", fileName: "traffic-light-object-horizontal.glb", category: "signs_signals" },
  { id: "traffic-light-object-vertical", nameKm: "ប្រអប់ភ្លើងស្តុបឈរ", nameEn: "Light Box Vertical", fileName: "traffic-light-object-vertical.glb", category: "signs_signals" },
  { id: "traffic-light-object-hanging", nameKm: "ប្រអប់ភ្លើងស្តុបព្យួរ", nameEn: "Light Box Hanging", fileName: "traffic-light-object-hanging.glb", category: "signs_signals" },
  { id: "road-sign-stop", nameKm: "ស្លាកសញ្ញាឈប់ (Stop)", nameEn: "Stop Sign Post", fileName: "road-sign-stop.glb", category: "signs_signals" },
  { id: "road-sign-warning", nameKm: "ស្លាកសញ្ញាគ្រោះថ្នាក់", nameEn: "Warning Sign Post", fileName: "road-sign-warning.glb", category: "signs_signals" },
  { id: "road-sign-street", nameKm: "ស្លាកឈ្មោះផ្លូវ", nameEn: "Street Sign Post", fileName: "road-sign-street.glb", category: "signs_signals" },
  { id: "road-sign-empty", nameKm: "ស្លាកទទេសម្រាប់សរសេរ", nameEn: "Empty Sign Post", fileName: "road-sign-empty.glb", category: "signs_signals" },
  { id: "road-sign-empty-hanging", nameKm: "ស្លាកទទេព្យួរ", nameEn: "Empty Sign Hanging", fileName: "road-sign-empty-hanging.glb", category: "signs_signals" },
  { id: "road-sign-object-stop", nameKm: "បន្ទះស្លាកឈប់", nameEn: "Stop Sign Object", fileName: "road-sign-object-stop.glb", category: "signs_signals" },
  { id: "road-sign-object-warning", nameKm: "បន្ទះស្លាកប្រយ័ត្ន", nameEn: "Warning Sign Object", fileName: "road-sign-object-warning.glb", category: "signs_signals" },
  { id: "road-sign-object-street", nameKm: "បន្ទះស្លាកឈ្មោះផ្លូវ", nameEn: "Street Sign Object", fileName: "road-sign-object-street.glb", category: "signs_signals" },
  { id: "sign-highway", nameKm: "ស្លាកផ្លូវជាតិ/ល្បឿនលឿន", nameEn: "Highway Sign", fileName: "sign-highway.glb", category: "signs_signals" },
  { id: "sign-highway-wide", nameKm: "ស្លាកផ្លូវជាតិធំ", nameEn: "Highway Sign Wide", fileName: "sign-highway-wide.glb", category: "signs_signals" },
  { id: "sign-highway-detailed", nameKm: "ស្លាកផ្លូវជាតិលម្អិត", nameEn: "Highway Sign Detailed", fileName: "sign-highway-detailed.glb", category: "signs_signals" },

  // 6. Construction & Props
  { id: "construction-cone", nameKm: "កោនចរាចរណ៍ការដ្ឋាន", nameEn: "Traffic Cone", fileName: "construction-cone.glb", category: "props" },
  { id: "construction-barrier", nameKm: "របាំងឈើការដ្ឋាន", nameEn: "Construction Barrier", fileName: "construction-barrier.glb", category: "props" },
  { id: "construction-fence", nameKm: "របងសំណាញ់ការដ្ឋាន", nameEn: "Construction Fence", fileName: "construction-fence.glb", category: "props" },
  { id: "construction-light", nameKm: "ចង្កៀងសញ្ញាការដ្ឋាន", nameEn: "Construction Light", fileName: "construction-light.glb", category: "props" },
  { id: "dumpster", nameKm: "ធុងសំរាមដែកធំ", nameEn: "Dumpster", fileName: "dumpster.glb", category: "props" },
];


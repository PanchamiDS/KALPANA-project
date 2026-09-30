export interface MissionScene {
  id: string;
  timestamp: string; // e.g. "0:00"
  seconds: number;
  title: string;
  phase: string;
  transcript: string;
  altitudeKm: number;
  speedKmph: number;
  mach: number;
  dynamicPressureKPa: number;
  stage1Fuel: number;
  stage2Fuel: number;
  gForce: number;
  statusText: string;
  visualTheme: 'team' | 'intro' | 'launchpad' | 'ascent' | 'maxq' | 'separation' | 'descent' | 'landing' | 'orbit' | 'cubesat' | 'ground' | 'economics' | 'infrastructure' | 'roadmap';
  imageKey?: 'launchpad' | 'separation' | 'landing' | 'patch' | 'teamIntro' | 'logoReveal';
}

export interface TeamMember {
  name: string;
  role: string;
  discipline: string;
  bio: string;
  quote: string;
  contributions: string[];
  initials: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Srishti',
    role: 'Team Lead & Mission Director',
    discipline: 'System Architecture & Orbital Mechanics',
    bio: 'Leads Team ASTRYX-K4 with a vision to democratize orbital access for student universities and the Global South. Oversees mission staging, trajectory optimization, and multi-subsystem integration for VYOM-1.',
    quote: 'Space is no longer a monopoly of superpowers — when students dream beyond limits, orbit is within reach.',
    contributions: [
      '500 km Sun-Synchronous Orbit (SSO) trajectory design',
      'System-level fail-safe protocols and mission timeline architecture',
      'Overall project coordination and university payload consortium outreach'
    ],
    initials: 'SR'
  },
  {
    name: 'Vivek Matade',
    role: 'Propulsion Lead',
    discipline: 'Green Hybrid Engines & Cluster Dynamics',
    bio: 'Spearheads VYOM-1’s eco-friendly propulsion systems, including the 9-engine Stage 1 booster cluster and the non-toxic HTPB + liquid N₂O hybrid Stage 2 vacuum engine.',
    quote: 'Developing green hybrid propulsion means zero toxic hypergolics, safer student handling, and maximum thrust reliability.',
    contributions: [
      'HTPB fuel grain regression rate modeling and injector design',
      'Pressurized liquid Nitrous Oxide (N₂O) delivery manifold',
      'First-stage 3-engine reignition dynamics for drone ship touchdown'
    ],
    initials: 'VM'
  },
  {
    name: 'Sriharsha',
    role: 'Avionics & GNC Lead',
    discipline: 'Guidance, Navigation, Control & Aerodynamics',
    bio: 'Designs the autonomous flight algorithms, grid-fin aerodynamic actuation, cold-gas reaction control system (RCS), and high-precision drone ship targeting.',
    quote: 'Landing a booster on an ocean barge is pure mathematical ballet: grid fins slicing hypersonic air with millisecond reaction control.',
    contributions: [
      'Titanium grid fin servo actuation and aerodynamic moment profiling',
      'Cold-gas RCS thruster pulse code modulation for upper atmosphere flip',
      'Inertial Guidance Unit (IMU) sensor fusion with RTK-GPS drone ship beacon'
    ],
    initials: 'SH'
  },
  {
    name: 'Panchami',
    role: 'Payload & Ground Operations Lead',
    discipline: 'CubeSat Dispenser & Satellite Telemetry',
    bio: 'Oversees the 50 kg payload bay integration, multi-satellite deployment canisters (3U to 6U CubeSats), and campus ground station communication architecture.',
    quote: 'A rocket is only as impactful as the science it deploys. Connecting students to their own orbiting nanosats changes everything.',
    contributions: [
      'Universal spring-loaded CubeSat deployment sequencer',
      'Open-source ground station UHF/S-band transceiver kit for campuses',
      'Thermal and vibrational isolation mounts for climate sensor payloads'
    ],
    initials: 'PA'
  }
];

export const MISSION_SCENES: MissionScene[] = [
  // Scene 01: TEAM INTRO PART
  {
    id: 'team-intro',
    timestamp: '0:00',
    seconds: 0,
    title: 'We Are Team ASTRYX-K4!',
    phase: 'Official Mission Intro',
    transcript: 'We are Team ASTRYX-K4! Led by Srishti, with Vivek Matade, Sriharsha, and Panchami. Dreaming beyond limits, building beyond boundaries!',
    altitudeKm: 0,
    speedKmph: 0,
    mach: 0,
    dynamicPressureKPa: 0,
    stage1Fuel: 100,
    stage2Fuel: 100,
    gForce: 1.0,
    statusText: 'TEAM ASTRYX-K4 ASSEMBLED',
    visualTheme: 'team',
    imageKey: 'teamIntro'
  },
  // Scene 02: AI ETHICS & CREED PART
  {
    id: 'creed-ai',
    timestamp: '0:09',
    seconds: 9,
    title: 'ASTRYX-K4: Reach Beyond!',
    phase: 'AI Tools & Team Creed',
    transcript: 'We also acknowledge the use of AI tools in developing our work. ASTRYX-K4 — Let’s reach beyond!',
    altitudeKm: 0,
    speedKmph: 0,
    mach: 0,
    dynamicPressureKPa: 0,
    stage1Fuel: 100,
    stage2Fuel: 100,
    gForce: 1.0,
    statusText: 'ETHICAL AI GROUNDED · FLIGHT GO',
    visualTheme: 'intro',
    imageKey: 'logoReveal'
  },
  // Scene 03: MISSION BACKGROUND
  {
    id: 'intro',
    timestamp: '0:18',
    seconds: 18,
    title: 'The High Cost of Orbit',
    phase: 'Pre-Launch Briefing',
    transcript: 'Ever since the space age began, getting to orbit has cost millions, putting it out of reach for most universities and startups.',
    altitudeKm: 0,
    speedKmph: 0,
    mach: 0,
    dynamicPressureKPa: 0,
    stage1Fuel: 100,
    stage2Fuel: 100,
    gForce: 1.0,
    statusText: 'PAD SECURE',
    visualTheme: 'launchpad',
    imageKey: 'launchpad'
  },
  // Scene 04: MISSION OBJECTIVES
  {
    id: 'mission-purpose',
    timestamp: '0:26',
    seconds: 26,
    title: 'Introducing VYOM-1',
    phase: 'Mission Objectives',
    transcript: 'Designed for student CubeSats and disaster monitoring nanosats, VYOM-1 is India\'s step toward affordable, reusable space access.',
    altitudeKm: 0,
    speedKmph: 0,
    mach: 0,
    dynamicPressureKPa: 0,
    stage1Fuel: 100,
    stage2Fuel: 100,
    gForce: 1.0,
    statusText: 'SYSTEMS ARMED',
    visualTheme: 'launchpad',
    imageKey: 'launchpad'
  },
  // Scene 05: LIFTOFF
  {
    id: 'liftoff',
    timestamp: '0:35',
    seconds: 35,
    title: 'Stage 1 Solid Booster Ignition',
    phase: 'Ascent / Liftoff',
    transcript: 'Stage 1: Solid booster. Liftoff begins with all nine first-stage engines burning.',
    altitudeKm: 3.2,
    speedKmph: 850,
    mach: 0.7,
    dynamicPressureKPa: 22.4,
    stage1Fuel: 92,
    stage2Fuel: 100,
    gForce: 2.4,
    statusText: 'ALL 9 ENGINES NOMINAL',
    visualTheme: 'ascent',
    imageKey: 'launchpad'
  },
  // Scene 06: HYBRID PROPULSION TECH
  {
    id: 'hybrid-stage2',
    timestamp: '0:39',
    seconds: 39,
    title: 'Green Hybrid Propulsion Tech',
    phase: 'Power Ascent',
    transcript: 'Stage 2: Hybrid HTPB grain + liquid N2O.',
    altitudeKm: 14.8,
    speedKmph: 2200,
    mach: 1.9,
    dynamicPressureKPa: 38.6,
    stage1Fuel: 78,
    stage2Fuel: 100,
    gForce: 3.1,
    statusText: 'TELEMETRY NOMINAL',
    visualTheme: 'ascent'
  },
  // Scene 07: MAX Q & STAGE SEPARATION
  {
    id: 'max-q-sep',
    timestamp: '0:44',
    seconds: 44,
    title: 'Max Q & Stage Separation at 70 km',
    phase: 'Atmospheric Boundary',
    transcript: 'At T+ 2 minutes 30 seconds, the vehicle reaches Max Q — maximum aerodynamic pressure. Stage separation occurs at approximately 70 kilometres altitude.',
    altitudeKm: 70.4,
    speedKmph: 6840,
    mach: 5.8,
    dynamicPressureKPa: 42.1,
    stage1Fuel: 18,
    stage2Fuel: 100,
    gForce: 3.8,
    statusText: 'STAGE SEP CONFIRMED',
    visualTheme: 'separation',
    imageKey: 'separation'
  },
  // Scene 08: DESCENT
  {
    id: 'descent-grid-fins',
    timestamp: '0:53',
    seconds: 53,
    title: 'Stage 1 Flip & Guided Descent',
    phase: 'Booster Recovery Maneuver',
    transcript: 'Payload: 50 kg | 500 km SSO. After burnout, Stage 1 flips and begins guided descent using grid fins and cold-gas thrusters.',
    altitudeKm: 58.0,
    speedKmph: 4200,
    mach: 3.6,
    dynamicPressureKPa: 18.2,
    stage1Fuel: 12,
    stage2Fuel: 88,
    gForce: 1.8,
    statusText: 'GRID FINS ACTIVE',
    visualTheme: 'descent'
  },
  // Scene 09: DRONESHIP LANDING
  {
    id: 'landing-burn',
    timestamp: '1:00',
    seconds: 60,
    title: 'Drone Ship Landing: Bay of Bengal',
    phase: 'Propulsive Touchdown',
    transcript: 'Three of the nine engines reignite for the landing burn, bringing the booster down on a drone ship in the Bay of Bengal.',
    altitudeKm: 0.1,
    speedKmph: 24,
    mach: 0.02,
    dynamicPressureKPa: 0.1,
    stage1Fuel: 2,
    stage2Fuel: 74,
    gForce: 1.3,
    statusText: 'TOUCHDOWN CONFIRMED',
    visualTheme: 'landing',
    imageKey: 'landing'
  },
  // Scene 10: STAGE 2 VACUUM
  {
    id: 'stage2-vacuum',
    timestamp: '1:07',
    seconds: 67,
    title: 'Stage 2 Vacuum Engine Takeover',
    phase: 'Orbital Insertion',
    transcript: 'Stage 2 takes over with a single vacuum-optimised engine.',
    altitudeKm: 280.0,
    speedKmph: 18400,
    mach: 15.2,
    dynamicPressureKPa: 0.0,
    stage1Fuel: 0,
    stage2Fuel: 52,
    gForce: 2.1,
    statusText: 'VACUUM BURN STEADY',
    visualTheme: 'orbit',
    imageKey: 'separation'
  },
  // Scene 11: CUBESAT DEPLOYMENT
  {
    id: 'cubesat-deploy',
    timestamp: '1:11',
    seconds: 71,
    title: '500 km SSO Insertion & Deployment',
    phase: 'Payload Release',
    transcript: 'At 500 kilometres Sun-synchronous orbit, VYOM-1 deploys up to 50 kilograms of payload, typically 3 to 6 CubeSats for earth observation and scientific research.',
    altitudeKm: 500.0,
    speedKmph: 27400,
    mach: 22.4,
    dynamicPressureKPa: 0.0,
    stage1Fuel: 0,
    stage2Fuel: 0,
    gForce: 0.0,
    statusText: 'DEPLOYMENT COMPLETE',
    visualTheme: 'cubesat'
  },
  // Scene 12: STUDENT GROUND STATIONS
  {
    id: 'student-satellites',
    timestamp: '1:21',
    seconds: 81,
    title: 'Student Campus Ground Stations',
    phase: 'On-Orbit Science',
    transcript: 'These CubeSats carry instruments for crop monitoring, urban planning, and climate data collection. Students build and operate them from ground stations on their own campuses — gaining real space mission experience at a fraction of the usual cost.',
    altitudeKm: 500.0,
    speedKmph: 27400,
    mach: 22.4,
    dynamicPressureKPa: 0.0,
    stage1Fuel: 0,
    stage2Fuel: 0,
    gForce: 0.0,
    statusText: 'UHF/S-BAND TELEMETRY LOCKED',
    visualTheme: 'ground'
  },
  // Scene 13: 60% COST REDUCTION
  {
    id: 'cost-reduction',
    timestamp: '1:36',
    seconds: 96,
    title: '60% Launch Cost Reduction',
    phase: 'Economic Impact',
    transcript: 'Reusable vs Expendable: By reusing its first stage, VYOM-1 cuts launch costs by up to 60%. A dedicated rideshare now costs a fraction of traditional launchers, making space accessible to institutions across India and the Global South.',
    altitudeKm: 500.0,
    speedKmph: 27400,
    mach: 22.4,
    dynamicPressureKPa: 0.0,
    stage1Fuel: 0,
    stage2Fuel: 0,
    gForce: 0.0,
    statusText: 'SAVINGS: 60% APPLIED',
    visualTheme: 'economics'
  },
  // Scene 14: 72H RAPID TURNAROUND
  {
    id: 'turnaround-72h',
    timestamp: '1:50',
    seconds: 110,
    title: '72-Hour Rapid Turnaround Cycle',
    phase: 'Commercial Infrastructure',
    transcript: 'Beyond single launches, VYOM-1 is building the infrastructure for India\'s commercial space ecosystem. It\'s designed for rapid turnaround — ground crews can inspect, refuel, and relaunch within 72 hours of recovery.',
    altitudeKm: 0,
    speedKmph: 0,
    mach: 0,
    dynamicPressureKPa: 0,
    stage1Fuel: 0,
    stage2Fuel: 0,
    gForce: 1.0,
    statusText: 'GROUND CREW READY',
    visualTheme: 'infrastructure'
  },
  // Scene 15: CREW & HEAVY ROADMAP
  {
    id: 'crew-heavy-roadmap',
    timestamp: '2:04',
    seconds: 124,
    title: 'Crew-Rated & 3-Core Heavy Lift',
    phase: 'Future Roadmap',
    transcript: 'The roadmap includes a crew-rated variant for human spaceflight and a heavy-lift configuration that clusters three VYOM-1 cores together. Each upgrade builds on the same proven engines and avionics.',
    altitudeKm: 0,
    speedKmph: 0,
    mach: 0,
    dynamicPressureKPa: 0,
    stage1Fuel: 100,
    stage2Fuel: 100,
    gForce: 1.0,
    statusText: 'R&D IN PROGRESS',
    visualTheme: 'roadmap'
  },
  // Scene 16: GATEWAY VISION
  {
    id: 'gateway-vision',
    timestamp: '2:16',
    seconds: 136,
    title: 'Gateway to the Space Economy',
    phase: 'Mission Philosophy',
    transcript: 'VYOM-1 isn\'t just a rocket — it\'s a gateway. Affordable, reusable, and built for the next generation of explorers. India\'s space economy is taking off, and VYOM-1 is at the centre of it.',
    altitudeKm: 500.0,
    speedKmph: 27400,
    mach: 22.4,
    dynamicPressureKPa: 0.0,
    stage1Fuel: 0,
    stage2Fuel: 0,
    gForce: 0.0,
    statusText: 'MISSION SUCCESS',
    visualTheme: 'orbit',
    imageKey: 'patch'
  },
  // Scene 17: SRIHARIKOTA PAD
  {
    id: 'sriharikota-pad',
    timestamp: '2:30',
    seconds: 150,
    title: 'Sriharikota Dedicated Launch Pad',
    phase: 'Spaceport Facilities',
    transcript: 'The VYOM launch site at Sriharikota has been upgraded with dedicated integration facilities and a second launch pad. This infrastructure supports the higher launch cadence that reusability makes possible.',
    altitudeKm: 0,
    speedKmph: 0,
    mach: 0,
    dynamicPressureKPa: 0,
    stage1Fuel: 100,
    stage2Fuel: 100,
    gForce: 1.0,
    statusText: 'PAD 02 COMMISSIONED',
    visualTheme: 'launchpad',
    imageKey: 'launchpad'
  },
  // Scene 18: THE NEXT CHAPTER BEGINS
  {
    id: 'next-chapter',
    timestamp: '2:43',
    seconds: 163,
    title: 'The Next Chapter Begins',
    phase: 'ASTRYX-K4 Creed',
    transcript: 'With over a dozen launches already booked, VYOM-1 is proving that affordable space access isn\'t just possible — it\'s already here. The next chapter of India\'s space story begins with this rocket.',
    altitudeKm: 500.0,
    speedKmph: 27400,
    mach: 22.4,
    dynamicPressureKPa: 0.0,
    stage1Fuel: 0,
    stage2Fuel: 0,
    gForce: 0.0,
    statusText: 'ORBIT SECURED · REACH BEYOND',
    visualTheme: 'orbit',
    imageKey: 'patch'
  }
];

export const ASSET_PATHS = {
  launchpad: '/src/assets/images/vyom1_rocket_launchpad_1790780326975.jpg',
  separation: '/src/assets/images/vyom1_stage_separation_1790780340253.jpg',
  landing: '/src/assets/images/vyom1_droneship_landing_1790780357029.jpg',
  patch: '/src/assets/images/astryx_k4_mission_patch_1790780368176.jpg',
  teamIntro: '/src/assets/images/astryx_k4_team_intro_1790781007774.jpg',
  logoReveal: '/src/assets/images/astryx_logo_reveal_1790781025880.jpg'
};

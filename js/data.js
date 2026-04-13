// ─────────────────────────────────────────────────
//  data.js  ·  All static workout content
//  Edit exercises inside the app using Edit Mode.
//  IDs must remain stable — they are used as keys
//  in the state.customizations store.
// ─────────────────────────────────────────────────

/* ── ACHILLES CARE BLOCK (every day) ─────────────── */
const ACHILLES_BLOCK = [
  { id: 'ach_0', name: 'Double-leg calf raise',          sets: '3×15',             note: '2 sec up, 3 sec down' },
  { id: 'ach_1', name: 'Single-leg calf raise',          sets: '3×10 each',        note: 'Slow and controlled' },
  { id: 'ach_2', name: 'Eccentric heel drop (off step)', sets: '3×15',             note: '3-sec lowering — use other leg to reset' },
  { id: 'ach_3', name: 'Banded dorsiflexion',            sets: '2×20 each ankle',  note: 'Seated, band around forefoot' },
];

/* ── PULL-UP LEVELS ───────────────────────────────── */
// Each level has grip work + pull-up work.
// Minimum 6 sessions before Level Up unlocks (~2 weeks).
const PULLUP_LEVELS = [
  {
    level: 1, label: 'PU-1',
    desc: 'Build grip and get comfortable on the bar',
    minSessions: 6,
    exercises: [
      { id: 'pu1_0', name: 'Dead hang',                    sets: '3 × 20 sec',           note: 'Grip endurance — release and re-grip between sets' },
      { id: 'pu1_1', name: 'Band-assisted pull-up (thick band)', sets: '3×5',             note: 'Full range of motion, chin over bar' },
      { id: 'pu1_2', name: "Farmer's carry",               sets: '1 × 30 sec each hand', note: '25–30 lb DB — grip strength' },
    ],
  },
  {
    level: 2, label: 'PU-2',
    desc: 'Add negatives to build pulling strength',
    minSessions: 6,
    exercises: [
      { id: 'pu2_0', name: 'Dead hang',                    sets: '3 × 25 sec',           note: 'Try switching grip width each set' },
      { id: 'pu2_1', name: 'Band-assisted pull-up (thick band)', sets: '3×6',             note: 'Controlled up and down' },
      { id: 'pu2_2', name: 'Negative (slow lower)',         sets: '3 reps, 5-sec down',   note: 'Jump or step up to top; lower slowly' },
      { id: 'pu2_3', name: "Farmer's carry",               sets: '1 × 35 sec each hand', note: '30 lb DB' },
    ],
  },
  {
    level: 3, label: 'PU-3',
    desc: 'Increase volume on assisted reps and negatives',
    minSessions: 6,
    exercises: [
      { id: 'pu3_0', name: 'Dead hang',                    sets: '3 × 30 sec',           note: 'Try alternating overhand / underhand grip' },
      { id: 'pu3_1', name: 'Band-assisted pull-up (thick band)', sets: '3×8',             note: 'Slow on the way down (2-sec lower)' },
      { id: 'pu3_2', name: 'Negative (slow lower)',         sets: '5 reps, 5-sec down' },
      { id: 'pu3_3', name: "Farmer's carry",               sets: '2 × 30 sec each hand', note: '30 lb DB' },
    ],
  },
  {
    level: 4, label: 'PU-4',
    desc: 'Transition to medium band — lighter assist',
    minSessions: 6,
    exercises: [
      { id: 'pu4_0', name: 'Dead hang',                    sets: '3 × 30 sec',           note: 'Engage scapula — pull shoulder blades down before hanging' },
      { id: 'pu4_1', name: 'Band-assisted pull-up (medium band)', sets: '3×5',            note: 'Less assistance — this will feel harder' },
      { id: 'pu4_2', name: 'Negative (slow lower)',         sets: '5 reps, 6-sec down' },
      { id: 'pu4_3', name: "Farmer's carry",               sets: '2 × 35 sec each hand', note: '35 lb DB' },
    ],
  },
  {
    level: 5, label: 'PU-5',
    desc: 'Build volume on medium band + more negatives',
    minSessions: 6,
    exercises: [
      { id: 'pu5_0', name: 'Dead hang',                    sets: '3 × 35 sec' },
      { id: 'pu5_1', name: 'Band-assisted pull-up (medium band)', sets: '3×8' },
      { id: 'pu5_2', name: 'Negative (slow lower)',         sets: '3 reps, 6-sec down' },
      { id: 'pu5_3', name: "Farmer's carry",               sets: '2 × 40 sec each hand', note: '35–40 lb DB' },
    ],
  },
  {
    level: 6, label: 'PU-6',
    desc: 'Thin band — minimal assist',
    minSessions: 6,
    exercises: [
      { id: 'pu6_0', name: 'Dead hang',                    sets: '3 × 40 sec',           note: 'Try towel hang (grip a towel over the bar) 1 set' },
      { id: 'pu6_1', name: 'Band-assisted pull-up (thin band)', sets: '3×5',              note: 'Very little assistance now — earn each rep' },
      { id: 'pu6_2', name: 'Negative (slow lower)',         sets: '5 reps, 7-sec down' },
      { id: 'pu6_3', name: "Farmer's carry",               sets: '2 × 40 sec each hand', note: '40 lb DB' },
    ],
  },
  {
    level: 7, label: 'PU-7',
    desc: 'Increase volume on thin band + negatives',
    minSessions: 6,
    exercises: [
      { id: 'pu7_0', name: 'Dead hang',                    sets: '3 × 45 sec',           note: 'Towel hang 1 set for grip challenge' },
      { id: 'pu7_1', name: 'Band-assisted pull-up (thin band)', sets: '3×8' },
      { id: 'pu7_2', name: 'Negative (slow lower)',         sets: '3 reps, 7-sec down' },
      { id: 'pu7_3', name: "Farmer's carry",               sets: '2 × 45 sec each hand', note: '40–45 lb DB' },
    ],
  },
  {
    level: 8, label: 'PU-8 🎉',
    desc: 'First unassisted rep milestone!',
    minSessions: 6,
    exercises: [
      { id: 'pu8_0', name: 'Dead hang',                    sets: '3 × 45 sec' },
      { id: 'pu8_1', name: 'Unassisted pull-up',           sets: '1 rep',                note: '🎉 Your first unassisted! Rest 2 min after.' },
      { id: 'pu8_2', name: 'Band-assisted pull-up (thin band)', sets: '2×5',             note: 'After your unassisted rep' },
      { id: 'pu8_3', name: 'Negative (slow lower)',         sets: '3 reps, 8-sec down' },
      { id: 'pu8_4', name: "Farmer's carry",               sets: '2 × 45 sec each hand', note: '45 lb DB' },
    ],
  },
  {
    level: 9, label: 'PU-9',
    desc: 'Build to 2 unassisted reps',
    minSessions: 6,
    exercises: [
      { id: 'pu9_0', name: 'Dead hang',                    sets: '3 × 50 sec' },
      { id: 'pu9_1', name: 'Unassisted pull-up',           sets: '2 reps',               note: 'Rest fully between reps if needed' },
      { id: 'pu9_2', name: 'Band-assisted pull-up (thin band)', sets: '2×5' },
      { id: 'pu9_3', name: 'Negative (slow lower)',         sets: '3 reps, 8-sec down' },
      { id: 'pu9_4', name: "Farmer's carry",               sets: '2 × 50 sec each hand', note: '45 lb DB' },
    ],
  },
  {
    level: 10, label: 'PU-10 🏆',
    desc: '3 unassisted pull-ups — Goal achieved!',
    minSessions: 1,
    exercises: [
      { id: 'pu10_0', name: 'Dead hang',                   sets: '3 × 50 sec' },
      { id: 'pu10_1', name: 'Unassisted pull-up',          sets: '3 reps',               note: '🏆 GOAL ACHIEVED — 3 unassisted pull-ups!' },
      { id: 'pu10_2', name: 'Negative (slow lower)',        sets: '3 reps, 8-sec down',   note: 'Keep building strength' },
      { id: 'pu10_3', name: "Farmer's carry",              sets: '2 × 50 sec each hand', note: '45–55 lb DB' },
    ],
  },
];

/* ── RUNNING LEVELS (Tue/Thu) ────────────────────── */
// Saturday is always one level ahead.
// type: 'intervals' | 'continuous' | 'race'
const RUNNING_LEVELS = [
  { level:1,  type:'intervals',  runMin:1,   walkMin:2,   rounds:8,  paceRange:'10:30–12:00/mile', paceCue:'Fully conversational. Slow down if you can\'t speak in full sentences.', cadenceTip:true },
  { level:2,  type:'intervals',  runMin:1.5, walkMin:2,   rounds:7,  paceRange:'10:30–12:00/mile', paceCue:'Fully conversational.', cadenceTip:true },
  { level:3,  type:'intervals',  runMin:2,   walkMin:2,   rounds:6,  paceRange:'10:30–11:30/mile', paceCue:'Fully conversational. You should feel easy.', cadenceTip:true },
  { level:4,  type:'intervals',  runMin:2.5, walkMin:1.5, rounds:6,  paceRange:'10:30–11:30/mile', paceCue:'Fully conversational. This is your current level.', cadenceTip:true },
  { level:5,  type:'intervals',  runMin:3,   walkMin:1.5, rounds:5,  paceRange:'10:00–11:00/mile', paceCue:'Mostly conversational. Short sentences OK.', cadenceTip:true },
  { level:6,  type:'intervals',  runMin:4,   walkMin:1.5, rounds:5,  paceRange:'10:00–11:00/mile', paceCue:'Mostly conversational.', cadenceTip:true },
  { level:7,  type:'intervals',  runMin:5,   walkMin:1,   rounds:4,  paceRange:'10:00–10:30/mile', paceCue:'Mostly conversational — starting to feel the effort.', cadenceTip:true },
  { level:8,  type:'intervals',  runMin:6,   walkMin:1,   rounds:4,  paceRange:'9:30–10:30/mile',  paceCue:'Comfortably hard. A few words per breath.', cadenceTip:true },
  { level:9,  type:'intervals',  runMin:8,   walkMin:1,   rounds:3,  paceRange:'9:30–10:30/mile',  paceCue:'Comfortably hard.', cadenceTip:true },
  { level:10, type:'intervals',  runMin:10,  walkMin:1,   rounds:3,  paceRange:'9:30–10:00/mile',  paceCue:'Comfortably hard — approaching goal pace.', cadenceTip:true },
  { level:11, type:'intervals',  runMin:15,  walkMin:1,   rounds:2,  paceRange:'9:00–9:30/mile',   paceCue:'Sustained effort. This is goal-pace training.', cadenceTip:true },
  { level:12, type:'intervals',  runMin:20,  walkMin:1,   rounds:2,  paceRange:'9:00–9:30/mile',   paceCue:'Sustained effort.', cadenceTip:true },
  { level:13, type:'continuous', runMin:25,               rounds:1,  paceRange:'9:00–9:30/mile',   paceCue:'First continuous run! Sustained effort.', cadenceTip:true },
  { level:14, type:'continuous', runMin:30,               rounds:1,  paceRange:'9:00–9:30/mile',   paceCue:'Sustained effort. Strong finish.', cadenceTip:true },
  { level:15, type:'continuous', runMin:33,               rounds:1,  paceRange:'9:00–9:30/mile',   paceCue:'5K distance. Walking the finish is OK.', cadenceTip:true },
  { level:16, type:'race',       runMin:28,               rounds:1,  paceRange:'9:00/mile',         paceCue:'🏆 5K Goal — Run the full thing at 9:00/mile!', cadenceTip:true },
  // Post-5K — building toward 10K by Thanksgiving
  { level:17, type:'continuous', runMin:35,               rounds:1,  paceRange:'9:00–9:30/mile',   paceCue:'Beyond 5K! You are building toward 10K.', cadenceTip:true },
  { level:18, type:'continuous', runMin:40,               rounds:1,  paceRange:'9:00–9:30/mile',   paceCue:'Roughly 4 miles. Strong aerobic base building.', cadenceTip:true },
  { level:19, type:'continuous', runMin:45,               rounds:1,  paceRange:'9:00/mile',         paceCue:'5 miles. Stay comfortable.', cadenceTip:true },
  { level:20, type:'continuous', runMin:50,               rounds:1,  paceRange:'9:00/mile',         paceCue:'Approaching 10K distance. Stay steady.', cadenceTip:true },
  { level:21, type:'race',       runMin:56,               rounds:1,  paceRange:'9:00/mile',         paceCue:'🏆 10K Goal — Full 10K at 9:00/mile by Thanksgiving!', cadenceTip:true },
];

/* ── RUN DAY WARM-UP (Tue / Thu / Sat) ──────────── */
const RUN_WARMUP = [
  { id: 'rw_0', name: 'Leg swings forward/back',   sets: '10 each leg' },
  { id: 'rw_1', name: 'Leg swings side to side',   sets: '10 each leg' },
  { id: 'rw_2', name: 'Hip circles',               sets: '10 each direction' },
  { id: 'rw_3', name: 'Ankle circles',             sets: '10 each ankle' },
  { id: 'rw_4', name: 'Arm circles',               sets: '10 each direction' },
  { id: 'rw_5', name: 'Inchworm with push-up',     sets: '5 reps' },
];

/* ── COOL-DOWN (every day) ───────────────────────── */
const COOLDOWN = [
  { id: 'cd_0', name: 'Easy walk',                  sets: '90 sec' },
  { id: 'cd_1', name: 'Standing quad stretch',       sets: '30 sec each leg' },
  { id: 'cd_2', name: 'Standing calf / achilles stretch', sets: '30 sec each leg' },
  { id: 'cd_3', name: 'Hip flexor stretch (low lunge)',   sets: '30 sec each side' },
];

/* ── WEIGHT WORKOUTS ─────────────────────────────── */
const WORKOUTS = {
  monday: {
    name: 'Lower Body',
    tag: 'lower',
    goalTag: 'Glute & posterior chain power → faster, safer running',
    warmup: [
      { id: 'mon_wu_0', name: 'Squats',               sets: '10 reps' },
      { id: 'mon_wu_1', name: 'Rear Lunges',           sets: '6 each leg' },
      { id: 'mon_wu_2', name: 'Groin Stretch',         sets: '5 reps / hold each' },
      { id: 'mon_wu_3', name: 'Band Pulls',            sets: '20 / 20 / 10' },
      { id: 'mon_wu_4', name: 'Jump Shrugs',           sets: '3 × 3 × 3' },
    ],
    circuits: [
      {
        id: 'mon_c0', name: 'Circuit 1', sets: 3,
        exs: [
          { id: 'mon_c0_0', name: 'DB Squats',                   sets: '8 × 8 × 8',     note: 'Increase weight each set when ready' },
          { id: 'mon_c0_1', name: 'Daburs (KB)',                  sets: '10 reps',        note: 'Kettlebell sumo + upright row' },
          { id: 'mon_c0_2', name: 'Single-Arm Band Pull',         sets: '10 reps each',  note: 'Core stays square' },
          { id: 'mon_c0_3', name: 'Hip Flexor Stretch',           sets: '10 sec each',   note: 'Hold at bottom of lunge' },
          { id: 'mon_c0_4', name: 'Band Laterals',                sets: '20 × 2',        note: 'Glute med — keep knees soft' },
        ],
      },
      {
        id: 'mon_c1', name: 'Circuit 2', sets: 3,
        exs: [
          { id: 'mon_c1_0', name: 'DB Step Up Curl Press',        sets: '3 reps each leg', note: 'Step → curl → press in one flow' },
          { id: 'mon_c1_1', name: 'KB Deadlifts',                 sets: '8 reps',          note: 'Hinge at hips, neutral spine' },
          { id: 'mon_c1_2', name: 'DB Romanian Deadlift (RDL)',   sets: '8 reps',          note: 'Feel hamstring stretch' },
          { id: 'mon_c1_3', name: 'Val Slides — Hamstring Curl',  sets: '8 reps',          note: 'Slow on the extension' },
          { id: 'mon_c1_4', name: 'DB Calf Raises',               sets: '12 reps',         note: 'Slow down phase — achilles loading' },
        ],
      },
      {
        id: 'mon_c2', name: 'Circuit 3', sets: 3,
        exs: [
          { id: 'mon_c2_0', name: 'Single-Leg RDL',               sets: '8 each leg',    note: 'Balance focus — use wall if needed' },
          { id: 'mon_c2_1', name: 'Glute Bridge',                  sets: '15 reps',       note: 'Squeeze at top, slow lower' },
          { id: 'mon_c2_2', name: 'Side-Lying Clamshell (band)',   sets: '15 each side',  note: 'Hip stability for running' },
        ],
      },
    ],
    finisher: {
      id: 'mon_fin', name: 'Finisher', rounds: 3,
      exs: [
        { id: 'mon_fin_0', name: 'Squat Curl Press or Transformer', sets: '30 sec ON / 45 sec rest', note: 'Full effort for 30 seconds. Catch breath in the 45.' },
      ],
    },
    shortRun: true, // Show daily interval short run after weights
  },

  wednesday: {
    name: 'Upper Body',
    tag: 'upper',
    goalTag: 'Pull-up progression → 3 unassisted pull-ups by Dec 31',
    warmup: [
      { id: 'wed_wu_0', name: 'Squats',                             sets: '10 reps' },
      { id: 'wed_wu_1', name: 'Ankle Circles',                      sets: '20 reps' },
      { id: 'wed_wu_2', name: 'Band Pulls',                         sets: '20 / 20 / 10' },
      { id: 'wed_wu_3', name: 'Push-ups',                           sets: '3 reps (warm-up)' },
      { id: 'wed_wu_4', name: 'Pull-downs or assisted Pull-ups',    sets: '5 reps or max' },
      { id: 'wed_wu_5', name: 'Daburs (KB)',                        sets: '7 reps' },
      { id: 'wed_wu_6', name: 'Squats',                             sets: '5 reps' },
    ],
    circuits: [
      {
        id: 'wed_c0', name: 'Circuit 1', sets: 3,
        exs: [
          { id: 'wed_c0_0', name: 'DB Bench Press',                 sets: '8 × 8 × 8',    note: 'Increase weight when all 3 sets feel easy' },
          { id: 'wed_c0_1', name: 'Alternating DB Curls',           sets: '8 reps' },
          { id: 'wed_c0_2', name: 'SASH — Single-Arm Shoulder Press', sets: '6 each side' },
          { id: 'wed_c0_3', name: 'Anti-Rotation Pumps (band)',     sets: '10 each side',  note: 'Core stays square, punch out slowly' },
          { id: 'wed_c0_4', name: 'Push-ups',                       sets: '5 reps' },
        ],
      },
      {
        id: 'wed_c1', name: 'Circuit 2', sets: 3,
        exs: [
          { id: 'wed_c1_0', name: 'Band-Assisted Pull-ups',         sets: '3–5 reps',      note: 'Controlled — same form as PU block' },
          { id: 'wed_c1_1', name: 'DB Rows',                        sets: '8 each side' },
          { id: 'wed_c1_2', name: 'Band Pull-Apart',                sets: '15 reps',       note: 'Rear delt + rotator cuff health' },
          { id: 'wed_c1_3', name: 'Front Raises (DB)',              sets: '5 reps' },
          { id: 'wed_c1_4', name: 'Side Raises (DB)',               sets: '5 reps' },
        ],
      },
      {
        id: 'wed_c2', name: 'Circuit 3', sets: 3,
        exs: [
          { id: 'wed_c2_0', name: 'DB Rows',                        sets: '8 each side' },
          { id: 'wed_c2_1', name: 'Shrugs',                         sets: '10 reps' },
          { id: 'wed_c2_2', name: 'Tricep Overhead Extension',      sets: '10 reps' },
          { id: 'wed_c2_3', name: 'Face Pull (band)',               sets: '15 reps',       note: 'Pull toward forehead, elbows high' },
        ],
      },
    ],
    finisher: {
      id: 'wed_fin', name: 'Finisher', rounds: 3,
      exs: [
        { id: 'wed_fin_0', name: 'Push-up burnout', sets: 'Max reps / 30 sec rest', note: 'Go to near-failure each round. Hands can be elevated if needed.' },
      ],
    },
    shortRun: true,
  },

  friday: {
    name: 'Full Body',
    tag: 'full',
    goalTag: 'Compound strength → running efficiency + all-around fitness',
    warmup: [
      { id: 'fri_wu_0', name: 'Squats',        sets: '10 reps' },
      { id: 'fri_wu_1', name: 'Rear Lunges',   sets: '6 each leg' },
      { id: 'fri_wu_2', name: 'Groin Stretch', sets: 'Hold each side' },
      { id: 'fri_wu_3', name: 'Band Pulls',    sets: '20 / 20 / 10' },
      { id: 'fri_wu_4', name: 'KB Snatches',   sets: '5 each arm' },
    ],
    circuits: [
      {
        id: 'fri_c0', name: 'Circuit 1', sets: 3,
        exs: [
          { id: 'fri_c0_0', name: 'Sasquatch',                      sets: '10 reps',       note: 'Squat + curl + press in one movement' },
          { id: 'fri_c0_1', name: 'Pull-ups (assisted or unassisted)', sets: '3–5 reps',   note: 'Work toward more unassisted each week' },
          { id: 'fri_c0_2', name: 'Push-ups',                       sets: '5–10 reps' },
        ],
      },
      {
        id: 'fri_c1', name: 'Circuit 2', sets: 3,
        exs: [
          { id: 'fri_c1_0', name: 'Side Lunge Val Slides',          sets: '5 each side' },
          { id: 'fri_c1_1', name: 'Back Lunge Val Slides',          sets: '5 each side' },
          { id: 'fri_c1_2', name: 'Daburs (KB)',                    sets: '15 reps' },
          { id: 'fri_c1_3', name: 'DB Bench Press',                 sets: '8 / 6 / 4 reps', note: 'Increase weight each set' },
          { id: 'fri_c1_4', name: 'Hip Flexor Stretch',             sets: 'Hold each side' },
        ],
      },
      {
        id: 'fri_c2', name: 'Circuit 3', sets: 3,
        exs: [
          { id: 'fri_c2_0', name: 'KB Swing or DB Deadlift',        sets: '12 reps',       note: 'Hip hinge power — drive through heels' },
          { id: 'fri_c2_1', name: 'DB Reverse Lunge',               sets: '10 each leg',   note: 'Step back, control the knee' },
          { id: 'fri_c2_2', name: 'Plank',                          sets: '30–45 sec',     note: 'Hips level, core braced' },
          { id: 'fri_c2_3', name: 'Dead Bug',                       sets: '8 each side',   note: 'Slow — lower back stays flat on floor' },
        ],
      },
    ],
    finisher: {
      id: 'fri_fin', name: 'Finisher', rounds: 3,
      exs: [
        { id: 'fri_fin_0', name: 'DB Curls',           sets: '7 reps' },
        { id: 'fri_fin_1', name: 'Push-ups',           sets: '3 reps' },
        { id: 'fri_fin_2', name: 'Band Pull or Row',   sets: '3 reps',  note: 'Minimal rest between rounds' },
      ],
    },
    shortRun: true,
  },
};

/* ── TRAVEL MODE WORKOUTS ────────────────────────── */
const TRAVEL_WORKOUTS = {
  hotel: {
    name: 'Hotel Gym',
    desc: 'Hotel treadmill + limited dumbbells',
    warmup: [
      { id: 'htl_wu_0', name: 'Treadmill walk (incline 3–5%)', sets: '5 min' },
      { id: 'htl_wu_1', name: 'Squats',                        sets: '10 reps' },
      { id: 'htl_wu_2', name: 'Band Pulls (or arm circles)',   sets: '20 reps' },
    ],
    circuits: [
      {
        id: 'htl_c0', name: 'Circuit 1', sets: 3,
        exs: [
          { id: 'htl_c0_0', name: 'Goblet Squat (DB)',          sets: '12 reps' },
          { id: 'htl_c0_1', name: 'DB Row (each side)',          sets: '10 reps' },
          { id: 'htl_c0_2', name: 'Push-up',                    sets: '10 reps' },
          { id: 'htl_c0_3', name: 'DB RDL',                     sets: '10 reps' },
        ],
      },
      {
        id: 'htl_c1', name: 'Circuit 2', sets: 3,
        exs: [
          { id: 'htl_c1_0', name: 'DB Reverse Lunge',           sets: '10 each leg' },
          { id: 'htl_c1_1', name: 'DB Shoulder Press',          sets: '10 reps' },
          { id: 'htl_c1_2', name: 'DB Curl',                    sets: '10 reps' },
          { id: 'htl_c1_3', name: 'Plank',                      sets: '30–45 sec' },
        ],
      },
    ],
    finisher: {
      id: 'htl_fin', name: 'Finisher', rounds: 3,
      exs: [
        { id: 'htl_fin_0', name: 'Treadmill run (or fast walk)', sets: '2 min',    note: 'Push the pace for 2 minutes' },
      ],
    },
    shortRun: false,
  },
  bodyweight: {
    name: 'Bodyweight Only',
    desc: 'No equipment — anywhere workout',
    warmup: [
      { id: 'bw_wu_0', name: 'Jumping jacks',   sets: '30 sec' },
      { id: 'bw_wu_1', name: 'Squats',          sets: '10 reps' },
      { id: 'bw_wu_2', name: 'Arm circles',     sets: '20 reps' },
      { id: 'bw_wu_3', name: 'Inchworm',        sets: '5 reps' },
    ],
    circuits: [
      {
        id: 'bw_c0', name: 'Circuit 1', sets: 3,
        exs: [
          { id: 'bw_c0_0', name: 'Bodyweight Squat',      sets: '20 reps' },
          { id: 'bw_c0_1', name: 'Push-up',               sets: '10 reps' },
          { id: 'bw_c0_2', name: 'Reverse Lunge',         sets: '10 each leg' },
          { id: 'bw_c0_3', name: 'Plank',                 sets: '40 sec' },
        ],
      },
      {
        id: 'bw_c1', name: 'Circuit 2', sets: 3,
        exs: [
          { id: 'bw_c1_0', name: 'Glute Bridge',          sets: '20 reps' },
          { id: 'bw_c1_1', name: 'Tricep Push-up (elbows in)', sets: '8 reps' },
          { id: 'bw_c1_2', name: 'Side Lunge',            sets: '10 each side' },
          { id: 'bw_c1_3', name: 'Dead Bug',              sets: '8 each side' },
        ],
      },
    ],
    finisher: {
      id: 'bw_fin', name: 'Finisher', rounds: 3,
      exs: [
        { id: 'bw_fin_0', name: 'Burpee or Squat Jump', sets: '30 sec ON / 30 sec rest' },
      ],
    },
    shortRun: false,
  },
  runOnly: {
    name: 'Run Only',
    desc: 'Just the run — use your current interval level',
    warmup: RUN_WARMUP,
    circuits: [],
    finisher: null,
    shortRun: false,
  },
};

/* ── DAILY INTERVAL BASELINE ─────────────────────── */
// Mon/Wed/Fri short run grows by 20 sec each non-Sunday.
const DAILY_INTERVAL = {
  baselineYear: 2026,
  baselineMonth: 3,   // March (1-indexed)
  baselineDay: 28,    // Saturday March 28, 2026
  baselineSecs: 260,  // 4 min 20 sec
  incrementSecs: 20,
};

/* ── HELPER: compute today's first-interval duration ─ */
function getDailyIntervalSecs(date) {
  const { baselineYear, baselineMonth, baselineDay, baselineSecs, incrementSecs } = DAILY_INTERVAL;
  const baseline = new Date(baselineYear, baselineMonth - 1, baselineDay);
  const target   = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (target <= baseline) return baselineSecs;

  // Count non-Sunday days between baseline (inclusive) and target (exclusive)
  let days = 0;
  const cursor = new Date(baseline);
  cursor.setDate(cursor.getDate() + 1); // start day AFTER baseline (baseline already done)
  while (cursor <= target) {
    if (cursor.getDay() !== 0) days++;
    cursor.setDate(cursor.getDate() + 1);
  }
  return baselineSecs + days * incrementSecs;
}

function formatSecs(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return s === 0 ? `${m} min` : `${m}:${String(s).padStart(2,'0')}`;
}

function getDayType(date) {
  const dow = date.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  if (dow === 0) return 'rest';
  if (dow === 1) return 'monday';
  if (dow === 2) return 'tuesday';
  if (dow === 3) return 'wednesday';
  if (dow === 4) return 'thursday';
  if (dow === 5) return 'friday';
  if (dow === 6) return 'saturday';
}

// ─────────────────────────────────────────────────
//  ui.js  ·  All rendering functions
//  All functions return HTML strings.
//  State is read-only here; mutations happen in app.js.
// ─────────────────────────────────────────────────

/* ── ICONS ───────────────────────────────────────── */
const ICONS = {
  check: `<svg class="check-svg" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="2,6 5,9 10,3"/></svg>`,
  run:   '🏃‍♀️',
  lift:  '💪',
  rest:  '😴',
  ach:   '🦶',
  pu:    '🔝',
  fire:  '🔥',
  cool:  '🧊',
  check2:'✅',
  star:  '⭐',
  trophy:'🏆',
};

/* ── EXERCISE ITEM ───────────────────────────────── */
function renderExItem(dateKey, itemKey, ex, session, editMode) {
  const checked = !!(session.checks && session.checks[itemKey]);
  const checkedClass = checked ? 'checked' : '';
  const noteHtml = ex.note ? `<div class="ex-note">${ex.note}</div>` : '';
  const editBtn  = editMode
    ? `<button class="ex-edit-btn" data-action="edit-ex" data-key="${itemKey}" data-exid="${ex.id}">✏️ Edit</button>`
    : '';

  return `
    <div class="ex-item ${checkedClass}" data-action="toggle" data-date="${dateKey}" data-key="${itemKey}">
      <div class="ex-check">${ICONS.check}</div>
      <div class="ex-body">
        <div class="ex-name">${ex.name}</div>
        <div class="ex-sets">${ex.sets}</div>
        ${noteHtml}
      </div>
      ${editBtn}
    </div>
    <div class="ex-edit-form" id="edit-form-${itemKey}">
      <div class="form-row">
        <div>
          <label>Exercise name</label>
          <input type="text" data-field="name" value="${escHtml(ex.name)}" placeholder="Exercise name">
        </div>
        <div>
          <label>Sets / Reps</label>
          <input type="text" data-field="sets" value="${escHtml(ex.sets)}" placeholder="e.g. 3×10">
        </div>
      </div>
      <label>Note (optional)</label>
      <textarea data-field="note" placeholder="Coaching note…">${escHtml(ex.note || '')}</textarea>
      <div class="form-row">
        <button class="btn btn-primary btn-sm" data-action="save-ex" data-exid="${ex.id}" data-key="${itemKey}">Save</button>
        <button class="btn btn-danger btn-sm" data-action="delete-ex" data-exid="${ex.id}" data-key="${itemKey}">🗑 Delete</button>
        <button class="btn btn-secondary btn-sm" data-action="cancel-edit" data-key="${itemKey}">Cancel</button>
      </div>
    </div>`;
}

/* ── INLINE ADD FORM ─────────────────────────────── */
function renderAddForm(circuitId) {
  return `
    <div class="ex-edit-form" id="add-form-${circuitId}">
      <label>Exercise name</label>
      <input type="text" data-field="add-name" placeholder="e.g. Plank">
      <div class="form-row">
        <div>
          <label>Sets / Reps</label>
          <input type="text" data-field="add-sets" placeholder="e.g. 3×30 sec">
        </div>
      </div>
      <label>Note (optional)</label>
      <textarea data-field="add-note" placeholder="Coaching cue…"></textarea>
      <div class="form-row">
        <button class="btn btn-primary btn-sm" data-action="confirm-add-ex" data-circuitid="${circuitId}">Add Exercise</button>
        <button class="btn btn-secondary btn-sm" data-action="cancel-add-form" data-circuitid="${circuitId}">Cancel</button>
      </div>
    </div>`;
}

/* ── CIRCUIT BLOCK ───────────────────────────────── */
function renderCircuit(dateKey, circuit, session, customizations, editMode, headClass) {
  const resolved = resolveCircuit(circuit, customizations);
  const headCls  = headClass || 'circuit-head';
  let html = `<div class="${headCls}">${resolved.name}${resolved.sets ? ` — ${resolved.sets} sets` : ''}</div>`;
  html += `<div class="ex-list">`;
  resolved.exs.forEach((ex, i) => {
    const key = `${circuit.id}_${i}`;
    html += renderExItem(dateKey, key, ex, session, editMode);
  });
  html += `</div>`;

  if (editMode) {
    html += `<button class="add-ex-btn" data-action="show-add-form" data-circuitid="${circuit.id}">+ Add exercise</button>`;
    html += renderAddForm(circuit.id);
  }
  return html;
}

/* ── ACHILLES BLOCK ──────────────────────────────── */
function renderAchillesBlock(dateKey, session, customizations, editMode) {
  let html = `<div class="circuit-head achilles">${ICONS.ach} Achilles Care — do this every day while warm</div>`;
  html += `<div class="ex-list">`;
  resolveExList(ACHILLES_BLOCK, 'achilles', customizations).forEach((ex, i) => {
    html += renderExItem(dateKey, `ach_${i}`, ex, session, editMode);
  });
  html += `</div>`;
  if (editMode) {
    html += `<button class="add-ex-btn" data-action="show-add-form" data-circuitid="achilles">+ Add achilles exercise</button>`;
    html += renderAddForm('achilles');
  }
  return html;
}

/* ── PULL-UP BLOCK ───────────────────────────────── */
function renderPullupBlock(dateKey, puLevel, session, customizations, editMode) {
  const levelData  = PULLUP_LEVELS[puLevel - 1] || PULLUP_LEVELS[0];
  const puCircuitId = `pullup_${levelData.level}`;
  let html = `
    <div class="circuit-head pullup">
      ${ICONS.pu} Pull-Up Block
      <span class="badge badge-purple" style="font-size:0.65rem;">${levelData.label}</span>
    </div>
    <div style="font-size:0.73rem;color:var(--purple);margin:0.2rem 0 0.4rem;font-style:italic;">${levelData.desc}</div>
    <div class="ex-list">`;
  resolveExList(levelData.exercises, puCircuitId, customizations).forEach((ex, i) => {
    html += renderExItem(dateKey, `pu_${i}`, ex, session, editMode);
  });
  html += `</div>`;
  if (editMode) {
    html += `<button class="add-ex-btn" data-action="show-add-form" data-circuitid="${puCircuitId}">+ Add pull-up exercise</button>`;
    html += renderAddForm(puCircuitId);
  }
  return html;
}

/* ── COOL-DOWN BLOCK ─────────────────────────────── */
function renderCooldown(dateKey, session, customizations, editMode) {
  let html = `<div class="circuit-head" style="color:var(--gray-500);background:var(--gray-100);border-left-color:var(--gray-300);">
    ${ICONS.cool} Cool-Down</div>
  <div class="ex-list">`;
  resolveExList(COOLDOWN, 'cooldown', customizations).forEach((ex, i) => {
    html += renderExItem(dateKey, `cd_${i}`, ex, session, editMode);
  });
  html += `</div>`;
  if (editMode) {
    html += `<button class="add-ex-btn" data-action="show-add-form" data-circuitid="cooldown">+ Add cool-down item</button>`;
    html += renderAddForm('cooldown');
  }
  return html;
}

/* ── RUNNING LEVEL BLOCK ─────────────────────────── */
function renderRunBlock(dateKey, runLevel, session, isSaturday) {
  const levelIdx  = Math.min(runLevel + (isSaturday ? 1 : 0), RUNNING_LEVELS.length) - 1;
  const level     = RUNNING_LEVELS[levelIdx] || RUNNING_LEVELS[RUNNING_LEVELS.length - 1];
  const satBadge  = isSaturday ? ' <span class="badge badge-blue" style="font-size:0.62rem;">+1 SAT</span>' : '';

  let intervalContent = '';
  if (level.type === 'intervals') {
    const runSec  = level.runMin * 60;
    const walkSec = level.walkMin * 60;
    const runStr  = runSec % 60 === 0 ? `${level.runMin} min` : `${Math.floor(level.runMin)}:${String((runSec % 60)).padStart(2,'0')}`;
    const walkStr = walkSec % 60 === 0 ? `${level.walkMin} min` : `${Math.floor(level.walkMin)}:${String((walkSec % 60)).padStart(2,'0')}`;
    intervalContent = `
      <div class="run-interval-big">${runStr} run / ${walkStr} walk</div>
      <table class="interval-table">
        <tr><td>Rounds</td><td>${level.rounds}</td></tr>
        <tr><td>Pace zone</td><td>${level.paceRange}</td></tr>
      </table>`;
  } else if (level.type === 'continuous' || level.type === 'race') {
    intervalContent = `
      <div class="run-interval-big">${level.runMin} min continuous</div>
      <table class="interval-table">
        <tr><td>Pace zone</td><td>${level.paceRange}</td></tr>
      </table>`;
  }

  const key = 'run_main';
  const checked = !!(session.checks && session.checks[key]);
  const checkedClass = checked ? 'checked' : '';

  return `
    <div class="run-block">
      <div class="run-block-title">
        ${ICONS.run} Running Workout
        <span class="run-level-badge">Level ${level.level}</span>${satBadge}
      </div>
      ${intervalContent}
      <div class="run-pace-cue">${level.paceCue}</div>
      <div class="run-cadence">📏 Cadence tip: aim for 170–180 steps/min. Count one foot for 30 sec → target 85–90.</div>
      <div class="ex-item ${checkedClass} mt-1" style="background:rgba(255,255,255,0.6);border-radius:8px;"
           data-action="toggle" data-date="${dateKey}" data-key="${key}">
        <div class="ex-check">${ICONS.check}</div>
        <div class="ex-body"><div class="ex-name">Mark run complete</div></div>
      </div>
    </div>`;
}

/* ── RUN WARM-UP BLOCK ───────────────────────────── */
function renderRunWarmup(dateKey, session, customizations, editMode) {
  let html = `<div class="circuit-head" style="color:var(--green);background:var(--green-pale);border-left-color:var(--green-light);">
    🌿 Run Warm-Up</div><div class="ex-list">`;
  resolveExList(RUN_WARMUP, 'run_warmup', customizations).forEach((ex, i) => {
    html += renderExItem(dateKey, `rw_${i}`, ex, session, editMode);
  });
  html += `</div>`;
  if (editMode) {
    html += `<button class="add-ex-btn" data-action="show-add-form" data-circuitid="run_warmup">+ Add warm-up item</button>`;
    html += renderAddForm('run_warmup');
  }
  return html;
}

/* ── SHORT RUN (Mon/Wed/Fri) ─────────────────────── */
function renderShortRun(dateKey, dailyIntervalSecs, session) {
  const secs = dailyIntervalSecs || 300;
  const key = 'short_run';
  const checked = !!(session.checks && session.checks[key]);
  const checkedClass = checked ? 'checked' : '';
  return `
    <div class="s-div">Short Run — Daily Interval</div>
    <div class="short-run-block">
      <div style="flex:1;">
        <div class="short-run-dur">${formatSecs(secs)}</div>
        <div class="short-run-label">Single easy run • conversational pace</div>
        <div style="font-size:0.7rem;color:var(--gray-500);margin-top:0.15rem;">
          Hit Level Up to add 20 seconds when ready
        </div>
        <button class="btn btn-secondary btn-sm mt-1" data-action="level-up-daily"
          style="margin-top:0.4rem;">+20 sec ↑</button>
      </div>
      <div class="ex-item ${checkedClass}" style="min-width:130px;align-self:center;"
           data-action="toggle" data-date="${dateKey}" data-key="${key}">
        <div class="ex-check">${ICONS.check}</div>
        <div class="ex-body"><div class="ex-name">Mark run done</div></div>
      </div>
    </div>`;
}

/* ── TRAVEL BANNER ───────────────────────────────── */
function renderTravelBanner(settings) {
  const types = [
    { key: 'hotel',      label: '🏨 Hotel Gym' },
    { key: 'bodyweight', label: '🤸 Bodyweight' },
    { key: 'runonly',    label: '🏃 Run Only' },
  ];
  const typeBtns = types.map(t =>
    `<button class="travel-type-btn ${settings.travelType === t.key ? 'active' : ''}"
       data-action="set-travel-type" data-type="${t.key}">${t.label}</button>`
  ).join('');
  return `
    <div class="travel-banner">
      <div>
        <div class="travel-banner-label">✈️ Travel Mode</div>
        <div class="travel-type-row">${typeBtns}</div>
      </div>
      <button class="btn btn-secondary btn-sm" data-action="toggle-travel">Exit Travel Mode</button>
    </div>`;
}

/* ── ─────────────────────────────────────────────── */
/*    TODAY VIEW                                       */
/* ─────────────────────────────────────────────────── */
function renderToday(state) {
  const today     = new Date();
  const dateKey   = localDateKey(today);
  const session   = getOrCreateSession(state, dateKey);
  const dayType   = getDayType(today);
  const editMode  = state.editMode || false;
  const travel    = state.settings.travelMode;

  // Day info
  const dayNames  = { monday:'Monday', tuesday:'Tuesday', wednesday:'Wednesday',
                      thursday:'Thursday', friday:'Friday', saturday:'Saturday', rest:'Sunday' };
  const dayName   = dayNames[dayType] || '';
  const dateStr   = today.toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });

  let html = '';

  // Completed banner
  if (session.completed) {
    html += `<div class="complete-banner">
      <h2>${ICONS.check2} Day Complete!</h2>
      <p>${dateStr} — great work</p>
    </div>`;
  }

  // Travel mode banner
  if (travel) {
    html += renderTravelBanner(state.settings);
  }

  // Rest day
  if (dayType === 'rest') {
    html += `<div class="card">
      <div class="card-title">${ICONS.rest} Sunday Rest Day</div>
      <div class="card-sub">Recovery is part of training. Walk, stretch, or just relax.</div>
    </div>`;
    return html;
  }

  // Day header card
  const isWeightDay   = ['monday','wednesday','friday'].includes(dayType);
  const isRunDay      = ['tuesday','thursday'].includes(dayType);
  const isSaturday    = dayType === 'saturday';
  const workoutDef    = WORKOUTS[dayType];
  const travelDef     = travel ? TRAVEL_WORKOUTS[state.settings.travelType || 'hotel'] : null;
  const activeDef     = travelDef || workoutDef;

  let typeLabel = '';
  if (isWeightDay)      typeLabel = `${ICONS.lift} ${workoutDef.name} + Short Run`;
  else if (isRunDay)    typeLabel = `${ICONS.run} Interval Run — Level ${state.progress.runningLevel}`;
  else if (isSaturday)  typeLabel = `${ICONS.run} Interval Run — Level ${Math.min(state.progress.runningLevel + 1, RUNNING_LEVELS.length)} (Saturday boost)`;

  html += `<div class="card">
    <div class="flex-between mb-1">
      <div>
        <div class="card-label">${dateStr}</div>
        <div class="card-title">${typeLabel}</div>
        ${workoutDef ? `<div style="font-size:0.73rem;color:var(--gray-500);margin-top:0.15rem;">${workoutDef.goalTag || ''}</div>` : ''}
      </div>
      ${!session.completed ? `<button class="btn btn-primary btn-sm" data-action="complete-day" data-date="${dateKey}">Mark Complete</button>` : ''}
    </div>
    <div class="flex-between flex-gap">
      <label class="toggle-wrap" data-action="toggle-travel">
        <div class="toggle ${travel ? 'on' : ''}"></div>
        <span class="toggle-label text-sm">Travel Mode</span>
      </label>
    </div>
  </div>`;

  /* ── WEIGHT DAYS (Mon/Wed/Fri) ─── */
  if (isWeightDay && !travel) {
    html += `<div class="card">`;

    // Warm-up
    const wuCircuitId = `${dayType}_warmup`;
    html += `<div class="s-div">${ICONS.lift} Warm-Up</div><div class="ex-list">`;
    resolveExList(workoutDef.warmup, wuCircuitId, state.customizations).forEach((ex, i) => {
      html += renderExItem(dateKey, `wu_${i}`, ex, session, editMode);
    });
    html += `</div>`;
    if (editMode) {
      html += `<button class="add-ex-btn" data-action="show-add-form" data-circuitid="${wuCircuitId}">+ Add warm-up item</button>`;
      html += renderAddForm(wuCircuitId);
    }

    // Achilles block
    html += `<div class="s-div">${ICONS.ach} Achilles Care</div>`;
    html += renderAchillesBlock(dateKey, session, state.customizations, editMode);

    // Pull-up block
    html += `<div class="s-div">${ICONS.pu} Pull-Up Block</div>`;
    html += renderPullupBlock(dateKey, state.progress.pullupLevel, session, state.customizations, editMode);

    // Weight circuits
    html += `<div class="s-div">Weight Circuits</div>`;
    workoutDef.circuits.forEach(circuit => {
      html += renderCircuit(dateKey, circuit, session, state.customizations, editMode);
    });

    // Finisher
    if (workoutDef.finisher) {
      html += renderCircuit(dateKey, workoutDef.finisher, session, state.customizations, editMode, 'circuit-head finisher');
    }

    // Short run
    html += renderShortRun(dateKey, state.progress.dailyIntervalSecs, session);

    // Cool-down
    html += `<div class="s-div">${ICONS.cool} Cool-Down</div>`;
    html += renderCooldown(dateKey, session, state.customizations, editMode);

    html += `</div>`;  // end .card
  }

  /* ── TRAVEL WEIGHT DAY ──────────── */
  if (isWeightDay && travel && travelDef && state.settings.travelType !== 'runonly') {
    html += `<div class="card">`;
    html += `<div class="s-div">Warm-Up</div><div class="ex-list">`;
    travelDef.warmup.forEach((ex, i) => {
      html += renderExItem(dateKey, `twu_${i}`, ex, session, editMode);
    });
    html += `</div>`;
    html += renderAchillesBlock(dateKey, session, state.customizations, editMode);
    html += `<div class="s-div">Pull-Up Block</div>`;
    html += renderPullupBlock(dateKey, state.progress.pullupLevel, session, state.customizations, editMode);
    html += `<div class="s-div">Circuits</div>`;
    travelDef.circuits.forEach(circuit => {
      html += renderCircuit(dateKey, circuit, session, state.customizations, editMode);
    });
    if (travelDef.finisher) {
      html += renderCircuit(dateKey, travelDef.finisher, session, state.customizations, editMode, 'circuit-head finisher');
    }
    html += renderCooldown(dateKey, session, state.customizations, editMode);
    html += `</div>`;
  }

  /* ── RUN DAYS (Tue/Thu) ─────────── */
  if (isRunDay) {
    html += `<div class="card">`;
    html += renderRunWarmup(dateKey, session, state.customizations, editMode);
    html += renderAchillesBlock(dateKey, session, state.customizations, editMode);
    html += renderPullupBlock(dateKey, state.progress.pullupLevel, session, state.customizations, editMode);
    html += `<div class="s-div">${ICONS.run} Interval Run</div>`;
    html += renderRunBlock(dateKey, state.progress.runningLevel, session, false);
    html += `<div class="s-div">${ICONS.cool} Cool-Down</div>`;
    html += renderCooldown(dateKey, session, state.customizations, editMode);
    html += `</div>`;
  }

  /* ── SATURDAY ───────────────────── */
  if (isSaturday) {
    html += `<div class="card">`;
    html += renderRunWarmup(dateKey, session, state.customizations, editMode);
    html += renderAchillesBlock(dateKey, session, state.customizations, editMode);
    html += renderPullupBlock(dateKey, state.progress.pullupLevel, session, state.customizations, editMode);
    html += `<div class="s-div">${ICONS.run} Saturday Run (one level ahead)</div>`;
    html += renderRunBlock(dateKey, state.progress.runningLevel, session, true);
    html += `<div class="s-div">${ICONS.cool} Cool-Down</div>`;
    html += renderCooldown(dateKey, session, state.customizations, editMode);
    html += `</div>`;
  }

  /* ── RUN ONLY TRAVEL ────────────── */
  if (travel && state.settings.travelType === 'runonly') {
    html += `<div class="card">`;
    html += renderRunWarmup(dateKey, session, state.customizations, editMode);
    html += renderAchillesBlock(dateKey, session, state.customizations, editMode);
    html += renderPullupBlock(dateKey, state.progress.pullupLevel, session, state.customizations, editMode);
    html += `<div class="s-div">${ICONS.run} Run</div>`;
    html += renderRunBlock(dateKey, state.progress.runningLevel, session, isSaturday);
    html += renderCooldown(dateKey, session, state.customizations, editMode);
    html += `</div>`;
  }

  // Notes
  html += `<div class="card">
    <div class="card-label">Session Notes</div>
    <textarea class="notes-area" data-action="save-notes" data-date="${dateKey}"
      placeholder="How did it go? Any pain, modifications, personal records…">${escHtml(session.notes || '')}</textarea>
  </div>`;

  return html;
}

/* ── ─────────────────────────────────────────────── */
/*    PROGRESS VIEW                                    */
/* ─────────────────────────────────────────────────── */
function renderProgress(state) {
  const runLevel  = state.progress.runningLevel;
  const puLevel   = state.progress.pullupLevel;
  const runData   = RUNNING_LEVELS[runLevel - 1] || RUNNING_LEVELS[0];
  const puData    = PULLUP_LEVELS[puLevel - 1] || PULLUP_LEVELS[0];

  const runSessions = state.progress.runLevelSessions;
  const puSessions  = state.progress.puLevelSessions;
  const minRunSessions = RUNNING_LEVELS[runLevel - 1]?.minSessions || 4;
  const minPuSessions  = puData.minSessions;

  const canRunUp = canLevelUpRun(state);
  const canPuUp  = canLevelUpPullup(state);

  const runPct = canRunUp ? 100 : Math.min(100, Math.round((runSessions / minRunSessions) * 100));
  const puPct  = canPuUp  ? 100 : Math.min(100, Math.round((puSessions  / minPuSessions)  * 100));

  // Goals countdown
  const fiveKDate  = new Date(2026, 7, 29); // Aug 29
  const tenKDate   = new Date(2026, 10, 26);// Thanksgiving ~Nov 26
  const pullupDate = new Date(2026, 11, 31);// Dec 31
  const today = new Date();
  const daysTo5K  = Math.ceil((fiveKDate  - today) / 86400000);
  const daysTo10K = Math.ceil((tenKDate   - today) / 86400000);
  const daysToPU  = Math.ceil((pullupDate - today) / 86400000);

  let html = '';

  // Goal countdown cards
  html += `<div class="goals-grid">
    <div class="goal-card">
      <div class="goal-card-label">5K Goal</div>
      <div class="goal-card-value" style="color:var(--green)">${Math.max(0,daysTo5K)}d</div>
      <div class="goal-card-sub">Aug 29 · 9:00/mile</div>
    </div>
    <div class="goal-card">
      <div class="goal-card-label">10K Goal</div>
      <div class="goal-card-value" style="color:var(--blue)">${Math.max(0,daysTo10K)}d</div>
      <div class="goal-card-sub">Thanksgiving · 9:00/mile</div>
    </div>
    <div class="goal-card">
      <div class="goal-card-label">Pull-Up Goal</div>
      <div class="goal-card-value" style="color:var(--purple)">${Math.max(0,daysToPU)}d</div>
      <div class="goal-card-sub">Dec 31 · 3 unassisted</div>
    </div>
    <div class="goal-card">
      <div class="goal-card-label">Daily Interval</div>
      <div class="goal-card-value" style="color:var(--gray-700)">${formatSecs(state.progress.dailyIntervalSecs || 300)}</div>
      <div class="goal-card-sub">Mon/Wed/Fri short run <button class="btn btn-secondary btn-sm" data-action="level-up-daily" style="margin-left:0.4rem;">+20 sec</button></div>
    </div>
  </div>`;

  // Running level card
  html += `<div class="card">
    <div class="card-label">${ICONS.run} Running Level</div>
    <div class="card-title">Level ${runLevel} of ${RUNNING_LEVELS.length} — ${runData.type === 'race' ? '🏆 Race' : runData.type === 'continuous' ? 'Continuous' : 'Intervals'}</div>
    <div class="card-sub">
      ${runData.type === 'intervals'
        ? `${runData.runMin} min run / ${runData.walkMin} min walk × ${runData.rounds} rounds`
        : `${runData.runMin} min continuous`}
      &nbsp;·&nbsp; ${runData.paceRange}
    </div>
    <div class="bar-track"><div class="bar-fill blue" style="width:${runPct}%"></div></div>
    <div class="level-up-row">
      <span class="level-sessions-note">${runSessions} / ${minRunSessions} sessions at this level</span>
      <button class="btn btn-primary btn-sm" data-action="level-up-run" ${canRunUp ? '' : 'disabled'}>
        Level Up ${canRunUp ? '↑' : `(${minRunSessions - runSessions} more)`}
      </button>
    </div>
  </div>`;

  // Pull-up level card
  html += `<div class="card">
    <div class="card-label">${ICONS.pu} Pull-Up Level</div>
    <div class="card-title">${puData.label} — ${puData.desc}</div>
    <div class="card-sub">Today: ${puData.exercises.map(e => e.name).join(' → ')}</div>
    <div class="bar-track"><div class="bar-fill purple" style="width:${puPct}%"></div></div>
    <div class="level-up-row">
      <span class="level-sessions-note">${puSessions} / ${minPuSessions} sessions at this level</span>
      <button class="btn btn-primary btn-sm" data-action="level-up-pullup" ${canPuUp ? '' : 'disabled'}>
        Level Up ${canPuUp ? '↑' : `(${minPuSessions - puSessions} more)`}
      </button>
    </div>
  </div>`;

  // All running levels table
  html += `<div class="card">
    <div class="card-label">Running Level Map</div>
    <div style="overflow-x:auto;">
    <table class="interval-table" style="margin-top:0.25rem;">
      <tr style="background:var(--gray-50);">
        <td style="font-weight:700;color:var(--gray-700);">Lvl</td>
        <td style="font-weight:700;color:var(--gray-700);">Interval</td>
        <td style="font-weight:700;color:var(--gray-700);">Pace</td>
      </tr>`;
  RUNNING_LEVELS.forEach(lvl => {
    const isCurrent = lvl.level === runLevel;
    const done = lvl.level < runLevel;
    const style = isCurrent ? 'background:var(--blue-pale);font-weight:700;' : done ? 'color:var(--gray-400);' : '';
    const prefix = isCurrent ? '▶ ' : done ? '✓ ' : '';
    let intervalStr = '';
    if (lvl.type === 'intervals')   intervalStr = `${lvl.runMin}m on / ${lvl.walkMin}m off × ${lvl.rounds}`;
    else if (lvl.type === 'race')   intervalStr = `🏆 ${lvl.runMin} min`;
    else                            intervalStr = `${lvl.runMin} min continuous`;
    html += `<tr style="${style}">
      <td>${prefix}${lvl.level}</td>
      <td>${intervalStr}</td>
      <td>${lvl.paceRange}</td>
    </tr>`;
  });
  html += `</table></div></div>`;

  // Milestones
  const ms = state.milestones;
  html += `<div class="card">
    <div class="card-label">Milestones</div>
    ${renderMilestone('First unassisted pull-up 🎉', ms.firstUnassistedPullup, 'first-pu')}
    ${renderMilestone('3 unassisted pull-ups 🏆', ms.threeUnassistedPullups, 'three-pu')}
    ${renderMilestone('5K complete 🏆', ms.fiveKComplete, 'five-k')}
    ${renderMilestone('10K complete 🏆', ms.tenKComplete, 'ten-k')}
  </div>`;

  return html;
}

function renderMilestone(label, achievedDate, key) {
  const done = !!achievedDate;
  const dateStr = achievedDate ? ` · ${new Date(achievedDate).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}` : '';
  return `<div class="milestone-item ${done ? 'done' : ''}">
    <div class="milestone-check">${done ? '✓' : ''}</div>
    <span class="milestone-label">${label}</span>
    <span class="milestone-date">${dateStr}</span>
    ${!done ? `<button class="btn btn-secondary btn-sm" data-action="mark-milestone" data-key="${key}">Mark ✓</button>` : ''}
  </div>`;
}

/* ── ─────────────────────────────────────────────── */
/*    HISTORY VIEW                                     */
/* ─────────────────────────────────────────────────── */
function renderHistory(state) {
  const entries = Object.entries(state.sessions)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 60); // last 60 days

  if (entries.length === 0) {
    return `<div class="card text-center" style="color:var(--gray-400);padding:2rem;">
      No sessions logged yet. Check off exercises in Today to get started!
    </div>`;
  }

  let html = `<div class="card-label" style="margin-bottom:0.5rem;">Last ${entries.length} sessions</div>`;
  entries.forEach(([dateKey, session]) => {
    const d = new Date(dateKey + 'T12:00:00'); // noon local to avoid timezone shift
    const dayName = d.toLocaleDateString('en-US', { weekday:'short' });
    const dateStr = d.toLocaleDateString('en-US', { month:'short', day:'numeric' });
    const checkCount = Object.values(session.checks || {}).filter(Boolean).length;
    const completedBadge = session.completed
      ? `<span class="badge badge-green">Done</span>` : '';
    const dayType = getDayType(d);
    const typeLabels = { monday:'Lower Body', wednesday:'Upper Body', friday:'Full Body',
                         tuesday:'Run', thursday:'Run', saturday:'Run+', rest:'Rest' };
    const typeLabel = typeLabels[dayType] || '';

    html += `<div class="history-item">
      <div class="history-date">${dayName} ${dateStr}</div>
      <div class="history-type">${typeLabel}</div>
      <div class="history-checks">${checkCount > 0 ? `${checkCount} ✓` : ''}</div>
      ${completedBadge}
    </div>`;
    if (session.notes) {
      html += `<div style="font-size:0.75rem;color:var(--gray-500);padding:0.25rem 1rem 0.5rem;font-style:italic;">
        ${escHtml(session.notes)}
      </div>`;
    }
  });

  return html;
}

/* ── ─────────────────────────────────────────────── */
/*    SETTINGS VIEW                                    */
/* ─────────────────────────────────────────────────── */
function renderSettings(state) {
  const { gistToken, gistId } = state.settings;
  return `
    <div class="settings-section">
      <h3>📡 Cross-Device Sync (GitHub Gist)</h3>
      <p class="text-sm text-muted mb-1">Your data is saved locally. Add a GitHub token to sync across phone and computer.</p>

      <div class="field">
        <label>GitHub Personal Access Token</label>
        <input type="password" id="gist-token" value="${escHtml(gistToken)}"
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx">
        <div class="hint">
          Create one at github.com → Settings → Developer settings → Personal access tokens → Fine-grained.
          Required scope: <strong>Gist (read/write)</strong>.
        </div>
      </div>

      <div class="field">
        <label>Gist ID <span style="font-weight:400;color:var(--gray-400)">(auto-filled after first sync)</span></label>
        <input type="text" id="gist-id" value="${escHtml(gistId)}"
          placeholder="Leave blank to create a new Gist">
      </div>

      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
        <button class="btn btn-primary" data-action="save-gist-settings">Save & Sync Now</button>
        <button class="btn btn-secondary" data-action="load-from-gist">Pull from Gist</button>
      </div>
      <div id="sync-status" class="sync-status hidden"></div>
    </div>

    <div class="settings-section">
      <h3>🗑️ Data</h3>
      <p class="text-sm text-muted mb-1">
        <strong>Reset exercises</strong> clears any edits you've made to workouts (added/deleted exercises) but keeps your sessions and progress.
      </p>
      <button class="btn btn-secondary" data-action="reset-customizations" style="margin-bottom:0.75rem;">Reset Exercises to Defaults</button>
      <hr style="border:none;border-top:1px solid var(--gray-200);margin:0.75rem 0;">
      <p class="text-sm text-muted mb-1"><strong>Reset all</strong> clears everything including session history and progress. Your Gist token is kept.</p>
      <button class="btn btn-danger" data-action="reset-data" id="reset-data-btn">Reset All Data</button>
      <button class="btn btn-danger hidden" data-action="confirm-reset-data" id="reset-confirm-btn">⚠️ Tap again to confirm — this cannot be undone</button>
    </div>

    <div class="settings-section">
      <h3>📋 About</h3>
      <p class="text-sm text-muted">
        Madaleine's Fitness Tracker · Goals: 5K by Aug 29 · 10K by Thanksgiving · 3 pull-ups by Dec 31<br>
        Data lives in your browser (localStorage) and optionally in a private GitHub Gist.
      </p>
    </div>`;
}

/* ── UTILITY ─────────────────────────────────────── */
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

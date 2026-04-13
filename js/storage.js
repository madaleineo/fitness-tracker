// ─────────────────────────────────────────────────
//  storage.js  ·  State management, localStorage,
//               and GitHub Gist cross-device sync
// ─────────────────────────────────────────────────

const STORAGE_KEY = 'fittracker_v1';
const GIST_FILENAME = 'fittracker_data.json';

/* ── DEFAULT STATE ───────────────────────────────── */
function defaultState() {
  return {
    version: 1,
    lastSaved: null,

    progress: {
      runningLevel: 4,      // Current Tue/Thu level (1–21)
      pullupLevel: 1,       // Current PU level (1–10)
      runLevelSessions: 0,  // Sessions completed at current running level
      puLevelSessions: 0,   // Sessions completed at current PU level
      dailyIntervalSecs: 300, // Mon/Wed/Fri short run — starts at 5:00, +20 sec per manual Level Up
    },

    sessions: {
      // 'YYYY-MM-DD': { checks: {key: bool}, completed: bool, notes: '' }
    },

    milestones: {
      firstUnassistedPullup: null,
      threeUnassistedPullups: null,
      fiveKComplete: null,
      tenKComplete: null,
    },

    settings: {
      gistToken: '',
      gistId: '',
      travelMode: false,
      travelType: 'hotel', // 'hotel' | 'bodyweight' | 'runonly'
    },

    // User overrides to workout data
    // exercises: { 'exercise_id': { name, sets, note, deleted } }
    // additions: { 'circuit_id': [{ id, name, sets, note }] }
    customizations: {
      exercises: {},
      additions: {},
    },
  };
}

/* ── LOCAL STORAGE ───────────────────────────────── */
function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    // Merge with defaults to handle new keys added in updates
    return deepMerge(defaultState(), parsed);
  } catch (e) {
    console.warn('Failed to load local state:', e);
    return defaultState();
  }
}

function saveLocal(state) {
  try {
    state.lastSaved = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save local state:', e);
  }
}

/* ── GITHUB GIST SYNC ────────────────────────────── */
async function syncToGist(state) {
  const { gistToken, gistId } = state.settings;
  if (!gistToken) return { success: false, error: 'No token configured' };

  // Strip the token before writing to Gist — GitHub secret scanning will
  // revoke any PAT it finds in Gist content, which makes the token appear
  // to "expire after one use". The token lives only in localStorage.
  const stateToSync = { ...state, settings: { ...state.settings, gistToken: '' } };
  const content = JSON.stringify(stateToSync, null, 2);

  try {
    if (gistId) {
      // Update existing Gist
      const res = await fetch(`https://api.github.com/gists/${gistId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `token ${gistToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
          files: { [GIST_FILENAME]: { content } },
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { success: false, error: err.message || res.statusText };
      }
      return { success: true };
    } else {
      // Create new private Gist
      const res = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: {
          'Authorization': `token ${gistToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
          description: 'Madaleine Fitness Tracker — auto-sync data',
          public: false,
          files: { [GIST_FILENAME]: { content } },
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { success: false, error: err.message || res.statusText };
      }
      const data = await res.json();
      return { success: true, gistId: data.id };
    }
  } catch (e) {
    return { success: false, error: e.message };
  }
}

async function loadFromGist(gistToken, gistId) {
  if (!gistToken || !gistId) return { data: null, error: 'Missing token or Gist ID' };
  try {
    const res = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        'Authorization': `token ${gistToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { data: null, error: `${res.status}: ${err.message || res.statusText}` };
    }
    const data = await res.json();
    const file = data.files[GIST_FILENAME];
    if (!file) return { data: null, error: `File "${GIST_FILENAME}" not found in Gist` };
    return { data: JSON.parse(file.content), error: null };
  } catch (e) {
    console.warn('Failed to load from Gist:', e);
    return { data: null, error: e.message };
  }
}

// Merge: remote wins if it's newer, but sessions are unioned (never lose local work)
function mergeStates(local, remote) {
  if (!remote) return local;

  const localTime  = local.lastSaved  ? new Date(local.lastSaved).getTime()  : 0;
  const remoteTime = remote.lastSaved ? new Date(remote.lastSaved).getTime() : 0;

  // Use whichever is newer as the base, but union all sessions
  const base = remoteTime > localTime ? remote : local;

  // Union sessions — keep all completed session data from both
  const sessions = Object.assign({}, local.sessions, remote.sessions);
  // For sessions present in both, prefer the one with more checks done
  for (const [date, localSess] of Object.entries(local.sessions)) {
    const remoteSess = remote.sessions[date];
    if (remoteSess) {
      sessions[date] = {
        ...localSess,
        ...remoteSess,
        checks: Object.assign({}, localSess.checks, remoteSess.checks),
        completed: localSess.completed || remoteSess.completed,
      };
    }
  }

  // Always preserve the local token — remote state never stores it
  return { ...base, sessions, settings: { ...base.settings, gistToken: local.settings.gistToken } };
}

/* ── DEBOUNCED GIST SYNC ─────────────────────────── */
let syncTimer = null;
function scheduleSyncToGist(state, onResult) {
  clearTimeout(syncTimer);
  syncTimer = setTimeout(async () => {
    if (!state.settings.gistToken) return;
    const result = await syncToGist(state);
    if (result.success && result.gistId) {
      state.settings.gistId = result.gistId;
      saveLocal(state);
    }
    if (onResult) onResult(result);
  }, 2000); // 2-second debounce
}

/* ── FLAT EXERCISE LIST RESOLVER ─────────────────── */
// Like resolveCircuit but for non-circuit blocks (achilles, pullup, warmup, cooldown).
// Applies customization overrides, filters deleted, and appends user additions.
function resolveExList(exercises, circuitId, customizations) {
  const cust = customizations || { exercises: {}, additions: {} };
  const resolved = exercises
    .map(ex => resolveExercise(ex, cust))
    .filter(ex => !ex.deleted);
  const additions = ((cust.additions || {})[circuitId] || [])
    .map(ex => resolveExercise(ex, cust))
    .filter(ex => !ex.deleted);
  return [...resolved, ...additions];
}

/* ── DATE HELPERS ────────────────────────────────── */
function todayKey() {
  const d = new Date();
  return localDateKey(d);
}

function localDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getOrCreateSession(state, dateKey) {
  if (!state.sessions[dateKey]) {
    state.sessions[dateKey] = { checks: {}, completed: false, notes: '' };
  }
  return state.sessions[dateKey];
}

/* ── LEVEL UP LOGIC ──────────────────────────────── */
function canLevelUpRun(state) {
  const current = state.progress.runningLevel;
  const level = RUNNING_LEVELS[current - 1];
  if (!level) return false;
  const minSessions = level.minSessions || 4;
  return state.progress.runLevelSessions >= minSessions;
}

function canLevelUpPullup(state) {
  const current = state.progress.pullupLevel;
  const level = PULLUP_LEVELS[current - 1];
  if (!level) return false;
  return state.progress.puLevelSessions >= level.minSessions;
}

function levelUpRun(state) {
  if (state.progress.runningLevel < RUNNING_LEVELS.length) {
    state.progress.runningLevel++;
    state.progress.runLevelSessions = 0;
  }
}

function levelUpPullup(state) {
  if (state.progress.pullupLevel < PULLUP_LEVELS.length) {
    state.progress.pullupLevel++;
    state.progress.puLevelSessions = 0;
  }
}

/* ── EXERCISE RESOLUTION ─────────────────────────── */
// Merge static data with user customizations
function resolveExercise(ex, customizations) {
  const override = customizations.exercises[ex.id];
  if (!override) return ex;
  return { ...ex, ...override };
}

function resolveCircuit(circuit, customizations) {
  const resolved = {
    ...circuit,
    exs: circuit.exs
      .map(ex => resolveExercise(ex, customizations))
      .filter(ex => !ex.deleted),
  };
  // Add any user-added exercises (also filtered for deletions)
  const additions = ((customizations.additions || {})[circuit.id] || [])
    .map(ex => resolveExercise(ex, customizations))
    .filter(ex => !ex.deleted);
  resolved.exs = [...resolved.exs, ...additions];
  return resolved;
}

/* ── UTILITY ─────────────────────────────────────── */
function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] !== null &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      target[key] !== null &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(target[key], source[key]);
    } else if (source[key] !== undefined) {
      result[key] = source[key];
    }
  }
  return result;
}

function countChecked(session) {
  return Object.values(session.checks || {}).filter(Boolean).length;
}

function totalCheckboxes(sections) {
  // sections is an array of arrays of exercise IDs
  return sections.flat().length;
}

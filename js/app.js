// ─────────────────────────────────────────────────
//  app.js  ·  State management, navigation, events
// ─────────────────────────────────────────────────

/* ── STATE ───────────────────────────────────────── */
let STATE = defaultState();

/* ── NAVIGATION ──────────────────────────────────── */
let currentView = 'today';

function navigateTo(view) {
  currentView = view;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const viewEl = document.getElementById(`view-${view}`);
  const navEl  = document.querySelector(`[data-nav="${view}"]`);
  if (viewEl) viewEl.classList.add('active');
  if (navEl)  navEl.classList.add('active');
  refreshView(view);
}

function refreshView(view) {
  const el = document.getElementById(`view-${view}`);
  if (!el) return;
  switch (view) {
    case 'today':    el.innerHTML = renderToday(STATE);    break;
    case 'progress': el.innerHTML = renderProgress(STATE); break;
    case 'history':  el.innerHTML = renderHistory(STATE);  break;
    case 'settings': el.innerHTML = renderSettings(STATE); break;
  }
  // Apply edit mode class to body
  if (STATE.editMode) {
    document.body.classList.add('edit-mode');
  } else {
    document.body.classList.remove('edit-mode');
  }
}

function refreshCurrent() {
  refreshView(currentView);
}

/* ── PERSIST & SYNC ──────────────────────────────── */
function saveAndSync() {
  saveLocal(STATE);
  scheduleSyncToGist(STATE, (result) => {
    if (!result.success) {
      console.warn('Gist sync failed:', result.error);
    }
  });
}

/* ── EVENT DELEGATION ────────────────────────────── */
document.addEventListener('click', handleClick);
document.addEventListener('change', handleChange);
document.addEventListener('input', handleInput);

function handleClick(e) {
  // Find closest element with data-action
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;

  switch (action) {

    // ── Toggle exercise checkbox ──
    case 'toggle': {
      const dateKey = el.dataset.date;
      const key     = el.dataset.key;
      const session = getOrCreateSession(STATE, dateKey);
      session.checks[key] = !session.checks[key];
      // Increment session count when run_main or short_run is checked
      if ((key === 'run_main' || key === 'short_run') && session.checks[key]) {
        const today = new Date();
        const todayKey_ = localDateKey(today);
        if (dateKey === todayKey_) {
          const dayType = getDayType(today);
          if (['tuesday','thursday','saturday'].includes(dayType)) {
            STATE.progress.runLevelSessions++;
          }
          STATE.progress.puLevelSessions++;
        }
      }
      saveAndSync();
      refreshCurrent();
      break;
    }

    // ── Mark day complete ──
    case 'complete-day': {
      const dateKey = el.dataset.date;
      const session = getOrCreateSession(STATE, dateKey);
      session.completed = true;
      saveAndSync();
      refreshCurrent();
      break;
    }

    // ── Level up daily interval (+20 sec) ──
    case 'level-up-daily': {
      STATE.progress.dailyIntervalSecs = (STATE.progress.dailyIntervalSecs || 300) + 20;
      saveAndSync();
      refreshCurrent();
      break;
    }

    // ── Travel mode ──
    case 'toggle-travel': {
      STATE.settings.travelMode = !STATE.settings.travelMode;
      saveAndSync();
      refreshCurrent();
      break;
    }
    case 'set-travel-type': {
      STATE.settings.travelType = el.dataset.type;
      saveAndSync();
      refreshCurrent();
      break;
    }

    // ── Level up running ──
    case 'level-up-run': {
      if (canLevelUpRun(STATE)) {
        levelUpRun(STATE);
        saveAndSync();
        refreshCurrent();
      }
      break;
    }

    // ── Level up pull-up ──
    case 'level-up-pullup': {
      if (canLevelUpPullup(STATE)) {
        levelUpPullup(STATE);
        saveAndSync();
        refreshCurrent();
      }
      break;
    }

    // ── Mark milestone ──
    case 'mark-milestone': {
      const key = el.dataset.key;
      const milestoneMap = {
        'first-pu': 'firstUnassistedPullup',
        'three-pu': 'threeUnassistedPullups',
        'five-k':   'fiveKComplete',
        'ten-k':    'tenKComplete',
      };
      const msKey = milestoneMap[key];
      if (msKey) {
        STATE.milestones[msKey] = new Date().toISOString();
        saveAndSync();
        refreshCurrent();
      }
      break;
    }

    // ── Edit exercise ──
    case 'edit-ex': {
      const key = el.dataset.key;
      // Toggle the edit form open/closed
      const form = document.getElementById(`edit-form-${key}`);
      if (form) {
        const isOpen = form.classList.contains('open');
        // Close all open forms first
        document.querySelectorAll('.ex-edit-form.open').forEach(f => f.classList.remove('open'));
        if (!isOpen) form.classList.add('open');
      }
      break;
    }

    // ── Save exercise edit ──
    case 'save-ex': {
      const exId = el.dataset.exid;
      const key  = el.dataset.key;
      const form = document.getElementById(`edit-form-${key}`);
      if (!form) break;
      const name  = form.querySelector('[data-field="name"]').value.trim();
      const sets  = form.querySelector('[data-field="sets"]').value.trim();
      const note  = form.querySelector('[data-field="note"]').value.trim();
      if (!name) break;
      if (!STATE.customizations.exercises[exId]) {
        STATE.customizations.exercises[exId] = {};
      }
      STATE.customizations.exercises[exId] = { name, sets, note };
      saveAndSync();
      refreshCurrent();
      break;
    }

    // ── Delete exercise (immediate) ──
    case 'delete-ex': {
      const exId = el.dataset.exid;
      STATE.customizations.exercises[exId] = { deleted: true };
      saveAndSync();
      refreshCurrent();
      break;
    }

    // ── Cancel edit ──
    case 'cancel-edit': {
      const key = el.dataset.key;
      const form = document.getElementById(`edit-form-${key}`);
      if (form) form.classList.remove('open');
      break;
    }

    // ── Show inline add form ──
    case 'show-add-form': {
      const circuitId = el.dataset.circuitid;
      const form = document.getElementById(`add-form-${circuitId}`);
      if (form) {
        const isOpen = form.classList.contains('open');
        document.querySelectorAll('.ex-edit-form.open').forEach(f => f.classList.remove('open'));
        if (!isOpen) {
          form.classList.add('open');
          form.querySelector('[data-field="add-name"]')?.focus();
        }
      }
      break;
    }

    // ── Confirm add exercise (inline form) ──
    case 'confirm-add-ex': {
      const circuitId = el.dataset.circuitid;
      const form = document.getElementById(`add-form-${circuitId}`);
      if (!form) break;
      const name = (form.querySelector('[data-field="add-name"]')?.value || '').trim();
      const sets = (form.querySelector('[data-field="add-sets"]')?.value || '').trim();
      const note = (form.querySelector('[data-field="add-note"]')?.value || '').trim();
      if (!name) {
        form.querySelector('[data-field="add-name"]')?.focus();
        break;
      }
      const newEx = { id: `custom_${Date.now()}`, name, sets: sets || '3×10', note };
      if (!STATE.customizations.additions[circuitId]) {
        STATE.customizations.additions[circuitId] = [];
      }
      STATE.customizations.additions[circuitId].push(newEx);
      saveAndSync();
      refreshCurrent();
      break;
    }

    // ── Cancel add form ──
    case 'cancel-add-form': {
      const circuitId = el.dataset.circuitid;
      const form = document.getElementById(`add-form-${circuitId}`);
      if (form) form.classList.remove('open');
      break;
    }

    // ── Settings: save gist ──
    case 'save-gist-settings': {
      const token = document.getElementById('gist-token')?.value?.trim() || '';
      const gistId = document.getElementById('gist-id')?.value?.trim() || '';
      STATE.settings.gistToken = token;
      STATE.settings.gistId = gistId;
      saveLocal(STATE);
      if (token) {
        showSyncStatus('syncing', 'Syncing…');
        syncToGist(STATE).then(result => {
          if (result.success) {
            if (result.gistId) {
              STATE.settings.gistId = result.gistId;
              saveLocal(STATE);
              refreshCurrent(); // refresh to show new gist ID
            }
            showSyncStatus('ok', '✓ Synced successfully');
          } else {
            showSyncStatus('error', `✗ ${result.error}`);
          }
        });
      }
      break;
    }

    // ── Settings: pull from gist ──
    case 'load-from-gist': {
      const token  = document.getElementById('gist-token')?.value?.trim() || '';
      const gistId = document.getElementById('gist-id')?.value?.trim() || '';
      if (!token || !gistId) {
        showSyncStatus('error', 'Enter both token and Gist ID first');
        break;
      }
      showSyncStatus('syncing', 'Pulling from Gist…');
      loadFromGist(token, gistId).then(remote => {
        if (!remote) {
          showSyncStatus('error', '✗ Could not load from Gist');
          return;
        }
        STATE = mergeStates(STATE, remote);
        STATE.settings.gistToken = token;
        STATE.settings.gistId    = gistId;
        saveLocal(STATE);
        showSyncStatus('ok', '✓ Loaded from Gist');
        refreshCurrent();
      });
      break;
    }

    // ── Reset exercise customizations only (keep sessions + progress) ──
    case 'reset-customizations': {
      STATE.customizations = { exercises: {}, additions: {} };
      saveAndSync();
      refreshCurrent();
      break;
    }

    // ── Reset data (two-step: first click shows confirm button) ──
    case 'reset-data': {
      const confirmBtn = document.getElementById('reset-confirm-btn');
      const resetBtn   = document.getElementById('reset-data-btn');
      if (confirmBtn) confirmBtn.classList.remove('hidden');
      if (resetBtn)   resetBtn.classList.add('hidden');
      setTimeout(() => {
        if (confirmBtn) confirmBtn.classList.add('hidden');
        if (resetBtn)   resetBtn.classList.remove('hidden');
      }, 4000);
      break;
    }

    // ── Confirm reset ──
    case 'confirm-reset-data': {
      const savedToken  = STATE.settings.gistToken;
      const savedGistId = STATE.settings.gistId;
      STATE = defaultState();
      STATE.settings.gistToken = savedToken;
      STATE.settings.gistId    = savedGistId;
      saveLocal(STATE);
      refreshCurrent();
      break;
    }
  }
}

function handleChange(e) {
  // Notes textarea
  if (e.target.dataset.action === 'save-notes') {
    const dateKey = e.target.dataset.date;
    const session = getOrCreateSession(STATE, dateKey);
    session.notes = e.target.value;
    saveAndSync();
  }
}

function handleInput(e) {
  // Live save notes (debounced via save which already has gist debounce)
  if (e.target.dataset.action === 'save-notes') {
    const dateKey = e.target.dataset.date;
    const session = getOrCreateSession(STATE, dateKey);
    session.notes = e.target.value;
    saveLocal(STATE); // save locally immediately, gist debounced
  }
}

/* ── HEADER EDIT MODE BUTTON ─────────────────────── */
function setupEditModeButton() {
  const btn = document.getElementById('edit-mode-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    STATE.editMode = !STATE.editMode;
    btn.textContent = STATE.editMode ? '✏️ Editing' : '✏️ Edit';
    btn.classList.toggle('active', STATE.editMode);
    refreshCurrent();
  });
}

/* ── SYNC STATUS HELPER ──────────────────────────── */
function showSyncStatus(type, msg) {
  const el = document.getElementById('sync-status');
  if (!el) return;
  el.className = `sync-status ${type}`;
  el.textContent = msg;
  el.classList.remove('hidden');
  if (type === 'ok') {
    setTimeout(() => el.classList.add('hidden'), 4000);
  }
}

/* ── INIT ────────────────────────────────────────── */
async function init() {
  // 1. Load from localStorage
  STATE = loadLocal();

  // 2. Try to load from Gist (non-blocking)
  if (STATE.settings.gistToken && STATE.settings.gistId) {
    loadFromGist(STATE.settings.gistToken, STATE.settings.gistId).then(remote => {
      if (remote) {
        STATE = mergeStates(STATE, remote);
        saveLocal(STATE);
        refreshCurrent();
      }
    });
  }

  // 3. Set up nav
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.nav));
  });

  // 4. Edit mode button
  setupEditModeButton();

  // 5. Render default view
  navigateTo('today');
}

document.addEventListener('DOMContentLoaded', init);

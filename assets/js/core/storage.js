(function initStorage() {
  const ns = window.WheelRandomizer;
  const { LS_KEY, SAVED_WHEELS_KEY, FALLBACK_OPTIONS } = ns.constants;

  function normalizeHistory(history) {
    if (!Array.isArray(history)) {
      return [];
    }

    return history
      .filter(entry => entry && typeof entry === 'object' && typeof entry.winner === 'string' && entry.winner.trim())
      .map((entry, index) => ({
        id:
          typeof entry.id === 'string' && entry.id
            ? entry.id
            : `history-${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
        winner: entry.winner,
        createdAt: Number.isFinite(entry.createdAt) ? entry.createdAt : Date.now(),
      }));
  }

  function normalizeSavedWheels(parsed) {
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(wheel => wheel && typeof wheel === 'object' && Array.isArray(wheel.options))
      .map((wheel, index) => ({
        ...wheel,
        id: typeof wheel.id === 'string' && wheel.id ? wheel.id : `wheel-${Date.now()}-${index}`,
        name: typeof wheel.name === 'string' && wheel.name.trim() ? wheel.name : 'Untitled wheel',
        options: wheel.options.filter(option => typeof option === 'string'),
        history: normalizeHistory(wheel.history),
      }));
  }

  function loadOptions() {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}

    return FALLBACK_OPTIONS;
  }

  function saveOptions(options) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(options));
    } catch {}
  }

  function loadSavedWheels() {
    try {
      const raw = localStorage.getItem(SAVED_WHEELS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return normalizeSavedWheels(parsed);
      }
    } catch {}

    return [];
  }

  function persistSavedWheels(wheels) {
    try {
      localStorage.setItem(SAVED_WHEELS_KEY, JSON.stringify(wheels));
    } catch {}
  }

  ns.storage = {
    loadOptions,
    saveOptions,
    loadSavedWheels,
    persistSavedWheels,
  };
})();

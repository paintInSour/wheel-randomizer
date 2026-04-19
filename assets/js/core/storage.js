(function initStorage() {
  const ns = window.WheelRandomizer;
  const { LS_KEY, SAVED_WHEELS_KEY, FALLBACK_OPTIONS } = ns.constants;

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
        if (Array.isArray(parsed)) {
          return parsed;
        }
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

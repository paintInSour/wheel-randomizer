(function initApp() {
  const { useState, useRef, useEffect, useCallback } = React;
  const ns = window.WheelRandomizer;

  const { RAINBOW, initRotation } = ns.constants;
  const { loadOptions, saveOptions, loadSavedWheels, persistSavedWheels } = ns.storage;
  const { Wheel } = ns.components;
  const { EditIcon, TrashIcon, CheckIcon, PlusIcon, SaveIcon, LayersIcon, FolderIcon } = ns.icons;

  function App() {
    const [options, setOptions] = useState(loadOptions);
    const [rotation, setRotation] = useState(() => initRotation(loadOptions().length));
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [editVal, setEditVal] = useState('');
    const [newOpt, setNewOpt] = useState('');
    const [confirmClear, setConfirmClear] = useState(false);

    const [savedWheels, setSavedWheels] = useState(loadSavedWheels);
    const [activeWheelId, setActiveWheelId] = useState(null);
    const [showWheelsPanel, setShowWheelsPanel] = useState(false);
    const [newWheelName, setNewWheelName] = useState('');
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [saveModalName, setSaveModalName] = useState('');

    const rotRef = useRef(initRotation(loadOptions().length));
    const animRef = useRef(null);
    const editInputRef = useRef(null);
    const addInputRef = useRef(null);
    const newWheelNameRef = useRef(null);
    const wheelsPanelRef = useRef(null);
    const saveModalNameRef = useRef(null);

    useEffect(() => {
      if (!showWheelsPanel) {
        return;
      }

      const onMouseDown = event => {
        if (wheelsPanelRef.current && !wheelsPanelRef.current.contains(event.target)) {
          setShowWheelsPanel(false);
        }
      };

      document.addEventListener('mousedown', onMouseDown);
      return () => document.removeEventListener('mousedown', onMouseDown);
    }, [showWheelsPanel]);

    const spin = useCallback(() => {
      if (spinning || options.length < 2) {
        return;
      }

      setResult(null);
      setSpinning(true);

      const n = options.length;
      const sliceAngle = (2 * Math.PI) / n;
      const targetIdx = Math.floor(Math.random() * n);

      const baseAngle = -Math.PI / 2 - (targetIdx + 0.5) * sliceAngle;
      const curMod = ((rotRef.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const baseMod = ((baseAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      let delta = baseMod - curMod;
      if (delta <= 0) {
        delta += 2 * Math.PI;
      }

      const spins = 5 + Math.floor(Math.random() * 4);
      const totalDelta = delta + spins * 2 * Math.PI;
      const startRot = rotRef.current;
      const duration = 4200 + Math.random() * 1600;
      const startTime = performance.now();
      const easeOut = t => 1 - Math.pow(1 - t, 4);

      const frame = now => {
        const t = Math.min((now - startTime) / duration, 1);
        const currentRotation = startRot + totalDelta * easeOut(t);
        rotRef.current = currentRotation;
        setRotation(currentRotation);

        if (t < 1) {
          animRef.current = requestAnimationFrame(frame);
        } else {
          setSpinning(false);
          setResult(options[targetIdx]);
        }
      };

      animRef.current = requestAnimationFrame(frame);
    }, [spinning, options]);

    useEffect(() => {
      saveOptions(options);
    }, [options]);

    useEffect(() => {
      persistSavedWheels(savedWheels);
    }, [savedWheels]);

    useEffect(() => {
      if (!activeWheelId) {
        return;
      }

      setSavedWheels(prev =>
        prev.map(wheel => (wheel.id === activeWheelId ? { ...wheel, options: [...options] } : wheel)),
      );
    }, [options, activeWheelId]);

    useEffect(() => () => cancelAnimationFrame(animRef.current), []);

    const addOption = () => {
      const value = newOpt.trim();
      if (!value) {
        return;
      }

      setOptions(prev => [...prev, value]);
      setNewOpt('');
      setResult(null);
      setTimeout(() => addInputRef.current?.focus(), 10);
    };

    const deleteOption = index => {
      setOptions(prev => prev.filter((_, optionIndex) => optionIndex !== index));
      setResult(null);
    };

    const startEdit = index => {
      setEditIndex(index);
      setEditVal(options[index]);
      setTimeout(() => editInputRef.current?.focus(), 30);
    };

    const saveEdit = () => {
      const value = editVal.trim();
      if (value) {
        setOptions(prev => prev.map((option, index) => (index === editIndex ? value : option)));
      }

      setEditIndex(null);
      setResult(null);
    };

    const clearAll = () => {
      if (confirmClear) {
        setOptions([]);
        setResult(null);
        setConfirmClear(false);
      } else {
        setConfirmClear(true);
        setTimeout(() => setConfirmClear(false), 3000);
      }
    };

    const createWheel = () => {
      const name = newWheelName.trim();
      if (!name) {
        return;
      }

      const newWheel = { id: String(Date.now()), name, options: [...options] };
      setSavedWheels(prev => [...prev, newWheel]);
      setActiveWheelId(newWheel.id);
      setNewWheelName('');
      setTimeout(() => newWheelNameRef.current?.focus(), 10);
    };

    const saveAsWheel = () => {
      const name = saveModalName.trim();
      if (!name) {
        return;
      }

      const newWheel = { id: String(Date.now()), name, options: [...options] };
      setSavedWheels(prev => [...prev, newWheel]);
      setActiveWheelId(newWheel.id);
      setShowSaveModal(false);
      setSaveModalName('');
    };

    const openSaveModal = () => {
      setSaveModalName('');
      setShowSaveModal(true);
      setTimeout(() => saveModalNameRef.current?.focus(), 30);
    };

    const loadSavedWheel = wheel => {
      setOptions(wheel.options);
      setActiveWheelId(wheel.id);
      setResult(null);
      setShowWheelsPanel(false);
    };

    const deleteSavedWheel = id => {
      setSavedWheels(prev => prev.filter(wheel => wheel.id !== id));
      if (activeWheelId === id) {
        setActiveWheelId(null);
      }
    };

    const canSpin = !spinning && options.length >= 2;
    const activeWheelName = activeWheelId
      ? (savedWheels.find(wheel => wheel.id === activeWheelId)?.name ?? null)
      : null;

    return (
      <>
        <div className="min-h-screen py-6 px-4">
          <div className="max-w-md mx-auto flex flex-col gap-5">
            <div className="text-center pt-2">
              <h1
                className="text-4xl font-extrabold tracking-tight"
                style={{
                  background: 'linear-gradient(135deg,#7c3aed,#c084fc,#f472b6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Wheel Randomizer
              </h1>
              <p className="text-sm text-violet-400 mt-1 font-medium">Spin and let fate decide ✨</p>
            </div>

            <div className="card rounded-3xl shadow-2xl p-5 pb-6 relative" style={{ boxShadow: '0 20px 60px rgba(124,58,237,0.13)' }}>
              <div className="absolute top-4 left-4 z-20" ref={wheelsPanelRef}>
                <button
                  className={`wheel-corner-btn ${showWheelsPanel ? 'open' : ''}`}
                  onClick={() => setShowWheelsPanel(prev => !prev)}
                  disabled={spinning}
                  title="My saved wheels"
                >
                  <LayersIcon />
                  {savedWheels.length > 0 && <span>{savedWheels.length}</span>}
                </button>

                {showWheelsPanel && (
                  <div
                    className="float-panel mt-1"
                    style={{ width: 'calc(100vw - 64px)', maxWidth: '416px', left: 0, right: 'auto' }}
                  >
                    <div className="px-4 pt-4 pb-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-violet-400">My Wheels</p>
                    </div>

                    {savedWheels.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center px-4 pb-3">
                        No saved wheels yet. Create one below!
                      </p>
                    ) : (
                      <div className="scroll-area flex flex-col gap-1 max-h-52 overflow-y-auto px-2">
                        {savedWheels.map(wheel => (
                          <div
                            key={wheel.id}
                            className={`wheel-row flex items-center gap-3 px-3 py-2.5 ${wheel.id === activeWheelId ? 'is-active' : ''}`}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-700 truncate">{wheel.name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {wheel.options.length} option{wheel.options.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                            <button
                              onClick={() => wheel.id !== activeWheelId && loadSavedWheel(wheel)}
                              className={`load-btn ${wheel.id === activeWheelId ? 'current' : ''}`}
                            >
                              {wheel.id === activeWheelId ? 'Active' : 'Load'}
                            </button>
                            <button
                              onClick={() => deleteSavedWheel(wheel.id)}
                              className="icon-btn text-gray-300 hover:text-rose-400 flex-shrink-0 p-1"
                              title="Delete saved wheel"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 px-3 py-3 border-t border-gray-100 mt-1">
                      <input
                        ref={newWheelNameRef}
                        className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all"
                        placeholder="New wheel name…"
                        value={newWheelName}
                        onChange={event => setNewWheelName(event.target.value)}
                        onKeyDown={event => event.key === 'Enter' && createWheel()}
                      />
                      <button
                        onClick={createWheel}
                        disabled={!newWheelName.trim()}
                        className="add-btn w-9 h-9 flex items-center justify-center rounded-xl text-white flex-shrink-0 disabled:opacity-40"
                        title="Create wheel"
                      >
                        <PlusIcon />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="max-w-xs mx-auto relative">
                <Wheel options={options} rotation={rotation} />

                {result && !spinning && (
                  <div
                    className="result-pop absolute left-4 right-4 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center rounded-3xl py-6"
                    style={{
                      background: 'linear-gradient(135deg, rgba(109,40,217,0.82), rgba(167,139,250,0.82))',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-200 mb-2">🎉 Winner!</p>
                    <p className="text-white text-2xl font-extrabold leading-snug text-center px-8 break-words">
                      {result}
                    </p>
                    <button
                      onClick={() => {
                        setOptions(prev => prev.filter(option => option !== result));
                        setResult(null);
                      }}
                      className="remove-winner-btn mt-5 px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all duration-150"
                    >
                      <TrashIcon />
                      Remove from wheel
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={spin}
                disabled={!canSpin}
                className="spin-btn mt-4 w-full py-4 rounded-2xl font-bold text-lg text-white"
              >
                {spinning
                  ? '🌀 Spinning…'
                  : options.length < 2
                    ? 'Add at least 2 options'
                    : '🎯 Spin the Wheel!'}
              </button>
            </div>

            <div className="card rounded-3xl shadow-2xl p-5" style={{ boxShadow: '0 20px 60px rgba(124,58,237,0.10)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 min-w-0">
                  <h2 className="text-base font-bold text-gray-700 flex-shrink-0">Options</h2>
                  <span className="text-xs font-semibold text-violet-500 bg-violet-100 px-3 py-1 rounded-full flex-shrink-0">
                    {options.length}
                  </span>
                  {activeWheelName && (
                    <span className="flex items-center gap-1 text-xs text-violet-400 font-medium truncate min-w-0">
                      <span className="text-violet-300 flex-shrink-0">·</span>
                      <FolderIcon />
                      <span className="truncate">{activeWheelName}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {!activeWheelId && options.length > 0 && (
                    <button
                      onClick={openSaveModal}
                      className="flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-xl transition-all duration-200 bg-violet-50 text-violet-600 hover:bg-violet-100"
                    >
                      <SaveIcon />
                      Save
                    </button>
                  )}

                  {options.length > 0 && (
                    <button
                      onClick={clearAll}
                      disabled={spinning}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all duration-200 disabled:opacity-30"
                      style={
                        confirmClear
                          ? { background: '#fee2e2', color: '#ef4444' }
                          : { background: '#f3f4f6', color: '#9ca3af' }
                      }
                      title="Clear all options"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                      {confirmClear ? 'Confirm?' : 'Clear'}
                    </button>
                  )}
                </div>
              </div>

              <div className="scroll-area flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                {options.length === 0 && (
                  <div className="text-center py-10 text-gray-400">
                    <div className="text-5xl mb-3">🎡</div>
                    <p className="text-sm">No options yet — add some below!</p>
                  </div>
                )}

                {options
                  .map((option, index) => ({ option, index }))
                  .reverse()
                  .map(({ option, index }) => (
                    <div key={index} className="opt-row flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0 ring-2 ring-white"
                        style={{
                          backgroundColor: RAINBOW[index % RAINBOW.length],
                          boxShadow: `0 0 0 2px ${RAINBOW[index % RAINBOW.length]}44`,
                        }}
                      />

                      {editIndex === index ? (
                        <input
                          ref={editInputRef}
                          className="flex-1 text-sm font-medium text-gray-700 bg-white border-2 border-violet-300 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-300"
                          value={editVal}
                          onChange={event => setEditVal(event.target.value)}
                          onBlur={saveEdit}
                          onKeyDown={event => {
                            if (event.key === 'Enter') {
                              saveEdit();
                            }
                            if (event.key === 'Escape') {
                              setEditIndex(null);
                            }
                          }}
                        />
                      ) : (
                        <span className="flex-1 text-sm font-medium text-gray-700 truncate">{option}</span>
                      )}

                      {editIndex === index ? (
                        <button onClick={saveEdit} className="icon-btn text-green-500 flex-shrink-0 p-1">
                          <CheckIcon />
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => startEdit(index)}
                            disabled={spinning}
                            className="icon-btn text-gray-400 hover:text-violet-500 p-1 disabled:opacity-30"
                            title="Edit"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => deleteOption(index)}
                            disabled={spinning}
                            className="icon-btn text-gray-400 hover:text-rose-500 p-1 disabled:opacity-30"
                            title="Delete"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              <div className="flex gap-2 mt-4">
                <input
                  ref={addInputRef}
                  className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all"
                  placeholder="Type an option…"
                  value={newOpt}
                  disabled={spinning}
                  onChange={event => setNewOpt(event.target.value)}
                  onKeyDown={event => event.key === 'Enter' && addOption()}
                />
                <button
                  onClick={addOption}
                  disabled={!newOpt.trim() || spinning}
                  className="add-btn w-12 h-12 flex items-center justify-center rounded-2xl text-white flex-shrink-0"
                  title="Add option"
                >
                  <PlusIcon />
                </button>
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 pb-4">
              Press{' '}
              <kbd className="bg-white rounded-md px-1.5 py-0.5 text-xs shadow-sm border border-gray-200">
                Enter
              </kbd>{' '}
              to add · click ✏️ to edit · click 🗑️ to remove
            </p>
          </div>
        </div>

        {showSaveModal && (
          <div
            className="modal-backdrop"
            onMouseDown={event => {
              if (event.target === event.currentTarget) {
                setShowSaveModal(false);
              }
            }}
          >
            <div className="modal-card">
              <h2 className="text-xl font-extrabold text-gray-800 mb-1">Save as wheel</h2>
              <p className="text-sm text-gray-400 mb-5">
                Give your options a name so they're saved and tracked automatically.
              </p>

              <input
                ref={saveModalNameRef}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all"
                placeholder="e.g. Dinner options"
                value={saveModalName}
                onChange={event => setSaveModalName(event.target.value)}
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    saveAsWheel();
                  }
                  if (event.key === 'Escape') {
                    setShowSaveModal(false);
                  }
                }}
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 py-3 rounded-2xl text-sm font-semibold text-gray-400 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveAsWheel}
                  disabled={!saveModalName.trim()}
                  className="spin-btn flex-1 py-3 rounded-2xl text-sm font-bold text-white disabled:opacity-40"
                >
                  Save wheel
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  ns.App = App;
})();

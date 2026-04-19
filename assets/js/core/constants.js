window.WheelRandomizer = window.WheelRandomizer || {};

window.WheelRandomizer.constants = {
  RAINBOW: [
    '#FF6B6B',
    '#FF9F43',
    '#FECA57',
    '#2ECC71',
    '#3498DB',
    '#9B59B6',
    '#FF79C6',
    '#1ABC9C',
    '#E67E22',
    '#45AAF2',
    '#FD79A8',
    '#00B894',
  ],
  CANVAS_SIZE: 440,
  PADDING: 12,
  LS_KEY: 'wheel-randomizer-options',
  SAVED_WHEELS_KEY: 'wheel-randomizer-saved-wheels',
  FALLBACK_OPTIONS: ['Pizza 🍕', 'Sushi 🍣', 'Burger 🍔', 'Tacos 🌮', 'Pasta 🍝'],
  initRotation(n) {
    return -Math.PI / 2 - Math.PI / Math.max(n, 1);
  },
};

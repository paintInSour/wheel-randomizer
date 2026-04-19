(function initWheelRenderer() {
  const ns = window.WheelRandomizer;
  const { RAINBOW, CANVAS_SIZE, PADDING } = ns.constants;

  function drawWheel(canvas, options, rotation) {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const cx = CANVAS_SIZE / 2;
    const cy = CANVAS_SIZE / 2;
    const r = CANVAS_SIZE / 2 - PADDING;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.save();
    ctx.shadowColor = 'rgba(120, 80, 220, 0.25)';
    ctx.shadowBlur = 28;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 4, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.restore();

    if (options.length === 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, '#f5f0ff');
      grad.addColorStop(1, '#ede9fe');
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.font = `500 ${CANVAS_SIZE * 0.055}px Inter, sans-serif`;
      ctx.fillStyle = '#c4b5fd';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Add options below ↓', cx, cy);
      return;
    }

    const n = options.length;
    const sliceAngle = (2 * Math.PI) / n;

    for (let i = 0; i < n; i += 1) {
      const start = rotation + i * sliceAngle;
      const end = start + sliceAngle;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fillStyle = RAINBOW[i % RAINBOW.length];
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 6;
    ctx.stroke();

    const maxChars = n <= 4 ? 14 : n <= 7 ? 11 : 9;
    const fontSize = Math.max(10, Math.min(17, Math.floor((r * 0.85) / n * 1.1)));

    for (let i = 0; i < n; i += 1) {
      const mid = rotation + i * sliceAngle + sliceAngle / 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(mid);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.font = `600 ${fontSize}px Inter, sans-serif`;
      ctx.fillStyle = 'rgba(255,255,255,0.97)';
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = 5;
      const label = options[i].length > maxChars ? `${options[i].slice(0, maxChars - 1)}…` : options[i];
      ctx.fillText(label, r - 16, 0);
      ctx.restore();
    }

    const hubR = Math.max(18, r * 0.11);
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.18)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(cx, cy, hubR, 0, 2 * Math.PI);
    const hubGrad = ctx.createRadialGradient(cx - hubR * 0.3, cy - hubR * 0.3, 1, cx, cy, hubR);
    hubGrad.addColorStop(0, '#ffffff');
    hubGrad.addColorStop(1, '#e0d7ff');
    ctx.fillStyle = hubGrad;
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, hubR, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(180,160,240,0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, hubR * 0.35, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(160,130,230,0.4)';
    ctx.fill();
  }

  ns.renderer = {
    drawWheel,
  };
})();

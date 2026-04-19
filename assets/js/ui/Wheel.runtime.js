(() => {
  (function initWheelComponent() {
    const { useRef, useEffect } = React;
    const { drawWheel } = window.WheelRandomizer.renderer;
    function Wheel({ options, rotation }) {
      const canvasRef = useRef(null);
      useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
          return;
        }
        document.fonts.ready.then(() => drawWheel(canvas, options, rotation));
      }, [options, rotation]);
      return /* @__PURE__ */ React.createElement("div", { className: "relative w-full", style: { aspectRatio: "1 / 1" } }, /* @__PURE__ */ React.createElement("canvas", { ref: canvasRef, style: { width: "100%", height: "100%", display: "block" } }), /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "absolute left-1/2 pointer-events-none",
          style: {
            top: "-2px",
            transform: "translateX(-50%)",
            zIndex: 20,
            filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.3))"
          }
        },
        /* @__PURE__ */ React.createElement("svg", { width: "28", height: "36", viewBox: "0 0 28 36" }, /* @__PURE__ */ React.createElement("polygon", { points: "14,36 0,4 28,4", fill: "#1e1b4b" }), /* @__PURE__ */ React.createElement("polygon", { points: "14,36 2,6 26,6", fill: "#312e81" }), /* @__PURE__ */ React.createElement("circle", { cx: "14", cy: "7", r: "5", fill: "white" }), /* @__PURE__ */ React.createElement("circle", { cx: "14", cy: "7", r: "2.5", fill: "#7c3aed" }))
      ));
    }
    window.WheelRandomizer = window.WheelRandomizer || {};
    window.WheelRandomizer.components = window.WheelRandomizer.components || {};
    window.WheelRandomizer.components.Wheel = Wheel;
  })();
})();

import { useEffect, useRef, useState } from "react";
import { historyTimeline } from "../content";

export function FunctionPlot() {
  const [slope, setSlope] = useState(2);
  const [intercept, setIntercept] = useState(1);
  const points = [-2, -1, 0, 1, 2].map((x) => ({
    x,
    y: slope * x + intercept,
  }));
  const path = points
    .map(({ x, y }, index) => {
      const px = 120 + x * 45;
      const py = 120 - y * 18;
      return `${index === 0 ? "M" : "L"} ${px} ${py}`;
    })
    .join(" ");

  return (
    <div className="visual-card">
      <p className="eyebrow">Interactive line</p>
      <svg className="math-visual" viewBox="0 0 240 240">
        <line x1="20" x2="220" y1="120" y2="120" />
        <line x1="120" x2="120" y1="20" y2="220" />
        <path d={path} />
        {points.map(({ x, y }) => (
          <g key={`${x}-${y}`}>
            <circle cx={120 + x * 45} cy={120 - y * 18} r="4" />
            <text x={126 + x * 45} y={114 - y * 18}>
              ({x},{y})
            </text>
          </g>
        ))}
      </svg>
      <div className="visual-controls">
        <label className="visual-slider">
          <span>الميل m = {slope}</span>
          <input
            max="4"
            min="-4"
            onChange={(event) => setSlope(Number(event.target.value))}
            step="1"
            type="range"
            value={slope}
          />
        </label>
        <label className="visual-slider">
          <span>الثابت b = {intercept}</span>
          <input
            max="5"
            min="-5"
            onChange={(event) => setIntercept(Number(event.target.value))}
            step="1"
            type="range"
            value={intercept}
          />
        </label>
      </div>
      <p className="visual-note">حرّكي الميل والثابت باش تشوفي فورًا كيف يتبدل الرسم والقيم.</p>
    </div>
  );
}

export function TriangleSketch() {
  const [base, setBase] = useState(6);
  const [height, setHeight] = useState(8);
  const [dragTarget, setDragTarget] = useState<"base" | "height" | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const originX = 38;
  const originY = 196;
  const scale = 18;
  const topY = originY - height * scale;
  const rightX = originX + base * scale;
  const hypotenuse = Math.sqrt(base ** 2 + height ** 2);

  useEffect(() => {
    if (!dragTarget) {
      return undefined;
    }

    function applyPointer(clientX: number, clientY: number) {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      if (dragTarget === "base") {
        const next = Math.round((((clientX - rect.left) - originX) / scale) * 2) / 2;
        setBase(Math.min(10, Math.max(3, next)));
        return;
      }

      const next = Math.round(((originY - (clientY - rect.top)) / scale) * 2) / 2;
      setHeight(Math.min(10, Math.max(3, next)));
    }

    function handleMove(event: PointerEvent) {
      applyPointer(event.clientX, event.clientY);
    }

    function handleStop() {
      setDragTarget(null);
    }

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleStop);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleStop);
    };
  }, [dragTarget]);

  return (
    <div className="visual-card">
      <p className="eyebrow">Interactive triangle</p>
      <svg className="math-visual math-visual--interactive" ref={svgRef} viewBox="0 0 280 220">
        <polygon points={`${originX},${originY} ${originX},${topY} ${rightX},${originY}`} />
        <rect height="16" width="16" x={originX} y={originY - 16} />
        <line x1={originX} x2={rightX} y1={originY} y2={originY} />
        <line x1={originX} x2={originX} y1={originY} y2={topY} />
        <text x={originX - 16} y={topY + (originY - topY) / 2}>
          {height.toFixed(1)}
        </text>
        <text x={originX + (rightX - originX) / 2} y={originY + 16}>
          {base.toFixed(1)}
        </text>
        <text x={originX + (rightX - originX) / 2 + 8} y={topY + (originY - topY) / 2}>
          {hypotenuse.toFixed(2)}
        </text>
        <text x={originX - 14} y={originY + 18}>
          A
        </text>
        <text x={originX - 14} y={topY - 8}>
          B
        </text>
        <text x={rightX + 6} y={originY + 12}>
          C
        </text>
        <circle
          className="math-handle"
          cx={originX}
          cy={topY}
          onPointerDown={() => setDragTarget("height")}
          r="8"
        />
        <circle
          className="math-handle"
          cx={rightX}
          cy={originY}
          onPointerDown={() => setDragTarget("base")}
          r="8"
        />
      </svg>
      <div className="visual-controls">
        <label className="visual-slider">
          <span>القاعدة = {base.toFixed(1)}</span>
          <input
            data-testid="triangle-base-slider"
            max="10"
            min="3"
            onChange={(event) => setBase(Number(event.target.value))}
            step="0.5"
            type="range"
            value={base}
          />
        </label>
        <label className="visual-slider">
          <span>الارتفاع = {height.toFixed(1)}</span>
          <input
            data-testid="triangle-height-slider"
            max="10"
            min="3"
            onChange={(event) => setHeight(Number(event.target.value))}
            step="0.5"
            type="range"
            value={height}
          />
        </label>
      </div>
      <div className="inline-list">
        <span className="formula-pill">
          <strong>c²</strong>
          <span>
            {base.toFixed(1)}² + {height.toFixed(1)}² = {(base ** 2 + height ** 2).toFixed(2)}
          </span>
        </span>
        <span className="formula-pill">
          <strong>c</strong>
          <span data-testid="triangle-hypotenuse">{hypotenuse.toFixed(2)}</span>
        </span>
      </div>
      <p className="visual-note">
        اسحبي النقطة B أو C، أو استعملي المنزلقات. كل تغيير يبدل الوتر فورًا حتى تربطي الرسم بالقانون.
      </p>
    </div>
  );
}

export function TimelineStrip() {
  return (
    <div className="timeline-strip">
      {historyTimeline.slice(0, 6).map((event) => (
        <div key={event.id} className="timeline-chip">
          <span>{event.yearLabel}</span>
          <strong>{event.title}</strong>
        </div>
      ))}
    </div>
  );
}

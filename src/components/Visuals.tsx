import { historyTimeline } from "../content";

export function FunctionPlot() {
  const slope = 2;
  const intercept = 1;
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
      <p className="visual-note">مثال ثابت لـ f(x)=2x+1 باش تربطي الجدول بالرسم.</p>
    </div>
  );
}

export function TriangleSketch() {
  return (
    <div className="visual-card">
      <p className="eyebrow">Interactive triangle</p>
      <svg className="math-visual" viewBox="0 0 280 220">
        <polygon points="30,190 30,40 220,190" />
        <rect height="18" width="18" x="30" y="172" />
        <text x="8" y="118">
          4
        </text>
        <text x="120" y="208">
          3
        </text>
        <text x="134" y="98">
          5
        </text>
      </svg>
      <p className="visual-note">ابدئي دائماً بتحديد الزاوية القائمة ثم الوتر.</p>
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

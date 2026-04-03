import type { CSSProperties, ReactNode } from "react";
import { motion } from "framer-motion";
import { NavLink, Outlet } from "react-router-dom";

const navigation = [
  { href: "/", label: "الرئيسية" },
  { href: "/daily-plan", label: "الخطة اليومية" },
  { href: "/subjects", label: "المواد" },
  { href: "/past-exams", label: "امتحانات BEM" },
  { href: "/history-timeline", label: "Timeline التاريخ" },
  { href: "/summaries", label: "الملخصات" },
  { href: "/downloads", label: "التحميلات" },
];

function daysUntilExam() {
  const examDay = new Date("2026-05-19T00:00:00");
  const now = new Date();
  const diff = Math.ceil(
    (examDay.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diff > 0 ? diff : 0;
}

export function AppChrome() {
  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="brand-block">
          <p className="eyebrow">BEM Focus</p>
          <h1 className="brand-title">دفتر مراجعة هادئ، قصير، وتفاعلي</h1>
        </div>
        <div className="top-bar-meta">
          <span className="meta-pill">{daysUntilExam()} يوم حتى BEM</span>
          <span className="meta-pill meta-pill--warm">19-21 ماي 2026</span>
        </div>
      </header>

      <nav className="main-nav" aria-label="Primary">
        {navigation.map((item) => (
          <NavLink
            key={item.href}
            className={({ isActive }) =>
              isActive ? "nav-link nav-link--active" : "nav-link"
            }
            to={item.href}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="page-shell">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="page-fade"
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <Outlet />
        </motion.div>
      </main>

      <footer className="site-footer">
        <p>
          البرنامج مبني لوتيرة قصيرة ومركزة: هاتف بعيد، استرجاع سريع، ثم تدريب
          واضح.
        </p>
        <p>
          كل صفحة قابلة للطباعة، وكل درس عنده نسخة HTML قابلة للتحميل من صفحة
          التحميلات.
        </p>
      </footer>
    </div>
  );
}

type PrintActionsProps = {
  htmlDownloadPath?: string;
};

export function PrintActions({ htmlDownloadPath }: PrintActionsProps) {
  return (
    <div className="print-actions">
      <button className="action-button" onClick={() => window.print()} type="button">
        Print / Save as PDF
      </button>
      {htmlDownloadPath ? (
        <a className="action-button action-button--ghost" download href={htmlDownloadPath}>
          تحميل HTML
        </a>
      ) : null}
    </div>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="section-heading">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

type SurfaceProps = {
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
};

export function Surface({ className, children, style }: SurfaceProps) {
  return (
    <section className={`surface ${className ?? ""}`.trim()} style={style}>
      {children}
    </section>
  );
}

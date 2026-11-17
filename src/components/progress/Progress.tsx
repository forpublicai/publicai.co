// Progress components: render src/data/progress.json, a copy of the file that
// forpublicai/publicai.ch builds with tools/progress/build_progress.py. Everything is drawn at build
// time as static HTML and SVG. Visible labels come from props, so each MDX
// locale section supplies its own wording; only data values come from JSON.
import type { ReactNode } from "react";
import data from "@/data/progress.json";
import s from "./progress.module.css";

type Format = "int" | "big" | "dec" | "pct" | "usd" | "text" | "status" | "kilo";

const intFmt = new Intl.NumberFormat("en-US");
const decFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
const usdFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

function format(value: unknown, kind: Format = "int"): string {
  if (value === null || value === undefined || value === "") return "";
  if (kind === "text" || kind === "status") return String(value);
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  switch (kind) {
    case "big":
      if (n >= 1e9) return `${decFmt.format(Math.round(n / 1e7) / 100)}B`;
      if (n >= 1e6) return `${decFmt.format(n / 1e6)}M`;
      return intFmt.format(n);
    case "kilo":
      return n >= 1e6 ? `${decFmt.format(n / 1e6)}M` : `${intFmt.format(Math.round(n / 1e3))}k`;
    case "dec":
      return decFmt.format(n);
    case "pct":
      return `${decFmt.format(n)}%`;
    case "usd":
      return `$${usdFmt.format(n)}`;
    default:
      return intFmt.format(n);
  }
}

function statusClass(status: string): string {
  if (status === "Counted") return s.pill;
  if (status === "Partial") return `${s.pill} ${s.pillWarn}`;
  return `${s.pill} ${s.pillMissing}`;
}

type Row = Record<string, unknown>;

/** One number inside a sentence, e.g. <ProgressFigure name="tokens_30" format="big" />. */
export function ProgressFigure({ name, format: kind = "int" }: { name: string; format?: Format }) {
  const figures = data.figures as Record<string, number | null>;
  return <strong className={s.figure}>{format(figures[name], kind)}</strong>;
}

export type ProgressColumn = {
  key: string;
  label: string;
  format?: Format;
  align?: "left" | "right";
};

function Table({
  rows,
  columns,
  label,
  empty,
}: {
  rows: Row[];
  columns: readonly ProgressColumn[];
  label: string;
  empty?: string;
}) {
  return (
    <div className={s.tableWrap} role="region" aria-label={label} tabIndex={0}>
      <table className={s.table}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                align={
                  c.align ??
                  (c.format && c.format !== "text" && c.format !== "status" ? "right" : "left")
                }
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((c) => {
                const v = row[c.key];
                const numeric = c.format && c.format !== "text" && c.format !== "status";
                const kind =
                  c.key === "d30" || c.key === "y1" || c.key === "launch"
                    ? ((row.format as Format) ?? c.format)
                    : c.format;
                return (
                  <td
                    key={c.key}
                    align={c.align ?? (numeric ? "right" : "left")}
                    className={numeric ? `${s.num} ${s.right}` : undefined}
                  >
                    {c.format === "status" ? (
                      <span className={statusClass(String(v))}>{String(v)}</span>
                    ) : v === null || v === undefined ? (
                      <span className={s.na}>{empty ?? ""}</span>
                    ) : (
                      format(v, kind)
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** The scorecard: one row per metric, a column per window. */
export function ProgressScorecard({
  columns,
  label,
  empty,
}: {
  columns: readonly ProgressColumn[];
  label: string;
  empty: string;
}) {
  return <Table rows={data.scorecard as Row[]} columns={columns} label={label} empty={empty} />;
}

/** Any precomputed table: llm_windows, llm_family, llm_team, repos, coverage. */
export function ProgressTable({
  table,
  columns,
  label,
}: {
  table: keyof typeof data.tables;
  columns: readonly ProgressColumn[];
  label: string;
}) {
  return <Table rows={data.tables[table] as Row[]} columns={columns} label={label} />;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthLabel = (m: string, long = false) =>
  `${MONTHS[Number(m.slice(5, 7)) - 1]} ${long ? m.slice(0, 4) : m.slice(2, 4)}`;

/** Monthly bars for one series. The as-of month is partial and drawn lighter. */
export function ProgressChart({
  series,
  title,
  unit,
  format: kind = "int",
  partialLabel,
}: {
  series: keyof typeof data.series;
  title: string;
  unit: string;
  format?: Format;
  partialLabel: string;
}) {
  const rows = data.series[series].filter(
    (r, i, all) => r.value > 0 || i >= all.findIndex((x) => x.value > 0),
  );
  const W = 600;
  const H = 220;
  const top = 22;
  const bottom = 26;
  const step = W / rows.length;
  const bar = step * 0.72;
  const max = Math.max(1, ...rows.map((r) => r.value));
  const y = (v: number) => H - bottom - (v / max) * (H - top - bottom);
  const partial = data.asOf.slice(0, 7);
  const peak = rows.reduce((a, b) => (b.value > a.value ? b : a), rows[0]);
  const last = rows[rows.length - 1];
  const labelled = peak === last ? [peak] : [peak, last];
  return (
    <figure className={s.chart}>
      <figcaption className={s.chartTitle}>{title}</figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        role="img"
        aria-label={`${title}: ${monthLabel(rows[0].month, true)} to ${monthLabel(last.month, true)}, peak ${format(peak.value, kind)} ${unit} in ${monthLabel(peak.month, true)}`}
      >
        <line x1={0} x2={W} y1={H - bottom} y2={H - bottom} className={s.axis} />
        {rows.map((r, i) => (
          <rect
            key={r.month}
            x={i * step + (step - bar) / 2}
            y={y(r.value)}
            width={bar}
            height={Math.max(0, H - bottom - y(r.value))}
            className={
              r.month === partial
                ? `${s.bar} ${s.barPartial}`
                : s.bar
            }
          >
            <title>{`${monthLabel(r.month, true)}${r.month === partial ? ` (${partialLabel})` : ""}: ${format(r.value, kind)} ${unit}`}</title>
          </rect>
        ))}
        {labelled.map((r) => {
          const i = rows.indexOf(r);
          return (
            <text
              key={`v-${r.month}`}
              x={i * step + step / 2}
              y={y(r.value) - 6}
              textAnchor="middle"
              className={s.chartText}
            >
              {format(r.value, kind)}
            </text>
          );
        })}
        {rows.map((r, i) =>
          i % 3 === 0 ? (
            <text
              key={`t-${r.month}`}
              x={i * step + step / 2}
              y={H - 8}
              textAnchor={i === 0 ? "start" : "middle"}
              dx={i === 0 ? -bar / 2 : 0}
              className={s.chartText}
            >
              {monthLabel(r.month)}
            </text>
          ) : null,
        )}
      </svg>
    </figure>
  );
}

/** A responsive grid around ProgressChart blocks. */
export function ProgressGrid({ children }: { children: ReactNode }) {
  return <div className={s.grid}>{children}</div>;
}

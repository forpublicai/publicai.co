import type { Metadata } from "next";
import { Overpass_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import {
  ProgressChart,
  ProgressFigure,
  ProgressGrid,
  ProgressScorecard,
  ProgressTable,
} from "@/components/progress/Progress";
import s from "@/components/progress/progress.module.css";

const overpassMono = Overpass_Mono({
  variable: "--font-overpass-mono",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Progress",
  description:
    "How Public AI has grown since launch on 2 September 2025, in visitors, users, tokens served and community activity.",
  robots: { index: false, follow: false },
};

const windowColumns = [
  { key: "d30", label: "Last 30 days", format: "big" },
  { key: "y1", label: "Past 12 months", format: "big" },
  { key: "launch", label: "Since launch", format: "big" },
  { key: "share", label: "Share since launch", format: "pct" },
] as const;

export default function ProgressPage() {
  return (
    <div className={`min-h-screen bg-white ${overpassMono.variable}`}>
      <article className={`px-6 py-12 max-w-5xl mx-auto ${s.page}`}>
        <h1>Progress</h1>
        <p className={s.lead}>
          How Public AI has grown since launch on 2 September 2025. Snapshot of 16 November 2026.
        </p>

        <p>
          In the last 30 days, publicai.co had <ProgressFigure name="visitors_30" /> visitors, against{" "}
          <ProgressFigure name="visitors_avg" /> in an average full month of the past year. LiteLLM served{" "}
          <ProgressFigure name="tokens_30" format="big" /> tokens, against{" "}
          <ProgressFigure name="tokens_avg" format="big" /> a month on average over the past year.
          chat.publicai.co gained <ProgressFigure name="users_30" /> sign-ups and had{" "}
          <ProgressFigure name="active_30" /> active users. hello@ received <ProgressFigure name="hello_30" /> new
          threads, against a past-year average of <ProgressFigure name="hello_avg" format="dec" /> a month, and{" "}
          <ProgressFigure name="issues_30" /> GitHub issues were opened. <ProgressFigure name="missing" /> of the{" "}
          <ProgressFigure name="total" /> metrics have no data source yet.
        </p>

        <h2>Scorecard</h2>
        <ProgressScorecard
          label="Scorecard"
          empty="no data"
          columns={[
            { key: "metric", label: "Metric", format: "text" },
            { key: "status", label: "Status", format: "status" },
            { key: "d30", label: "Last 30 days", format: "int" },
            { key: "y1", label: "Past 12 months", format: "int" },
            { key: "launch", label: "Since launch", format: "int" },
          ]}
        />
        <p>
          Last 30 days runs from 18 October to 16 November 2026, and past 12 months from 16 November 2025.
          Visitors are unique visitors per window from Vercel Web Analytics, so they can&apos;t be added up across
          months. Email counts are threads, dated by their first message. hello@ counts all inbound mail, not only
          support requests, and support@ counts only the threads that also reached Josh&apos;s inbox.
        </p>

        <h2>publicai.co visitors</h2>
        <ProgressGrid>
          <ProgressChart series="visitors" title="Unique visitors per month" unit="visitors" partialLabel="partial month" />
        </ProgressGrid>

        <h2>chat.publicai.co users</h2>
        <p>
          Active users sent at least one message in the month. Counts come from Open WebUI&apos;s admin API; no names
          or emails are stored.
        </p>
        <ProgressGrid>
          <ProgressChart series="signups" title="New sign-ups per month" unit="sign-ups" partialLabel="partial month" />
          <ProgressChart series="active_users" title="Active users per month" unit="active users" partialLabel="partial month" />
          <ProgressChart series="chat_messages" title="Chat messages per month" unit="messages" partialLabel="partial month" />
        </ProgressGrid>

        <h2>Tokens served</h2>
        <p>
          Daily usage by team and model from LiteLLM. LiteLLM lists the same model under many names, so names are
          grouped into model families. Spend is LiteLLM&apos;s own cost estimate, not revenue.
        </p>
        <ProgressTable
          table="llm_windows"
          label="LiteLLM totals by window"
          columns={[
            { key: "window", label: "Window", format: "text" },
            { key: "total_tokens", label: "Total tokens", format: "big" },
            { key: "prompt_tokens", label: "Prompt", format: "big" },
            { key: "completion_tokens", label: "Completion", format: "big" },
            { key: "requests", label: "Requests", format: "int" },
            { key: "failed", label: "Failed", format: "int" },
            { key: "spend", label: "Spend", format: "usd" },
          ]}
        />
        <ProgressGrid>
          <ProgressChart series="tokens" title="Tokens per month" unit="tokens" format="big" partialLabel="partial month" />
          <ProgressChart series="llm_requests" title="Requests per month" unit="requests" format="kilo" partialLabel="partial month" />
        </ProgressGrid>

        <h3>By model family</h3>
        <ProgressTable
          table="llm_family"
          label="Tokens by model family"
          columns={[{ key: "name", label: "Model family", format: "text" }, ...windowColumns]}
        />

        <h3>By team</h3>
        <p>Teams map to apps: Open WebUI is chat.publicai.co, and Developer Portal is the paid API.</p>
        <ProgressTable
          table="llm_team"
          label="Tokens by team"
          columns={[{ key: "name", label: "Team", format: "text" }, ...windowColumns]}
        />
        <ProgressGrid>
          <ProgressChart
            series="tokens_per_message"
            title="Open WebUI team tokens per chat message"
            unit="tokens per message"
            format="kilo"
            partialLabel="partial month"
          />
        </ProgressGrid>
        <p>
          LiteLLM tokens on the Open WebUI team, divided by messages sent in chat.publicai.co. A jump means traffic
          other than chat is using that team&apos;s key.
        </p>

        <h2>Community</h2>
        <ProgressGrid>
          <ProgressChart series="hello" title="Threads to hello@publicai.co" unit="threads" partialLabel="partial month" />
          <ProgressChart series="issues" title="GitHub issues opened" unit="issues" partialLabel="partial month" />
        </ProgressGrid>
        <ProgressTable
          table="repos"
          label="GitHub issues by repository"
          columns={[
            { key: "name", label: "Repository", format: "text" },
            { key: "opened", label: "Opened since launch", format: "int" },
            { key: "open", label: "Still open", format: "int" },
          ]}
        />

        <h2>Source coverage</h2>
        <p>
          What each metric is built from today, and what it takes to fill the gaps. The data is built by the scripts
          in the shared <code>forpublicai/progress</code> repository.
        </p>
        <ProgressTable
          table="coverage"
          label="Source coverage"
          columns={[
            { key: "metric", label: "Metric", format: "text" },
            { key: "status", label: "Status", format: "status" },
            { key: "have", label: "What we have", format: "text" },
            { key: "next", label: "Next step", format: "text" },
          ]}
        />
      </article>
      <Footer />
    </div>
  );
}

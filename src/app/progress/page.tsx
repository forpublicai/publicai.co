import type { Metadata } from "next";
import { Overpass_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import {
  ProgressBars,
  ProgressChart,
  ProgressFigure,
  ProgressGrid,
  ProgressPillars,
  ProgressScorecard,
  ProgressTable,
  ProgressTimeline,
} from "@/components/progress/Progress";
import s from "@/components/progress/progress.module.css";

const overpassMono = Overpass_Mono({
  variable: "--font-overpass-mono",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const title = "Public AI progress";
const description =
  "How Public AI has grown since launch on 2 September 2025, across its three pillars: products, movement and idea.";

// openGraph and twitter replace the root layout's whole objects, so repeat
// siteName and type. The card image comes from opengraph-image.tsx.
export const metadata: Metadata = {
  title: "Progress",
  description,
  robots: { index: false, follow: false },
  openGraph: { title, description, url: "/progress", siteName: "PublicAI", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

const windowColumns = [
  { key: "d30", label: "Last 30 days", format: "big" },
  { key: "y1", label: "Past 12 months", format: "big" },
  { key: "launch", label: "Since launch", format: "big" },
  { key: "share", label: "Share since launch", format: "pct" },
] as const;

const scorecardColumns = [
  { key: "metric", label: "Metric", format: "text" },
  { key: "status", label: "Status", format: "status" },
  { key: "d30", label: "Last 30 days", format: "int" },
  { key: "y1", label: "Past 12 months", format: "int" },
  { key: "launch", label: "Since launch", format: "int" },
] as const;

const coverageColumns = [
  { key: "metric", label: "Metric", format: "text" },
  { key: "status", label: "Status", format: "status" },
  { key: "have", label: "What we have", format: "text" },
  { key: "next", label: "Next step", format: "text" },
] as const;

const partial = "partial month";

export default function ProgressPage() {
  return (
    <div className={`min-h-screen bg-white ${overpassMono.variable}`}>
      <article className={`px-6 py-12 max-w-5xl mx-auto ${s.page}`}>
        <h1>Progress</h1>
        <p className={s.lead}>
          How Public AI has grown since launch on 2 September 2025. Snapshot of 16 November 2026.
        </p>
        <p>
          Three questions. Are people using the products? Are people and organisations joining the movement? Is
          public AI spreading as an idea? Each pillar has one or two headline numbers, then the detail below.
        </p>

        <ProgressPillars
          d30Label="last 30 days"
          avgLabel="Avg month, past year"
          launchLabel="Since launch"
          notConnected="Not connected yet"
          coverageLabel="{n} of {total} metrics connected"
        />
        <p>
          Last 30 days runs from 18 October to 16 November 2026, and past 12 months from 16 November 2025. The
          average is over full months only.
        </p>

        <h2>Products</h2>
        <p>
          In the last 30 days LiteLLM served <ProgressFigure name="tokens_30" format="big" /> tokens.
          chat.publicai.co had <ProgressFigure name="active_30" /> active users and gained{" "}
          <ProgressFigure name="users_30" /> sign-ups, and publicai.co had <ProgressFigure name="visitors_30" />{" "}
          visitors, against <ProgressFigure name="visitors_avg" /> in an average full month of the past year.
        </p>
        <ProgressScorecard label="Products scorecard" empty="no data" pillar="products" columns={scorecardColumns} />
        <p>
          Visitors are unique visitors per window from Vercel Web Analytics, so they can&apos;t be added up across
          months. Email counts are threads, dated by their first message. hello@ counts all inbound mail, not only
          support requests.
        </p>

        <h3>Tokens served</h3>
        <p>
          Daily usage by team and model from LiteLLM. LiteLLM lists the same model under many names, so names are
          grouped into model families. Spend is LiteLLM&apos;s own cost estimate, not revenue.
        </p>
        <ProgressGrid>
          <ProgressChart series="tokens" title="Tokens per month" unit="tokens" format="big" partialLabel={partial} />
          <ProgressChart series="llm_requests" title="Requests per month" unit="requests" format="kilo" partialLabel={partial} />
        </ProgressGrid>
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
        <ProgressTable
          table="llm_family"
          label="Tokens by model family"
          columns={[{ key: "name", label: "Model family", format: "text" }, ...windowColumns]}
        />
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
            partialLabel={partial}
          />
        </ProgressGrid>
        <p>
          LiteLLM tokens on the Open WebUI team, divided by messages sent in chat.publicai.co. A jump means traffic
          other than chat is using that team&apos;s key.
        </p>

        <h3>chat.publicai.co</h3>
        <p>
          Active users sent at least one message in the month. Counts come from Open WebUI&apos;s admin API; no names
          or emails are stored.
        </p>
        <ProgressGrid>
          <ProgressChart series="signups" title="New sign-ups per month" unit="sign-ups" partialLabel={partial} />
          <ProgressChart series="active_users" title="Active users per month" unit="active users" partialLabel={partial} />
          <ProgressChart series="chat_messages" title="Chat messages per month" unit="messages" partialLabel={partial} />
        </ProgressGrid>

        <h3>Where chat users are</h3>
        <p>
          chat.publicai.co has registered users in <ProgressFigure name="countries_launch" /> countries, and people in <ProgressFigure name="countries_30" /> of them were active in the last 30 days. <ProgressFigure name="country_outside_ch_pct" />% of users with a known country are outside Switzerland.
        </p>
        <ProgressBars table="countries" labelKey="name" valueKey="users" shareKey="share" title="Registered chat users by country" />
        <ProgressTable
          table="countries"
          label="Chat users by country"
          columns={[
            { key: "name", label: "Country", format: "text" },
            { key: "users", label: "Registered", format: "int" },
            { key: "share", label: "Share", format: "pct" },
            { key: "new_30", label: "New, last 30 days", format: "int" },
            { key: "active_30", label: "Active, last 30 days", format: "int" },
          ]}
        />
        <p>
          The country comes from the timezone each user’s browser reported, mapped with the tz database. It is where their clock is set, not their nationality or exact location. <ProgressFigure name="country_known_pct" />% of users have a timezone with a country; the rest set none, or set UTC.
        </p>

        <h3>publicai.co and email</h3>
        <ProgressGrid>
          <ProgressChart series="visitors" title="publicai.co unique visitors per month" unit="visitors" partialLabel={partial} />
          <ProgressChart series="hello" title="Threads to hello@publicai.co" unit="threads" partialLabel={partial} />
        </ProgressGrid>

        <h2>Movement</h2>
        <p>
          The Public AI Slack has <ProgressFigure name="slack_members" /> members.{" "}
          <ProgressFigure name="slack_posting_30" /> of them posted in the last 30 days and{" "}
          <ProgressFigure name="slack_active_30" /> were active, reading or posting.{" "}
          <ProgressFigure name="slack_joined_30" /> people joined. Partners and events are not counted yet.
        </p>
        <ProgressScorecard label="Movement scorecard" empty="no data" pillar="movement" columns={scorecardColumns} />
        <ProgressGrid>
          <ProgressChart series="slack_posting" title="Slack members posting, past 30 days" unit="people" partialLabel="to date" />
          <ProgressChart series="slack_joined" title="New Slack members per month" unit="new members" partialLabel={partial} />
          <ProgressChart series="slack_messages" title="Slack messages per month" unit="messages" partialLabel={partial} />
        </ProgressGrid>
        <p>
          Posting and active counts are Slack&apos;s own rolling 30-day figures, taken on the last day of each month,
          from its analytics export. New members counts every account created, including ones since deactivated.
        </p>

        <h3>GitHub</h3>
        <ProgressGrid>
          <ProgressChart series="issues" title="GitHub issues opened" unit="issues" partialLabel={partial} />
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

        <h2>Idea</h2>
        <p>
          In the last 30 days, <ProgressFigure name="papers_30" /> new papers used the phrase “public AI” in their title or abstract, against <ProgressFigure name="papers_y1" /> in the past year. Google search interest in the phrase averaged <ProgressFigure name="search_30" />, against <ProgressFigure name="search_y1" /> over the past year.
        </p>
        <ProgressScorecard label="Idea scorecard" empty="no data" pillar="idea" columns={scorecardColumns} />
        <ProgressGrid>
          <ProgressChart series="papers" title="Papers using “public AI”" unit="papers" partialLabel={partial} />
          <ProgressChart series="search_interest" title="Google search interest in “public AI”" unit="index" partialLabel={partial} />
          <ProgressChart series="newsletter_posts" title="Public AI newsletter posts" unit="posts" partialLabel={partial} />
          <ProgressChart series="publications" title="publicai.network publications list" unit="publications" partialLabel={partial} />
        </ProgressGrid>
        <p>
          Papers come from OpenAlex. It counts the phrase, so it also catches “public AI tools” and companies named PublicAI: read it as a trend. News articles from GDELT are next. Google search interest is an index where 100 is the peak week since January 2024, not a number of searches. UK Parliament has used the phrase <ProgressFigure name="hansard_total" /> times in Hansard, all in the Lords.
        </p>

        <h2>Milestones</h2>
        <ProgressTimeline label="Milestones" />

        <h2>Source coverage</h2>
        <p>
          What each metric is built from today, and what it takes to fill the gaps. <ProgressFigure name="missing" />{" "}
          of the <ProgressFigure name="total" /> metrics have no data source yet. The data is built by the scripts in
          the shared <code>forpublicai/progress</code> repository.
        </p>
        <h3>Products</h3>
        <ProgressTable table="coverage" pillar="products" label="Products coverage" columns={coverageColumns} />
        <h3>Movement</h3>
        <ProgressTable table="coverage" pillar="movement" label="Movement coverage" columns={coverageColumns} />
        <h3>Idea</h3>
        <ProgressTable table="coverage" pillar="idea" label="Idea coverage" columns={coverageColumns} />
      </article>
      <Footer />
    </div>
  );
}

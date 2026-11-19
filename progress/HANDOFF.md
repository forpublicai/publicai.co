# Handoff: state on 18 Nov 2026

Notes for whoever picks this up next, human or agent. Delete the file once it's out of date.

## Where things stand

- `/progress` is live on publicai.ch (forpublicai/publicai.ch, merged in PR 12) and publicai.co (forpublicai/publicai.co, merged in PR 21). Both pages are `noindex`. Each still carries **its own copy** of the components and of `progress.json`:
  - publicai.ch: `content/cooperative/progress.mdx`, `src/components/mdx/progress.tsx`, `.progress-*` CSS in `src/styles/global.css`, `tools/progress/`, `src/data/progress.json`
  - publicai.co: `src/app/progress/page.tsx`, `src/components/progress/` (CSS module port), `src/data/progress.json`
- This repo now holds the pipeline, the metric spec for the three pillars, and a shared component (`react/Progress.tsx` with `ProgressPillars` and `ProgressTimeline` added). Neither site uses it yet.
- `data/progress.json` matches the live sites' numbers (as of 16 Nov 2026), plus `pillars`, `milestones` and the new coverage list. One difference: topline monthly averages use full months in the past year, so the tokens average is 1.70B here against 1.89B (past-year total ÷ 12) in the live page text.

## Next steps, in order

1. **Move the sites onto the subtree.**
   - **publicai.ch:**
     - Run `git subtree add --prefix=progress ...`.
     - Point `src/components/mdx/progress.tsx` at `progress/react/Progress.tsx`, or re-export from it.
     - Register `ProgressPillars` and `ProgressTimeline` in **both** `src/components/mdx/index.ts` and `REGISTRY_EXPORTS` in `src/lib/vite-mdx-locale-split.ts`. Missing the second gives "Expected component X to be defined" at build.
     - Replace the `.progress-*` block in `global.css` with an import of `progress/react/progress.css`.
     - Delete `tools/progress/`.
     - Gates: `yarn lint && yarn typecheck && yarn test && yarn build`.
     - Keep visible text in MDX locale sections.
   - **publicai.co:**
     - Run the same subtree add.
     - Swap the CSS-module port for `progress/react/Progress.tsx` and `progress.css`.
     - Load Overpass Mono via `next/font` and set `--progress-mono` to its variable.
     - Its CLAUDE.md requires `npm run build` before every commit, and **no co-author lines** in commit messages.
   - **publicai.network** (Jekyll, forpublicai/publicai.network, read-only in the last session):
     - Option one: add `progress/data/progress.json` as a Jekyll data file and write a Liquid page.
     - Option two: have `build.py` also emit a static HTML fragment, by rendering the React components with Node, and `{% include %}` it.
     - The second keeps all three sites identical.
2. **Restructure the page** into the three pillars:
   - `ProgressPillars` at the top
   - then a section per pillar with its charts and tables
   - then `ProgressTimeline`
   - then the coverage table, grouped by pillar
3. **Idea collectors.** These need the **"Public AI progress"** cloud environment, which allows api.openalex.org, api.gdeltproject.org, public.api.bsky.app, api.semanticscholar.org, hansard-api.parliament.uk and publicai.substack.com.
   - GDELT DOC API: `mode=timelinevolraw`, exact phrase `"public AI"`, monthly. Check a sample of articles by hand: the phrase catches "public AI tools" and companies called PublicAI.
   - OpenAlex: works with the exact phrase, grouped by `publication_year`.
   - Hansard: spoken contributions containing the phrase.
   - Bluesky: `app.bsky.feed.searchPosts`, counts per month.
   - Substack: posts per month from `https://publicai.substack.com/feed`. Subscriber counts are not public: type them into `records/audience.json`.
4. **Keys in the new environment.** The LiteLLM key (host api-internal.publicai.co, `Authorization: Bearer`) and Open WebUI admin key (host chat.publicai.co) were saved on the Default environment only. Add them again as network secrets.
5. **Public AI Slack.** Josh is creating a bot token. The connected Slack connector is **Current AI's**, not Public AI's, so don't use it. The same goes for the connected Notion. Counts only: distinct posters per week, joins per month.
6. **Fill `records/`** with milestones, partners, events and notable mentions. One example to add: Mistral's full-page ad in The Times that named public AI (Nov 2026; the date and URL still need to be found). The publications list on publicai.network stops at Sep 2025 and needs updating, otherwise the Idea topline reads near zero.
7. **Weekly refresh.** A GitHub Action in this repo can run the collectors that have API access and `build.py`. Sites then `git subtree pull`.

## Open problems

- **LiteLLM API returns HTTP 500** for every authenticated request, on every route, including `/v1/models` and from Josh's own terminal.
  - The proxy is api-internal.publicai.co, which runs LiteLLM v1.92.0 behind Cloudflare and an ALB.
  - The admin UI also shows no data.
  - The custom auth hook is the likely cause: `charts/platform/charts/litellm/custom_auth.py` in forpublicai/chat.publicai.co.
  - Until it's fixed, data comes from the admin UI's CSV export, through `litellm_usage.py --csv` and then `litellm_daily.py`.
- **Cloudflare error 1010** blocks Python's default user agent, so every collector must send its own `User-Agent`.
- **publicai.ch visitors:** no source. Infomaniak has no API connector; the options are a CSV export or a cookieless analytics script.
- **dialogue.publicai.ch:** the host didn't resolve, and the survey was paused in Apr 2026.
- **support@:** only threads that also reached hello@ are counted. Joseph's inbox isn't included.

## Anomalies worth a human look

- **Open WebUI team traffic.** LiteLLM tokens per chat message on the Open WebUI team jumped from Sep 2026, so something other than chat is likely using that team's key.
- **Sign-up spike.** Nov 2026 had about 2,200 sign-ups in 16 days while active users fell, which may be bots.
- **Visitors.** publicai.co traffic roughly halved in Apr 2026.
- **Failed requests.** About 17% of LiteLLM requests failed in the last 30 days.

## Privacy

- **Public page.** The live pages show LiteLLM spend, team names, the key anomaly note and support counts. Decide whether those stay public.
- **What snapshots hold.** Snapshots keep dates and counts only. The GitHub snapshot also has public issue titles.

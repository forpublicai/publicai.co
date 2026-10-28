# Public AI Network (`publicai.network`) → `publicai.co/research` Transition Guide

**For:** Content Editors, Maintainers, and Owner of `publicai.network`  
**Purpose:** Everything you need to know about moving the Public AI Network site into `https://publicai.co/research`, how your existing links will continue to work, and how to edit or add content in the new repository using standard Markdown.

---

## 1. What Is Changing (and Why)

We are bringing the **Public AI Network** (`https://publicai.network`) and the **Public AI Inference Utility** (`https://publicai.co`) together under one unified home at **`https://publicai.co`**:

- **Your Research Hub Now Lives at `https://publicai.co/research`:** All pages from `publicai.network`—the Research Seminar, Publications & Whitepaper, News, Jobs, Contributing, Advisory Board, and Working Group pages—now live under the **Research** tab of `publicai.co`.
- **The Public AI Kiosk (Libraries Project) Gets Both a Product Page & Story Page:**
  - Product overview for library partners: `https://publicai.co/kiosks`
  - Full project write-up (`libraries.md`): `https://publicai.co/projects/libraries`
- **All Old `publicai.network` Links Keep Working Forever:** Anyone clicking an old link (from a tweet, academic paper, PDF, or bookmark) to `https://publicai.network/...` will be automatically and permanently (`301`) redirected to the exact corresponding page on `https://publicai.co/...`.

---

## 2. How to Edit Content (Still 100% Markdown!)

You do **not** need to learn React or web development to update pages, add publications, post news items, or update the seminar schedule.

We kept the folder structure inside `/content/research/` in the `publicai.co` repository almost identical to the old `publicai.network` Jekyll repository:

| Old `publicai.network` Path | New `publicai.co` Repository Path | Live URL on `publicai.co` |
| :--- | :--- | :--- |
| `index.md` | `content/research/index.mdx` | `https://publicai.co/research` |
| `seminar.md` | `content/research/seminar.mdx` | `https://publicai.co/research/seminar` |
| `publications.md` | `content/research/publications.mdx` | `https://publicai.co/research/publications` |
| `news.md` + `_data/news.yml` | `content/research/news.mdx` + `content/research/_data/news.yml` | `https://publicai.co/research/news` |
| `contributing.md` | `content/research/contributing.mdx` | `https://publicai.co/research/contributing` |
| `advisory.md` + `_data/advisory.yml` | `content/research/advisory-board.mdx` + `content/research/_data/advisory.yml` | `https://publicai.co/research/advisory-board` |
| `handbook.md` + `maintainers.md` + `contributors.md` | `content/research/handbook.mdx` | `https://publicai.co/research/handbook` |
| `jobs/index.md` + `_jobs/*.md` | `content/research/jobs/index.mdx` + `content/research/jobs/*.mdx` | `https://publicai.co/research/jobs` |
| `libraries.md` | `content/projects/libraries.mdx` | `https://publicai.co/projects/libraries` |
| `PublicAIwhitepaper.pdf` | `public/PublicAIwhitepaper.pdf` | `https://publicai.co/PublicAIwhitepaper.pdf` |
| `assets/*` | `public/assets/network/*` | `https://publicai.co/assets/network/*` |

### Common Editing Tasks (Directly on GitHub Web UI)

1. **Adding a News Item:**
   - Open `content/research/_data/news.yml` on GitHub, click the pencil icon (Edit), add a new entry with `date`, `headline`, `outlet`, and `url`, and commit/open a PR.
2. **Updating the Research Seminar Schedule:**
   - Open `content/research/seminar.mdx` on GitHub, edit the Markdown table or speaker list just like before, and commit/open a PR.
3. **Adding a Job Posting:**
   - Add a `.mdx` file in `content/research/jobs/` with standard YAML frontmatter (`title`, `organization`, `location`, `url`).
4. **Publishing a New Project, Case Study, or Blog Post:**
   - Create a new `.mdx` file in `content/projects/your-post-slug.mdx`:
     ```yaml
     ---
     title: "Your Post Title"
     datePublished: "2026-11-01"
     category: "Projects & Case Studies" # or "Partner Work", "Model Launches", "Essays & Policy"
     author: "Your Name"
     authorRole: "Public AI Network"
     description: "A 1-2 sentence summary that also powers LinkedIn preview cards."
     tags: ["Research", "Libraries"]
     ---

     Write your normal Markdown content here!
     ```

---

## 3. Complete URL Redirect Map (`publicai.network` → `publicai.co`)

Every link below is automatically redirected (`301 Moved Permanently`):

| Old `publicai.network` URL | Redirects To (`publicai.co`) |
| :--- | :--- |
| `https://publicai.network/` | `https://publicai.co/research` |
| `https://publicai.network/seminar` | `https://publicai.co/research/seminar` |
| `https://publicai.network/publications` | `https://publicai.co/research/publications` |
| `https://publicai.network/PublicAIwhitepaper.pdf` | `https://publicai.co/PublicAIwhitepaper.pdf` |
| `https://publicai.network/whitepaper` | `https://publicai.co/PublicAIwhitepaper.pdf` |
| `https://publicai.network/news` | `https://publicai.co/research/news` |
| `https://publicai.network/contributing` | `https://publicai.co/research/contributing` |
| `https://publicai.network/advisory-board/` | `https://publicai.co/research/advisory-board` |
| `https://publicai.network/handbook` | `https://publicai.co/research/handbook` |
| `https://publicai.network/maintainers` | `https://publicai.co/research/handbook#maintainers` |
| `https://publicai.network/contributors` | `https://publicai.co/research/handbook#contributors` |
| `https://publicai.network/jobs/` & `/jobs/<slug>/` | `https://publicai.co/research/jobs` (or `/research/jobs/<slug>`) |
| `https://publicai.network/libraries` | `https://publicai.co/kiosks` (links directly to `/projects/libraries`) |
| `https://publicai.network/journalism` | `https://publicai.co/projects/journalism` |
| `https://publicai.network/creative/` | `https://publicai.co/projects/creative` |
| `https://publicai.network/cursor-demo` | `https://publicai.co/projects/cursor-demo` |
| `https://publicai.network/maine/` | `https://publicai.co/projects/maine` |
| `https://publicai.network/sail/` | `https://publicai.co/projects/sail` |
| `https://publicai.network/sail/blog/decoding-sovereign-ai/` | `https://publicai.co/projects/decoding-sovereign-ai` |
| `https://publicai.network/procurement` | `https://publicai.co/projects/procurement` |
| `https://publicai.network/fiction` | `https://publicai.co/projects/fiction` |
| `https://publicai.network/assets/<path>` | `https://publicai.co/assets/network/<path>` |

---

## 4. DNS Cutover Checklist for the `.network` Domain Owner

Once you have reviewed `https://publicai.co/research` and confirmed everything looks great, the cutover takes less than 10 minutes and has zero downtime:

1. **Before DNS Changes:** We will add `publicai.network` and `www.publicai.network` as domain aliases on our `publicai.co` hosting project so SSL certificates are pre-provisioned, and activate the redirect middleware inside `publicai.co`.
2. **Update DNS Records at the `publicai.network` Registrar:**
   - Remove the existing GitHub Pages `A` records (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`).
   - Point the root `@` (`publicai.network`) and `www` (`www.publicai.network`) records to the `publicai.co` edge target (or Cloudflare Redirect Rules, if preferred).
3. **Archive the Old GitHub Pages Repo:**
   - Remove the `CNAME` file in the `publicai.network` GitHub repository, disable GitHub Pages in repository settings, and update the `README.md` with a pointer to the `publicai.co` repository (`content/research/`).

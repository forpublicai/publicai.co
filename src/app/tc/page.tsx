import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function TermsPage() {
  const filePath = path.join(process.cwd(), "content", "tc.md");
  const markdown = fs.readFileSync(filePath, "utf-8");

  return (
    <main className="min-h-screen bg-white">
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <article className="prose prose-gray prose-lg max-w-none prose-headings:scroll-mt-20">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
          </article>
        </div>
      </section>
    </main>
  );
}

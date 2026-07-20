import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader, formatDate } from "@/components/SiteHeader";
import { getPostBySlug } from "@/lib/posts";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.published) {
    return { title: "Tulisan tidak ditemukan" };
  }
  return {
    title: `${post.title} | Atanasiu.dev`,
    description: post.excerpt || post.title,
  };
}

function renderParagraphs(content: string) {
  return content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => (
      <p key={index} className="whitespace-pre-line">
        {block}
      </p>
    ));
}

export default async function TulisanDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.published) notFound();

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100">
      <SiteHeader active="tulisan" />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link
          href="/tulisan"
          className="text-sm text-slate-400 transition hover:text-white"
        >
          ← Semua tulisan
        </Link>
        <article className="mt-6">
          <p className="text-sm text-slate-500">{formatDate(post.createdAt)}</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {post.title}
          </h1>
          <div className="prose-invert mt-8 space-y-5 text-base leading-relaxed text-slate-300 sm:text-lg">
            {renderParagraphs(post.content)}
          </div>
        </article>
      </main>
    </div>
  );
}

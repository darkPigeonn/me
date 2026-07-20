import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader, formatDate } from "@/components/SiteHeader";
import { listPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tulisan | Atanasiu.dev",
  description: "Artikel dan catatan dari Atanasiu Ivannoel tentang software, otomatisasi, dan bisnis.",
};

export default async function TulisanPage() {
  const posts = await listPosts({ publishedOnly: true });

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100">
      <SiteHeader active="tulisan" />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Tulisan
          </h1>
          <p className="mt-3 max-w-xl text-slate-400">
            Catatan seputar pembuatan aplikasi, otomatisasi WhatsApp, dan solusi
            digital untuk bisnis.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 px-6 py-14 text-center">
            <p className="text-slate-400">Belum ada tulisan yang dipublikasikan.</p>
            <Link
              href="/"
              className="mt-4 inline-block text-sm text-indigo-400 hover:underline"
            >
              Kembali ke beranda
            </Link>
          </div>
        ) : (
          <ul className="space-y-6">
            {posts.map((post) => (
              <li key={post.id}>
                <article className="group border-b border-slate-800 pb-6">
                  <p className="text-xs text-slate-500">{formatDate(post.createdAt)}</p>
                  <h2 className="mt-2 text-xl font-semibold text-white transition group-hover:text-indigo-300">
                    <Link href={`/tulisan/${post.slug}`}>{post.title}</Link>
                  </h2>
                  {post.excerpt ? (
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {post.excerpt}
                    </p>
                  ) : null}
                  <Link
                    href={`/tulisan/${post.slug}`}
                    className="mt-3 inline-flex text-sm font-medium text-indigo-400 hover:text-indigo-300"
                  >
                    Baca selengkapnya →
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

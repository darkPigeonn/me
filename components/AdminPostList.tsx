"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Post } from "@/lib/posts";
import { formatDate } from "@/components/SiteHeader";

export function AdminPostList({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function remove(id: string, title: string) {
    if (!confirm(`Hapus tulisan "${title}"?`)) return;
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Gagal menghapus.");
        return;
      }
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setBusyId(null);
    }
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-12 text-center">
        <p className="text-slate-300">Belum ada tulisan.</p>
        <Link
          href="/admin/posts/new"
          className="mt-4 inline-flex rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Buat tulisan pertama
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error ? (
        <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          {error}
        </p>
      ) : null}
      {posts.map((post) => (
        <article
          key={post.id}
          className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-base font-semibold text-white">
                {post.title}
              </h2>
              <span
                className={
                  post.published
                    ? "rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-400"
                    : "rounded-full bg-slate-700/60 px-2 py-0.5 text-xs text-slate-400"
                }
              >
                {post.published ? "Published" : "Draft"}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {formatDate(post.updatedAt)} · /tulisan/{post.slug}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.published ? (
              <Link
                href={`/tulisan/${post.slug}`}
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800"
              >
                Lihat
              </Link>
            ) : null}
            <Link
              href={`/admin/posts/${post.id}/edit`}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800"
            >
              Edit
            </Link>
            <button
              type="button"
              disabled={busyId === post.id}
              onClick={() => remove(post.id, post.title)}
              className="rounded-lg border border-rose-500/40 px-3 py-1.5 text-sm text-rose-300 hover:bg-rose-500/10 disabled:opacity-60"
            >
              {busyId === post.id ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

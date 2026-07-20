"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  mode: "create" | "edit";
  postId?: string;
  initial?: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    published: boolean;
  };
};

export function PostEditor({ mode, postId, initial }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [published, setPublished] = useState(initial?.published ?? false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = {
        title,
        slug: slug || undefined,
        excerpt,
        content,
        published,
      };

      const response = await fetch(
        mode === "create" ? "/api/posts" : `/api/posts/${postId}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Gagal menyimpan tulisan.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm text-slate-300">
          Judul
        </label>
        <input
          id="title"
          required
          minLength={3}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
          placeholder="Judul tulisan"
        />
      </div>

      <div>
        <label htmlFor="slug" className="mb-1.5 block text-sm text-slate-300">
          Slug URL <span className="text-slate-500">(opsional)</span>
        </label>
        <input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 font-mono text-sm text-white outline-none transition focus:border-indigo-500"
          placeholder="otomatis-dari-judul"
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="mb-1.5 block text-sm text-slate-300">
          Ringkasan <span className="text-slate-500">(opsional)</span>
        </label>
        <textarea
          id="excerpt"
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="w-full resize-y rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
          placeholder="Cuplikan singkat untuk daftar tulisan"
        />
      </div>

      <div>
        <label htmlFor="content" className="mb-1.5 block text-sm text-slate-300">
          Isi tulisan
        </label>
        <textarea
          id="content"
          required
          minLength={10}
          rows={14}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full resize-y rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 font-mono text-sm leading-relaxed text-white outline-none transition focus:border-indigo-500"
          placeholder="Tulis konten di sini. Paragraf dipisah baris kosong."
        />
        <p className="mt-1.5 text-xs text-slate-500">
          Tip: pisahkan paragraf dengan baris kosong. Tidak perlu HTML.
        </p>
      </div>

      <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="size-4 rounded border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
        />
        Publikasikan sekarang (tampil di halaman Tulisan)
      </label>

      {error ? (
        <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : mode === "create" ? "Buat tulisan" : "Simpan perubahan"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

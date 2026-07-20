import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { PostEditor } from "@/components/PostEditor";
import { getPostById } from "@/lib/posts";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100">
      <SiteHeader active="admin" />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-6">
          <Link
            href="/admin"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            ← Kembali ke daftar
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-white">Edit tulisan</h1>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
          <PostEditor
            mode="edit"
            postId={post.id}
            initial={{
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt,
              content: post.content,
              published: post.published,
            }}
          />
        </div>
      </main>
    </div>
  );
}

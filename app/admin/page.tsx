import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { LogoutButton } from "@/components/LogoutButton";
import { AdminPostList } from "@/components/AdminPostList";
import { listPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const posts = await listPosts();

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100">
      <SiteHeader active="admin" />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Kelola Tulisan</h1>
            <p className="mt-1 text-sm text-slate-400">
              Buat, edit, atau hapus tulisan yang tampil di website.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/posts/new"
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500"
            >
              + Tulisan baru
            </Link>
            <LogoutButton />
          </div>
        </div>
        <AdminPostList posts={posts} />
      </main>
    </div>
  );
}

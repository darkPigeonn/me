import { NextResponse } from "next/server";
import { z } from "zod";
import { isAuthenticated } from "@/lib/auth";
import { deletePost, getPostById, updatePost } from "@/lib/posts";

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  content: z.string().min(10).optional(),
  excerpt: z.string().optional(),
  slug: z.string().optional(),
  published: z.boolean().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) {
    return NextResponse.json({ error: "Tulisan tidak ditemukan." }, { status: 404 });
  }

  if (!post.published && !(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ post });
}

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    const post = await updatePost(id, parsed.data);
    if (!post) {
      return NextResponse.json({ error: "Tulisan tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: "Gagal memperbarui tulisan." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const ok = await deletePost(id);
  if (!ok) {
    return NextResponse.json({ error: "Tulisan tidak ditemukan." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

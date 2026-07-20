import { NextResponse } from "next/server";
import { z } from "zod";
import { isAuthenticated } from "@/lib/auth";
import { createPost, listPosts } from "@/lib/posts";

const createSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  content: z.string().min(10, "Isi tulisan minimal 10 karakter"),
  excerpt: z.string().optional(),
  slug: z.string().optional(),
  published: z.boolean().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "1";

  if (all) {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const posts = await listPosts();
    return NextResponse.json({ posts });
  }

  const posts = await listPosts({ publishedOnly: true });
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    const post = await createPost(parsed.data);
    return NextResponse.json({ post }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal membuat tulisan." }, { status: 500 });
  }
}

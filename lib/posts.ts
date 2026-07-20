import { randomUUID } from "crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { slugify } from "./slug";

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

type Store = { posts: Post[] };

const DATA_DIR = path.join(/* turbopackIgnore: true */ process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "posts.json");

function ensureStore(): Store {
  mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(DATA_FILE)) {
    const empty: Store = { posts: [] };
    writeFileSync(DATA_FILE, JSON.stringify(empty, null, 2), "utf8");
    return empty;
  }
  const raw = readFileSync(DATA_FILE, "utf8");
  return JSON.parse(raw) as Store;
}

function saveStore(store: Store) {
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf8");
}

function uniqueSlug(posts: Post[], base: string, excludeId?: string) {
  let candidate = base || "tulisan";
  let n = 2;
  while (
    posts.some((p) => p.slug === candidate && p.id !== excludeId)
  ) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  return candidate;
}

export async function listPosts(options?: { publishedOnly?: boolean }) {
  const store = ensureStore();
  const posts = [...store.posts].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );
  if (options?.publishedOnly) {
    return posts.filter((p) => p.published);
  }
  return posts;
}

export async function getPostById(id: string) {
  const store = ensureStore();
  return store.posts.find((p) => p.id === id) ?? null;
}

export async function getPostBySlug(slug: string) {
  const store = ensureStore();
  return store.posts.find((p) => p.slug === slug) ?? null;
}

export async function createPost(input: {
  title: string;
  excerpt?: string;
  content: string;
  published?: boolean;
  slug?: string;
}) {
  const store = ensureStore();
  const now = new Date().toISOString();
  const title = input.title.trim();
  const content = input.content;
  const excerpt =
    input.excerpt?.trim() ||
    content.trim().slice(0, 160).replace(/\s+/g, " ");
  const slug = uniqueSlug(store.posts, slugify(input.slug || title));

  const post: Post = {
    id: randomUUID(),
    title,
    slug,
    excerpt,
    content,
    published: Boolean(input.published),
    createdAt: now,
    updatedAt: now,
  };

  store.posts.unshift(post);
  saveStore(store);
  return post;
}

export async function updatePost(
  id: string,
  input: {
    title?: string;
    excerpt?: string;
    content?: string;
    published?: boolean;
    slug?: string;
  }
) {
  const store = ensureStore();
  const index = store.posts.findIndex((p) => p.id === id);
  if (index < 0) return null;

  const existing = store.posts[index];
  const title = input.title?.trim() ?? existing.title;
  const content = input.content ?? existing.content;
  const excerpt =
    input.excerpt?.trim() ??
    existing.excerpt ??
    content.trim().slice(0, 160).replace(/\s+/g, " ");
  const published =
    typeof input.published === "boolean" ? input.published : existing.published;
  const slug = uniqueSlug(
    store.posts,
    slugify(input.slug || title),
    id
  );

  const updated: Post = {
    ...existing,
    title,
    slug,
    excerpt,
    content,
    published,
    updatedAt: new Date().toISOString(),
  };

  store.posts[index] = updated;
  saveStore(store);
  return updated;
}

export async function deletePost(id: string) {
  const store = ensureStore();
  const before = store.posts.length;
  store.posts = store.posts.filter((p) => p.id !== id);
  if (store.posts.length === before) return false;
  saveStore(store);
  return true;
}

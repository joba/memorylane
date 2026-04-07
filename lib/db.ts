import { neon } from "@neondatabase/serverless";
import type {
  User,
  UserRole,
  Question,
  QuestionWithMeta,
  Story,
  Photo,
  StoryWithPhotos,
} from "@/types";

type SqlFn = (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<Record<string, unknown>[]>;

let _sql: SqlFn | null = null;

function getSql(): SqlFn {
  if (!_sql) _sql = neon(process.env.DATABASE_URL!) as unknown as SqlFn;
  return _sql;
}

export interface DbUser extends User {
  password_hash: string;
  created_at: string;
}

export const db = {
  // ── Auth ────────────────────────────────────────────────────────────────

  async getUserByEmail(email: string): Promise<DbUser | null> {
    const rows = await getSql()`
      SELECT id, name, email, role, password_hash, created_at
      FROM users
      WHERE email = ${email}
    `;
    return (rows[0] as unknown as DbUser) ?? null;
  },

  // ── Admin ────────────────────────────────────────────────────────────────

  async getAllUsers(): Promise<(User & { created_at: string })[]> {
    const rows = await getSql()`
      SELECT id, name, email, role, created_at
      FROM users
      ORDER BY created_at DESC
    `;
    return rows as unknown as (User & { created_at: string })[];
  },

  async createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
  }): Promise<User> {
    const rows = await getSql()`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (${data.name}, ${data.email}, ${data.passwordHash}, ${data.role})
      RETURNING id, name, email, role
    `;
    return rows[0] as unknown as User;
  },

  async deleteUser(id: string): Promise<void> {
    await getSql()`DELETE FROM users WHERE id = ${id}`;
  },

  // ── Questions ────────────────────────────────────────────────────────────

  async getQuestions(): Promise<QuestionWithMeta[]> {
    const rows = await getSql()`
      SELECT
        q.id, q.author_id, q.title, q.description, q.created_at,
        u.name AS author_name,
        (s.id IS NOT NULL) AS has_story
      FROM questions q
      JOIN users u ON u.id = q.author_id
      LEFT JOIN stories s ON s.question_id = q.id
      ORDER BY q.created_at DESC
    `;
    return rows as unknown as QuestionWithMeta[];
  },

  async getQuestionById(
    id: string
  ): Promise<(Question & { author_name: string }) | null> {
    const rows = await getSql()`
      SELECT q.id, q.author_id, q.title, q.description, q.created_at,
             u.name AS author_name
      FROM questions q
      JOIN users u ON u.id = q.author_id
      WHERE q.id = ${id}
    `;
    return (rows[0] as unknown as Question & { author_name: string }) ?? null;
  },

  async createQuestion(data: {
    authorId: string;
    title: string;
    description: string | null;
  }): Promise<Question> {
    const rows = await getSql()`
      INSERT INTO questions (author_id, title, description)
      VALUES (${data.authorId}, ${data.title}, ${data.description})
      RETURNING id, author_id, title, description, created_at
    `;
    return rows[0] as unknown as Question;
  },

  // ── Stories ──────────────────────────────────────────────────────────────

  async getStoryByQuestionId(
    questionId: string
  ): Promise<StoryWithPhotos | null> {
    const storyRows = await getSql()`
      SELECT s.id, s.question_id, s.author_id, s.body, s.created_at, s.updated_at,
             u.name AS author_name
      FROM stories s
      JOIN users u ON u.id = s.author_id
      WHERE s.question_id = ${questionId}
    `;
    if (!storyRows[0]) return null;

    const story = storyRows[0] as unknown as Story & { author_name: string };
    const photoRows = await getSql()`
      SELECT id, story_id, blob_url, caption, sort_order, created_at
      FROM photos
      WHERE story_id = ${story.id}
      ORDER BY sort_order ASC
    `;
    return { ...story, photos: photoRows as unknown as Photo[] };
  },

  async createStory(data: {
    questionId: string;
    authorId: string;
    body: string;
  }): Promise<Story> {
    const rows = await getSql()`
      INSERT INTO stories (question_id, author_id, body)
      VALUES (${data.questionId}, ${data.authorId}, ${data.body})
      RETURNING id, question_id, author_id, body, created_at, updated_at
    `;
    return rows[0] as unknown as Story;
  },

  async createPhoto(data: {
    storyId: string;
    blobUrl: string;
    caption?: string;
    sortOrder: number;
  }): Promise<Photo> {
    const rows = await getSql()`
      INSERT INTO photos (story_id, blob_url, caption, sort_order)
      VALUES (${data.storyId}, ${data.blobUrl}, ${data.caption ?? null}, ${data.sortOrder})
      RETURNING id, story_id, blob_url, caption, sort_order, created_at
    `;
    return rows[0] as unknown as Photo;
  },

  async getUnansweredCount(): Promise<number> {
    const rows = await getSql()`
      SELECT COUNT(*) AS count
      FROM questions q
      LEFT JOIN stories s ON s.question_id = q.id
      WHERE s.id IS NULL
    `;
    return Number((rows[0] as { count: string }).count);
  },
};

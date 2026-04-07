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

export const db = {
  async getUserByClerkId(clerkId: string): Promise<User | null> {
    const rows = await getSql()`
      SELECT id, clerk_id, name, role, created_at
      FROM users
      WHERE clerk_id = ${clerkId}
    `;
    return (rows[0] as unknown as User) ?? null;
  },

  async createUser(data: {
    clerkId: string;
    name: string;
    role: UserRole;
  }): Promise<User> {
    const rows = await getSql()`
      INSERT INTO users (clerk_id, name, role)
      VALUES (${data.clerkId}, ${data.name}, ${data.role})
      RETURNING id, clerk_id, name, role, created_at
    `;
    return rows[0] as unknown as User;
  },

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

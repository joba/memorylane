export type UserRole = "QUESTIONER" | "ANSWERER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Question {
  id: string;
  author_id: string;
  title: string;
  description: string | null;
  created_at: string;
}

export interface QuestionWithMeta extends Question {
  author_name: string;
  has_story: boolean;
}

export interface Story {
  id: string;
  question_id: string;
  author_id: string;
  body: string;
  created_at: string;
  updated_at: string;
}

export interface Photo {
  id: string;
  story_id: string;
  blob_url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

export interface StoryWithPhotos extends Story {
  author_name: string;
  photos: Photo[];
}

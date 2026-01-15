export interface ForumThread {
  id: string;
  lesson_id: string;
  author_id: string;
  title: string;
  body: string;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
  author?: {
    display_name: string | null;
    avatar_url: string | null;
  };
  replies_count?: number;
}

export interface ForumReply {
  id: string;
  thread_id: string;
  author_id: string;
  body: string;
  created_at: string;
  updated_at: string;
  author?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
}

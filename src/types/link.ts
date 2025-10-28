export interface Link {
  id: number;
  title: string;
  url: string;
  description?: string;
  category?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface CreateLinkRequest {
  title: string;
  url: string;
  description?: string;
  category?: string;
}

export interface UpdateLinkRequest {
  title?: string;
  url?: string;
  description?: string;
  category?: string;
}

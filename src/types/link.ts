export interface Link {
  id: number;
  title: string;
  url: string;
  description?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface CreateLinkRequest {
  title: string;
  url: string;
  description?: string;
}

export interface UpdateLinkRequest {
  title?: string;
  url?: string;
  description?: string;
}

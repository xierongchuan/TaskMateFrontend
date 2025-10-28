export interface Dealership {
  id: number;
  name: string;
  address: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateDealershipRequest {
  name: string;
  address?: string;
  phone?: string;
}

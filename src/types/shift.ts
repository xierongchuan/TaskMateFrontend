export type ShiftStatus = 'open' | 'closed';

export interface Shift {
  id: number;
  user_id: number;
  dealership_id: number;
  status: ShiftStatus;
  opened_at: string;
  closed_at: string | null;
  scheduled_start: string | null;
  scheduled_end: string | null;
  is_late: boolean;
  late_minutes: number | null;
  opened_photo: string | null;
  closed_photo: string | null;
  replacement_id: number | null;
  replacement_reason: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    full_name: string;
  };
  replacement?: {
    id: number;
    full_name: string;
  };
}

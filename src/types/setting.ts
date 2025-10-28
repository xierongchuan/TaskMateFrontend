export interface Setting {
  id: number;
  key: string;
  value: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface BotConfig {
  shift_start_time?: string;
  shift_end_time?: string;
  late_tolerance_minutes?: number;
  rows_per_page?: number;
  auto_archive_days?: number;
}

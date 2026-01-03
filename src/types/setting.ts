export type SettingType = 'string' | 'integer' | 'boolean' | 'json' | 'time';

export interface Setting {
  id: number;
  key: string;
  value: string;
  type: SettingType;
  description?: string;
  dealership_id?: number;
  created_at: string;
  updated_at: string;
  dealership?: {
    id: number;
    name: string;
  };
}

// Shift Configuration
export interface ShiftConfig {
  shift_1_start_time?: string;
  shift_1_end_time?: string;
  shift_2_start_time?: string;
  shift_2_end_time?: string;
  late_tolerance_minutes?: number;
  break_duration_minutes?: number;
  work_days?: number[]; // [1,2,3,4,5] for Mon-Fri
  timezone?: string;
}

// Bot Configuration
export interface BotConfig {
  telegram_bot_id?: string;
  telegram_bot_username?: string;
  telegram_webhook_url?: string;
  notification_enabled?: boolean;
  auto_close_shifts?: boolean;
  shift_reminder_minutes?: number;
  maintenance_mode?: boolean;
  // Legacy interface fields
  shift_start_time?: string;
  shift_end_time?: string;
  late_tolerance_minutes?: number;
  rows_per_page?: number;
  auto_archive_days?: number;
  notification_types?: {
    task_overdue?: boolean;
    shift_late?: boolean;
    task_completed?: boolean;
    system_errors?: boolean;
  };
  bot_token?: string;
}

// Dealership-specific settings
export interface DealershipBotConfig {
  dealership_id?: number;
  shift_1_start_time?: string;
  shift_1_end_time?: string;
  shift_2_start_time?: string;
  shift_2_end_time?: string;
  late_tolerance_minutes?: number;
  break_duration_minutes?: number;
}

// Response type for dealership settings with fallback
export interface DealershipSettingsResponse {
  dealership_id: number;
  settings: DealershipBotConfig;
  global_settings: BotConfig;
  inherited_fields: (keyof DealershipBotConfig)[];
}

// Request types for API
export interface CreateSettingRequest {
  key: string;
  value: string | number | boolean | object;
  type: SettingType;
  description?: string;
  dealership_id?: number;
}

export interface UpdateSettingRequest {
  value: string | number | boolean | object;
  type?: SettingType;
  description?: string;
}

export interface UpdateShiftConfigRequest {
  shift_1_start_time?: string;
  shift_1_end_time?: string;
  shift_2_start_time?: string;
  shift_2_end_time?: string;
  late_tolerance_minutes?: number;
  break_duration_minutes?: number;
  dealership_id?: number;
}

export interface UpdateBotConfigRequest {
  telegram_bot_id?: string;
  telegram_bot_username?: string;
  telegram_webhook_url?: string;
  notification_enabled?: boolean;
  auto_close_shifts?: boolean;
  shift_reminder_minutes?: number;
  maintenance_mode?: boolean;
  rows_per_page?: number;
  dealership_id?: number;
  notification_types?: {
    task_overdue?: boolean;
    shift_late?: boolean;
    task_completed?: boolean;
    system_errors?: boolean;
  };
}

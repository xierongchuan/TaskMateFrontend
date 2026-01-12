export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export const TASK_TYPES = {
  INDIVIDUAL: 'individual',
  GROUP: 'group',
} as const;

export const RESPONSE_TYPES = {
  ACKNOWLEDGE: 'acknowledge',
  COMPLETE: 'complete',
} as const;

export const TASK_PRIORITY_LABELS: Record<string, string> = {
  [TASK_PRIORITIES.LOW]: 'Низкий',
  [TASK_PRIORITIES.MEDIUM]: 'Средний',
  [TASK_PRIORITIES.HIGH]: 'Высокий',
};

export const TASK_TYPE_LABELS: Record<string, string> = {
  [TASK_TYPES.INDIVIDUAL]: 'Индивидуальная',
  [TASK_TYPES.GROUP]: 'Групповая',
};

export const RESPONSE_TYPE_LABELS: Record<string, string> = {
  [RESPONSE_TYPES.ACKNOWLEDGE]: 'Уведомление (ОК)',
  [RESPONSE_TYPES.COMPLETE]: 'Выполнение',
};

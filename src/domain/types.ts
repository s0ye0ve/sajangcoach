// 도메인 타입 정의. MVP_구현스펙.md §4 데이터 구조를 그대로 옮김.

export type ItemKey = 'businessHours' | 'holiday' | 'photos' | 'news' | 'reviewReply';

export const ITEM_KEYS: ItemKey[] = ['businessHours', 'holiday', 'photos', 'news', 'reviewReply'];

export type Recurrence = 'oneTime' | 'recurring';

export interface Store {
  id: string;
  name: string;
  sourceInput: unknown;
}

export interface DiagnosisItem {
  itemKey: ItemKey;
  status: 'pass' | 'fail';
  recurrence: Recurrence;
  resolvedAt: string | null;
}

export interface Diagnosis {
  id: string;
  storeId: string;
  createdAt: string;
  status: 'running' | 'done';
  items: DiagnosisItem[];
}

export interface DiagnosisContent {
  itemKey: ItemKey;
  problemText: string;
  reasonText: string;
  todoText: string;
  ctaLabel: string;
  completionText: string;
}

export interface Case {
  itemKey: ItemKey;
  body: string;
  isMock: boolean;
}

export interface ExecutionDraft {
  itemKey: 'news' | 'reviewReply';
  input?: object;
  draft: string;
  accepted: boolean;
}

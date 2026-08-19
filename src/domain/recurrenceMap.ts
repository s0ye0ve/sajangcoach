import type { ItemKey, Recurrence } from './types';

// 일회성/반복형 구분. PRD·카피 확정 문서 기준 (변경 시 이 파일만 수정).
// 영업시간·대표 사진: 등록하면 문제 자체가 사라짐 → 일회성
// 휴무일·새소식·리뷰 답글: 시간이 지나면 다시 문제로 나타남 → 반복형
export const RECURRENCE_MAP: Record<ItemKey, Recurrence> = {
  businessHours: 'oneTime',
  holiday: 'recurring',
  photos: 'oneTime',
  news: 'recurring',
  reviewReply: 'recurring',
};

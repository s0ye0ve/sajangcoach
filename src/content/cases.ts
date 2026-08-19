// 사례 데이터 — 전부 mock. 실제 헬스장 이름·문구·수치를 지어내지 않는다 (결정사항 §2).
// 실제 사례가 들어오면 이 파일의 값만 교체한다.

import type { Case, ItemKey } from '../domain/types';

const PLACEHOLDER_BODY = '실제 사례를 준비하고 있어요.';

export const CASES: Record<ItemKey, Case> = {
  businessHours: { itemKey: 'businessHours', body: PLACEHOLDER_BODY, isMock: true },
  holiday: { itemKey: 'holiday', body: PLACEHOLDER_BODY, isMock: true },
  photos: { itemKey: 'photos', body: PLACEHOLDER_BODY, isMock: true },
  news: { itemKey: 'news', body: PLACEHOLDER_BODY, isMock: true },
  reviewReply: { itemKey: 'reviewReply', body: PLACEHOLDER_BODY, isMock: true },
};

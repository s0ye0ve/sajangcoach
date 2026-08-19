// 우선순위 정렬 — 교체 가능한 단일 함수로 격리.
// 기준이 확정되지 않았으므로 이 파일의 순서는 "임시값"이다 (provisionalPriority).
// 최종 기준이 정해지면 이 파일만 교체하면 된다. 다른 코드는 이 순서를 직접 알지 못한다.

import type { DiagnosisItem, ItemKey } from './types';

// 개발용 임시 순서: 영업시간 → 휴무일 → 대표 사진 → 새소식 → 리뷰 답글
const PROVISIONAL_ORDER: ItemKey[] = ['businessHours', 'holiday', 'photos', 'news', 'reviewReply'];

export function provisionalPriority(items: DiagnosisItem[]): DiagnosisItem[] {
  return [...items].sort(
    (a, b) => PROVISIONAL_ORDER.indexOf(a.itemKey) - PROVISIONAL_ORDER.indexOf(b.itemKey),
  );
}

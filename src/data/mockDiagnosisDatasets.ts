// Mock 진단 결과 데이터셋. MVP_구현스펙.md §8: "5개 항목의 pass/fail을 수동으로 지정한
// 고정 데이터셋 몇 벌(전부 fail / 일부 fail / 전부 pass)".
// 실제 캡처 분석이 들어오면 이 파일은 diagnosisRules.ts의 mock 분기와 함께 교체된다.

import { ITEM_KEYS, type DiagnosisItem } from '../domain/types';
import { RECURRENCE_MAP } from '../domain/recurrenceMap';

export type MockDatasetKey = 'allFail' | 'partialFail' | 'allPass';

export const MOCK_DATASET_LABELS: Record<MockDatasetKey, string> = {
  allFail: '전부 문제 있음',
  partialFail: '일부만 문제 있음',
  allPass: '전부 문제 없음',
};

function buildItems(failKeys: Set<string>): DiagnosisItem[] {
  return ITEM_KEYS.map((itemKey) => ({
    itemKey,
    status: failKeys.has(itemKey) ? 'fail' : 'pass',
    recurrence: RECURRENCE_MAP[itemKey],
    resolvedAt: null,
  }));
}

export const MOCK_DIAGNOSIS_DATASETS: Record<MockDatasetKey, DiagnosisItem[]> = {
  allFail: buildItems(new Set(ITEM_KEYS)),
  partialFail: buildItems(new Set(['holiday', 'photos', 'reviewReply'])),
  allPass: buildItems(new Set()),
};

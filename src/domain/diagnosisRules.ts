// 판정 규칙 — 교체 가능한 단일 모듈로 격리.
// 지금은 실제 캡처 분석이 없으므로, 미리 지정된 mock 데이터셋 중 하나를 반환한다.
// 실제 판정 기준이 정해지면 이 파일의 내부 구현만 교체하면 된다.
// 다른 코드(화면, 상태 관리)는 이 판정 규칙을 직접 알지 못한다.

import type { DiagnosisItem } from './types';
import { MOCK_DIAGNOSIS_DATASETS, type MockDatasetKey } from '../data/mockDiagnosisDatasets';

// 실제 이미지 분석을 개발할 때 비교용으로 남겨 둔 mock 판정 함수.
// 앱 흐름은 api/diagnose.js의 실제 분석 결과를 사용한다.
export function judgeMockDiagnosisItems(datasetKey: MockDatasetKey): DiagnosisItem[] {
  return MOCK_DIAGNOSIS_DATASETS[datasetKey].map((item) => ({ ...item }));
}

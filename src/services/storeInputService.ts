// 가게 정보 입력 — 캡처 업로드 방식 (결정사항 §1).
// Phase 1~2는 실제 캡처 분석을 하지 않는다. 업로드된 파일은 보관만 하고,
// 판정은 diagnosisRules.ts의 mock 분기가 담당한다.
// 이후 실제 진단 데이터 수집 방식(예: 캡처 OCR/분석)으로 교체할 때는 이 파일만 바꾸면 된다.

import type { Store } from '../domain/types';
import type { MockDatasetKey } from '../data/mockDiagnosisDatasets';

export interface StoreCaptureInput {
  type: 'captureUpload';
  fileName: string | null;
  datasetKey: MockDatasetKey;
}

export interface StoreInputService {
  submitCapture(input: StoreCaptureInput): Promise<Store>;
}

const MOCK_STORE_NAME = '테스트 헬스장';

export const mockStoreInputService: StoreInputService = {
  async submitCapture(input) {
    return {
      id: `store-${Date.now()}`,
      name: MOCK_STORE_NAME,
      sourceInput: input,
    };
  },
};

import type { Diagnosis, Store } from '../domain/types';
import type { StoreCaptureInput } from './storeInputService';
import { judgeMockDiagnosisItems } from '../domain/diagnosisRules';

export interface DiagnosisService {
  runDiagnosis(store: Store): Promise<Diagnosis>;
}

export const diagnosisService: DiagnosisService = {
  async runDiagnosis(store) {
    // 실제 이미지 분석이 연결되기 전 MVP는 고정 mock 결과로 전체 흐름을 검증한다.
    const input = store.sourceInput as StoreCaptureInput;
    const items = judgeMockDiagnosisItems(input.captures.length > 0 ? 'partialFail' : 'allPass');
    return {
      id: `diagnosis-${Date.now()}`,
      storeId: store.id,
      createdAt: new Date().toISOString(),
      status: 'done',
      items,
    };
  },
};

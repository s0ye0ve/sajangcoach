import type { Diagnosis, Store } from '../domain/types';
import { judgeDiagnosisItems } from '../domain/diagnosisRules';
import type { StoreCaptureInput } from './storeInputService';

export interface DiagnosisService {
  runDiagnosis(store: Store): Promise<Diagnosis>;
}

export const mockDiagnosisService: DiagnosisService = {
  async runDiagnosis(store) {
    const items = judgeDiagnosisItems(store.sourceInput as StoreCaptureInput);
    return {
      id: `diagnosis-${Date.now()}`,
      storeId: store.id,
      createdAt: new Date().toISOString(),
      status: 'done',
      items,
    };
  },
};

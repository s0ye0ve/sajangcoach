import type { Diagnosis, Store } from '../domain/types';
import type { StoreCaptureInput } from './storeInputService';

export interface DiagnosisService {
  runDiagnosis(store: Store): Promise<Diagnosis>;
}

export const diagnosisService: DiagnosisService = {
  async runDiagnosis(store) {
    const input = store.sourceInput as StoreCaptureInput;
    const response = await fetch('/api/diagnose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storeName: input.storeName, captures: input.captures }),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(body?.error ?? '이미지 분석을 시작하지 못했어요.');
    }

    const result = (await response.json()) as { items: Diagnosis['items'] };
    return {
      id: `diagnosis-${Date.now()}`,
      storeId: store.id,
      createdAt: new Date().toISOString(),
      status: 'done',
      items: result.items,
    };
  },
};

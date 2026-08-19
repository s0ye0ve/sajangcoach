import type { Diagnosis, DiagnosisItem } from './types';

// fail 항목만 선별. 판정 자체의 기준은 여기 없다 — diagnosisRules 모듈의 책임.
export function selectFailedItems(diagnosis: Diagnosis): DiagnosisItem[] {
  return diagnosis.items.filter((item) => item.status === 'fail');
}

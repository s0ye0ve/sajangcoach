import { useCallback, useState } from 'react';
import type { Diagnosis, DiagnosisItem, ExecutionDraft, ItemKey, Store } from '../domain/types';
import { selectFailedItems } from '../domain/selectFailedItems';
import { provisionalPriority } from '../domain/provisionalPriority';
import { mockStoreInputService, type StoreCaptureInput } from '../services/storeInputService';
import { mockDiagnosisService } from '../services/diagnosisService';

export type Screen = 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6' | 'S7';

interface FlowState {
  screen: Screen;
  store: Store | null;
  diagnosis: Diagnosis | null;
  queue: DiagnosisItem[];
  currentIndex: number;
  drafts: Partial<Record<ItemKey, ExecutionDraft>>;
}

const initialState: FlowState = {
  screen: 'S1',
  store: null,
  diagnosis: null,
  queue: [],
  currentIndex: 0,
  drafts: {},
};

export function useDiagnosisFlow() {
  const [state, setState] = useState<FlowState>(initialState);

  const start = useCallback(() => {
    setState((prev) => ({ ...prev, screen: 'S2' }));
  }, []);

  const submitCapture = useCallback(async (input: StoreCaptureInput) => {
    const store = await mockStoreInputService.submitCapture(input);
    setState((prev) => ({ ...prev, store, screen: 'S3' }));

    // 진단 진행 화면을 사용자가 인지할 수 있도록 최소한의 지연을 둔다 (연출용, 판정 로직과 무관)
    await new Promise((resolve) => setTimeout(resolve, 700));
    const diagnosis = await mockDiagnosisService.runDiagnosis(store);
    const failed = selectFailedItems(diagnosis);
    const queue = provisionalPriority(failed);

    setState((prev) => ({
      ...prev,
      diagnosis,
      queue,
      currentIndex: 0,
      screen: queue.length > 0 ? 'S4' : 'S7',
    }));
  }, []);

  const pressCta = useCallback(() => {
    setState((prev) => ({ ...prev, screen: 'S5' }));
  }, []);

  const skipItem = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.currentIndex + 1;
      const hasNext = nextIndex < prev.queue.length;
      return { ...prev, currentIndex: nextIndex, screen: hasNext ? 'S4' : 'S7' };
    });
  }, []);

  const confirmSupport = useCallback((draft?: ExecutionDraft) => {
    setState((prev) => {
      const current = prev.queue[prev.currentIndex];
      const resolvedItem: DiagnosisItem = { ...current, resolvedAt: new Date().toISOString() };
      const queue = prev.queue.map((item, idx) => (idx === prev.currentIndex ? resolvedItem : item));
      const drafts = draft ? { ...prev.drafts, [draft.itemKey]: draft } : prev.drafts;
      return { ...prev, queue, drafts, screen: 'S6' };
    });
  }, []);

  const goNext = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.currentIndex + 1;
      const hasNext = nextIndex < prev.queue.length;
      return { ...prev, currentIndex: nextIndex, screen: hasNext ? 'S4' : 'S7' };
    });
  }, []);

  const currentItem = state.queue[state.currentIndex] ?? null;

  return {
    state,
    currentItem,
    start,
    submitCapture,
    pressCta,
    skipItem,
    confirmSupport,
    goNext,
  };
}

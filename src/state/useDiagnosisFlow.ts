import { useCallback, useState } from 'react';
import type { CaptureImage, Diagnosis, DiagnosisItem, ExecutionDraft, ItemKey, Store } from '../domain/types';
import { selectFailedItems } from '../domain/selectFailedItems';
import { provisionalPriority } from '../domain/provisionalPriority';
import { mockStoreInputService, type StoreCaptureInput } from '../services/storeInputService';
import { diagnosisService } from '../services/diagnosisService';

export type Screen = 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6' | 'S7' | 'S8';
export type OnboardingStep = 1 | 2 | 3 | 4;

export interface OnboardingState {
  step: OnboardingStep;
  gymName: string;
  captures: CaptureImage[];
}

interface FlowState {
  screen: Screen;
  store: Store | null;
  diagnosis: Diagnosis | null;
  queue: DiagnosisItem[];
  currentIndex: number;
  drafts: Partial<Record<ItemKey, ExecutionDraft>>;
  error: string | null;
  onboarding: OnboardingState;
}

const initialState: FlowState = {
  screen: 'S1',
  store: null,
  diagnosis: null,
  queue: [],
  currentIndex: 0,
  drafts: {},
  error: null,
  onboarding: { step: 1, gymName: '', captures: [] },
};

export function useDiagnosisFlow() {
  const [state, setState] = useState<FlowState>(initialState);

  const start = useCallback(() => {
    setState((prev) => ({ ...prev, screen: 'S2', error: null }));
  }, []);

  const updateOnboarding = useCallback((update: Partial<OnboardingState>) => {
    setState((prev) => ({ ...prev, onboarding: { ...prev.onboarding, ...update }, error: null }));
  }, []);

  const submitCapture = useCallback(async (input: StoreCaptureInput) => {
    const store = await mockStoreInputService.submitCapture(input);
    setState((prev) => ({ ...prev, store, screen: 'S3', error: null }));

    // 진단 진행 화면을 사용자가 인지할 수 있도록 최소한의 지연을 둔다 (연출용, 판정 로직과 무관)
    await new Promise((resolve) => setTimeout(resolve, 700));
    try {
      const diagnosis = await diagnosisService.runDiagnosis(store);
      const failed = selectFailedItems(diagnosis);
      const queue = provisionalPriority(failed);

      setState((prev) => ({
        ...prev,
        diagnosis,
        queue,
        currentIndex: 0,
        screen: queue.length > 0 ? 'S4' : 'S7',
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : '이미지 분석을 시작하지 못했어요.';
      setState((prev) => ({ ...prev, screen: 'S2', error: message }));
    }
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

  // 실제 후속 서비스가 정해지면 S8 대신 해당 서비스 진입 상태로 교체한다.
  const openDetailedAnalysis = useCallback(() => {
    setState((prev) => ({ ...prev, screen: 'S8' }));
  }, []);

  const returnToComplete = useCallback(() => {
    setState((prev) => ({ ...prev, screen: 'S7' }));
  }, []);

  const currentItem = state.queue[state.currentIndex] ?? null;

  return {
    state,
    currentItem,
    updateOnboarding,
    start,
    submitCapture,
    pressCta,
    skipItem,
    confirmSupport,
    goNext,
    openDetailedAnalysis,
    returnToComplete,
  };
}

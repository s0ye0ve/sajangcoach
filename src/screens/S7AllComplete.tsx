import { useEffect, useState } from 'react';
import type { DiagnosisItem } from '../domain/types';
import { DIAGNOSIS_CONTENT } from '../content/diagnosisContent';
import { CompletionCheck } from '../components/CompletionCheck';

const ANALYSIS_PREVIEW_IMAGES = [
  '/follow-up-analysis/place-overview-1.jpeg',
  '/follow-up-analysis/place-overview-2.jpeg',
  '/follow-up-analysis/place-overview-3.jpeg',
];

interface Props {
  queue: DiagnosisItem[];
  onOpenDetailedAnalysis: () => void;
}

export function S7AllComplete({ queue, onOpenDetailedAnalysis }: Props) {
  const resolved = queue.filter((item) => item.resolvedAt !== null);
  const unresolved = queue.filter((item) => item.resolvedAt === null);
  const recurringResolved = resolved.filter((item) => item.recurrence === 'recurring');
  const isEmpty = queue.length === 0;
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    if (isEmpty) return;

    const sheetTimer = window.setTimeout(() => setIsSheetOpen(true), 2000);
    return () => window.clearTimeout(sheetTimer);
  }, [isEmpty]);

  useEffect(() => {
    if (!isSheetOpen) return;

    const previewTimer = window.setInterval(() => {
      setPreviewIndex((current) => (current + 1) % ANALYSIS_PREVIEW_IMAGES.length);
    }, 2600);
    return () => window.clearInterval(previewTimer);
  }, [isSheetOpen]);

  const previousPreview = (previewIndex + ANALYSIS_PREVIEW_IMAGES.length - 1) % ANALYSIS_PREVIEW_IMAGES.length;
  const nextPreview = (previewIndex + 1) % ANALYSIS_PREVIEW_IMAGES.length;

  return (
    <div className="screen all-complete-screen">
      <header className="all-complete-hero">
        {!isEmpty && <CompletionCheck />}
        <p className="todo-text all-complete-title">
          {isEmpty ? '지금은 처리할 항목이 없어요' : '오늘 할 수 있는 건 다 했어요'}
        </p>
      </header>

      <div className="all-complete-summary">
      {resolved.length > 0 && (
        <>
          <div className="section-heading">오늘 처리한 항목</div>
          <ul className="summary-list">
            {resolved.map((item) => (
              <li key={item.itemKey}>{DIAGNOSIS_CONTENT[item.itemKey].completionText}</li>
            ))}
          </ul>
        </>
      )}

      {unresolved.length > 0 && (
        <>
          <div className="section-heading">아직 처리하지 않은 항목</div>
          <ul className="summary-list">
            {unresolved.map((item) => (
              <li key={item.itemKey}>{DIAGNOSIS_CONTENT[item.itemKey].todoText}</li>
            ))}
          </ul>
        </>
      )}

      {recurringResolved.length > 0 && (
        <>
          <div className="section-heading">앞으로 계속 챙길 일</div>
          <ul className="summary-list">
            {recurringResolved.map((item) => (
              <li key={item.itemKey}>
                {DIAGNOSIS_CONTENT[item.itemKey].todoText}
                <span className="badge">반복</span>
              </li>
            ))}
          </ul>
        </>
      )}
      </div>

      {isSheetOpen && (
        <section className="follow-up-sheet" aria-labelledby="follow-up-title">
          <div className="follow-up-sheet-handle" aria-hidden="true" />
          <h2 id="follow-up-title">우리 헬스장,<br />더 자세히 보고 싶나요?</h2>
          <p>
            지금은 바로 고칠 수 있는 부분을 중심으로 확인했어요.<br />
            더 자세한 분석에서는 플레이스 전체 상태와<br />
            개선할 부분을 더 깊게 확인할 수 있어요.
          </p>
          <div className="analysis-preview-carousel" aria-label="더 자세한 분석 예시">
            <img className="analysis-preview-side" src={ANALYSIS_PREVIEW_IMAGES[previousPreview]} alt="" />
            <img
              className="analysis-preview-main"
              key={ANALYSIS_PREVIEW_IMAGES[previewIndex]}
              src={ANALYSIS_PREVIEW_IMAGES[previewIndex]}
              alt={`더 자세한 분석 예시 ${previewIndex + 1}`}
            />
            <img className="analysis-preview-side" src={ANALYSIS_PREVIEW_IMAGES[nextPreview]} alt="" />
          </div>
          <button className="btn-primary" type="button" onClick={onOpenDetailedAnalysis}>
            더 자세히 분석하기
          </button>
          <button className="follow-up-dismiss" type="button" onClick={() => setIsSheetOpen(false)}>
            지금은 괜찮아요
          </button>
        </section>
      )}
    </div>
  );
}

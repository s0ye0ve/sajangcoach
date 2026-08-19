import type { DiagnosisItem } from '../domain/types';
import { DIAGNOSIS_CONTENT, SCREEN_LABELS } from '../content/diagnosisContent';
import { CASES } from '../content/cases';

interface Props {
  item: DiagnosisItem;
  index: number;
  total: number;
  onCta: () => void;
  onSkip: () => void;
}

// 5개 항목 공통 컴포넌트. 항목별로 달라지는 건 DiagnosisContent/Case 데이터뿐이다.
export function S4DiagnosisResult({ item, index, total, onCta, onSkip }: Props) {
  const content = DIAGNOSIS_CONTENT[item.itemKey];
  const caseData = CASES[item.itemKey];

  return (
    <div className="screen">
      <div className="progress">
        {total}개 중 {index + 1}번째
      </div>
      <div className="result-heading">{SCREEN_LABELS.resultHeading}</div>

      <p className="problem-text">{content.problemText}</p>
      <p className="reason-text">{content.reasonText}</p>

      <hr className="divider" />

      <div className="section-heading">{SCREEN_LABELS.caseHeading}</div>
      <div className="case-box">{caseData.body}</div>

      <hr className="divider" />

      <div className="section-heading">{SCREEN_LABELS.todoHeading}</div>
      <p className="todo-text">{content.todoText}</p>

      <div className="spacer" />
      <button className="btn-primary" onClick={onCta}>
        {content.ctaLabel}
      </button>
      <button className="btn-secondary" onClick={onSkip}>
        {SCREEN_LABELS.skipLabel}
      </button>
    </div>
  );
}

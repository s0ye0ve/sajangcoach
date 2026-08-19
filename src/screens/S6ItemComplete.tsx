import type { DiagnosisItem } from '../domain/types';
import { DIAGNOSIS_CONTENT } from '../content/diagnosisContent';

interface Props {
  item: DiagnosisItem;
  onNext: () => void;
}

export function S6ItemComplete({ item, onNext }: Props) {
  const content = DIAGNOSIS_CONTENT[item.itemKey];

  return (
    <div className="screen">
      <div className="center-column">
        <p className="todo-text" style={{ fontSize: 23 }}>
          {content.completionText}
        </p>
      </div>
      <button className="btn-primary" onClick={onNext}>
        다음으로
      </button>
    </div>
  );
}

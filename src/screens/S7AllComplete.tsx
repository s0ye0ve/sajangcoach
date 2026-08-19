import type { DiagnosisItem } from '../domain/types';
import { DIAGNOSIS_CONTENT } from '../content/diagnosisContent';

interface Props {
  queue: DiagnosisItem[];
}

export function S7AllComplete({ queue }: Props) {
  const resolved = queue.filter((item) => item.resolvedAt !== null);
  const unresolved = queue.filter((item) => item.resolvedAt === null);
  const recurringResolved = resolved.filter((item) => item.recurrence === 'recurring');

  const isEmpty = queue.length === 0;

  return (
    <div className="screen">
      <p className="todo-text" style={{ fontSize: 20, marginBottom: 24 }}>
        {isEmpty ? '지금은 처리할 항목이 없어요' : '오늘 할 수 있는 건 다 했어요'}
      </p>

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
  );
}

import { useState } from 'react';
import type { ExecutionDraft } from '../../domain/types';
import { NEWS_CATEGORIES } from '../../content/executionSupportContent';
import { mockAiDraftService } from '../../services/aiDraftService';

interface Props {
  onConfirm: (draft: ExecutionDraft) => void;
}

// 새소식 작성 지원: 카테고리 선택 → (선택) 한 줄 입력 → AI 초안 → 확인/재생성 (§6, §7)
export function NewsDraftSupport({ onConfirm }: Props) {
  const [category, setCategory] = useState<string>(NEWS_CATEGORIES[0]);
  const [note, setNote] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await mockAiDraftService.generateNewsDraft({ category, note: note || undefined });
      setDraft(result);
      setHasGenerated(true);
    } catch {
      setError('초안 생성에 실패했어요. 직접 입력해도 괜찮아요.');
      setHasGenerated(true);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!draft.trim()) return;
    onConfirm({ itemKey: 'news', input: { category, note }, draft, accepted: true });
  };

  return (
    <div className="screen">
      <div className="section-heading">어떤 소식인가요?</div>
      <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
        {NEWS_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <div className="field-label">한 줄로 적어주면 더 좋아요 (선택)</div>
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="예: 이번 주 토요일 휴무예요"
      />

      {!hasGenerated && (
        <>
          <div className="spacer" />
          <button className="btn-primary" onClick={generate} disabled={loading}>
            {loading ? '만드는 중...' : '초안 만들기'}
          </button>
        </>
      )}

      {error && <p className="error-text">{error}</p>}

      {hasGenerated && (
        <>
          <div className="field-label">초안 (수정할 수 있어요)</div>
          <textarea
            className="textarea"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className="spacer" />
          <button className="btn-outline" onClick={generate} disabled={loading}>
            {loading ? '다시 만드는 중...' : '다시 만들기'}
          </button>
          <button className="btn-primary" style={{ marginTop: 10 }} onClick={handleConfirm}>
            확정하고 다음으로
          </button>
        </>
      )}
    </div>
  );
}
